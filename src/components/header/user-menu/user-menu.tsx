import {forwardRef} from 'react';
import {useNavigate} from 'react-router-dom';

import {LogoutAC} from '../../../store/auth-reducer';
import {useAppDispatch} from '../../../store/hooks';

import s from './user-menu.module.scss'

type UserMenuPT = {
    setUserMenuIsActive: (value:boolean) => void

}

export const UserMenu =forwardRef<HTMLDivElement,UserMenuPT>( ({setUserMenuIsActive}, ref) => {

    const dispatch = useAppDispatch()

    const navigate = useNavigate();
    const onLogoutClick = () => {
        dispatch(LogoutAC())
    }

    const onProfileClick = () => {
        navigate('profile')
        setUserMenuIsActive(false)
    }

    return (
        <section className={s.wrapper} ref={ref}>
                <ul className={s.itemBlock}>
                    <li role='presentation' data-test-id='profile-button' onClick={onProfileClick}>Профиль</li>
                    <li role='presentation' data-test-id='exit-button' onClick={onLogoutClick}>Выход
                    </li>
                </ul>
        </section>
    )


}
)