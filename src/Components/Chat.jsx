import React, { useEffect, useRef, useState } from "react";
import { HubConnectionBuilder, HttpTransportType, LogLevel } from "@microsoft/signalr";

import { useDispatch, useSelector } from "react-redux";
import { setConnectionId, setManagers, setNotification, setReceiving, setRecentMessage, setSending, setSentMessages, setSignalRConnection } from "./LeaveSlice";
import "../Styles/chat.css"
import axios from "axios";
import logo from '../Assets/men.jpg';

import online from '../Assets/checked.png'
import send from '../Assets/send.png'
import { Button } from "@mui/material";
const Chat = () => {
  const dispatch = useDispatch();
 const [messageInput, setMessageInput] = useState("");
const notification=useSelector((state)=>{
  return state.leave.Notificationdata;
})
  const token = useSelector((state) => {
    return state.leave.Token;
  })

  const login = useSelector((state) => {
    return state.leave.LoginUser
  })
  const [receiverid, setReceiverId] = useState(null);
  const connectionRef = useRef(null);
  const fileInputRef = useRef(null);
  const managers = useSelector((state) => {
    return state.leave.Managers;
  })

  const sentmsg = useSelector((state) => {
    return state.leave.SentMessage;
  })
  const senddbsdata = useSelector((state) => {
    return state.leave.Send;
  })

  const receivedbData = useSelector((state) => {
    return state.leave.Receive;
  })
  const recentmsg = useSelector((State) => {
    return State.leave.RecentMessage;
  })



  const recentdata = [...sentmsg, ...recentmsg];

  const recentsort = () => {
    return [...recentdata].sort((a, b) => new Date(a.currentTime) - new Date(b.currentTime));
  };
  const onlineuser = useSelector((state) => {
    return state.leave.ConnectionId;
  })

  const sortmsgdata = recentsort();
  console.log("recenet messages ", sortmsgdata);
  useEffect(() => {
    axios.get("https://localhost:7189/getManagers")
      .then((res) => {
        dispatch(setManagers(res.data));
      })
      .catch((error) => {

      })
    connectionRef.current = new HubConnectionBuilder()
      .withUrl("https://localhost:7189/notificationHub", {
        accessTokenFactory: () => token,
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      })
      .configureLogging(LogLevel.Trace)
      .withAutomaticReconnect()
      .build();
      dispatch(setSignalRConnection(connectionRef));
    connectionRef.current
      .start()
      .then(() => console.log("SignalR Connected"))
      .catch((err) => console.log("SignalR Connection Error: ", err));
    connectionRef.current.on("Connected", (connectionid, userid) => {

      dispatch(setConnectionId(userid));
    })
    connectionRef.current.on("ReceiveImages", (senderid, receiverid, image) => {
      const messagedata = {
        receiverid: receiverid,
        senderid: senderid,
        type: "base64",
        message: image,
        currentTime: new Date().toString(),

      }
      dispatch(setRecentMessage(messagedata));
    })

    connectionRef.current.on("ReceiveMessage", (senderId, receiverid, message) => {

      const messagedata = {
        receiverid: receiverid,
        senderid: senderId,
        message: message,
        currentTime: new Date().toString(),
      }
      dispatch(setRecentMessage(messagedata));

    })
   

    connectionRef.current.on("messageReceived", (notification) => {
      dispatch(setNotification(notification));
    });
    return () => {
      connectionRef.current.stop();
    };
  }, []);

  const handleChange = (e) => {
    setMessageInput(e.target.value);
  };
const handleimageClick=()=>{
  fileInputRef.current.click();

  setimg(true);
}
  const handleclick = (data) => {

    setReceiverId(data);
  }
  const [value, setValue] = useState(false);
  const SendMessage = () => {
    setValue(true);

    connectionRef.current.invoke("SendMessage", login.id, receiverid, messageInput);

    const data = {
      type:'text',
      senderid: login.id,
      receiverid: receiverid,
      Message: messageInput,
      readornot: 1
    }

    const msg = {

      senderid: login.id,
      receiverid: receiverid,
      Message: messageInput,
      type: "text",
      currentTime: new Date().toString(),
    }

    dispatch(setSentMessages(msg));
    axios.post("https://localhost:7189/SendMessage", data)
      .then((res) => {

      })
      .catch((error) => {

      })
    setMessageInput("");


  };
  const messagearray = [...senddbsdata, ...receivedbData];
  console.log("message array", messagearray);
  const sortedMessage = () => {
    return [...messagearray].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }
  const sortmessage = [sortedMessage()];
  console.log("sorted messages", sortmessage);
  const [imagedata, setImagesdata] = useState("");
  const[img,setimg]=useState(true);
  const handlefile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result.split(',')[1];
        setImagesdata(base64String);
      };
      reader.readAsDataURL(file);
      setimg(false);
    }
  }
  const handlechat=(e)=>{

    setChat(e.target.value);
  }
 
  const [chat,setChat]=useState({
    message:""
  })
  const SendImage = () => {

    connectionRef.current.invoke("SendImages", login.id, receiverid, imagedata).catch((error) => console.error(error));
    const msg = {

      senderid: login.id,
      receiverid: receiverid,
      Message: imagedata,
      type: "base64",
      currentTime: new Date().toString(),
    }

    dispatch(setSentMessages(msg));
    setimg(true);

  }
  return (
    <div className="container-fluid ">

      <div className="row mt-2 ">
        <div className="col-3 head-1">
          <h4 className="text-center mt-3">Chat </h4>
        </div>
        <div className="col-9 border border-4 head-2 d-flex justify-content-between">
          <div className="userprofile d-flex ">
            <div><img src={logo} className="userimg" alt="" /></div>
            <div className="mt-1">
              {
                login.firstname
              }
              {
                login.lastname
              }</div>
          </div>
          <div className="">
            <input type="text" className="mt-3 ml-5 search" placeholder="search" />

          </div>

          <div className=" icondata d-flex  ">
            <div className="mr-4 icon "> <i class="fa-solid fa-video "></i></div>
            <div className="icon mr-4"> <i class="fa-solid fa-phone"></i></div>
            <div className="icon "> <i class="fa-solid fa-list"></i></div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-3 side">
          {managers?.map((item, index) => (

            <div key={index} className=" " onClick={() => { handleclick(item.id) }}>
              {item.id !== login.id ? (
                <div className="d-flex justify-content-around User">
                  <span>  <img src={logo} className="img" alt="" />{onlineuser.map((status) => (

                    status == item.id && <img src={online} alt="" className="onlinestatus" />
                  ))} </span>
                  <div className="name">{item.firstname} {item.lastname}</div>
                </div>
              ) : (
                <div>

                </div>
              )}
            </div>


          ))}
        </div>
        {
          receiverid ? (
            <div className="col-9 main d-flex align-items-end">

              <div className="messagediv w-100 ">
          
            

                <div>
                  {
                    sortmessage.map((item, index) => {

                      return (<div className="" key={index}>
                        {item.senderid === login.id &&
                          <div key={index} className="m-4">
                            <span className="sendingbox" >
                              {item.type === 'base64' ? (
                                <img src={`data:image/png;base64,${item.message}`} alt="Base64 Image" />
                              ) : (
                                <img src={`data:image/png;base64,${item.message}`} alt="Base64 Image" />
                              )}

                            </span>
                          </div>
                        }
                        {item.receiverid === login.id &&
                          <div key={index} className="m-4 d-flex justify-content-end">
                            <span className="receivingbox" >
                              {
                                item.message == ('')
                              }

                            </span>
                          </div>
                        }
                      </div>
                      )

                    })
                  }

                  {
                    sortmsgdata.map((item, index) => {
                      const timeParts = item.currentTime.split(' ');
                      const timeString = timeParts[4];
                      const date = [...timeParts[0], " ", ...timeParts[1], " ", ...timeParts[2], " ", ...timeParts[3]];
                      return (<div key={index}>
                        {
                          index === 0
                          &&
                          <div className="text-center"> {date}</div>}

                        {item.senderid === login.id &&
                          <div key={index} className="m-4">


                            <span  >
                              {item.type === 'base64' ? (
                              <div className="d-flex justify-content-start">  <img src={`data:image/png;base64,${imagedata}`} className="sendingimg" alt="Base64 Image" /></div>
                              ) : (
                                <span className="sendingbox" >
                                  {
                                    item.Message
                                  }

                                </span>
                              )}

                            </span>
                            <small>
                              {
                                timeString
                              }
                            </small>
                          </div>
                        }
                        {item.receiverid === login.id &&
                          <div key={index} className="m-4 d-flex justify-content-end">
                            <span  >
                              {item.type === 'base64' ? (
                            <div className="d-flex justify-content-end">   <img src={`data:image/png;base64,${item.message}`} className="sendingimg" alt="Base64 Image" /></div> 
                              ) : (
                                <span className="receivingbox" >
                                  {
                                    item.message
                                  }

                                </span>
                              )}

                            </span>
                            <small>
                              {
                                timeString
                              }
                            </small>
                          </div>
                        }
                      </div>
                      )

                    })
                  }

                </div> </div>

              <div className="w-50 d-flex  justify-content-center messagebox ml-5">
  <input
  type="file"
  className="cursor"
  ref={fileInputRef}
  style={{ display: "none" }}
  onChange={handlefile}
/>

             <span className="cameraicon" onClick={handleimageClick}> <i class="fa-solid fa-camera"></i></span>
                <input type="text" className="mt-3 ml-2 w-75 send" value={messageInput} onChange={handleChange} placeholder="Send Message" />
               <img src={send} className="sendmsg" onClick={img?( SendMessage):(SendImage)} alt="" />
              </div>
            </div>) : (<div></div>)
        }
      </div>

    </div>

  );
};

export default Chat;

