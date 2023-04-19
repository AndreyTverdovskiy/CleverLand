import {RootState} from '../store/store';


export const AppSelector = (state:RootState) => state.appData
export const bookSelector = (state:RootState) => state.bookData
export const booksSelector = (state:RootState) => state.catalogData
export const categoriesSelector = (state:RootState) => state.categoryData
export const sortBooksSelector = (state:RootState) => state.sortData

export const AuthSelector = (state:RootState) => state.authData



