import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  function Room({ row, col }) {

    if (row == 4 && col == 4){
      return (

        <div className="Room">
          <p>
            TREASURE!
          </p>
        </div>
  
      )
    }

    else{
      return (

        <div className="Room">
          <p>
            This is a single room of row {row} and col {col}
          </p>
        </div>
  
      )
    }

  }

  
  



  const rows = 9;
  const cols = 9;



  const labyrinth_in_2d_array = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => <Room key={`${row}-${col}`} row={row} col={col} />)
  );


  return (
    <div>



     
      <div className = 'Intro_Box'>


        <center>

          <h1 className = 'heading'>

            Welcome to The Hidden Labyrinth

          </h1>

          <p className = 'Intro_Text'>

            You've entered The Hidden Labyrinth, an ancient maze shrouded in mystery and shadow
            <br />
            Venture deep into the heart of the labyrinth, where a treasure lies hidden
            <br />
            Navigate to the center, and make your way to the exit to claim your victory

          </p>

        </center>


      </div>

      <div className = "Outer_Box">


      {labyrinth_in_2d_array.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row}
          </div>
        ))}
      </div>

 
      
    </div>

  )
}

export default App
