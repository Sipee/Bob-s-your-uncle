import { createAction, handleActions } from 'redux-actions'
import { Map } from 'immutable'
import { logEvent } from '../services/analytics'

const UPDATE_ACTION = "mrs.sizemore/account/UPDATE::ACTION"
const UPDATE_ERROR = "mrs.sizemore/account/UPDATE::ERROR"

const INITIAL_STATE = Map({
    action: false
})

export const updateAction = createAction(UPDATE_ACTION)
export const updateError = createAction(UPDATE_ERROR)

export const connectUPEM = () => (dispatch) => {
    logEvent("connexionUPEM")
}

export default handleActions({
    [UPDATE_ACTION]: (state, action) => state.set("action", action.payload),
    [UPDATE_ERROR]: (state, action) => state.set("error", action.payload)
}, INITIAL_STATE)
