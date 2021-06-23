import * as actionTypes from './types'
import {
    MESS_COUNT,
    MESS_ZERO,
    SET_COLORS,
    SET_CURRENT_CHANNEL,
    SET_PRIVATE_CHANNEL,
    SET_USER,
    SET_USER_POSTS
} from "./types";

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

export const setPrivateChannel = isPrivateChannel => {
    return {
        type: SET_PRIVATE_CHANNEL,
        payload: {
            isPrivateChannel
        }
    }
}

export const counterUp = () => {
    return {
        type: MESS_COUNT
    }
}

export const counterZero = () => {
    return {
        type: MESS_ZERO
    }
}

export const setUserPosts = userPosts => {
    return {
        type: SET_USER_POSTS,
        payload: {
            userPosts
        }
    }
}

// Color actions

export const setColors = (primary, secondary) => {
    return {
        type: SET_COLORS,
        payload: {
            primary,
            secondary
        }
    }
}
