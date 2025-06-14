import { useNavigate } from 'react-router-dom';
import './Home.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {


    const navigate = useNavigate();
    const [ShowLeaderboard, setShowLeaderboard] = useState('');
    const [Leaderboard, setLeaderboard] = useState([]);
    // const [LeaderboardList, setLeaderboardList] = useState([]);



    useEffect(() => {
        window.scrollTo({top: 0, behavior: 'smooth' });
    }, [])


    //leaderboard useEffect
    useEffect(() => {

        if (ShowLeaderboard) {
            axios.get('https://labyrinth-production.up.railway.app//leaderboard')
            .then(res => {
                if (res.data.success) setLeaderboard(res.data.data);
            })
            .catch(err => console.error(err));
        }

    }, [ShowLeaderboard]);



    return(
    
        <div className = 'EntireHome'>
        {/* Intro box to give an intro about the game */}


            <div className="LeaderboardDiv">

                <button className="LeaderboardButton" onClick={() => setShowLeaderboard(!ShowLeaderboard)}>
                    Leaderboard 🏆
                </button>

            </div>

    
            {ShowLeaderboard && (

                <div className="LeaderboardPanel">

                    <h3 className = 'LeaderboardHeading'>Top 7 Players</h3>

                    <div className=  'LeaderboardText' > {Leaderboard[0]?.username} - {Leaderboard[0]?.time}s</div>
                    <div className=  'LeaderboardText' > {Leaderboard[1]?.username} - {Leaderboard[1]?.time}s</div>
                    <div className=  'LeaderboardText' > {Leaderboard[2]?.username} - {Leaderboard[2]?.time}s</div>
                    <div className=  'LeaderboardText' > {Leaderboard[3]?.username} - {Leaderboard[3]?.time}s</div>
                    <div className=  'LeaderboardText' > {Leaderboard[4]?.username} - {Leaderboard[4]?.time}s</div>
                    <div className=  'LeaderboardText' > {Leaderboard[5]?.username} - {Leaderboard[5]?.time}s</div>
                    <div className=  'LeaderboardText' > {Leaderboard[6]?.username} - {Leaderboard[6]?.time}s</div>

                    <br />
                    <button className="LeaderboardCancelButton" onClick={() => setShowLeaderboard(!ShowLeaderboard)}>
                        Close
                    </button>

                </div>
            )}


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
    
                        <button onClick={() => navigate('/login')} className = 'PlayButton'>
                            Play
                        </button> 

                    </div>

                    
                </center>
            </div>
        </div>
    );
};

export default Home; 