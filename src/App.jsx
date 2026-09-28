import { useState } from 'react'
import './App.css'

function App() {
  // Game state
  const [gameStarted, setGameStarted] = useState(false)
  const [raScore, setRaScore] = useState(0)
  const [studentScore, setStudentScore] = useState(0)
  const [currentTeam, setCurrentTeam] = useState('RA')
  const [guessedLetters, setGuessedLetters] = useState([])
  const [spinResult, setSpinResult] = useState(null)
  const [puzzleSolved, setPuzzleSolved] = useState(false)
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0)
  const [buyingVowel, setBuyingVowel] = useState(false)

  // Game data
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

  const puzzles = [
    {
      category: 'Phrase',
      answer:
        'I PAY 70 THOUSAND A YEAR TO GO TO LSU AND WE ARE GOD AWFUL AT FOOTBALL'
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

  // Current puzzle
  const currentPuzzle = puzzles[currentPuzzleIndex]
  const puzzle = currentPuzzle.answer

  function handleLetterGuess(letter) {
    const isVowel = vowels.includes(letter)

    // Consonants require a spin
    if (!isVowel && spinResult === null) {
      return
    }

    // Vowels require vowel-buying mode
    if (isVowel && !buyingVowel) {
      return
    }

    // Count occurrences of the guessed letter
    const matchCount = puzzle
      .split('')
      .filter((character) => character === letter)
      .length

    // Reveal the letter
    setGuessedLetters([...guessedLetters, letter])

    // Handle vowels
    if (isVowel) {
      if (currentTeam === 'RA') {
        setRaScore(raScore - 250)
      } else {
        setStudentScore(studentScore - 250)
      }

      setBuyingVowel(false)

      // Wrong vowel ends the turn
      if (matchCount === 0) {
        setCurrentTeam(currentTeam === 'RA' ? 'Students' : 'RA')
      }

      return
    }

    // Handle consonants
    if (matchCount > 0 && typeof spinResult === 'number') {
      const winnings = spinResult * matchCount

      if (currentTeam === 'RA') {
        setRaScore(raScore + winnings)
      } else {
        setStudentScore(studentScore + winnings)
      }
    } else {
      // Wrong consonant ends the turn
      setCurrentTeam(currentTeam === 'RA' ? 'Students' : 'RA')
    }

    // Spin has been used
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
      setBuyingVowel(false)
    }
  }

  return (
    <div>
      <h1>Are You Smarter Than Your RA?</h1>
      <h2>Team RA vs. Team Students</h2>

      {gameStarted ? (
        <div className="game-screen">

          {/* Current turn */}
          <div className="turn-banner">
            Current Turn: Team {currentTeam}
          </div>

          {/* Puzzle */}
          <div className="puzzle-section">
            <h3 className="category">
              Category: {currentPuzzle.category}
            </h3>

            <div className="puzzle-board">
              {puzzle.split('').map((character, index) => (
                <span
                  key={index}
                  className={
                    character === ' ' ? 'puzzle-space' : 'puzzle-tile'
                  }
                >
                  {guessedLetters.includes(character) || puzzleSolved
                    ? character
                    : ''}
                </span>
              ))}
            </div>
          </div>

          {/* Wheel controls */}
          <div>
            <button onClick={spinWheel}>
              Spin Wheel
            </button>

            {spinResult !== null && (
              <h2>Spin: {spinResult}</h2>
            )}
          </div>

          {/* Buy vowel */}
          <button
            onClick={() => setBuyingVowel(true)}
            disabled={
              currentTeam === 'RA'
                ? raScore < 250
                : studentScore < 250
            }
          >
            Buy Vowel ($250)
          </button>

          {/* Letter board */}
          <div className="letter-board">
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => handleLetterGuess(letter)}
                disabled={
                  guessedLetters.includes(letter) ||
                  (buyingVowel
                    ? !vowels.includes(letter)
                    : vowels.includes(letter) ||
                      spinResult === null ||
                      typeof spinResult !== 'number')
                }
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Puzzle controls */}
          <button onClick={() => setPuzzleSolved(true)}>
            Solve Puzzle
          </button>

          <button onClick={nextRound}>
            Next Round
          </button>

          {/* Team RA scoreboard */}
          <h2>Team RA</h2>
          <p>${raScore}</p>

          <button onClick={() => setRaScore(raScore + 500)}>
            +$500
          </button>

          {/* Team Students scoreboard */}
          <h2>Team Students</h2>
          <p>${studentScore}</p>

          <button onClick={() => setStudentScore(studentScore + 500)}>
            +$500
          </button>

          {/* Manual turn control */}
          <button
            onClick={() =>
              setCurrentTeam(
                currentTeam === 'RA' ? 'Students' : 'RA'
              )
            }
          >
            Switch Turn
          </button>

        </div>
      ) : (
        <button onClick={() => setGameStarted(true)}>
          Start Game
        </button>
      )}
    </div>
  )
}

export default App