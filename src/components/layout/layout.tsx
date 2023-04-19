import {Outlet} from 'react-router-dom';

import {Footer} from '../footer/footer';
import {Header} from '../header/header';

import s from './layout.module.scss'



export const Layout = () =>

     (
        <div className={s.wrapper}>
            <Header/>
            <Outlet/>
            <Footer/>
        </div>
    )













