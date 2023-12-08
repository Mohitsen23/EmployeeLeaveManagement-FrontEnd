import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Leave: [],
  User: "",
  LoginUser:"",
  EmployeesDetails:[],
  Sidebar:true,
  Token:'',
  isAuthenticated:false,
  EmployeesProfile:[],
  Notificationdata:[],
  MessageData:[],
  ConnectionId:[],
  Managers:[],
  Send:[],
  Receive:[],
  RecentMessage:[],
  SentMessage:[],
  SignalRConnection:[],
  SendBotMsgs:[],
  managerProfilepic:[]
 
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
    },
    setNotification:(state,{payload})=>{
         state.Notificationdata.push(payload);
    },
    setMessageData: (state, { payload }) => {
      state.MessageData = payload; 
    },
    setConnectionId:(state,{payload})=>{
      state.ConnectionId.push(payload);
    },
    setManagers:(state,{payload})=>{
      state.Managers=payload;
    },
    setSending:(state,{payload})=>{
      state.Send = Array.isArray(payload) ? payload : [payload];
    },
    setReceiving:(state,{payload})=>{
      state.Receive=Array.isArray(payload)?payload:[payload];
    },
    setRecentMessage:(state,{payload})=>{
      state.RecentMessage.push(payload);
    },
    setSentMessages:(state,{payload})=>{
      state.SentMessage.push(payload)
    },
    setSignalRConnection:(State,{payload})=>{
      State.SignalRConnection=payload
    },
    setBotMsgs:(state,{payload})=>{
      state.SendBotMsgs.push(payload);
    },
    setManagerProfilepicData:(state,{payload})=>{
      state.managerProfilepic.push(payload);
    }
  }
});

export const { addLeaves,setBotMsgs,setManagerProfilepicData,setSentMessages,setRecentMessage,setSending,setReceiving, setManagers,userDetails,LoginUser,Employeesdata,setConnectionId ,Sidebar,TokenData,SetAuthenticated,SetEmployeesProfile,setNotification,setMessageData,setSignalRConnection} = LeaveSlice.actions;
export default LeaveSlice.reducer;
