/* 

Implemented Games

*  -- Tetris
*  -- Snake 
*  -- Pong
*  -- Breakout
*  -- Minesweeper
*  -- Rock-Paper-Scissors
*  -- Tic-Tac-Toe
*  -- Connect Four
*  -- Sudoku
*  -- Chess 
*  -- Checkers  

*/ 

export interface Game {
  id: string
  title: string
  description: string
  category: string
  preview: string
  icon: string
  isImplemented: boolean
} 


export const games: Game[] = [
  {
    id: 'tetris',
    title: 'Tetris',
    description: 'The classic block-stacking puzzle game. Arrange falling pieces to create and clear complete lines.',
    category: 'Puzzle',
    preview: '/games/tetris-preview.jpg',
    icon: '/games/tetris-icon.png',
    isImplemented: true
  },
  {
    id: 'snake',
    title: 'Snake',
    description: 'Guide the snake to eat food and grow longer, but avoid hitting walls or yourself!',
    category: 'Arcade',
    preview: '/games/snake-preview.jpg',
    icon: '/games/snake-icon.png',
    isImplemented: true
  },
  {
    id: 'pong',
    title: 'Pong',
    description: 'Classic table tennis game. Hit the ball past your opponent to score points.',
    category: 'Arcade',
    preview: '/games/pong-preview.jpg',
    icon: '/games/pong-icon.png',
    isImplemented: true
  },
  {
    id: 'breakout',
    title: 'Breakout',
    description: 'Classic brick-breaking game. Destroy all bricks to clear the level.',
    category: 'Arcade',
    preview: '/games/breakout-preview.jpg',
    icon: '/games/breakout-icon.png',
    isImplemented: false
  },
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    description: 'Find all the mines without detonating any bombs!',
    category: 'Puzzle',
    preview: '/games/minesweeper-preview.jpg',
    icon: '/games/minesweeper-icon.png',
    isImplemented: false
  },
  {
    id: 'rock-paper-scissors',
    title: 'Rock-Paper-Scissors',
    description: 'Classic hand game. Choose rock, paper, or scissors to play against the computer.',
    category: 'Arcade',
    preview: '/games/rock-paper-scissors-preview.jpg',
    icon: '/games/rock-paper-scissors-icon.png',
    isImplemented: false
  },
  {
    id: 'tic-tac-toe',
    title: 'Tic-Tac-Toe',
    description: 'Classic two-player game. Be the first to get three in a row to win.',
    category: 'Strategy',
    preview: '/games/tic-tac-toe-preview.jpg',
    icon: '/games/tic-tac-toe-icon.png',
    isImplemented: false
  },
  {
    id: 'connect-four',
    title: 'Connect Four',
    description: 'Classic two-player game. Be the first to get four in a row to win.',
    category: 'Strategy',
    preview: '/games/connect-four-preview.jpg',
    icon: '/games/connect-four-icon.png',
    isImplemented: false
  },
  {
    id: 'sudoku',
    title: 'Sudoku',
    description: 'Classic puzzle game. Fill in the missing numbers to solve the puzzle.',
    category: 'Puzzle',
    preview: '/games/sudoku-preview.jpg',
    icon: '/games/sudoku-icon.png',
    isImplemented: false
  },
  {
    id: 'chess',
    title: 'Chess',
    description: 'Classic two-player game. Be the first to get three in a row to win.',
    category: 'Strategy',
    preview: '/games/chess-preview.jpg',
    icon: '/games/chess-icon.png',
    isImplemented: false
  },
  {
    id: 'checkers',
    title: 'Checkers',
    description: 'Classic two-player game. Be the first to get three in a row to win.',
    category: 'Strategy',
    preview: '/games/checkers-preview.jpg',
    icon: '/games/checkers-icon.png',
    isImplemented: false
  },
  {

    id: "solitaire",
    title: "Solitaire",
    description: "Classic solitaire game. Match cards to win.",
    category: "Arcade",
    preview: "/games/solitaire-preview.jpg",
    icon: "/games/solitaire-icon.png",
    isImplemented: false

  }

  // Add more games here

]