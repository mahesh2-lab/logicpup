import type { CodingLevel, LevelChallenge } from "../projects/types";

export const CODING_LEVELS: CodingLevel[] = [
  // ── Level 1 ─────────────────────────────────────────────────────────────────
  {
    id: "level-1",
    levelNumber: 1,
    title: "Variables & Data Storage",
    subtitle: "Named Boxes for Numbers and Words",
    icon: "Variable",
    badge: "DATA NOVICE",
    description: "Learn how computers remember information using variables, store player inputs, and display messages.",
    requiredChallengesToMaster: 3,
    learning: {
      conceptTitle: "What is a Variable?",
      summary: "A variable is like a labeled container or box where your program stores information to use later.",
      explanation: [
        "In programming, computers need a way to remember things — like a player's name, a score, or health points.",
        "You give the variable a name (e.g. `score` or `player_name`) and put a value inside using the 'Set Variable' block.",
        "Whenever you need that value later, you refer to its name, or update it using 'Change Variable'.",
        "Strings (text) are wrapped in quotes (e.g. \"Alex\"), while numbers are written directly (e.g. 100).",
      ],
      blockExamples: [
        {
          name: "Set Variable",
          blockType: "set_variable",
          purpose: "Creates or updates a variable with a value.",
          exampleCode: 'score = 100\nplayer_name = "Maya"',
        },
        {
          name: "Ask for Input",
          blockType: "ask_input",
          purpose: "Prompts the user to type something and saves it in a variable.",
          exampleCode: 'name = input("What is your name?")',
        },
        {
          name: "Print Output",
          blockType: "print",
          purpose: "Shows a message or variable value on screen.",
          exampleCode: 'print("Hello " + name)',
        },
      ],
      codeSnippets: [
        {
          title: "Creating & Printing Variables",
          pythonCode: 'player = "Hero"\ngold = 50\nprint("Welcome, " + player)\nprint(gold)',
          explanation: "Assigns a text string and a number to variables, then prints them.",
        },
        {
          title: "Updating Variable Values",
          pythonCode: "score = 10\nscore = score + 5\nprint(score)  # Output: 15",
          explanation: "Adds 5 to the existing score and updates the value in memory.",
        },
      ],
      commonMistakes: [
        {
          mistake: "print(Hello) without quotes",
          fix: 'print("Hello") with quotes',
          why: "Without quotes, Python looks for a variable named Hello instead of the actual word.",
        },
        {
          mistake: "Using spaces in variable names (my score = 10)",
          fix: "Use underscores: my_score = 10",
          why: "Variable names must be one continuous word without spaces.",
        },
      ],
      keyTakeaways: [
        "Variables hold data like numbers and text strings.",
        "Use 'Set Variable' to create, 'Ask Input' to get input from users, and 'Print' to show output.",
        "Text values need quotes; variable names do not.",
      ],
    },
    challenges: [
      {
        id: "l1-c1",
        levelId: "level-1",
        levelNumber: 1,
        title: "Create & Print Your Age",
        difficulty: "easy",
        format: "build",
        formatLabel: "🔨 Build from Scratch",
        description: "Set a variable named age to 12, then print the age.",
        goal: "Start with an empty canvas. Create variable age = 12 and print it.",
        hint: "Connect: Start ➔ Set Variable (name: age, value: 12) ➔ Print (message: age) ➔ End.",
        points: 25,
        testCases: [
          {
            id: "l1-c1-t1",
            name: "Print Age",
            inputs: [],
            expectedOutputs: ["12"],
          },
        ],
      },
      {
        id: "l1-c2",
        levelId: "level-1",
        levelNumber: 1,
        title: "Score Keeper (+10 Points)",
        difficulty: "medium",
        format: "complete",
        formatLabel: "🧩 Complete the Code",
        description: "Set score to 100, increase it by 10 using change variable, and print the new score.",
        goal: "Set score = 100, add 10, and print the resulting total of 110.",
        hint: "Set variable score = 100 ➔ Change variable score by 10 ➔ Print score.",
        points: 50,
        testCases: [
          {
            id: "l1-c2-t1",
            name: "Score Total",
            inputs: [],
            expectedOutputs: ["110"],
          },
        ],
      },
      {
        id: "l1-c3",
        levelId: "level-1",
        levelNumber: 1,
        title: "Interactive Greeting",
        difficulty: "medium",
        format: "real_world",
        formatLabel: "🌍 Real-World App",
        description: "Ask the user for their name, store it in variable name, and print 'Hello ' plus their name.",
        goal: "Ask for input, save in name, and output 'Hello ' with the input.",
        hint: "Ask Input (prompt: 'What is your name?', variable: name) ➔ Print(name).",
        points: 75,
        testCases: [
          {
            id: "l1-c3-t1",
            name: "Greet Player Maya",
            inputs: ["Maya"],
            expectedOutputs: ["Maya", "Hello"],
          },
        ],
      },
    ],
  },

  // ── Level 2 ─────────────────────────────────────────────────────────────────
  {
    id: "level-2",
    levelNumber: 2,
    title: "Decisions & Logic",
    subtitle: "If / Else Branches and Comparisons",
    icon: "GitBranch",
    badge: "LOGIC MASTER",
    description: "Teach your programs how to think and make smart choices using conditions, comparisons, and branch pathways.",
    requiredChallengesToMaster: 3,
    learning: {
      conceptTitle: "How Programs Make Decisions",
      summary: "Computers use conditions to check if something is TRUE or FALSE, then choose which path of blocks to run.",
      explanation: [
        "In life, you make choices: IF it rains, bring an umbrella. ELSE, wear sunglasses.",
        "In code, an 'If / Else' block checks a condition like `guess == 42` or `score > 50`.",
        "If the condition is TRUE, the program runs the TRUE branch.",
        "If the condition is FALSE, it runs the ELSE branch.",
        "Comparison operators include: `==` (equal to), `!=` (not equal), `>` (greater than), and `<` (less than).",
      ],
      blockExamples: [
        {
          name: "If / Else Block",
          blockType: "if_else",
          purpose: "Branches into two pathways depending on whether a condition is true.",
          exampleCode: 'if score > 10:\n    print("Win")\nelse:\n    print("Try again")',
        },
        {
          name: "Comparison (<, >, ==)",
          blockType: "greater_than",
          purpose: "Compares two numbers or variables to produce True or False.",
          exampleCode: "lives > 0\nguess == target",
        },
      ],
      codeSnippets: [
        {
          title: "Basic If / Else",
          pythonCode: 'guess = 42\nif guess == 42:\n    print("Correct!")\nelse:\n    print("Wrong guess")',
          explanation: "Checks if guess is 42 and prints the winning message.",
        },
        {
          title: "Number Comparison",
          pythonCode: 'age = 15\nif age >= 13:\n    print("Teenager")\nelse:\n    print("Child")',
          explanation: "Compares age to 13 to categorize the user.",
        },
      ],
      commonMistakes: [
        {
          mistake: "Using a single = for comparison (if score = 10)",
          fix: "Use double == (if score == 10)",
          why: "A single = assigns a value, while == checks if two values are equal.",
        },
        {
          mistake: "Forgetting what runs when condition is false",
          fix: "Always connect the ELSE branch for fallback feedback.",
          why: "Without the ELSE branch, the user gets no response when their input is incorrect.",
        },
      ],
      keyTakeaways: [
        "Conditions evaluate to either TRUE or FALSE.",
        "Use '==' to check equality, '>' for greater than, and '<' for less than.",
        "The TRUE branch runs when matched; the ELSE branch runs when not matched.",
      ],
    },
    challenges: [
      {
        id: "l2-c1",
        levelId: "level-2",
        levelNumber: 2,
        title: "Secret Number Guessing Game",
        difficulty: "easy",
        format: "build",
        formatLabel: "🔨 Build from Scratch",
        description: "Set secret = 42. Ask user for guess. If guess == 42 print 'Correct!', else print 'Try again!'.",
        goal: "Build a guessing game that verifies user input against secret number 42.",
        hint: "Start ➔ Set secret = 42 ➔ Ask guess ➔ If/Else (guess == 42) ➔ Print('Correct!') on TRUE, Print('Try again!') on ELSE ➔ End.",
        points: 50,
        testCases: [
          {
            id: "l2-c1-t1",
            name: "Correct Guess (42)",
            inputs: ["42"],
            expectedOutputs: ["Correct!"],
          },
          {
            id: "l2-c1-t2",
            name: "Wrong Guess (7)",
            inputs: ["7"],
            expectedOutputs: ["Try again!"],
          },
        ],
      },
      {
        id: "l2-c2",
        levelId: "level-2",
        levelNumber: 2,
        title: "Pass or Fail Exam Checker",
        difficulty: "medium",
        format: "complete",
        formatLabel: "🧩 Complete the Code",
        description: "Set score = 75. If score >= 60 print 'Passed!', else print 'Need more practice'.",
        goal: "Check if score is 60 or higher and print the appropriate result.",
        hint: "Connect: Start ➔ Set score = 75 ➔ If/Else (score >= 60) ➔ Print('Passed!') on TRUE ➔ End.",
        points: 50,
        testCases: [
          {
            id: "l2-c2-t1",
            name: "Passing Score (75)",
            inputs: [],
            expectedOutputs: ["Passed!"],
          },
        ],
      },
      {
        id: "l2-c3",
        levelId: "level-2",
        levelNumber: 2,
        title: "Movie Ticket Age Gate",
        difficulty: "hard",
        format: "real_world",
        formatLabel: "🌍 Real-World App",
        description: "Ask the user for their age. If age >= 18 print 'Adult Ticket', else print 'Child Ticket'.",
        goal: "Gate ticket types based on user's entered age.",
        hint: "Ask age ➔ If/Else (age >= 18) ➔ Adult Ticket / Child Ticket.",
        points: 100,
        testCases: [
          {
            id: "l2-c3-t1",
            name: "Adult (20)",
            inputs: ["20"],
            expectedOutputs: ["Adult Ticket"],
          },
          {
            id: "l2-c3-t2",
            name: "Child (10)",
            inputs: ["10"],
            expectedOutputs: ["Child Ticket"],
          },
        ],
      },
    ],
  },

  // ── Level 3 ─────────────────────────────────────────────────────────────────
  {
    id: "level-3",
    levelNumber: 3,
    title: "Loops & Repetition",
    subtitle: "Repeating Actions without Repeating Code",
    icon: "Repeat",
    badge: "LOOP CHAMPION",
    description: "Harness the power of iteration! Run blocks multiple times with Repeat and While loops.",
    requiredChallengesToMaster: 3,
    learning: {
      conceptTitle: "Why Do We Need Loops?",
      summary: "Instead of writing the same code 100 times, a loop tells the computer to repeat instructions automatically.",
      explanation: [
        "Imagine counting down from 10 to 1, or printing 5 stars. Writing 10 print blocks is slow and error-prone.",
        "A **Repeat Loop** runs the blocks inside a fixed number of times (e.g. 5 times).",
        "A **While Loop** keeps running as long as a condition stays true (e.g. while `lives > 0`).",
        "Loops save time, reduce mistakes, and make dynamic games possible.",
      ],
      blockExamples: [
        {
          name: "Repeat Loop",
          blockType: "repeat",
          purpose: "Repeats inner blocks a set number of times.",
          exampleCode: 'for i in range(5):\n    print("Jump!")',
        },
        {
          name: "While Loop",
          blockType: "while",
          purpose: "Repeats as long as the condition evaluates to True.",
          exampleCode: "while count > 0:\n    count -= 1",
        },
      ],
      codeSnippets: [
        {
          title: "Counting with Repeat",
          pythonCode: 'for i in range(3):\n    print("Hello!")',
          explanation: "Prints 'Hello!' three times on separate lines.",
        },
        {
          title: "While Loop Countdown",
          pythonCode: 'timer = 3\nwhile timer > 0:\n    print(timer)\n    timer = timer - 1\nprint("GO!")',
          explanation: "Counts down 3, 2, 1, then prints GO!",
        },
      ],
      commonMistakes: [
        {
          mistake: "Infinite loops where the variable never changes",
          fix: "Make sure your loop body changes the variable (e.g. count -= 1).",
          why: "If the condition never becomes False, the computer gets stuck forever.",
        },
      ],
      keyTakeaways: [
        "Repeat loops run a set number of times.",
        "While loops run until their condition becomes False.",
        "Loops are essential for animations, timers, and game cycles.",
      ],
    },
    challenges: [
      {
        id: "l3-c1",
        levelId: "level-3",
        levelNumber: 3,
        title: "Rocket Countdown (3.. 2.. 1.. Blastoff!)",
        difficulty: "easy",
        format: "build",
        formatLabel: "🔨 Build from Scratch",
        description: "Repeat 3 times: print 'Counting down', then after the loop print 'Blastoff!'.",
        goal: "Use a Repeat block set to 3, and print 'Blastoff!' at the end.",
        hint: "Start ➔ Repeat(3) { Print('Counting down') } ➔ Print('Blastoff!') ➔ End.",
        points: 50,
        testCases: [
          {
            id: "l3-c1-t1",
            name: "Blastoff Output",
            inputs: [],
            expectedOutputs: ["Blastoff!"],
          },
        ],
      },
      {
        id: "l3-c2",
        levelId: "level-3",
        levelNumber: 3,
        title: "Multiplication Table Generator",
        difficulty: "medium",
        format: "complete",
        formatLabel: "🧩 Complete the Code",
        description: "Use a loop to repeat 4 times: increase total by 5, and print the final total (20).",
        goal: "Set total = 0, repeat 4 times adding 5 each time, and output 20.",
        hint: "total = 0 ➔ Repeat(4) { change total by 5 } ➔ Print(total).",
        points: 75,
        testCases: [
          {
            id: "l3-c2-t1",
            name: "Accumulated Sum (20)",
            inputs: [],
            expectedOutputs: ["20"],
          },
        ],
      },
      {
        id: "l3-c3",
        levelId: "level-3",
        levelNumber: 3,
        title: "ATM Pin Validator",
        difficulty: "hard",
        format: "real_world",
        formatLabel: "🌍 Real-World App",
        description: "Ask the user for pin. If pin == 1234 print 'Access Granted', else print 'Card Locked'.",
        goal: "Validate the secret PIN code.",
        hint: "Ask pin ➔ If/Else (pin == 1234) ➔ Access Granted / Card Locked.",
        points: 100,
        testCases: [
          {
            id: "l3-c3-t1",
            name: "Valid PIN (1234)",
            inputs: ["1234"],
            expectedOutputs: ["Access Granted"],
          },
          {
            id: "l3-c3-t2",
            name: "Invalid PIN (9999)",
            inputs: ["9999"],
            expectedOutputs: ["Card Locked"],
          },
        ],
      },
    ],
  },

  // ── Level 4 ─────────────────────────────────────────────────────────────────
  {
    id: "level-4",
    levelNumber: 4,
    title: "Math & Arithmetic",
    subtitle: "Calculations, Formulas, and Problem Solving",
    icon: "Calculator",
    badge: "MATH WIZARD",
    description: "Turn your computer into a high-speed calculator! Master addition, subtraction, formulas, and percentages.",
    requiredChallengesToMaster: 3,
    learning: {
      conceptTitle: "Arithmetic in Code",
      summary: "Computers excel at doing millions of calculations instantly. Learn how operators work together.",
      explanation: [
        "Basic operators include: `+` (add), `-` (subtract), `*` (multiply), and `/` (divide).",
        "You can combine math with variables, like `total = price * quantity`.",
        "You can use the 'Calculate' block to store results directly in a new variable.",
      ],
      blockExamples: [
        {
          name: "Calculate Block",
          blockType: "calculate",
          purpose: "Performs arithmetic operations and saves to a variable.",
          exampleCode: "total = a + b",
        },
      ],
      codeSnippets: [
        {
          title: "Adding Variables",
          pythonCode: "a = 15\nb = 25\ntotal = a + b\nprint(total)  # 40",
          explanation: "Calculates the sum of two variables and displays 40.",
        },
      ],
      commonMistakes: [
        {
          mistake: "Dividing by zero (e.g. 10 / 0)",
          fix: "Never divide by 0 — it causes a ZeroDivisionError.",
          why: "Division by zero is mathematically undefined.",
        },
      ],
      keyTakeaways: [
        "Math blocks allow formulas like prices, averages, and game physics.",
        "Variables can be multiplied, divided, added, and subtracted seamlessly.",
      ],
    },
    challenges: [
      {
        id: "l4-c1",
        levelId: "level-4",
        levelNumber: 4,
        title: "Two-Number Sum Calculator",
        difficulty: "easy",
        format: "build",
        formatLabel: "🔨 Build from Scratch",
        description: "Set a = 15, b = 25, calculate result = a + b, and print result (40).",
        goal: "Add 15 and 25 together and output 40.",
        hint: "Set a = 15 ➔ Set b = 25 ➔ Set result = a + b ➔ Print(result).",
        points: 50,
        testCases: [
          {
            id: "l4-c1-t1",
            name: "Sum of 15 + 25",
            inputs: [],
            expectedOutputs: ["40"],
          },
        ],
      },
      {
        id: "l4-c2",
        levelId: "level-4",
        levelNumber: 4,
        title: "Shopping Cart Total with Tax",
        difficulty: "medium",
        format: "complete",
        formatLabel: "🧩 Complete the Code",
        description: "Set price = 50, tax = 5, calculate total = price + tax, and print total (55).",
        goal: "Compute the final total of 55.",
        hint: "price = 50 ➔ tax = 5 ➔ total = price + tax ➔ Print(total).",
        points: 75,
        testCases: [
          {
            id: "l4-c2-t1",
            name: "Total 55",
            inputs: [],
            expectedOutputs: ["55"],
          },
        ],
      },
      {
        id: "l4-c3",
        levelId: "level-4",
        levelNumber: 4,
        title: "Restaurant Tip Splitter",
        difficulty: "hard",
        format: "real_world",
        formatLabel: "🌍 Real-World App",
        description: "Set bill = 100, tip = 20, people = 2. Compute share = (bill + tip) / people and print share (60).",
        goal: "Split a total bill of 120 evenly among 2 people.",
        hint: "bill = 100 ➔ tip = 20 ➔ total = 120 ➔ share = 60 ➔ Print(share).",
        points: 100,
        testCases: [
          {
            id: "l4-c3-t1",
            name: "Equal Share (60)",
            inputs: [],
            expectedOutputs: ["60"],
          },
        ],
      },
    ],
  },

  // ── Level 5 ─────────────────────────────────────────────────────────────────
  {
    id: "level-5",
    levelNumber: 5,
    title: "Functions & Modular Code",
    subtitle: "Build Custom Tools and Mini-Programs",
    icon: "Code2",
    badge: "ARCHITECT",
    description: "Write code once and run it anywhere! Package your logic into reusable functions with inputs and return outputs.",
    requiredChallengesToMaster: 3,
    learning: {
      conceptTitle: "What is a Function?",
      summary: "A function is a named recipe or mini-program that you can call whenever you need it.",
      explanation: [
        "Functions keep your programs clean, organized, and easy to read.",
        "You define a function once using 'Define Function' and run it using 'Call Function'.",
        "Functions can accept arguments (inputs) and send back a result using 'Return'.",
      ],
      blockExamples: [
        {
          name: "Define Function",
          blockType: "define_function",
          purpose: "Packages code into a reusable block.",
          exampleCode: 'def greet():\n    print("Hello!")',
        },
        {
          name: "Call Function",
          blockType: "call_function",
          purpose: "Executes a defined function.",
          exampleCode: "greet()",
        },
      ],
      codeSnippets: [
        {
          title: "Simple Function",
          pythonCode: 'def celebration():\n    print("🎉 WINNER! 🎉")\n\ncelebration()\ncelebration()',
          explanation: "Calls the celebration function twice to print the banner.",
        },
      ],
      commonMistakes: [
        {
          mistake: "Calling a function before defining it",
          fix: "Always define the function first before calling it.",
          why: "Python reads code from top to bottom and needs to know what the function is first.",
        },
      ],
      keyTakeaways: [
        "Functions prevent repeating the same blocks multiple times.",
        "Define once, call anywhere in your program.",
      ],
    },
    challenges: [
      {
        id: "l5-c1",
        levelId: "level-5",
        levelNumber: 5,
        title: "Custom Cheer Function",
        difficulty: "easy",
        format: "build",
        formatLabel: "🔨 Build from Scratch",
        description: "Define a function named cheer that prints 'Go Team!', and call it.",
        goal: "Define and call the cheer function.",
        hint: "Define Function(cheer) { Print('Go Team!') } ➔ Call Function(cheer).",
        points: 75,
        testCases: [
          {
            id: "l5-c1-t1",
            name: "Cheer Output",
            inputs: [],
            expectedOutputs: ["Go Team!"],
          },
        ],
      },
      {
        id: "l5-c2",
        levelId: "level-5",
        levelNumber: 5,
        title: "Double Number Calculator",
        difficulty: "medium",
        format: "complete",
        formatLabel: "🧩 Complete the Code",
        description: "Set num = 25, calculate double = num * 2, and print double (50).",
        goal: "Double the input number to 50.",
        hint: "num = 25 ➔ double = num * 2 ➔ Print(double).",
        points: 100,
        testCases: [
          {
            id: "l5-c2-t1",
            name: "Double of 25 (50)",
            inputs: [],
            expectedOutputs: ["50"],
          },
        ],
      },
      {
        id: "l5-c3",
        levelId: "level-5",
        levelNumber: 5,
        title: "Shield & Damage Evaluator",
        difficulty: "hard",
        format: "real_world",
        formatLabel: "🌍 Real-World App",
        description: "Set health = 100, damage = 35. Calculate remaining = health - damage, and print 'Health: 65'.",
        goal: "Evaluate player's remaining health after damage.",
        hint: "health = 100 ➔ damage = 35 ➔ remaining = 65 ➔ Print('Health: ' + remaining).",
        points: 125,
        testCases: [
          {
            id: "l5-c3-t1",
            name: "Health Status 65",
            inputs: [],
            expectedOutputs: ["65", "Health"],
          },
        ],
      },
    ],
  },

  // ── Level 6 ─────────────────────────────────────────────────────────────────
  {
    id: "level-6",
    levelNumber: 6,
    title: "Text & String Manipulation",
    subtitle: "Combining Words, Formats, and Messages",
    icon: "FileText",
    badge: "WORDSMITH",
    description: "Learn how to format strings, combine sentences with concatenation (+), and build dynamic storytelling dialogs.",
    requiredChallengesToMaster: 3,
    learning: {
      conceptTitle: "Working with Text (Strings)",
      summary: "In coding, text inside quotes is called a String. You can join strings together to create dynamic sentences.",
      explanation: [
        "String concatenation means gluing two or more pieces of text together with the `+` operator.",
        "For example, `'Game ' + 'Over'` becomes `'Game Over'`.",
        "You can combine text with variables: `'Score: ' + score`.",
        "Strings can hold emojis, punctuation, names, and whole paragraphs of story dialogue.",
      ],
      blockExamples: [
        {
          name: "String Join (+)",
          blockType: "calculate",
          purpose: "Combines two text strings or a string and variable.",
          exampleCode: 'greeting = "Hello " + name',
        },
      ],
      codeSnippets: [
        {
          title: "Joining Words",
          pythonCode: 'first = "Code"\nsecond = "Flow"\ntitle = first + second\nprint(title)  # CodeFlow',
          explanation: "Glues two words together into a single title string.",
        },
      ],
      commonMistakes: [
        {
          mistake: 'Forgetting spaces between words ("Hello" + "World" = "HelloWorld")',
          fix: 'Include a space: "Hello " + "World"',
          why: "Python joins strings exactly as provided without adding spaces automatically.",
        },
      ],
      keyTakeaways: [
        "Strings are text wrapped in quotes.",
        "The '+' operator joins strings together.",
        "Remember to add space characters when combining words.",
      ],
    },
    challenges: [
      {
        id: "l6-c1",
        levelId: "level-6",
        levelNumber: 6,
        title: "Full Name Formatter",
        difficulty: "easy",
        format: "build",
        formatLabel: "🔨 Build from Scratch",
        description: "Set first = 'Ada', last = 'Lovelace', join them into full_name, and print full_name.",
        goal: "Create full name 'Ada Lovelace' and print it.",
        hint: "first = 'Ada' ➔ last = 'Lovelace' ➔ full = 'Ada Lovelace' ➔ Print(full).",
        points: 75,
        testCases: [
          {
            id: "l6-c1-t1",
            name: "Ada Lovelace",
            inputs: [],
            expectedOutputs: ["Ada", "Lovelace"],
          },
        ],
      },
      {
        id: "l6-c2",
        levelId: "level-6",
        levelNumber: 6,
        title: "Level Up Announcement",
        difficulty: "medium",
        format: "complete",
        formatLabel: "🧩 Complete the Code",
        description: "Set hero = 'Knight', level = 5. Print 'Hero Knight reached Level 5!'.",
        goal: "Print the level up announcement banner.",
        hint: "hero = 'Knight' ➔ level = 5 ➔ Print('Hero Knight reached Level 5!').",
        points: 100,
        testCases: [
          {
            id: "l6-c2-t1",
            name: "Level 5 Banner",
            inputs: [],
            expectedOutputs: ["Level 5", "Knight"],
          },
        ],
      },
      {
        id: "l6-c3",
        levelId: "level-6",
        levelNumber: 6,
        title: "Custom Avatar Creator",
        difficulty: "hard",
        format: "real_world",
        formatLabel: "🌍 Real-World App",
        description: "Ask user for title and guild. Print 'Welcome [title] of [guild]!'.",
        goal: "Format dynamic welcome message from user input.",
        hint: "Ask title ➔ Ask guild ➔ Print('Welcome ' + title + ' of ' + guild + '!').",
        points: 125,
        testCases: [
          {
            id: "l6-c3-t1",
            name: "Wizard of Dragon",
            inputs: ["Wizard", "Dragon"],
            expectedOutputs: ["Wizard", "Dragon"],
          },
        ],
      },
    ],
  },

  // ── Level 7 ─────────────────────────────────────────────────────────────────
  {
    id: "level-7",
    levelNumber: 7,
    title: "Lists & Collections",
    subtitle: "Storing Sequences and Inventories",
    icon: "Layers",
    badge: "COLLECTION MASTER",
    description: "Group multiple items into a single list! Manage player inventories, high scores, and color palettes.",
    requiredChallengesToMaster: 3,
    learning: {
      conceptTitle: "What is a List?",
      summary: "A list is an ordered collection of items stored under one variable name.",
      explanation: [
        "Instead of creating `item1`, `item2`, `item3`, you store them in one list: `inventory = ['sword', 'shield', 'potion']`.",
        "Lists use zero-based indexing: `inventory[0]` is the first item ('sword').",
        "You can find how many items are in a list using `len(inventory)`.",
      ],
      blockExamples: [
        {
          name: "List Variable",
          blockType: "set_variable",
          purpose: "Stores an ordered list of items.",
          exampleCode: 'items = ["Apple", "Banana", "Cherry"]',
        },
      ],
      codeSnippets: [
        {
          title: "Accessing List Items",
          pythonCode: 'fruits = ["Apple", "Banana", "Cherry"]\nprint(fruits[0])  # Apple\nprint(fruits[2])  # Cherry',
          explanation: "Uses index 0 for the first item and index 2 for the third item.",
        },
      ],
      commonMistakes: [
        {
          mistake: "Starting index count at 1 instead of 0",
          fix: "Remember computers count from 0 for the first item.",
          why: "fruits[0] is the 1st element, fruits[1] is the 2nd element.",
        },
      ],
      keyTakeaways: [
        "Lists hold multiple values inside square brackets `[]`.",
        "List items are accessed with index numbers starting from 0.",
      ],
    },
    challenges: [
      {
        id: "l7-c1",
        levelId: "level-7",
        levelNumber: 7,
        title: "Player Inventory Display",
        difficulty: "easy",
        format: "build",
        formatLabel: "🔨 Build from Scratch",
        description: "Set inventory = ['Sword', 'Potion'], and print 'Equipped: Sword'.",
        goal: "Display the equipped first item from inventory.",
        hint: "inventory = ['Sword', 'Potion'] ➔ Print('Equipped: Sword').",
        points: 100,
        testCases: [
          {
            id: "l7-c1-t1",
            name: "Sword Equipped",
            inputs: [],
            expectedOutputs: ["Sword"],
          },
        ],
      },
      {
        id: "l7-c2",
        levelId: "level-7",
        levelNumber: 7,
        title: "Top 3 Leaderboard",
        difficulty: "medium",
        format: "complete",
        formatLabel: "🧩 Complete the Code",
        description: "Set scores = [100, 85, 70]. Print '1st Place: 100' and '2nd Place: 85'.",
        goal: "Print the top two leaderboard scores.",
        hint: "Print 1st and 2nd scores.",
        points: 125,
        testCases: [
          {
            id: "l7-c2-t1",
            name: "Leaderboard Scores",
            inputs: [],
            expectedOutputs: ["100", "85"],
          },
        ],
      },
      {
        id: "l7-c3",
        levelId: "level-7",
        levelNumber: 7,
        title: "Magic Spellbook Selector",
        difficulty: "hard",
        format: "real_world",
        formatLabel: "🌍 Real-World App",
        description: "Ask user for spell choice (1 or 2). If 1 print 'Cast Fireball', else print 'Cast Freeze'.",
        goal: "Select and cast spell based on index choice.",
        hint: "Ask choice ➔ If choice == 1 print 'Cast Fireball' else print 'Cast Freeze'.",
        points: 150,
        testCases: [
          {
            id: "l7-c3-t1",
            name: "Fireball Choice (1)",
            inputs: ["1"],
            expectedOutputs: ["Fireball"],
          },
          {
            id: "l7-c3-t2",
            name: "Freeze Choice (2)",
            inputs: ["2"],
            expectedOutputs: ["Freeze"],
          },
        ],
      },
    ],
  },

  // ── Level 8 ─────────────────────────────────────────────────────────────────
  {
    id: "level-8",
    levelNumber: 8,
    title: "Nested Logic & Multi-Way Choices",
    subtitle: "Complex Decision Trees and Multiple Conditions",
    icon: "Network",
    badge: "STRATEGIST",
    description: "Master multi-branch logic! Combine conditions with AND / OR and build complex multi-choice decision paths.",
    requiredChallengesToMaster: 3,
    learning: {
      conceptTitle: "Multi-Way Conditions (Elif)",
      summary: "When you have more than 2 choices (e.g. Gold, Silver, Bronze), you can chain conditions together.",
      explanation: [
        "In simple logic, you have IF and ELSE (2 outcomes).",
        "With multiple choices, you use 'ELSE IF' (elif in Python) to check option 1, option 2, option 3.",
        "You can also use 'AND' to require two things at once (e.g. `has_key == True and door_open == False`).",
        "You can use 'OR' when either condition is sufficient.",
      ],
      blockExamples: [
        {
          name: "If / Else Chaining",
          blockType: "if_else",
          purpose: "Evaluates multi-tiered conditions in sequence.",
          exampleCode: 'if score >= 90:\n    grade = "A"\nelif score >= 80:\n    grade = "B"\nelse:\n    grade = "C"',
        },
      ],
      codeSnippets: [
        {
          title: "Grade Evaluator",
          pythonCode: 'score = 85\nif score >= 90:\n    print("Grade: A")\nelif score >= 80:\n    print("Grade: B")\nelse:\n    print("Grade: C")',
          explanation: "Prints Grade: B because 85 is between 80 and 89.",
        },
      ],
      commonMistakes: [
        {
          mistake: "Checking conditions in the wrong order",
          fix: "Check strictest conditions first (e.g. score >= 90 before score >= 60).",
          why: "If you check score >= 60 first, a score of 95 will trigger the 60 branch and stop.",
        },
      ],
      keyTakeaways: [
        "Use multi-way branching for 3 or more outcomes.",
        "Check highest/strictest criteria first.",
      ],
    },
    challenges: [
      {
        id: "l8-c1",
        levelId: "level-8",
        levelNumber: 8,
        title: "Medal Award Ceremony",
        difficulty: "easy",
        format: "build",
        formatLabel: "🔨 Build from Scratch",
        description: "Set rank = 1. If rank == 1 print 'Gold Medal', else print 'Participant Ribbon'.",
        goal: "Award Gold Medal for rank 1.",
        hint: "rank = 1 ➔ If rank == 1 print 'Gold Medal' ➔ End.",
        points: 100,
        testCases: [
          {
            id: "l8-c1-t1",
            name: "Gold Medal Award",
            inputs: [],
            expectedOutputs: ["Gold Medal"],
          },
        ],
      },
      {
        id: "l8-c2",
        levelId: "level-8",
        levelNumber: 8,
        title: "Traffic Light AI",
        difficulty: "medium",
        format: "complete",
        formatLabel: "🧩 Complete the Code",
        description: "Ask user for light color ('red', 'yellow', 'green'). If 'red' print 'STOP', else print 'GO'.",
        goal: "Direct traffic safety signals.",
        hint: "Ask color ➔ If color == 'red' print 'STOP' else print 'GO'.",
        points: 125,
        testCases: [
          {
            id: "l8-c2-t1",
            name: "Red Light",
            inputs: ["red"],
            expectedOutputs: ["STOP"],
          },
          {
            id: "l8-c2-t2",
            name: "Green Light",
            inputs: ["green"],
            expectedOutputs: ["GO"],
          },
        ],
      },
      {
        id: "l8-c3",
        levelId: "level-8",
        levelNumber: 8,
        title: "RPG Dungeon Gatekeeper",
        difficulty: "hard",
        format: "real_world",
        formatLabel: "🌍 Real-World App",
        description: "Set key = True, level = 10. If key == True and level >= 5 print 'Gate Unlocked', else print 'Access Denied'.",
        goal: "Verify player inventory and level before opening dungeon gate.",
        hint: "Check both key and level.",
        points: 150,
        testCases: [
          {
            id: "l8-c3-t1",
            name: "Unlocked Gate",
            inputs: [],
            expectedOutputs: ["Gate Unlocked"],
          },
        ],
      },
    ],
  },

  // ── Level 9 ─────────────────────────────────────────────────────────────────
  {
    id: "level-9",
    levelNumber: 9,
    title: "Algorithms & Problem Solving",
    subtitle: "Searching, Accumulating, and Optimizing",
    icon: "Cpu",
    badge: "ALGORITHM GURU",
    description: "Design step-by-step algorithms! Learn accumulator patterns, search logic, and find maximums.",
    requiredChallengesToMaster: 3,
    learning: {
      conceptTitle: "What is an Algorithm?",
      summary: "An algorithm is a clear set of step-by-step instructions designed to solve a specific problem.",
      explanation: [
        "In computer science, common algorithms include finding the largest number, calculating a total sum, or searching a database.",
        "The **Accumulator Pattern** initializes `total = 0`, then loops through values adding to `total`.",
        "The **Max-Finder Pattern** tracks the highest value seen so far.",
      ],
      blockExamples: [
        {
          name: "Accumulator Loop",
          blockType: "repeat",
          purpose: "Accumulates a sum across iterations.",
          exampleCode: "total = 0\nfor x in [10, 20, 30]:\n    total += x",
        },
      ],
      codeSnippets: [
        {
          title: "Summing Numbers",
          pythonCode: "total = 0\nfor i in range(1, 4):\n    total += i\nprint(total)  # 1 + 2 + 3 = 6",
          explanation: "Adds 1, 2, 3 together to compute sum 6.",
        },
      ],
      commonMistakes: [
        {
          mistake: "Resetting the accumulator variable inside the loop body",
          fix: "Initialize total = 0 BEFORE the loop starts.",
          why: "If total = 0 is inside the loop, it resets on every iteration.",
        },
      ],
      keyTakeaways: [
        "Algorithms combine variables, loops, and logic.",
        "Initialize counters and totals outside the loop.",
      ],
    },
    challenges: [
      {
        id: "l9-c1",
        levelId: "level-9",
        levelNumber: 9,
        title: "Sum of First 3 Numbers (1+2+3=6)",
        difficulty: "easy",
        format: "build",
        formatLabel: "🔨 Build from Scratch",
        description: "Set total = 0, add 1, add 2, add 3, and print total (6).",
        goal: "Compute sum of 1+2+3 and print 6.",
        hint: "total = 0 ➔ change total by 1 ➔ change by 2 ➔ change by 3 ➔ Print(total).",
        points: 125,
        testCases: [
          {
            id: "l9-c1-t1",
            name: "Sum is 6",
            inputs: [],
            expectedOutputs: ["6"],
          },
        ],
      },
      {
        id: "l9-c2",
        levelId: "level-9",
        levelNumber: 9,
        title: "Find Maximum Score",
        difficulty: "medium",
        format: "complete",
        formatLabel: "🧩 Complete the Code",
        description: "Set score1 = 45, score2 = 80. If score2 > score1 print 'High Score: 80', else print 'High Score: 45'.",
        goal: "Find and output the maximum score 80.",
        hint: "Compare scores and output the larger one.",
        points: 150,
        testCases: [
          {
            id: "l9-c2-t1",
            name: "High Score 80",
            inputs: [],
            expectedOutputs: ["80", "High Score"],
          },
        ],
      },
      {
        id: "l9-c3",
        levelId: "level-9",
        levelNumber: 9,
        title: "Even or Odd Sorter",
        difficulty: "hard",
        format: "real_world",
        formatLabel: "🌍 Real-World App",
        description: "Ask user for number. If number % 2 == 0 print 'EVEN', else print 'ODD'.",
        goal: "Determine parity of user input integer.",
        hint: "Check remainder of number divided by 2.",
        points: 175,
        testCases: [
          {
            id: "l9-c3-t1",
            name: "Even Number (8)",
            inputs: ["8"],
            expectedOutputs: ["EVEN"],
          },
          {
            id: "l9-c3-t2",
            name: "Odd Number (7)",
            inputs: ["7"],
            expectedOutputs: ["ODD"],
          },
        ],
      },
    ],
  },

  // ── Level 10 ────────────────────────────────────────────────────────────────
  {
    id: "level-10",
    levelNumber: 10,
    title: "Game Engine & Capstone Systems",
    subtitle: "State Management, Boss Battles, and Victory Conditions",
    icon: "Gamepad2",
    badge: "GRAND MASTER",
    description: "The ultimate programming summit! Build complete multi-state video games with health, boss battles, scoreboards, and victory screens.",
    requiredChallengesToMaster: 3,
    learning: {
      conceptTitle: "Building Full Game Systems",
      summary: "A game engine manages game states (Title, Battle, Win, Loss) and updates player stats on every turn.",
      explanation: [
        "Video games combine all 9 previous concepts: variables for state (health, coins, level), loops for the game cycle, and conditionals for win/loss checks.",
        "A **Game Loop** repeats user turns until player health reaches 0 or boss health reaches 0.",
        "State variables track whether the game is currently 'running', 'won', or 'game_over'.",
        "Congratulations on reaching Level 10 — you are now ready to engineer complete software applications!",
      ],
      blockExamples: [
        {
          name: "Complete Game Loop",
          blockType: "while",
          purpose: "Drives continuous turn-based gameplay until resolution.",
          exampleCode: "while player_hp > 0 and boss_hp > 0:\n    # Game round",
        },
      ],
      codeSnippets: [
        {
          title: "Boss Fight Turn Resolver",
          pythonCode: 'player_hp = 100\nboss_hp = 50\ndamage = 50\nboss_hp -= damage\nif boss_hp <= 0:\n    print("🏆 BOSS DEFEATED! YOU WIN! 🏆")',
          explanation: "Inflicts damage to reduce boss HP to 0 and prints victory banner.",
        },
      ],
      commonMistakes: [
        {
          mistake: "Allowing health to drop below 0 without ending game",
          fix: "Always check `if health <= 0` at the end of each round.",
          why: "Ensures the game cleanly triggers the game over state.",
        },
      ],
      keyTakeaways: [
        "Games are systems of interconnected variables and loops.",
        "Clean logic produces engaging, bug-free interactive games.",
      ],
    },
    challenges: [
      {
        id: "l10-c1",
        levelId: "level-10",
        levelNumber: 10,
        title: "Boss Battle Victory Screen",
        difficulty: "easy",
        format: "build",
        formatLabel: "🔨 Build from Scratch",
        description: "Set boss_hp = 50, damage = 50. Calculate remaining = boss_hp - damage. If remaining <= 0 print '🏆 BOSS DEFEATED!'.",
        goal: "Trigger the Boss Defeated victory state.",
        hint: "boss_hp = 50 ➔ damage = 50 ➔ remaining = 0 ➔ If remaining <= 0 print '🏆 BOSS DEFEATED!'.",
        points: 150,
        testCases: [
          {
            id: "l10-c1-t1",
            name: "Boss Defeated",
            inputs: [],
            expectedOutputs: ["BOSS DEFEATED"],
          },
        ],
      },
      {
        id: "l10-c2",
        levelId: "level-10",
        levelNumber: 10,
        title: "Interactive RPG Battle Engine",
        difficulty: "medium",
        format: "complete",
        formatLabel: "🧩 Complete the Code",
        description: "Ask user for attack move ('slash' or 'fire'). If move == 'fire' print 'Critical Hit 50 Damage! Boss Defeated!', else print 'Normal Hit 10 Damage!'.",
        goal: "Resolve dynamic RPG battle outcomes.",
        hint: "Ask move ➔ If move == 'fire' print 'Critical Hit 50 Damage! Boss Defeated!' else print 'Normal Hit 10 Damage!'.",
        points: 200,
        testCases: [
          {
            id: "l10-c2-t1",
            name: "Fire Move",
            inputs: ["fire"],
            expectedOutputs: ["Critical Hit", "Boss Defeated"],
          },
          {
            id: "l10-c2-t2",
            name: "Slash Move",
            inputs: ["slash"],
            expectedOutputs: ["Normal Hit"],
          },
        ],
      },
      {
        id: "l10-c3",
        levelId: "level-10",
        levelNumber: 10,
        title: "TeachFlow Master Capstone Game",
        difficulty: "hard",
        format: "real_world",
        formatLabel: "🌍 Real-World App",
        description: "Ask user for secret password 'FLOW'. If 'FLOW' print '✨ CONGRATULATIONS TEACHFLOW MASTER! 🎓 ✨', else print 'Access Denied'.",
        goal: "Build the master capstone verification engine.",
        hint: "Verify password 'FLOW' and award master status.",
        points: 250,
        testCases: [
          {
            id: "l10-c3-t1",
            name: "Master Unlocked (FLOW)",
            inputs: ["FLOW"],
            expectedOutputs: ["TEACHFLOW MASTER"],
          },
          {
            id: "l10-c3-t2",
            name: "Wrong Code (TEST)",
            inputs: ["TEST"],
            expectedOutputs: ["Access Denied"],
          },
        ],
      },
    ],
  },
];

