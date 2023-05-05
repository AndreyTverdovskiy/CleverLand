import React, {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';

import {baseURL} from '../../../../api/api';
import {Rating} from '../../../../components/utils/rating/rating';
import {SearchHighlight} from '../../../../components/utils/search-highlight/search-highlight';
import {AuthSelector} from '../../../../selectors/selectors';
import {BookStateType} from '../../../../store/catalog-reducer';
import {useAppSelector} from '../../../../store/hooks';
import {RefactorDate} from '../../../../utils/refactor-date';
import default_image from '../assets/default_image.jpg'

import s from './catalog-cart.module.scss'


type CatalogCartPT = {
    book: BookStateType
    category?: string,
    searchValue: string,
    toggleBooking: () => void
    setBookId: (id: string) => void
    setBookingId: (id: string) => void
    setDateOrder: (date: string) => void
}

export function CatalogCart({book, category, searchValue, toggleBooking,setBookId, setBookingId, setDateOrder}: CatalogCartPT) {

    const navigate = useNavigate();

    const {id} = useAppSelector(AuthSelector).userInfo

    const highlight = useCallback(
        (title: string) =>
            <SearchHighlight title={title}
                             searchValue={searchValue}
            />
        , [searchValue])


    const onButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        toggleBooking()
        setBookId(JSON.stringify(book.id))
    }

    const EditBooking = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        if (book.booking) {
            toggleBooking()
            setBookId((book.id).toString())
            setBookingId((book.booking.id).toString())
            setDateOrder(book.booking.dateOrder)
        }
    }


    const onCardClick = () => {
        navigate(`/books/${category}/${book.id}`)
    }

    return (
        <div className={s.book}
             role='presentation'
             data-test-id='card'
             onClick={onCardClick}
        >
            <div className={s.book_wrapper}>
                <div className={s.book_cover}>
                    <img
                        src={book.image ? `${book.image.url}` : default_image}
                        alt='book'/>
                </div>

                <div className={s.book_wrapper_1}>
                    <Rating value={book.rating === null ? 0 : book.rating}/>

                    <div className={s.book_name}>
                        <span>{highlight(book.title)}</span>
                    </div>
                    <div>
                        <div
                            className={s.book_author}>{book.authors[0]}, {book.issueYear}</div>
                        <div className={s.book_button}>
                            {
                                book.booking === null && book.delivery === null
                                    ? <button className={s.book_button__free}
                                              type='button'
                                              onClick={onButtonClick}
                                              data-test-id='booking-button'
                                    >
                                        Забронировать
                                    </button>
                                    : book.delivery === null && book.booking
                                        ? book.booking.customerId === id
                                            ? <button type='button'
                                                      onClick={EditBooking}
                                                      className={s.book_button_busy_you}
                                                      data-test-id='booking-button'
                                            >
                                                Забронирована
                                            </button>
                                            : <button type='button'
                                                      onClick={(e) => e.stopPropagation()}
                                                      className={s.book_button_busy}
                                                      data-test-id='booking-button'
                                                      disabled={true}
                                            >
                                                Забронирована
                                            </button>
                                        : book.delivery !== null &&
                                        <button type='button'
                                                onClick={(e) => e.stopPropagation()}
                                                className={s.book_button_busy}
                                                data-test-id='booking-button'
                                                disabled={true}
                                        >
                                            Занята до {RefactorDate(book.delivery.dateHandedTo)}
                                        </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
