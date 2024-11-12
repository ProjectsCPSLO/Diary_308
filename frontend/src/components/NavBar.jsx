import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout.js';
import styles from '../styles/styles.module.scss';

const NavBar = () => {
    const { user } = useAuthContext();
    const { logout } = useLogout();

    const handleClick = () => logout();

    return (
        <header className={styles.navbar}>
            <nav>
                <ul>
                    <li> 
                        <Link to="/"> Home </Link>
                    </li>
                </ul>
            </nav>

            <span className={styles['navbar-brand']}> The Diary App </span>

            {user ? (
                <div>
                    <span>{ user.email }</span>
                    <button onClick={handleClick}>
                        Logout
                    </button>
                </div>
            ) : (
                <div>
                    <Link to="/api/login"> Login </Link>
                    <Link to="/api/signup"> Signup </Link>
                </div>
            )}
        </header>
    );
};

export default NavBar;
