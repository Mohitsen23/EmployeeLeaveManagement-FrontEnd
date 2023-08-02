import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";

import { NavLink } from 'react-router-dom';

const Sidebar=()=>{
      const [activeButton, setActiveButton] = useState('');

      const handleClick = (button) => {
        setActiveButton(button);
      };

      const [activeButton1, setActiveButton1] = useState('');

const handleClickRequest = (button) => {
  setActiveButton1(button);
};

      const users = useSelector(state => {
  
            return state.leave.User;
          });


// console.log("isSideBarOpen",isSideBarOpen);

    return (
<>

<div class="container-fluid" style={{height:'590px'}}>
    <div class="row d-flex justify-content-center">
  
       { users=="Manager"&&  <ul class="nav flex-column w-100">
          <li class="nav-item mt-3 text-center">
          <a class="nav-link text-light border-bottom border-5 border-dark" href="#">
                <h3 >Manager </h3>
                </a>
          </li>
        <NavLink
  to="/leaveRequest"
 className="bg-secondary d-flex justify-content-center mt-4 p-1"
  activeClassName="active-link"
  onClick={() => handleClickRequest('leaveRequest')}
  name="leaveRequest" // Add a unique name prop
>
  <span className="text-white">Leave Request</span>
</NavLink>

<NavLink
  to="/employees"
  className="bg-secondary d-flex justify-content-center mt-4 p-1"
  activeClassName="active-link"
  onClick={() => handleClickRequest('employees')}
  name="employees" // Add a unique name prop
>
 <span className="text-white">Employees</span> 
</NavLink>


<NavLink
  to="/Chat"
  className="bg-secondary d-flex justify-content-center mt-4 p-1"
  activeClassName="active-link"
  onClick={() => handleClickRequest('Chat')}
  name="Chat" // Add a unique name prop
>
 <span className="text-white">Chat</span> 
</NavLink>


 </ul>}
  {users=="Employee"&&<ul class="nav flex-column">
<li class="nav-item mt-2">
<a class="nav-link text-light border-bottom border-5 border-dark" >
      <h3>Employee </h3>
      </a>
</li>

<li>

<NavLink
        to="/profile"
        className={`nav-link mt-4 rounded text-center ${activeButton === 'profile' ? 'active' : ''} text-decoration-none`}
        activeClassName="active-link"
        onClick={() => handleClick('profile')}
      >
        <h5 className={`text-center rounded mt-2  py-1 px-3 bg-${activeButton === 'profile' ? 'secondary' : ''} text-${
          activeButton === 'profile' ? 'white' : 'black'
        } hover:bg-primary`}>
          Profile
        </h5>
      </NavLink>
      </li>
      <NavLink
        to="/apply"
        className={`nav-link  text-center ${activeButton === 'apply' ? 'active' : ''} text-decoration-none`}
        activeClassName="active-link"
        onClick={() => handleClick('apply')}
      >
        <h5 className={`text-center mt-2 rounded py-1 px-2 bg-${activeButton === 'apply' ? 'secondary' : ''} text-${
          activeButton === 'apply' ? 'white' : 'black'
        } hover:bg-primary`}>
           Apply Leave 
        </h5>
      </NavLink>



      <NavLink
        to="/email"
        className={`nav-link  text-center ${activeButton === 'email' ? 'active' : ''} text-decoration-none`}
        activeClassName="active-link"
        onClick={() => handleClick('email')}
      >
        <h5 className={`text-center mt-2 rounded py-1 px-2 bg-${activeButton === 'email' ? 'secondary' : ''} text-${
          activeButton === 'email' ? 'white' : 'black'
        } hover:bg-primary`}>
           Email
        </h5>
      </NavLink>

</ul>}

      </div>
      
     
    </div>


</>
    );
};
export default Sidebar;