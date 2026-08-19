// ─────────────────────────────────────────────────────────────────────────────
// Visual Python Editor — Core Types
// Language-neutral. The Python generator is a separate concern.
// ─────────────────────────────────────────────────────────────────────────────

// ── Block Categories ─────────────────────────────────────────────────────────

export type BlockCategory =
  | "program"
  | "variables"
  | "output"
  | "input"
  | "conditions"
  | "loops"
  | "functions"
  | "math"
  | "comparison"
  | "boolean"
  | "data";

// ── Connection / Handle Types ─────────────────────────────────────────────────

export type HandleDataType =
  | "flow"        // execution flow (statement chain)
  | "expression"  // any expression
  | "number"      // numeric expression
  | "string"      // string expression
  | "boolean"     // boolean expression
  | "list"        // list value
  | "any";        // accepts anything

export interface BlockExplanation {
  simple: string;
  programming: string;
  terminology: string[];
  python: string;
  javascript: string;
  whyItMatters?: string;
}

export interface BlockDefinition {
  type: string;                    // unique identifier, e.g. "set_variable"
  label: string;                   // human-readable, e.g. "Set Variable"
  category: BlockCategory;
  icon: string;                    // emoji or lucide icon name
  description: string;             // shown in help modal
  pythonExample: string;           // shown in help modal
  color: string;                   // Tailwind bg class or hex
  defaultData: Record<string, unknown>;
  inputHandles: HandleDefinition[];
  outputHandles: HandleDefinition[];
  explanation?: BlockExplanation;
}

export interface HandleDefinition {
  id: string;
  label?: string;
  dataType: HandleDataType;
  position?: "top" | "bottom" | "left" | "right";
}

// ── React Flow Node Data ──────────────────────────────────────────────────────

export interface BlockNodeData extends Record<string, unknown> {
  blockType: string;
  label: string;
  category: BlockCategory;
  color: string;
  icon: string;
  values: Record<string, unknown>;   // user-edited field values
  isExecuting?: boolean;             // highlight during debug
  hasError?: boolean;
  errorMessage?: string;
}

// ── Language-Neutral AST ─────────────────────────────────────────────────────

export type ASTNodeType =
  | "program"
  | "set_variable"
  | "change_variable"
  | "get_variable"
  | "print"
  | "ask_input"
  | "if"
  | "if_else"
  | "repeat"
  | "while"
  | "for_each"
  | "define_function"
  | "call_function"
  | "return"
  | "number_literal"
  | "string_literal"
  | "boolean_literal"
  | "variable_ref"
  | "binary_op"
  | "unary_op"
  | "comparison"
  | "list_literal"
  | "list_add"
  | "list_get"
  | "block_sequence"
  | "unknown";

export interface BaseASTNode {
  type: ASTNodeType;
  nodeId?: string;      // source React Flow node ID for highlighting
}

export interface ProgramASTNode extends BaseASTNode {
  type: "program";
  body: StatementASTNode[];
}

export interface SetVariableASTNode extends BaseASTNode {
  type: "set_variable";
  name: string;
  value: ExpressionASTNode;
}

export interface ChangeVariableASTNode extends BaseASTNode {
  type: "change_variable";
  name: string;
  delta: ExpressionASTNode;
}

export interface PrintASTNode extends BaseASTNode {
  type: "print";
  value: ExpressionASTNode;
}

export interface AskInputASTNode extends BaseASTNode {
  type: "ask_input";
  prompt: ExpressionASTNode;
  variableName: string;
}

export interface IfASTNode extends BaseASTNode {
  type: "if";
  condition: ExpressionASTNode;
  body: StatementASTNode[];
}

export interface IfElseASTNode extends BaseASTNode {
  type: "if_else";
  condition: ExpressionASTNode;
  consequent: StatementASTNode[];
  alternate: StatementASTNode[];
}

export interface RepeatASTNode extends BaseASTNode {
  type: "repeat";
  count: ExpressionASTNode;
  body: StatementASTNode[];
}

export interface WhileASTNode extends BaseASTNode {
  type: "while";
  condition: ExpressionASTNode;
  body: StatementASTNode[];
}

export interface ForEachASTNode extends BaseASTNode {
  type: "for_each";
  variable: string;
  iterable: ExpressionASTNode;
  body: StatementASTNode[];
}

