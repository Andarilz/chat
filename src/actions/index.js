import * as actionTypes from './types'
import {SET_CURRENT_CHANNEL} from "./types";

//Users actions

export const setUser = user => {
    return {
        type: actionTypes.SET_USER,
        payload: {
            currentUser: user
        }
    }
}

export const clearUser = () => {
    return {
        type: actionTypes.CLEAR_USER
    }
}

//Channels actions

export const setCurrentChannel = channel => {
    return {
        type: SET_CURRENT_CHANNEL,
        payload: {
            currentChannel: channel
        }
    }
}