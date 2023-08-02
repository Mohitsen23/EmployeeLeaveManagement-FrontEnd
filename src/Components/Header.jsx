import React, {useEffect, useState} from "react";
import {  Button } from '@material-ui/core';

import { Link } from "react-router-dom";
import {  Dialog, DialogContent, DialogTitle } from "@mui/material";
import logo from '../Assets/Logo.png'
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useDispatch, useSelector } from "react-redux";
import { SetAuthenticated, Sidebar } from "./LeaveSlice";
import { HubConnectionBuilder,LogLevel,HttpTransportType } from '@microsoft/signalr';
import CardContent from '@mui/material/CardContent';
import "../Styles/notification.css"
const Header = ({responseData},{handleToggleSidebar}) => {
 const notifications=useSelector((state)=>{
  return state.leave.Notificationdata;
 })
  // const [notifications,setNotifications]=useState([]);
  const [messages, setMessages] = useState([]);
  // useEffect(()=>{
  
  //  const connection = new HubConnectionBuilder()
  //   .withUrl("https://localhost:7189/notificationHub",{
  //     skipNegotiation: true,
  //     transport: HttpTransportType.WebSockets
  //   })
  //   .configureLogging(LogLevel.Trace) // Enable detailed SignalR logging
  //   .build();
  
  // connection.start()
  //   .then(() => console.log("SignalR Connected"))
  //   .catch((err) => console.log("SignalR Connection Error: ", err));
  
  
  //   connection.on("messageReceived", (notification) => {
 
  //     setNotifications(prevNotifications => [...prevNotifications, notification]);
     
  //   });


  //   connection.on("ReceiveMessage", (senderId,receiverId, message) => {
  //      console.log("message data",message);
  //     setMessages((prevMessages) => [...prevMessages, { senderId,receiverId, message }]);
  //   });

  // },[]);
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
const login=useSelector(state=>{
  return state.leave.User;
})

const [isOpened,setIsOpened]=useState(false);

const handleNotification=()=>{
  setIsOpened(!isOpened);
}
const closedDialog=()=>{
  setIsOpened(!isOpened);
}


   
  return (
    <>

<div className="chatArea">
        <ul className="messageList">
          {messages.map((msg, index) => (
            <li key={index}>User {msg.senderId}: {msg.message}</li>
          ))}
        </ul>
      </div>

    {login==="Manager" &&
<Dialog open={isOpened} onClose={closedDialog}>
        <DialogTitle className="text-center bg-primary text-light">Notifications</DialogTitle>
       <br></br>
        <DialogContent className="">
        
        </DialogContent>
      </Dialog>
}
    
    <nav className="navbar navbar-expand-lg position-relative ">
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
               <h5 onClick={handleNotification}> <i class="fa-solid fa-bell text-dark"></i></h5></Link>
             
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
</>


  );
};

export default Header;
