import {
    LOG_IN,
    LOG_OUT
} from './actions.js'

const initialState = {
    authenticated: false,
    userClass: '', //userclass here
    token: '' //store the token here
}

const logState = (state=initialState, action) => {
    const newState = {...state}
    switch(action.type){
        case LOG_IN:
            newState.authenticated = true
            newState.userClass = action.userClass
            break
        case LOG_OUT:
            newState.authenticated = false
            newState.userClass = ''
            break
        default:
            break
    }
    return newState
};

export default logState