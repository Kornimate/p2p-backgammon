import { Button } from "@mui/material";
import "../styles/HomePage.css";
import logo from "../assets/logo.png"
import { Link } from "react-router-dom";


const HomePage = () => {
    return (
        <div className="container">
            <h1>Backgammon Game</h1>
            <img src={logo} alt="boardImg" />
            <br />
            <Button variant="outlined" sx={{width: 150, marginRight: 2}}>
                <Link to="/auth/login" style={{ textDecoration: "none"}}>Login</Link>
            </Button>
            <Button variant="outlined" sx={{width: 150, marginLeft: 2}}>
                <Link to="/auth/register" style={{ textDecoration: "none"}}>Register</Link>
            </Button>
        </div>
    )
}

export default HomePage;