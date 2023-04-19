import {booksAPI} from '../api/api';

import {SetErrorStatusAC, SetErrorTitleAC, SetLoaderAC} from './app-reducer';
import {AppDispatch} from './store';


const GET_BOOK_INFO = 'GETBOOKINFO'
const CLEAR_BOOK_STATE = 'CLEAR_BOOK_STATE'
const SET_BOOK_LOADER = 'SET_BOOK_LOADER'

const SET_STATUS_ALERT = 'SET_STATUS_ALERT'


type HistoriesType = {
    id: number,
    userId: number
}

type BookingType = {
    id: number,
    order: boolean,
    dateOrder: string,
    customerId: number,
    customerFirstName: string,
    customerLastName: string
}

type ImageType = {
    url: string
}

type CommentUserType = {
    commentUserId: number,
    firstName: string,
    lastName: string,
    avatarUrl: string
}

export type CommentType = {
    createdAt: string,
    id: number,
    rating: number,
    text: string,
    user: CommentUserType

}

type DeliveryType = {
    dateHandedFrom: string,
    dateHandedTo: string,
    handed: boolean,
    id: number,
    recipientFirstName: string,
    recipientId: number,
    recipientLastName: string,
}

type BookType = {
    id: number,
    title: string,
    rating: number | null,
    issueYear: string,
    description: string,
    publish: string,
    pages: string,
    cover: string,
    weight: string,
    format: string,
    ISBN: string,
    producer: string,
    authors: string[],
    images: ImageType[] | null,
    categories: string[],
    comments: CommentType[] | null,
    booking: BookingType | null,
    delivery: DeliveryType | null,
    histories: HistoriesType[] | null
}


type BookStateType = {
    bookInfo: BookType
    isLoading: boolean
    isBookLoaded: boolean

    statusAlert: boolean

}

const DefaultState = {
    id: 0,
    title: '',
    rating: null,
    issueYear: '',
    description: '',
    publish: '',
    pages: '',
    cover: '',
    weight: '',
    format: '',
    ISBN: '',
    producer: '',
    authors: [],
    images: null,
    categories: [],
    comments: null,
    booking: null,
    delivery: null,
    histories: null
}


const initialState: BookStateType = {
    bookInfo: DefaultState,
    isLoading: false,
    isBookLoaded: true,
    statusAlert: false,
}


export const bookReducer = (state = initialState, action: ActionType) => {
    switch (action.type) {
        case GET_BOOK_INFO: {
            return {
                ...state,
                bookInfo: action.bookInfo
            }
        }
        case CLEAR_BOOK_STATE: {
            return {
                ...state,
                bookInfo: DefaultState
            }
        }

        case SET_BOOK_LOADER: {
            return {
                ...state,
                isBookLoaded: action.isLoaded
            }
        }

        case SET_STATUS_ALERT: {
            return {
                ...state,
                statusAlert: action.isAlert
            }
        }

        default: {
            return state
        }
    }
}

type ActionType =
    GetBookInfoAT
    | ClearStateAT
    | SetBookLoaderAT
    | SetStatusAlertAT




type SetStatusAlertAT = ReturnType<typeof SetStatusAlertAC>
export const SetStatusAlertAC = (isAlert: boolean) => ({type: SET_STATUS_ALERT, isAlert} as const)


type SetBookLoaderAT = ReturnType<typeof SetBookLoaderAC>
const SetBookLoaderAC = (isLoaded: boolean) => ({type: SET_BOOK_LOADER, isLoaded} as const)

// Clear state
type ClearStateAT = ReturnType<typeof ClearBookStateAC>
export const ClearBookStateAC = () => ({type: CLEAR_BOOK_STATE} as const)

type GetBookInfoAT = ReturnType<typeof GetBookInfoAC>
const GetBookInfoAC = (bookInfo: BookType) => ({type: GET_BOOK_INFO, bookInfo} as const)

