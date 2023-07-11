import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@material-ui/core';
import { Employeesdata } from "./LeaveSlice";
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

const Employees = () => {


  const dispatch = useDispatch();
  const EmployeeList = useSelector(state => {
    return state.leave.EmployeesDetails;
  })


  const LoginData = useSelector(state => {
    return state.leave.LoginUser;
  })
  const handleRemove = () => {
    const updatedEmployee = EmployeeList.filter((data) => {
      if (data.manager != LoginData.id) {
        return data;
      }
    })
    dispatch(Employeesdata(updatedEmployee));
    console.log("updated employee", updatedEmployee);
  }

  const [employeedata, setAllEmployeeData] = useState([]);
  const handleMyEmployee = (data) => {
    setAllEmployeeData(EmployeeList);

    if (data == "All") {
      dispatch(Employeesdata(employeedata));
    } else {

      const filteredEmployees = EmployeeList.filter((row) => row.manager === data);

      dispatch(Employeesdata(filteredEmployees));

    }
  }


  const [employee, setEmployee] = useState('All Employee');
  const handleEmployeeChange = (event) => {
    const selectedValue = event.target.value;
    setEmployee(selectedValue);
  }
  const handleUpdate = () => {

  }
  const [isOpen, setIsOpen] = useState(false);
  const [updateUser, setUpdateUser] = useState({});
  const openDialog = (id) => {
    const updateUserData = EmployeeList.find((data) => data.id === id);
    setUpdateUser(updateUserData);
    setIsOpen(true);
  };
  

  const closeDialog = () => {
    setIsOpen(false);
  }


  const [isOpened, setIsOpened] = useState(false);
  const openedDialog = () => {
    setIsOpened(true);
  }

  const closedDialog = () => {
    setIsOpened(false);
  }
  
  const  updateUserDetails = () => {
    const updatedEmployeeIndex = EmployeeList.findIndex((employee) => employee.id === updateUser.id);

    try {
      const response = axios.put(`https://localhost:7189/updateEmployee/${updateUser.id}`, updateUser);
      Swal.fire(
        'Employee Updated',
        
        'success'
      )
      console.log(response.data); // Handle the response data
    } catch (error) {
      console.error(error); // Handle errors
    }
    if (updatedEmployeeIndex !== -1) {
      // Create a copy of EmployeeList
      const updatedEmployeeList = [...EmployeeList];
  
      // Update the employee object at the found index with the updated values
      updatedEmployeeList[updatedEmployeeIndex] = updateUser;
  
    
      dispatch(Employeesdata(updatedEmployeeList));
    }
  }

  const handleInputChange = (event) => {
  const { name, value } = event.target;
  setUpdateUser((prevUserData) => ({
    ...prevUserData,
    [name]: value,
  }));

};


  return (
    <>
      <div className="container">

        <div className="d-flex justify-content-center">  <h4 className="text-center">Employee List</h4></div>

        <div className="d-flex justify-content-end">
          <FormControl fullWidth className="w-25">
            <InputLabel id='demo-simple-select-label'>Select</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              label='leavetype'
              value={employee}
              onChange={handleEmployeeChange} >
               <MenuItem value="All Employees" onClick={() => { handleMyEmployee("All") }} className="ml-5">All Employees</MenuItem><br></br>
               <hr />
               <MenuItem value="My Employee" onClick={() => { handleMyEmployee(LoginData.id) }} className="ml-5">My Employee</MenuItem>

            </Select>
          </FormControl>
        </div>
        <div className="d-flex justify-content-end mt-2">  <Button variant="contained" className="text-center bg-primary text-white" onClick={openedDialog}>Add Employees</Button></div>
        <div className="row mt-3">
          <TableContainer component={Paper}>


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


                {EmployeeList.map((item, index) => {
                  //console.log("item list",item,index);
                  return <TableRow key={index}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.firstname}</TableCell>
                    <TableCell>{item.lastname}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.department}</TableCell>
                    <TableCell>{item.companyname}</TableCell>
                    <TableCell>{item.manager}</TableCell>

                    {LoginData.id === item.manager &&
                      <>
                        <TableCell onClick={(() => { handleUpdate(item.leaveid) })} ><Button className="bg-warning text-white" onClick={(() => { openDialog(item.id) })}> Update</Button> </TableCell>
                        <TableCell onClick={(() => { handleRemove(item.manager) })} ><Button className="bg-danger text-white"> Remove</Button> </TableCell>
                      </>
                    }
                  </TableRow>
                })

                }


              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      <Dialog open={isOpened} onClose={closedDialog} >
        <DialogTitle>Add Employee</DialogTitle>
        <DialogContent>
          <div class="container">
            <div className="d-flex">
              <div >
                <div class="form-group">
                  <label for="firstname">First Name</label>
                  <input type="text" class="form-control" id="firstname"  placeholder="Enter first name" required></input>
                </div>
                <div class="form-group">
                  <label for="lastname">Last Name</label>
                  <input type="text" class="form-control" id="lastname"  placeholder="Enter last name" required></input>
                </div>
              </div>
              <div className="ml-3">
                <div class="form-group">
                  <label for="email">Email</label>
                  <input type="email" class="form-control" id="email"  placeholder="Enter email" required></input>
                </div>
                <div class="form-group">
                  <label for="password">Password</label>
                  <input type="password" class="form-control"  id="password" placeholder="Enter password" required>
                  </input>
                </div> </div>
              <div className="ml-3">
                <div class="form-group">
                  <label for="email">department</label>
                  <input type="text" class="form-control" id="department"  placeholder="Enter department" required></input>
                </div></div>
              <div className="ml-3"></div>
            </div></div>
          <button type="submit" class="btn btn-primary" onClick={updateUserDetails}>Save</button>
          <Button variant="contained" color="secondary" className="ml-2" onClick={closedDialog}>
            Close
          </Button>
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
              <div className="form-group ">
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