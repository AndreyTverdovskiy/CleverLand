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

import s from './catalog-cart-list.module.scss'

type CatalogCartListPT = {
    book: BookStateType
    category?: string
    searchValue: string,
    toggleBooking: () => void
    setBookId: (id: string) => void
    setBookingId: (id: string) => void
    setDateOrder: (date: string) => void
}

export function CatalogCartList({
                                    book,
                                    category,
                                    searchValue,
                                    toggleBooking,
                                    setBookId,
                                    setBookingId,
                                    setDateOrder
                                }: CatalogCartListPT) {

    const highlight = useCallback((title: string) =>
            <SearchHighlight title={title} searchValue={searchValue}/>
        , [searchValue])


    const navigate = useNavigate();
    const {id} = useAppSelector(AuthSelector).userInfo
    const onCardClick = () => {
        navigate(`/books/${category}/${book.id}`)
    }


    const onButtonClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation()
        toggleBooking()
        setBookId(book.id.toString())
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

    return (
        <div className={s.book}
             role='presentation'
             onClick={onCardClick}
        >
            <div className={s.book_wrapper}>
                <div className={s.book_cover}>
                    <img src={book.image ? `${baseURL}${book.image.url}` : default_image} alt='book'/>
                </div>

                <div className={s.book_description}>

                    <div className={s.book_name}>
                        <span>{highlight(book.title)}</span>
                    </div>
                    <div className={s.book_author}>{book.authors[0]}, {book.issueYear}</div>

                    <div className={s.book_description_block}>
                        <Rating value={book.rating === null ? 0 : book.rating}/>
                        <div className={s.book_button}>
                            {
                                book.booking === null && book.delivery === null
                                    ? <div className={s.book_button__free}
                                           aria-hidden='true'
                                           onClick={e => onButtonClick(e)}
                                    >
                                        Забронировать
                                    </div>
                                    : book.delivery === null && book.booking
                                        ? book.booking.customerId === id
                                            ? <button type='button'
                                                      onClick={EditBooking}
                                                      className={s.book_button__busy_you}
                                                      data-test-id='booking-button'
                                            >
                                                Забронирована
                                            </button>
                                            :
                                            <div aria-hidden='true'
                                                 onClick={(e) => e.stopPropagation()}
                                                 className={s.book_button__busy}>
                                                Забронирована
                                            </div>
                                        : book.delivery !== null &&
                                        <div aria-hidden='true'
                                             onClick={(e) => e.stopPropagation()}
                                             className={s.book_button__busy}> Занята
                                            до {RefactorDate(book.delivery.dateHandedTo)}
                                        </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
