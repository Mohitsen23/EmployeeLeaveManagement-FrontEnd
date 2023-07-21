import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Leave: [],
  User: "",
  LoginUser:"",
  EmployeesDetails:[],
  Sidebar:true,
  Token:'',
  isAuthenticated:false,
  EmployeesProfile:[]
  
};

const LeaveSlice = createSlice({
  name: "Leave",
  initialState,
  reducers: {
    addLeaves: (state, { payload }) => {
      state.Leave = payload;
    },
    userDetails: (state, { payload }) => {
      state.User = payload;
    },
    LoginUser:(state,{payload})=>{
      state.LoginUser = payload;
    },
    Employeesdata:(state,{payload})=>{
      state.EmployeesDetails=payload;
    },
    Sidebar:(state,{payload})=>{
      state.Sidebar=payload;
    },
    TokenData:(state,{payload})=>{
      state.Token=payload;
    },
    SetAuthenticated:(state,{payload})=>{
     state.isAuthenticated=payload;
    },
    SetEmployeesProfile:(state,{payload})=>{
      state.EmployeesProfile=payload;
    }
  }
});

export const { addLeaves, userDetails,LoginUser,Employeesdata ,Sidebar,TokenData,SetAuthenticated,SetEmployeesProfile} = LeaveSlice.actions;
export default LeaveSlice.reducer;
