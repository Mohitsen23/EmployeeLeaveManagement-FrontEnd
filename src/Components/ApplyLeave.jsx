import React, { useState } from "react";
import { Button,FormControl,InputLabel,MenuItem,Select,TextField } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { addLeaves } from "./LeaveSlice";
import axios from "axios";

const LeaveType=[
    "Annual Leave/Vacation Leave",
    "Sick Leave",
    "Personal Leave",
    

]





const ApplyLeave=()=>{
  const [selectedOption, setSelectedOption] =useState('Apply Leave');

  const dispatch=useDispatch();
const [leaveQuota,setLeaveQuota]=useState({})
  useEffect(() => {
    const fetchLeaveQuota=async ()=>{
      try{
        const response =await axios.get(`https://localhost:7189/leaveQuota/${1}`);
        console.log("repsosddsf",response);
        setLeaveQuota(response.data);
   
      }catch (error) {
        console.error(error);
      }
    };

  

    
    fetchLeaveQuota();
  

console.log("leave quota data ",leaveQuota);

    
  }, [leaveQuota]);

  console.log("leangth of leaveQuota",leaveQuota);
  const handleDelete=(id)=>{
    const updatedLeaves = LeaveStatus.filter(data => data.id !== id);
    const response =axios.delete(`https://localhost:7189/deleteLeave/${id}`)
    dispatch(addLeaves(updatedLeaves));
  
  }
  const getStatusColor = (status) => {
    if (status === 'pending                       ' || status === 'pending') {
      return 'bg-warning';
    } else if (status === 'Rejected                      ' || status === 'Rejected') {
      return 'bg-danger';
    } else {
      return 'bg-success';
    }
  };
  const LeaveStatus = useSelector(state => {
  
    return state.leave.Leave;
  });
  const LoginData=useSelector(state=>{
    return state.leave.LoginUser;
  })
  console.log("leave status",LeaveStatus);
  const handleLeave=(event)=>{
   const selectedValue=event.target.value;
    setSelectedOption(selectedValue);
  }
  const [inputValue, setInputValue] = useState('');

    const [formData, setFormData] = useState({
      leavetype: '',
      fromDate: '',
      toDate: '',
      leaveReason: '',
    });


    const handleLeaveType = (event) => {
      setFormData({ ...formData, leavetype: event.target.value });
    };
  
    const handleFromChange = (event) => {
      setFormData({ ...formData, fromDate: event.target.value });
    };
  
    const handleToDateChange = (event) => {
      setFormData({ ...formData, toDate: event.target.value });
    };
  
    const handleLeaveReasonChange = (event) => {
      setFormData({ ...formData, leaveReason: event.target.value });
    };


    const outputObject = {
      leavetype: "string",
      emplid: 0,
      fromDate: new Date().toISOString(),
      toDate: new Date().toISOString(),
      reason: "string",
      status: "string",
      manager: 0,
      leave: {
        id: 0,
        
        employeeid: 0,
      },
    };

  
    const handleSubmit =async (event) => {
      event.preventDefault();
      outputObject.leavetype=formData.leavetype;
      outputObject.reason=formData.leaveReason;
      outputObject.fromDate=formData.fromDate;

    outputObject.toDate=formData.toDate;
    outputObject.emplid=LoginData.id;
    outputObject.status="pending";
    outputObject.manager=LoginData.manager;
    outputObject.leave.id=LoginData.id;
    outputObject.leave.employeeid=LoginData.id;
      const response=await axios.post("https://localhost:7189/applyleave",outputObject,);
      console.log('Form Data:', outputObject);
      console.log('Form Data:', response);
    };
  


  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const handleinputChange = (event) => {
    const searchValue = event.target.value;
    setInputValue(searchValue);
  }
  useEffect(() => {
    const filteredData = LeaveStatus.filter(data =>
      Object.values(data).some(value => {
        if (value !== null && typeof value !== 'undefined') {
          return value.toString().toLowerCase().includes(inputValue.toLowerCase());
        }
        return false;
      })
    );

    setFilteredLeaves(filteredData);
  }, [inputValue, LeaveStatus]);
  
  console.log("inputValue",inputValue);
  

    return(
        <>
  <div className="container">
    <div className="row d-flex justify-content-end">

    <FormControl >
    
    <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={selectedOption}
        onChange={handleLeave}>
         <MenuItem value="Apply Leave">Apply Leave</MenuItem>
        <MenuItem value="Leave Status">Leave Status</MenuItem>
        <MenuItem value="Leave Quota">Leave Quota</MenuItem>
     
      </Select>

    </FormControl>
      
    </div>
  </div>


{selectedOption=="Apply Leave"&&
       
             <form onSubmit={handleSubmit}>
      {selectedOption === 'Apply Leave' && (
        <div className='container border border-4 border-primary rounded mt-3 shadow-lg p-3'>
          <h4 className='text-center'>Apply Leave</h4>
          <div className='row mt-3'>
            <div className='form-group col-6 mt-4'>
              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-label'>Leave Type</InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  label='leavetype'
                  value={formData.leavetype}
                  onChange={handleLeaveType}
                >
                  {LeaveType.map((option) => (
                    <MenuItem value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className='col-6'>
              <div className='form-group'>
                <label htmlFor='datePicker'>From Date</label>
                <input
                  type='date'
                  id='datePicker'
                  value={formData.fromDate}
                  onChange={handleFromChange}
                  className='form-control'
                />
              </div>
            </div>
            <div className='col-6'>
              <div className='form-group'>
                <label htmlFor='datePicker'>To Date</label>
                <input
                  type='date'
                  id='datePicker'
                  value={formData.toDate}
                  onChange={handleToDateChange}
                  className='form-control'
                />
              </div>
            </div>
            <div className='col-6 mt-4'>
              <div className='form-group'>
                <TextField
                  id='filled-basic'
                  label='Leave Reason'
                  className='w-100'
                  variant='filled'
                  value={formData.leaveReason}
                  onChange={handleLeaveReasonChange}
                />
              </div>
            </div>
          </div>
          <div className='col-6'>
            <Button variant='contained' className='mt-3' type='submit'>
              Apply Leave
            </Button>
          </div>
        </div>
      )}
    </form>
 
}


 {selectedOption=="Leave Quota" &&

<div className="container">

<h4 className="text-center mt-3">Leave Quota</h4>
  <div className="row mt-3">
  
  <TableContainer>
  
   {
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Emp Id</TableCell>
            <TableCell>Remaining Leave</TableCell>
            <TableCell>Total Leave</TableCell>
            <TableCell>Used Leave</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
   

  
  <TableRow >
    <TableCell>{leaveQuota.id}</TableCell>
    <TableCell>{leaveQuota.emplid}</TableCell>
    <TableCell>{leaveQuota.remainingleave}</TableCell>
    <TableCell>{leaveQuota.totalleave}</TableCell>
    <TableCell>{leaveQuota.usedleave}</TableCell>

  </TableRow>


</TableBody>
      </Table>
}
    </TableContainer>
 
  </div>
</div>
}
 


   {selectedOption=="Leave Status" &&
<div className="container">
<h4 className="text-center mt-3">Leave Status</h4>
  <div className="row mt-3">
  <span > <input placeholder="search " value={inputValue} onChange={handleinputChange} className="mt-2 border border-4 border-primary rounded mr-3" />

</span>
  <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Emp Id</TableCell>
            <TableCell>Leave Type</TableCell>
            <TableCell>From Date</TableCell>
            <TableCell>To Date</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Status</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {LeaveStatus.map((row) => (
            <TableRow key={row.id}>
               <TableCell>{row.id}</TableCell>
               <TableCell>{row.emplid}</TableCell>
              <TableCell>{row.leavetype}</TableCell>
              <TableCell>{row.fromDate}</TableCell>
              <TableCell>{row.toDate}</TableCell>
              <TableCell>{row.reason}</TableCell>
              <TableCell  className={getStatusColor(row.status)}> {row.status}</TableCell>
              <TableCell   onClick={() => handleDelete(row.id)}><i class="fa-sharp fa-solid fa-trash"></i></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
 
  </div>
</div>
}     


              
         

    
        </>
    );
};
export default ApplyLeave;