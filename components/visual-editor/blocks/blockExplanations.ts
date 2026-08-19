export interface BlockExplanation {
  simple: string;
  programming: string;
  terminology: string[];
  python: string;
  javascript: string;
  whyItMatters?: string;
}

export const BLOCK_EXPLANATIONS: Record<string, BlockExplanation> = {
  // ── Program Start / End ───────────────────────────────────────────────────
  start: {
    simple: "The green flag! This is where your code wakes up and starts running from top to bottom.",
    programming: "The starting line of your program. The computer begins reading your blocks here.",
    terminology: ["Start", "Program Flow", "First Step"],
    python: `# Your program starts here!
print("Game started!")`,
    javascript: `// Your program starts here!
console.log("Game started!");`,
    whyItMatters: "Like the word 'Go!' in a race, every program needs to know where to begin.",
  },

  end: {
    simple: "The finish line! Tells your computer that the project is completely done.",
    programming: "The stop signal that safely finishes your program.",
    terminology: ["Finish", "Stop", "End of Program"],
    python: `# Your program is all done!
print("Game Over! Thanks for playing!")`,
    javascript: `// Your program is all done!
console.log("Game Over! Thanks for playing!");`,
    whyItMatters: "Tells the computer to rest and celebrate finishing all instructions!",
  },

  // ── Variables & Assignment ────────────────────────────────────────────────
  set_variable: {
    simple: "Like putting a sticker with a name on a box, and saving a number, name, or score inside.",
    programming: "Creates a variable to store information in the computer's memory so you can use it later.",
    terminology: ["Variable", "Save Value", "Name", "Memory"],
    python: `# Save your score and name in boxes
score = 100
player_name = "Alex"`,
    javascript: `// Save your score and name in boxes
let score = 100;
let playerName = "Alex";`,
    whyItMatters: "Games use variables to remember your high score, coins, and player name!",
  },

  change_variable: {
    simple: "Adds or subtracts points from your box, like collecting a coin or losing a heart!",
    programming: "Changes the number inside an existing variable by adding or taking away an amount.",
    terminology: ["Increase (+)", "Decrease (-)", "Update Score"],
    python: `# Add 10 points when you grab a coin!
score = score + 10
# (Short way: score += 10)`,
    javascript: `// Add 10 points when you grab a coin!
score = score + 10;
// (Short way: score += 10);`,
    whyItMatters: "Used whenever you earn XP, collect power-ups, or lose health in a game.",
  },

  get_variable: {
    simple: "Peeks inside your box to see what number or word is currently stored there.",
    programming: "Reads the current value of a variable so you can use it in math or show it on screen.",
    terminology: ["Read Variable", "Current Value", "Look Up"],
    python: `# Use the score to calculate double points
double_score = score * 2`,
    javascript: `// Use the score to calculate double points
const doubleScore = score * 2;`,
    whyItMatters: "Lets your program check how many coins or lives you have right now.",
  },

  // ── Output & Input ────────────────────────────────────────────────────────
  print: {
    simple: "Makes the computer speak! Shows words, numbers, or secret messages on your screen.",
    programming: "Sends text or answers to the screen output for the player to read.",
    terminology: ["Print", "Show Message", "Console Output"],
    python: `# Say hello to the player!
print("Welcome to my awesome game!")
print("Score:", score)`,
    javascript: `// Say hello to the player!
console.log("Welcome to my awesome game!");
console.log("Score:", score);`,
    whyItMatters: "How your program talks to you and shares high scores, stories, and hints.",
  },

  ask_input: {
    simple: "Asks the player a question and waits for them to type an answer on the keyboard.",
    programming: "Pauses the code and saves what the user types into a variable.",
    terminology: ["Ask Question", "Player Input", "Keyboard Answer"],
    python: `# Ask the player for their hero name
hero_name = input("What is your hero name? ")
print("Welcome,", hero_name)`,
    javascript: `// Ask the player for their hero name
const heroName = prompt("What is your hero name?");
console.log("Welcome,", heroName);`,
    whyItMatters: "Makes your games interactive so friends can enter their names and make choices!",
  },

  // ── Conditions & Logic ────────────────────────────────────────────────────
  if: {
    simple: "A magic rule! 'If I have 10 coins, unlock the gold trophy!' If not, just keep playing.",
    programming: "A decision maker. Runs the blocks inside ONLY when your rule is True.",
    terminology: ["If Condition", "Rule", "True / False Decision"],
    python: `# Only cheer if score is 100 or higher
if score >= 100:
    print("🏆 You Win a Trophy!")`,
    javascript: `// Only cheer if score is 100 or higher
if (score >= 100) {
    console.log("🏆 You Win a Trophy!");
}`,
    whyItMatters: "Teaches the computer how to make smart choices just like a human brain!",
  },

  if_else: {
    simple: "A two-way choice: 'If door is unlocked ➔ Enter room. Otherwise ➔ Find the key!'",
    programming: "Runs the first action if True, or the 'Else' backup action if False.",
    terminology: ["If / Else", "Either / Or", "Backup Plan"],
    python: `# Check if player has lives left
if lives > 0:
    print("Keep playing! ❤️")
else:
    print("Game Over! Try again 💀")`,
    javascript: `// Check if player has lives left
if (lives > 0) {
    console.log("Keep playing! ❤️");
} else {
    console.log("Game Over! Try again 💀");
}`,
    whyItMatters: "Guarantees your game always knows what to do, win or lose.",
  },

  // ── Loops & Repetition ────────────────────────────────────────────────────
  repeat: {
    simple: "A super-fast robot! Repeats an action 3, 5, or 100 times without you typing it again and again.",
    programming: "A count loop that repeats the blocks inside for an exact number of rounds.",
    terminology: ["Repeat Loop", "Round", "Counter"],
    python: `# Jump 3 times!
for i in range(3):
    print("🦘 Jump!")`,
    javascript: `// Jump 3 times!
for (let i = 0; i < 3; i++) {
    console.log("🦘 Jump!");
}`,
    whyItMatters: "Instead of writing 100 lines of code, you can tell the computer to repeat 100 times in 2 blocks!",
  },

  while: {
    simple: "Keeps doing an action over and over AS LONG AS something is true (like jumping while music plays).",
    programming: "A loop that keeps running until its condition changes to False.",
    terminology: ["While Loop", "Keep Going Until", "Loop Condition"],
    python: `# Keep dancing while music is on!
energy = 3
while energy > 0:
    print("💃 Dancing!")
    energy = energy - 1`,
    javascript: `// Keep dancing while music is on!
let energy = 3;
while (energy > 0) {
    console.log("💃 Dancing!");
    energy = energy - 1;
}`,
    whyItMatters: "Powers game animations, countdown timers, and robot navigation.",
  },

  for_each: {
    simple: "Visits every single item in your backpack or list, one by one!",
    programming: "Goes through a list of items from the first to the last.",
    terminology: ["For Each", "List Items", "One by One"],
    python: `# Inspect each pet in your list
pets = ["🐶 Dog", "🐱 Cat", "🦜 Parrot"]
for pet in pets:
    print("Feeding my", pet)`,
    javascript: `// Inspect each pet in your list
const pets = ["🐶 Dog", "🐱 Cat", "🦜 Parrot"];
for (const pet of pets) {
    console.log("Feeding my " + pet);
}`,
    whyItMatters: "Perfect for counting inventory items, high score leaderboards, and party guests.",
  },

  // ── Functions ─────────────────────────────────────────────────────────────
  define_function: {
    simple: "Creates a new custom superpower or recipe that you can teach the computer once and use anytime!",
    programming: "A reusable mini-program with its own name and instructions.",
    terminology: ["Function", "Custom Block", "Recipe", "Reusable Code"],
    python: `# Teach the computer how to celebrate!
def celebrate():
    print("🎉 Woohoo!")
    print("✨ High Five!")`,
    javascript: `// Teach the computer how to celebrate!
function celebrate() {
    console.log("🎉 Woohoo!");
    console.log("✨ High Five!");
}`,
    whyItMatters: "Instead of rebuilding the same blocks 10 times, make one custom block and reuse it everywhere!",
  },

  call_function: {
    simple: "Shouts out your custom recipe name so the computer runs your superpower right now!",
    programming: "Runs the instructions you defined inside your custom function block.",
    terminology: ["Run Function", "Call Block", "Trigger Superpower"],
    python: `# Run the celebration recipe!
celebrate()`,
    javascript: `// Run the celebration recipe!
celebrate();`,
    whyItMatters: "Makes your code tidy and lets you trigger complex actions in one simple step.",
  },

  return: {
    simple: "Hands the calculated answer or prize back from your recipe!",
    programming: "Sends a result back from a function to the block that asked for it.",
    terminology: ["Return Answer", "Function Output", "Result"],
    python: `# Calculate and hand back double points
def double_points(points):
    return points * 2

bonus = double_points(25)  # bonus is 50!`,
    javascript: `// Calculate and hand back double points
function doublePoints(points) {
    return points * 2;
}

const bonus = doublePoints(25); // bonus is 50!`,
    whyItMatters: "Allows helper recipes to compute answers and pass them to other parts of your game.",
  },

  // ── Math & Arithmetic ─────────────────────────────────────────────────────
  calculate: {
    simple: "A pocket calculator! Adds, subtracts, multiplies, or divides numbers and saves the total.",
    programming: "Solves math equations using +, -, *, or /.",
    terminology: ["Math Calculation", "Solve Equation", "Calculator"],
    python: `# Math in Python!
total_coins = 5 + 10
double_damage = attack_power * 2`,
    javascript: `// Math in JavaScript!
const totalCoins = 5 + 10;
const doubleDamage = attackPower * 2;`,
    whyItMatters: "Used to count coins, calculate speed, track health, and create cool game physics!",
  },

  add: {
    simple: "Puts two numbers together to find the bigger total.",
    programming: "The plus operator (+) adds numbers together.",
    terminology: ["Plus (+)", "Addition", "Total"],
    python: `total_apples = 4 + 3  # 7 apples`,
    javascript: `const totalApples = 4 + 3; // 7 apples`,
    whyItMatters: "Used for gaining score points, collecting items, and leveling up.",
  },

  subtract: {
    simple: "Takes away numbers, like spending coins at a shop or taking damage.",
    programming: "The minus operator (-) subtracts one number from another.",
    terminology: ["Minus (-)", "Subtraction", "Difference"],
    python: `coins_left = 10 - 4  # 6 coins left`,
    javascript: `const coinsLeft = 10 - 4; // 6 coins left`,
    whyItMatters: "Used for countdown timers, spending currency, and taking hits.",
  },

  multiply: {
    simple: "Multiplies numbers to make them grow quickly, like a 2X double score booster!",
    programming: "The asterisk (*) multiplies numbers together.",
    terminology: ["Times (*)", "Multiplication", "Boost / Scale"],
    python: `combo_score = points * 2  # Double points!`,
    javascript: `const comboScore = points * 2; // Double points!`,
    whyItMatters: "Used for power-ups, multipliers, scaling speeds, and grid layouts.",
  },

  divide: {
    simple: "Shares a number fairly into equal piles, like splitting 10 cookies between 2 friends.",
    programming: "The slash (/) splits a number by another number.",
    terminology: ["Divide (/)", "Equal Share", "Division"],
    python: `cookies_each = 10 / 2  # 5 cookies each`,
    javascript: `const cookiesEach = 10 / 2; // 5 cookies each`,
    whyItMatters: "Used to calculate averages, find half-health points, and split team rewards.",
  },

  // ── Comparisons & Relational Operators ────────────────────────────────────
  greater_than: {
    simple: "Checks if the first number is BIGGER than the second number.",
    programming: "Checks if left is greater than right (>), answering True or False.",
    terminology: ["Greater Than (>)", "Bigger Check", "Comparison"],
    python: `is_winner = score > 100`,
    javascript: `const isWinner = score > 100;`,
    whyItMatters: "Used to check if you beat the high score or leveled up.",
  },

  less_than: {
    simple: "Checks if the first number is SMALLER than the second number.",
    programming: "Checks if left is less than right (<), answering True or False.",
    terminology: ["Less Than (<)", "Smaller Check", "Warning Threshold"],
    python: `low_health = hearts < 2  # Danger warning!`,
    javascript: `const lowHealth = hearts < 2; // Danger warning!`,
    whyItMatters: "Great for low-health alarms, timer warnings, and speed limits.",
  },

  equal: {
    simple: "Checks if two things are EXACTLY the same (matching twin values!).",
    programming: "The double equal sign (==) checks if two values match.",
    terminology: ["Equal (==)", "Exact Match", "Twins"],
    python: `is_correct_password = secret_code == "magic"`,
    javascript: `const isCorrectPassword = secretCode === "magic";`,
    whyItMatters: "Used for secret codes, quiz answers, and puzzle keys.",
  },

  // ── Boolean Logic ─────────────────────────────────────────────────────────
  boolean_and: {
    simple: "Checks that BOTH rules are true at the same time: 'I have the key AND I am at the castle door!'",
    programming: "Returns True only when both conditions are met.",
    terminology: ["AND Logic", "Both Must Match"],
    python: `# Both conditions must be True!
if has_key and at_door:
    print("🏰 Door opens!")`,
    javascript: `// Both conditions must be True!
if (hasKey && atDoor) {
    console.log("🏰 Door opens!");
}`,
    whyItMatters: "For combo requirements, like needing both a sword and shield to fight a boss.",
  },

  boolean_not: {
    simple: "The opposite flipper! Turns True into False, and False into True (like 'NOT sleeping' = awake!).",
    programming: "Flips a decision backwards.",
    terminology: ["NOT / Opposite", "Flip Decision", "Invert"],
    python: `# If the game is NOT over, keep playing!
if not game_over:
    print("Keep playing! 🎮")`,
    javascript: `// If the game is NOT over, keep playing!
if (!gameOver) {
    console.log("Keep playing! 🎮");
}`,
    whyItMatters: "Makes code easy and natural to read in plain English.",
  },

  // ── Data & Lists ──────────────────────────────────────────────────────────
  list_add: {
    simple: "Drops a new item into your backpack or list, like picking up a shiny gold star!",
    programming: "Appends a new item to the end of your list.",
    terminology: ["Add to List", "Backpack Item", "Append"],
    python: `# Add a magic star to your backpack
backpack = ["Sword", "Shield"]
backpack.append("🌟 Magic Star")`,
    javascript: `// Add a magic star to your backpack
const backpack = ["Sword", "Shield"];
backpack.push("🌟 Magic Star");`,
    whyItMatters: "Lets your player collect loot, treasure, and team members during adventures!",
  },
};

/**
 * Helper to fetch explanation for any block, with intelligent kid-friendly fallbacks.
 */
export function getBlockExplanation(blockType: string): BlockExplanation {
  if (BLOCK_EXPLANATIONS[blockType]) {
    return BLOCK_EXPLANATIONS[blockType];
  }

  return {
    simple: "A helper block that does an action in your program.",
    programming: `An instruction block (${blockType}) that tells the computer what to do step-by-step.`,
    terminology: ["Block", "Step", "Code"],
    python: `# ${blockType} block\nprint("Running block!")`,
    javascript: `// ${blockType} block\nconsole.log("Running block!");`,
    whyItMatters: "Every block is a step in your coding adventure.",
  };
}
