import {useEffect, useState} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';

import {Agreement} from '../../pages/agreement/agreement';
import {Login} from '../../pages/auth/login/login';
import {PasswordRecovery} from '../../pages/auth/password-recovery/password-recovery';
import {Registration} from '../../pages/auth/registration/registration';
import {Book} from '../../pages/book';
import {MainPage} from '../../pages/main';
import {BookingModal} from '../../pages/main/catalog/booking-modal/booking-modal';
import {Profile} from '../../pages/profile/profile';
import {Terms} from '../../pages/terms/terms';
import {AppSelector, AuthSelector, booksSelector, categoriesSelector,} from '../../selectors/selectors';
import {IsAuthAC, UserInfoTC} from '../../store/auth-reducer';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {SortBookAC} from '../../store/sort-reducer';
import {BlockScroll} from '../../utils/block-scroll';
import {Routs} from '../../utils/routes';
import {Layout} from '../layout/layout';
import {LayoutMainPage} from '../layout/layout-main-page/layout-main-page';
import {Loader} from '../utils/loader/loader';

export const App = () => {

    const dispatch = useAppDispatch()

    const {isLoaded} = useAppSelector(AppSelector)
    const {books, isLoadedBooks} = useAppSelector(booksSelector)
    const {categories} = useAppSelector(categoriesSelector)
    const {isAuth} = useAppSelector(AuthSelector)
    const {errorStatus} = useAppSelector(AppSelector)

    const token = localStorage.getItem('token')


    const [categCollapsed, setCateCollapsed] = useState(false)
    const [bookId, setBookId] = useState('')

    const [bookingId, setBookingId] = useState('')
    const [dateOrder, setDateOrder] = useState('')

    const [bookingModal, setBookingModal] = useState(false)

    const toggleBooking = () => {
        setBookingModal(!bookingModal)
        if (bookingModal) {
            setBookingId('')
            setDateOrder('')
        }
    }


    useEffect(() => {
        if (token) {
            dispatch(UserInfoTC())
        } else {
            dispatch(IsAuthAC(false))
        }
    }, [dispatch, token])

    useEffect(() => {
        if (books.length && categories.length) {
            dispatch(SortBookAC(books, categories))
        }
    }, [dispatch, books, categories])

    useEffect(() => {
        if ((books.length === 0 || categories.length === 0) && errorStatus === 'error') {
            setCateCollapsed(true)
        } else {
            setCateCollapsed(false)
        }
    }, [books.length, categories.length, errorStatus])

    useEffect(() => {
        window.scrollTo(0, 0)
        BlockScroll(bookingModal)
        BlockScroll(!isLoaded)
        BlockScroll(!isLoadedBooks)

    }, [bookingModal, isLoaded, isLoadedBooks])

    return (
        <div style={{position: 'relative'}}>
            {isLoaded ? ''
                : <Loader/>
            }
            {isLoadedBooks  ? ''
                : <Loader/>
            }
            {
                bookingModal
                    ? <BookingModal toggleBooking={toggleBooking}
                                    bookId={bookId}
                                    bookingId={bookingId}
                                    dateOrder={dateOrder}
                    />
                    : ''
            }

            <Routes>

                <Route path={Routs.Initial}
                       element={isAuth ? <Layout/> : (!token || isAuth === false) && <Navigate to={Routs.AUTH}/>}>
                    <Route element={<LayoutMainPage collapsed={categCollapsed}
                                                    setCollapsed={setCateCollapsed}/>}>
                        <Route path='/' element={<Navigate to={Routs.DEFAULT}/>}/>
                        <Route path={Routs.CATEGORY}
                               element={<MainPage toggleBooking={toggleBooking}
                                                  setBookId={setBookId}
                                                  setBookingId={setBookingId}
                                                  setDateOrder={setDateOrder}
                               />}/>
                        <Route path={Routs.TERMS} element={<Terms/>}/>
                        <Route path={Routs.AGREEMENT} element={<Agreement/>}/>
                    </Route>
                    <Route path={Routs.BOOK}
                           element={<Book toggleBooking={toggleBooking}
                                          setBookingId={setBookingId}
                                          setDateOrder={setDateOrder}
                                          setBookId={setBookId}
                           />}/>
                    <Route path={Routs.PROFILE} element={<Profile/>}/>
                </Route>

                <Route path={Routs.AUTH} element={<Login/>}/>
                <Route path={Routs.REGISTRATION} element={<Registration/>}/>
                <Route path={Routs.FORGOT_PASS} element={<PasswordRecovery/>}/>
            </Routes>
        </div>
    )

}


