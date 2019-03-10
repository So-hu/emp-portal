export const LOG_IN = 'LOG_IN'
export const LOG_OUT = 'LOG_OUT'

export function logIn(userName, userData){
    return { type: LOG_IN, userName, userData}
}

export function logOut(){
    return { type: LOG_OUT}
}