import {ChangeEvent, useEffect, useState} from 'react';

import {baseURL} from '../../api/api';
import {Container} from '../../components/container/container';
import {AppSelector, AuthSelector} from '../../selectors/selectors';
import {CommentsType, UserInfoTC} from '../../store/auth-reducer';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {UploadPhotoTC} from '../../store/profile-reducer';
import {BlockScroll} from '../../utils/block-scroll';
import {RateBookModale} from '../book/rate-book/rate-book-modale';

import camera from './assets/camera.svg'
import image from './assets/def_profile.jpg'
import {BookList} from './book-list/book-list';
import {BooksSlider} from './books-slider/books-slider';
import {InfoBlock} from './info-block/info-block';
import {UserInfo} from './user-info/user-info';

import s from './profile.module.scss'

export const Profile = () => {

    const {userInfo} = useAppSelector(AuthSelector)
    const {errorStatus} = useAppSelector(AppSelector)

    const dispatch = useAppDispatch()

    const [viewCommentModal, setViewCommentModal] = useState(false)
    // comment flow
    const [bookId, setBookId] = useState('')
    const [chekCom, setChekCom] = useState<CommentsType | undefined>()

    const toggleRateBook = () => {
        setViewCommentModal(!viewCommentModal)
    }


    const addPhoto = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const formData = new FormData()

            formData.append('files', file)

            dispatch(UploadPhotoTC(userInfo.id, formData))

        }
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        BlockScroll(viewCommentModal)

    }, [userInfo, viewCommentModal])

    useEffect(() => {
        if (errorStatus) {
            dispatch(UserInfoTC())
        }
    }, [dispatch, errorStatus])

    useEffect(() => {
        dispatch(UserInfoTC())
    }, [dispatch])


    return (
        <div className={s.wrapper}>
            <Container>
                {
                    viewCommentModal
                        ? <RateBookModale toggleRateBook={toggleRateBook}
                                          bookIdProps={bookId}
                                          chekCom={chekCom}
                        />
                        : ''
                }
                {
                    userInfo.id &&
                    <div className={s.profile}>
                        <div className={s.profile_title} data-test-id='profile-avatar'>
                            <div className={s.profile_title_photo} aria-hidden='true'>
                                <img src={userInfo.avatar ? `${baseURL}${userInfo.avatar}` : image}
                                     alt='profile'/>
                                <input
                                    className={s.profile_title_photo_upload}
                                    type="file"
                                    accept="image/*"
                                    multiple={false}
                                    onChange={addPhoto}
                                    id="formElem"
                                />
                                <div className={s.profile_title_photo_add}>
                                    <img src={camera} alt='camera'/>
                                </div>
                            </div>
                            <div className={s.profile_title_name}>
                                <span>{userInfo.lastName}</span>
                                <span>{userInfo.firstName}</span>
                            </div>
                        </div>

                        {/* Учетные данные */}
                        <div className={s.profile_data}>
                            <div className={s.profile_data_header}>
                                <div className={s.profile_data_header_title}>Учётные данные</div>
                                <div className={s.profile_data_header_description}>Здесь вы можете
                                    отредактировать информацию о себе
                                </div>
                            </div>

                            <UserInfo/>

                        </div>

                        {/* Блоки с информацией */}
                        {/* Бронирвоание */}
                        <div className={s.profile_info}>
                            <div className={s.profile_info_header}>
                                <div className={s.profile_info_header_title}>Забронированная книга</div>
                                <div className={s.profile_info_header_description}>
                                    Здесь вы можете просмотреть забронированную книгу, а так же отменить
                                    бронь
                                </div>
                            </div>
                            {
                                userInfo.booking.id === null
                                    ? <div className={s.profile_info_content} data-test-id='empty-blue-card'>
                                        Забронируйте книгу <wbr/> и она отобразится
                                    </div>
                                    : <BookList booking={userInfo.booking}/>
                            }
                        </div>

                        {/* Книга на руках */}
                        <div className={s.profile_info}>
                            <div className={s.profile_info_header}>
                                <div className={s.profile_info_header_title}>Книга которую взяли</div>
                                <div className={s.profile_info_header_description}>
                                    Здесь можете просмотреть информацию о книге и узнать сроки возврата
                                </div>
                            </div>
                            {
                                userInfo.delivery.id === null
                                    ? <div className={s.profile_info_content} data-test-id='empty-blue-card'>
                                        Прочитав книгу, <wbr/>она отобразится в истории
                                    </div>
                                    : <BookList delivery={userInfo.delivery}
                                    />
                            }
                        </div>


                        {/* История */}
                        <div className={s.profile_info} data-test-id='history'>
                            <div className={s.profile_info_header}>
                                <div className={s.profile_info_header_title}>История</div>
                                <div className={s.profile_info_header_description}>
                                    Список прочитанных книг
                                </div>
                            </div>
                            {
                                userInfo.history.id === null
                                    ? <div className={s.profile_info_content} data-test-id='empty-blue-card'>
                                        Вы не читали книг <wbr/>из нашей библиотеки
                                    </div>
                                    : userInfo.history.books &&
                                    <BooksSlider books={userInfo.history.books}
                                                 comments={userInfo?.comments || []}
                                                 setViewCommentModal={setViewCommentModal}
                                                 setBookId={setBookId}
                                                 setChekCom={setChekCom}
                                    />


                            }
                        </div>


                    </div>
                }

            </Container>
        </div>

    )
}
