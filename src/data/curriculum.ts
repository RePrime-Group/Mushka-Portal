export interface Task {
  id: string;
  stageId: number;
  title: string;
  subtitle: string;
  xp: number;
  description: string;
  whatYouLearn: string;
  claudeFeatures: string[];
}

export interface Stage {
  id: number;
  title: string;
  description: string;
  contextBreakdown: string;
  reflection: string;
  tasks: Task[];
}

export const stages: Stage[] = [
  {
    id: 1,
    title: "Your AI, Your World",
    description: "Start with what you know. Use Claude for your real life — fashion, college, social media, daily planning. Build intuition for how AI thinks before you ever touch business.",
    contextBreakdown: "100% Personal",
    reflection: "Think about a moment this week where Claude surprised you — either by being better than expected or worse than expected. What did that teach you about how AI actually works versus how you assumed it worked?",
    tasks: [
      {
        id: "1.1",
        stageId: 1,
        title: "First Magic Moment",
        subtitle: "Personal / Fashion",
        xp: 200,
        description: "Open Claude and have your first real conversation. Ask it to help you plan outfits for a week based on your schedule, the weather forecast, and your personal style preferences. Push it — give it constraints like budget, dress codes, or specific pieces you want to incorporate. See how it handles specifics versus vague requests.",
        whatYouLearn: "How to give Claude context and constraints to get useful, specific output instead of generic responses.",
        claudeFeatures: ["Basic prompting", "Context setting", "Iterative refinement"],
      },
      {
        id: "1.2",
        stageId: 1,
        title: "Make Claude Know You",
        subtitle: "Personal / College",
        xp: 200,
        description: "Create a detailed personal context document for Claude. Include your college major, course load, study preferences, learning style, schedule, and goals. Then ask Claude to create a personalized study plan for your hardest current class. Compare the output before and after giving it your context.",
        whatYouLearn: "How system prompts and context documents dramatically improve AI output quality.",
        claudeFeatures: ["System prompts", "Context documents", "Before/after comparison"],
      },
      {
        id: "1.3",
        stageId: 1,
        title: "Content Creator Challenge",
        subtitle: "Personal / Social Media",
        xp: 200,
        description: "Use Claude to plan a week of social media content. Give it your brand voice, your audience, your goals, and the platforms you use. Ask it to generate captions, suggest posting times, and create a content calendar. Then critically evaluate: which suggestions are actually good and which are generic?",
        whatYouLearn: "How to evaluate AI output critically and identify when AI is being genuinely helpful versus generating filler.",
        claudeFeatures: ["Structured output", "Critical evaluation", "Voice matching"],
      },
      {
        id: "1.4",
        stageId: 1,
        title: "The Lie Detector",
        subtitle: "Personal / College",
        xp: 200,
        description: "Ask Claude factual questions about topics from your classes — some where you know the answer and some where you don't. Catch it when it's wrong or uncertain. Ask it to cite sources and then verify them. Develop your instinct for when AI is confident and correct versus confident and wrong.",
        whatYouLearn: "How to identify AI hallucinations, verify claims, and understand AI confidence versus accuracy.",
        claudeFeatures: ["Fact verification", "Source citation", "Hallucination detection"],
      },
      {
        id: "1.5",
        stageId: 1,
        title: "Organize My Life",
        subtitle: "Personal / Daily Life",
        xp: 200,
        description: "Give Claude your actual weekly schedule, commitments, and priorities. Ask it to help you optimize your time, identify conflicts, suggest efficiency improvements, and create a realistic daily routine. Include real constraints — commute time, energy levels, social commitments.",
        whatYouLearn: "How to use AI as a thinking partner for personal productivity and decision-making.",
        claudeFeatures: ["Complex constraint handling", "Structured planning", "Practical output"],
      },
    ],
  },
  {
    id: 2,
    title: "Leveling Up",
    description: "Master the techniques that separate casual AI users from power users. Learn role assignment, chain-of-thought prompting, XML tags, prompt chaining, and model selection.",
    contextBreakdown: "70% Personal, 30% Business",
    reflection: "You've now learned role assignment, examples, chain of thought, XML tags, prompt chaining, and model selection. Which single technique changed your results the most? Why do you think that technique was the breakthrough for you specifically?",
    tasks: [
      {
        id: "2.1",
        stageId: 2,
        title: "The Persona Lab",
        subtitle: "Personal → Semi-Professional",
        xp: 400,
        description: "Assign Claude different expert roles and compare the output. Ask the same question to 'a college professor,' 'a fashion industry expert,' 'a career coach,' and 'a financial advisor.' Document how the role changes the advice. Then create a custom role that combines the expertise you actually need.",
        whatYouLearn: "How role assignment shapes AI output and how to design custom personas for your specific needs.",
        claudeFeatures: ["Role assignment", "Persona design", "Comparative analysis"],
      },
      {
        id: "2.2",
        stageId: 2,
        title: "Show, Don't Tell",
        subtitle: "Personal / Content Creation",
        xp: 400,
        description: "Learn few-shot prompting by teaching Claude your writing style. Provide 3-5 examples of content you've written (social posts, emails, essays) and ask Claude to write new content matching your voice. Compare zero-shot (no examples) versus few-shot (with examples) output side by side.",
        whatYouLearn: "How examples dramatically improve AI output quality and how few-shot prompting works.",
        claudeFeatures: ["Few-shot prompting", "Style matching", "Example-based learning"],
      },
      {
        id: "2.3",
        stageId: 2,
        title: "Think It Through",
        subtitle: "Semi-Professional / Decisions",
        xp: 400,
        description: "Use chain-of-thought prompting for a real decision you're facing (career choice, major decision, purchase decision). Ask Claude to think step by step, showing its reasoning at each stage. Then use XML tags to structure the output: <pros>, <cons>, <risks>, <recommendation>. Compare unstructured vs. structured output.",
        whatYouLearn: "How chain-of-thought prompting improves reasoning quality and how XML tags create structured, scannable output.",
        claudeFeatures: ["Chain-of-thought", "XML tags", "Structured reasoning"],
      },
      {
        id: "2.4",
        stageId: 2,
        title: "The Event Planner",
        subtitle: "Semi-Professional / Events",
        xp: 400,
        description: "Plan a real or hypothetical professional event using prompt chaining. Step 1: brainstorm themes and concepts. Step 2: take the best concept and create a detailed timeline. Step 3: use the timeline to generate a budget estimate. Step 4: create promotional copy. Each step builds on the previous output.",
        whatYouLearn: "How prompt chaining breaks complex tasks into manageable steps where each output feeds the next.",
        claudeFeatures: ["Prompt chaining", "Multi-step workflows", "Output as input"],
      },
      {
        id: "2.5",
        stageId: 2,
        title: "Model Matchmaker",
        subtitle: "Mixed / Comparative",
        xp: 400,
        description: "Learn when to use different Claude models. Take the same task and run it on Claude Haiku (fast, cheap), Claude Sonnet (balanced), and Claude Opus (most capable). Document the differences in quality, speed, and usefulness. Create your own decision framework for which model to use when.",
        whatYouLearn: "How to select the right AI model for different tasks based on complexity, speed, and cost trade-offs.",
        claudeFeatures: ["Model selection", "Cost-quality tradeoffs", "Decision frameworks"],
      },
    ],
  },
  {
    id: 3,
    title: "Building Bridges",
    description: "Transition from personal to professional. Apply your AI skills to real business contexts, learn document creation, data analysis, and get your first introduction to commercial real estate.",
    contextBreakdown: "40% Personal, 40% Business, 20% CRE",
    reflection: "You've now used AI for personal and business tasks. What surprised you about the transition? Was it harder or easier than expected? What do you still need to learn about CRE before you can fully trust your AI-generated business analysis?",
    tasks: [
      {
        id: "3.1",
        stageId: 3,
        title: "The Parallel Universe Bridge",
        subtitle: "Personal → Business",
        xp: 500,
        description: "Take a personal AI workflow you built in Stages 1-2 and translate it into a business context. If you planned outfits, now plan a professional wardrobe for client meetings. If you organized your schedule, now optimize a team's weekly workflow. Document what changes when stakes go from personal to professional.",
        whatYouLearn: "How to transfer personal AI skills to professional contexts and what changes when the audience and stakes shift.",
        claudeFeatures: ["Context transfer", "Professional tone", "Stakeholder awareness"],
      },
      {
        id: "3.2",
        stageId: 3,
        title: "Business Document Bootcamp",
        subtitle: "General Business",
        xp: 500,
        description: "Use Claude to create three professional business documents: a meeting agenda, an executive summary, and a project status update. For each, provide real context about RePrime Group or a business you're familiar with. Use role assignment, XML tags, and structured output techniques from Stage 2.",
        whatYouLearn: "How to produce professional-quality business documents using advanced prompting techniques.",
        claudeFeatures: ["Professional document creation", "Template design", "Tone calibration"],
      },
      {
        id: "3.3",
        stageId: 3,
        title: "Data Detective",
        subtitle: "General Business → CRE Intro",
        xp: 500,
        description: "Give Claude a dataset (real or hypothetical business data — sales figures, market data, or property metrics). Ask it to identify trends, anomalies, and insights. Practice asking follow-up questions to go deeper. Learn how AI handles quantitative versus qualitative analysis.",
        whatYouLearn: "How to use AI for data analysis, pattern recognition, and turning raw numbers into actionable insights.",
        claudeFeatures: ["Data analysis", "Follow-up questioning", "Insight extraction"],
      },
      {
        id: "3.4",
        stageId: 3,
        title: "Meet the Business",
        subtitle: "CRE Introduction",
        xp: 500,
        description: "Ask Claude to explain commercial real estate fundamentals as if you're a smart, motivated 19-year-old joining a CRE firm. Cover: property types, key metrics (cap rate, NOI, occupancy), market cycles, and how CRE differs from residential. Create a personal CRE glossary you'll reference in later stages.",
        whatYouLearn: "CRE industry fundamentals and how to use AI to rapidly learn a new professional domain.",
        claudeFeatures: ["Domain learning", "Glossary creation", "Adaptive explanation"],
      },
      {
        id: "3.5",
        stageId: 3,
        title: "AI Strategy Memo",
        subtitle: "Business Strategy",
        xp: 500,
        description: "Write a one-page strategic memo analyzing how a company (RePrime Group or another business) could use AI to improve three specific business processes. Use chain-of-thought for analysis, XML tags for structure, and role assignment (you're a junior strategy analyst). Include risks, costs, and implementation timeline.",
        whatYouLearn: "How to produce a real strategic deliverable that combines AI analysis with professional business writing.",
        claudeFeatures: ["Strategic analysis", "Multi-technique integration", "Professional deliverables"],
      },
    ],
  },
  {
    id: 4,
    title: "The Real Deal",
    description: "Build real AI tools for real business use. Analyze CRE deals, create market intelligence, evaluate AI products, design team workspaces, and draft governance policy.",
    contextBreakdown: "15% Personal, 25% Business, 60% CRE",
    reflection: "You've built real AI tools for a real business team. What's the difference between knowing how to use AI and knowing how to make AI useful for other people? What did you have to understand about the team's work that AI alone couldn't tell you?",
    tasks: [
      {
        id: "4.1",
        stageId: 4,
        title: "The CRE Analyst",
        subtitle: "CRE-Specific",
        xp: 600,
        description: "Analyze a real or realistic CRE deal using Claude. Input property details, financial metrics, market conditions, and comparable sales. Ask Claude to evaluate the investment, identify risks, calculate key metrics, and produce a one-page investment summary. Use your CRE glossary from Stage 3.",
        whatYouLearn: "How to use AI for CRE deal analysis and investment evaluation with real financial metrics.",
        claudeFeatures: ["Financial analysis", "Risk assessment", "Investment memo creation"],
      },
      {
        id: "4.2",
        stageId: 4,
        title: "Market Intelligence Machine",
        subtitle: "CRE-Specific",
        xp: 600,
        description: "Build a market intelligence workflow using Claude. Research a specific CRE market (pick a city or submarket). Create a comprehensive market report covering: supply/demand dynamics, rental trends, major transactions, development pipeline, and economic drivers. Use prompt chaining — each section builds on the previous.",
        whatYouLearn: "How to build multi-step research workflows and produce comprehensive market intelligence reports.",
        claudeFeatures: ["Research workflows", "Market analysis", "Report generation"],
      },
      {
        id: "4.3",
        stageId: 4,
        title: "System Evaluator",
        subtitle: "AI Leadership / CRE",
        xp: 600,
        description: "Evaluate three real AI tools or platforms that could be useful for a CRE company (e.g., property valuation tools, market data platforms, document analysis systems). Create an evaluation matrix comparing features, cost, integration effort, and ROI. Present a recommendation with justification.",
        whatYouLearn: "How to evaluate AI products as a business leader, not just a user — thinking about ROI, integration, and team adoption.",
        claudeFeatures: ["Product evaluation", "Decision matrices", "ROI analysis"],
      },
      {
        id: "4.4",
        stageId: 4,
        title: "The Team Workspace Architect",
        subtitle: "CRE / Team Management",
        xp: 600,
        description: "Design an AI-enhanced workspace for a CRE team. Define: which team members use AI for what tasks, standard prompts and templates, quality control processes, and training needs. Create a practical implementation plan that a real team could follow. Think about resistance, adoption curves, and change management.",
        whatYouLearn: "How to design AI workflows for teams, not just individuals, including change management and adoption strategy.",
        claudeFeatures: ["Workflow design", "Template creation", "Team implementation planning"],
      },
      {
        id: "4.5",
        stageId: 4,
        title: "The Governance Brief",
        subtitle: "AI Leadership / Ethics",
        xp: 600,
        description: "Write an AI governance policy for a CRE company. Cover: acceptable use cases, data privacy rules, quality assurance requirements, prohibited uses, client confidentiality protections, and review processes. This should be a real, usable document — not a theoretical exercise.",
        whatYouLearn: "How to think about AI governance, ethics, and risk management as a business leader.",
        claudeFeatures: ["Policy creation", "Risk management", "Governance frameworks"],
      },
    ],
  },
  {
    id: 5,
    title: "MushkaShines",
    description: "You've learned AI. Now teach it. Create training programs, build your professional identity, develop AI strategy, and lead a real workshop for the RePrime team.",
    contextBreakdown: "10% Personal, 30% Business, 60% CRE + AI Leadership",
    reflection: "When you started this program, you'd never written a structured prompt. Now you've taught a team of professionals. Look at who you were on Day 1 and who you are now. Not what you know — who you are. What changed?",
    tasks: [
      {
        id: "5.1",
        stageId: 5,
        title: "Lunch & Learn",
        subtitle: "Teaching / RePrime Team",
        xp: 500,
        description: "Create a 30-minute Lunch & Learn presentation for the RePrime Group team. Topic: 'How to Get Better Results from AI in 5 Minutes.' Include hands-on examples, before/after prompts, and quick wins they can use immediately. Make it practical, not theoretical.",
        whatYouLearn: "How to teach AI skills to professionals and translate your knowledge into actionable training.",
        claudeFeatures: ["Presentation creation", "Teaching methodology", "Practical examples"],
      },
      {
        id: "5.2",
        stageId: 5,
        title: "The AI Training Program",
        subtitle: "AI Leadership / Teaching",
        xp: 500,
        description: "Design a 4-week AI training program for new employees at a CRE company. Define learning objectives, weekly curriculum, hands-on exercises, evaluation criteria, and success metrics. Use everything you've learned about progressive skill building from your own training journey.",
        whatYouLearn: "How to design structured AI training programs and define measurable learning outcomes.",
        claudeFeatures: ["Curriculum design", "Learning objectives", "Assessment creation"],
      },
      {
        id: "5.3",
        stageId: 5,
        title: "MushkaShines.com — The Identity Capstone",
        subtitle: "Personal Identity / Professional Brand",
        xp: 500,
        description: "Design your professional AI identity. Create the content for a personal website (MushkaShines.com) that showcases your AI journey, skills, and perspective. Include: your AI philosophy, key projects from this training, testimonials framework, and a blog post about what you've learned. This is your professional brand.",
        whatYouLearn: "How to articulate your AI expertise as a professional identity and build a personal brand around your skills.",
        claudeFeatures: ["Personal branding", "Content strategy", "Portfolio creation"],
      },
      {
        id: "5.4",
        stageId: 5,
        title: "AI Strategy for Year Two",
        subtitle: "CRE / Strategic Leadership",
        xp: 500,
        description: "Write a strategic plan for how RePrime Group should expand its AI capabilities over the next 12 months. Cover: current state assessment, opportunity analysis, resource requirements, risk mitigation, quarterly milestones, and success metrics. This should be a boardroom-ready document.",
        whatYouLearn: "How to think and write as an AI strategist, producing leadership-level strategic recommendations.",
        claudeFeatures: ["Strategic planning", "Executive communication", "Roadmap creation"],
      },
      {
        id: "5.5",
        stageId: 5,
        title: "The Full Workshop",
        subtitle: "Teaching / Team Leadership",
        xp: 500,
        description: "Design and plan a 2-hour hands-on AI workshop for the entire RePrime Group team. Include: agenda, facilitation guide, hands-on exercises with real CRE scenarios, troubleshooting guide for common issues, feedback collection plan, and follow-up resources. This is your capstone — prove you can lead, not just learn.",
        whatYouLearn: "How to lead AI training for a professional team, managing group dynamics, varying skill levels, and practical application.",
        claudeFeatures: ["Workshop design", "Facilitation planning", "Team leadership"],
      },
    ],
  },
];

