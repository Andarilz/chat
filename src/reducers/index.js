import * as actionTypes from '../actions/types';
import {combineReducers} from "redux";

const initialUserState = {
    currentUser: null,
    isLoading: true
}

const user_reducer = (state = initialUserState, {payload, type}) => {
    switch(type){

        case actionTypes.SET_USER:

            return {
                currentUser: payload.currentUser,
                isLoading: false
            }

        case actionTypes.CLEAR_USER:

            return {
                ...initialUserState,
                isLoading: false
            }

                          default:

            return state
    }
}


const rootReducer = combineReducers({
    user: user_reducer
})


export default rootReducer