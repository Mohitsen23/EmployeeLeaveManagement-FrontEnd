// Layout.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

import ApplyLeave from './ApplyLeave';
import Profile from './Profile';
import LeaveRequest from './LeaveRequest';
import Employees from './Employees';
import { useDispatch } from 'react-redux';
import ManagerProfile from './ManagerProfile';



function Layout() {

const dispatch=useDispatch();
  
 
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 bg-light">
          <Header />
        </div>
      </div>
      <div className="row">
        <div className="col-2 " style={{  backgroundColor: '#0d0c22', fontFamily: '"Lucida Console", "Courier New", monospace', }}>
          <Sidebar  />
        </div>
        <div className="col-10"> 
          <div className="main-content">
          <Routes>
          
          <Route path="/profile" element={<Profile/>}></Route>
            <Route path="/apply" element={<ApplyLeave/>}></Route>
            <Route path="/leaveRequest" element={<LeaveRequest/>}></Route>
            <Route path="/employees" element={<Employees/>}></Route>
            <Route path="/managerProfile" element={<ManagerProfile/>}></Route>
          
          </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
