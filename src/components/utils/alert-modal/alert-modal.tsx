import {AppSelector} from '../../../selectors/selectors';
import {SetErrorStatusAC} from '../../../store/app-reducer';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';

import close from './assets/close.svg';
import err from './assets/error.svg';
import success from './assets/success.svg';

import s from './alert-modal.module.scss'



type AlertModalPT = {
    status: 'success' | 'error' | null,
}

export const AlertModal = ({status}:AlertModalPT) => {

    const {errorTitle} = useAppSelector(AppSelector)
    const dispatch = useAppDispatch()

    const onCloseClick = () => {
        dispatch(SetErrorStatusAC(null))
    }

    return (
        <div className={status === 'error' ?s.wrapper : s.wrapper_success} data-test-id='error'>
            <div className={s.container}>
                <div className={s.title_block}>
                    <div className={s.erIco}>
                        <img src={status === 'error'? err : success} alt='error'/>
                    </div>
                    <div className={s.title_block_description}>
                        <span>{errorTitle}</span>
                    </div>

                </div>

                <div className={s.close}
                     data-test-id='alert-close'
                     role='presentation'
                     onClick={onCloseClick}
                >
                    <img src={close} alt='close'/>
                </div>
            </div>
        </div>
    )
}