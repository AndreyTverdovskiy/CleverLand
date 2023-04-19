import {NavLink, useParams} from 'react-router-dom';

import {categoriesSelector, sortBooksSelector} from '../../../selectors/selectors';
import {useAppSelector} from '../../../store/hooks';

import {ReactComponent as ARR_DOWN} from './assets/arr_down.svg'
import {ReactComponent as ARR_UP} from './assets/arr_up.svg'

import s from './sidebar.module.scss'

type SidebarPT = {
    collapsed: boolean
    setCollapsed: (value: boolean) => void
}


export const Sidebar = ({collapsed,setCollapsed }: SidebarPT) => {
    const {category} = useParams()

    const {categories} = useAppSelector(categoriesSelector)

    const {sortBooks} = useAppSelector(sortBooksSelector)

    const navList = [
        {
            id: 1,
            path: 'books/all',
            title: 'Витрина книг',
            test: 'navigation-showcase',
            subCateg: categories,
        },

        {
            id: 2,
            path: 'terms',
            title: 'Правила пользования',
            test: 'navigation-terms',
        },
        {
            id: 3,
            path: 'agreement',
            title: 'Договор оферты',
            test: 'navigation-contract',
        },


    ]

    const setActive = (isActive: boolean) => isActive ? s.navItem_title_active : s.navItem_title

    const onArrClick = (value: boolean) => {
        setCollapsed(value)
    }


    return (
        <nav className={s.navBlock}>
            <div>
                <ul>
                    {
                        navList.map((navItem) => (
                            <li key={navItem.id} className={s.navItem}>
                                <div className={s.navItem_title}
                                     role="presentation"
                                     data-test-id={navItem.test}
                                     onClick={navItem.subCateg
                                         ? () => onArrClick(!collapsed)
                                         : () => onArrClick(true)
                                     }
                                >
                                    <NavLink to={`/${navItem.path}`}
                                             className={({isActive}) => setActive(isActive)}
                                    >
                                        {navItem.title}
                                    </NavLink>
                                    {
                                        navItem.subCateg
                                            ? collapsed
                                                ? <ARR_DOWN
                                                    fill={category ? 'url(#paint0_linear_13868_2749)' : '#363636'}/>
                                                : <ARR_UP/>
                                            : ''
                                    }
                                </div>
                                {
                                    navItem.subCateg
                                        ? <div
                                            className={collapsed || categories.length === 0 ? s.content_hide : s.content}>
                                            <div className={s.item}>
                                                <NavLink to="/books/all"
                                                         className={category === 'all' ? s.item_title_active : s.item_title}
                                                         data-test-id='navigation-books'
                                                         role="presentation"
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
                                                                     className={categ.path === category ? s.item_title_active : s.item_title}
                                                                     data-test-id={`navigation-${categ.path}`}
                                                                     role="presentation"
                                                            >
                                                                {categ.name}
                                                            </NavLink>
                                                            <span className={s.item_count}
                                                                  data-test-id={`navigation-book-count-for-${categ.path}`}>
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
                </ul>
            </div>
        </nav>
    )
}