export const GetBookInfoTC = (id: number) => async (dispatch: AppDispatch) => {
    dispatch(SetBookLoaderAC(false))
    await booksAPI.getBookInfo(id)
        .then(res => {
            dispatch(SetStatusAlertAC(true))
                if (res.data.length !== undefined) {
                    const book = res.data.find((bookArray: BookType) => bookArray.id === id)

                    dispatch(GetBookInfoAC(book))
                } else {
                    dispatch(GetBookInfoAC(res.data))
                }
            }
        )
        .catch(() => {
            dispatch(SetStatusAlertAC(true))
            dispatch(SetErrorStatusAC('error'))
            dispatch(SetErrorTitleAC('Что-то пошло не так. Обновите страницу через некоторое время.'))
        })
        .finally(() =>{
            dispatch(SetBookLoaderAC(true))
            setTimeout(() => {
                dispatch(SetErrorStatusAC(null))
                dispatch(SetErrorTitleAC(null))
                dispatch(SetStatusAlertAC(false))
            }, 4000)
        })
}

export const CreacteCommentTC = (rating: number, text: string, bookId: string, userId: string) =>
    async (dispatch: AppDispatch) => {
        dispatch(SetLoaderAC(false))
        await booksAPI.createComment(rating, text, bookId, userId)
            .then(() => {
                dispatch(SetErrorStatusAC('success'))
                dispatch(SetErrorTitleAC('Спасибо, что нашли время оценить книгу!'))
            })
            .catch(() => {
                dispatch(SetErrorStatusAC('error'))
                dispatch(SetErrorTitleAC('Оценка не была отправлена. Попробуйте позже!'))
            })
            .finally(() => {
                dispatch(SetLoaderAC(true))
            })
    }

export const EditCommentTC = (commentId: number, rating: number, text: string, bookId: string, userId: string) =>
    async (dispatch: AppDispatch) => {
        dispatch(SetLoaderAC(false))
        await booksAPI.editComment(commentId, rating, text, bookId, userId)
            .then(() => {
                dispatch(SetErrorStatusAC('success'))
                dispatch(SetErrorTitleAC('Спасибо, что нашли время изменить оценку!'))
            })
            .catch(() => {
                dispatch(SetErrorStatusAC('error'))
                dispatch(SetErrorTitleAC('Изменения не были сохранены. Попробуйте позже!'))
            })
            .finally(() => {
                dispatch(SetLoaderAC(true))
            })

    }

// Бронирование книги
export const BookingTC = (dateOrder: string, bookId: string, customerId: string) => async (dispatch: AppDispatch) => {
    dispatch(SetLoaderAC(false))
    await booksAPI.booking(dateOrder, bookId, customerId)
        .then(() => {
            dispatch(SetErrorStatusAC('success'))
            dispatch(SetErrorTitleAC('Книга забронирована. Подробности можно посмотреть на странице Профиль'))
        })
        .catch(() => {
            dispatch(SetErrorStatusAC('error'))
            dispatch(SetErrorTitleAC('Что-то пошло не так, книга не забронирована. Попробуйте позже!'))
        })
        .finally(() => {
            dispatch(SetLoaderAC(true))
        })
}

// Редактирвоание брони
export const EditBookingTC = (bookingId: string, dateOrder: string, bookId: string, customerId: string) => async (dispatch: AppDispatch) => {
    dispatch(SetLoaderAC(false))
    await booksAPI.editBooking(bookingId, dateOrder, bookId, customerId)
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

// Отмена брони
export const RemoveBookingTC = (bookingId: string) => async (dispatch: AppDispatch) => {
    dispatch(SetLoaderAC(false))
    await booksAPI.removeBooking(bookingId)
        .then(() => {
            dispatch(SetErrorStatusAC('success'))
            dispatch(SetErrorTitleAC('Бронирование книги успешно отменено!'))
        })
        .catch(() => {
            dispatch(SetErrorStatusAC('error'))
            dispatch(SetErrorTitleAC('Не удалось снять бронирование книги. Попробуйте позже!'))
        })
        .finally(() => {
            dispatch(SetLoaderAC(true))
        })
}


