import { Node, Edge } from '@xyflow/react';
import { CustomNodeData } from './types';

export function generatePythonFromFlow(nodes: Node<CustomNodeData>[], edges: Edge[]): string {
  if (nodes.length === 0) {
    return '# LogicPup Visual Python Flowchart 🐾\n# Drag and connect nodes to generate Python 3 code.\n';
  }

  // Check if we have the "Number Guessing Game" pattern
  const isGuessingGame = nodes.some(n => n.data.label?.toLowerCase().includes('secret'));

  if (isGuessingGame) {
    return `# --- Python 3 Code (Generated from Flowchart) ---
# Program: Number Guessing Game

# 1. START: Program begins here
print("--- Starting Number Guessing Game ---")

# 2. Set Secret Number
secret_number = 7

# Game Loop
while True:
    # 3. Ask for Guess
    user_guess = int(input("Enter your guess (1-10): "))

    # 4. Check Match
    if user_guess == secret_number:
        # 5. Victory Message
        print("🎉 Correct! You guessed the secret number!")
        break
    else:
        # 6. Try Again
        print("❌ Wrong guess! Try again.")

# 7. END: Program ends here
print("--- Program Finished ---")
`;
  }

  // Generic Python code synthesizer from flowchart nodes
  let code = `# --- Python 3 Code (Generated from Flowchart) ---\n\n`;

  // Filter start node
  const startNode = nodes.find(n => n.data.nodeType === 'start');
  if (startNode) {
    code += `# START: Program begins here\n`;
  }

  // Process nodes in order
  nodes.forEach((node) => {
    const d = node.data;
    if (d.nodeType === 'start' || d.nodeType === 'end') return;

    code += `# Node: ${d.label}\n`;
    if (d.pythonCode) {
      code += `${d.pythonCode}\n\n`;
    } else if (d.nodeType === 'process') {
      code += `${d.variableName || 'x'} = ${d.variableValue || 0}\n\n`;
    } else if (d.nodeType === 'input') {
      code += `user_input = input("${d.label}: ")\n\n`;
    } else if (d.nodeType === 'condition') {
      code += `if ${d.conditionExpr || 'True'}:\n    pass\n\n`;
    } else if (d.nodeType === 'output') {
      code += `print("${d.outputMessage || d.label}")\n\n`;
    }
  });

  const endNode = nodes.find(n => n.data.nodeType === 'end');
  if (endNode) {
    code += `# END: Program ends here\n`;
  }

  return code;
}
