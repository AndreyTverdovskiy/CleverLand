import {ChangeEvent, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

import {
    booksSelector,
    categoriesSelector,
    sortBooksSelector
} from '../../../selectors/selectors';
import {BookStateType} from '../../../store/catalog-reducer';
import {useAppSelector} from '../../../store/hooks';
import {getFilteredBooks} from '../../../utils/get-filtered-books';

import cross_active from './assets/cross_active.svg'
import gray_lines_icon from './assets/gray_lines.svg'
import gray_square_icon from './assets/gray_square.svg'
import search_icon from './assets/search_icon.svg'
import search_icon_act from './assets/search_icon_act.svg';
import sort_icon_asc from './assets/sort_icon_asc.svg'
import sort_icon_desc from './assets/sort_icon_desc.svg'
import white_lines_icon from './assets/white_lines.svg'
import white_square_icon from './assets/white_square.svg'
import {CatalogCart} from './catalog-cart/catalog-cart';
import {CatalogCartList} from './catalog-cart-list/catalog-cart-list';

import s from './catalog.module.scss'


type CatalogPT = {
    toggleBooking: () => void
    setBookId: (id: string) => void
    setBookingId: (id: string) => void
    setDateOrder: (date: string) => void
}


export const Catalog = ({toggleBooking, setBookId, setBookingId, setDateOrder}: CatalogPT) => {

    const {category} = useParams()

    const {books} = useAppSelector(booksSelector)
    const {sortBooks} = useAppSelector(sortBooksSelector)
    const {categories} = useAppSelector(categoriesSelector)


    const [onSearchClick, setOnSearchClick] = useState(false)
    const [viewMod, setViewMod] = useState(true)

    const [filteredBooks, setFilteredBooks] = useState<BookStateType[]>([])

    const changeView = (view: boolean) => {
        setViewMod(view)
    }

    // search block
    const [searchValue, setSearchValue] = useState('')
    const [isFocused, setIsFocused] = useState(false);

    const toggleSearch = () => onSearchClick ? setOnSearchClick(false) : setOnSearchClick(true)
    const focusSearch = () => {
        setIsFocused(true);
    };
    const blurSearch = () => {
        setIsFocused(false);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value)
    }

    // Sort by rating
    const [isRating, setIsRating] = useState(true)

    const onRatingClick = () => {
        setIsRating(!isRating)
    }

    // select category
    useEffect(() => {
        if (category === 'all') {
            setFilteredBooks(getFilteredBooks(books, isRating, searchValue))
        } else {
            categories.forEach(categ => {
                if (categ.path === category && sortBooks) {
                    setFilteredBooks(getFilteredBooks(sortBooks[categ.name], isRating, searchValue))
                }
            })
        }
    }, [books, categories, category, isRating, searchValue, sortBooks])

    if (filteredBooks.length) {
        return (
            <div className={s.catalog} data-test-id='content'>
                <div className={s.page_tools}>
                    <div className={s.container}>

                        <div className={s.mobile}>
                            <button className={s.mobile_button} type="button"
                                    data-test-id='button-search-open'
                                    onClick={toggleSearch}>
                                <img src={search_icon} alt="search icon"/>
                            </button>

                            <div
                                className={onSearchClick ? s.search_input_block : s.search_input_block_hide}>
                                <input type='text'
                                       placeholder='Поиск книги или автора…'
                                       value={searchValue}
                                       onChange={handleChange}
                                       data-test-id={onSearchClick ? 'input-search' : ''}
                                />
                                <button type='button' className={s.search_input_block_cross}
                                        data-test-id='button-search-close'
                                        onClick={toggleSearch}>
                                    <img src={cross_active} alt='cross icon'/>
                                </button>
                            </div>


                            <button className={s.mobile_button} type="button"
                                    onClick={onRatingClick}>
                                <img src={isRating ? sort_icon_desc : sort_icon_asc}
                                     alt="search icon"/>
                            </button>
                        </div>


                        <div className={s.search_block}>
                            <input type='text'
                                   placeholder='Поиск книги или автора…'
                                   data-test-id={onSearchClick ? '' : 'input-search'}
                                   onFocus={focusSearch}
                                   onBlur={blurSearch}
                                   value={searchValue}
                                   onChange={handleChange}
                            />
                            <div className={s.search_block_logo}>
                                <img src={isFocused ? search_icon_act : search_icon}
                                     alt="search icon"/>
                            </div>
                        </div>

                        <div className={s.sort_block} role="presentation" onClick={onRatingClick}
                             data-test-id='sort-rating-button'>
                            <img src={isRating ? sort_icon_desc : sort_icon_asc} alt='sort icon'/>
                            <span className={s.sort_block_title}>По рейтингу</span>
                        </div>

                    </div>


                    <div className={s.view_block}>
                        <button type="button" data-test-id='button-menu-view-window'
                                className={viewMod ? s.button_active : s.button_disabled}
                                onClick={() => changeView(true)}>
                            <img src={viewMod ? white_square_icon : gray_square_icon} alt=''/>
                        </button>
                        <button type="button" data-test-id='button-menu-view-list'
                                className={viewMod ? s.button_disabled : s.button_active}
                                onClick={() => changeView(false)}>
                            <img src={viewMod ? gray_lines_icon : white_lines_icon} alt=''/>
                        </button>
                    </div>
                </div>


                <div className={viewMod ? s.content_tile : s.content_list}>
                    {
                        viewMod
                            ? filteredBooks.map((book) => (
                                <CatalogCart key={book.id}
                                             book={book}
                                             category={category}
                                             searchValue={searchValue}
                                             toggleBooking={toggleBooking}
                                             setBookId={setBookId}
                                             setBookingId={setBookingId}
                                             setDateOrder={setDateOrder}
                                />
                            ))
                            : filteredBooks.map((book) => (
                                <CatalogCartList key={book.id}
                                                 book={book}
                                                 category={category}
                                                 searchValue={searchValue}
                                                 toggleBooking={toggleBooking}
                                                 setBookId={setBookId}
                                                 setBookingId={setBookingId}
                                                 setDateOrder={setDateOrder}

                                />
                            ))
                    }
                </div>
            </div>
        )
    }


    return (
        <div className={s.catalog}>

            <div className={s.page_tools}>
                <div className={s.container}>

                    <div className={s.mobile}>
                        <button className={s.mobile_button} type="button"
                                data-test-id='button-search-open'
                                onClick={toggleSearch}>
                            <img src={search_icon} alt="search icon"/>
                        </button>

                        <div
                            className={onSearchClick ? s.search_input_block : s.search_input_block_hide}>
                            <input type='text'
                                   placeholder='Поиск книги или автора…'
                                   value={searchValue}
                                   onChange={handleChange}
                            />
                            <button type='button' className={s.search_input_block_cross}
                                    data-test-id='button-search-close'
                                    onClick={toggleSearch}>
                                <img src={cross_active} alt='cross icon'/>
                            </button>
                        </div>


                        <button className={s.mobile_button} type="button" onClick={onRatingClick}>
                            <img src={isRating ? sort_icon_desc : sort_icon_asc} alt="search icon"/>
                        </button>
                    </div>


                    <div className={s.search_block}>
                        <input type='text'
                               placeholder='Поиск книги или автора…'
                               data-test-id='input-search'
                               onFocus={focusSearch}
                               onBlur={blurSearch}
                               value={searchValue}
                               onChange={handleChange}
                        />
                        <div className={s.search_block_logo}>
                            <img src={isFocused ? search_icon_act : search_icon} alt="search icon"/>
                        </div>
                    </div>

                    <div className={s.sort_block} role="presentation" onClick={onRatingClick}
                         data-test-id='sort-rating-button'>
                        <img src={isRating ? sort_icon_desc : sort_icon_asc} alt='sort icon'/>
                        <span className={s.sort_block_title}>По рейтингу</span>
                    </div>

                </div>


                <div className={s.view_block}>
                    <button type="button" data-test-id='button-menu-view-window'
                            className={viewMod ? s.button_active : s.button_disabled}
                            onClick={() => changeView(true)}>
                        <img src={viewMod ? white_square_icon : gray_square_icon} alt=''/>
                    </button>
                    <button type="button" data-test-id='button-menu-view-list'
                            className={viewMod ? s.button_disabled : s.button_active}
                            onClick={() => changeView(false)}>
                        <img src={viewMod ? gray_lines_icon : white_lines_icon} alt=''/>
                    </button>
                </div>
            </div>

            <div className={s.text_block}>
                {
                    searchValue
                        ? <p data-test-id='search-result-not-found'>По запросу <br
                            className={s.text}/>ничего
                            не найдено</p>
                        : <p data-test-id='empty-category'>В этой категории книг <br
                            className={s.text}/>ещё нет</p>
                }
            </div>


        </div>
    )


}





