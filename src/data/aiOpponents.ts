import { AIOpponent } from '../types/chess';

export const AI_OPPONENTS: AIOpponent[] = [
  {
    id: 'spark',
    name: 'Spark',
    title: 'The Friendly Apprentice',
    difficulty: 'very_easy',
    rating: 600,
    avatar: '⚡',
    personality: 'Fast, energetic, enthusiastic, cheerful and playful. Plays moves rapidly with creative ideas!',
    intro: "Hey friend! Ready for some chess magic? Don't worry, I make lots of silly mistakes!",
    quotes: {
      start: ["Let's have fun! Good luck!", "Ready, set, blitz!", "I brought my best pawns!"],
      goodMove: ["Whoa! That move was super sneaky!", "Nice one! You got me thinking!", "Ooh, sharp move!"],
      playerAdvantage: ["Uh oh... my king is trembling!", "You're playing awesome today!", "Is it getting hot in here?"],
      aiAdvantage: ["Beep boop, I found a square!", "Spark power activated!", "Look what I did!"],
      check: ["Check! Watch out for your king!", "Knock knock! King inspection!", "Check incoming!"],
      win: ["Yay! That was such a fun game!", "Good game! You almost had me!"],
      loss: ["Whoa, you beat me! Brilliant game!", "You are a chess wizard! Rematch anytime!"]
    }
  },
  {
    id: 'neo',
    name: 'Neo',
    title: 'The Young Strategist',
    difficulty: 'easy',
    rating: 1000,
    avatar: '🤖',
    personality: 'Logical, fast-calculating, polite, curious. Controls the center and develops rapidly.',
    intro: "Greetings! I am Neo. Calculations initialized. Let us test our tactics.",
    quotes: {
      start: ["Calculations initialized. Have a great game.", "Control the center, protect the king."],
      goodMove: ["Excellent spatial control.", "A very solid tactical decision.", "My sensors detect a strong move."],
      playerAdvantage: ["Your positional advantage is notable.", "I must recalibrate my defensive structure."],
      aiAdvantage: ["Optimal move executed.", "Piece coordination is improving."],
      check: ["Direct threat detected: Check.", "Your king must relocate."],
      win: ["Analysis concludes in my favor. Well played.", "Good battle! Thank you for the match."],
      loss: ["Impressive execution. Your tactical victory is undeniable!"]
    }
  },
  {
    id: 'bolt',
    name: 'Bolt',
    title: 'The Speed Attacker',
    difficulty: 'medium',
    rating: 1400,
    avatar: '🌪️',
    personality: 'Lightning-fast, aggressive, loves attacking open files and unleashing piece pressure.',
    intro: "Speed and pressure! Don't blink or my knights will strike through your defenses!",
    quotes: {
      start: ["No time to hesitate—let the blitz begin!", "Fast, furious and fearless!"],
      goodMove: ["Ouch! Struck like lightning!", "Didn't see that coming so fast!", "You can keep up with my speed!"],
      playerAdvantage: ["Hey, slow down! You're breaking my offensive!", "Gotta regroup before I get crushed!"],
      aiAdvantage: ["Full throttle attack!", "Can you handle the pressure?", "The tempo is mine!"],
      check: ["Lightning Check! Move quickly!", "Boom! King under fire!"],
      win: ["Victory at lightning speed! Good game!", "That was a high voltage clash!"],
      loss: ["You deflected my entire storm! Incredible defense, champion!"]
    }
  },
  {
    id: 'queen',
    name: 'Grand Queen Aurelia',
    title: 'Positional Sovereign',
    difficulty: 'hard',
    rating: 1800,
    avatar: '👑',
    personality: 'Regal, swift, punishing weaknesses and commanding outposts with pro-level accuracy.',
    intro: "A true ruler strikes with precision and swiftness. Show me your mastery of the 64 squares.",
    quotes: {
      start: ["Honor upon the battlefield. May the finer mind prevail.", "Every piece has its destined royal duty."],
      goodMove: ["A sovereign move indeed.", "You command your court with distinction.", "Subtle and profound."],
      playerAdvantage: ["Your pieces hold significant authority.", "A formidable position you have woven."],
      aiAdvantage: ["The kingdom's borders tighten.", "Strategy always triumphs over haste."],
      check: ["Royal check. Guard your crown.", "Check to the king."],
      win: ["Grace in triumph. You fought with royal dignity.", "A well contested struggle."],
      loss: ["The crown passes to you. Magnificent strategic triumph!"]
    }
  },
  {
    id: 'shadow',
    name: 'Shadow',
    title: 'The Tactical Phantom',
    difficulty: 'very_hard',
    rating: 2200,
    avatar: '🥷',
    personality: 'Relentless, rapid-response tactician. Exploits pins, skewers, and sudden king assaults.',
    intro: "In the quiet shadows, a single diagonal decides your fate. Step forward.",
    quotes: {
      start: ["Watch every shadow on the board.", "Nothing escapes calculation."],
      goodMove: ["You saw through my snare.", "Remarkable vision in the dark.", "A piercing tactical shot."],
      playerAdvantage: ["My illusions are unraveling. Well calculated.", "You hold the initiative."],
      aiAdvantage: ["The net is cast.", "Tactical sequence unfolding.", "Step into the fork."],
      check: ["From the shadows: Check.", "Nowhere to hide."],
      win: ["Calculated to the end. You played courageously.", "The silence falls."],
      loss: ["Astonishing calculation! You illuminated every shadow and won!"]
    }
  },
  {
    id: 'grandmaster',
    name: 'Grandmaster X',
    title: 'Supreme Chessverse Engine',
    difficulty: 'expert',
    rating: 2600,
    avatar: '🔮',
    personality: 'Pro-level grandmaster engine. Strikes with lightning calculation and deep master technique.',
    intro: "Welcome to the summit of the Chessverse. Let us test the absolute limits of chess art.",
    quotes: {
      start: ["May the depth of human and artificial intellect inspire us.", "The board is a canvas of pure truth."],
      goodMove: ["Super grandmaster tier depth.", "A move worthy of World Championship prep.", "Flawless nuance."],
      playerAdvantage: ["Astonishing! You hold evaluation superiority.", "A masterclass in technique."],
      aiAdvantage: ["Positional harmony maximized.", "Micro-advantages crystallizing."],
      check: ["Inescapable pressure: Check.", "Precision check."],
      win: ["A masterwork contest. Thank you for this profound game.", "Deeply calculated."],
      loss: ["Incredible! You have bested Grandmaster X! Immortal game achieved!"]
    }
  }
];
