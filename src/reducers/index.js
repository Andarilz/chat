import * as actionTypes from '../actions/types';
import {combineReducers} from "redux";
import {
    SET_CURRENT_CHANNEL,
    SET_PRIVATE_CHANNEL,
    MESS_COUNT,
    MESS_ZERO,
    SET_USER_POSTS,
    SET_COLORS
} from "../actions/types";

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
                ...state,
                isLoading: false
            }

                          default:

            return state
    }
}

const initialChannelState = {
    currentChannel: null,
    isPrivateChannel: false,
    userPosts: null
}

export const channel_reducers  = (state = initialChannelState, {type, payload}) => {
    switch(type){

        case SET_CURRENT_CHANNEL:
            return {...state, currentChannel: payload.currentChannel}

        case SET_PRIVATE_CHANNEL:
            return {...state, isPrivateChannel: payload.isPrivateChannel}

        case SET_USER_POSTS:

            return {...state, userPosts: payload.userPosts}


        default: return state
    }
}

const colorInitialState = {
    primary: '#4c3c4c',
    secondary: '#eee'
}

export const colors_reducers = (state = colorInitialState, {type, payload}) => {
    switch (type) {
        case SET_COLORS:

            return {
                primary: payload.primary,
                secondary: payload.secondary
        }

        default: return state
    }
}




const rootReducer = combineReducers({
    user: user_reducer,
    channel: channel_reducers,
    colors: colors_reducers
})



export default rootReducer