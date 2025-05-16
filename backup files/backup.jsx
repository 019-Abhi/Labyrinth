import { useState, useEffect, useRef } from 'react';
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

  let RightArrowPressed = null;
  const RightScrollRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(event) {
      let newRow = CurrentPosition.Row;
      let newCol = CurrentPosition.Col;
      let handled = false;

      switch (event.key) {

        case 'ArrowUp':
          newRow = Math.max(0, CurrentPosition.Row - 1);
          handled = true;
          break;

        case 'ArrowDown':
          newRow = Math.min(rows - 1, CurrentPosition.Row + 1);
          handled = true
          break;

        case 'ArrowLeft':
          newCol = Math.max(0, CurrentPosition.Col - 1);
          handled = true;
          break;

        case 'ArrowRight':
          newCol = Math.min(cols - 1, CurrentPosition.Col + 1);
          handled = true;
          RightArrowPressed = true;
          break;
          
        default:
          return;
      }

      const newPosition = { Row: newRow, Col: newCol };
      setCurrentPosition(newPosition);
      setVisitedRooms(prevVisited => new Set([...prevVisited, `${newPosition.Row}-${newPosition.Col}`]));

      if (handled) {
        event.preventDefault();
      } 
    } 

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [CurrentPosition, rows, cols, setCurrentPosition, setVisitedRooms]);


  useEffect(() => {
    if(RightScrollRef.current){
      RightScrollRef.current.scrollBy({left: 100, behaviour: 'smooth'})
    }

  }, [RightArrowPressed])



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


      <div className = "Outer_Box_Flex">
        <div className = "Outer_Box_Grid" ref = {RightScrollRef}>

          {Array.from({ length: rows }).flatMap((_, row) =>
            Array.from({ length: cols }).map((__, col) => {
              const key = `${row}-${col}`;
              const isVisited = VisitedRooms.has(key);
              const isCurrent = row === CurrentPosition.Row && col === CurrentPosition.Col;
              const isTreasure = row === 4 && col === 4;
            
              return (

                <div key = {key}>

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
    </div>
  );
}

export default App;