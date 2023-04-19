import {AuthAPI} from '../api/api';
import {FormDataType} from '../components/utils/custom-input/custom-input.types';

import {SetErrorStatusAC, SetErrorTitleAC, SetLoaderAC} from './app-reducer';
import {SetStatusAlertAC} from './book-reducer';
import {AppDispatch} from './store';

const IS_AUTH = 'IS_AUTH'
const LOGOUT = 'LOGOUT'
const CHECK_AUTH_DATA = 'CHECK_AUTH_DATA'
/// registration
const CHECK_REGISTR_DATA = 'CHECK_REGISTR_DATA'
const IS_REGISTR_ERROR = 'IS_REGISTR_ERROR'
const IS_REGISTR_SUCCESS = 'IS_REGISTR_SUCCESS'

// forgot
const FORGOT_PASSWORD = 'FORGOT_PASSWORD'
const FORGOT_PASSWORD_ERROR = 'FORGOT_PASSWORD_ERROR'
const SET_PASSWORD_ERROR = 'SET_PASSWORD_ERROR'


const RESET_PASSWORD = 'RESET_PASSWORD'
const SET_AUTH_ERROR = 'SET_AUTH_ERROR'

const SET_USER_INFO = 'SET_USER_INFO'

const SET_PROFILE_LOADER = 'SET_PROFILE_LOADER'

export type CommentsType = {
    bookId: number
    id: number
    rating: number
    text: string
}

export type BookType = {
    id: number,
    title: string,
    rating: number,
    issueYear: string,
    authors: string[],
    image: string | null,
}


type UserInfo = {
    id: number,
    username: string,
    email: string,
    confirmed: boolean,
    blocked: boolean,
    createdAt: string,
    updatedAt: string,
    firstName: string,
    lastName: string,
    phone: string,
    role: {
        id: number,
        name: string,
        description: string,
        type: string,
    },
    comments: CommentsType[],
    avatar: string | null,
    booking: {
        id: number | null,
        order: boolean | null,
        dateOrder: string | Date | null,
        book: BookType | null

    },
    delivery: {
        book: BookType | null
        dateHandedFrom: string | null
        dateHandedTo: string | null
        handed: boolean | null
        id: number | null
    }

    history: {
        id: number | null
        books: BookType[] | null
    }

}

type InitialState = {
    isAuth: boolean | null
    isAuthError: boolean
    isAuthResError: boolean
    //
    isRegistrError: boolean,
    isRegistrResError: boolean,
    isRegistrSuccess: boolean,
    //
    isLetterSuccess: boolean,
    isLetterError: boolean,
    resetPasswordError: boolean,
    isResetPasswordSuccess: boolean,
    isLoadedProfile: boolean,
    userInfo: UserInfo

}


const initialState: InitialState = {
    isAuth: null,
    isAuthError: false,
    isAuthResError: false,
    //
    isRegistrError: false,
    isRegistrResError: false,
    isRegistrSuccess: false,
    //
    isLetterSuccess: false,
    isLetterError: false,
    resetPasswordError: false,
    isResetPasswordSuccess: false,

    userInfo: {} as UserInfo,
    isLoadedProfile: true,

}


