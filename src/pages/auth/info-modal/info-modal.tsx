import {Link} from 'react-router-dom';

import { isRegistrationResErrorAC} from '../../../store/auth-reducer';
import {useAppDispatch} from '../../../store/hooks';

import s from './info-modal.module.scss'


type InfoModalPT = {
    title: string
    massage: string
    buttonTitle?: string
    isError?: boolean,
    path?: string,
    dataTest?:string,
}


export const InfoModal = ({title,massage,buttonTitle,isError,path,dataTest}: InfoModalPT) => {
    const dispatch = useAppDispatch()

    const onReset = () => {

        dispatch(isRegistrationResErrorAC(false))
    }


    return (
        <div className={s.info} data-test-id ={dataTest}>
            <span className={s.info_title}>{title}</span>
            <span className={s.info_massage}>{massage}</span>
            {
                buttonTitle
                    ?
                    isError
                        ? <input className={s.submit} type='submit'
                                 value={buttonTitle}/>
                        : path
                            ?

                            <button type='button' className={s.submit}  onClick={onReset}>
                                <Link to={path}>
                                    {buttonTitle}
                                </Link>
                            </button>
                            : ''
                    : ''
            }


        </div>


    )
}
