import {useEffect, useRef, useState} from 'react';
import {NavLink, useLocation} from 'react-router-dom';

import {baseURL} from '../../api/api';
import {SidebarModal} from '../../pages/main/sidebar/sidebar_modal/sidebar-modal';
import image from '../../pages/profile/assets/def_profile.jpg';
import {AppSelector, bookSelector} from '../../selectors/selectors';
import {GetBooksCatalogTC} from '../../store/catalog-reducer';
import {getCategoriesTC} from '../../store/category-reducer';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {Container} from '../container/container';
import {AlertModal} from '../utils/alert-modal/alert-modal';

import burger from './assets/burger.svg'
import cross_ico from './assets/cross.svg'
import logo from './assets/logo.svg';
import {UserMenu} from './user-menu/user-menu';

import s from './header.module.scss'


export const Header = () => {

    const dispatch = useAppDispatch()
    const location = useLocation()

    const {errorStatus} = useAppSelector(AppSelector)
    const {statusAlert} = useAppSelector(bookSelector)

    const [sideModalIsActive, setSideModalIsActive] = useState(false)

    const [userMenuIsActive, setUserMenuIsActive] = useState(false)

    const [burgerCollapsed, setBurgerCollapsed] = useState(false)

    const userInfo = useAppSelector((state) => state.authData.userInfo)

    const onBurgerClick = () => {
        setSideModalIsActive(!sideModalIsActive)
    }

    const onUserClick = () => {
        setUserMenuIsActive(!userMenuIsActive)
    }

    useEffect(() => {
        dispatch(GetBooksCatalogTC())
    }, [dispatch])

    useEffect(() => {
        if (errorStatus) {
            dispatch(GetBooksCatalogTC())
        }
    }, [dispatch, errorStatus])

    useEffect(() => {
        dispatch(getCategoriesTC())
    }, [dispatch])


    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onClickHandler = (e: any): void => {
            if (!ref.current?.contains(e.target)) {
                setUserMenuIsActive(false);
            }
        };

        if (userMenuIsActive) {
            document.addEventListener('click', onClickHandler);
        } else document.removeEventListener('click', onClickHandler);

        return () => document.removeEventListener('click', onClickHandler);
    }, [userMenuIsActive, dispatch]);

    return (
        <div className={s.wrapper}>
            <Container>
                <header className={s.header}>
                    <div className={s.logo}>
                        <NavLink to="/">
                            <img src={logo} alt='logo'/>
                        </NavLink>
                    </div>

                    <div className={s.burger} role="presentation" onClick={onBurgerClick}
                         data-test-id='button-burger'>
                        <img src={sideModalIsActive ? cross_ico : burger} alt='burger'/>
                        <SidebarModal sideModalIsActive={sideModalIsActive}
                                      setSideModalIsActive={setSideModalIsActive}
                                      burgerCollapsed={burgerCollapsed}
                                      setBurgerCollapsed={setBurgerCollapsed}
                        />
                    </div>


                    <article className={s.title}>
                        <span>{location.pathname === '/profile' ? 'Личный кабинет' : 'Библиотека'}</span>
                    </article>

                    <div className={s.userBlock}>
                        <span>Привет, {userInfo.username}!</span>
                        <img src={userInfo.avatar ? `${baseURL}${userInfo.avatar}` : image}
                             alt='avatar'
                             role='presentation'
                             onClick={(e) => {
                                 e.stopPropagation()
                                 onUserClick()
                             }}
                        />

                        {
                            userMenuIsActive && <UserMenu
                                setUserMenuIsActive={setUserMenuIsActive}
                                ref={ref}
                            />
                        }

                    </div>

                    {
                        errorStatus && statusAlert &&
                        <AlertModal status={errorStatus}/>
                    }
                </header>
            </Container>
        </div>


    )
}



