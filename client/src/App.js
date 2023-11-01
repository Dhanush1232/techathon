import React from 'react';
import {Routes, Route} from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.css'
import AdminLogin from './Components/AdminLogin'
import Empdatabase from './Components/Empdatabase'
import Logout from './Components/Logout'
import AdminRegister from './Components/AdminRegister';
import EmpRegister from './Components/EmpRegister';
//Currently unavailable
// import EmployeeIndivual from './Components/EmployeeIndivual';
// import EmployeeDetails from './Components/EmployeeDetails'

const Routing = () =>
{
  return(
  <Routes>     
  <Route path="/" element={<AdminRegister/>} /> 
  <Route path="/logout" element={<Logout/>} /> 
  <Route path="/AdminLogin" element={<AdminLogin/>} /> 
  <Route path="/Empdatabase" element={<Empdatabase/>} />
  <Route path="/AdminRegister" element={<AdminRegister/>} />
  <Route path="/EmpRegister" element={<EmpRegister/>} />

  
 

  {/* <Route path="/employee/:id" element={<EmployeeIndivual/>} /> 
  <Route path="/employees/:employeeId" element={<EmployeeDetails/>} /> */}

  </Routes>
  )
}

const App = () => 
{
  return (
   <>
    <Routing/>
   </>
  );
}

export default App;
