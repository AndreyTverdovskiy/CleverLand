import {useEffect, useState} from 'react';
import {NavLink, useParams} from 'react-router-dom';

import {Container} from '../../../../components/container/container';
import {categoriesSelector, sortBooksSelector} from '../../../../selectors/selectors';
import {LogoutAC} from '../../../../store/auth-reducer';
import {useAppDispatch, useAppSelector} from '../../../../store/hooks';
import {ReactComponent as ARR_DOWN} from '../assets/arr_down.svg'
import {ReactComponent as ARR_UP} from '../assets/arr_up.svg'

import s from './sidebar-modal.module.scss'

type SidebarModalPT = {
    sideModalIsActive: boolean,
    setSideModalIsActive: (value: boolean) => void,
    setBurgerCollapsed: (value: boolean) => void,
    burgerCollapsed: boolean,
}

export const SidebarModal = ({sideModalIsActive, setSideModalIsActive, setBurgerCollapsed,burgerCollapsed}: SidebarModalPT) => {

    const {category} = useParams()
    const dispatch = useAppDispatch()


    const {categories} = useAppSelector(categoriesSelector)
    const {sortBooks} = useAppSelector(sortBooksSelector)
    const navList = [
        {
            id: 1,
            path: `books/${category}`,
            title: 'Витрина книг',
            test: 'burger-showcase',
            subCateg: categories
        },
        {
            id: 2,
            path: 'terms',
            title: 'Правила пользования',
            test: 'burger-terms',
        },
        {
            id: 3,
            path: 'agreement',
            title: 'Договор оферты',
            test: 'burger-contract',
        },


    ]

    const setActive = (isActive: boolean) => isActive ? s.navItem_title_active : s.navItem_title

    const [activeCateg, setActiveCateg] = useState(1)

    const onNavClick = () => {
        setSideModalIsActive(false)
        document.body.style.overflow = 'auto';
    }
    const onArrClick = (value: boolean, id: number) => {
        setBurgerCollapsed(value)
        setActiveCateg(id)
    }

    const onLogoutClick = () => {
        dispatch(LogoutAC())
    }

    useEffect(() => {
        // BlockScroll(sideModalIsActive)
        if (sideModalIsActive) {
            document.body.style.overflow = 'hidden';
        }
    }, [sideModalIsActive])

    return (
        <Container>
            <section className={sideModalIsActive ? s.wrapper : s.wrapper_hide}
                     role="presentation"
                     onClick={onNavClick}>
                <nav className={s.navBlock} data-test-id='burger-navigation'>
                    <div>
                        <ul>
                            {
                                navList.map((navItem) => (
                                    <li key={navItem.id} className={s.navItem}
                                        role="presentation"
                                        onClick={(e) => e.stopPropagation()}>

                                        <div
                                            className={activeCateg === navItem.id ? s.navItem_title_ablock : s.navItem_title}
                                            role="presentation"
                                            onClick={navItem.subCateg
                                                ? () => onArrClick(!burgerCollapsed, navItem.id)
                                                : () => onArrClick(true, navItem.id)
                                            }>
                                            {/* отображение Пункта меню */}
                                            <NavLink to={`/${navItem.path}`}
                                                     data-test-id={navItem.test}
                                                     className={({isActive}) => setActive(isActive)}
                                                     onClick={navItem.subCateg ? () => {
                                                     } : () => onNavClick()}
                                            >
                                                {navItem.title}
                                            </NavLink>
                                            {/* отобажение стрелки списка */}
                                            {
                                                navItem.subCateg
                                                    ? burgerCollapsed
                                                        ? <ARR_DOWN
                                                            fill={category ? 'url(#paint0_linear_13868_2749)' : '#363636'}/>
                                                        : <ARR_UP/>
                                                    : ''
                                            }
                                        </div>

                                        {/* отображение подкатегорий меню */}
                                        {
                                            navItem.subCateg
                                                ? <div
                                                    className={burgerCollapsed ? s.content_hide : s.content}>
                                                    <div className={s.item}>
                                                        <NavLink to="/books/all"
                                                                 className={category === 'all' ? s.item_title_active : s.item_title}
                                                                 data-test-id='burger-books'
                                                                 role="presentation"
                                                                 onClick={() => onNavClick()}
                                                        >
                                                            Все книги
                                                        </NavLink>
                                                    </div>
                                                    {
                                                        navItem.subCateg.map((categ) => {
                                                            const countBooks = sortBooks[categ.name]
                                                                ? sortBooks[categ.name].length
                                                                : 0

                                                            return (
                                                                <div className={s.item} key={categ.id}>
                                                                    <NavLink to={`/books/${categ.path}`}
                                                                             data-test-id={`burger-${categ.path}`}
                                                                             className={categ.path === category ? s.item_title_active : s.item_title}
                                                                             onClick={() => onNavClick()}>
                                                                        {categ.name}
                                                                    </NavLink>
                                                                    <span className={s.item_count}
                                                                          data-test-id={`burger-book-count-for-${categ.path}`}>
                                                                    {countBooks}
                                                                </span>
                                                                </div>

                                                            )
                                                        })
                                                    }
                                                </div>
                                                : ''
                                        }
                                    </li>
                                ))
                            }
                            <li className={s.navItem}>
                                <NavLink to='/profile'
                                         className={({isActive}) => setActive(isActive)}
                                         data-test-id='profile-button'
                                >
                                    Профиль
                                </NavLink>
                            </li>
                            <li className={s.navItem} role='presentation' data-test-id = 'exit-button' onClick={onLogoutClick}>Выход</li>
                        </ul>
                    </div>
                </nav>
            </section>
        </Container>

    )
}


