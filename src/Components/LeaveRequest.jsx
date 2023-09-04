import React, { useState } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,  } from '@material-ui/core';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addLeaves } from "./LeaveSlice";

const LeaveRequest = () => {


  const LoginData=useSelector(state=>{
    return state.leave.LoginUser;
  })
  
const tokendata=useSelector((state)=>{
    return state.leave.Token;
})
const config = {
  headers: {
    'Authorization': `Bearer ${tokendata}`
  }
};
  const [searchInput, setSearchInput] = useState('');
  const leaveRequest = useSelector(state => state.leave.Leave);

  const getStatusColor = (status) => {
    if (status === 'pending                                           ' || status === 'pending') {
      return 'bg-warning';
    } else if (status ==="Rejected                                          " || status === 'Rejected') {
      return 'bg-danger';
    } else {
      return 'bg-success';
    }
  };
  

  const dispatch = useDispatch();
  
  const handleRejected = (id) => {
    const updatedRequest = leaveRequest.map((data) => {
      if (data.leaveid == id) {
        axios.get(`https://localhost:7189/RejectLeaveRequest/${data.leaveid}`,config);
        return { ...data, status: 'Rejected' };
      }
      return data;
    });
    dispatch(addLeaves(updatedRequest));
  };

  const handleAcceptRequest = (id) => {
    const updatedRequest = leaveRequest.map((data) => {
      if (data.leaveid === id) {
        axios.get(`https://localhost:7189/ChangeLeaveStatus/${data.leaveid}`,config);
        return { ...data, status: 'Approved' };
      }
      return data;
    });
    dispatch(addLeaves(updatedRequest));
  };

  const handleChangeInput = (event) => {
    setSearchInput(event.target.value);
  };

const filteredRequests = searchInput
  ? leaveRequest.filter((row) => {
      const searchValue = searchInput.toLowerCase();
      return Object.values(row).some((value) =>

        value && value.toString().toLowerCase().includes(searchValue)
      );
    })
  : leaveRequest;


const itemsperpage=20;

const [currentPage,setCurrentPage]=useState(1);

const totalPages=Math.ceil(filteredRequests.length / itemsperpage);
const startingIndex=(currentPage-1) * itemsperpage;
const endIndex = startingIndex + itemsperpage;
  const currentData = filteredRequests.slice(startingIndex, endIndex);
console.log("currentData",currentData);
const handlePrevious=()=>{
  setCurrentPage(currentPage-1);
}
const handleNextPage=()=>{
  setCurrentPage(currentPage+1);
}
const handleClickOnPages=(data)=>{
  setCurrentPage(data);
}
  return (
    <>
      <div className="container">
        <h4 className="text-center mt-3">Leave Request</h4>
        <div className="row mt-3">
          <span>
            <input placeholder="Search" value={searchInput} onChange={handleChangeInput} className="mt-2 border border-4 border-primary rounded mr-3" />
          </span>
          <TableContainer className="w-100">
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
                
             
  {currentData.map((row,index) => (
    row.manager === LoginData.id ? (
      <TableRow key={row.id}>
       
        <TableCell>{row.id}</TableCell>
        <TableCell>{row.emplid}</TableCell>
        <TableCell>{row.leavetype}</TableCell>
        <TableCell>{row.fromDate}</TableCell>
        <TableCell>{row.toDate}</TableCell>
        <TableCell>{row.reason}</TableCell>
        <TableCell className={getStatusColor(row.status)}>{row.status}</TableCell>
        {row.status === "pending                                           " && (
          <>
            <TableCell onClick={() => { handleRejected(row.leaveid) }}><Button className="bg-danger text-white">Reject</Button></TableCell>
            <TableCell onClick={() => { handleAcceptRequest(row.leaveid) }}><Button className="bg-success text-white">Accept</Button></TableCell>
          </>
        )}
      </TableRow>
    ) : null
  ))}
 
</TableBody>

  </Table>
  <Table className="mt-4">
  <TableRow className="d-flex" > 
    <Button onClick={handlePrevious} disabled={currentPage===1}>  Previous</Button>
    {
      Array.from({length:totalPages}).map((data,index)=>{
        return(
        <Button onClick={()=>{handleClickOnPages(index+1)}} key={index}>{index+1}</Button>
        )
      })
    }
    <Button onClick={handleNextPage} disabled={currentPage===totalPages}>Next</Button>
        </TableRow>
  </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
};

export default LeaveRequest;
