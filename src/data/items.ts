import type { AssessmentItem, AssessmentOption } from '../store/types';

// ============================================
// INSTRUMENT 1: NGSE (8 items, 5-point Likert)
// Source: Chen, Gully & Eden (2001)
// ============================================
// Response anchors: 1=Strongly Disagree, 2=Disagree, 3=Neither, 4=Agree, 5=Strongly Agree
// Reverse-scored: NONE

const LIKERT_5_AGREE: AssessmentOption[] = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neither Agree nor Disagree' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
];

export const NGSE_ITEMS: AssessmentItem[] = [
  {
    id: 'ngse_1', instrumentId: 'ngse', itemNumber: 1,
    text: 'I will be able to achieve most of the goals that I have set for myself.',
    type: 'likert5', options: LIKERT_5_AGREE, reverseScored: false, isInfrequency: false,
  },
  {
    id: 'ngse_2', instrumentId: 'ngse', itemNumber: 2,
    text: 'When facing difficult tasks, I am certain that I will accomplish them.',
    type: 'likert5', options: LIKERT_5_AGREE, reverseScored: false, isInfrequency: false,
  },
  {
    id: 'ngse_3', instrumentId: 'ngse', itemNumber: 3,
    text: 'In general, I think that I can obtain outcomes that are important to me.',
    type: 'likert5', options: LIKERT_5_AGREE, reverseScored: false, isInfrequency: false,
  },
  {
    id: 'ngse_4', instrumentId: 'ngse', itemNumber: 4,
    text: 'I believe I can succeed at most any endeavor to which I set my mind.',
    type: 'likert5', options: LIKERT_5_AGREE, reverseScored: false, isInfrequency: false,
  },
  {
    id: 'ngse_5', instrumentId: 'ngse', itemNumber: 5,
    text: 'I will be able to successfully overcome many challenges.',
    type: 'likert5', options: LIKERT_5_AGREE, reverseScored: false, isInfrequency: false,
  },
  {
    id: 'ngse_6', instrumentId: 'ngse', itemNumber: 6,
    text: 'I am confident that I can perform effectively on many different tasks.',
    type: 'likert5', options: LIKERT_5_AGREE, reverseScored: false, isInfrequency: false,
  },
  {
    id: 'ngse_7', instrumentId: 'ngse', itemNumber: 7,
    text: 'Compared to other people, I can do most tasks very well.',
    type: 'likert5', options: LIKERT_5_AGREE, reverseScored: false, isInfrequency: false,
  },
  {
    id: 'ngse_8', instrumentId: 'ngse', itemNumber: 8,
    text: 'Even when things are tough, I can perform quite well.',
    type: 'likert5', options: LIKERT_5_AGREE, reverseScored: false, isInfrequency: false,
  },
];

// ============================================
// INSTRUMENT 2: MSLQ Self-Efficacy (8 items, 7-point Likert)
// Source: Pintrich et al. (1991) — ADAPTED: "this course" → "this training program"
// ============================================
// Response anchors: 1=Not at all true of me ... 7=Very true of me
// Reverse-scored: NONE

const LIKERT_7_TRUE: AssessmentOption[] = [
  { value: 1, label: 'Not at all true of me' },
  { value: 2, label: 'Not very true of me' },
  { value: 3, label: 'Slightly true of me' },
  { value: 4, label: 'Somewhat true of me' },
  { value: 5, label: 'Fairly true of me' },
  { value: 6, label: 'True of me' },
  { value: 7, label: 'Very true of me' },
];

export const MSLQ_SE_ITEMS: AssessmentItem[] = [
  {
    id: 'mslq_5', instrumentId: 'mslq_se', itemNumber: 1,
    text: 'I believe I will receive an excellent result in this training program.',
    type: 'likert7', options: LIKERT_7_TRUE, reverseScored: false, isInfrequency: false,
  },
  {
    id: 'mslq_6', instrumentId: 'mslq_se', itemNumber: 2,
    text: "I'm certain I can understand the most difficult material presented in this training program.",
    type: 'likert7', options: LIKERT_7_TRUE, reverseScored: false, isInfrequency: false,
  },
  {
    id: 'mslq_12', instrumentId: 'mslq_se', itemNumber: 3,
    text: "I'm confident I can understand the basic concepts taught in this training program.",
    type: 'likert7', options: LIKERT_7_TRUE, reverseScored: false, isInfrequency: false,
  },
  {
    id: 'mslq_15', instrumentId: 'mslq_se', itemNumber: 4,
    text: "I'm confident I can understand the most complex material presented in this training program.",
    type: 'likert7', options: LIKERT_7_TRUE, reverseScored: false, isInfrequency: false,
  },
  {
    id: 'mslq_20', instrumentId: 'mslq_se', itemNumber: 5,
    text: "I'm confident I can do an excellent job on the assignments and exercises in this training program.",
    type: 'likert7', options: LIKERT_7_TRUE, reverseScored: false, isInfrequency: false,
  },
  {
    id: 'mslq_21', instrumentId: 'mslq_se', itemNumber: 6,
    text: 'I expect to do well in this training program.',
    type: 'likert7', options: LIKERT_7_TRUE, reverseScored: false, isInfrequency: false,
  },
  {
    id: 'mslq_29', instrumentId: 'mslq_se', itemNumber: 7,
    text: "I'm certain I can master the skills being taught in this training program.",
    type: 'likert7', options: LIKERT_7_TRUE, reverseScored: false, isInfrequency: false,
  },
  {
    id: 'mslq_31', instrumentId: 'mslq_se', itemNumber: 8,
    text: 'Considering the difficulty of this training program, the content, and my skills, I think I will do well.',
    type: 'likert7', options: LIKERT_7_TRUE, reverseScored: false, isInfrequency: false,
  },
];

