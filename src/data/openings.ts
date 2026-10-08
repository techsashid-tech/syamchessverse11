import { OpeningGuide } from '../types/chess';

export const OPENINGS_DATA: OpeningGuide[] = [
  {
    id: 'italian',
    name: 'Italian Game',
    eco: 'C50',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5'],
    color: 'w',
    summary: "One of the oldest and most respected openings. Focuses on rapid piece deployment and pressure against Black's vulnerable f7 pawn.",
    mainIdeas: [
      'Rapid development of knights and bishops',
      'Castle early to secure king safety',
      'Target f7 with Bc4 and potential Ng5',
      'Prepare c3 and d4 to build a towering pawn center'
    ],
    beginnerTips: 'Never push pawns unnecessarily; bring your bishop to c4 and castle within the first 5 moves.',
    mistakesToAvoid: [
      'Allowing Black to pin your knight on f3 with Bg4 before castling',
      'Moving the c4 bishop multiple times without reason',
      'Neglecting central pawn support when striking with d4'
    ]
  },
  {
    id: 'ruy_lopez',
    name: 'Spanish / Ruy Lopez',
    eco: 'C60',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6'],
    color: 'w',
    summary: "The cornerstone of classical chess strategy. Pins the c6 defender of the e5 pawn and initiates prolonged positional pressure.",
    mainIdeas: [
      "Indirect pressure on Black's e5 pawn by targeting Nc6",
      'Maintain flexible bishop options (retreat to a4 and c2)',
      'Prepare central consolidation with c3, d4, and Re1',
      'Maneuver the b1 knight via d2 to f1 and g3'
    ],
    beginnerTips: 'Do not exchange your bishop for the knight on c6 immediately unless you have a concrete central pawn majority advantage.',
    mistakesToAvoid: [
      'Playing Bxc6 on move 4 without understanding the doubled pawn endgame',
      'Leaving the e4 pawn unguarded after Black plays Nf6'
    ]
  },
  {
    id: 'sicilian',
    name: 'Sicilian Defense',
    eco: 'B20',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4'],
    color: 'b',
    summary: 'The most popular and combative reply to 1.e4. Creates asymmetrical, dynamic counter-attacking imbalances from move one.',
    mainIdeas: [
      'Fight for the center asymmetrically using the c-pawn',
      'Acquire a semi-open c-file for queen and rook counterplay',
      "Maintain two central pawns (d and e) against White's single e-pawn",
      'Deliver fierce queenside counterattacks'
    ],
    beginnerTips: "Trade the c5 pawn for White's d4 pawn early so your d-pawn and e-pawn dominate the center later.",
    mistakesToAvoid: [
      'Neglecting kingside development in the rush to attack on the c-file',
      "Allowing White's f4-f5 attacking pawn storm to rip open your king"
    ]
  },
  {
    id: 'queens_gambit',
    name: "Queen's Gambit",
    eco: 'D06',
    moves: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6'],
    color: 'w',
    summary: "A premier strategic opening. White offers the wing c4 pawn to exchange for Black's central d5 pawn, gaining central domination.",
    mainIdeas: [
      'Sacrifice or exchange a wing pawn (c4) for central control (d5)',
      'Regain the pawn easily if accepted via e3/e4 and Bxc4',
      "Pin the f6 knight with Bg5 to weaken Black's king",
      'Dominate the c-file with rooks'
    ],
    beginnerTips: 'The gambit is not a real sacrifice! If Black takes with dxc4, White immediately regains control with e4 or e3.',
    mistakesToAvoid: [
      'Trying desperately to defend the c4 pawn as Black instead of developing',
      'Premature queen excursions before developing both knights'
    ]
  },
  {
    id: 'french',
    name: 'French Defense',
    eco: 'C00',
    moves: ['e4', 'e6', 'd4', 'd5', 'Nc3', 'Nf6'],
    color: 'b',
    summary: "A resilient, solid counter-system. Black builds a solid pawn chain (e6-d5) and strikes at the base of White's pawn chain with c5.",
    mainIdeas: [
      'Solid defensive foundation behind the d5-e6 pawn chain',
      "Counterattack White's d4 pawn with c5, Nc6, and Qb6",
      'Solve the problem of the light-squared bishop via b6 or f6',
      'Exploit overextended White pawns on e5'
    ],
    beginnerTips: 'Be patient with your c8 bishop; it will find an active diagonal later once the center opens.',
    mistakesToAvoid: [
      'Letting your light-squared bishop stay locked forever on c8',
      'Allowing White to sacrifice on h7 or deliver Greek gift attacks'
    ]
  },
  {
    id: 'caro_kann',
    name: 'Caro-Kann Defense',
    eco: 'B10',
    moves: ['e4', 'c6', 'd4', 'd5', 'Nc3', 'dxe4'],
    color: 'b',
    summary: 'Renowned as the fortress defense. Unlike the French, Black supports d5 with c6 while keeping the c8 bishop free to develop actively.',
    mainIdeas: [
      'Rock-solid pawn structure with minimal weaknesses',
      'Develop the light-squared bishop outside the pawn chain before playing e6',
      'Transition safely into superior pawn endgames'
    ],
    beginnerTips: 'Develop your light-squared bishop to f5 or g4 before playing e6 to avoid trapping it.',
    mistakesToAvoid: [
      'Playing e6 too early and turning the position into a bad French defense',
      "Underestimating White's knight outpost on e5"
    ]
  },
  {
    id: 'london_system',
    name: 'London System',
    eco: 'D02',
    moves: ['d4', 'd5', 'Bf4', 'Nf6', 'e3', 'c5'],
    color: 'w',
    summary: 'The ultimate universal setup. Can be played against almost any Black defense, providing harmonic piece placement and high safety.',
    mainIdeas: [
      'Develop dark-squared bishop to f4 before closing the pawn chain with e3',
      'Build a granite pawn triangle: c3, d4, e3',
      'Plant an uncontested knight outpost on e5',
      'Launch powerful kingside attacks with Bd3, Nd2, and Qf3'
    ],
    beginnerTips: 'Always play Bf4 before e3! The whole point is having the bishop free before making the pawn pyramid.',
    mistakesToAvoid: [
      'Exchanging your powerful f4 bishop casually without a fight',
      'Falling asleep in passive setups without expanding with e4 or c4'
    ]
  },
  {
    id: 'kings_indian',
    name: "King's Indian Defense",
    eco: 'E60',
    moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7'],
    color: 'b',
    summary: 'A hypermodern masterpiece favored by Kasparov and Fischer. Black yields center space initially, then launches a vicious counterstrike.',
    mainIdeas: [
      'Fianchetto bishop on g7 to laser down the long dark diagonal',
      'Strike back in the center with e5 or c5',
      'Launch an all-out kingside attack with f5, f4, and g5',
      "Tolerate queenside pressure in exchange for mating White's king"
    ],
    beginnerTips: "Don't panic when White occupies the center with pawns—your g7 bishop and e5 push will break it down.",
    mistakesToAvoid: [
      'Closing the center and failing to launch the f5 kingside pawn break',
      "Ignoring White's rapid queenside infiltration on the c-file"
    ]
  }
];
