import {Fragment, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';

import {
    FormDataType, InputMessage,
    InputType
} from '../../../components/utils/custom-input/custom-input.types';
import {AuthSelector} from '../../../selectors/selectors';
import {LoginTC} from '../../../store/auth-reducer';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {InfoModal} from '../info-modal/info-modal';
import arrowIcon from '../registration/assets/arrow.svg'
import eyeClose from '../registration/assets/eyeClose.svg';
import eyeOpen from '../registration/assets/eyeOpen.svg';

import s from './login.module.scss'


export const Login = () => {

    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const {isAuth} = useAppSelector(AuthSelector)
    const {isAuthError} = useAppSelector(AuthSelector) // ошибка по запросу
    const {isAuthResError} = useAppSelector(AuthSelector) // 400


    const [isEyeOpen, setIsEyeOpen] = useState(false);
    const handleSetIsEyeOpen = () => {
        setIsEyeOpen(!isEyeOpen)
    };


    const {
        register,
        formState: { touchedFields, isValid},
        handleSubmit, clearErrors, watch
    } = useForm<FormDataType>({mode: 'onBlur'})

    const valueIdentifier = watch('identifier');
    const valuePassword = watch('password');


    const [emptyValue, setEmptyValue] = useState(false)
    const [emptyValuePas, setEmptyValuePas] = useState(false)

    const disabled = touchedFields.identifier && touchedFields.password && !isValid


    const onSubmit = (data: FormDataType) => {
        dispatch(LoginTC(data))
    }

    const onRegistrClick = () => {
        navigate('/registration')
    }

    const onForgotClick = () => {
        navigate('/forgot-pass')
    }


    useEffect(() => {
        if (isAuth) {
            navigate('/')
        }
    }, [isAuth, navigate])


    return (
        <div className={s.auth} data-test-id='auth'>
            <h3 className={s.title}>Cleverland</h3>
            <div className={s.commonContainer}>
                <div className={s.container}>
                    {
                        isAuthError
                            ? ''
                            : <div className={s.stepContainer}>
                                <h4 className={s.register}>Вход в личный кабинет</h4>
                            </div>
                    }

                    <form onSubmit={handleSubmit(onSubmit)} data-test-id='auth-form'
                          className={s.formContainer}>
                        {
                            isAuthError
                                ? <InfoModal title='Вход не выполнен'
                                             massage='Что-то пошло не так и ваша регистрация не завершилась. Попробуйте ещё раз'
                                             buttonTitle='повторить'
                                             isError={true}
                                             dataTest='status-block'
                                />
                                : <Fragment>
                                    <div className={s.labelContainer}>
                            <span
                                className={valueIdentifier ? `${s.labelFocus} ${s.label}` : s.labelFocus}>Логин</span>
                                        <input
                                            autoComplete="new-password"
                                            type='text'
                                            className={isAuthResError ? `${s.inputCommon} ${s.inputCommonError}` : s.inputCommon}
                                            placeholder="Логин"
                                            onFocus={() => {
                                                clearErrors('identifier')
                                                setEmptyValue(false)
                                            }}
                                            {...register('identifier', {
                                                required: InputMessage.EmptyValue,
                                                onBlur: () => {
                                                    if (valueIdentifier) {
                                                        setEmptyValue(false)
                                                    } else {
                                                        setEmptyValue(true)
                                                    }
                                                }
                                            })}
                                        />
                                    </div>
                                    {emptyValue &&
                                        <div data-test-id='hint'
                                             className={s.helperError}>
                                        <span>
                                            {InputMessage.EmptyValue}
                                        </span>
                                        </div>
                                    }
                                    <div className={`${s.emptyDiv} ${s.emptyDiv_1}`}>{true}</div>
                                    <div className={s.labelContainer}>
                            <span
                                className={valuePassword ? `${s.labelFocus} ${s.label}` : s.labelFocus}>Пароль</span>
                                        <input
                                            autoComplete="new-password"
                                            type={isEyeOpen ? InputType.Text : InputType.Password}
                                            className={isAuthResError ? `${s.inputCommon} ${s.inputCommonError}` : s.inputCommon}
                                            placeholder="Пароль"
                                            onFocus={() => {
                                                clearErrors('password')
                                                setEmptyValuePas(false)
                                            }}
                                            {...register('password', {
                                                required: InputMessage.EmptyValue,
                                                onBlur: () => {
                                                    if (valuePassword) {
                                                        setEmptyValuePas(false)
                                                    } else {
                                                        setEmptyValuePas(true)
                                                    }
                                                }
                                            })}
                                        />
                                        <button
                                            type='button'
                                            className={s.eyeStyles}
                                            onClick={handleSetIsEyeOpen}
                                        >
                                            {valuePassword
                                                ?
                                                isEyeOpen ?
                                                    <img data-test-id='eye-opened' src={eyeOpen}
                                                         alt=''/>
                                                    : <img data-test-id='eye-closed' src={eyeClose}
                                                           alt=''/>
                                                : ''
                                            }
                                        </button>
                                    </div>
                                    {
                                        emptyValuePas
                                            && <div data-test-id='hint'
                                                   className={s.helperError}>
                                        <span>
                                            {InputMessage.EmptyValue}
                                        </span>
                                            </div>
                                    }

                                    {
                                        isAuthResError
                                            ?
                                            <div data-test-id='hint'
                                                 className={s.helperError}>
                                                <span>{InputMessage.LoginError}</span></div>
                                            : ''
                                    }
                                    <div
                                        className={isAuthResError ? s.helperWithError : `${s.helper} ${s.helper_1}`}
                                        role='presentation'
                                        onClick={onForgotClick}
                                    >
                                        {
                                            isAuthResError
                                                ? 'Восстановить?'
                                                : 'Забыли логин или пароль?'
                                        }

                                    </div>
                                    <button disabled={disabled} type='submit'
                                            className={disabled ? `${s.buttonSubmit} ${s.buttonSubmitDisable}` : s.buttonSubmit}>
                                        Вход
                                    </button>
                                </Fragment>
                        }

                    </form>
                    {
                        isAuthError
                            ? ''
                            : <div className={s.enterContainer}>
                                <div className={s.account
                                }>Нет учётной записи?
                                </div>
                                <button
                                    type='button'
                                    className={s.arrow}
                                    onClick={onRegistrClick}
                                >
                                    регистрация
                                    <img src={arrowIcon} alt=''/>
                                </button>
                            </div>
                    }

                </div>
            </div>
        </div>
    )
}
