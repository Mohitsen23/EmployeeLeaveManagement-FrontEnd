import React, {useEffect, useState} from "react";
import { HubConnectionBuilder, HttpTransportType } from "@microsoft/signalr";

import { Link } from "react-router-dom";
import logo from '../Assets/Logo.png'
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useDispatch, useSelector } from "react-redux";
import { SetAuthenticated, Sidebar } from "./LeaveSlice";

const Header = ({responseData},{handleToggleSidebar}) => {
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    // Create and start the SignalR connection
    const newConnection = new HubConnectionBuilder()
      .withUrl("/notification", {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      })
      .build();

    setConnection(newConnection);
    newConnection.start().catch((error) =>
      console.error("SignalR connection error: ", error)
    );

    // Clean up SignalR connection
    return () => {
      newConnection.stop().catch((error) =>
        console.error("SignalR connection error: ", error)
      );
    };
  }, []);
const [notificationCount, setNotificationCount] = useState(0);
  useEffect(() => {
    if (connection) {
    
      connection.on("ReceiveNotification", (message) => {
        console.log("Received notification:", message);
        setNotificationCount((prevCount) => prevCount + 1);
      });
    }
  }, [connection]);


 
  useEffect(() => {
    if (connection && connection.state === "Connected") {
      console.log("Connection is established");
    } else {
      console.log("Connection is not established");
    }
  }, [connection]);


  const dispatch=useDispatch();
    console.log("Users data value",responseData);
    const users = useSelector(state => {
  
      return state.leave.User;
    });
    const [isSidebarOpen, setSidebarOpen] = useState(false);
     const handleToggle = () => {
      
    dispatch(Sidebar(!isSidebarOpen));
    setSidebarOpen(!isSidebarOpen);
  };



const handleLogout=()=>{
  dispatch(SetAuthenticated(false));
}



  
   
  return (
    
    <nav className="navbar navbar-expand-lg  ">
      <div className="container-fluid ">
        
        <span className="text-dark mt-1"><h3> <img src={logo} alt="" /> Office</h3></span>
      
       
        <div >
          <ul className="navbar-nav ml-auto mb-2  ">
            
             {users=="Manager" && <li className="nav-item d-flex">
            
              <div className="d-flex">
                 
                  <Link className="nav-link text-dark mr-3" >
                <h5>Home</h5> 
                </Link>  
                <Link className="nav-link text-dark mr-3" >
               <h5> <i class="fa-solid fa-user text-dark"></i></h5></Link>
             
               <Link className="nav-link text-dark mr-3">
               <h5> <i class="fa-solid fa-bell text-dark">{notificationCount}</i></h5></Link>
             
                <Link className="nav-link text-dark mr-3" onClick={handleLogout}>
                <h5><i class="fa-solid fa-right-from-bracket text-dark"> </i></h5>
                </Link>
                </div>
                <div className=" mt-2 ">
                <div>     <h5> <i className="fa-solid fa-bars" onClick={handleToggle}></i></h5> </div>
 
</div>




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
             
              <div className=" mt-2">
                <div>     <h5> <i className="fa-solid fa-bars "></i></h5> </div>
 
</div>
            </li>
}           </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
