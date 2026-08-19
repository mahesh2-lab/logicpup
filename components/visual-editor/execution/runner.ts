import type {
  ProgramASTNode,
  StatementASTNode,
  ExpressionASTNode,
  ExecutionState,
} from "../ast/types";

// ─────────────────────────────────────────────────────────────────────────────
// Mock Python Execution Runner
// Walks the AST and simulates execution. No eval(), no sandboxing issues.
// ─────────────────────────────────────────────────────────────────────────────

const MAX_LOOP_ITERATIONS = 200;

export interface RunResult {
  finalState: ExecutionState;
  steps: Array<{ nodeId: string | undefined; variables: Record<string, unknown> }>;
}

type Env = Record<string, unknown>;

export async function runProgram(
  ast: ProgramASTNode,
  promptHandler?: (nodeId: string, promptText: string, variableName: string) => Promise<string>
): Promise<RunResult> {
  const env: Env = {};
  const output: string[] = [];
  const steps: RunResult["steps"] = [];
  const executedNodeIds: string[] = [];

  try {
    await execStatements(ast.body, env, output, steps, executedNodeIds, promptHandler);
  } catch (e: unknown) {
    if (e instanceof StopExecution) {
      // normal stop
    } else if (e instanceof RuntimeError) {
      return {
        finalState: {
          status: "error",
          output,
          variables: { ...env },
          executingNodeId: null,
          executedNodeIds,
          error: e.message,
        },
        steps,
      };
    }
  }

  return {
    finalState: {
      status: "finished",
      output,
      variables: { ...env },
      executingNodeId: null,
      executedNodeIds,
      error: null,
    },
    steps,
  };
}

// ── Statement Execution ───────────────────────────────────────────────────────

async function execStatements(
  stmts: StatementASTNode[],
  env: Env,
  output: string[],
  steps: RunResult["steps"],
  executedNodeIds: string[],
  promptHandler?: (nodeId: string, promptText: string, variableName: string) => Promise<string>
) {
  for (const stmt of stmts) {
    await execStatement(stmt, env, output, steps, executedNodeIds, promptHandler);
  }
}

async function execStatement(
  stmt: StatementASTNode,
  env: Env,
  output: string[],
  steps: RunResult["steps"],
  executedNodeIds: string[],
  promptHandler?: (nodeId: string, promptText: string, variableName: string) => Promise<string>
) {
  if (stmt.nodeId) executedNodeIds.push(stmt.nodeId);
  steps.push({ nodeId: stmt.nodeId, variables: { ...env } });

  switch (stmt.type) {
    case "set_variable":
      env[stmt.name] = evalExpression(stmt.value, env);
      break;

    case "change_variable": {
      const cur = Number(env[stmt.name] ?? 0);
      const delta = Number(evalExpression(stmt.delta, env) ?? 0);
      env[stmt.name] = cur + delta;
      break;
    }

    case "print": {
      const val = evalExpression(stmt.value, env);
      output.push(stringify(val));
      break;
    }

    case "ask_input": {
      const promptText = stringify(evalExpression(stmt.prompt, env));
      let val = "";
      if (promptHandler && stmt.nodeId) {
        val = await promptHandler(stmt.nodeId, promptText, stmt.variableName);
      } else if (typeof window !== "undefined" && typeof window.prompt === "function") {
        const inputVal = window.prompt(promptText || `Enter value for ${stmt.variableName}:`);
        val = inputVal !== null ? inputVal.trim() : "";
      }
      // If user typed a number, store as number so math (a + b, score > 5) works effortlessly for kids!
      const num = Number(val);
      const finalVal = val !== "" && !isNaN(num) ? num : val;
      output.push(`${promptText ? promptText + " " : ""}${val}`);
      env[stmt.variableName] = finalVal;
      break;
    }

    case "if": {
      const cond = evalExpression(stmt.condition, env);
      if (isTruthy(cond)) {
        await execStatements(stmt.body, env, output, steps, executedNodeIds, promptHandler);
      }
      break;
    }

    case "if_else": {
      const cond = evalExpression(stmt.condition, env);
      if (isTruthy(cond)) {
        await execStatements(stmt.consequent, env, output, steps, executedNodeIds, promptHandler);
      } else {
        await execStatements(stmt.alternate, env, output, steps, executedNodeIds, promptHandler);
      }
      break;
    }

    case "repeat": {
      const count = Number(evalExpression(stmt.count, env) ?? 0);
      for (let i = 0; i < Math.min(count, MAX_LOOP_ITERATIONS); i++) {
        await execStatements(stmt.body, env, output, steps, executedNodeIds, promptHandler);
      }
      break;
    }

    case "while": {
      let iterations = 0;
      while (isTruthy(evalExpression(stmt.condition, env))) {
        if (++iterations > MAX_LOOP_ITERATIONS) {
          throw new RuntimeError("Infinite loop detected — stopped after 200 iterations");
        }
        await execStatements(stmt.body, env, output, steps, executedNodeIds, promptHandler);
      }
      break;
    }

    case "for_each": {
      const list = evalExpression(stmt.iterable, env);
      const arr = Array.isArray(list) ? list : [list];
      for (const item of arr.slice(0, MAX_LOOP_ITERATIONS)) {
        env[stmt.variable] = item;
        await execStatements(stmt.body, env, output, steps, executedNodeIds, promptHandler);
      }
      break;
    }

    case "define_function":
      // Store function body in env under a special key
      env[`__fn_${stmt.name}`] = { params: stmt.params, body: stmt.body };
      break;

    case "call_function": {
      const fn = env[`__fn_${stmt.name}`] as
        | { params: string[]; body: StatementASTNode[] }
        | undefined;
      if (!fn) {
        output.push(`[Error: function '${stmt.name}' is not defined]`);
        break;
      }
      const fnEnv: Env = { ...env };
      await execStatements(fn.body, fnEnv, output, steps, executedNodeIds, promptHandler);
      break;
    }

    case "return":
      throw new StopExecution();

    case "list_add": {
      const list = (env[stmt.list] as unknown[]) ?? [];
      list.push(evalExpression(stmt.value, env));
      env[stmt.list] = list;
      break;
    }

    case "unknown":
      break;
  }
}

