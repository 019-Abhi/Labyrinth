import { useNavigate } from 'react-router-dom';
import './Home.css'

function Home() {

    const navigate = useNavigate();

    return(
    
        <div>
        {/* Intro box to give an intro about the game */}

            <div className = 'IntroBox'>
                
                
                <h1 className = 'Heading'>
                    Welcome to The Hidden Labyrinth
                </h1>

                <p className = 'IntroText'>
                    You've entered The Hidden Labyrinth, an ancient maze shrouded in mystery and shadow
                    <br />
                    Venture deep into the heart of the labyrinth, where a treasure lies hidden
                    <br />
                    Navigate to the center, and make your way to the exit to claim your victory
                </p>
                
                <button onClick={() => navigate('/Home')} className = 'PlayButton'>
                    Play
                </button>

            
            </div>
        </div>
    );
};

export default Home;