import {Fragment, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {Link, useNavigate} from 'react-router-dom';

import {
    FormDataType,
    InputMessage,
    InputPlaceholder,
    InputType
} from '../../../components/utils/custom-input/custom-input.types';
import {InputPatterns} from '../../../components/utils/custom-input/patterns';
import {
    AuthSelector,
} from '../../../selectors/selectors';
import {ForgotTC} from '../../../store/auth-reducer';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {InfoModal} from '../info-modal/info-modal';
import back from '../password-recovery/assets/back.svg';
import arrowIcon from '../registration/assets/arrow.svg';

import s from '../password-recovery/password-recovery.module.scss';


export const SendEmail = () => {


    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const {isAuth, isLetterSuccess, isLetterError} = useAppSelector(AuthSelector)



    const {

        register,
        formState: {errors, isValid},
        handleSubmit, clearErrors, watch
    } = useForm<FormDataType>({mode:'onBlur'})

    const valueEmail = watch('email');

    const disabled = !isValid

    const [empyValue, setEmpyValue] = useState(false)

    const onSubmitEmail = (data: FormDataType) => {
        dispatch(ForgotTC(data))
    }

    const onRegistrClick = () => {
        navigate('/registration')
    }

    useEffect(() => {
        if (isAuth) {
            navigate('/')
        }
    }, [isAuth, navigate])

    return (
        <form onSubmit={handleSubmit(onSubmitEmail)}
              className={s.formContainer}
              data-test-id='send-email-form'
        >
            {
                isLetterSuccess
                    ? <InfoModal title='Письмо выслано'
                                 massage='Перейдите в вашу почту, чтобы воспользоваться подсказками по восстановлению пароля'
                                 dataTest='status-block'
                    />
                    :
                    <Fragment>
                        <div className={s.recovery_back}>
                            <Link to='/auth'>
                                <img src={back} alt='back arrow'/>
                            </Link>
                            <span className={s.recovery_back_title}>
                                вход в личный кабинет
                            </span>
                        </div>

                        <div className={s.labelContainer}>
                            <span
                                className={valueEmail ? `${s.labelFocus} ${s.label}` : s.labelFocus}>{InputPlaceholder.Email}</span>
                            <input
                                type={InputType.Email}
                                className={errors?.email || isLetterError ? `${s.inputCommon} ${s.inputCommonError}` : s.inputCommon}
                                placeholder={InputPlaceholder.Email}
                                onFocus={() => {
                                    clearErrors('email')
                                }}
                                {...register('email', {
                                    required: InputMessage.EmptyValue,
                                    pattern: {
                                        value: InputPatterns.Email,
                                        message: InputMessage.Email
                                    },
                                    onBlur: () => {
                                        if (valueEmail) {
                                            setEmpyValue(false)
                                        } else {
                                            setEmpyValue(true)
                                        }
                                    }
                                })}
                            />
                        </div>
                        {
                            isLetterError
                                ? <div data-test-id='hint'
                                       className={s.helperError}>error</div>
                                : empyValue
                            ? <div data-test-id='hint'
                                   className={s.helperError}>Поле не может быть пустым</div>
                                :
                                errors.email
                                    ?
                                    <div data-test-id='hint'
                                               className={s.helperError}>{errors.email.message}</div>
                                    : <div data-test-id='hint'
                                           className={s.helper}>{InputMessage.PasswordRecovery}</div>
                        }
                        <button disabled={disabled} type='submit'
                                className={disabled ? `${s.buttonSubmit} ${s.buttonSubmitDisable}` : s.buttonSubmit}>
                            восстановить
                        </button>

                        <div className={s.enterContainer}>
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
                    </Fragment>
            }
        </form>
    )

}
