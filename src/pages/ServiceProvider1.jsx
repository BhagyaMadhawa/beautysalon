import { useState } from 'react'
import {useNavigate} from "react-router-dom";
import Servicetype from '../components/serviceProvider1/card';





const Service1 = () =>
{
    const navigate = useNavigate();

    return(
         <>
     <div className="max-w-[98%] mx-auto mb-8 px-2 sm:px-4 flex-shrink ">
       <Servicetype/>
      </div>
      
    
    </>

    )
}

export default Service1;