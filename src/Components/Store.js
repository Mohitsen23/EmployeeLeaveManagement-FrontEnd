import { configureStore } from "@reduxjs/toolkit";
import LeaveReducer from './LeaveSlice';

const store = configureStore({
  reducer: {
    leave: LeaveReducer,
    
  }
});

export default store;
