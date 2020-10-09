import { combineReducers } from 'redux'
import isLoggedReducer from './isLoggedReducer'
// import usernameReducer from './usernameReducer'
// import { LOGIN, SIGNUP, UPDATE_EMAIL, UPDATE_PASSWORD } from '../actions/user'

/* This file based off of:
 * https://heartbeat.fritz.ai/how-to-build-an-email-authentication-app-with-firebase-firestore-and-react-native-a18a8ba78574#218e
 * it's part of setting up redux
 */


// const user = (state = {}, action) => {
//     switch (action.type) {
//         case LOGIN:
//             return action.payload
//         case SIGNUP:
//             return action.payload
//         case UPDATE_EMAIL:
//             return { ...state, email: action.payload }
//         case UPDATE_PASSWORD:
//             return { ...state, password: action.payload }
//         default:
//             return state
//     }
// }

const rootReducer = combineReducers({
    isLoggedIn: isLoggedReducer
})

export default rootReducer