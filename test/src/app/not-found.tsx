import Link from 'next/link'

/** 
* Todo
* Remove Root Header from Not found page
*  Implement Retro Game Console Not Found Page
*  Implment Games 
*  
*  Games to Implement
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
*  
*  Create Game Console Layout
*/

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-4">Oops! Page not found</h2>
      <p className="mb-4">The page you're looking for doesn't exist or has been moved.</p>
      <Link href="/" className="text-blue-500 hover:text-blue-600 transition-colors">
        Go back home
      </Link>
      <div className="mt-4">
        <Link href="/contact" className="text-blue-500 hover:text-blue-600 transition-colors">
          Contact Support
        </Link>
      </div>
    </div>
  )
}