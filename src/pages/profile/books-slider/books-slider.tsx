import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Pagination} from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react';

import {baseURL} from '../../../api/api';
import {Rating} from '../../../components/utils/rating/rating';
import {BookType, CommentsType} from '../../../store/auth-reducer';
import {GetBookInfoTC} from '../../../store/book-reducer';
import {useAppDispatch} from '../../../store/hooks';
import default_image from '../../main/catalog/assets/default_image.jpg';

import style from '../../main/catalog/catalog-cart/catalog-cart.module.scss'
import s from './books-sloder.module.scss';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

type BooksSliderPT = {
    books: BookType[],
    comments: CommentsType[],
    setViewCommentModal: (value: boolean) => void,
    setBookId: (bookId: string) => void
    setChekCom: (comment: CommentsType) => void
}

export const BooksSlider = ({books, comments, setViewCommentModal,setBookId,setChekCom}: BooksSliderPT) => {

    const dispatch = useAppDispatch()
    const navigate = useNavigate();

    const onButtonClick = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>,book: BookType, chekCom: CommentsType | undefined) => {
        e.stopPropagation()
        dispatch(GetBookInfoTC(book.id))
        setViewCommentModal(true)
        setBookId(book.id.toString())
        if (chekCom) {
            setChekCom(chekCom)
        }
    }

    const onSlideClick = (book:BookType) => {
        navigate(`/books/all/${book.id.toString()}`)
    }

    return (
        <div>
            <Swiper
                className={s.swiper}
                spaceBetween={30}
                slidesPerView={4}
                pagination={{
                    clickable: true,
                }}
                modules={[Pagination]}
                breakpoints={{
                    320: {
                        pagination: {
                            clickable: true,
                        },
                        slidesPerView: 1,
                    },
                    660: {
                        pagination: {
                            clickable: true,
                        },
                        slidesPerView: 3,
                        spaceBetween: 35,
                    },
                    1133: {
                        pagination: {
                            clickable: true,
                        },
                        slidesPerView: 4,
                    },
                }}
            >
                {
                    books.map((book) => {
                        const chekCom = comments.find((comment) => comment.bookId === book.id)

                        return (
                            <SwiperSlide key={book.id}
                                         data-test-id='history-slide'
                                         onClick={() => onSlideClick(book)}
                            >

                                <div className={`${style.book} ${s.book}`}
                                >
                                    <div className={style.book_wrapper}>
                                        <div className={`${style.book_cover} ${s.imageWrapper}`}
                                        >
                                            <img
                                                src={book.image ? `${baseURL}${book.image}` : default_image}
                                                alt='book'/>
                                        </div>

                                        <div className={style.book_wrapper_1}>
                                            <Rating value={book.rating === null ? 0 : book.rating}/>

                                            <div className={style.book_name}>
                                                <span>{book.title}</span>
                                            </div>
                                            <div>
                                                <div
                                                    className={style.book_author}>{book.authors[0]}, {book.issueYear}</div>
                                                <div className={style.book_button}>

                                                    <button className={chekCom ?style.book_button_busy_you : style.book_button__free}
                                                            type='button'
                                                            onClick={(e) => onButtonClick(e,book, chekCom)}
                                                            data-test-id='history-review-button'
                                                    >
                                                        {
                                                            chekCom
                                                                ? 'изменить оценку'
                                                                : 'оставить отзыв'
                                                        }
                                                    </button>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </SwiperSlide>
                        )


                    })
                }


            </Swiper>
        </div>
    )
}