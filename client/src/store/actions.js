export const LOG_IN = 'LOG_IN'
export const LOG_OUT = 'LOG_OUT'

export function logIn(userName, userClass){
    return { type: LOG_IN, userName, userClass}
}

export function logOut(){
    return { type: LOG_OUT}
}