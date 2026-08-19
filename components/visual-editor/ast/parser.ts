import type { Node, Edge } from "@xyflow/react";
import type {
  BlockNodeData,
  ProgramASTNode,
  StatementASTNode,
  ExpressionASTNode,
  Program,
  ParseError,
} from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// AST Parser: React Flow nodes + edges → ProgramAST
// ─────────────────────────────────────────────────────────────────────────────

type RFNode = Node<BlockNodeData>;
type RFEdge = Edge;

export function parseProgram(nodes: RFNode[], edges: RFEdge[]): Program {
  const errors: ParseError[] = [];
  const nodeLineMap = new Map<string, number>();

  // Build adjacency maps
  const nodeById = new Map<string, RFNode>();
  for (const n of nodes) nodeById.set(n.id, n);

  // Flow edges: sourceHandle "flow-out" → targetHandle "flow-in"
  const flowNext = new Map<string, string>(); // nodeId → next nodeId
  const flowPrev = new Map<string, string>(); // nodeId → prev nodeId
  // Branch edges for if/else and loop bodies
  const branchEdges = new Map<string, { handle: string; target: string }[]>();

  for (const e of edges) {
    const sh = e.sourceHandle ?? "";
    const th = e.targetHandle ?? "";

    if (sh === "flow-out" && th === "flow-in") {
      flowNext.set(e.source, e.target);
      flowPrev.set(e.target, e.source);
    } else if (
      sh.startsWith("branch-") ||
      sh === "body-out" ||
      sh === "loop-out" ||
      sh === "true-out" ||
      sh === "false-out"
    ) {
      const list = branchEdges.get(e.source) ?? [];
      list.push({ handle: sh, target: e.target });
      branchEdges.set(e.source, list);
    }
  }

  // Expression edges: value inputs
  // sourceHandle "expr-out" → targetHandle starts with "val-" or "cond-" etc.
  const exprEdges = new Map<string, Map<string, string>>(); // targetId → handleId → sourceId
  for (const e of edges) {
    const th = e.targetHandle ?? "";
    if (
      th.startsWith("val-") ||
      th.startsWith("cond-") ||
      th.startsWith("left-") ||
      th.startsWith("right-") ||
      th.startsWith("arg-")
    ) {
      if (!exprEdges.has(e.target)) exprEdges.set(e.target, new Map());
      exprEdges.get(e.target)!.set(th, e.source);
    }
  }

  // Collect all defined variables across the canvas
  const definedVars = new Set<string>();
  for (const n of nodes) {
    const vals = n.data.values as Record<string, unknown> | undefined;
    if (!vals) continue;
    if (typeof vals.name === "string" && vals.name.trim()) definedVars.add(vals.name.trim());
    if (typeof vals.variableName === "string" && vals.variableName.trim()) definedVars.add(vals.variableName.trim());
    if (typeof vals.variable === "string" && vals.variable.trim()) definedVars.add(vals.variable.trim());
    if (typeof vals.target === "string" && vals.target.trim()) definedVars.add(vals.target.trim());
  }

  // Find start node
  const startNode = nodes.find((n) => n.data.blockType === "start");
  if (!startNode) {
    return {
      ast: { type: "program", body: [] },
      errors: [{ message: "No Start block found", severity: "error" }],
      nodeLineMap,
    };
  }

  // Walk the flow chain starting from Start
  const body = walkFlowChain(
    startNode.id,
    nodeById,
    flowNext,
    branchEdges,
    exprEdges,
    errors,
    new Set(),
    definedVars
  );

  return {
    ast: { type: "program", body },
    errors,
    nodeLineMap,
  };
}

function walkFlowChain(
  startId: string,
  nodeById: Map<string, Node<BlockNodeData>>,
  flowNext: Map<string, string>,
  branchEdges: Map<string, { handle: string; target: string }[]>,
  exprEdges: Map<string, Map<string, string>>,
  errors: ParseError[],
  visited: Set<string>,
  definedVars: Set<string>
): StatementASTNode[] {
  const statements: StatementASTNode[] = [];
  let currentId: string | undefined = startId;

  while (currentId) {
    if (visited.has(currentId)) break;
    visited.add(currentId);

    const node = nodeById.get(currentId);
    if (!node) break;

    const bt = node.data.blockType;

    // Skip start/end blocks themselves (they are anchors, not statements)
    if (bt === "start" || bt === "end") {
      currentId = flowNext.get(currentId);
      continue;
    }

    const stmt = parseStatement(
      node,
      nodeById,
      flowNext,
      branchEdges,
      exprEdges,
      errors,
      visited,
      definedVars
    );
    if (stmt) statements.push(stmt);

    currentId = flowNext.get(currentId);
  }

  return statements;
}

