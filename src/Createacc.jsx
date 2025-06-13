import './Createacc.css';
import Logo from '/Logo without bg.png';
import { Link } from 'react-router-dom';


function Createacc(){

    return(

        <div className = 'OuterBox'>

            <div className = 'AccBox'>


                <img src = {Logo} alt = 'Nop' className = 'ImageDivInCreateAcc'/>

                <input type = 'text' placeholder = 'Enter New Username' name = 'Username' className = 'UsernameBoxInCreateAcc' />
                <input type = 'password' placeholder = 'Enter New Password' name = 'Password' className = 'PasswordBoxInCreateAcc' />
                <br />
                <button name = 'LoginButtonInCreateAcc' className = 'LoginButton' >
                    Sign Up!
                </button>
            

            </div>

            <div className = 'CreateAccountBoxInCreateAcc'>
                <p>
                    Go back to <Link to = '/login'> Login </Link> 
                </p>
            </div>

        </div>        

    );

};

export default Createacc;