// ── Expression Evaluation ─────────────────────────────────────────────────────

function evalExpression(expr: ExpressionASTNode, env: Env): unknown {
  switch (expr.type) {
    case "number_literal":
      return expr.value;

    case "string_literal":
      return expr.value;

    case "boolean_literal":
      return expr.value;

    case "variable_ref": {
      if (expr.name in env) return env[expr.name];
      return 0; // default uninitialized variable
    }

    case "binary_op": {
      const l = evalExpression(expr.left, env);
      const r = evalExpression(expr.right, env);
      const numL = Number(l);
      const numR = Number(r);
      const areBothNumbers =
        !isNaN(numL) &&
        !isNaN(numR) &&
        l !== "" &&
        r !== "" &&
        l !== null &&
        r !== null &&
        typeof l !== "boolean" &&
        typeof r !== "boolean";

      switch (expr.operator) {
        case "+": {
          if (areBothNumbers) return numL + numR;
          return String(l ?? "") + String(r ?? "");
        }
        case "-":
          return (areBothNumbers ? numL : Number(l)) - (areBothNumbers ? numR : Number(r));
        case "*":
          return (areBothNumbers ? numL : Number(l)) * (areBothNumbers ? numR : Number(r));
        case "/": {
          const denom = areBothNumbers ? numR : Number(r);
          return denom !== 0 ? (areBothNumbers ? numL : Number(l)) / denom : 0;
        }
        case "%":
          return (areBothNumbers ? numL : Number(l)) % (areBothNumbers ? numR : Number(r));
        case "and":
          return isTruthy(l) && isTruthy(r);
        case "or":
          return isTruthy(l) || isTruthy(r);
      }
      break;
    }

    case "unary_op": {
      const operand = evalExpression(expr.operand, env);
      if (expr.operator === "not") return !isTruthy(operand);
      if (expr.operator === "-")   return -(operand as number);
      break;
    }

    case "comparison": {
      const l = evalExpression(expr.left, env);
      const r = evalExpression(expr.right, env);
      switch (expr.operator) {
        case "==": return l == r; // intentional loose equality
        case "!=": return l != r;
        case ">":  return (l as number) > (r as number);
        case "<":  return (l as number) < (r as number);
        case ">=": return (l as number) >= (r as number);
        case "<=": return (l as number) <= (r as number);
      }
      break;
    }

    case "list_literal":
      return expr.elements.map((e) => evalExpression(e, env));

    case "list_get": {
      const list = (env[expr.list] as unknown[]) ?? [];
      const idx  = Number(evalExpression(expr.index, env));
      return list[idx] ?? null;
    }

    case "call_function": {
      const fn = env[`__fn_${expr.name}`] as
        | { params: string[]; body: StatementASTNode[] }
        | undefined;
      return fn ? "[function]" : null;
    }

    case "unknown":
      return null;
  }
  return null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isTruthy(v: unknown): boolean {
  if (v === null || v === undefined) return false;
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  if (typeof v === "string") return v.length > 0;
  if (Array.isArray(v)) return v.length > 0;
  return true;
}

function stringify(v: unknown): string {
  if (v === null || v === undefined) return "None";
  if (typeof v === "boolean") return v ? "True" : "False";
  if (Array.isArray(v)) return `[${v.map(stringify).join(", ")}]`;
  return String(v);
}

class StopExecution extends Error {}
class RuntimeError extends Error {}
