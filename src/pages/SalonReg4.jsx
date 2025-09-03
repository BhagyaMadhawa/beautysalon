import { useState } from 'react'
import {useNavigate} from "react-router-dom";

import ListYourServices from '../components/RegisterSalon/reg4';


const SalonReg4 = () =>
{
    const navigate = useNavigate();

    return(
         <>
     <div className="max-w-[98%] mx-auto mb-8 px-2 sm:px-4 justify-center ">
        <ListYourServices/>
      </div>
      
    
    </>

    )
}

export default SalonReg4;