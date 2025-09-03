import { useState } from 'react';
import './App.css';

import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import NavBar from './components/navbar';
import Footer from './components/footer';

import Home from './pages/Home';
import Search from './pages/Search'
import Salon from './pages/Salon';
import Price from './pages/Price';

import Register from './pages/Register';
import Register2 from './pages/Register2';
import Login from './pages/login';


import Service1 from './pages/ServiceProvider1';
import Signup from './pages/Signup';

import SalonReg1 from "./pages/SalonOwner/reg1";
import SalonReg2 from "./pages/SalonOwner/reg2";
import SalonReg3 from "./pages/SalonOwner/reg3";
import SalonReg4 from "./pages/SalonOwner/reg4";
import SalonReg5 from "./pages/SalonOwner/reg5";
import SalonReg6 from "./pages/SalonOwner/reg6";

import Dashboard from './pages/Dashboard';
import Register21 from './pages/Register21';
import ProSignup from "./pages/BeautyProfessional/ProSignup";   // Step 1 (public)
import ProReg1 from "./pages/BeautyProfessional/ProReg1";       // Step 2 (auth)
import ProReg2 from "./pages/BeautyProfessional/ProReg2";       // Step 3
import ProReg3 from "./pages/BeautyProfessional/ProReg3";       // Step 4
import ProReg5 from "./pages/BeautyProfessional/ProReg5";       // Step 5

import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './contexts/AuthContext';


function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}


function App() {
  return (
    <AuthProvider>
      <NavBar />
      <main>
         
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element = {<Search/>}/>
          <Route path="/salon/:salonId" element = {<Salon/>}/>
          

          <Route path="/signup" element={<Signup/>}/>
          <Route path="/login" element= {<Login/>}/>
          
          
          <Route path="/register" element = {<Register/>}/>
          <Route path="/register2" element = {<Register2/>}/>
          <Route path="/register21" element = {<Register21/>}/>
          
          <Route path="/regsal1" element={<SalonReg1 />} />
          <Route path="/regsal2" element={<SalonReg2 />} />
          <Route path="/regsal3" element={<SalonReg3 />} />
          <Route path="/regsal4" element={<SalonReg4 />} />
          <Route path="/regsal5" element={<SalonReg5 />} />
          <Route path="/regsal6" element={<SalonReg6 />} />

          <Route path="/pro/signup" element={<ProSignup />} />
          <Route path="/regprofe1" element={<ProReg1 />} />
          <Route path="/regprofe2" element={<ProReg2 />} />
          <Route path="/regprofe3" element={<ProReg3 />} />
          <Route path="/regprofe5" element={<ProReg5 />} />
          
          
   
          
          <Route path="/dashboard" element = {<Dashboard/>}/>
          <Route path="/admin/dashboard" element = {<AdminDashboard/>}/>

         

        </Routes>
        
      </main>
      <Footer />
    </AuthProvider>
  );
}

export default App;
