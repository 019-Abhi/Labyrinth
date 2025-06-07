import { useState, useEffect, useRef, useMemo } from 'react';
import './Game.css'
import confetti from 'canvas-confetti';
import { FaVolumeXmark } from "react-icons/fa6";
import { IoVolumeMediumSharp } from "react-icons/io5";

function Play() {

  //Initial position
  const InitialPosition = {
    "Row": 4,
    "Col": 4
  }; 

  //Creates a random treasure room
  function TreasureRowColGenerator() {

    const TreasureRow = Math.floor(Math.random() * 9);
    let TreasureCol;

    if ( TreasureRow == 0 || TreasureRow == 8){
      TreasureCol = Math.floor(Math.random() * 9);
    }

    else{
      TreasureCol = Math.random() < 0.5 ? 0 : 8;
    }

    console.log('Treasure room: ' + TreasureRow +','+ TreasureCol )
    return {TreasureRow, TreasureCol}
    
  };

  const [TreasureRoom] = useState(() => TreasureRowColGenerator());

  console.log (TreasureRoom)

  //Decalaration statements
  const [CurrentPosition, setCurrentPosition] = useState(InitialPosition);
  const [VisitedRooms, setVisitedRooms] = useState(new Set([`${InitialPosition.Row}-${InitialPosition.Col}`]));
  const [Floors, setFloors] = useState({});
  const [Doors, setDoors] = useState({});
  const [HowToPlayPopup, setHowToPlayPopup] = useState(false);
  const [WinnerPopup, setWinnerPopup] = useState(false);
  const [LoserPopup, setLoserPopup] = useState(false)
  const [ValueForUseEffect, setValueForUseEffect] = useState(1);
  const [Seconds, setSeconds] = useState(30);
  const intervalRef = useRef(null);
  const [AllowMovement, setAllowMovement] = useState(true);
  const [Muted, setMuted] = useState(false);

  const CharacterEmoji = '🐶';
  const rows = 9;
  const cols = 9; 

  const gridRef = useRef(null);

  function GeneratePathToTreasureRoom(InitialRow, InitialCol, TreasureRow, TreasureCol) {

    let currentRow = InitialRow;
    let currentCol = InitialCol;

    // Object to hold door states along the treasure path
    const pathDoors = {};

    while (currentRow !== TreasureRow || currentCol !== TreasureCol) {

      const currentKey = `${currentRow}-${currentCol}`;

      let direction;
      let nextRow = currentRow;
      let nextCol = currentCol;

      // Decide direction to move closer to treasure
      if (currentRow !== TreasureRow) {

        direction = currentRow < TreasureRow ? 'Down' : 'Up';
        nextRow = currentRow < TreasureRow ? currentRow + 1 : currentRow - 1;
      
      } 
      
      else {

        direction = currentCol < TreasureCol ? 'Right' : 'Left';
        nextCol = currentCol < TreasureCol ? currentCol + 1 : currentCol - 1;
      
      }

      const nextKey = `${nextRow}-${nextCol}`;

      // Initialize doors for current and next rooms if not already set
      if (!pathDoors[currentKey]) {

        pathDoors[currentKey] = { UpDoor: (Math.random() < 0.5), DownDoor: (Math.random() < 0.5), LeftDoor: (Math.random() < 0.5), RightDoor: (Math.random() < 0.5) };
      
      }

      if (!pathDoors[nextKey]) {

        pathDoors[nextKey] = { UpDoor: (Math.random() < 0.5), DownDoor: (Math.random() < 0.5), LeftDoor: (Math.random() < 0.5), RightDoor: (Math.random() < 0.5) };
      
      }

      // Open doors between current room and next room based on direction
      if (direction === 'Up') {

        pathDoors[currentKey].UpDoor = true;
        pathDoors[nextKey].DownDoor = true;

      } 
      
      else if (direction === 'Down') {

        pathDoors[currentKey].DownDoor = true;
        pathDoors[nextKey].UpDoor = true;
      
      } 
      
      else if (direction === 'Left') {

        pathDoors[currentKey].LeftDoor = true;
        pathDoors[nextKey].RightDoor = true;
      
      } 
      
      else if (direction === 'Right') {

        pathDoors[currentKey].RightDoor = true;
        pathDoors[nextKey].LeftDoor = true;
      
      }

      // Move to next room
      currentRow = nextRow;
      currentCol = nextCol;

    }

    return pathDoors;
  }


  //Literally a floor selector
  function FloorSelector() {

    const FloorList = ['Floor1', 'Floor2', 'Floor3', 'Floor4', 'Floor5', 'Floor6', 'Floor7', 'Floor8', 'Floor9', 'Floor10'];
    const RandomIndex = Math.floor(Math.random() * FloorList.length);
    return FloorList[RandomIndex];

  };

  //And a door selector randomizer
  function DoorSelector(FixedDoorinNewRoom, CurrentRow, CurrentCol, EntireDoorsState = {}) {

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

    //to allow reverse travel
    if (FixedDoorinNewRoom) {

      switch(FixedDoorinNewRoom){

        case 'Up':
          doors.UpDoor = true;
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

    //checks neighboring rooms for doors into the current room and updates the current rooms doors based on that
    const RoomAbove = `${CurrentRow - 1}-${CurrentCol}`;
    const hasBottomDoorinRoomAbove = EntireDoorsState[RoomAbove]?.DownDoor;

    const RoomLeft = `${CurrentRow}-${CurrentCol - 1}`;
    const hasRightDoorinRoomLeft = EntireDoorsState[RoomLeft]?.RightDoor;

    const RoomRight = `${CurrentRow}-${CurrentCol + 1}`;
    const hasLeftDoorinRoomRight = EntireDoorsState[RoomRight]?.LeftDoor;

    const RoomBottom = `${CurrentRow + 1}-${CurrentCol}`;
    const hasUpDoorinRoomBottom = EntireDoorsState[RoomBottom]?.UpDoor;

    if (hasBottomDoorinRoomAbove){
      doors.UpDoor = true;
    }

    if(hasRightDoorinRoomLeft){
      doors.LeftDoor = true;
    }

    if(hasLeftDoorinRoomRight){
      doors.RightDoor = true;
    }

    if(hasUpDoorinRoomBottom){
      doors.DownDoor = true;
    }

    return doors;

  }

  //Useeffect to run the path generator function
  useEffect (() => {

    const pathDoors = GeneratePathToTreasureRoom ( InitialPosition.Row,InitialPosition.Col,TreasureRoom.TreasureRow,TreasureRoom.TreasureCol );

    // Merge with current doors, preserving any existing doors (e.g., starting room's all doors)
    setDoors(prevDoors => {
      const merged = { ...prevDoors };

      for (const key in pathDoors) {
        if (!merged[key]) {
          merged[key] = pathDoors[key];
        } else {
          // Merge door booleans with OR logic
          merged[key] = {
            UpDoor: merged[key].UpDoor || pathDoors[key].UpDoor,
            DownDoor: merged[key].DownDoor || pathDoors[key].DownDoor,
            LeftDoor: merged[key].LeftDoor || pathDoors[key].LeftDoor,
            RightDoor: merged[key].RightDoor || pathDoors[key].RightDoor,
          };
        }
      }

      return merged;
    });
  }, [ValueForUseEffect]);


  //useeffect for the starting room to have doors and floor 
  useEffect(() => {

    const key = `${InitialPosition.Row}-${InitialPosition.Col}`;

    const DoorsforStartingRoom = {

      UpDoor: true,
      DownDoor: true,
      LeftDoor: true,
      RightDoor: true

    }

    const StartingRoomFloor = 'StartingRoomFloor'

    setFloors({ [key]: 'Floor9' });
    setDoors({ [key]: DoorsforStartingRoom });

  }, []);


  //To check which arrow key is pressed; updates CurrentPosition and VisitedRooms
  useEffect(() => {

      function handleKeyDown(event) {
        let newRow = CurrentPosition.Row;
        let newCol = CurrentPosition.Col;
        let handled = false;
        let FixedDoorinNewRoom = null;


        if (AllowMovement === true){

          switch (event.key) {

            case 'ArrowUp':

              if (Doors[`${CurrentPosition.Row}-${CurrentPosition.Col}`]?. UpDoor){

                newRow = Math.max(0, CurrentPosition.Row - 1);
                FixedDoorinNewRoom = 'Down';
                handled = true;

              }

              break;

            case 'ArrowDown':

              if(Doors[`${CurrentPosition.Row}-${CurrentPosition.Col}`]?. DownDoor){

                newRow = Math.min(rows - 1, CurrentPosition.Row + 1);
                FixedDoorinNewRoom = 'Up';
                handled = true;

              }

              break;

            case 'ArrowLeft':

              if(Doors[`${CurrentPosition.Row}-${CurrentPosition.Col}`]?. LeftDoor){

                newCol = Math.max(0, CurrentPosition.Col - 1);
                handled = true;
                FixedDoorinNewRoom = 'Right';

              }

              break;

            case 'ArrowRight':

              if(Doors[`${CurrentPosition.Row}-${CurrentPosition.Col}`]?. RightDoor){

                newCol = Math.min(cols - 1, CurrentPosition.Col + 1);
                FixedDoorinNewRoom = 'Left';
                handled = true;

              }

              break;

            default:
              return;

          }
        }

        //Updates CurrentPosition and VisitedRooms
        const newPosition = { Row: newRow, Col: newCol };
        setCurrentPosition(newPosition);
        setVisitedRooms(prevVisited => new Set([...prevVisited, `${newPosition.Row}-${newPosition.Col}`]))



        //To assign new floor layout for new rooms and keep old floor layouts for previously visited rooms; also updates neighboring rooms to have doors if thec current room has a door into them
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
        setDoors(prev => {
          
          const key = `${newRow}-${newCol}`;

          if (prev[key]) return prev;

          const newDoors = DoorSelector(FixedDoorinNewRoom, newRow, newCol, prev);
          const updated = { ...prev, [key]: newDoors };

          const updateNeighbor = (neighborKey, oppositeDirection) => {

            if (updated[neighborKey]) {

              updated[neighborKey] = { ...updated[neighborKey], [oppositeDirection]: true };

            }
          };

          if (newDoors.UpDoor) {
            updateNeighbor(`${newRow - 1}-${newCol}`, 'DownDoor');
          }

          if (newDoors.DownDoor) {
            updateNeighbor(`${newRow + 1}-${newCol}`, 'UpDoor');
          }

          if (newDoors.LeftDoor) {
            updateNeighbor(`${newRow}-${newCol - 1}`, 'RightDoor');
          }

          if (newDoors.RightDoor) {
            updateNeighbor(`${newRow}-${newCol + 1}`, 'LeftDoor');
          }

          return updated;
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
      currentRoomElement.scrollIntoView({

        behavior: 'smooth',
        block: 'center',
        inline: 'center'

      });
    }

  }, [CurrentPosition])

  //Confetti popup
  useEffect(() => {
    if (CurrentPosition.Row === TreasureRoom.TreasureRow && CurrentPosition.Col === TreasureRoom.TreasureCol) {

      setWinnerPopup(true);

      confetti({
        particleCount: 1000,
        spread: 800,
        origin: { y: 0.6 }
      });
    }
  }, [CurrentPosition]);

  //For the path generator use effect to work this has to run atleast onc
    useEffect(() => {
      if (ValueForUseEffect <= 1) {
        setValueForUseEffect(prev => prev + 1);
      }
    }, [ValueForUseEffect]);


  //Timer UseEffect
  useEffect(() => {

    intervalRef.current = setInterval(() => {

      setSeconds(prevSeconds => { 

        if (prevSeconds === 1) {

          clearInterval(intervalRef.current);
          setAllowMovement(false);
          setLoserPopup(true);
          return 0; 
          
        }

        return prevSeconds - 1; 

      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  //useEffect for stopping timer when player wins
  useEffect(() =>{

    if (CurrentPosition.Row === TreasureRoom.TreasureRow && CurrentPosition.Col === TreasureRoom.TreasureCol){

      clearInterval(intervalRef.current);
      
    }

  }, [CurrentPosition])

  

  //HTML beings *applause*
  return (

    <div>


      <div className = 'HelpButtonWrapper'>
        
        <button className = 'HelpButton' onClick = {() => setHowToPlayPopup(true)}>
          How To Play
        </button>

      </div>

      <div className = 'Timerdiv'>

        <div className = 'Timer'>
          <center>
            <p> {Seconds}</p>
          </center>
        </div>

      </div>

      <div className = 'AudioDiv'>

        <button className = 'Audio' onClick = { () => setMuted(!Muted)}>
          {Muted? <FaVolumeXmark className = 'VolumeOffIcon'/> : <IoVolumeMediumSharp className = 'VolumeOnIcon'/>}
        </button>

      </div>


      <div className="Outer_Box_Flex" ref={gridRef}>

        {/* Help button div */}
        {HowToPlayPopup && (
          <div className = 'JustToCenterHelpWindow'>
            <div className = 'HelpWindow'>

              <h1 className = 'HelpHeading'>⚜️ Welcome to The Hidden Labyrinth ⚜️</h1>

              <p className = 'HelpText'>

                Thou awakest at the heart of a vast and ancient labyrinth <br />
                Thy memory is shrouded in mist — yet one truth remains: <br/> <b>Thou must escape</b> <br/> 

                Somewhere 'long the outer walls lieth the way out <br />
                Seek it before thou art claimed by the Hidden Labyrinth <br/>
                Use the arrow keys to traverse from chamber to chamber <br />
                <br />
                Fortune favor thee, brave wanderer

              </p>

              <div className = 'HelpCancelButtonWrapper'>
                <button className = 'HelpCancelButton' onClick = {() => setHowToPlayPopup(false)}>
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

        {/* After Win Popup */}
        {WinnerPopup && (
          <div className = 'JustToCenterWinnerWindow'>
            <div className = 'WinnerWindow'>

              <h1 className = 'WinnerHeading'>⚜️ Congratulations! ⚜️</h1>

              <p className = 'WinnerText'>

                You've found your way out of The Hidden Labyrinth

              </p>

              <div className = 'WinnerCancelButtonWrapper'>

                <button className = 'WinnerCancelButton' onClick = {() => setWinnerPopup(false)}>
                  Close
                </button>

                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 

                <button className = 'WinnerPlayAgainButton' onClick = {() => window.location.reload()}>
                  Play Again
                </button>

              </div>

            </div>
          </div>
        )}

        {/* Loser Popup */}
        {LoserPopup && (

          <div className = 'JustToCenterWinnerWindow'>
            <div className = 'LoserWindow'>

              <h1 className = 'WinnerHeading'>⚜️ Your Path Ends Here ⚜️</h1>

              <p className = 'WinnerText'>

                 The sands of time have run dry, <br />
                the Labyrinth has claimed another wanderer

              </p>
          
              <div className = 'WinnerCancelButtonWrapper'>
                
                <button className = 'LoserPlayAgainButton' onClick = {() => window.location.reload()}>
                  Play Again
                </button>

              </div>

            </div>
          </div>
          
        )}




        {/* Grid and printing rooms */}
        <div className="Outer_Box_Grid">

          {Array.from({ length: rows }).flatMap((_, row) =>
            Array.from({ length: cols }).map((__, col) => {
              const key = `${row}-${col}`;
              const isVisited = VisitedRooms.has(key);
              const isCurrent = row === CurrentPosition.Row && col === CurrentPosition.Col;
              // const isTreasure = row === 4 && col === 4;

              return (

                <div>

                  {isVisited ? (
                    <div id={key} className = "Room_Visited">

                      {/* Loads walls and conditionally doors :) */}
                      <div className = {Floors[key]}>

                        {row !== 0 && Doors[key]?.UpDoor && <div className= "DoorUp" />}
                        {row !== 8 && Doors[key]?.DownDoor && <div className= "DoorDown" />}
                        {col !== 0 && Doors[key]?.LeftDoor && <div className= "DoorLeft" />}
                        {col !== 8 && Doors[key]?.RightDoor && <div className= "DoorRight" />}

                        <div className = 'WallUp' />
                        <div className = 'WallDown' />
                        <div className = 'WallRight' />
                        <div className = 'WallLeft' /> 

                        {isCurrent && <div className='Emoji'>{CharacterEmoji}</div>}

                      </div>                        

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

// Happily ever after
export default Play;
