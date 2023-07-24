import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import ApplyLeave from './ApplyLeave';
import Profile from './Profile';
import LeaveRequest from './LeaveRequest';
import Employees from './Employees';
import { useDispatch, useSelector } from 'react-redux';
import ManagerProfile from './ManagerProfile';
import Login from './Login';

import EMpProfile from './EMpProfile';



function Layout() {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.leave.Sidebar);

  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
const isAuthenticated=useSelector((state)=>{
  return state.leave.isAuthenticated;
})


  const handleToggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      dispatch(Sidebar());
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 bg-light">
          <Header handleToggleSidebar={handleToggleSidebar} />
        </div>
      </div>
      <div className="row">
        {isSidebarOpen && (
          <div
            className={`col-lg-2 col-md-3 col-sm-4 col-12 ${
              isMobileSidebarOpen ? 'd-block' : 'd-none d-sm-block'
            }`}
            style={{ backgroundColor: '#234E70', fontFamily: '"Lucida Console", "Courier New", monospace' }}
          >
            <Sidebar />
          </div>
        )}
        <div
          className={`col-lg-10 col-md-9 col-sm-8 col-12 ${
            isSidebarOpen ? '' : 'col-lg-12 col-md-12 col-sm-12'
          }`}
        >
          <div className="main-content">
        
            <Routes>
            <Route path="/EmpProfile" element={<EMpProfile />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/apply" element={<ApplyLeave />} />
              <Route path="/leaveRequest" element={<LeaveRequest />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/managerProfile" element={<ManagerProfile />} />
             
              </Routes>
             
             
             
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