export const authReducer = (state = initialState, action: ActionType) => {
    switch (action.type) {
        // Авторизация
        case IS_AUTH: {
            return {
                ...state,
                isAuth: action.isAuth,
            }
        }

        // Сет информации пользователя

        case SET_USER_INFO: {
            return {
                ...state,
                userInfo: action.userData
            }
        }

        // Выход
        case LOGOUT: {
            localStorage.removeItem('token')

            return {
                ...state,
                isAuth: false,
            }
        }
        // неверный логин или пароль
        case CHECK_AUTH_DATA: {
            return {
                ...state,
                isAuthResError: action.isError
            }
        }
        // Ошибка ответа с сервера
        case SET_AUTH_ERROR: {
            return {
                ...state,
                isAuthError: action.error,
            }
        }

        // Регистрация
        // Пользователь с такими данными уже существет
        case CHECK_REGISTR_DATA: {
            return {
                ...state,
                isRegistrResError: action.isInvalidData
            }
        }
        // Ошибка ответа с сервера
        case IS_REGISTR_ERROR: {
            return {
                ...state,
                isRegistrError: action.isError
            }
        }
        // Регистрация прошла успешно?
        case IS_REGISTR_SUCCESS: {
            return {
                ...state,
                isRegistrSuccess: action.isSuccess
            }
        }


        // Восстановление пароля
        // Отправка письма на почту
        case FORGOT_PASSWORD: {
            return {
                ...state,
                isLetterSuccess: action.isSuccess
            }
        }
        // Ошибка при отправке почты
        case FORGOT_PASSWORD_ERROR: {
            return {
                ...state,
                isLetterError: action.resError
            }
        }
        // Успешная смен пароля
        case RESET_PASSWORD: {
            return {
                ...state,
                isResetPasswordSuccess: action.isSuccess
            }
        }
        // Ошибка при смене пароля
        case SET_PASSWORD_ERROR: {
            return {
                ...state,
                resetPasswordError: action.isError,
            }
        }
        case SET_PROFILE_LOADER: {
            return {
                ...state,
                isLoadedProfile:action.value
            }
        }

        default: {
            return state
        }
    }
}

type ActionType =

    IsAuthAT
    | IsLoginResErrorAT
    | IsLoginErrorAT

    | IsRegistrationResErrorAT
    | IsRegistrationErrorAT
    | IsRegistrationSuccessAT

    | ForgotPasswordAT
    | ForgotPasswordErrorAT
    | ResetPasswordAT
    | ResetPasswordErrorAT

    | LogoutAT

    | UserInfoAT
    | SetProfileLoaderAT

// Set loader status
type SetProfileLoaderAT = ReturnType<typeof SetProfileLoaderAC>
export const SetProfileLoaderAC = (value: boolean) => ({type: SET_PROFILE_LOADER, value} as const)
// Пользователь авторизован?
type IsAuthAT = ReturnType<typeof IsAuthAC>
export const IsAuthAC = (isAuth: boolean) => ({type: IS_AUTH, isAuth} as const)

// Получение информации о пользователе
type UserInfoAT = ReturnType<typeof UserInfoAC>
const UserInfoAC = (userData: UserInfo) => ({type: SET_USER_INFO, userData} as const)

export const UserInfoTC = () => async (dispatch: AppDispatch) => {
    dispatch(SetLoaderAC(false))
    await AuthAPI.me()
        .then(res => {
            dispatch(SetStatusAlertAC(true))
            dispatch(UserInfoAC(res.data))
            dispatch(IsAuthAC(true))
        })
        .catch(() => {
            dispatch(SetStatusAlertAC(true))
            dispatch(IsAuthAC(false))
        })
        .finally(() =>{
            dispatch(SetLoaderAC(true))
            setTimeout(() => {
                dispatch(SetErrorStatusAC(null))
                dispatch(SetErrorTitleAC(null))
                dispatch(SetStatusAlertAC(false))
            }, 4000)
        })
}


// Логаут
type LogoutAT = ReturnType<typeof LogoutAC>
export const LogoutAC = () => ({type: LOGOUT} as const)

// Неверные логин или пароль (логин)
type IsLoginResErrorAT = ReturnType<typeof IsLoginResErrorAC>
export const IsLoginResErrorAC = (isError: boolean) => ({type: CHECK_AUTH_DATA, isError} as const)

// Что-то пошло не так (логин)
type IsLoginErrorAT = ReturnType<typeof IsLoginErrorAC>
const IsLoginErrorAC = (error: boolean) => ({type: SET_AUTH_ERROR, error} as const)

// Авторизация пользователя
export const LoginTC = (data: FormDataType) => async (dispatch: AppDispatch) => {
    dispatch(SetLoaderAC(false))
    await AuthAPI.login(data)
        .then(res => {
            localStorage.setItem('token', res.data.jwt)
            dispatch(IsAuthAC(true))
            dispatch(IsLoginResErrorAC(false))
            dispatch(IsLoginErrorAC(false))
        })
        .catch(rej => {
            if (rej.response.status === 400) {
                dispatch(IsLoginResErrorAC(true))
                dispatch(IsLoginErrorAC(false))
            } else {
                dispatch(IsLoginErrorAC(true))
                dispatch(IsLoginResErrorAC(false))
            }
        })
        .finally(() => {
            dispatch(SetLoaderAC(true))
        })

}


