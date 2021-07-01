import * as actionTypes from '../actions/types';
import {combineReducers} from "redux";
import {
    SET_CURRENT_CHANNEL,
    SET_PRIVATE_CHANNEL,
    SET_USER_POSTS,
    SET_COLORS, SET_KEY, SET_STAR_CHANNEL, SET_CANCEL_CHANNEL_STAR, SET_USERS_COLORS, SET_AVATAR, SET_USER_POSTS_AVATAR
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
    userPosts: {
        avatar: '',
        count: 0,
        name: '',
        uid: ''
    },
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

        case SET_USER_POSTS_AVATAR:

            return {...state, userPosts: {...state.userPosts, avatar: payload.userPostAvatar}}


        case SET_STAR_CHANNEL:
            return {...state, starChannel: payload.channel}

        case SET_CANCEL_CHANNEL_STAR:
            return {...state, starChannel: null}


        default: return state
    }
}

const colorInitialState = {
    primary: '#4c3c4c',
    secondary: '#eee',
    usersColors: []
}

export const colors_reducers = (state = colorInitialState, {type, payload}) => {
    switch (type) {
        case SET_COLORS:

            return {
                primary: payload.primary,
                secondary: payload.secondary,
                ...state
        }

        case SET_USERS_COLORS:

            return {
                usersColors: payload.usersColors
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

export const avatar = (state = '', {payload, type}) => {
    switch(type){

        case SET_AVATAR:

            return {
                avatar: payload.avatarURL
            }

        default: return state
    }
}




const rootReducer = combineReducers({
    user: user_reducer,
    channel: channel_reducers,
    colors: colors_reducers,
    key: userKey,
    avatar
})



export default rootReducer