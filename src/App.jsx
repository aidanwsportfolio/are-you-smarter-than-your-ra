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
  const [wheelRotation, setWheelRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [gameOver, setGameOver] = useState(false)

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
      category: 'A Campus Love Story',
      answer: 'A DATE AT THE FIVE DINING HALL'
    },
    {
      category: 'RA Life',
      answer: "DID YOU FILL OUT YOUR ROOMMATE AGREEMENT"
    },
    {
      category: 'People',
      answer: 'SOUTHWEST RESIDENCE COORDINATOR DANA BETHEL'
    },
    {
      category: 'College Life',
      answer: 'I HAVE AN EIGHT AM TOMORROW'
    },
    {
      category: 'RA Life',
      answer:
      'HAVE YOU TRIED SUBMITTING A WORK ORDER'
    },
    {
      category: 'Phrase',
      answer:
        'I PAY 70 THOUSAND A YEAR TO GO TO LSU AND WE ARE GOD AWFUL AT FOOTBALL'
    },
    {
      category: 'Phrase',
      answer:
      'WEST SIDE BEST SIDE'
    },
    {
      category: 'College Life',
      answer: 'REFUND CHECK JUST HIT'
    },
    {
      category: 'College Life',
      answer: 'CAN YOU SEND ME THE QR CODE'
    },
    {
      category: 'Final Round',
      answer: 'ARE YOU SMARTER THAN YOUR RA'
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
    if (isSpinning) {
      return
    }

    setIsSpinning(true)
    setSpinResult(null)

    const randomIndex = Math.floor(Math.random() * wheelValues.length)
    const result = wheelValues[randomIndex]

    const segmentAngle = 360 / wheelValues.length

    // Center of the randomly selected segment
    const segmentCenter =
      randomIndex * segmentAngle + segmentAngle / 2

    // Keep the wheel's current full rotations,
    // then add five more spins and land the selected segment at the top
    const currentFullRotations =
      Math.floor(wheelRotation / 360) * 360

    const targetRotation =
      currentFullRotations +
      5 * 360 +
      (360 - segmentCenter)

    setWheelRotation(targetRotation)

    setTimeout(() => {
      setSpinResult(result)
      setIsSpinning(false)

      if (result === 'BANKRUPT') {
        if (currentTeam === 'RA') {
          setRaScore(0)
        } else {
          setStudentScore(0)
        }

        setCurrentTeam(
          currentTeam === 'RA' ? 'Students' : 'RA'
        )
      }

      if (result === 'LOSE A TURN') {
        setCurrentTeam(
          currentTeam === 'RA' ? 'Students' : 'RA'
        )
      }
    }, 3000)
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

  function resetGame() {
  setRaScore(0)
  setStudentScore(0)
  setCurrentTeam('RA')
  setGuessedLetters([])
  setSpinResult(null)
  setPuzzleSolved(false)
  setCurrentPuzzleIndex(0)
  setBuyingVowel(false)
  setWheelRotation(0)
  setIsSpinning(false)
  setGameOver(false)
}

function endGame() {
  setGameOver(true)
}

  return (
    <div>
      <h1>Are You Smarter Than Your RA?</h1>
      <h2>Team RA vs. Team Students</h2>

      {!gameStarted ? (
        <div className="start-screen">
          <button onClick={() => setGameStarted(true)}>
            Start Game
          </button>
        </div>
      ) : gameOver ? (
        <div className="winner-screen">
          <h2>🏆 GAME OVER 🏆</h2>

          <h1>
            {raScore > studentScore
              ? 'TEAM RA WINS!'
              : studentScore > raScore
                ? 'TEAM STUDENTS WIN!'
                : "IT'S A TIE!"}
          </h1>

          <div className="final-scores">
            <p>Team RA: ${raScore}</p>
            <p>Team Students: ${studentScore}</p>
          </div>

          <button onClick={resetGame}>
            Play Again
          </button>

          </div>

          ) : (
            <div className="game-screen">

          {/* Current turn */}
          <div className="turn-banner">
            Current Turn: Team {currentTeam}
          </div>

          {/* Puzzle */}
          <div className="puzzle-section">
            <div className="round-indicator">
              ROUND {currentPuzzleIndex + 1} OF {puzzles.length}
            </div>
            <h3 className="category">
              Category: {currentPuzzle.category}
            </h3>

            <div className="puzzle-board">
              {puzzle.split(' ').map((word, wordIndex) => (
                <div className="puzzle-word" key={wordIndex}>

                  {word.split('').map((character, characterIndex) => (
                    <span
                      className="puzzle-tile"
                      key={characterIndex}
                    >
                      {guessedLetters.includes(character) ||
                        puzzleSolved ||
                        !/[A-Z]/.test(character)
                          ? character
                          : ''}
                    </span>
                  ))}

                </div>
              ))}
            </div>
          </div>

          {/* Wheel */}
          <div className="wheel-area">

            <div className="wheel-container">

              <div className="wheel-pointer">
                ▼
              </div>

              <div
  className="wheel"
    style={{
      transform: `rotate(${wheelRotation}deg)`
    }}
  >
    {wheelValues.map((value, index) => (
      <div
        className="wheel-label"
        key={index}
        style={{
          transform: `rotate(${index * 36 + 18}deg)`
        }}
      >
        <span>
          {typeof value === 'number'
            ? `$${value}`
            : value === 'LOSE A TURN'
              ? 'LOSE'
              : 'BANKRUPT'}
        </span>
      </div>
    ))}

    <div className="wheel-center">
      SPIN
    </div>
  </div>
            </div>

            <button
              className="spin-button"
              onClick={spinWheel}
              disabled={isSpinning}
            >
              {isSpinning ? 'Spinning...' : 'Spin Wheel'}
            </button>

            {spinResult !== null && (
              <div className="spin-result">
                {typeof spinResult === 'number'
                  ? `$${spinResult}`
                  : spinResult}
              </div>
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

          <button
            onClick={nextRound}
            disabled={currentPuzzleIndex === puzzles.length - 1}
          >
            Next Round
          </button>
            
            {currentPuzzleIndex === puzzles.length - 1 && (
              <button
                className="end-game-button"
                onClick={endGame}
              >
                End Game
              </button>
            )}

          {/* Scoreboard */}
          <div className="scoreboard">

            <div
              className={`score-card ${
                currentTeam === 'RA' ? 'active-team' : ''
              }`}
            >
              <h2>TEAM RA</h2>
              <p>${raScore}</p>

              <button onClick={() => setRaScore(raScore + 500)}>
                +$500
              </button>
            </div>

            <div
              className={`score-card ${
                currentTeam === 'Students' ? 'active-team' : ''
              }`}
            >
              <h2>TEAM STUDENTS</h2>
              <p>${studentScore}</p>

              <button onClick={() => setStudentScore(studentScore + 500)}>
                +$500
              </button>
            </div>

          </div>

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
            <button
            className="reset-button"
            onClick={resetGame}
          >
            Reset Game
          </button>

        </div>
      )}

    </div>
  )
}

export default App