// ============================================
// INSTRUMENT 3: Short Grit Scale (8 items, 5-point Likert)
// Source: Duckworth & Quinn (2009)
// ============================================
// Response anchors: 1=Not at all like me ... 5=Very much like me
// Reverse-scored: Items 1, 3, 5, 6 (Consistency of Interest subscale)
// Reverse formula for 5-point: 6 - raw

const LIKERT_5_LIKE: AssessmentOption[] = [
  { value: 1, label: 'Not at all like me' },
  { value: 2, label: 'Not much like me' },
  { value: 3, label: 'Somewhat like me' },
  { value: 4, label: 'Mostly like me' },
  { value: 5, label: 'Very much like me' },
];

export const GRIT_ITEMS: AssessmentItem[] = [
  {
    id: 'grit_1', instrumentId: 'grit', itemNumber: 1,
    text: 'New ideas and projects sometimes distract me from previous ones.',
    type: 'likert5', options: LIKERT_5_LIKE,
    reverseScored: true, subscale: 'consistency', isInfrequency: false,
  },
  {
    id: 'grit_2', instrumentId: 'grit', itemNumber: 2,
    text: "Setbacks don't discourage me.",
    type: 'likert5', options: LIKERT_5_LIKE,
    reverseScored: false, subscale: 'perseverance', isInfrequency: false,
  },
  {
    id: 'grit_3', instrumentId: 'grit', itemNumber: 3,
    text: 'I have been obsessed with a certain idea or project for a short time but later lost interest.',
    type: 'likert5', options: LIKERT_5_LIKE,
    reverseScored: true, subscale: 'consistency', isInfrequency: false,
  },
  {
    id: 'grit_4', instrumentId: 'grit', itemNumber: 4,
    text: 'I am a hard worker.',
    type: 'likert5', options: LIKERT_5_LIKE,
    reverseScored: false, subscale: 'perseverance', isInfrequency: false,
  },
  {
    id: 'grit_5', instrumentId: 'grit', itemNumber: 5,
    text: 'I often set a goal but later choose to pursue a different one.',
    type: 'likert5', options: LIKERT_5_LIKE,
    reverseScored: true, subscale: 'consistency', isInfrequency: false,
  },
  {
    id: 'grit_6', instrumentId: 'grit', itemNumber: 6,
    text: 'I have difficulty maintaining my focus on projects that take more than a few months to complete.',
    type: 'likert5', options: LIKERT_5_LIKE,
    reverseScored: true, subscale: 'consistency', isInfrequency: false,
  },
  {
    id: 'grit_7', instrumentId: 'grit', itemNumber: 7,
    text: 'I finish whatever I begin.',
    type: 'likert5', options: LIKERT_5_LIKE,
    reverseScored: false, subscale: 'perseverance', isInfrequency: false,
  },
  {
    id: 'grit_8', instrumentId: 'grit', itemNumber: 8,
    text: 'I am diligent.',
    type: 'likert5', options: LIKERT_5_LIKE,
    reverseScored: false, subscale: 'perseverance', isInfrequency: false,
  },
];

// ============================================
// INSTRUMENT 4: MSLQ Metacognitive Self-Regulation Abbreviated (6 items, 7-point Likert)
// Source: Pintrich et al. (1991) — top 6 CFA loading items
// ============================================
// Response anchors: Same as MSLQ-SE (7-point true of me)
// Reverse-scored: NONE