function parseStatement(
  node: Node<BlockNodeData>,
  nodeById: Map<string, Node<BlockNodeData>>,
  flowNext: Map<string, string>,
  branchEdges: Map<string, { handle: string; target: string }[]>,
  exprEdges: Map<string, Map<string, string>>,
  errors: ParseError[],
  visited: Set<string>,
  definedVars: Set<string>
): StatementASTNode | null {
  const { blockType, values } = node.data;
  const id = node.id;

  function getExpr(handleId: string): ExpressionASTNode {
    const exprMap = exprEdges.get(id);
    if (exprMap?.has(handleId)) {
      const srcId = exprMap.get(handleId)!;
      const srcNode = nodeById.get(srcId);
      if (srcNode) return parseExpression(srcNode, exprEdges, nodeById, definedVars);
    }
    // Fall back to inline value
    return parseLiteralFromValues(handleId, values, definedVars);
  }

  // For blocks that store a comparison inline as left/operator/right fields
  function buildInlineCondition(): ExpressionASTNode {
    const left = String(values.left ?? values.a ?? "");
    const op   = String(values.operator ?? "==");
    const right = String(values.right ?? values.b ?? "");

    const validOps = ["==", "!=", ">", "<", ">=", "<="] as const;
    const safeOp = (validOps as readonly string[]).includes(op)
      ? (op as "==" | "!=" | ">" | "<" | ">=" | "<=")
      : "==";

    return {
      type: "comparison",
      left: parseSmartExpression(left, definedVars),
      operator: safeOp,
      right: parseSmartExpression(right, definedVars),
    };
  }

  function getBranchBody(handle: string): StatementASTNode[] {
    const branches = branchEdges.get(id) ?? [];
    const branch = branches.find((b) => b.handle === handle);
    if (!branch) return [];
    return walkFlowChain(
      branch.target,
      nodeById,
      flowNext,
      branchEdges,
      exprEdges,
      errors,
      new Set(visited),
      definedVars
    );
  }

  switch (blockType) {
    case "set_variable":
      return {
        type: "set_variable",
        nodeId: id,
        name: String(values.name ?? "x"),
        value: getExpr("val-value"),
      };

    case "change_variable":
      return {
        type: "change_variable",
        nodeId: id,
        name: String(values.name ?? "x"),
        delta: getExpr("val-delta"),
      };

    case "calculate":
    case "add":
    case "subtract":
    case "multiply":
    case "divide": {
      const targetVar = String(values.target ?? values.name ?? "result");
      const opMap: Record<string, "+" | "-" | "*" | "/" | "%"> = {
        add: "+",
        subtract: "-",
        multiply: "*",
        divide: "/",
        calculate: (values.operator as "+" | "-" | "*" | "/") ?? "+",
      };
      const op = opMap[blockType] ?? "+";
      const leftExpr = getExpr("left-a");
      const rightExpr = getExpr("right-b");
      return {
        type: "set_variable",
        nodeId: id,
        name: targetVar,
        value: {
          type: "binary_op",
          nodeId: id,
          operator: op,
          left: leftExpr,
          right: rightExpr,
        },
      };
    }

    case "print":
      return {
        type: "print",
        nodeId: id,
        value: getExpr("val-message"),
      };

    case "ask_input":
      return {
        type: "ask_input",
        nodeId: id,
        prompt: getExpr("val-prompt"),
        variableName: String(values.variableName ?? "user_input"),
      };

    case "if": {
      const body = getBranchBody("body-out");
      return {
        type: "if",
        nodeId: id,
        condition: buildInlineCondition(),
        body,
      };
    }

    case "if_else": {
      const consequent = getBranchBody("true-out");
      const alternate = getBranchBody("false-out");
      return {
        type: "if_else",
        nodeId: id,
        condition: buildInlineCondition(),
        consequent,
        alternate,
      };
    }

    case "repeat": {
      const body = getBranchBody("body-out");
      return {
        type: "repeat",
        nodeId: id,
        count: getExpr("val-count"),
        body,
      };
    }

    case "while": {
      const body = getBranchBody("body-out");
      return {
        type: "while",
        nodeId: id,
        condition: buildInlineCondition(),
        body,
      };
    }

    case "for_each": {
      const body = getBranchBody("body-out");
      return {
        type: "for_each",
        nodeId: id,
        variable: String(values.variable ?? "item"),
        iterable: getExpr("val-iterable"),
        body,
      };
    }

    case "define_function": {
      const body = getBranchBody("body-out");
      const paramsRaw = String(values.params ?? "");
      const params = paramsRaw
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
      return {
        type: "define_function",
        nodeId: id,
        name: String(values.name ?? "my_function"),
        params,
        body,
      };
    }

    case "call_function":
      return {
        type: "call_function",
        nodeId: id,
        name: String(values.name ?? "my_function"),
        args: [],
      };

    case "return":
      return {
        type: "return",
        nodeId: id,
        value:
          (values.hasValue as boolean)
            ? getExpr("val-value")
            : null,
      };

    case "list_add":
      return {
        type: "list_add",
        nodeId: id,
        list: String(values.list ?? "my_list"),
        value: getExpr("val-value"),
      };

    default:
      errors.push({
        nodeId: id,
        message: `Unknown block type: ${blockType}`,
        severity: "warning",
      });
      return { type: "unknown", nodeId: id };
  }
}

