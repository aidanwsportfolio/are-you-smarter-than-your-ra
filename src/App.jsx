import { useState } from 'react'
import './App.css'

function App() {
  // Game state
  const [gameStarted, setGameStarted] = useState(false)
  const [raScore, setRaScore] = useState(0)
  const [studentScore, setStudentScore] = useState(0)
  const [currentTeam, setCurrentTeam] = useState('RA')
  const [guessedLetters, setGuessedLetters] = useState([])
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  const vowels = ['A', 'E', 'I', 'O', 'U']
  const wheelValues = [
    300,
    400,
    500,
    600,
    700,
    800,
    900,
    1000,
    'BANKRUPT',
    'LOSE A TURN'
  ]
  const [spinResult, setSpinResult] = useState(null)
  const [puzzleSolved, setPuzzleSolved] = useState(false)
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0)

  // Current puzzle
  const puzzles = [
  {
    category: 'Phrase',
    answer: 'I PAY 70 THOUSAND A YEAR TO GO TO LSU AND WE ARE GOD AWFUL AT FOOTBALL'
  },
  {
    category: 'Campus Life',
    answer: 'FIZZ'
  },
  {
    category: 'Thing',
    answer: 'THE FIVE DINING HALL'
  },
  {
    category: 'People',
    answer: 'RESIDENCE COORDINATOR DANA BETHEL'
  }
]

  const currentPuzzle = puzzles[currentPuzzleIndex]
  const puzzle = currentPuzzle.answer

  function handleLetterGuess(letter) {
  // Player must spin before guessing a consonant
  if (spinResult === null) {
    return
  }

  // Count how many times the guessed letter appears
  const matchCount = puzzle
    .split('')
    .filter((character) => character === letter)
    .length

  // Reveal the guessed letter
  setGuessedLetters([...guessedLetters, letter])

  // Award money for a correct guess
  if (matchCount > 0 && typeof spinResult === 'number') {
    const winnings = spinResult * matchCount

    if (currentTeam === 'RA') {
      setRaScore(raScore + winnings)
    } else {
      setStudentScore(studentScore + winnings)
    }
  } else {
  setCurrentTeam(currentTeam === 'RA' ? 'Students' : 'RA')
}

  // The spin has now been used
  setSpinResult(null)
}

  function spinWheel() {
    setSpinResult(null)
    const randomIndex = Math.floor(Math.random() * wheelValues.length)
    const result = wheelValues[randomIndex]

    setSpinResult(result)

      if (result === 'BANKRUPT') {
    if (currentTeam === 'RA') {
      setRaScore(0)
    } else {
      setStudentScore(0)
    }

    setCurrentTeam(currentTeam === 'RA' ? 'Students' : 'RA')
  }

  if (result === 'LOSE A TURN') {
    setCurrentTeam(currentTeam === 'RA' ? 'Students' : 'RA')
  }
}

  function nextRound() {
  if (currentPuzzleIndex < puzzles.length - 1) {
    setCurrentPuzzleIndex(currentPuzzleIndex + 1)
    setGuessedLetters([])
    setPuzzleSolved(false)
    setSpinResult(null)
  }
}

  return (
    <div>
      <h1>Are You Smarter Than Your RA?</h1>

      <h2>Team RA vs. Team Students</h2>

      {/*Display the game after the host starts it*/}
      {gameStarted ? (
        <div>
          {/*Current Team */}
          <h2>Current Turn: Team {currentTeam}</h2>
          <h3>Category: {currentPuzzle.category}</h3>
          <div className = "puzzle-board">
           <div className = "letter-board">
            <div>
              <button onClick = {spinWheel} >Spin Wheel</button>

              {spinResult !== null && (
                <h2>Spin: {spinResult}</h2>
              )}
              </div>
            
            {alphabet.map((letter) => (
              <button 
              key = {letter}
              onClick = {() => handleLetterGuess(letter)}
              disabled = {
                guessedLetters.includes(letter) ||
                vowels.includes(letter) ||
                spinResult === null ||
                typeof spinResult !== 'number'
              }
              >
                {letter}
                </button>
            ))}
            </div>

            <button onClick = {() => setPuzzleSolved(true)}>
              Solve Puzzle
              </button>

            <button onClick={nextRound}>
              Next Round
              </button>

            {puzzle.split('').map((character, index) => (
              <span key = {index}
                className = {character === ' ' ? 'puzzle-space' : 'puzzle-tile'}
                >
                  {guessedLetters.includes(character) || puzzleSolved ? character : ''}
                  </span>
            ))}
            </div>

          {/*Team RA scoreboard */}
          <h2>Team RA</h2>
          <p>${raScore}</p>
          <button onClick ={() => setRaScore(raScore + 500)}>
            +$500
            </button>
          
          {/*Team Students scoreboard */}
          <h2>Team Students</h2>
          <p>${studentScore}</p>
          <button onClick ={() => setStudentScore(studentScore + 500)}>
            +$500
            </button>

          {/* Switch between Team RA and Team Students */}
          <button onClick ={() =>
            setCurrentTeam(currentTeam === 'RA' ? 'Students' : 'RA')
          }
          > Switch Turn </button>
          
        </div>
      ) : (
        <button onClick = {() => setGameStarted(true)}>Start Game</button>
      )}
    </div>
  )
}
export default App