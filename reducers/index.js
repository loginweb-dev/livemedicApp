const reducerApp = (
        state = {
            authLogin: {}
        }, action
    ) => {
    switch (action.type) {
        case 'AUTH_LOGIN':
            return {...state, authLogin: action.payload};
        default:
            return state;
    }
}

export default reducerApp;