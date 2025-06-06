import { useNavigate } from 'react-router-dom';
import './Home.css'

function Home() {

    const navigate = useNavigate();

    return(
    
        <div className = 'EntireHome'>
        {/* Intro box to give an intro about the game */}

            <div className = 'IntroBox'>
                
                <center>
                    <h1 className = 'Heading'>
                        Welcome to The Hidden Labyrinth
                    </h1>


                    <p className = 'IntroText'>

                        You've stepped into The Hidden Labyrinth — a maze wrapped in shadows and secrets <br />
                        Lost in its winding corridors lies a hidden exit, waiting to be found <br />
                        Begin at the center, and find your way out before the labyrinth claims you

                    </p>

                    <div className = 'ButtonRow'>
    
                        <button onClick={() => navigate('/game')} className = 'PlayButton'>
                            Play
                        </button> 

                    </div>

                    
                </center>
            </div>
        </div>
    );
};

export default Home; 