import { useContext, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import AuthContext from "../Context/AuthContext";

// if the user is logged in then display logout option
// if the user is not logged in then display the login as well as register option
const Navbar = () => {
    let {user, logoutUser} = useContext(AuthContext)
    // fetch the dashboard if the user is authenticated.
    return (
        <div>
            {user ? 
            <div onClick={logoutUser}> Logout </div> : 
            <>
            <Link to ='/register' > Register </Link>
            <span> | </span>
            <Link to ='/login'> Login </Link> 
            </>}
        </div>
    )

}
export default Navbar