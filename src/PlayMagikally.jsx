import { useState, useEffect, useRef } from 'react';
import './Playmagikally.css'

function Play() {

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

  const [Popups, setPopups] = useState([]);

  const [ConfirmLifeHack, setConfirmLifeHack] = useState(false);

  function spawnPopups(){

    const count = 300;
    const newPopups = [];

    for (let i = 0; i < count; i++){

        newPopups.push({
            id: 1, top: Math.random() * 90 + 'vh', left: Math.random() * 90 + 'vw',
        });
    }

    setPopups(newPopups);

  }




  //Literally a floor selector
  function FloorSelector() {

    const FloorList = ['Floor1', 'Floor2', 'Floor3', 'Floor4', 'Floor5', 'Floor6', 'Floor7', 'Floor8', 'Floor9', 'Floor10'];
    const RandomIndex = Math.floor(Math.random() * FloorList.length);
    return FloorList[RandomIndex];

  };

  useEffect(() => {

    const key = `${InitialPosition.Row}-${InitialPosition.Col}`;
    setFloors({
      [key]: 'Floor1'
    });

  }, []);



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

        if (prev[key]) {
          return prev;
        };

        return {
          ...prev,
          [key]: FloorSelector()
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

     <div className="Outer_Box_Flex">
      
        <button
            style={{
                position: 'fixed',
                bottom: '1rem',
                right: '1rem',
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                backgroundColor: '#3d6269',
                color: '#f3f0ff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                zIndex: 1000,
            }}
         onClick = {() => setConfirmLifeHack(true)}
        >
                Ultimate Life Hack 
        </button>

        {Popups.map(({ id, top, left }) => (
            <div
            key={id}
            className="PopupBox"
            style={{ top, left, position: 'fixed', transform: 'translate(-50%, -50%)' }}
            >
                <p>in life we're always learning <br />
                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; -Thomas
                </p>
            </div>
        ))}

        {ConfirmLifeHack && (
            <div className="confirm-popup-overlay">
                <div className="confirm-popup">
                    <p>Proceed?</p>
                    <button onClick = {spawnPopups}> Embrace Thine Oblivion </button>
                    <button onClick={() => setConfirmLifeHack(false)}> I'm scared </button>
                </div>
            </div>
        )}


        <div ref={gridRef} className="Outer_Box_Grid">

            {Array.from({ length: rows }).flatMap((_, row) =>
            Array.from({ length: cols }).map((__, col) => {
                const key = `${row}-${col}`;
                const isVisited = VisitedRooms.has(key);
                const isCurrent = row === CurrentPosition.Row && col === CurrentPosition.Col;
                const isTreasure = row === 4 && col === 4;

                return (

                <div key={key}>

                    {isVisited ? (
                    <div id={key} className="Room_Visited">

                        <div className={Floors[key]}>

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
  );
}

export default Play;