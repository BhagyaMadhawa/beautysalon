import { useState } from 'react'
import {useNavigate} from "react-router-dom";

import SignupSalonOwner from '../components/RegisterSalon/reg1';


const SalonReg1 = () =>
{
    const navigate = useNavigate();

    return(
         <>
     <div className="max-w-[98%] mx-auto mb-8 px-2 sm:px-4 justify-center ">
        <SignupSalonOwner/>
      </div>
      
    
    </>

    )
}

export default SalonReg1;