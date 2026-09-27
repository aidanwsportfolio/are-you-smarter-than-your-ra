import { useState } from 'react'
import './App.css'

function App() {
  // Game state
  const [gameStarted, setGameStarted] = useState(false)
  const [raScore, setRaScore] = useState(0)
  const [studentScore, setStudentScore] = useState(0)
  const [currentTeam, setCurrentTeam] = useState('RA')
  return (
    <div>
      <h1>Are You Smarter Than Your RA?</h1>

      <h2>Team RA vs. Team Students</h2>

      {/*Display the game after the host starts it*/}
      {gameStarted ? (
        <div>
          {/*Current Team */}
          <h2>Current Turn: Team {currentTeam}</h2>

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
        <button onClick={() => setGameStarted(true)}>Start Game</button>
      )}
    </div>
  )
}

export default App