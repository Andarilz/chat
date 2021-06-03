import * as actionTypes from './types'
import {SET_USER} from "./types";

export const setUser = user => {
    return {
        type: actionTypes.SET_USER,
        payload: {
            currentUser: user
        }
    }
}