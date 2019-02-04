export const LOG_IN = 'LOG_IN'
export const LOG_OUT = 'LOG_OUT'

export function logIn(userClass){
    return { type: LOG_IN, userClass}
}

export function logOut(){
    return { type: LOG_OUT}
}