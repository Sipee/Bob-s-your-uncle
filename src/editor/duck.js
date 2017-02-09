import { createAction, handleActions } from 'redux-actions'
import { Map } from 'immutable'
import { updateError, updateSuccess, updateWorksheet } from '../app/duck'
import { update, create, del } from '../services/firebase'

const UPDATE_FIELD = "old_wood/editor/UPDATE::FIELD"

const UPDATE_IS_UPDATE = "old_wood/editor/UPDATE::IS_UPDATE"
const UPDATE_MODAL = "old_wood/editor/UPDATE::MODAL"
const UPDATE_DELETE_ID = "old_wood/editor/UPDATE::DELETE_ID"

const INITIAL_STATE = Map()

export const updateField = createAction(UPDATE_FIELD, null, (payload, fieldType) => fieldType)

export const updateIsUpdate = createAction(UPDATE_IS_UPDATE)
export const updateModal = createAction(UPDATE_MODAL)
export const updateDeleteId = createAction(UPDATE_DELETE_ID)

export const saveChild = (id, data) => (dispatch) => {
    update(id, data)
    .then(response => {
        dispatch(updateSuccess("Successfully update!"))
        dispatch(updateIsUpdate(true))
    })
    .catch(error => {
        dispatch(updateError(error))
        dispatch(updateIsUpdate(true))
    })
}

export const createWord = (word, worksheet) => (dispatch) => {
    create('words', word)
    .then(result => {
        let words = worksheet.get("words").push(result)
        worksheet = worksheet.set("words", words)

        dispatch(updateSuccess("Successfully create!"))
        dispatch(updateIsUpdate(true))
        dispatch(updateWorksheet(worksheet))
    })
    .catch(err => {
        dispatch(updateError(err))
        dispatch(updateIsUpdate(true))
    })
}

export const deleteWord = (id) => (dispatch) => {
    del(id)
    .then(result => {
        dispatch(updateSuccess("Word deleted succeffully!"))
        dispatch(updateIsUpdate(true))
    })
    .catch(err => {
        dispatch(updateError(err))
        dispatch(updateIsUpdate(true))
    })
}

export default handleActions({
    [UPDATE_FIELD]: (state, action) => state.setIn(['fields', action.meta], action.payload),
    [UPDATE_IS_UPDATE]: (state, action) => state.set("isUpdate", action.payload),
    [UPDATE_MODAL]: (state, action) => state.set("modal", action.payload),
    [UPDATE_DELETE_ID]: (state, action) => state.set("deleteId", action.payload)
}, INITIAL_STATE)
