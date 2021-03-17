const reducerApp = (
        state = {
            authLogin: {},
            callInfo: {},
            callRating: {},
            callInProgress: false,
            historial: []
        }, action
    ) => {
    switch (action.type) {
        case 'AUTH_LOGIN':
            return {...state, authLogin: action.payload};
        case 'SET_CALL_INFO':
            return {...state, callInfo: action.payload};
        case 'SET_CALL_RATING':
            return {...state, callRating: action.payload};
        case 'SET_CALL_IN_PROGRESS':
            return {...state, callInProgress: action.payload};
        case 'SET_HISTORIAL':
            return {...state, historial: action.payload};
        default:
            return state;
    }
}

export default reducerApp;