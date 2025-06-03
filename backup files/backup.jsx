import { useState, useEffect, useRef } from 'react';
import './Game.css'
import confetti from 'canvas-confetti';
import StartingRoomStuff from './assets/Decor.png';
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
      TreasureCol = Math.random() < 0.5 ? 0 : 8
    }

    return {TreasureRow, TreasureCol}
  };

  const [TreasureRoom] = useState(() => TreasureRowColGenerator());

  console.log(TreasureRoom)

  //Decalaration statements
  const [CurrentPosition, setCurrentPosition] = useState(InitialPosition);
  const [VisitedRooms, setVisitedRooms] = useState(new Set([`${InitialPosition.Row}-${InitialPosition.Col}`]));
  const [Floors, setFloors] = useState({});
  const [Doors, setDoors] = useState({})
  const [Popup, setPopup] = useState(false);

  const CharacterEmoji = '🐶';
  const rows = 9;
  const cols = 9;

  const gridRef = useRef(null);

  function GeneratePathToTreausreRoom(InitialRow, InitialCol,){

    let CurrentRow = InitialRow;
    let CurrentCol = InitialCol;

    while (CurrentRow !== TreasureRoom.TreasureRow || CurrentCol !== TreasureRoom.TreasureCol){

      const key = `${CurrentRow}-${CurrentCol}`;
      let allowedDirections = ['Up', 'Down', 'Left', 'Right'];

      if (CurrentRow === 0) allowedDirections = allowedDirections.filter(d => d !== 'Up');
      if (CurrentRow === 8) allowedDirections = allowedDirections.filter(d => d !== 'Down');
      if (CurrentCol === 0) allowedDirections = allowedDirections.filter(d => d !== 'Left');
      if (CurrentCol === 8) allowedDirections = allowedDirections.filter(d => d !== 'Right');

      let randomDirecion = allowedDirections[Math.floor(Math.random() * allowedDirections.length)];

      if (randomDirecion === 'Up') CurrentRow--;
      if (randomDirecion === 'Down') CurrentRow++;
      if (randomDirecion === 'Left') CurrentCol--;
      if (randomDirecion === 'Right') CurrentCol++;

      setDoors(prev => {
        const key = `${CurrentRow}-${CurrentCol}`;
        if (prev[key]) return prev;

        const newDoors = DoorSelector(randomDirecion, CurrentRow, CurrentCol, prev);
        const updated = { ...prev, [key]: newDoors };

        const updateNeighbor = (neighborKey, oppositeDirection) => {
          if (updated[neighborKey]) {
            updated[neighborKey] = { ...updated[neighborKey], [oppositeDirection]: true };
          }
        };

        if (newDoors.UpDoor) updateNeighbor(`${CurrentRow - 1}-${CurrentCol}`, 'DownDoor');
        if (newDoors.DownDoor) updateNeighbor(`${CurrentRow + 1}-${CurrentCol}`, 'UpDoor');
        if (newDoors.LeftDoor) updateNeighbor(`${CurrentRow}-${CurrentCol - 1}`, 'RightDoor');
        if (newDoors.RightDoor) updateNeighbor(`${CurrentRow}-${CurrentCol + 1}`, 'LeftDoor');

        return updated;
      });
    }

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

      // UpDoor: Math.random() < 0.5,
      // DownDoor: Math.random() < 0.5,
      // LeftDoor: Math.random() < 0.5,
      // RightDoor: Math.random() < 0.5

      UpDoor: false,
      DownDoor: false,
      LeftDoor: false,
      RightDoor: false   

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
  useEffect(() => {
    GeneratePathToTreausreRoom(InitialPosition.Row, InitialPosition.Col);
  }, []);

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

    setFloors({ [key]: StartingRoomFloor });
    setDoors({ [key]: DoorsforStartingRoom });

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

  useEffect(() => {
    if (CurrentPosition.Row === TreasureRoom.TreasureRow && CurrentPosition.Col === TreasureRoom.TreasureCol) {
      confetti({
        particleCount: 800,
        spread: 300,
        origin: { y: 0.6 }
      });
    }
  }, [CurrentPosition]);


  //HTML beings *applause*
  return (

    <div>


      <div className = 'HelpButtonWrapper'>
        
        <button className = 'HelpButton' onClick = {() => setPopup(true)}>
          How To Play
        </button>

      </div>


      <div className="Outer_Box_Flex" ref={gridRef}>

        {/* Help button div */}
        {Popup && (
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
                <button className = 'HelpCancelButton' onClick = {() => setPopup(false)}>
                  Close
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

                        {CurrentPosition.Row == InitialPosition.Row && CurrentPosition.Col == InitialPosition.Col ? (
                          <div className = 'StartingRoomElements'>
                            <img src = {StartingRoomStuff} alt = 'pole and stuff' />
                          </div>

                        ) : null}

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