export const META_ITEMS: AssessmentItem[] = [
  {
    id: 'meta_76', instrumentId: 'metacognition', itemNumber: 1,
    text: "When studying for this training program, I try to determine which concepts I don't understand well.",
    type: 'likert7', options: LIKERT_7_TRUE, reverseScored: false, isInfrequency: false,
  },
  {
    id: 'meta_61', instrumentId: 'metacognition', itemNumber: 2,
    text: 'I try to think through a topic and decide what I am supposed to learn from it rather than just reading it over.',
    type: 'likert7', options: LIKERT_7_TRUE, reverseScored: false, isInfrequency: false,
  },
  {
    id: 'meta_55', instrumentId: 'metacognition', itemNumber: 3,
    text: 'I ask myself questions to make sure I understand the material I have been studying in this training program.',
    type: 'likert7', options: LIKERT_7_TRUE, reverseScored: false, isInfrequency: false,
  },
  {
    id: 'meta_78', instrumentId: 'metacognition', itemNumber: 4,
    text: 'When I study for this training program, I set goals for myself in order to direct my activities in each study period.',
    type: 'likert7', options: LIKERT_7_TRUE, reverseScored: false, isInfrequency: false,
  },
  {
    id: 'meta_44', instrumentId: 'metacognition', itemNumber: 5,
    text: 'If training materials are difficult to understand, I change the way I read the material.',
    type: 'likert7', options: LIKERT_7_TRUE, reverseScored: false, isInfrequency: false,
  },
  {
    id: 'meta_54', instrumentId: 'metacognition', itemNumber: 6,
    text: 'Before I study new training material thoroughly, I often skim it to see how it is organized.',
    type: 'likert7', options: LIKERT_7_TRUE, reverseScored: false, isInfrequency: false,
  },
];

// ============================================
// INSTRUMENT 5: AI Prior Knowledge (5 items, multiple choice)
// Source: Custom scenario-based items
// ============================================
// Scored: 1 (correct) or 0 (incorrect). Sum of correct = 0-5.

export const AI_KNOWLEDGE_ITEMS: AssessmentItem[] = [
  {
    id: 'ai_1', instrumentId: 'ai_knowledge', itemNumber: 1,
    text: 'Your manager asks you to summarize a 20-page market report by end of day. You decide to use an AI chat tool. What is the MOST effective approach?',
    type: 'knowledge',
    options: [
      { value: 'A', label: 'Paste the entire report into one message and ask "Summarize this"', prefix: 'A' },
      { value: 'B', label: 'Ask the AI to search the internet for a summary of the report', prefix: 'B' },
      { value: 'C', label: 'Break the report into sections, paste each one, ask the AI to summarize each section, then ask it to combine the summaries into an executive overview', prefix: 'C' },
      { value: 'D', label: 'Ask the AI to write a market report on the same topic instead', prefix: 'D' },
    ],
    reverseScored: false, isInfrequency: false, correctAnswer: 'C',
  },
  {
    id: 'ai_2', instrumentId: 'ai_knowledge', itemNumber: 2,
    text: 'You notice that every time you use a particular AI chatbot at work, it always responds in a formal business tone and includes a disclaimer about not being financial advice. A coworker\'s version of the same chatbot is casual and never includes disclaimers. What is the most likely explanation?',
    type: 'knowledge',
    options: [
      { value: 'A', label: 'The chatbots are running different AI models', prefix: 'A' },
      { value: 'B', label: 'Each chatbot has different system instructions that shape its behavior before the user even types anything', prefix: 'B' },
      { value: 'C', label: "Your computer settings are affecting the AI's personality", prefix: 'C' },
      { value: 'D', label: 'The AI learned your preference over time and adapted', prefix: 'D' },
    ],
    reverseScored: false, isInfrequency: false, correctAnswer: 'B',
  },
  {
    id: 'ai_3', instrumentId: 'ai_knowledge', itemNumber: 3,
    text: 'Your company is choosing between three AI tools for different tasks. Which statement is MOST accurate?',
    type: 'knowledge',
    options: [
      { value: 'A', label: "All AI chatbots use the same underlying technology, so it doesn't matter which one you choose", prefix: 'A' },
      { value: 'B', label: 'Different AI models have different strengths \u2014 some are better at analysis, some at creative writing, some at coding \u2014 and the right choice depends on the task', prefix: 'B' },
      { value: 'C', label: 'The most expensive AI is always the best choice for any task', prefix: 'C' },
      { value: 'D', label: 'AI chatbots can only handle text, so you need separate tools for images and data', prefix: 'D' },
    ],
    reverseScored: false, isInfrequency: false, correctAnswer: 'B',
  },
  {
    id: 'ai_4', instrumentId: 'ai_knowledge', itemNumber: 4,
    text: "You ask an AI to provide the current vacancy rate for Class B office space in Des Moines, Iowa. The AI responds with \"The current vacancy rate is 14.3% according to CBRE's Q3 2025 report.\" What should you do FIRST?",
    type: 'knowledge',
    options: [
      { value: 'A', label: 'Use the number in your report \u2014 the AI cited a specific source so it must be accurate', prefix: 'A' },
      { value: 'B', label: 'Verify the claim independently \u2014 AI models can generate plausible-sounding but fabricated statistics and citations', prefix: 'B' },
      { value: 'C', label: "Ask the AI if it's sure, and if it says yes, trust it", prefix: 'C' },
      { value: 'D', label: "Assume the number is wrong because AI can't access real-time data", prefix: 'D' },
    ],
    reverseScored: false, isInfrequency: false, correctAnswer: 'B',
  },
  {
    id: 'ai_5', instrumentId: 'ai_knowledge', itemNumber: 5,
    text: "Your company wants to automatically send every new property listing through an AI analysis before a human reviews it. The listing data lives in your company's database. What is the most accurate description of what's needed?",
    type: 'knowledge',
    options: [
      { value: 'A', label: 'Someone needs to copy and paste each listing into the AI chat window manually', prefix: 'A' },
      { value: 'B', label: "The AI needs to be installed on the company's server", prefix: 'B' },
      { value: 'C', label: "A developer needs to connect the company's database to the AI through an API \u2014 a standardized way for software systems to communicate with each other", prefix: 'C' },
      { value: 'D', label: 'The company needs to train its own AI model on the listing data', prefix: 'D' },
    ],
    reverseScored: false, isInfrequency: false, correctAnswer: 'C',
  },
];

