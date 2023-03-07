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
                <div className="flex items-center flex-shrink-0 w-full h-16 px-10  bg-gradient-to-r from-indigo-600 to-blue-500 shadow-lg">
                <button className="ml-auto bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded" onClick={logoutUser}>
                Log Out
                </button>
                </div>
             :
            <>
            </>}
        </div>
    )

}
export default Navbar
