import { QuestItem } from '../types/hunter';

export const DAILY_QUESTS_30_DAYS: QuestItem[] = [
  {
    questId: 'q-day-1',
    dayNumber: 1,
    title: 'Initial Assessment & Baseline Observation',
    category: 'Observation & Focus',
    difficulty: 'E-RANK',
    objective: 'Establish awareness baseline and practice initial focus.',
    instructions: [
      'Observe your immediate study environment for 2 full minutes.',
      'Close your eyes and mentally recall at least 10 specific objects.',
      'Complete a 20-minute uninterrupted focused study session.',
      'Write down three of your main personal discipline weaknesses.',
      'Perform 3 minutes of controlled 4-4-4 breathing.'
    ],
    duration: '35 mins',
    criteria: 'Recall 10 items accurately & complete 20m study session without phone checking.',
    reflectionQuestion: 'Kaunsi teen weaknesses identify ki aur room ki 10 objects recall karne mein accuracy kitni thi?',
    status: 'pending'
  },
  {
    questId: 'q-day-2',
    dayNumber: 2,
    title: 'Environmental Detail Identification',
    category: 'Observation Training',
    difficulty: 'E-RANK',
    objective: 'Notice subtle environmental changes and ignored details.',
    instructions: [
      'Observe 5 subtle details in your room that you normally ignore.',
      'Compare today’s environment with yesterday’s memory.',
      'Execute a 25-minute distraction-free study block.',
      'Log any moment your mind tried to wander.'
    ],
    duration: '30 mins',
    criteria: 'Log 5 new details and complete 25m focus block.',
    reflectionQuestion: 'Aisa kaunsa detail tha jo pehle notice nahi hua tha, aur study block mein total kitni baar attention lose hua?',
    status: 'pending'
  },
  {
    questId: 'q-day-3',
    dayNumber: 3,
    title: 'Delayed Recall & Verbal Memory',
    category: 'Memory Training',
    difficulty: 'E-RANK',
    objective: 'Train short-term to medium-term memory retention.',
    instructions: [
      'Memorize 10 unfamiliar vocabulary terms or formulas.',
      'Wait exactly 30 minutes without reading them.',
      'Write down all 10 terms from pure memory.',
      'Calculate recall accuracy percentage.'
    ],
    duration: '40 mins',
    criteria: 'Recall accuracy >= 80% after 30-minute delay.',
    reflectionQuestion: '10 mein se kitne terms accurately recall huye, aur bhule huye terms mein kya pattern tha?',
    status: 'pending'
  },
  {
    questId: 'q-day-4',
    dayNumber: 4,
    title: 'Deductive Reasoning & Problem Deconstruction',
    category: 'Logical Thinking',
    difficulty: 'D-RANK',
    objective: 'Break complex problems into fundamental step-by-step logic.',
    instructions: [
      'Solve 5 logical reasoning puzzles or complex math problems.',
      'Write down the exact rationale for each answer step.',
      'Identify any logical fallacy or wrong assumption made initially.'
    ],
    duration: '45 mins',
    criteria: 'Complete 5 problems with step-by-step written logic.',
    reflectionQuestion: 'Kahan par logical mistake hone ki probability thi, aur use kaise correct kiya?',
    status: 'pending'
  },
  {
    questId: 'q-day-5',
    dayNumber: 5,
    title: 'Digital Impulse Control & Deep Focus',
    category: 'Concentration & Discipline',
    difficulty: 'D-RANK',
    objective: 'Eliminate digital distraction triggers during deep work.',
    instructions: [
      'Put your phone in another room or in strict Silent Mode.',
      'Complete two 25-minute Pomodoro study blocks.',
      'Track every urge to check notifications.'
    ],
    duration: '50 mins',
    criteria: '50 minutes total deep work with 0 phone checks.',
    reflectionQuestion: 'Phone check karne ka impulsive trigger kab sabse strong tha aur use kaise suppress kiya?',
    status: 'pending'
  },
  {
    questId: 'q-day-6',
    dayNumber: 6,
    title: 'Emotional Trigger Audit & Pause Protocol',
    category: 'Emotional Control',
    difficulty: 'D-RANK',
    objective: 'Develop a 5-second buffer between trigger and reaction.',
    instructions: [
      'Identify 2 primary emotional triggers that caused annoyance today.',
      'Practice the 5-second pause protocol before responding to anyone.',
      'Record 1 situation where you maintained total calm despite frustration.'
    ],
    duration: '20 mins',
    criteria: 'Successfully execute the 5-second pause at least once.',
    reflectionQuestion: 'Kis situation mein impulse reaction stop kiya aur isse outcome par kya difference aaya?',
    status: 'pending'
  },
  {
    questId: 'q-day-7',
    dayNumber: 7,
    title: 'Week 1 Crucible & Mastery Assessment',
    category: 'Strategic Thinking',
    difficulty: 'C-RANK',
    objective: 'Evaluate Week 1 progress across memory, focus, and discipline.',
    instructions: [
      'Re-test memory recall on Day 3 terms without reviewing.',
      'Review your routine task completion rate for the past 6 days.',
      'Perform a 45-minute timed exam or question set.',
      'Summarize your single biggest improvement.'
    ],
    duration: '60 mins',
    criteria: 'Complete evaluation and generate AI Weekly Report.',
    reflectionQuestion: 'Pichle 7 dino mein discipline aur emotional stability mein sabse bada shift kya aaya?',
    status: 'pending'
  },
  {
    questId: 'q-day-8',
    dayNumber: 8,
    title: 'Posture & Non-Verbal Dominance',
    category: 'Body Language & Confidence',
    difficulty: 'D-RANK',
    objective: 'Develop controlled, assertive physical presence.',
    instructions: [
      'Maintain upright spine alignment during all study blocks.',
      'Practice making calm, direct eye contact during conversations.',
      'Eliminate fidgeting or restless foot tapping during work.'
    ],
    duration: 'All Day',
    criteria: 'Zero fidgeting logged during study blocks.',
    reflectionQuestion: 'Posture correct rakhne se mental alertness par kya impact notice kiya?',
    status: 'pending'
  },
  {
    questId: 'q-day-9',
    dayNumber: 9,
    title: 'Pattern Recognition & Speed Deduction',
    category: 'Logical Thinking',
    difficulty: 'D-RANK',
    objective: 'Sharpen rapid pattern extraction speed under time constraints.',
    instructions: [
      'Solve 8 pattern matrix puzzles within 15 minutes.',
      'Verify solutions against key.',
      'Note total time per problem.'
    ],
    duration: '25 mins',
    criteria: 'Solve >= 6 correctly within deadline.',
    reflectionQuestion: 'Speed pressure mein logic confuse hua ya visual pattern spot karna easy raha?',
    status: 'pending'
  },
  {
    questId: 'q-day-10',
    dayNumber: 10,
    title: 'Concise Expression & Clarity Protocol',
    category: 'Communication',
    difficulty: 'D-RANK',
    objective: 'Eliminate filler words and explain complex ideas simply.',
    instructions: [
      'Take a complex concept from today’s study material.',
      'Explain it aloud in under 90 seconds using simple Hinglish.',
      'Ensure zero filler words (um, ah, like).'
    ],
    duration: '20 mins',
    criteria: 'Explain topic concisely under 90 seconds without filler words.',
    reflectionQuestion: 'Topic ko short mein simplify karte waqt core point kya tha?',
    status: 'pending'
  },
  {
    questId: 'q-day-11',
    dayNumber: 11,
    title: 'Active Memory Stacking',
    category: 'Memory Training',
    difficulty: 'C-RANK',
    objective: 'Build associative memory chains for complex data.',
    instructions: [
      'Create a visual memory palace for 15 historical or scientific facts.',
      'Mentally walk through the palace after 2 hours.',
      'Log accuracy score.'
    ],
    duration: '30 mins',
    criteria: 'Recall 12 out of 15 facts correctly.',
    reflectionQuestion: 'Visual memory association se recall speed mein kitna difference aaya?',
    status: 'pending'
  },
  {
    questId: 'q-day-12',
    dayNumber: 12,
    title: 'Scenario Consequence Mapping',
    category: 'Problem-Solving',
    difficulty: 'C-RANK',
    objective: 'Evaluate 2nd and 3rd order consequences before making decisions.',
    instructions: [
      'Pick a difficult decision facing you this week.',
      'Map out Option A vs Option B with 1st, 2nd, and 3rd order outcomes.',
      'Select the optimal strategic route.'
    ],
    duration: '30 mins',
    criteria: 'Written decision tree map with long-term outcome analysis.',
    reflectionQuestion: 'Long-term consequences analyze karke decision change hua ya confirm hua?',
    status: 'pending'
  },
  {
    questId: 'q-day-13',
    dayNumber: 13,
    title: 'High-Velocity Endurance & Willpower',
    category: 'Discipline',
    difficulty: 'C-RANK',
    objective: 'Push focus boundary when fatigue sets in.',
    instructions: [
      'Execute a 45-minute continuous study sprint.',
      'When fatigue hits at ~30 mins, apply 5 deep breaths and push through.',
      'Record accuracy on final 15 minutes.'
    ],
    duration: '45 mins',
    criteria: '45 minutes uninterrupted work with final sprint complete.',
    reflectionQuestion: 'Fatigue point ke baad resist karne par mental focus regain kaise hua?',
    status: 'pending'
  },
  {
    questId: 'q-day-14',
    dayNumber: 14,
    title: 'Midpoint Strategic Review & Weakness Eradication',
    category: 'Strategic Thinking',
    difficulty: 'C-RANK',
    objective: 'Assess Day 1-14 progression and recalibrate daily habits.',
    instructions: [
      'Review Hunter Index progress snapshot.',
      'Identify your primary bottleneck (Study, Fitness, Emotion, Focus).',
      'Design a targeted mitigation step for Week 3.'
    ],
    duration: '40 mins',
    criteria: 'Complete 14-day data review and log mitigation step.',
    reflectionQuestion: 'Pehle 14 dino mein sabse major weakness kaunsi overcome hui?',
    status: 'pending'
  },
  {
    questId: 'q-day-15',
    dayNumber: 15,
    title: 'Micro-Observation & Social Awareness',
    category: 'Observation Training',
    difficulty: 'C-RANK',
    objective: 'Observe subtle non-verbal social cues without distraction.',
    instructions: [
      'During one interaction today, notice tone, posture, and facial expression.',
      'Log whether actions matched verbal statements.',
      'Maintain calm composure throughout.'
    ],
    duration: '20 mins',
    criteria: 'Log 3 non-verbal observations accurately.',
    reflectionQuestion: 'Observed non-verbal cues se person ki true state ka kya pata chala?',
    status: 'pending'
  },
  {
    questId: 'q-day-16',
    dayNumber: 16,
    title: 'Complex Deductive Grid',
    category: 'Logical Thinking',
    difficulty: 'B-RANK',
    objective: 'Solve intricate multi-variable deduction problems.',
    instructions: [
      'Solve 2 complex logic grids or algorithmic problems.',
      'Verify proof with zero trial-and-error guessing.',
      'Record solution steps.'
    ],
    duration: '40 mins',
    criteria: 'Solve both logic grids with written step-by-step proofs.',
    reflectionQuestion: 'Assumption lene ke bajaye strict logic follow karke kitna time save hua?',
    status: 'pending'
  },
  {
    questId: 'q-day-17',
    dayNumber: 17,
    title: 'Stress Resilience & Cold Control',
    category: 'Emotional Control',
    difficulty: 'B-RANK',
    objective: 'Maintain low heart rate and clear mind under high friction.',
    instructions: [
      'Expose yourself to a mild stressor (cold shower or intense physical push).',
      'Control breathing rate strictly (in for 4s, out for 6s).',
      'Observe mind attempting to panic and suppress it instantly.'
    ],
    duration: '15 mins',
    criteria: 'Maintain controlled breath rhythm throughout stressor.',
    reflectionQuestion: 'Physical discomfort ke waqt mind ko calm down karne ka experience kaisa raha?',
    status: 'pending'
  },
  {
    questId: 'q-day-18',
    dayNumber: 18,
    title: 'Deep Work Flow State Protocol',
    category: 'Concentration',
    difficulty: 'B-RANK',
    objective: 'Sustain uninterrupted flow state for 60 consecutive minutes.',
    instructions: [
      'Set up a zero-noise, single-task study setup.',
      'Engage in 60 minutes of high-priority problem solving.',
      'Zero context switching or tab surfing.'
    ],
    duration: '60 mins',
    criteria: '60 minutes continuous flow state with zero context switching.',
    reflectionQuestion: '60 minutes flow state mein output volume kitna increase hua?',
    status: 'pending'
  },
  {
    questId: 'q-day-19',
    dayNumber: 19,
    title: 'Reverse Engineering & Synthesis',
    category: 'Problem-Solving',
    difficulty: 'B-RANK',
    objective: 'Deconstruct a solved complex problem from outcome to initial inputs.',
    instructions: [
      'Take a solved exam problem or case study.',
      'Deconstruct it backwards step-by-step to the initial state.',
      'Identify critical pivotal decision points.'
    ],
    duration: '35 mins',
    criteria: 'Reverse trace problem steps with written flow diagram.',
    reflectionQuestion: 'Reverse flow step tracing se problem ka root mechanism samajhna kitna easy hua?',
    status: 'pending'
  },
  {
    questId: 'q-day-20',
    dayNumber: 20,
    title: 'High-Volume Precision Memory',
    category: 'Memory Training',
    difficulty: 'B-RANK',
    objective: 'Store and retrieve 20 random numbers or details accurately.',
    instructions: [
      'Memorize a 20-digit number sequence or 20 random objects in 3 minutes.',
      'Perform 15 minutes of physical exercise.',
      'Recall sequence with 100% precision.'
    ],
    duration: '30 mins',
    criteria: 'Recall >= 18 out of 20 items after physical interval.',
    reflectionQuestion: 'Physical activity ke baad memory retention intact rahi ya accuracy drop hui?',
    status: 'pending'
  },
  {
    questId: 'q-day-21',
    dayNumber: 21,
    title: 'Week 3 Crucible & Strategic Audit',
    category: 'Strategic Thinking',
    difficulty: 'A-RANK',
    objective: 'Benchmark total attribute evolution before final 9 days.',
    instructions: [
      'Test logic, memory, and focus under 60-minute evaluation.',
      'Audit routine task completion over past 21 days.',
      'Identify top remaining vulnerability.'
    ],
    duration: '60 mins',
    criteria: 'Execute 60m evaluation & log attribute benchmark.',
    reflectionQuestion: 'Day 1 ke benchmark ke comparsion mein abhi focus level mein kitna growth notice hua?',
    status: 'pending'
  },
  {
    questId: 'q-day-22',
    dayNumber: 22,
    title: 'Non-Reactive Observation Under Provocation',
    category: 'Emotional Control & Observation',
    difficulty: 'A-RANK',
    objective: 'Observe conflict objectively without emotional entry.',
    instructions: [
      'When encountering disagreement or provocation, step back mentally.',
      'Observe arguments like a neutral third-party analyst.',
      'Respond with minimal, calm, factual statements.'
    ],
    duration: 'All Day',
    criteria: 'Zero emotional arguments logged.',
    reflectionQuestion: 'Neutral third-party analyst approach se situation controller control mein rahi?',
    status: 'pending'
  },
  {
    questId: 'q-day-23',
    dayNumber: 23,
    title: 'Uncompromising Execution & Zero Delays',
    category: 'Discipline',
    difficulty: 'A-RANK',
    objective: 'Start every routine activity within 10 seconds of scheduled time.',
    instructions: [
      'Execute all routine tasks today within 10 seconds of time schedule.',
      'Zero procrastination or "just 5 more minutes" delays.',
      'Log time accuracy for each task.'
    ],
    duration: 'All Day',
    criteria: 'Strict 10-second initiation for at least 80% of schedule tasks.',
    reflectionQuestion: 'Immediate action start karne se internal friction kitna reduced feel hua?',
    status: 'pending'
  },
  {
    questId: 'q-day-24',
    dayNumber: 24,
    title: 'Multi-Thread Problem Optimization',
    category: 'Problem-Solving & Strategy',
    difficulty: 'A-RANK',
    objective: 'Optimize parallel tasks to maximize daily output.',
    instructions: [
      'Identify 3 overlapping tasks in your schedule.',
      'Structure parallel execution (e.g. revision audio during walking).',
      'Log time saved.'
    ],
    duration: '40 mins',
    criteria: 'Save at least 30 minutes through optimal task pairing.',
    reflectionQuestion: 'Parallel tasking se focus lose toh nahi hua aur time kitna save hua?',
    status: 'pending'
  },
  {
    questId: 'q-day-25',
    dayNumber: 25,
    title: 'Hyper-Concentration Marathon',
    category: 'Concentration',
    difficulty: 'A-RANK',
    objective: 'Maintain peak intellectual output for 90 uninterrupted minutes.',
    instructions: [
      'Set up an elite deep-work environment.',
      'Execute a 90-minute study sprint on hardest subject.',
      'Log topic mastery output.'
    ],
    duration: '90 mins',
    criteria: '90 minutes solid deep work with 0 distractions.',
    reflectionQuestion: '90-minute sprint complete hone ke baad mental stamina ka status kya tha?',
    status: 'pending'
  },
  {
    questId: 'q-day-26',
    dayNumber: 26,
    title: 'Rapid Analytical Breakdown',
    category: 'Logical Thinking',
    difficulty: 'A-RANK',
    objective: 'Extract core principles from a 10-page text in 15 minutes.',
    instructions: [
      'Read a 10-page dense textbook chapter or paper.',
      'Summarize key principles into a 1-page structured schematic.',
      'Test schema against practice questions.'
    ],
    duration: '35 mins',
    criteria: '1-page schematic accurately covering all key principles.',
    reflectionQuestion: 'Core principles distill karne mein kaunsi visual mapping method effective rahi?',
    status: 'pending'
  },
  {
    questId: 'q-day-27',
    dayNumber: 27,
    title: 'Absolute Stoicism Under Friction',
    category: 'Emotional Control',
    difficulty: 'S-RANK',
    objective: 'Maintain absolute inner calm regardless of external disruption.',
    instructions: [
      'Intentionally study in a noisy or sub-optimal environment for 30 mins.',
      'Suppress all frustration thoughts immediately upon arrival.',
      'Maintain study speed.'
    ],
    duration: '30 mins',
    criteria: 'Complete 30m study block in sub-optimal environment with zero complaints.',
    reflectionQuestion: 'External noise and friction ke bawajood internal focus hold karna possible kyo hua?',
    status: 'pending'
  },
  {
    questId: 'q-day-28',
    dayNumber: 28,
    title: 'Mastery Memory Audit',
    category: 'Memory Training',
    difficulty: 'S-RANK',
    objective: 'Demonstrate cumulative memory retention over the entire 28 days.',
    instructions: [
      'Retrieve key formulas, terms, and lessons learned from Day 1 to Day 27.',
      'Test recall speed and accuracy.',
      'Achieve >= 90% cumulative accuracy.'
    ],
    duration: '50 mins',
    criteria: 'Achieve >= 90% cumulative accuracy across 30 test prompts.',
    reflectionQuestion: 'Day 1 ke memory capacity compare karne par abhi memory recall retention mein kitna gain hai?',
    status: 'pending'
  },
  {
    questId: 'q-day-29',
    dayNumber: 29,
    title: 'Monarch Mindset & Zero Hesitation',
    category: 'Confidence & Discipline',
    difficulty: 'S-RANK',
    objective: 'Execute every objective without fear, doubt, or delay.',
    instructions: [
      'Tackle your most intimidating academic or physical task immediately.',
      'Zero hesitation before starting (3-2-1 Go rule).',
      'Complete task with absolute precision.'
    ],
    duration: '60 mins',
    criteria: 'Immediate execution of hardest task with 0 hesitation.',
    reflectionQuestion: 'Hardest task ko directly attack karne par fear and doubt kaise dissolve ho gaye?',
    status: 'pending'
  },
  {
    questId: 'q-day-30',
    dayNumber: 30,
    title: 'Final Monarch Crucible — Awakening',
    category: 'All Categories Master Test',
    difficulty: 'S-RANK',
    objective: 'Complete final comprehensive evaluation and generate 30-day report.',
    instructions: [
      'Complete 100% of today’s designated routine schedule.',
      'Perform final physical, mental, and emotional benchmark tests.',
      'Write complete Day 30 journal entry.',
      'Generate Final 30-Day Transformation Report.'
    ],
    duration: '90 mins',
    criteria: '100% routine completion and Final Report generation.',
    reflectionQuestion: '30 dino ke is transformational journey ke baad tumhari sabse proudest achievement kya hai?',
    status: 'pending'
  }
];
