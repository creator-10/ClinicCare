
import {createSlice} from '@reduxjs/toolkit'

const authSlice=createSlice({
    name:'auth',
    initialState:{
        token:localStorage.getItem('token') || '',
        role:localStorage.getItem('role') ||  ''


    },

    reducers:{
       
        setToken:(state,action)=>{
        const { token = '', role = '' } = action.payload || {};
    state.token = token;
    state.role = role;
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
        },
        clearToken:(state)=>{
            state.token=''
            state.role=''
            localStorage.removeItem('token')
            localStorage.removeItem('role')
        }
    }
})

export const {setToken,clearToken}=authSlice.actions
export default authSlice.reducer