// Регистрация //
// Пользователь с такими данными уже зарегистрирован
type IsRegistrationResErrorAT = ReturnType<typeof isRegistrationResErrorAC>
export const isRegistrationResErrorAC = (isInvalidData: boolean) => ({
    type: CHECK_REGISTR_DATA,
    isInvalidData
} as const)

// Ошибка ответа с сервера
type IsRegistrationErrorAT = ReturnType<typeof isRegistrationErrorAC>
const isRegistrationErrorAC = (isError: boolean) => ({type: IS_REGISTR_ERROR, isError} as const)

// Регистрация прошла успешно?
type IsRegistrationSuccessAT = ReturnType<typeof IsRegistrationSuccessAC>
const IsRegistrationSuccessAC = (isSuccess: boolean) => ({
    type: IS_REGISTR_SUCCESS,
    isSuccess
} as const)

// Санка
export const RegistrationTC = (data: FormDataType) => async (dispatch: AppDispatch) => {
    dispatch(SetLoaderAC(false))
    await AuthAPI.registration(data)
        .then(() => {
            dispatch(IsRegistrationSuccessAC(true))
            dispatch(isRegistrationErrorAC(false))
            dispatch(isRegistrationResErrorAC(false))

        })
        .catch(rej => {
            if (rej.response.status === 400) {
                dispatch(IsRegistrationSuccessAC(false))
                dispatch(isRegistrationErrorAC(false))
                dispatch(isRegistrationResErrorAC(true))
            } else {
                dispatch(isRegistrationErrorAC(true))
                dispatch(IsRegistrationSuccessAC(false))
                dispatch(isRegistrationResErrorAC(false))
            }
        })
        .finally(() => dispatch(SetLoaderAC(true)))
}


// Восстановление пароля
// Отправка письма на почту
type ForgotPasswordAT = ReturnType<typeof ForgotPasswordAC>
const ForgotPasswordAC = (isSuccess: boolean) => ({type: FORGOT_PASSWORD, isSuccess} as const)

// Серверная ошибка
type ForgotPasswordErrorAT = ReturnType<typeof ForgotPasswordErrorAC>
const ForgotPasswordErrorAC = (resError: boolean) => ({
    type: FORGOT_PASSWORD_ERROR,
    resError
} as const)


export const ForgotTC = (data: FormDataType) => async (dispatch: AppDispatch) => {
    dispatch(SetLoaderAC(false))
    await AuthAPI.forgotPassword(data)
        .then(() => {
            dispatch(ForgotPasswordAC(true))
            dispatch(ForgotPasswordErrorAC(false))
        })
        .catch(() => {
            dispatch(ForgotPasswordAC(false))
            dispatch(ForgotPasswordErrorAC(true))
        })
        .finally(() => {
            dispatch(SetLoaderAC(true))
        })
}


type ResetPasswordAT = ReturnType<typeof ResetPasswordAC>
const ResetPasswordAC = (isSuccess: boolean) => ({type: RESET_PASSWORD, isSuccess} as const)

// Ошибка с сервера
type ResetPasswordErrorAT = ReturnType<typeof ResetPasswordErrorAC>
const ResetPasswordErrorAC = (isError: boolean) => ({type: SET_PASSWORD_ERROR, isError} as const)

export const ResetTC = (data: FormDataType, code: string) => async (dispatch: AppDispatch) => {
    dispatch(SetLoaderAC(false))
    await AuthAPI.resetPassword(data, code)
        .then(() => {
            dispatch(ResetPasswordAC(true))
            dispatch(ResetPasswordErrorAC(false))
        })
        .catch(() => {
            dispatch(ResetPasswordAC(false))
            dispatch(ResetPasswordErrorAC(true))
        })
        .finally(() => {
            dispatch(SetLoaderAC(true))
        })
}










