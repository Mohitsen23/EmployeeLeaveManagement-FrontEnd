import React, { useState } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,  } from '@material-ui/core';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addLeaves } from "./LeaveSlice";

const LeaveRequest = () => {


  const LoginData=useSelector(state=>{
    return state.leave.LoginUser;
  })
  

  const [searchInput, setSearchInput] = useState('');
  const leaveRequest = useSelector(state => state.leave.Leave);

  const getStatusColor = (status) => {
    if (status === 'pending                       ' || status === 'pending') {
      return 'bg-warning';
    } else if (status === 'Rejected                      ' || status === 'Rejected') {
      return 'bg-danger';
    } else {
      return 'bg-success';
    }
  };
  

  const dispatch = useDispatch();
  
  const handleRejected = (id) => {
    const updatedRequest = leaveRequest.map((data) => {
      if (data.leaveid == id) {
        axios.get(`https://localhost:7189/RejectLeaveRequest/${data.leaveid}`);
        return { ...data, status: 'Rejected' };
      }
      return data;
    });
    dispatch(addLeaves(updatedRequest));
  };

  const handleAcceptRequest = (id) => {
    const updatedRequest = leaveRequest.map((data) => {
      if (data.leaveid === id) {
        axios.get(`https://localhost:7189/ChangeLeaveStatus/${data.leaveid}`);
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

console.log("filtered manager, logindata request manager",filteredRequests,LoginData);

  return (
    <>
      <div className="container">
        <h4 className="text-center mt-3">Leave Request</h4>
        <div className="row mt-3">
          <span>
            <input placeholder="Search" value={searchInput} onChange={handleChangeInput} className="mt-2 border border-4 border-primary rounded mr-3" />
          </span>
          <TableContainer>
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
                
             
  {filteredRequests.map((row) => (
    row.manager === LoginData.id ? (
      <TableRow key={row.id}>
        <TableCell>{row.id}</TableCell>
        <TableCell>{row.emplid}</TableCell>
        <TableCell>{row.leavetype}</TableCell>
        <TableCell>{row.fromDate}</TableCell>
        <TableCell>{row.toDate}</TableCell>
        <TableCell>{row.reason}</TableCell>
        <TableCell className={getStatusColor(row.status)}>{row.status}</TableCell>
        {row.status === "pending                       " && (
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
          </TableContainer>
        </div>
      </div>
    </>
  );
};

export default LeaveRequest;
