import {BookStateType} from '../store/catalog-reducer';


export const getFilteredBooks = (books: BookStateType[], isRating: boolean, search: string) => {
    let filteredBooks: BookStateType[]


    filteredBooks = books.filter(({title}) => title.toLowerCase().includes(search.toLowerCase()))

    if (isRating) {
        filteredBooks = filteredBooks.sort((book1: BookStateType, book2: BookStateType) => (
            (book2.rating ?? 0) - (book1.rating ?? 0)
        ))

    } else {
        filteredBooks = filteredBooks.sort((book1: BookStateType, book2: BookStateType) => (
            (book1.rating ?? 0) - (book2.rating ?? 0)
        ))
    }

    return filteredBooks
}

