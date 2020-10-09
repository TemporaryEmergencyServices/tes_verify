import firebase from '../firebase.js'
import { useDispatch } from 'react-redux'

export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const LOGINUSER = 'LOGINUSER'

export const login = () => {
    return {
        type: LOGIN
    }
}

export const logout = () => {
    return {
        type: LOGOUT
    }
}

export const loginFB = (email, password) => {
    return async (dispatch, getState) => {
        try {
            const response = await firebase.auth().signInWithEmailAndPassword(email, password)
            console.log(response.user)
            dispatch({ type: LOGINUSER, payload: response.user })
        } catch (e) {
            console.log(e)
        }
    }
}