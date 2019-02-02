const initialState = {
    authenticated: false,
    userClass: '', //userclass here
    token: '' //store the token here
}

const reducer = (state = initialState, action) =>{
    const newState = {...state};
    
    return newState;
}

export default reducer;