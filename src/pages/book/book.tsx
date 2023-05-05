import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

import {baseURL} from '../../api/api';
import {Container} from '../../components/container/container';
import {BreadCrumbs} from '../../components/utils/bread-crumbs/bread-crumbs';
import {Loader} from '../../components/utils/loader/loader';
import {Rating} from '../../components/utils/rating/rating';
import {BookSwiper} from '../../components/utils/swiper/book-swiper';
import {
    AppSelector, AuthSelector,
    bookSelector
} from '../../selectors/selectors';
import {CommentsType} from '../../store/auth-reducer';
import {ClearBookStateAC, GetBookInfoTC} from '../../store/book-reducer';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {BlockScroll} from '../../utils/block-scroll';
import {RefactorDate} from '../../utils/refactor-date';
import default_image from '../main/catalog/assets/default_image.jpg'

import arrow_swg from './assets/arrow.svg'
import {RateBookModale} from './rate-book/rate-book-modale';
import {Review} from './review/review';

import s from './book.module.scss'


type BookPT = {
    toggleBooking: () => void
    setBookId: (id: string) => void
    setBookingId: (id: string) => void
    setDateOrder: (date: string) => void
}

export const Book = ({toggleBooking, setBookId, setBookingId, setDateOrder}: BookPT) => {

        const {bookId, category} = useParams()

        const dispatch = useAppDispatch()

        const {isBookLoaded} = useAppSelector(bookSelector)
    
        const {bookInfo} = useAppSelector(bookSelector)

        const {id} = useAppSelector(AuthSelector).userInfo

        const {errorStatus} = useAppSelector(AppSelector)

        const information = [
            {
                title: 'Издательство',
                value: bookInfo.publish || ''
            },
            {
                title: 'Год издания',
                value: bookInfo.issueYear || ''
            },
            {
                title: 'Страниц',
                value: bookInfo.pages || ''
            },
            {
                title: 'Переплёт',
                value: bookInfo.cover || ''
            },
            {
                title: 'Формат',
                value: bookInfo.format || ''
            },
            {
                title: 'Жанр',
                value: bookInfo.categories || ''
            },
            {
                title: 'Вес',
                value: `${bookInfo.weight}г.`
            },
            {
                title: 'ISBN',
                value: bookInfo.ISBN || ''
            },
            {
                title: 'Изготовитель',
                value: bookInfo.producer || ''
            },
        ]

        // Отображение комментариев в книге
        const [reviewMod, setReviewMod] = useState(true)

        const [rateBook, setRateBook] = useState(false)

        const [chekCom, setChekCom] = useState<CommentsType | undefined>()


        const toggleRateBook = () => {
            setRateBook(!rateBook)
        }

        const toggleReview = () => {
            setReviewMod(!reviewMod)
        }


        const onButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.stopPropagation()
            if (bookId) {
                toggleBooking()
                setBookId(bookId)
            }

        }

        const EditBooking = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.stopPropagation()
            if (bookInfo.booking && bookId) {
                toggleBooking()
                setBookId(bookId)
                setBookingId(bookInfo.booking.id.toString())
                setDateOrder(bookInfo.booking.dateOrder)
            }
        }

        // Проверка на существующий коммент
        useEffect(() => {
            setChekCom(undefined)
            if (bookInfo.comments) {
                const userComment = bookInfo.comments.find((comment) => comment.user.commentUserId === id)

                if (userComment) {
                    setChekCom({
                        bookId: bookInfo.id,
                        id: userComment.id,
                        rating: userComment.rating,
                        text: userComment.text,
                    })
                }
            }
        }, [bookInfo.comments, bookInfo.id, id])

        useEffect(() => {
            dispatch(ClearBookStateAC())
            dispatch(GetBookInfoTC(Number(bookId)))
        }, [bookId, dispatch])

        useEffect(() => {
            if (errorStatus) {
                dispatch(GetBookInfoTC(Number(bookId)))
            }
        }, [dispatch, bookId, errorStatus])
    


        useEffect(() => {
            window.scrollTo(0, 0)
            BlockScroll(rateBook)
        }, [rateBook])

        return (

            <section className={s.wrapper}>
                {isBookLoaded ? ''
                    : <Loader/>
                }
                {
                    rateBook
                        ? <RateBookModale toggleRateBook={toggleRateBook}
                                          bookIdProps={bookInfo.id.toString()}
                                          chekCom={chekCom}
                        />
                        : ''
                }

                <BreadCrumbs category={category}
                             name={errorStatus === null && bookInfo.id !== 0 ? bookInfo.title : ''}
                />
                {
                    errorStatus === null && bookInfo.id === 0
                        ? ''
                        : bookInfo.id !== 0 && <Container>
                        <div className={s.book}>
                            <div className={s.book_image}>
                                {
                                    bookInfo.images !== null && bookInfo.images !== undefined && bookInfo.images.length > 2
                                        ? <BookSwiper images={bookInfo.images}/>
                                        : <img
                                            src={bookInfo.images !== null && bookInfo.images !== undefined && bookInfo.images.length === 1 ? `${bookInfo.images[0].url}` : default_image}
                                            alt='img'/>
                                }
                            </div>

                            <div className={s.book_description}>

                                <div className={s.book_description__title}>
                                    <span data-test-id='book-title'>{bookInfo.title}</span>
                                </div>

                                <div className={s.book_description__author}>
                                    <span>{bookInfo.authors} {bookInfo.issueYear}</span>
                                </div>

                                {
                                    bookInfo.booking === null && bookInfo.delivery === null
                                        ? <button className={s.book_description_button_free}
                                                  type='button'
                                                  onClick={onButtonClick}
                                                  data-test-id='booking-button'
                                        >
                                            Забронировать
                                        </button>
                                        : bookInfo.delivery === null && bookInfo.booking
                                            ? bookInfo.booking.customerId === id
                                                ? <button type='button'
                                                          onClick={EditBooking}
                                                          className={s.book_description_button_busy_you}
                                                          data-test-id='booking-button'
                                                >
                                                    Забронирована
                                                </button>
                                                : <button type='button'
                                                          onClick={(e) => e.stopPropagation()}
                                                          className={s.book_description_button_busy}
                                                          disabled={true}
                                                          data-test-id='booking-button'


                                                >
                                                    Забронирована
                                                </button>
                                            : bookInfo.delivery !== null &&
                                            <button type='button'
                                                    onClick={(e) => e.stopPropagation()}
                                                    className={s.book_description_button_busy}
                                                    data-test-id='booking-button'
                                                    disabled={true}
                                            >
                                                Занята
                                                до {RefactorDate(bookInfo.delivery.dateHandedTo)}
                                            </button>
                                }

                                <div className={s.book_description__about}>
                                    <div className={s.block_title}>
                                        <span>О книге</span>
                                    </div>
                                    <div className={s.book_description__about__text}>
                                        <span>{bookInfo.description}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={s.book_description__about_mobile}>
                            <div className={s.block_title}>
                                <span>О книге</span>
                            </div>
                            <div className={s.book_description__about__text}>
                                <span>{bookInfo.description}</span>
                            </div>
                        </div>
                        <div className={s.rating}>
                            <div className={s.block_title}>
                                <span>Рейтинг</span>
                            </div>
                            <div className={s.rating_block}>
                                <Rating value={bookInfo.rating}/>
                                <span>{bookInfo.rating}</span>
                            </div>
                        </div>
                        <div className={s.information}>
                            <div className={s.block_title}>
                                <span>Подробная информация</span>
                            </div>

                            <div className={s.information_block}>

                                <div className={s.information_block__item}>
                                    {
                                        information && information.slice(0, information.length / 2).map((char) => (

                                            <div className={s.information_block__item_row}
                                                 key={char.title}>
                                                <div className={s.block}>
                                                    <span className={s.title}>{char.title}</span>
                                                </div>
                                                <div className={s.block}>
                                                    <span className={s.value}>{char.value}</span>
                                                </div>

                                            </div>
                                        ))
                                    }
                                </div>

                                <div className={s.information_block__item}>
                                    {
                                        information && information.slice(information.length / 2).map((char) => (

                                            <div className={s.information_block__item_row}
                                                 key={char.title}>
                                                <div className={s.block}>
                                                    <span className={s.title}>{char.title}</span>
                                                </div>
                                                <div className={s.block}>
                                                    <span className={s.value}>{char.value}</span>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>

                            </div>
                        </div>
                        <div className={s.reviews}>

                            <div className={s.reviews_title}>
                                <div className={s.block_title}>
                                    <div className={s.reviews_title_info}>
                                        <span>Отзывы</span>
                                        <span className={s.reviews_title_info_count}>
                                                {bookInfo.comments !== null && bookInfo.comments !== undefined &&
                                                    bookInfo.comments.length}
                                            </span>
                                    </div>
                                    {
                                        bookInfo.comments
                                            ? <div data-test-id='button-hide-reviews'
                                                   className={reviewMod ? s.arrow_toggle : s.arrow}
                                                   role="presentation" onClick={toggleReview}>
                                                <img src={arrow_swg} alt='arrow'/>
                                            </div>
                                            : ''
                                    }
                                </div>
                            </div>

                            <div data-test-id='reviews'>
                                {reviewMod && bookInfo.comments !== null && bookInfo.comments !== undefined &&
                                    bookInfo.comments.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1).map((review) => (
                                        <Review key={review.id}
                                                name={review.user.firstName}
                                                lastName={review.user.lastName}
                                                image={review.user.avatarUrl}
                                                comment={review.text}
                                                date={review.createdAt} rating={review.rating}/>
                                    ))
                                }
                            </div>
                            <div className={s.button}>
                                <button type='button' className={chekCom ? s.button__busy : s.button__free}
                                        data-test-id='button-rate-book'
                                        onClick={toggleRateBook}
                                >
                                    {
                                        chekCom ? 'изменить оценку' : 'оценить книгу'
                                    }

                                </button>
                            </div>
                        </div>
                    </Container>
                }

            </section>
        )
    }

;
