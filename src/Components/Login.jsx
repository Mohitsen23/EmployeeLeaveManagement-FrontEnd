
import { useState } from "react";

import axios from "axios";
import {  FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import Layout from "./Layout";
import { useDispatch } from "react-redux";
import {  Employeesdata, LoginUser, userDetails } from "./LeaveSlice";
import { addLeaves } from './LeaveSlice';

const Login = () => {
  const dispatch=useDispatch();

  

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [selectedRole, setSelectedRole] = useState("");
  const handleRole = (e) => {
    setSelectedRole(e.target.value);
  };

 
  const [isLoggedIn, setisLoggedIn] = useState(false);
  
  const [user,setUser]=useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.get("https://localhost:7189/leaveRequest");
    dispatch(addLeaves(response.data));
   
    const responsedata = await axios.get("https://localhost:7189/getEmployees");
    dispatch(Employeesdata(responsedata.data));

    if (selectedRole === "Manager") {
      console.log("formdata manager",formData);
      const response = await axios.post(
        "https://localhost:7189/mgrlogin",
        formData
      );
     

      dispatch(userDetails("Manager"));
      dispatch(LoginUser(response.data));
      setUser("Manager");
      setisLoggedIn(true);
      // navigate("/layout",{state:{responseData:1}});
    } else {
      const response = await axios.post("https://localhost:7189/emplogin", formData);
      console.log("Employee", response);
      dispatch(LoginUser(response.data));
      dispatch(userDetails("Employee"));
      setisLoggedIn(true);
    
    }
  };

  return (
    <>
      
{isLoggedIn?
              (
                <Layout user={user}/>
              ):
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
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1 p-2">
              <form
                className="border border-4 border-primary"
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
                  <p className="small fw-bold mt-2 pt-1 mb-0">
                    Don't have an account?{" "}
                    <a href="#!" className="link-danger">
                      Register
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
)

}
    </>
  );
};

export default Login;
