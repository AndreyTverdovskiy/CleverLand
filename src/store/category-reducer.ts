
import {categoryAPI} from '../api/api';

import {SetErrorStatusAC, SetErrorTitleAC, SetLoaderAC} from './app-reducer';
import {AppDispatch} from './store';

const GET_CATEGORY_LIST = 'GETCATEGORYLIST';

export type CategoryType = {
    name: string,
    path: string,
    id:number,
}

export type CategoryStateType = {
    categories:CategoryType[]
}

const initialState:CategoryStateType = {
    categories:[]
}


export const categoryReducer = (state = initialState, action:ActionType) => {
    switch (action.type){
        case GET_CATEGORY_LIST:{
            return {
                ...state,
                categories: action.categList
            }
        }
        default: {
            return state
        }
    }
}

type ActionType = GetCategoriesAT

type GetCategoriesAT = ReturnType<typeof getCategoriesAC>
const getCategoriesAC = (categList:CategoryType[]) =>({type:GET_CATEGORY_LIST, categList} as const)

export const getCategoriesTC = () => async(dispatch:AppDispatch) => {
    dispatch(SetLoaderAC(false))
    await categoryAPI.getActualCategory()
        .then(res =>{
            dispatch(getCategoriesAC(res.data))
            dispatch(SetErrorStatusAC(null))
        } )
        .catch(() => {
            dispatch(SetErrorStatusAC('error'))
            dispatch(SetErrorTitleAC('Что-то пошло не так. Обновите страницу через некоторое время.'))
        })
        .finally(() => dispatch(SetLoaderAC(true)))
}