export interface DefineFunctionASTNode extends BaseASTNode {
  type: "define_function";
  name: string;
  params: string[];
  body: StatementASTNode[];
}

export interface CallFunctionASTNode extends BaseASTNode {
  type: "call_function";
  name: string;
  args: ExpressionASTNode[];
}

export interface ReturnASTNode extends BaseASTNode {
  type: "return";
  value: ExpressionASTNode | null;
}

export interface NumberLiteralASTNode extends BaseASTNode {
  type: "number_literal";
  value: number;
}

export interface StringLiteralASTNode extends BaseASTNode {
  type: "string_literal";
  value: string;
}

export interface BooleanLiteralASTNode extends BaseASTNode {
  type: "boolean_literal";
  value: boolean;
}

export interface VariableRefASTNode extends BaseASTNode {
  type: "variable_ref";
  name: string;
}

export interface BinaryOpASTNode extends BaseASTNode {
  type: "binary_op";
  operator: "+" | "-" | "*" | "/" | "%" | "and" | "or";
  left: ExpressionASTNode;
  right: ExpressionASTNode;
}

export interface UnaryOpASTNode extends BaseASTNode {
  type: "unary_op";
  operator: "not" | "-";
  operand: ExpressionASTNode;
}

export interface ComparisonASTNode extends BaseASTNode {
  type: "comparison";
  operator: "==" | "!=" | ">" | "<" | ">=" | "<=";
  left: ExpressionASTNode;
  right: ExpressionASTNode;
}

export interface ListLiteralASTNode extends BaseASTNode {
  type: "list_literal";
  elements: ExpressionASTNode[];
}

export interface ListAddASTNode extends BaseASTNode {
  type: "list_add";
  list: string;
  value: ExpressionASTNode;
}

export interface ListGetASTNode extends BaseASTNode {
  type: "list_get";
  list: string;
  index: ExpressionASTNode;
}

export interface BlockSequenceASTNode extends BaseASTNode {
  type: "block_sequence";
  statements: StatementASTNode[];
}

export interface UnknownASTNode extends BaseASTNode {
  type: "unknown";
  raw?: unknown;
}

export type StatementASTNode =
  | SetVariableASTNode
  | ChangeVariableASTNode
  | PrintASTNode
  | AskInputASTNode
  | IfASTNode
  | IfElseASTNode
  | RepeatASTNode
  | WhileASTNode
  | ForEachASTNode
  | DefineFunctionASTNode
  | CallFunctionASTNode
  | ReturnASTNode
  | ListAddASTNode
  | UnknownASTNode;

export type ExpressionASTNode =
  | NumberLiteralASTNode
  | StringLiteralASTNode
  | BooleanLiteralASTNode
  | VariableRefASTNode
  | BinaryOpASTNode
  | UnaryOpASTNode
  | ComparisonASTNode
  | ListLiteralASTNode
  | ListGetASTNode
  | CallFunctionASTNode
  | UnknownASTNode;

export type ASTNode = StatementASTNode | ExpressionASTNode | ProgramASTNode;

// ── Program (full parsed result) ─────────────────────────────────────────────

export interface Program {
  ast: ProgramASTNode;
  errors: ParseError[];
  nodeLineMap: Map<string, number>;  // nodeId → line number in generated code
}

export interface ParseError {
  nodeId?: string;
  message: string;
  severity: "error" | "warning";
}

// ── Language Generator interface ──────────────────────────────────────────────

export interface GeneratorResult {
  code: string;
  nodeLineMap: Map<string, number>;  // nodeId → starting line number (1-indexed)
}

export interface LanguageGenerator {
  name: string;        // e.g. "Python"
  fileExtension: string;
  generate(ast: ProgramASTNode): GeneratorResult;
}

// ── Execution State ───────────────────────────────────────────────────────────

export type ExecutionStatus = "idle" | "running" | "paused" | "finished" | "error";

export interface ExecutionState {
  status: ExecutionStatus;
  output: string[];
  variables: Record<string, unknown>;
  executingNodeId: string | null;
  executedNodeIds: string[];
  error: string | null;
}

// ── Editor Layout ─────────────────────────────────────────────────────────────

export type LayoutMode = "split" | "single";
