const DEFAULT_OPTIONS = {
  negativeBeliefs: [],
  emotions: [],
  consequenceOptions: [],
};

export const buildCbtFormulationNodes = (options = DEFAULT_OPTIONS) => {
  const mergedOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  return {
    timeline: [
      {
        id: "beginning",
        section: "The Beginning",
        title: "When I Was Little",
        subtitle: "Early memories & experiences",
        modalContent: {
          title: "When I was little (Childhood)",
          description:
            "This may or may not be relevant to what you would like to work on so skip it if not.",
          question:
            "Float back in time and see if you remember feeling this way (from your situation) as a child or any other time?",
          bullets: [
            "Were there specific events or patterns in your family?",
            "What messages did you receive about yourself growing up?",
          ],
          example:
            '"My parents were very critical" or "I had to be perfect to get attention" or "I learned to stay quiet to avoid conflict"',
          type: "textarea",
        },
      },
      {
        id: "learned",
        section: "What I Learned",
        title: "Deep-Down Beliefs",
        subtitle: "What I believe about myself",
        modalContent: {
          title: "Deep-Down Beliefs",
          description:
            "These are deep beliefs about yourself that might have been activated or try to think carefully about these and see if they match the current situation you chose.",
          question: "Choose what this situation meant or means to you negatively",
          type: "checkbox",
          options: mergedOptions.negativeBeliefs,
        },
      },
      {
        id: "rules",
        section: "My Survival Guide",
        title: "The Rules",
        subtitle: "How I must be to feel safe",
        modalContent: {
          title: "The Rules",
          description:
            "These are the rules or assumptions you live by to try and keep yourself safe.",
          question: "What rules do you follow to protect yourself?",
          bullets: [
            "If I... then I'll be safe/loved/accepted",
            "I must always...",
            "I should never...",
          ],
          example: '"I must be perfect" or "I should never show weakness"',
          type: "textarea",
        },
      },
      {
        id: "trigger",
        section: "Life Happens",
        title: "The Trigger",
        subtitle: "What happened recently",
        modalContent: {
          title: "Life Happens (The Trigger)",
          description:
            "This is the recent situation or event that activated your beliefs and rules.",
          question: "What happened that brought up these feelings?",
          bullets: ["Describe the situation", "When did it happen?"],
          example: `"My boss criticized my work" or "My friend didn't respond"`,
          type: "textarea",
        },
      },
    ],
    react: [
      {
        id: "thoughts",
        title: "Thoughts",
        subtitle: "In my head",
        modalContent: {
          title: "Thoughts (In my head)",
          description: "What thoughts go through your mind?",
          question: "What do you think when this happens?",
          example: `"I'm going to fail" or "Nobody likes me"`,
          type: "textarea",
        },
      },
      {
        id: "feelings",
        title: "Feelings",
        subtitle: "In my body",
        modalContent: {
          title: "Feelings (In my body)",
          description:
            "What emotions and physical sensations do you experience?",
          question: "Choose the feelings that fit for you:",
          type: "checkbox",
          options: mergedOptions.emotions,
        },
      },
      {
        id: "behaviors",
        title: "Behaviors",
        subtitle: "What I did",
        modalContent: {
          title: "Behaviors (What I did)",
          description: "What actions did you take?",
          question: "What did you do in response?",
          example: '"Avoided the situation" or "Lashed out at someone"',
          type: "textarea",
        },
      },
      {
        id: "consequences",
        title: "The Consequences",
        subtitle: "Results of my actions",
        modalContent: {
          title: "The Consequences",
          description:
            "These are the impacts or patterns that may follow from your reactions.",
          question: "Choose any consequences that fit for you:",
          type: "checkbox",
          options: mergedOptions.consequenceOptions,
          allowOther: true,
          otherLabel: "Anything else you've noticed?",
          otherPlaceholder: "Write any other consequence here...",
        },
      },
      {
        id: "superpowers",
        title: "Your Superpowers",
        subtitle: "Strengths & Resilience",
        modalContent: {
          title: "Your Superpowers",
          description:
            "What strengths did you use or can you use in this situation?",
          question: "What makes you resilient?",
          example: '"I am self-aware" or "I am brave enough to seek help"',
          type: "textarea",
        },
      },
    ],
  };
};

export const flattenCbtFormulationNodes = (formulationNodes) => [
  ...formulationNodes.timeline,
  ...formulationNodes.react,
];

export const getCbtFormulationEntryValues = (entry, nodeId) => {
  switch (nodeId) {
    case "beginning":
      return {
        value: entry?.childhood || "",
      };
    case "learned":
      return {
        value: entry?.deepBeliefs || [],
      };
    case "rules":
      return {
        value: entry?.rules || "",
      };
    case "trigger":
      return {
        value: entry?.recentHappening || entry?.triggers || "",
      };
    case "thoughts":
      return {
        value: entry?.thoughts || "",
      };
    case "feelings":
      return {
        value: entry?.feelings || [],
      };
    case "behaviors":
      return {
        value: entry?.behaviors || "",
      };
    case "consequences":
      return {
        value: entry?.consequences || [],
        extraValue: entry?.consequencesOther || "",
      };
    case "superpowers":
      return {
        value: entry?.superpowers || "",
      };
    default:
      return {
        value: "",
      };
  }
};

export const buildAnswersFromCbtFormulationEntry = (entry) => ({
  beginning: {
    text: entry?.childhood || "",
    completed: Boolean(entry?.childhood?.trim?.()),
  },
  learned: {
    beliefs: entry?.deepBeliefs || [],
    completed: Boolean(entry?.deepBeliefs?.length),
  },
  rules: {
    text: entry?.rules || "",
    completed: Boolean(entry?.rules?.trim?.()),
  },
  trigger: {
    text: entry?.recentHappening || entry?.triggers || "",
    completed: Boolean(
      entry?.recentHappening?.trim?.() || entry?.triggers?.trim?.(),
    ),
  },



  
  thoughts: {
    text: entry?.thoughts || "",
    completed: Boolean(entry?.thoughts?.trim?.()),
  },
  feelings: {
    beliefs: entry?.feelings || [],
    completed: Boolean(entry?.feelings?.length),
  },
  behaviors: {
    text: entry?.behaviors || "",
    completed: Boolean(entry?.behaviors?.trim?.()),
  },
  consequences: {
    beliefs: entry?.consequences || [],
    other: entry?.consequencesOther || "",
    completed: Boolean(
      entry?.consequences?.length || entry?.consequencesOther?.trim?.(),
    ),
  },
  superpowers: {
    text: entry?.superpowers || "",
    completed: Boolean(entry?.superpowers?.trim?.()),
  },
});
