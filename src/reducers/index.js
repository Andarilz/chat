import * as actionTypes from '../actions/types';
import {combineReducers} from "redux";
import {
    SET_CURRENT_CHANNEL,
    SET_PRIVATE_CHANNEL,
    SET_USER_POSTS,
    SET_COLORS, SET_KEY, SET_STAR_CHANNEL, SET_CANCEL_CHANNEL_STAR
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
    userPosts: null,
    starChannel: null
}

export const channel_reducers  = (state = initialChannelState, {type, payload}) => {
    switch(type){

        case SET_CURRENT_CHANNEL:
            return {...state, currentChannel: payload.currentChannel}

        case SET_PRIVATE_CHANNEL:
            return {...state, isPrivateChannel: payload.isPrivateChannel}

        case SET_USER_POSTS:

            return {...state, userPosts: payload.userPosts}

        case SET_STAR_CHANNEL:
            return {...state, starChannel: payload.channel}

        case SET_CANCEL_CHANNEL_STAR:
            return {...state, starChannel: null}


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

export const userKey = (state = 0, {type, payload}) => {
    switch(type){

        case SET_KEY:

            return payload

        default: return state
    }
}




const rootReducer = combineReducers({
    user: user_reducer,
    channel: channel_reducers,
    colors: colors_reducers,
    key: userKey
})



export default rootReducer