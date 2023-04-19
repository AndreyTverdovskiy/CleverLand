import {BookStateType} from './catalog-reducer';
import {CategoryType} from './category-reducer';

const SORT_BOOKS = 'SORT_BOOKS'

type SortBootType = {
    [key: string]: BookStateType[]
}

const initialState = {
    sortBooks: {} as SortBootType
}

export const sortReducer = (state = initialState, action: ActionsType) => {
    switch (action.type) {
        case SORT_BOOKS: {
            return {
                ...state,
                sortBooks: {...action.payload.sortBooks}
            }
        }

        default: {
            return state
        }
    }

}


type ActionsType = SortBookAT
type SortBookAT = ReturnType<typeof SortBookAC>
export const SortBookAC = (books: BookStateType[], categories: CategoryType[]) => {
    const sortCategories= categories.reduce((acc:SortBootType, el) => {
        const property = el.name

        acc[property] = []

        return acc
    }, {});

    const sortBooks = books.reduce((acc:SortBootType, el) => {
        el.categories?.map(category => acc[category].push(el))

        return acc
    }, sortCategories)

    return ({type: SORT_BOOKS, payload:{sortBooks}} as const)
}



