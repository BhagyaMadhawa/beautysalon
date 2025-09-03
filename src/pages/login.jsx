import { useState } from 'react'
import {useNavigate} from "react-router-dom";

import LoginPage from '../components/login/login';


const Login = () =>
{
    const navigate = useNavigate();

    return(
         <>
     <div className="max-w-[98%] mx-auto mb-8 px-2 sm:px-4 justify-center ">
        <LoginPage/>
      </div>
      
    
    </>

    )
}

export default Login;