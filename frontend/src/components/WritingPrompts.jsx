import React from 'react';
import { Button } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const writingPrompts = [
  "What made you smile today?",
  "What's a challenge you faced today and how did you handle it?",
  "Describe a conversation that impacted you today.",
  "What are you grateful for right now?",
  "What's something new you learned today?",
  "Describe a moment that surprised you today.",
  "What's something you're looking forward to?",
  "Write about a decision you made today.",
  "What would you like to improve about today if you could?",
  "Describe your current mood and what influenced it.",
  "What's a goal you're working towards?",
  "Write about a person who made an impact on your day.",
  "What's a memory that came to mind today?",
  "Describe your ideal day tomorrow.",
  "What's something you're proud of today?",
  "Write about a place you visited or would like to visit.",
  "What's something that challenged your perspective today?",
  "Describe a small moment of joy from today.",
  "What's something you want your future self to remember about today?",
  "Write about a change you've noticed in yourself lately.",
  "What's a question you're pondering right now?",
  "Describe a habit you're trying to build or break.",
  "What's something you want to explore or learn more about?",
  "Write about an interaction that made you think.",
  "What's a hope or fear you're experiencing right now?",
  "Reflect on a meaningful object in your space right now.",
  "What boundaries did you set or maintain today?",
  "Describe a moment when you felt fully present today.",
  "What would you tell your past self from a week ago?",
  "Write about something you observed but didn't participate in today.",
  "What's a small act of kindness you witnessed or performed?",
  "Describe a sound, smell, or taste that stood out to you today.",
  "What does self-care mean to you today?",
  "Write about a skill you're developing and your progress.",
  "Describe a moment of conflict or tension and what you learned.",
  "What are you curious about right now?",
  "Write about something you read, watched, or listened to recently that resonated with you.",
  "What patterns or themes have you noticed in your life lately?",
  "Describe something you're hesitant or afraid to do.",
  "What assumptions were challenged for you today?",
  "Write about a relationship that's evolving in your life.",
  "What's something you're holding onto that you could release?",
  "Describe a small triumph from today that others might not notice.",
  "What does rest look like for you right now?",
  "Write about a value that guided your actions today.",
  "What's something you're reconsidering or seeing differently?",
  "Describe a moment of compassion you experienced today.",
  "What creative idea is simmering in your mind?",
  "Write about an area of your life where you feel growth happening.",
  "What's a truth you're coming to terms with?",
  "Describe a moment when you advocated for yourself today.",
  "What environment or space influenced your mood today?",
  "Write about a conversation you wish you had today.",
  "What's something that feels unresolved for you right now?",
  "Describe how your body felt during a significant moment today.",
  "What's a dream or aspiration you haven't shared with many people?",
  "Describe a color that represents your day and why.",
  "Write about a rule you broke or bent today.",
  "What's a question you wish someone would ask you?",
  "Describe a moment when you felt misunderstood today.",
  "What's something you did today that aligned with your values?",
  "Write about a connection between seemingly unrelated parts of your life.",
  "What would you like to give yourself permission to do or feel?",
  "Describe a moment when you felt a sense of belonging today.",
  "What's a lesson you keep having to relearn?",
  "Write about a moment of synchronicity or meaningful coincidence.",
  "What's something you're overthinking right now?",
  "Describe an emotion you felt today that doesn't have a simple name.",
  "What's a limiting belief you're working to overcome?",
  "Write about a choice between comfort and growth you faced today.",
  "What part of yourself are you discovering or rediscovering?",
  "Describe a moment when you felt particularly embodied or present in your physical self.",
  "What's a habit or pattern you'd like to leave behind?",
  "Write about something that made you laugh today.",
  "What's a resource (internal or external) you relied on today?",
  "Describe a mundane moment that felt sacred or special.",
  "What's something you experienced today that you want more of in your life?",
  "Write about a conversation you overheard that sparked your imagination.",
  "What's a question that's guiding your life right now?",
  "Describe something you noticed in your neighborhood or community today.",
  "What's a word or phrase that's been meaningful to you lately?",
  "Write about a way you honored your needs or boundaries today.",
  "What's something you're learning to accept or embrace?",
  "Describe a moment when time seemed to slow down or speed up.",
  "What's a responsibility you're growing into?",
  "Write about a time today when you were completely yourself.",
  "What's a strength you called upon today?",
  "Describe a moment when you felt connected to something larger than yourself.",
  "What's something you want to remember about this season of your life?",
  "Write about a contrast or paradox you're holding right now.",
  "What's something you did slowly and mindfully today?",
  "Describe a small detail you noticed that others might have missed.",
  "What's a conversation you need to have but are avoiding?",
  "Write about something ordinary that felt extraordinary today.",
  "What's a quality you admire in someone else that you'd like to nurture in yourself?",
  "Describe a moment that challenged your sense of identity today.",
  "What's a story you tell yourself that may not be serving you anymore?",
  "Write about something you want to understand better.",
  "What's a way you showed up for someone else today?",
  "Describe something you're unlearning right now.",
  "What's a transition you're experiencing in your life?",
  "Write about a connection between your past and present self.",
  "What's something that feels like home to you right now?",
  "Describe a moment when you felt fully alive today.",
  "What's a gift you gave or received today (tangible or intangible)?",
];

const WritingPrompts = ({ onSelectPrompt, customColors }) => {
  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * writingPrompts.length);
    return writingPrompts[randomIndex];
  };

  const handleGetPrompt = () => {
    const prompt = getRandomPrompt();
    onSelectPrompt(prompt);
  };


  const colors = customColors || {
    buttonColor: '#1976d2',
    textColor: '#1976d2',
    hoverBg: 'rgba(25, 118, 210, 0.04)',
  };

  return (
    <Button
      onClick={handleGetPrompt}
      variant="outlined"
      startIcon={<AutoAwesomeIcon />}
      sx={{
        width: 'fit-content',
        color: colors.buttonColor,
        borderColor: colors.buttonColor,
        '&:hover': {
          borderColor: colors.buttonColor,
          backgroundColor: colors.hoverBg,
        },
        textTransform: 'none',
        fontSize: '1rem',
      }}
    >
      Need inspiration?
    </Button>
  );
};

export default WritingPrompts;