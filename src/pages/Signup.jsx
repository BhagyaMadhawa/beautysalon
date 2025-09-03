import { useState } from 'react'
import {useNavigate} from "react-router-dom";

import SignupPage from '../components/login/signup';


const Signup = () =>
{
    const navigate = useNavigate();

    return(
         <>
     <div className="max-w-[98%] mx-auto mb-8 px-2 sm:px-4 justify-center ">
        <SignupPage/>
      </div>
      
    
    </>

    )
}

export default Signup;