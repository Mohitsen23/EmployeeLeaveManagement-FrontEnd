import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@material-ui/core';
import { Employeesdata, setBotMsgs, setConnectionId, setNotification } from "./LeaveSlice";
import { FormControl, InputLabel, MenuItem, Select, } from '@mui/material';
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import "../Styles/Employee.css";
import robot from '../Assets/robot.png'
import axios from "axios";
import Swal from "sweetalert2";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { HttpTransportType, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const Employees = () => {
  const dispatch = useDispatch();
  const EmployeeList = useSelector(state => state.leave.EmployeesDetails);
 
  const LoginData = useSelector(state => state.leave.LoginUser);
  const employprofile = useSelector(state =>
    state.leave.EmployeesProfile);

    useEffect(()=>{
      axios.get("https://localhost:6260/getEmployees")
      .then((responsedata) => {
        dispatch(Employeesdata(responsedata.data));
   
       
      })
      .catch((error) => {
        console.error(error);
      });
    },[])

  const handleRemove = (user) => {
    const updatedEmployee = EmployeeList.filter(data =>
      data.email !== user);
    dispatch(Employeesdata(updatedEmployee));
    const response = axios.delete(`https://localhost:6260/deleteEmployee/${user}`)
    console.log("updated employee", updatedEmployee);
  };
  const [employeeProfile, setEmployeeProfile] = useState([]);
  const [employeedata, setAllEmployeeData] = useState([]);

  useEffect(() => {

    console.log("employee profile data", employeeProfile);
    setAllEmployeeData(EmployeeList);
  }, []);

  const [employeefrom, setEmployeeform] = useState({
    firstname: '',
    lastname: '',
    email: '',
    department: '',
    companyname: 'ABC Corp',
    status: '',
    password: '',
    manager: '',
  });

  const [employee, setEmployee] = useState('All Employees');


  const handleUpdate = () => {

  };

  const [isOpen, setIsOpen] = useState(false);
  const [updateUser, setUpdateUser] = useState({});

  const openDialog = (id) => {
    const updateUserData = EmployeeList.find(data => data.id === id);
    setUpdateUser(updateUserData);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const [isOpened, setIsOpened] = useState(false);

  const openedDialog = () => {
    setIsOpened(true);
  };

  const closedDialog = () => {
    setIsOpened(false);
  };

  const updateUserDetails = async () => {
    const updatedEmployeeIndex = EmployeeList.findIndex(employee => employee.id === updateUser.id);

    try {
      const response = await axios.put(`https://localhost:6260/updateEmployee/${updateUser.id}`, updateUser);
      Swal.fire(
        'Employee Updated',
        'success'
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }

    if (updatedEmployeeIndex !== -1) {
      const updatedEmployeeList = [...EmployeeList];
      updatedEmployeeList[updatedEmployeeIndex] = updateUser;
      dispatch(Employeesdata(updatedEmployeeList));
    }
  };
  const [chaticon, setchaticon] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdateUser(prevUserData => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleAddEmp = (e) => {
    setEmployeeform({
      ...employeefrom,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    const response = await axios.post("https://localhost:6260/empsignup", employeefrom);
    dispatch(Employeesdata([...EmployeeList, response?.data]));
    console.log("response data", response);
  };

  const handleEmployeeChange = (event) => {
    const selectedValue = event.target.value;
    setEmployee(selectedValue);

    if (selectedValue === "All Employees") {
      handleAllEmployee();
    } else if (selectedValue === "My Employee") {
      handleMyEmployee(LoginData.id);
    }

  };
  const handlechatbot = () => {
    setchaticon(!chaticon);
  }
  const handleAllEmployee = () => {
    SetProfile(false);
    dispatch(Employeesdata(employeedata));
  };
  const [isProfile, SetProfile] = useState(false);
  const handleEmployeeProfile = () => {
    SetProfile(true);
  }

  const handleMyEmployee = (data) => {
    SetProfile(false);
    const filteredEmployees = EmployeeList.filter(row => row.manager.toString() === data.toString());
    dispatch(Employeesdata(filteredEmployees));
  };
  const [searchinput, setSearchInput] = useState('');
  const handleSearch = (event) => {
    setSearchInput(event.target.value);
  }

const filteredRequests =searchinput ? EmployeeList.filter((row)=>{
        const searchvalue=searchinput.toLocaleLowerCase();
        return Object.values(row).some((value)=>
        value && value.toString().toLowerCase().includes(searchvalue)
        );
}):EmployeeList;

 const employeeMap = EmployeeList.reduce((map, employee) => {
    map[employee.id] = employee;
    return map;
  }, {});


 const combinedData = employprofile.map((profile) => {
    const employeeData = employeeMap[profile.emplid];
    return {
      ...profile, ...employeeData

    };
  });

  const [chat, setChat] = useState({
    message: ""
  })
  const connectionRef = useRef(null);
  useEffect(() => {
 connectionRef.current = new HubConnectionBuilder()
      .withUrl("https://localhost:6260/notificationHub", {

        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      })
      .configureLogging(LogLevel.Trace)
      .withAutomaticReconnect()
      .build();

    connectionRef.current
      .start()
      .then(() => console.log("SignalR Connected"))
      .catch((err) => console.log("SignalR Connection Error: ", err));
    connectionRef.current.on("Connected", (connectionid, userid) => {

      dispatch(setConnectionId(userid));
    })


    connectionRef.current.on("ReceiveBotMessage", (response) => {
      const msg = {
        data: response,
        type: "receive",
        currentTime: new Date().toString(),
      }
      dispatch(setNotification(msg));
    });
  }, [])
  const sendmsgs = useSelector((state) => {
    return state.leave.SendBotMsgs;
  })
  const handlechat = (e) => {
    setChat(e.target.value);
  }
  const notification = useSelector((state) => {
    return state.leave.Notificationdata;
  })
  const sendmsgtochatbot = () => {
    connectionRef.current.invoke("SendMessagetoBot", chat).catch((error) => console.error(error));
    const mgs = {
      data: chat,
      type: "send",
      currentTime: new Date().toString()
    }
    dispatch(setBotMsgs(mgs));
    setChat("");

  }
  console.log("combine data", combinedData);
  const handlecancel = () => {
    setchaticon(!chaticon);
  }
  const msgs = [...sendmsgs, ...notification];
  console.log("msgs", msgs);
  const sortedMessage = () => {
    return [...msgs].sort((a, b) => new Date(a.currentTime) - new Date(b.currentTime));
  }
  const sortdata = sortedMessage();

const functions = [x => x + 1, x => x * x, x => 2 * x];
  console.log(functions.forEach((data)=>{
    console.log(data);
  }))
  const CountryList = [
    {
      id: 1, country: "India", capital: "Delhi"
    },
    {
      id: 2, country: "Pakistan", capital: "Islamabad"
    },
    {
      id: 3, country: "China", capital: "Beijing"
    }
  ];
const [countryId,setcountryId]=useState();
const handleSelectedCountry =(event)=>{
  const contId=parseInt(event.target.value);
  const capitalcountry=CountryList.filter((item)=>{
   return item.id===contId;
  })
  setcountryId(capitalcountry);
}
return (
    <>
         <div className="container-fluid position-absolute">
         <div className="d-flex justify-content-center">
          <h4 className="text-center mt-2">Employees Profile
           <select  onChange={handleSelectedCountry}>
           <option value="">Select a country</option>
           {CountryList.map((item, index) => (
            <option key={index} value={item.id}>
            {item.country}
            </option>
             ))}

            </select>
            { countryId!=null && 
             <span>   { countryId[0].capital}</span>}</h4>
         </div>
          <div className="d-flex justify-content-between">
          <div className="d-flex justify-content-end mt-2">
            <Button className="text-center  text-white border border-1 border-primary text-primary" onClick={openedDialog}> <i class="fa-sharp fa-solid fa-plus"></i>&nbsp; Add Employees</Button>
          </div>
          <div className="d-flex justify-content-end mt-2">
            <input placeholder="Search" value={searchinput} onChange={handleSearch} className="mt-2 border border-4 border-primary rounded mr-3" />
          </div>
          
           <FormControl fullWidth className="w-25">
            <InputLabel id='demo-simple-select-label'>Select</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              label='leavetype'
              value={employee}
              onChange={handleEmployeeChange}>
              <MenuItem value="All Employees" className="ml-5">All Employees</MenuItem>
              <hr />
              <MenuItem value="My Employee" className="ml-5">My Employee</MenuItem> <hr></hr>
              <div className="d-flex justify-content-end mt-2">
                <Button className="text-center  text-white border border-1 border-primary text-primary" onClick={handleEmployeeProfile}> <i class="fa-sharp fa-solid fa-plus"></i>&nbsp; Add Employees</Button>
              </div>
            </Select>
          </FormControl> 
        </div>
        {isProfile ? (
          <div className="row">
            {employprofile && employprofile.length > 0 ? (
              combinedData.map((data) => (
                <div className="col-lg-4 col-md-4 col-sm-6 mt-5">
                  <Card sx={{ maxWidth: 345 }} key={data.id} className=" border border-5 border-primary ml-3" style={{ borderRadius: "15px" }}>
                    <img src={`data:image/png;base64,${data.img}`} alt="Employee Profile" className="card-img-top" style={{ objectFit: "cover", height: "200px", borderRadius: "15px 15px 0 0" }} />
                    <CardContent>
                      <Typography variant="h5" component="div">
                        Name: {data.firstname}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Email: {data.email}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Department: {data.department}
                      </Typography>
                    </CardContent>
                    <CardActions className="d-flex justify-content-center">
                      <Button size="small" variant="contained" className="btn btn-primary  bg-primary text-white" style={{ borderRadius: "5px", }}>
                        View Profile
                      </Button>
                    </CardActions>
                  </Card>
                </div>))
            ) : (
              <p>No employee profile data available.</p>
            )}
          </div>
        ) : (
           <div className="row mt-3">
            <TableContainer >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>CompanyName</TableCell>
                    <TableCell>Manager</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRequests.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.firstname}</TableCell>
                      <TableCell>{item.lastname}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.department}</TableCell>
                      <TableCell>{item.companyname}</TableCell>
                      <TableCell>{item.manager}</TableCell>
                      {LoginData.id === item.manager && (
                        <>
                          <TableCell onClick={() => handleUpdate(item.leaveid)}>
                            <Button className="bg-warning text-white" onClick={() => openDialog(item.id)}> Update</Button>
                          </TableCell>
                          <TableCell onClick={() => handleRemove(item.email)}>
                            <Button className="bg-danger text-white"> Remove</Button>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )
        }
      </div>
    <div className={` ${chaticon ? 'position-relative  chatfix' : 'position-relative chatbot'
        }`}>
        {
          chaticon && <div className=" d-flex justify-content-end ">
            <div className="chatdiv ">
              <div className="d-flex justify-content-end"> <i class="fa-regular fa-circle-xmark" onClick={handlecancel}></i></div>
              <h5 className="text-center">Chat Bot</h5>
               {sortdata && sortdata.map((item, index) => {
                return (<div key={index} className="m-2">
                  {
                    item.type === "send" && <div className=""><span className="bg-primary border p-1 rounded text-white">{item.data}</span>   </div>
                  }
                  {
                    item.type === "receive" && (
                      <div className="d-flex justify-content-end">
                        <span className="p-1 bg-secondary text-white border rounded ">
                          {item.data === "employee" ? (
                            EmployeeList.map((item, index) => (
                              <div key={index} >
                               <span > {item.firstname}</span>
                              </div>
                            ))
                          ) : (
                            item.data === "details" ? ( LoginData.email):(
                              item.data
                            )
                          )}

                        </span>
                      </div>
                    )
                  }
                </div>);
              })
              }
             <div className="d-flex justify-content-center shadow-lg p-1 ">
                <input type="text" value={chat.message} className="border rounded border-5 border-primary " onChange={handlechat} placeholder="Ask to Bot"></input>
                <button onClick={sendmsgtochatbot} className="border rounded border-5 border-primary">send</button></div>
            </div>
          </div>
        }
        {!chaticon && <div className="d-flex justify-content-end">
          <span onClick={handlechatbot}>
            <img src={robot} className="bot" alt="" />
          </span>
        </div>
        }      </div>
      <Dialog open={isOpened} onClose={closedDialog}>
        <DialogTitle>Add Employee</DialogTitle>
        <DialogContent>
          <form onSubmit={handleAddEmployee}>
            <div className="container">
              <div className="d-flex">
                <div>
                  <div className="form-group">
                    <label htmlFor="firstname">First Name</label>
                    <input type="text" className="form-control" id="firstname" name="firstname" value={employeefrom.firstname} onChange={handleAddEmp} placeholder="Enter first name" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastname">Last Name</label>
                    <input type="text" className="form-control" id="lastname" name="lastname" value={employeefrom.lastname} onChange={handleAddEmp} placeholder="Enter last name" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={employeefrom.email} onChange={handleAddEmp} placeholder="Enter email" required />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" name="password" value={employeefrom.password} onChange={handleAddEmp} placeholder="Enter password" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">department</label>
                    <input type="text" className="form-control" id="department" name="department" value={employeefrom.department} onChange={handleAddEmp} placeholder="Enter department" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Status</label>
                    <input type="text" className="form-control" id="status" name="status" value={employeefrom.status} onChange={handleAddEmp} placeholder="Enter status" required />
                  </div>
                </div>
              </div>
              <div className="form-group w-50">
                <label htmlFor="email">Manager</label>
                <input type="text" className="form-control" id="manager" name="manager" value={employeefrom.manager} onChange={handleAddEmp} placeholder="Enter department" required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" onClick={closedDialog}>Save</button>
            <Button variant="contained" color="secondary" className="ml-2" onClick={closedDialog}>
              Close
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isOpen} onClose={closeDialog}>
        <DialogTitle>Change Profile</DialogTitle>
        <DialogContent>
          <div className="container">
            <div className="d-flex">
              <div>
                <div className="form-group">
                  <label htmlFor="firstname">First Name</label>
                  <input type="text" className="form-control" id="firstname" name="firstname" value={updateUser?.firstname || ''} placeholder="Enter first name" onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="lastname">Last Name</label>
                  <input type="text" className="form-control" id="lastname" name="lastname" value={updateUser?.lastname || ''} placeholder="Enter last name" onChange={handleInputChange} required />
                </div>
              </div>
              <div className="ml-3">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" className="form-control" id="email" name="email" value={updateUser?.email || ''} placeholder="Enter email" onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input type="password" className="form-control" id="password" name="password" value={updateUser?.password || ''} placeholder="Enter password" onChange={handleInputChange} required />
                </div>
              </div>
            </div>
            <div className="ml-3 d-flex">
              <div className="form-group mr-2">
                <label htmlFor="email">department</label>
                <input type="text" className="form-control" id="department" name="department" value={updateUser?.department || ''} placeholder="Enter email" onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Manager</label>
                <input type="number" className="form-control" id="manager" name="manager" value={updateUser?.manager || ''} placeholder="Enter password" onChange={handleInputChange} required />
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" onClick={updateUserDetails}>Save</button>
          <Button variant="contained" color="secondary" className="ml-2" onClick={closeDialog}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Employees;
