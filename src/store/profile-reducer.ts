import {ProfileApi} from '../api/api';

import {SetErrorStatusAC, SetErrorTitleAC, SetLoaderAC} from './app-reducer';
import {AppDispatch} from './store';


const initialState = {


}


export const profileReducer = (state = initialState, action: ActionType) => {
    switch (action.type) {

        default: {
            return state
        }
    }

}

type ActionType ={type: '', }

export const UpdateInfoTC = (
    userId: number, username: string,
    email: string, password: string,
    firstName?: string, lastName?: string,
    phone?: string) => async (dispatch: AppDispatch) => {
    dispatch(SetLoaderAC(false))
    await ProfileApi.updateInfo(userId, username, email, password, firstName, lastName, phone)
        .then(() => {
            dispatch(SetErrorStatusAC('success'))
            dispatch(SetErrorTitleAC('Изменения успешно сохранены!'))
        })
        .catch(() => {
            dispatch(SetErrorStatusAC('error'))
            dispatch(SetErrorTitleAC('Изменения не были сохранены. Попробуйте позже!'))
        })
        .finally(() => {
                dispatch(SetLoaderAC(true))
        })
}


// Обновление фото
const UpdatePhotoTC = (userId: number, id: number) => async (dispatch: AppDispatch) => {
    dispatch(SetLoaderAC(false))
    await ProfileApi.updatePhoto(userId, id)
        .then(() =>{
            dispatch(SetErrorStatusAC('success'))
            dispatch(SetErrorTitleAC('Фото успешно сохранено!'))
        })
        .catch(() => {
            dispatch(SetErrorStatusAC('error'))
            dispatch(SetErrorTitleAC('Что-то пошло не так, фото не сохранилось. Попробуйте позже!'))
        })
        .finally(() =>{
            dispatch(SetLoaderAC(true))
        } )
}

export const UploadPhotoTC = (userId: number, data: object) => async (dispatch: AppDispatch) => {
    dispatch(SetLoaderAC(false))
    await ProfileApi.uploadPhoto(data)
        .then(res => {
            dispatch(UpdatePhotoTC(userId, res.data[0].id))
        })
        .catch(() => {
            dispatch(SetErrorStatusAC('error'))
            dispatch(SetErrorTitleAC('Что-то пошло не так, фото не сохранилось. Попробуйте позже!'))
        })
        .finally(() => dispatch(SetLoaderAC(true)))
}
