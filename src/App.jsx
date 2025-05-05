import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>



     
      <div className = 'Intro_Box'>


        <center>

          <h1 className = 'heading'>

            Welcome to The Hidden Labyrinth

          </h1>

          <p>

            You've entered The Hidden Labyrinth, an ancient maze shrouded in mystery and shadow. 

          </p>


          <p>

            Venture deep into the heart of the labyrinth, where a treasure lies hidden. 
            <br />
            Navigate the maze, find the center, and make your way to the exit to claim your victory.

          </p>

        </center>


      </div>

      <div className = "Outer_Box">

        <p>
          hello?
        </p>


 
      </div>
    </div>

  )
}

export default App
