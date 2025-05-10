import { useState, useEffect } from 'react';
import './App.css'

function App() {
  const InitialPosition = {
    "Row": 0,
    "Col": 4
  };

  const [CurrentPosition, setCurrentPosition] = useState(InitialPosition);
  const [VisitedRooms, setVisitedRooms] = useState(new Set([`${InitialPosition.Row}-${InitialPosition.Col}`]));

  const CharacterEmoji = '🐶';

  const rows = 9;
  const cols = 9;

  useEffect(() => {
    function handleKeyDown(event) {
      let newRow = CurrentPosition.Row;
      let newCol = CurrentPosition.Col;

      switch (event.key) {
        case 'ArrowUp':
          newRow = Math.max(0, CurrentPosition.Row - 1);
          break;
        case 'ArrowDown':
          newRow = Math.min(rows - 1, CurrentPosition.Row + 1);
          break;
        case 'ArrowLeft':
          newCol = Math.max(0, CurrentPosition.Col - 1);
          break;
        case 'ArrowRight':
          newCol = Math.min(cols - 1, CurrentPosition.Col + 1);
          break;
        default:
          return;
      }

      const newPosition = { Row: newRow, Col: newCol };
      setCurrentPosition(newPosition);
      setVisitedRooms(prevVisited => new Set([...prevVisited, `${newPosition.Row}-${newPosition.Col}`]));
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [CurrentPosition, rows, cols, setCurrentPosition, setVisitedRooms]);

  function RoomContent({ row, col, CurrentPosition, CharacterEmoji }) {
    const isTreasure = row === 4 && col === 4;
    const isCurrent = row === CurrentPosition.Row && col === CurrentPosition.Col;

    return (
      <>
        <p>
          {isTreasure ? 'TREASURE!' : `This is room (${row}, ${col})`}
        </p>
        {isCurrent && <>{CharacterEmoji}</>}
      </>
    );
  }

  return (
    <div>
      <div className='Intro_Box'>
        <center>
          <h1 className='heading'>
            Welcome to The Hidden Labyrinth
          </h1>
          <p className='Intro_Text'>
            You've entered The Hidden Labyrinth, an ancient maze shrouded in mystery and shadow
            <br />
            Venture deep into the heart of the labyrinth, where a treasure lies hidden
            <br />
            Navigate to the center, and make your way to the exit to claim your victory
          </p>
        </center>
      </div>

      <div className="Outer_Box">

        {Array.from({ length: rows }).flatMap((_, row) =>
          Array.from({ length: cols }).map((__, col) => {
            const key = `${row}-${col}`;
            const isVisited = VisitedRooms.has(key);
            const isCurrent = row === CurrentPosition.Row && col === CurrentPosition.Col;
            const isTreasure = row === 4 && col === 4;
    
      {/*      
            return (
              <div key={key} className="Room">
                {isVisited ? (
                  <>
                    <p>{isTreasure ? 'TREASURE!' : `This is room (${row}, ${col})`}</p>
                    {isCurrent && <>{CharacterEmoji}</>}
                  </>
                ) : null}
    
              </div>
           );
  
*/}
            
            return (

              <div>
                {isVisited? (

                 <div key = {key} className = 'Room_Visited'>
                    <p>{isTreasure ? 'TREASURE!' : `This is room (${row}, ${col})`}</p>
                    {isCurrent && <>{CharacterEmoji}</>}
                  </div>

                ) : null}
              </div>


             
            );


          })
        )}
      </div>
    </div>
  );
}

export default App;