export const celebrationMessages: Record<string, string> = {
  "task-1.1": "You just had your first real conversation with AI. Two weeks ago, you'd never written a structured prompt. Look at you now.",
  "stage-1": "Stage 1 complete. You now understand more about working with AI than most professionals twice your age. Not because you're comparing yourself to them — because the data actually says this.",
  "task-3.5": "You just wrote a real strategic memo for a real business. That's not a training exercise — that's real work that matters.",
  "stage-4": "You've built AI systems that a real team can use. You've evaluated products. You've written governance policy. The word for what you are now is operator.",
  "task-5.5": "You taught a room full of professionals something they didn't know. You started this program to learn AI. You're ending it as someone who teaches it.",
};

export const growthMindsetMessages = [
  "Struggled with this one? Good. That means you're learning something new, not reviewing something easy.",
  "This exercise is hard because it's at the edge of what you can do. That edge is exactly where growth happens.",
  "The fact that this took time doesn't mean you're slow — it means this is real learning, not just clicking through.",
  "Real expertise isn't about getting things right the first time. It's about knowing how to figure things out.",
  "Every expert was once a beginner who didn't quit. You're building something that lasts.",
];

export const identityTitles: { threshold: number; title: string }[] = [
  { threshold: 0, title: "Beginner" },
  { threshold: 1000, title: "Explorer" },
  { threshold: 3000, title: "Builder" },
  { threshold: 5500, title: "Strategist" },
  { threshold: 8500, title: "Operator" },
  { threshold: 11000, title: "Leader" },
];

export function getIdentityTitle(xp: number): string {
  let title = "Beginner";
  for (const level of identityTitles) {
    if (xp >= level.threshold) {
      title = level.title;
    }
  }
  return title;
}

export function getTaskXP(taskId: string): number {
  for (const stage of stages) {
    for (const task of stage.tasks) {
      if (task.id === taskId) return task.xp;
    }
  }
  return 0;
}

export const TOTAL_XP = 11000;
