import {booksAPI} from '../api/api';

import {SetErrorStatusAC, SetErrorTitleAC} from './app-reducer';
import {SetStatusAlertAC} from './book-reducer';
import {AppDispatch} from './store';

const GET_BOOKS_LIST = 'GETBOOKSLIST'
const CLEAR_STATE = 'CLEAR_STATE'
const SET_LOADER_BOOKS_PAGE = 'SET_LOADER_BOOKS_PAGE'

type BookingType = {
    id: number,
    order: boolean,
    dateOrder: string,
    customerId: number,
    customerFirstName: string,
    customerLastName: string
}

type HistoriesType = {
    id: number,
    userId: number
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

export type BookStateType = {
    issueYear: string,
    rating: number | null,
    title: string,
    authors: string[],
    image: {
        url: string
    },
    categories: string[],
    id: number,
    booking: BookingType | null,
    delivery: DeliveryType | null,
    histories: HistoriesType | null
}


type BooksStateType = {
    books: BookStateType[]
    isLoadedBooks: boolean,
}


const initialState: BooksStateType = {
    books: [],
    isLoadedBooks: true,
}


export const catalogReducer = (state = initialState, action: ActionType) => {
    switch (action.type) {
        case GET_BOOKS_LIST: {
            return {
                ...state,
                books: action.books
            }
        }
        case CLEAR_STATE: {
            return {
                ...state,
                books: []
            }
        }
        case SET_LOADER_BOOKS_PAGE: {
            return {
                ...state,
                isLoadedBooks:action.value
            }
        }

        default: {
            return state
        }

    }
}

type ActionType = GetBooksCatalogAT | ClearStateAT | SetLoaderBooksAT
// Clear state
type ClearStateAT = ReturnType<typeof ClearStateAC>
export const ClearStateAC = () => ({type: CLEAR_STATE} as const)

type SetLoaderBooksAT = ReturnType<typeof SetLoaderBooksAC>
export const SetLoaderBooksAC = (value: boolean) => ({type: SET_LOADER_BOOKS_PAGE, value} as const)


// Get catalog data
type GetBooksCatalogAT = ReturnType<typeof GetBooksCatalogAC>
const GetBooksCatalogAC = (books: BookStateType[]) => ({type: GET_BOOKS_LIST, books} as const)

export const GetBooksCatalogTC = () => async (dispatch: AppDispatch) => {
    dispatch(SetLoaderBooksAC(false))
    await booksAPI.getBooksCatalog()
        .then(res => {
            dispatch(SetStatusAlertAC(true))
            dispatch(GetBooksCatalogAC(res.data))
        })
        .catch(() => {
            dispatch(SetStatusAlertAC(true))
            dispatch(SetErrorStatusAC('error'))
            dispatch(SetErrorTitleAC('Что-то пошло не так. Обновите страницу через некоторое время.'))
        })
        .finally(() => {
            dispatch(SetLoaderBooksAC(true))
            setTimeout(() => {
                dispatch(SetErrorStatusAC(null))
                dispatch(SetErrorTitleAC(null))
                dispatch(SetStatusAlertAC(false))
            }, 4000)
        })

}





