import { useState } from 'react'
import {useNavigate} from "react-router-dom";
import UserTypeSelection from '../components/register2/cards';





const Register2 = () =>
{
    const navigate = useNavigate();

    return(
         <>
     <div className="max-w-[98%] mx-auto mb-8 px-2 sm:px-4 flex-shrink ">
       <UserTypeSelection/>
      </div>
      
    
    </>

    )
}

export default Register2;