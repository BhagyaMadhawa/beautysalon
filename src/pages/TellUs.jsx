import { useState } from 'react'
import {useNavigate} from "react-router-dom";

import LoginPage2 from '../components/RegisterSalon/aboutUrself';


const Tellus = () =>
{
    const navigate = useNavigate();

    return(
         <>
     <div className="max-w-[100%] mx-auto mb-8 px-2 sm:px-4 justify-center ">
        <LoginPage2/>
      </div>
      
    
    </>

    )
}

export default Tellus;