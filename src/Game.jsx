import { useState, useEffect, useRef } from 'react';
import './Game.css'

function Play() {

  //Initial position
  const InitialPosition = {
    "Row": 0,
    "Col": 4
  };

  //Decalaration statements
  const [CurrentPosition, setCurrentPosition] = useState(InitialPosition);
  const [VisitedRooms, setVisitedRooms] = useState(new Set([`${InitialPosition.Row}-${InitialPosition.Col}`]));
  const [Floors, setFloors] = useState({});
  const [Doors, setDoors] = useState({})
  const [Popup, setPopup] = useState(false);
  // const [LastMovement, setLastMovement] = useState(null);


  const CharacterEmoji = '🐶';
  const rows = 9;
  const cols = 9;

  const gridRef = useRef(null);


  //Literally a floor selector
  function FloorSelector() {

    const FloorList = ['Floor1', 'Floor2', 'Floor3', 'Floor4', 'Floor5', 'Floor6', 'Floor7', 'Floor8', 'Floor9', 'Floor10'];
    const RandomIndex = Math.floor(Math.random() * FloorList.length);
    return FloorList[RandomIndex];

  };

  function DoorSelector(FixedDoorinNewRoom) {

    console.log('door selector function called')

    const doors = {

      UpDoor: Math.random() < 0.5,
      DownDoor: Math.random() < 0.5,
      LeftDoor: Math.random() < 0.5,
      RightDoor: Math.random() < 0.5
      
      // UpDoor: false,
      // DownDoor: false,
      // LeftDoor: false,
      // RightDoor: false

    }

    if (FixedDoorinNewRoom) {

      switch(FixedDoorinNewRoom){

        case 'Up':
          doors.UpDoor = true;
          console.log('value of DownDoor: ' + doors['DownDoor'])
          break;
        
        case 'Down':
          doors.DownDoor = true;
          break;

        case 'Right':
          doors.RightDoor = true;
          break;

        case 'Left':
          doors.LeftDoor = true;
          break;

      }
    }

    return doors;

  }


  useEffect(() => {

    const key = `${InitialPosition.Row}-${InitialPosition.Col}`;
    setFloors({ [key]: FloorSelector() });
    setDoors({ [key]: DoorSelector() });

  }, []);



  //To check which arrow key is pressed; updates CurrentPosition and VisitedRooms
  useEffect(() => {
    function handleKeyDown(event) {
      let newRow = CurrentPosition.Row;
      let newCol = CurrentPosition.Col;
      let handled = false;
      let FixedDoorinNewRoom = null;


      switch (event.key) {

        case 'ArrowUp':
          newRow = Math.max(0, CurrentPosition.Row - 1);
          FixedDoorinNewRoom = 'Down';
          console.log('up arrow detected');
          handled = true;
          break;

        case 'ArrowDown':
          newRow = Math.min(rows - 1, CurrentPosition.Row + 1);
          FixedDoorinNewRoom = 'Up';
          console.log('down arrow detected');
          handled = true;
          break;

        case 'ArrowLeft':
          newCol = Math.max(0, CurrentPosition.Col - 1);
          handled = true;
          FixedDoorinNewRoom = 'Right';
          break;

        case 'ArrowRight':
          newCol = Math.min(cols - 1, CurrentPosition.Col + 1);
          FixedDoorinNewRoom = 'Left';
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

        if (prev[key]) {
          return prev;
        };

        return {
          ...prev,
          [key]: FloorSelector()
        };

      });

      //To assign new doors for new rooms and keep old door patterns for visited rooms
      console.log('setdoorfornewroom before seDoors is run: ' + FixedDoorinNewRoom)
      setDoors(prev => {

        const key = `${newRow}-${newCol}`;

        if (prev[key]){
          return prev;
        };

        console.log('setDoors called');
        return {
          ...prev,
          [key]: DoorSelector(FixedDoorinNewRoom)
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

    if (gridRef.current && currentRoomElement) {
      currentRoomElement.scrollIntoView();
    }

  }, [CurrentPosition])



  //HTML beings *applause*
  return (

    <div>


      <div className = 'HelpButtonWrapper'>
        
        <button className = 'HelpButton' onClick = {() => setPopup(true)}>
          How To Play
        </button>

      </div>


      <div className="Outer_Box_Flex" ref={gridRef}>

        {Popup && (
          <div className = 'JustToCenterHelpWindow'>
            <div className = 'HelpWindow'>

              <h1 className = 'HelpHeading'>⚜️ Welcome to The Hidden Labyrinth ⚜️</h1>

              <p className = 'HelpText'>

                Thou begins at the edge of The Hidden Labyrinth <br />
                Thy purpose: to reach its hallowed center, <br/> where the ancient treasure lieth in wait
                <br />
                Use arrow keys to move, stepping from one chamber to another
                <br/>
                Not all paths lead to salvation — <br /> many are traps of stone and shadow
                <br /> <br />
                Fortune favor thee, brave wanderer

              </p>

              <div className = 'HelpCancelButtonWrapper'>
                <button className = 'HelpCancelButton' onClick = {() => setPopup(false)}>
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

        <div className="Outer_Box_Grid">

          {Array.from({ length: rows }).flatMap((_, row) =>
            Array.from({ length: cols }).map((__, col) => {
              const key = `${row}-${col}`;
              const isVisited = VisitedRooms.has(key);
              const isCurrent = row === CurrentPosition.Row && col === CurrentPosition.Col;
              const isTreasure = row === 4 && col === 4;

              return (

                <div>

                  {isVisited ? (
                    <div id={key} className = "Room_Visited">

                      <div className = {Floors[key]}>

                        {row !== 0 && Doors[key]?.UpDoor && <div className="DoorUp" />}
                        {row !== 8 && Doors[key]?.DownDoor && <div className="DoorDown" />}
                        {col !== 0 && Doors[key]?.LeftDoor && <div className="DoorLeft" />}
                        {col !== 8 && Doors[key]?.RightDoor && <div className="DoorRight" />}

                        <div className = 'WallUp' />
                        <div className = 'WallDown' />
                        <div className = 'WallRight' />
                        <div className = 'WallLeft' /> 

                        {isCurrent && <div className='Emoji'>{CharacterEmoji}</div>}

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

export default Play;