import {useState} from 'react';
import {createPortal} from 'react-dom';

import {AuthSelector} from '../../../selectors/selectors';
import {CommentsType} from '../../../store/auth-reducer';
import {CreacteCommentTC, EditCommentTC} from '../../../store/book-reducer';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';

import close_iso from './assets/close.svg'
import {RatingComment} from './rating-comment/rating-comment';

import s from './rate-book.module.scss'

type RateBookPT = {
    toggleRateBook: () => void
    bookIdProps?: string,
    chekCom?: CommentsType | undefined,

}

const portal = document.getElementById('portal') as HTMLElement

export const RateBookModale = ({toggleRateBook,bookIdProps,chekCom}: RateBookPT) => {

    const dispatch = useAppDispatch()

    const [star, setStar] = useState(bookIdProps && chekCom ? chekCom.rating : bookIdProps ? 5 : 0)
    const [comment, setComment] = useState(chekCom?.text ? chekCom?.text : '')


    const {id} = useAppSelector(AuthSelector).userInfo


    const onButtonClick = () => {
        if (bookIdProps && !chekCom) {
            dispatch(CreacteCommentTC(star, comment, bookIdProps, JSON.stringify(id)))
        }
        if (bookIdProps && chekCom) {
            dispatch(EditCommentTC(chekCom.id, star, comment, bookIdProps, id.toString()))
        }
        toggleRateBook()
    }


    return (
        createPortal(
            <div className={s.rateBook} role='presentation' onClick={toggleRateBook} data-test-id='modal-outer'>
                <div className={s.rateBook_modal} role='presentation' data-test-id='modal-rate-book'
                     onClick={e => e.stopPropagation()}>
                    <div className={s.rateBook_modal_title} data-test-id='modal-title'>
                        <h3>Оцените книгу</h3>
                        <div className={s.rateBook_modal_close} role='presentation'
                             onClick={toggleRateBook} data-test-id='modal-close-button'>
                            <img src={close_iso} alt='close modal'/>
                        </div>
                    </div>


                    <div className={s.rateBook_modal_rating}>
                        <h4 className={s.rateBook_modal_rating_title}>Ваша оценка</h4>
                        <RatingComment value={star} setValue={setStar}/>
                    </div>

                    <textarea placeholder='Оставить отзыв' data-test-id='comment'
                              value={comment}
                              onChange={e => setComment(e.target.value)}
                    />


                    <button type='button' onClick={onButtonClick}
                            className={s.rateBook_modal_button}
                            data-test-id='button-comment'
                    >
                        оценить
                    </button>

                </div>

            </div>,
            portal
        )
    )
}
