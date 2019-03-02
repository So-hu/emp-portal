import {
    LOG_IN,
    LOG_OUT
} from './actions.js'

const loadState = () =>{
    try{
        const session = sessionStorage.getItem('state')
        if(session === null){
            return null
        }
        return JSON.parse(session)
    } catch(e){
        return null
    }
}

var initialState = {
    authenticated: false,
    userName: '',
    userClass: '', //userclass here
    routes: []
}

const persistedState = loadState();
console.log(persistedState)
if(persistedState){
    initialState = persistedState
}

const logState = (state=initialState, action) => {
    const newState = {...state}
    switch(action.type){
        case LOG_IN:
            newState.authenticated = true
            newState.userName = action.userName
            newState.userClass = action.userClass
            if (newState.userClass === "nonadministrator") {
                newState.routes=
                  [
                    { route: "/homepage", name: "Home" },
                    { route: "/newaward", name: "New Award" },
                    { route: "/awardshistory", name: "Awards History" },
                    { route: "/account", name: "Account" }
                  ]      
              } else if (newState.userClass === "administrator") {
                newState.routes=
                  [
                    { route: "/homepage", name: "Home" },
                    { route: "/user+administration", name: "User Administration" },
                    { route: "/reports", name: "Reports" }
                  ]
              } else {
                newState.routes= []
              }
            sessionStorage.setItem('state', JSON.stringify(newState))
            break
        case LOG_OUT:
            newState.authenticated = false
            newState.userClass = ''
            newState.userName = ''
            newState.routes = []
            sessionStorage.clear()
            break
        default:
            break
    }
    return newState
};

export default logState