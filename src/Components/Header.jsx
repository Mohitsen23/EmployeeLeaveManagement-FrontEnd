import React from "react";
import { Link } from "react-router-dom";
import logo from '../Assets/Logo.png'
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useSelector } from "react-redux";

const Header = ({responseData}) => {
    console.log("Users data value",responseData);
    const users = useSelector(state => {
  
      return state.leave.User;
    });
  return (
    
    <nav className="navbar navbar-expand-lg  ">
      <div className="container-fluid">
        <img src={logo} alt="" />
        <span className="text-dark mt-1"><h3>Office</h3></span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto mb-2 mb-lg-0 ">
            
             {users=="Manager" && <li className="nav-item d-flex">
            
              
                 
                  <Link className="nav-link text-dark mr-3" >
                <h5>Home</h5> 
                </Link>  
                <Link className="nav-link text-dark mr-3" >
               <h5> <i class="fa-solid fa-user text-dark"></i></h5></Link>
             
               <Link className="nav-link text-dark mr-3">
               <h5> <i class="fa-solid fa-bell text-dark"></i></h5></Link>
             
                <Link className="nav-link text-dark mr-3">
                <h5><i class="fa-solid fa-right-from-bracket text-dark"></i></h5>
                </Link>
               
               
              </li>
}
            
      {users=="Employee" &&<li className="nav-item d-flex">
            
            
                <Link className="nav-link text-dark mr-3" >
              <h5>Home</h5> 
              </Link>  
              <Link className="nav-link text-dark mr-3" >
             <h5> <i class="fa-solid fa-user text-dark"></i></h5></Link>
           
             <Link className="nav-link text-dark mr-3">
             <h5> <i class="fa-solid fa-bell text-dark"></i></h5></Link>
           
              <Link className="nav-link text-dark mr-3">
              <h5><i class="fa-solid fa-right-from-bracket text-dark"></i></h5>
              </Link>
             
             
            </li>
}           </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
