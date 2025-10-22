import { useState } from 'react'
import {useNavigate} from "react-router-dom";

import RegisterSalonForm from '../../components/RegisterSalon/reg2';


const SalonReg2 = () =>
{
    const navigate = useNavigate();

    return(
         <>
     <div className="max-w-[98%] mx-auto mb-8 px-2 sm:px-4 justify-center ">
        <RegisterSalonForm/>
      </div>
      
    
    </>

    )
}

export default SalonReg2;