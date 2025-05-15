import { useState, useEffect, useRef } from 'react';
import './App.css'

function App() {

  //Initial position
  const InitialPosition = {
    "Row": 0,
    "Col": 4
  };

  //Decalaration statements
  const [CurrentPosition, setCurrentPosition] = useState(InitialPosition);
  const [VisitedRooms, setVisitedRooms] = useState(new Set([`${InitialPosition.Row}-${InitialPosition.Col}`]));
  const [Floors, setFloors] = useState({})


  const CharacterEmoji = '🐶';
  const rows = 9;
  const cols = 9;

  const gridRef = useRef(null);


  //Literally a floor selector
  function FloorSelector(){

    const FloorList = ['Floor1', 'Floor2', 'Floor3', 'Floor4', 'Floor5', 'Floor6', 'Floor7', 'Floor8', 'Floor9', 'Floor10'];
    const RandomIndex = Math.floor(Math.random() * FloorList.length);
    return FloorList[RandomIndex];

  };


  //To check which arrow key is pressed; updates CurrentPosition and VisitedRooms
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
          handled = true;
          break;

        case 'ArrowLeft':
          newCol = Math.max(0, CurrentPosition.Col - 1);
          handled = true;
          break;

        case 'ArrowRight':
          newCol = Math.min(cols - 1, CurrentPosition.Col + 1);
          handled = true;
          break;
          
        default:
          return;
      }

      //Updates CurrentPosition and VisitedRooms
      const newPosition = { Row: newRow, Col: newCol };
      setCurrentPosition(newPosition);
      setVisitedRooms(prevVisited => new Set([...prevVisited, `${newPosition.Row}-${newPosition.Col}`]))



      //To assign new floor layout for new rooms and keep old floor layouts for previously visited rooms
      setFloors(prev => {

        

        const key = `${newRow}-${newCol}`;

        if (prev[key]){
          return prev;
        };

        return {
          ...prev,
          [key] : FloorSelector()
        };

      });


      //Prevents scrolling when arrow keys are pressed
      if (handled) {
        event.preventDefault();
      } 
    } 

    //Cleans up the keydown listener after use, saves memory (I think)
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [CurrentPosition, rows, cols, setCurrentPosition, setVisitedRooms]);


  //To scroll new room into view
  useEffect(() => {
    
    const currentRoomId = `${CurrentPosition.Row}-${CurrentPosition.Col}`;
    const currentRoomElement = document.getElementById(currentRoomId);

    if(gridRef.current && currentRoomElement){
      currentRoomElement.scrollIntoView();
    }

  }, [CurrentPosition])



  //HTML beings *applause*
  return (
    <div>

      {/* Intro box to give an intro about the game */}
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



      {/* Div where the game resides */}
      <div className = "Outer_Box_Flex">
        <div ref = {gridRef} className = "Outer_Box_Grid">

          {Array.from({ length: rows }).flatMap((_, row) =>
            Array.from({ length: cols }).map((__, col) => {
              const key = `${row}-${col}`;
              const isVisited = VisitedRooms.has(key);
              const isCurrent = row === CurrentPosition.Row && col === CurrentPosition.Col;
              const isTreasure = row === 4 && col === 4;
            
              return (

                <div key={key}>

                  {isVisited ? (
                    <div id = {key} className = "Room_Visited">
                      
                      <div className = {Floors[key]} >
                        {isCurrent && <center className = 'Emoji'>{CharacterEmoji}</center>}
                      </div>


                      <p>{isTreasure ? 'TREASURE!' : null}</p>
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