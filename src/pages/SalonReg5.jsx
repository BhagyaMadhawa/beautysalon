import { useState } from 'react'
import {useNavigate} from "react-router-dom";

import OperatingHoursStep from '../components/RegisterSalon/reg5';


const SalonReg5 = () =>
{
    const navigate = useNavigate();

    return(
         <>
     <div className="max-w-[98%] mx-auto mb-8 px-2 sm:px-4 justify-center ">
        <OperatingHoursStep/>
      </div>
      
    
    </>

    )
}

export default SalonReg5;