import {useEffect, useState} from 'react';
import {NavLink} from 'react-router-dom';

import {categoriesSelector} from '../../../selectors/selectors';
import {useAppSelector} from '../../../store/hooks';
import {Container} from '../../container/container';

import s from './bread-crumbs.module.scss'


type PropsType = {
    category?: string,
    name: string,
}

export const BreadCrumbs = ({category, name}: PropsType) => {

    const [categoryName, setCategoryName] = useState('')
    const {categories} = useAppSelector(categoriesSelector)

    useEffect(() => {
        categories.forEach(categ => {
            if (categ.path === category) {
                setCategoryName(categ.name)
            }
            if (category === 'all') {
                setCategoryName('Все книги')
            }
        })
    }, [categories, category])

    return (
        <div className={s.wrapper}>
            <Container>
                <div className={s.list}>
                    <NavLink to={`/books/${category}`} className={s.list}
                             data-test-id='breadcrumbs-link'>{categoryName}</NavLink>
                    <span className={s.list} data-test-id='book-name'>{name}</span>
                </div>
            </Container>
        </div>
    )
}