function parseExpression(
  node: Node<BlockNodeData>,
  exprEdges: Map<string, Map<string, string>>,
  nodeById: Map<string, Node<BlockNodeData>>,
  definedVars: Set<string>
): ExpressionASTNode {
  const { blockType, values } = node.data;
  const id = node.id;

  function getSubExpr(handleId: string): ExpressionASTNode {
    const exprMap = exprEdges.get(id);
    if (exprMap?.has(handleId)) {
      const srcId = exprMap.get(handleId)!;
      const srcNode = nodeById.get(srcId);
      if (srcNode) return parseExpression(srcNode, exprEdges, nodeById, definedVars);
    }
    return parseLiteralFromValues(handleId, values, definedVars);
  }

  switch (blockType) {
    case "number_literal":
      return { type: "number_literal", nodeId: id, value: Number(values.value ?? 0) };

    case "string_literal":
      return { type: "string_literal", nodeId: id, value: String(values.value ?? "") };

    case "boolean_literal":
      return { type: "boolean_literal", nodeId: id, value: Boolean(values.value) };

    case "get_variable":
      return { type: "variable_ref", nodeId: id, name: String(values.name ?? "x") };

    case "add":
      return { type: "binary_op", nodeId: id, operator: "+", left: getSubExpr("left-a"), right: getSubExpr("right-b") };

    case "subtract":
      return { type: "binary_op", nodeId: id, operator: "-", left: getSubExpr("left-a"), right: getSubExpr("right-b") };

    case "multiply":
      return { type: "binary_op", nodeId: id, operator: "*", left: getSubExpr("left-a"), right: getSubExpr("right-b") };

    case "divide":
      return { type: "binary_op", nodeId: id, operator: "/", left: getSubExpr("left-a"), right: getSubExpr("right-b") };

    case "modulo":
      return { type: "binary_op", nodeId: id, operator: "%", left: getSubExpr("left-a"), right: getSubExpr("right-b") };

    case "boolean_and":
      return { type: "binary_op", nodeId: id, operator: "and", left: getSubExpr("left-a"), right: getSubExpr("right-b") };

    case "boolean_or":
      return { type: "binary_op", nodeId: id, operator: "or", left: getSubExpr("left-a"), right: getSubExpr("right-b") };

    case "boolean_not":
      return { type: "unary_op", nodeId: id, operator: "not", operand: getSubExpr("val-operand") };

    case "equal":
      return { type: "comparison", nodeId: id, operator: "==", left: getSubExpr("left-a"), right: getSubExpr("right-b") };

    case "not_equal":
      return { type: "comparison", nodeId: id, operator: "!=", left: getSubExpr("left-a"), right: getSubExpr("right-b") };

    case "greater_than":
      return { type: "comparison", nodeId: id, operator: ">", left: getSubExpr("left-a"), right: getSubExpr("right-b") };

    case "less_than":
      return { type: "comparison", nodeId: id, operator: "<", left: getSubExpr("left-a"), right: getSubExpr("right-b") };

    case "greater_equal":
      return { type: "comparison", nodeId: id, operator: ">=", left: getSubExpr("left-a"), right: getSubExpr("right-b") };

    case "less_equal":
      return { type: "comparison", nodeId: id, operator: "<=", left: getSubExpr("left-a"), right: getSubExpr("right-b") };

    case "list_get":
      return {
        type: "list_get",
        nodeId: id,
        list: String(values.list ?? "my_list"),
        index: getSubExpr("val-index"),
      };

    case "call_function":
      return { type: "call_function", nodeId: id, name: String(values.name ?? "my_function"), args: [] };

    default:
      return { type: "unknown", nodeId: id };
  }
}

