import { useState } from 'react'
import {useNavigate} from "react-router-dom";
import UserTypeSelection2 from '../components/register2/cards2';





const Register21 = () =>
{
    const navigate = useNavigate();

    return(
         <>
     <div className="max-w-[98%] mx-auto mb-8 px-2 sm:px-4 flex-shrink ">
       <UserTypeSelection2/>
      </div>
      
    
    </>

    )
}

export default Register21;