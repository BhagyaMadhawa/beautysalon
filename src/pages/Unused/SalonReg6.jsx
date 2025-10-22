import { useState } from 'react'
import {useNavigate} from "react-router-dom";

import AddFAQStep from '../../components/RegisterSalon/reg6';


const SalonReg6 = () =>
{
    const navigate = useNavigate();

    return(
         <>
     <div className="max-w-[98%] mx-auto mb-8 px-2 sm:px-4 justify-center ">
        <AddFAQStep/>
      </div>
      
    
    </>

    )
}

export default SalonReg6;