import firebase from '../firebase.js'
import { useDispatch } from 'react-redux'

export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const SIGNUP = 'SIGNUP'

export const login = (userInfo) => {
    return {
        type: LOGIN, 
        payload: userInfo
    }
}

export const logout = (userInfo) => {
    return {
        type: LOGOUT, 
        payload: userInfo
    }
}

export const signup = (userInfo) => {
    return {
        type: SIGNUP, 
        payload: userInfo
    }
}