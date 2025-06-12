import './Login.css';
import Logo from '/Logo without bg.png';

function Login() {

    return(

        <div className = 'OuterBox'>

            <div className = 'LoginBox'>


                <img src = {Logo} alt = 'Nop' className = 'ImageDiv'/>

                <input type = 'text' placeholder = 'Username' name = 'Username' className = 'UsernameBox' />
                <input type = 'password' placeholder = 'Password' name = 'Password' className = 'PasswordBox' />
                <button name = 'LoginButton' className = 'LoginButton' >
                    Login
                </button>
            

            </div>

            <div className = 'CreateAccountBox'>
                <p>
                    DIngus!
                </p>
            </div>

        </div>

    );

};

export default Login;