import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {baseURL} from '../../../api/api';
import {Rating} from '../../../components/utils/rating/rating';
import {BookType} from '../../../store/auth-reducer';
import {RemoveBookingTC} from '../../../store/book-reducer';
import {useAppDispatch} from '../../../store/hooks';
import {checkIsBookingActive} from '../../../utils/check-is-booking-active';
import default_image from '../../main/catalog/assets/default_image.jpg';

import s from './book-list.module.scss';

type BookListPT = {
    booking?: {
        id: number | null,
        order: boolean | null,
        dateOrder: string | Date | null,
        book: BookType | null
    },
    delivery?: {
        book: BookType | null
        dateHandedFrom: string | null
        dateHandedTo: string | null
        handed: boolean | null
        id: number | null
    }

}
export const BookList = ({booking,delivery}: BookListPT) => {

    const dispatch = useAppDispatch()
    const navigate = useNavigate();

    const [dateTo, setDateTo] = useState('')

    const [isBooking, setIsBooking] = useState(true)
    const [isDelivery, setIsDelivery] = useState(true)


    const cancellationClick = (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation()
        if (booking && booking.id) {
            window.scrollTo(0, 0)
            dispatch(RemoveBookingTC((booking.id).toString()))
        }
    }

    const onBookClick = () => {
        if(booking && booking.book){
            navigate(`/books/all/${booking.book.id.toString()}`)
        }
        if(delivery && delivery.book){
            navigate(`/books/all/${delivery.book.id.toString()}`)
        }
    }

    

    useEffect(() => {
        if (delivery && delivery.dateHandedTo) {
            const date = new Date(delivery.dateHandedTo);
            const day = new Intl.DateTimeFormat('ru', {day: '2-digit'}).format(date);
            const month = new Intl.DateTimeFormat('ru', {month: '2-digit'}).format(date);

            setDateTo(`${day}.${month}`)
        }

    }, [delivery])


    useEffect(() => {
        if (booking && booking.dateOrder) {

            const dateOrd = new Date(booking.dateOrder)
            const isBookingActive = checkIsBookingActive(dateOrd)

            setIsBooking(isBookingActive)
        }
    }, [booking])

    useEffect(() => {
        if (delivery && delivery.dateHandedTo) {

            const dateOrd = new Date(delivery.dateHandedTo)
            const isDeliveryActive = checkIsBookingActive(dateOrd)

            setIsDelivery(isDeliveryActive)
        }
    }, [delivery])




    return (

        <div className={s.book} data-test-id='card' role='presentation' onClick={onBookClick}>
            {
                booking?.book &&
                <div className={s.book_wrapper}>
                    <div className={s.book_cover}>
                        <img
                            src={booking.book.image ? `${baseURL}${booking.book.image}` : default_image}
                            alt='book'/>
                    </div>

                    <div className={s.book_description}>

                        <div className={s.book_name}>
                            <span>{booking.book.title}</span>
                        </div>
                        <div
                            className={s.book_author}>{booking.book.authors[0]}, {booking.book.issueYear}</div>

                        <div className={s.book_description_block}>
                            <Rating
                                value={booking.book.rating === null ? 0 : booking.book.rating}/>
                            <div className={s.book_button}>
                                <div className={s.book_button__free}
                                     aria-hidden='true'
                                     onClick={(e) => cancellationClick(e)}
                                     data-test-id='cancel-booking-button'
                                >
                                    Отменить бронь
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        isBooking
                            ? ''
                            : <div className={s.cancelBooking} data-test-id='expired'>
                                <div className={s.cancelBooking_title}>Дата бронирования <wbr/>книги истекла</div>
                                <div className={s.cancelBooking_description}>Через 24 часа книга будет доступна всем</div>
                            </div>
                    }
                </div>
            }


            {
                delivery?.book &&
                <div className={s.book_wrapper}>
                    <div className={s.book_cover}>
                        <img
                            src={delivery.book.image ? `${baseURL}${delivery.book.image}` : default_image}
                            alt='book'/>
                    </div>

                    <div className={s.book_description}>

                        <div className={s.book_name}>
                            <span>{delivery.book.title}</span>
                        </div>
                        <div
                            className={s.book_author}>{delivery.book.authors[0]}, {delivery.book.issueYear}</div>

                        <div className={s.book_description_block}>
                            <Rating
                                value={delivery.book.rating === null ? 0 : delivery.book.rating}/>
                            <div className={s.dateTo}>
                                возврат {dateTo}
                            </div>
                        </div>
                    </div>
                    {
                        isDelivery
                            ? ''
                            : <div className={s.cancelBooking} data-test-id='expired'>
                                <div className={s.cancelBooking_title}>Вышел срок пользования книги </div>
                                <div className={s.cancelBooking_description}>Верните книгу, пожалуйста</div>
                            </div>
                    }
                </div>
            }
        </div>
    )
}