// ============================================
// INSTRUMENT 6: Technology Comfort (3 items, 6-point Likert)
// Source: Custom, BITS framework (Weigold & Weigold 2021)
// ============================================
// Stem: "How confident are you that you can..."
// Response anchors: 1=Not at all confident ... 6=Completely confident
// Reverse-scored: NONE

const LIKERT_6_CONFIDENT: AssessmentOption[] = [
  { value: 1, label: 'Not at all confident' },
  { value: 2, label: 'Slightly confident' },
  { value: 3, label: 'Somewhat confident' },
  { value: 4, label: 'Fairly confident' },
  { value: 5, label: 'Very confident' },
  { value: 6, label: 'Completely confident' },
];

export const TECH_COMFORT_ITEMS: AssessmentItem[] = [
  {
    id: 'tech_1', instrumentId: 'tech_comfort', itemNumber: 1,
    text: 'How confident are you that you can learn to use a new app or software tool on your own without help?',
    type: 'likert6', options: LIKERT_6_CONFIDENT, reverseScored: false, isInfrequency: false,
  },
  {
    id: 'tech_2', instrumentId: 'tech_comfort', itemNumber: 2,
    text: "How confident are you that you can figure out why a website or app isn't working and fix the problem?",
    type: 'likert6', options: LIKERT_6_CONFIDENT, reverseScored: false, isInfrequency: false,
  },
  {
    id: 'tech_3', instrumentId: 'tech_comfort', itemNumber: 3,
    text: "How confident are you that you can explain to someone else how to use a digital tool you've learned?",
    type: 'likert6', options: LIKERT_6_CONFIDENT, reverseScored: false, isInfrequency: false,
  },
];

// ============================================
// INFREQUENCY ITEMS (3 items — NOT scored, validity check only)
// ============================================
// These detect careless responding. Flag if response = 5 (Strongly Agree).
// Insert at rotation positions 10, 22, 35.

export const INFREQUENCY_ITEMS: AssessmentItem[] = [
  {
    id: 'inf_1', instrumentId: 'infrequency', itemNumber: 1,
    text: 'I have never made a mistake when using a computer.',
    type: 'likert5', options: LIKERT_5_AGREE,
    reverseScored: false, isInfrequency: true, flagIf: 5,
  },
  {
    id: 'inf_2', instrumentId: 'infrequency', itemNumber: 2,
    text: 'I understand every concept perfectly the first time I encounter it.',
    type: 'likert5', options: LIKERT_5_AGREE,
    reverseScored: false, isInfrequency: true, flagIf: 5,
  },
  {
    id: 'inf_3', instrumentId: 'infrequency', itemNumber: 3,
    text: 'I have never felt frustrated when learning something new.',
    type: 'likert5', options: LIKERT_5_AGREE,
    reverseScored: false, isInfrequency: true, flagIf: 5,
  },
];

// Master export of all items (unordered — rotation order is separate)
export const ALL_ITEMS: AssessmentItem[] = [
  ...NGSE_ITEMS, ...MSLQ_SE_ITEMS, ...GRIT_ITEMS,
  ...META_ITEMS, ...AI_KNOWLEDGE_ITEMS, ...TECH_COMFORT_ITEMS,
  ...INFREQUENCY_ITEMS,
];
