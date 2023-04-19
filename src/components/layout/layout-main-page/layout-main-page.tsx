import {Outlet} from 'react-router-dom';

import {Sidebar} from '../../../pages/main/sidebar/sidebar';
import {Container} from '../../container/container';

import './layout-main-page.scss'


type LayoutMainPagePT = {
    collapsed: boolean
    setCollapsed: (value: boolean) => void
}

export const LayoutMainPage = ({collapsed,setCollapsed}: LayoutMainPagePT) => (
        <div className='wrapper' data-test-id='main-page'>
            <Container>
                <section className='layoutMainPage'>
                    <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}/>
                    <Outlet/>
                </section>
            </Container>
        </div>
    )















