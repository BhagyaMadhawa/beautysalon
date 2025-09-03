import { useState } from 'react'
import {useNavigate} from "react-router-dom";

import PremiumPlanCard from '../components/Premium/card';
import WhyChoosePremium from '../components/Premium/why';
import MonthlyPricingCard from '../components/Premium/monthly';
import AnnuallyPricingCard from '../components/Premium/annualy';

const Register = () =>
{
    const navigate = useNavigate();

    return(
    <>
    <div className=" max-w-[98%] mx-auto mb-8 px-2 sm:px-4">
    <PremiumPlanCard/>
    <div className='grid grid cols-1 lg:grid-cols-3 gap-6'>
        <div className='col-span-1'>
            <WhyChoosePremium/>
        </div>
        <div className='col-span-1'>
             <MonthlyPricingCard/>
        </div>
        <div>
            <AnnuallyPricingCard/>
        </div>

    </div>
    
    </div>
    </>

    )
}

export default Register;