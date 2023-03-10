import {useContext} from "react";
import AuthContext from "../Context/AuthContext";

function Sidebar({handleModelsClick, handleOptionsClick, handleAnimationsClick}) {
    let {user, logoutUser} = useContext(AuthContext)
    return (
        <div className='flex flex-col items-center h-full overflow-hidden text-black justify-between'
             style={{backgroundColor: '#eaeaea', width:160}}>
            <div className='flex flex-col items-center mt-3 p-2'>
                <div
                    className='flex flex-col items-center justify-center w-full h-full mt-3 p-3 rounded-lg hover:bg-indigo-700 hover:text-white'
                    onClick={handleModelsClick}>
                    <div style={{padding: '10px 0'}}>
                        <i className="fa fa-coffee" style={{fontSize: 30}}></i>
                    </div>
                    <span className='text-sm leading-6'>Models</span>
                </div>
                <div
                    className='flex flex-col items-center justify-center w-full h-full mt-3 p-3 rounded-lg hover:bg-indigo-700 hover:text-white'
                    onClick={handleOptionsClick}>
                    <div style={{padding: '10px 0'}}>
                        <i className="fa fa-gear" style={{fontSize: 30}}></i>
                    </div>
                    <span className='text-sm leading-6'>Options</span>
                </div>
                <div
                    className='flex flex-col items-center justify-center w-full h-full mt-3 p-3 rounded-lg hover:bg-indigo-700 hover:text-white'
                    onClick={handleAnimationsClick}>
                    <div style={{padding: '10px 0'}}>
                        <i className="fa fa-diamond" style={{fontSize: 30}}></i>
                    </div>
                    <span className='text-sm  leading-6'>Animations</span>
                </div>
            </div>
            <div className='flex flex-col items-center mt-3 p-2'>
                {user ?
                    <div
                        className='flex flex-col items-center justify-center w-full h-full mt-3 p-3 rounded-lg hover:bg-red-100 hover:border-red-500 border-transparent border-2'
                        onClick={logoutUser}>
                        <div style={{padding: '10px 0'}}>
                            <i className="fa fa-sign-out text-red-500" style={{fontSize: 20}}></i>
                        </div>
                        <span className='text-xs leading-6 text-red-500'>Logout</span>
                    </div>
                    : <></>
                }
            </div>
        </div>
    )
}

export default Sidebar
