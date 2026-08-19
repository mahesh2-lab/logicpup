import type {
  LanguageGenerator,
  GeneratorResult,
  ProgramASTNode,
  StatementASTNode,
  ExpressionASTNode,
} from "../../ast/types";

// ─────────────────────────────────────────────────────────────────────────────
// Python Code Generator
// Implements LanguageGenerator — the visual editor never imports this directly.
// ─────────────────────────────────────────────────────────────────────────────

export class PythonGenerator implements LanguageGenerator {
  readonly name = "Python";
  readonly fileExtension = "py";

  generate(ast: ProgramASTNode): GeneratorResult {
    const lines: string[] = [];
    const nodeLineMap = new Map<string, number>();

    emitStatements(ast.body, 0, lines, nodeLineMap);

    return {
      code: lines.join("\n"),
      nodeLineMap,
    };
  }
}

export const pythonGenerator = new PythonGenerator();

// ── Internal helpers ──────────────────────────────────────────────────────────

const INDENT = "    ";

function indent(level: number): string {
  return INDENT.repeat(level);
}

function recordLine(nodeId: string | undefined, lines: string[], map: Map<string, number>) {
  if (nodeId) map.set(nodeId, lines.length + 1); // 1-indexed
}

function emitStatements(
  stmts: StatementASTNode[],
  level: number,
  lines: string[],
  map: Map<string, number>
) {
  for (const stmt of stmts) {
    emitStatement(stmt, level, lines, map);
  }
}

function emitStatement(
  stmt: StatementASTNode,
  level: number,
  lines: string[],
  map: Map<string, number>
) {
  const pad = indent(level);

  switch (stmt.type) {
    case "set_variable":
      recordLine(stmt.nodeId, lines, map);
      lines.push(`${pad}${stmt.name} = ${emitExpression(stmt.value)}`);
      break;

    case "change_variable":
      recordLine(stmt.nodeId, lines, map);
      lines.push(`${pad}${stmt.name} += ${emitExpression(stmt.delta)}`);
      break;

    case "print":
      recordLine(stmt.nodeId, lines, map);
      lines.push(`${pad}print(${emitExpression(stmt.value)})`);
      break;

    case "ask_input":
      recordLine(stmt.nodeId, lines, map);
      lines.push(`${pad}${stmt.variableName} = input(${emitExpression(stmt.prompt)})`);
      break;

    case "if":
      recordLine(stmt.nodeId, lines, map);
      lines.push(`${pad}if ${emitExpression(stmt.condition)}:`);
      if (stmt.body.length > 0) {
        emitStatements(stmt.body, level + 1, lines, map);
      } else {
        lines.push(`${pad}${INDENT}pass`);
      }
      break;

    case "if_else":
      recordLine(stmt.nodeId, lines, map);
      lines.push(`${pad}if ${emitExpression(stmt.condition)}:`);
      if (stmt.consequent.length > 0) {
        emitStatements(stmt.consequent, level + 1, lines, map);
      } else {
        lines.push(`${pad}${INDENT}pass`);
      }
      lines.push(`${pad}else:`);
      if (stmt.alternate.length > 0) {
        emitStatements(stmt.alternate, level + 1, lines, map);
      } else {
        lines.push(`${pad}${INDENT}pass`);
      }
      break;

    case "repeat":
      recordLine(stmt.nodeId, lines, map);
      lines.push(`${pad}for _ in range(${emitExpression(stmt.count)}):`);
      if (stmt.body.length > 0) {
        emitStatements(stmt.body, level + 1, lines, map);
      } else {
        lines.push(`${pad}${INDENT}pass`);
      }
      break;

    case "while":
      recordLine(stmt.nodeId, lines, map);
      lines.push(`${pad}while ${emitExpression(stmt.condition)}:`);
      if (stmt.body.length > 0) {
        emitStatements(stmt.body, level + 1, lines, map);
      } else {
        lines.push(`${pad}${INDENT}pass`);
      }
      break;

    case "for_each":
      recordLine(stmt.nodeId, lines, map);
      lines.push(
        `${pad}for ${stmt.variable} in ${emitExpression(stmt.iterable)}:`
      );
      if (stmt.body.length > 0) {
        emitStatements(stmt.body, level + 1, lines, map);
      } else {
        lines.push(`${pad}${INDENT}pass`);
      }
      break;

    case "define_function": {
      recordLine(stmt.nodeId, lines, map);
      const params = stmt.params.join(", ");
      if (lines.length > 0 && lines[lines.length - 1] !== "") lines.push(""); // blank line before def
      lines.push(`${pad}def ${stmt.name}(${params}):`);
      if (stmt.body.length > 0) {
        emitStatements(stmt.body, level + 1, lines, map);
      } else {
        lines.push(`${pad}${INDENT}pass`);
      }
      lines.push(""); // blank line after def
      break;
    }

    case "call_function": {
      recordLine(stmt.nodeId, lines, map);
      const args = stmt.args.map(emitExpression).join(", ");
      lines.push(`${pad}${stmt.name}(${args})`);
      break;
    }

    case "return":
      recordLine(stmt.nodeId, lines, map);
      if (stmt.value) {
        lines.push(`${pad}return ${emitExpression(stmt.value)}`);
      } else {
        lines.push(`${pad}return`);
      }
      break;

    case "list_add":
      recordLine(stmt.nodeId, lines, map);
      lines.push(`${pad}${stmt.list}.append(${emitExpression(stmt.value)})`);
      break;

    case "unknown":
      lines.push(`${pad}# (unknown block)`);
      break;
  }
}

function emitExpression(expr: ExpressionASTNode): string {
  switch (expr.type) {
    case "number_literal":
      return String(expr.value);

    case "string_literal":
      return JSON.stringify(expr.value);

    case "boolean_literal":
      return expr.value ? "True" : "False";

    case "variable_ref":
      return expr.name;

    case "binary_op": {
      const l = maybeParenExpr(expr.left, expr.operator);
      const r = maybeParenExpr(expr.right, expr.operator);
      const op = expr.operator === "and" || expr.operator === "or"
        ? ` ${expr.operator} `
        : ` ${expr.operator} `;
      return `${l}${op}${r}`;
    }

    case "unary_op":
      if (expr.operator === "not") return `not ${emitExpression(expr.operand)}`;
      return `-${emitExpression(expr.operand)}`;

    case "comparison": {
      const l = emitExpression(expr.left);
      const r = emitExpression(expr.right);
      return `${l} ${expr.operator} ${r}`;
    }

    case "list_literal":
      return `[${expr.elements.map(emitExpression).join(", ")}]`;

    case "list_get":
      return `${expr.list}[${emitExpression(expr.index)}]`;

    case "call_function": {
      const args = expr.args.map(emitExpression).join(", ");
      return `${expr.name}(${args})`;
    }

    case "unknown":
      return "None";
  }
}

const PRECEDENCE: Record<string, number> = {
  or: 1,
  and: 2,
  "+": 4,
  "-": 4,
  "*": 5,
  "/": 5,
  "%": 5,
};

function maybeParenExpr(
  expr: ExpressionASTNode,
  parentOp: string
): string {
  const raw = emitExpression(expr);
  if (expr.type === "binary_op") {
    const childPrec = PRECEDENCE[expr.operator] ?? 3;
    const parentPrec = PRECEDENCE[parentOp] ?? 3;
    if (childPrec < parentPrec) return `(${raw})`;
  }
  return raw;
}
