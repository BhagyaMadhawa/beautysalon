import { useState } from 'react'
import {useNavigate} from "react-router-dom";
import '../App.css'
// import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import NavBar from '../components/navbar';
import BeautyExpertBanner from'../components/Home/heroBanner';
import BrowseTalentByCategory from '../components/Home/salonCard';
import TalentBrowser from '../components/Home/talentBrowser';
import Footer from '../components/footer';
import PopularBeautyExperts from '../components/Home/beautyExperts';
import TrustFeaturesSection from '../components/Home/trust';
import GrowBeautyBusiness from '../components/Home/beautyBusiness';
import TestimonialSection from '../components/Home/testimonials';
import BeautyCTASection from '../components/Home/findNBook';

const Home = () =>
{
    const navigate = useNavigate();

    return(
         <>
      
      <BeautyExpertBanner/>
      <BrowseTalentByCategory/>
      <TalentBrowser/>
      <PopularBeautyExperts/>
      <TrustFeaturesSection/>
      <GrowBeautyBusiness/>
      <TestimonialSection/>
      <BeautyCTASection/>
    
    </>

    )
}

export default Home;