export interface NextChallengeInfo {
  nextLevel: CodingLevel;
  nextChallenge: LevelChallenge;
  isNextLevel: boolean;
}

export function findChallengeById(challengeId: string): { level: CodingLevel; challenge: LevelChallenge } | null {
  for (const level of CODING_LEVELS) {
    const challenge = level.challenges.find((c) => c.id === challengeId);
    if (challenge) {
      return { level, challenge };
    }
  }
  return null;
}

export function getNextChallenge(
  levelId: string,
  challengeId: string
): NextChallengeInfo | null {
  let lvlIndex = CODING_LEVELS.findIndex((l) => l.id === levelId);

  // If level not found directly, lookup by challengeId
  if (lvlIndex === -1) {
    const found = findChallengeById(challengeId);
    if (found) {
      lvlIndex = CODING_LEVELS.findIndex((l) => l.id === found.level.id);
    }
  }

  if (lvlIndex === -1) return null;

  const currentLevel = CODING_LEVELS[lvlIndex];
  const chIndex = currentLevel.challenges.findIndex((c) => c.id === challengeId);

  if (chIndex !== -1 && chIndex + 1 < currentLevel.challenges.length) {
    return {
      nextLevel: currentLevel,
      nextChallenge: currentLevel.challenges[chIndex + 1],
      isNextLevel: false,
    };
  }

  // Next level's first challenge
  if (lvlIndex + 1 < CODING_LEVELS.length) {
    const nextLevel = CODING_LEVELS[lvlIndex + 1];
    if (nextLevel.challenges.length > 0) {
      return {
        nextLevel,
        nextChallenge: nextLevel.challenges[0],
        isNextLevel: true,
      };
    }
  }

  return null;
}

