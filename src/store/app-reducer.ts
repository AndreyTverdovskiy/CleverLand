const SET_LOADER = 'SET_LOADER'
const SET_ERROR_STATUS = 'SET_ERROR_STATUS'
const SET_ERROR_TITLE = 'SET_ERROR_TITLE'


type AppStateType = {
    isLoaded: boolean,
    errorStatus: 'success' | 'error' | null,
    errorTitle: string | null
}

const initialState: AppStateType = {
    isLoaded: true,
    errorStatus: null,
    errorTitle: null
}

export const appReducer = (state = initialState, action: ActionType) => {
    switch (action.type) {
        case SET_LOADER: {
            return {
                ...state,
                isLoaded: action.value
            }
        }


        case SET_ERROR_STATUS:{
            return {
                ...state,
                errorStatus: action.status
            }
        }

        case SET_ERROR_TITLE:{
            return {
                ...state,
                errorTitle: action.title
            }
        }


        default: {
            return state
        }
    }
}

type ActionType =
    SetLoaderAT
    | SetErrorStatusAT
    | SetErrorTitleAT

// Set loader status
type SetLoaderAT = ReturnType<typeof SetLoaderAC>
export const SetLoaderAC = (value: boolean) => ({type: SET_LOADER, value} as const)

// Request status
type SetErrorStatusAT = ReturnType<typeof SetErrorStatusAC>
export const SetErrorStatusAC = (status: 'success' | 'error' | null) => ({type: SET_ERROR_STATUS, status} as const)

type SetErrorTitleAT = ReturnType<typeof SetErrorTitleAC>
export const SetErrorTitleAC = (title: string | null) => ({type: SET_ERROR_TITLE, title} as const)
