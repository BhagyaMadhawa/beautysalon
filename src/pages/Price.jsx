import { useState } from 'react'
import {useNavigate} from "react-router-dom";





const Price = () =>
{
    const navigate = useNavigate();

    return(
         <>
     <div className="w-full sm:w-72 md:w-80 lg:w-96 xl:w-[28rem] flex-shrink ">
        <h1>Price page</h1>
      </div>
      
    
    </>

    )
}

export default Price;