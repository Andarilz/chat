import * as actionTypes from './types'
import {
    MESS_COUNT,
    MESS_ZERO, SET_AVATAR, SET_CANCEL_CHANNEL_STAR,
    SET_COLORS,
    SET_CURRENT_CHANNEL, SET_KEY,
    SET_PRIVATE_CHANNEL, SET_STAR_CHANNEL,
    SET_USER,
    SET_USER_POSTS, SET_USERS_COLORS,
    SET_USER_POSTS_AVATAR
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

export const setKey = (key) => {
    return {
        type: SET_KEY,
        payload: {
            key
        }
    }
}

export const setStarChannel = (channel) => {
    return {
        type: SET_STAR_CHANNEL,
        payload: {
            channel
        }
    }
}

export const setCancelChannelStar = () => {
    return {
        type: SET_CANCEL_CHANNEL_STAR
    }
}

export const setUsersColors = (usersColors) => {
    return {
        type: SET_USERS_COLORS,
        payload: {
            usersColors
        }
    }
}

export const setAvatar = (avatarURL) => {
    return {
        type: SET_AVATAR,
        payload: {
            avatarURL
        }
    }
}

export const setUserPostsAvatar = userPostAvatar => {
    return {
        type: SET_USER_POSTS_AVATAR,
        payload: {
            userPostAvatar
        }
    }
}

