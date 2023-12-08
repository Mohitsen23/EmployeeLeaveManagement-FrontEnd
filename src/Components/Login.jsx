import { useEffect, useState } from "react";

import axios from "axios";
import {  FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import {  Dialog, DialogContent, DialogTitle } from "@mui/material";
import Layout from "./Layout";
import { useDispatch, useSelector } from "react-redux";
import {  Employeesdata, LoginUser, SetAuthenticated, SetEmployeesProfile, TokenData, setNotification, setReceiving, setSending, userDetails } from "./LeaveSlice";
import { addLeaves } from './LeaveSlice';
 import Cookies from "js-cookie";
import Loading from "./Loading";

const Login = () => {
  const dispatch=useDispatch();
  const [loading, setLoading] = useState(true);
 const [loginotp,setLoginOTP]=useState('');
  const handleEmailSubmit=(e)=>{
  e.preventDefault();
 
   axios.post(`https://localhost:6260/generateOTP/${formData.email}`)
   .then((res)=>{
    setLoginOTP(res.data);
    dispatch(userDetails("Employee"));
    setisLoggedIn(true);
    
   })
   .catch((Error)=>{
    console.log("error",Error);
   })
  }
  

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
const [otp,setOtpData]=useState('')
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  
  const handleOtpData = (e) => {
    const { value } = e.target;
    setOtpData((prevOtp) => prevOtp + value);
  };


  const [count,setCount]=useState(30);
  const [isCounting, setIsCounting] = useState(false);

     useEffect(() => {
     let interval;
     if (isCounting && count > 0) {
      interval = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);
    } else if (count === 0) {
      setIsCounting(false); 
    }
      return () => clearInterval(interval);
  }, [isCounting,count]);


  const [selectedRole, setSelectedRole] = useState("");
  const handleRole = (e) => {
    setSelectedRole(e.target.value);
  };
 
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [isOpen,setClosedOpen]=useState(false);
  const [isOtp ,setOtp]=useState(false);
  const [user,setUser]=useState('');
const handleOtpClose=()=>{  
}

 const handleAgainOTP=()=>{
  setCount(30);
  setIsCounting(true); 
 }

  const closeDialog=()=>{
    setClosedOpen(false);
    setOtp(false);
  }
  const closeOTPDialog=()=>{
    setLoginOTP(false);
   }
 
const handleOTPSubmit=async (e)=>{
    e.preventDefault();
    
    console.log("otp data",otp);
}
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (selectedRole === "Manager") {
      console.log("formdata manager", formData);
      axios.post("https://localhost:6260/mgrlogin", formData)
        .then((response) => {
          dispatch(SetAuthenticated(true));
          dispatch(TokenData(response.data));
          Cookies.set('lmToken',response.data,{expires : 7})
          
          const config = {
            headers: {

              'Authorization': `Bearer ${response.data}`
            }
          };

          axios.post("https://localhost:6260/mgrlogindata",formData, config)
          .then((response) => {
          
          
            dispatch(LoginUser(response.data));
           Cookies.set('lmUserType', 'Manager')
          })
          .catch((error) => {
            console.error(error);
          });


          axios.get("https://localhost:6260/download/Profile")
          .then((res)=>{
           dispatch(SetEmployeesProfile(res.data));
            console.log("profile response",res);
          })
          .catch((error)=>{
            console.log("error",error);
          })

          axios.get("https://localhost:6260/leaveRequest", config)
          .then((response) => {
            
            dispatch(addLeaves(response.data));
          })
          .catch((error) => {
            console.error(error);
          });

          dispatch(userDetails("Manager"));
          dispatch(LoginUser(response.data));
          setUser("Manager");
          setisLoggedIn(true);
        
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      axios.post("https://localhost:6260/emplogin", formData)
        .then((response) => {
          console.log("Employee", response);
          dispatch(LoginUser(response.data));
          dispatch(userDetails("Employee"));
         
        
          
          setisLoggedIn(true);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    
  
    axios.get("https://localhost:6260/getEmployees")
      .then((responsedata) => {
        dispatch(Employeesdata(responsedata.data));
   
       
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleopen=()=>{
    setClosedOpen(!isOpen);
  }
  const isAuthenticated=useSelector((state)=>{
     return state.leave.isAuthenticated;
  })
const openOTp=()=>{
  setClosedOpen(!isOpen); 
  setOtp(true);
  setIsCounting(true);
}
useEffect (()=>{
  if(Cookies.get('lmToken')){
    loginWithToken();
  }

},[])
const loginWithToken = () =>{
  
  setTimeout(()=>{
    setisLoggedIn(true)
 dispatch(userDetails(Cookies.get('lmUserType'))) 
    setLoading(false)
  },1000)  


}


console.log("generated otp,enter otp",otp,loginotp);
  return (
    <>
      

{loginotp==otp && isLoggedIn ?
              (
                <Layout user={user}/>
              ): loading  ? (<Loading/>):
(
      <section className="vh-100 d-flex align-item-center justify-content-center">
        <div className="container-fluid h-custom">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-9 col-lg-6 col-xl-5">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                className="img-fluid"
                alt="Sample image"
              ></img>
            </div>
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1 ">
              <form
                className="border border-4 border-primary p-2"
                onSubmit={handleSubmit}
              >
                <div className="">
                  <h3 className="text-center mt-2">Sign in </h3>
                </div>

                <div className="form-group w-75 ml-5">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Role
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="role"
                      value={selectedRole}
                      onChange={handleRole}
                    >
                      <MenuItem value={"Manager"}>Manager</MenuItem>
                      <MenuItem value={"Employee"}>Employee</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <div className="form-outline">
                  <label className="form-label ml-5 mt-3">
                    <h5>Email address</h5>
                  </label>
                  <input
                    type="email"
                    id="form3Example3"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control ml-5 mt-1 form-control-lg w-75"
                    placeholder="Enter a valid email address"
                  />
                </div>

                <div className="form-outline">
                  <label className="form-label ml-5 mt-3">
                    <h5>Password</h5>
                  </label>
                  <input
                    type="password"
                    id="form3Example4"
                    className="form-control ml-5 mt-1 form-control-lg w-75"
                    placeholder="Enter password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="">
                  <a href="#!" className="text-body m-5 ">
                    <span>Forgot password?</span>
                  </a>
                </div>

                <div className="text-center text-lg-start mt-4 pt-2 pl-2">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Login
                  </button>
                  <hr></hr>
                  <button type="submit" className="btn btn-primary btn-lg" onClick={handleopen}>
                    Login with OTP
                  </button>
                 
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
)

}



<Dialog open={isOpen} onClose={closeDialog}  >
<h3 className="text-center mt-1">Sign in </h3>
  <DialogContent className="">
    <div className="container-fluid">
    
      <div className="row">
        <div className="col-md-12 ">
      
      <form    onSubmit={handleEmailSubmit}
              >
                
                 
              

                <div className="form-group w-75 ml-5">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Role
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="role"
                      value={selectedRole}
                      onChange={handleRole}
                    >
                      <MenuItem value={"Manager"}>Manager</MenuItem>
                      <MenuItem value={"Employee"}>Employee</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <div className="form-outline">
                  <label className="form-label ml-5 mt-3">
                    <h5>Email address</h5>
                  </label>
                  <input
                    type="email"
                    id="form3Example3"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control ml-5 mt-1 form-control-lg w-75"
                    placeholder="Enter a valid email address"
                  />
                </div>

               
                
                

                <div className="text-center text-lg-start mt-4 pt-2 pl-2">
                 
                  
                  <button type="submit" className="btn btn-primary btn-lg" onClick={openOTp}>
                    Sent OTP
                  </button>
                 
                </div>
              </form>
      </div>
      </div>
    </div>
  </DialogContent>
</Dialog>






<Dialog open={isOtp} onClick={handleOtpClose}  >
<h3 className="text-center mt-2">Sign in </h3>
  <DialogContent className="">
    <div className="container-fluid p-2">
    
      <div className="row">
        <div className="col-md-12 ">
      
      <form    onSubmit={handleOTPSubmit}
             >
                
                 
              

              <p className="text-success">OTP sent to Register Email </p>

                
              <form className="text-center">
      <div className="form-row justify-content-center">
        <input
          type="text"
          className="form-control otp-input border border-5 border-dark"
          value={otp.charAt(0) || ''}
          onChange={handleOtpData}
          style={{ width: "50px" }}
          maxLength="1"
          pattern="[0-9]"
          required
        />

        <input
          type="text"
          className="form-control otp-input border border-5 border-dark ml-1"
          value={otp.charAt(1) || ''}
          onChange={handleOtpData}
          style={{ width: "50px" }}
          maxLength="1"
          pattern="[0-9]"
          required
        />

        <input
          type="text"
          className="form-control otp-input border border-5 border-dark ml-1"
          value={otp.charAt(2) || ''}
          onChange={handleOtpData}
          style={{ width: "50px" }}
          maxLength="1"
          pattern="[0-9]"
          required
        />

        <input
          type="text"
          className="form-control otp-input border border-5 border-dark ml-1"
          value={otp.charAt(3) || ''}
          onChange={handleOtpData}
          style={{ width: "50px" }}
          maxLength="1"
          pattern="[0-9]"
          required
        />
      </div>
    
    {count!=0 ? (<p className="d-flex justify-content-end text-danger">Send OTP again {count}</p>): <p className="d-flex justify-content-end text-success" onClick={handleAgainOTP} >Send OTP</p>}
    </form>


               
                
                

                <div className="text-center text-lg-start mt-4 pt-2 pl-2">
                 
                  
                  
                 
                </div>
              </form>
      </div>
      </div>
    </div>
  </DialogContent>
</Dialog>



    </>
  );
};

export default Login;