import React, { useEffect } from "react";
import user from '../Assets/user.png'
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Employeesdata, LoginUser } from "./LeaveSlice";
const Profile=()=>{
const dispatch=useDispatch();
  const EmployeeList = useSelector(state => {
    return state.leave.EmployeesDetails;
  })




  const LoginData = useSelector(state => {
    return state.leave.LoginUser;
  })
  console.log("userLogin data",LoginData);
    const [isOpen, setIsOpen] = useState(false);

    const openDialog = () => {
      setIsOpen(true);
    };
    const closeDialog = () => {
        setIsOpen(false);
      };
      const [updateUser,setUpdateUser]=useState({});

      useEffect(() => {
        setUpdateUser(LoginData);
      }, [LoginData]); // Add LoginData as a dependency
      
      const handleProfileUpdate = (event) => {
        event.preventDefault();
        const updatedEmployeeIndex = EmployeeList.findIndex((employee) => employee.id === LoginData.id);
      
        if (updatedEmployeeIndex !== -1) {
          // Create a copy of EmployeeList
          const updatedEmployeeList = [...EmployeeList];
      
          // Update the employee object at the found index with the updated values
          updatedEmployeeList[updatedEmployeeIndex] = updateUser;
      
          console.log("update user value",updateUser);
          dispatch(Employeesdata(updatedEmployeeList));
         
          dispatch(LoginUser(updateUser));
      
       
          closeDialog();
        }
      };
      
  
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setUpdateUser((prevUserData) => ({
        ...prevUserData,
        [name]: value,
      }));
    
    };
    return (
       
        <div class="container mt-4 w-50">
        <div class="card shadow  bg-secondary text-white">
        <h3 class="card-title text-center ">User Profile</h3>
          <div class="card-body d-flex justify-content-center">
          <div className="border border-5 border-primary bg-primary shadow-lg p-1 w-100">
            <div className="d-flex justify-content-center" >
            <img src={user} style={{ width: '100px' }} /> </div>
            <div class="form-group d-flex justify-content-around mt-3">
              <label for="firstname"><strong>First Name:</strong></label>
              <span id="firstname">{LoginData?.firstname}</span> </div>
            <div class="form-group d-flex justify-content-around">
              <label for="lastname"><strong>Last Name:</strong></label>
              <span id="lastname">{LoginData?.lastname}</span></div>
            <div class="form-group d-flex justify-content-around">
              <label for="company"className="ml-4"><strong>Company:</strong></label>
              <span id="company">{LoginData?.companyname}</span></div>
            <div class="form-group d-flex justify-content-around">
              <label for="department" className="ml-1"><strong>Department:</strong></label>
              <span id="department">{LoginData?.department}</span>
            </div>
            <div class="form-group d-flex justify-content-around">
              <label for="email" className="ml-5"><strong>Email:</strong></label>
              <span id="email">{LoginData?.email}</span>
            </div>
           <div className="d-flex justify-content-end">
          <Button className="p-1 bg-white text-primary mr-5" onClick={openDialog}>Update</Button>
            </div>
            </div>
            
          </div>
        </div>


        <Dialog open={isOpen} onClose={closeDialog}>
  <DialogTitle>Change Profile</DialogTitle>
  <DialogContent>
    <form onSubmit={handleProfileUpdate}>
      <div class="container">
        <div className="d-flex">
          <div>
            <div class="form-group">
              <label for="firstname">First Name</label>
              <input
                type="text"
                class="form-control"
                id="firstname"
                name="firstname"
                value={updateUser?.firstname}
                onChange={handleInputChange}
                placeholder="Enter first name"
                required
              />
            </div>
            <div class="form-group">
              <label for="lastname">Last Name</label>
              <input
                type="text"
                class="form-control"
                id="lastname"
                name="lastname"
                value={updateUser?.lastname}
                onChange={handleInputChange}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>
          <div className="ml-3">
            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                class="form-control"
                id="email"
                name="email"
                value={updateUser?.email}
                onChange={handleInputChange}
                placeholder="Enter email"
                required
              />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                name="password"
                value={updateUser?.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                required
              />
            </div>
          </div>
          <div className="ml-3"></div>
        </div>
      </div>
      <button type="submit" class="btn btn-primary" onClick={closeDialog}>Save</button>
      <Button variant="contained" color="secondary" className="ml-2" onClick={closeDialog}>
        Close
      </Button>
    </form>
  </DialogContent>
</Dialog>

    

        
      </div>

      
    );
};
export default Profile;