import React from 'react'
import { NavLink } from 'react-router-dom'


const SignedInLinks = () => {
    return(
    <div>
        <ul className="right">
            <li ><NavLink to ='/settings'>Settings</NavLink></li>
            <li ><NavLink to ='/recorder'>Record</NavLink></li>
            <li ><NavLink to ='/upload'>Upload</NavLink></li>            
            <li ><NavLink to ='/signout'>Sign Out</NavLink></li>            
        </ul>
    </div>        
    )
}

export default SignedInLinks