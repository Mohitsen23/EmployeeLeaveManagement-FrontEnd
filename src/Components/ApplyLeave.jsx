import React, { useState } from "react";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Dialog, DialogContent } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { addLeaves } from "./LeaveSlice";
import axios from "axios";

const LeaveType = [
  "Annual Leave/Vacation Leave",
  "Sick Leave",
  "Personal Leave",
]
const ApplyLeave = () => {
  const [selectedOption, setSelectedOption] = useState('Apply Leave');

  const dispatch = useDispatch();
  const [leaveQuota, setLeaveQuota] = useState({})
  const [document, setDocumentData] = useState([]);
  useEffect(() => {
    const fetchLeaveQuota = async () => {
      try {
        const response = await axios.get(`https://localhost:7189/leaveQuota/${1}`);
        console.log("repsosddsf", response);
        setLeaveQuota(response.data);

      } catch (error) {
        console.error(error);
      }
    };




    fetchLeaveQuota();


    console.log("leave quota data ", leaveQuota);

    axios.get("https://localhost:7189/download/Document")
      .then((res) => {
        setDocumentData(res.data);
        console.log("response data", document);
      })
      .catch((error) => {
        console.log("error", error);
      })
  }, [document]);

  console.log("leangth of leaveQuota", leaveQuota);
  const handleDelete = (id) => {
    const updatedLeaves = LeaveStatus.filter(data => data.id !== id);
    const response = axios.delete(`https://localhost:7189/deleteLeave/${id}`)
    dispatch(addLeaves(updatedLeaves));

  }
  const getStatusColor = (status) => {
    if (status === 'pending                                           ' || status === 'pending') {
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
  const LoginData = useSelector(state => {
    return state.leave.LoginUser;
  })
  console.log("leave status", LeaveStatus);
  const handleLeave = (event) => {
    const selectedValue = event.target.value;
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


  const handleSubmit = async (event) => {
    event.preventDefault();
    outputObject.leavetype = formData.leavetype;
    outputObject.reason = formData.leaveReason;
    outputObject.fromDate = formData.fromDate;

    outputObject.toDate = formData.toDate;
    outputObject.emplid = LoginData.id;
    outputObject.status = "pending";
    outputObject.manager = LoginData.manager;
    outputObject.leave.id = LoginData.id;
    outputObject.leave.employeeid = LoginData.id;
    const response = await axios.post("https://localhost:7189/applyleave", outputObject,);
    dispatch(addLeaves([...LeaveStatus, response.data]));

  };



  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', selectedFile);
    axios.post(`https://localhost:7189/upload/${LoginData.id}`, formData)
      .then((response) => {
        console.log("response data ", response);
      })
      .catch((error) => {
        console.log("error", error);
      })

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
  const [isOpen, setDialog] = useState(false);
  const closeDialog = () => {
    setDialog(false);
  }
  const handletoggle = () => {
    setDialog(true);
  }
  return (
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
              <MenuItem value="Submit Document">Document</MenuItem>
              <MenuItem value="Send Email" onClick={handletoggle}>Send Email</MenuItem>

            </Select>

          </FormControl>

        </div>
      </div>


      {selectedOption == "Apply Leave" &&

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


      {selectedOption == "Leave Quota" &&

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


                    {
                      <TableRow >

                        <TableCell>{leaveQuota.id}</TableCell>
                        <TableCell>{leaveQuota.emplid}</TableCell>
                        <TableCell>{leaveQuota.remainingleave}</TableCell>
                        <TableCell>{leaveQuota.totalleave}</TableCell>
                        <TableCell>{leaveQuota.usedleave}</TableCell>

                      </TableRow>
                    }


                  </TableBody>
                </Table>
              }
            </TableContainer>

          </div>
        </div>
      }




      {selectedOption == "Leave Status" &&
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
                    <TableCell>Leave Type</TableCell>searchInput
                    <TableCell>From Date</TableCell>
                    <TableCell>To Date</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Status</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  { }
                  {LeaveStatus.map((row) => (

                    row.emplid === LoginData.id ? (
                      <TableRow key={row.id}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.emplid}</TableCell>
                        <TableCell>{row.leavetype}</TableCell>
                        <TableCell>{row.fromDate}</TableCell>
                        <TableCell>{row.toDate}</TableCell>
                        <TableCell>{row.reason}</TableCell>
                        <TableCell className={getStatusColor(row.status)}> {row.status}</TableCell>
                        <TableCell onClick={() => handleDelete(row.id)}><i class="fa-sharp fa-solid fa-trash"></i></TableCell>
                      </TableRow>

                    ) : null
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

          </div>
        </div>
      }

      {selectedOption == "Submit Document" &&
        <div className="container mt-4">
          <h2>Upload Your Documents</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                id="fileInput"
                onChange={handleFileChange}
              />
              <label className="custom-file-label" htmlFor="fileInput">
                {selectedFile ? selectedFile.name : 'Choose file'}
              </label>
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Upload
            </button>
          </form>







          <h4 className="text-center mt-3">Uploaded Documents</h4>


          <TableContainer>

            {document.length > 0 &&
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Emp Id</TableCell>
                    <TableCell>Doucment Name</TableCell>
                    <TableCell>File Data</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>

                  {
                    document.map((row) => (
                      row.emplid == LoginData.id ?
                        (<TableRow key={row.id}>

                          <TableCell>{row.id}</TableCell>
                          <TableCell>{row.emplid}</TableCell>
                          <TableCell>{row.documentName}</TableCell>
                          <TableCell>
                            <Button variant="container" className="bg-primary text-white"> <a className="text-light" href={`data:application/octet-stream;base64,${row.file}`}>
                              Download
                            </a></Button>
                          </TableCell>


                        </TableRow>) : null

                    ))
                  }




                </TableBody>
              </Table>
            }
          </TableContainer>

        </div>
      }


      <Dialog open={isOpen} onClose={closeDialog} fullWidth>

        <DialogContent>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="d-flex justify-content-end" onClick={closeDialog}><i class="fa-solid fa-xmark fa-lg"></i></div>
                <h3 className="text-center">Send Email  </h3>
                <form className="p-4">
                  <div className="form-group">
                    <label htmlFor="recipient">To:</label>
                    <input type="email" className="form-control" id="recipient" placeholder="Recipient" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subject:</label>
                    <input type="text" className="form-control" id="subject" placeholder="Subject" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message:</label>
                    <textarea className="form-control" id="message" rows="6" placeholder="Enter your message"></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="attachment">Attachment:</label>
                    <input type="file" className="form-control-file" id="attachment" />
                  </div>
                  <div className="text-center d-flex justify-content-between">
                    <button type="submit" className="btn btn-primary mr-2" onClick={closeDialog}>
                      Send
                    </button>

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
export default ApplyLeave;