export function parseSmartExpression(
  rawInput: unknown,
  definedVars?: Set<string>
): ExpressionASTNode {
  const raw = String(rawInput ?? "").trim();
  if (raw === "") return { type: "string_literal", value: "" };

  // Explicit quoted string: "hello" or 'hello'
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    return { type: "string_literal", value: raw.slice(1, -1) };
  }

  // Boolean literals
  if (raw.toLowerCase() === "true") return { type: "boolean_literal", value: true };
  if (raw.toLowerCase() === "false") return { type: "boolean_literal", value: false };

  // Pure Numbers
  const num = Number(raw);
  if (!isNaN(num) && !/^\s*$/.test(raw)) {
    return { type: "number_literal", value: num };
  }

  // Binary math expressions: e.g. "value + value2", "score * 2", "a - b"
  const mathMatch = raw.match(
    /^([a-zA-Z_]\w*|\d+(?:\.\d+)?)\s*([\+\-\*\/%])\s*([a-zA-Z_]\w*|\d+(?:\.\d+)?)$/
  );
  if (mathMatch) {
    const [, leftStr, op, rightStr] = mathMatch;
    return {
      type: "binary_op",
      operator: op as "+" | "-" | "*" | "/" | "%",
      left: parseSmartExpression(leftStr, definedVars),
      right: parseSmartExpression(rightStr, definedVars),
    };
  }

  // If definedVars is provided, only treat as variable_ref if it IS an actual defined variable!
  // e.g. `score` is a defined variable -> variable_ref
  // `yes` or `no` is NOT a defined variable -> string_literal "yes", "no"
  if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(raw)) {
    if (definedVars && definedVars.has(raw)) {
      return { type: "variable_ref", name: raw };
    }
    // If not in defined variables, it's a plain string like "yes", "no", "hello", "game"
    return { type: "string_literal", value: raw };
  }

  // Fallback: normal string message like "Hello, world!"
  return { type: "string_literal", value: raw };
}

function parseLiteralFromValues(
  handleId: string,
  values: Record<string, unknown>,
  definedVars?: Set<string>
): ExpressionASTNode {
  const stripped = handleId.replace(/^(val-|cond-|left-|right-)/, "");
  let raw: unknown = undefined;

  if (handleId.includes("left")) {
    raw = values.left !== undefined ? values.left : (values.a !== undefined ? values.a : values[stripped]);
  } else if (handleId.includes("right")) {
    raw = values.right !== undefined ? values.right : (values.b !== undefined ? values.b : values[stripped]);
  } else if (handleId.includes("target") || handleId.includes("name") || handleId.includes("var")) {
    raw = values.target !== undefined ? values.target : (values.name !== undefined ? values.name : values[stripped]);
  } else {
    raw =
      values[stripped] !== undefined
        ? values[stripped]
        : values[handleId] !== undefined
        ? values[handleId]
        : values.value !== undefined
        ? values.value
        : values.message !== undefined
        ? values.message
        : values.prompt !== undefined
        ? values.prompt
        : values.name !== undefined
        ? values.name
        : values.count;
  }

  if (raw === undefined || raw === null) {
    raw = values[stripped] ?? values.value ?? values.message ?? values.prompt ?? "";
  }

  return parseSmartExpression(raw, definedVars);
}
