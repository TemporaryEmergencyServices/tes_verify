const userInfoReducer = (state = {}, action) => {
    switch (action.type) {
        case 'LOGINUSER': 
           return action.payload
        default: 
            return state
    }
}

export default userInfoReducer