import { useState } from 'react'
import {useNavigate} from "react-router-dom";

import PortfolioStep from '../../components/RegisterSalon-not used/reg3';


const SalonReg3 = () =>
{
    const navigate = useNavigate();

    return(
         <>
     <div className="max-w-[98%] mx-auto mb-8 px-2 sm:px-4 justify-center ">
        <PortfolioStep/>
      </div>
      
    
    </>

    )
}

export default SalonReg3;