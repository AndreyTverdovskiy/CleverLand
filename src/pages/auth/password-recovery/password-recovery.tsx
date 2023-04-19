import {Fragment, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useLocation, useNavigate} from 'react-router-dom';

import {
    FormDataType,
    InputMessage, InputPlaceholder,
    InputType
} from '../../../components/utils/custom-input/custom-input.types';
import {AuthSelector} from '../../../selectors/selectors';
import {ResetTC} from '../../../store/auth-reducer';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {InfoModal} from '../info-modal/info-modal';
import eyeClose from '../registration/assets/eyeClose.svg';
import eyeOpen from '../registration/assets/eyeOpen.svg';
import success from '../registration/assets/success.svg';
import {SendEmail} from '../send-email/send-email';
import {passwordUtils} from '../utils/password-utils';

import s from './password-recovery.module.scss'


export const PasswordRecovery = () => {

    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const location = useLocation()


    const {isAuth, resetPasswordError, isResetPasswordSuccess, isLetterSuccess} = useAppSelector(AuthSelector)


    const query = new URLSearchParams(location.search);
    const code = query.get('code')

    const {
        register,
        formState: {errors},
        handleSubmit, clearErrors, watch, setError,
    } = useForm<FormDataType>({mode: 'onBlur'})


    const valuePassword = watch('password');
    const valuePasswordConfirmation = watch('passwordConfirmation');

    const disabled = !!errors.password || !!errors.passwordConfirmation

    const [comparePassword, setPasswordCompare] = useState<string[]>
    (['lengthComplete', 'upperCaseComplete', 'numberComplete']);


    const [isEyeOpen, setIsEyeOpen] = useState(false);
    const [isEyeOpen2, setIsEyeOpen2] = useState(false);

    const [emptyValue, setEmptyValue] = useState(false)


    const handleSetIsEyeOpen = () => {
        setIsEyeOpen(!isEyeOpen)
    };

    const handleSetIsEyeOpen2 = () => {
        setIsEyeOpen2(!isEyeOpen2)
    };

    const onSubmitPassword = (data: FormDataType,) => {
        if (code) {
            dispatch(ResetTC(data, code))
        }
    }

    useEffect(() => {
        const subscription = watch((value, {name}) => {

            const {password} = value

            if (name === 'password' && password) {
                setPasswordCompare(passwordUtils(password))
            }

            return () => subscription.unsubscribe()
        })
    }, [watch]);


    useEffect(() => {
        if (isAuth) {
            navigate('/')
        }
    }, [isAuth, navigate])

    return (
        <div className={s.wrapper} data-test-id='auth'>
            <h3 className={s.title}>Cleverland</h3>
            <div className={s.commonContainer}>
                <div className={s.container}
                     style={code || isLetterSuccess || isResetPasswordSuccess ? {paddingTop: 0} : {paddingTop: '56px'}}>
                    {
                        !resetPasswordError && !isResetPasswordSuccess && !isLetterSuccess &&
                        <div className={s.stepContainer}>
                            <h4 className={s.register}>Восстановление пароля</h4>
                        </div>
                    }
                    {
                        code
                            ?
                            <form onSubmit={handleSubmit(onSubmitPassword)}
                                  data-test-id='reset-password-form'
                                  className={s.formContainer}
                            >
                                {resetPasswordError
                                    ? <InfoModal title='Данные не сохранились'
                                                 massage='Что-то пошло не так. Попробуйте ещё раз'
                                                 buttonTitle='повторить'
                                                 isError={true}
                                                 dataTest='status-block'
                                    />
                                    : isResetPasswordSuccess
                                        ? <InfoModal title='Новые данные сохранены'
                                                     massage='Зайдите в личный кабинет, используя свои логин и новый пароль'
                                                     buttonTitle='вход'
                                                     isError={false}
                                                     path='/auth'
                                                     dataTest='status-block'
                                        />
                                        : <Fragment>
                                            {/* 1 */}
                                            <div className={s.labelContainer}>
                                                <span
                                                    className={valuePassword ? `${s.labelFocus} ${s.label}` : s.labelFocus}>
                                                    {InputPlaceholder.Password}
                                                </span>
                                                <input
                                                    autoComplete="new-password"
                                                    type={isEyeOpen ? InputType.Text : InputType.Password}
                                                    className={errors?.password ? `${s.inputCommon} ${s.inputCommonError}` : s.inputCommon}
                                                    placeholder={InputPlaceholder.Password}
                                                    onFocus={() => {
                                                        clearErrors('password')
                                                        setEmptyValue(false)
                                                    }}
                                                    {...register('password', {
                                                        pattern: {
                                                            value: /(?=.*[A-ZА-Я])(?=.*[0-9])[a-zA-Zа-яА-Я0-9]{8,}/,
                                                            message: InputMessage.Password
                                                        },
                                                        onBlur: () => {
                                                            if (valuePassword) {
                                                                setEmptyValue(false)
                                                            } else {
                                                                setEmptyValue(true)
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
                                                            <img data-test-id='eye-opened'
                                                                 src={eyeOpen} alt=''/>
                                                            : <img data-test-id='eye-closed'
                                                                   src={eyeClose} alt=''/>
                                                        : ''
                                                    }
                                                </button>
                                                {valuePassword && !errors.password && comparePassword.length === 3 &&
                                                    <img src={success}
                                                         className={s.successPassword}
                                                         data-test-id='checkmark'
                                                         alt=''/>}
                                            </div>
                                            {errors?.password
                                                ?
                                                <div data-test-id='hint'
                                                     className={s.helperError}>{InputMessage.Password}</div>
                                                : emptyValue
                                                    ? <div data-test-id='hint'
                                                           className={s.helperError}>{InputMessage.EmptyValue}</div>
                                                    :
                                                    comparePassword.length < 3 ?
                                                        <div data-test-id='hint'
                                                             className={s.helper}>
                                                            Пароль <span data-test-id='hint'
                                                                         className={comparePassword[0] === 'lengthComplete' ? '' : s.red}>не менее 8 символов</span>,
                                                            с <span data-test-id='hint'
                                                                    className={comparePassword[0] === 'upperCaseComplete' || comparePassword[1] === 'upperCaseComplete' ? '' : s.red}>заглавной буквой</span> и <span
                                                            data-test-id='hint'
                                                            className={comparePassword[0] === 'numberComplete' || comparePassword[1] === 'numberComplete' ? '' : s.red}>цифрой</span>
                                                        </div>
                                                        : <div data-test-id='hint'
                                                               className={s.helper}>{InputMessage.Password}</div>

                                            }

                                            {/* 2 */}

                                            <div className={s.labelContainer}>
                            <span
                                className={valuePasswordConfirmation ? `${s.labelFocus} ${s.label}` : s.labelFocus}>{InputPlaceholder.Password}</span>
                                                <input
                                                    autoComplete="new-password"
                                                    type={isEyeOpen2 ? InputType.Text : InputType.Password}
                                                    className={errors?.passwordConfirmation ? `${s.inputCommon} ${s.inputCommonError}` : s.inputCommon}
                                                    placeholder={InputPlaceholder.Password}
                                                    onFocus={() => {
                                                        clearErrors('passwordConfirmation')
                                                    }}
                                                    {...register('passwordConfirmation', {
                                                        required: InputMessage.EmptyValue,
                                                        validate: value => value === valuePassword,
                                                        onBlur: () => {
                                                            if (!valuePasswordConfirmation) {
                                                                setError('passwordConfirmation', {
                                                                    type: 'onBlur',
                                                                    message: InputMessage.EmptyValue
                                                                })
                                                            }
                                                            if (valuePassword !== valuePasswordConfirmation) {
                                                                setError('passwordConfirmation', {
                                                                    type: 'onBlur',
                                                                    message: InputMessage.PasswordConfirmation
                                                                })
                                                            }
                                                        }
                                                    })}
                                                />
                                                <button
                                                    type='button'
                                                    className={s.eyeStyles}
                                                    onClick={handleSetIsEyeOpen2}
                                                >
                                                    {valuePasswordConfirmation
                                                        ?

                                                        isEyeOpen2 ?
                                                            <img data-test-id='eye-opened'
                                                                 src={eyeOpen} alt=''/>
                                                            : <img data-test-id='eye-closed'
                                                                   src={eyeClose} alt=''/>
                                                        : ''
                                                    }
                                                </button>
                                            </div>
                                            {errors?.passwordConfirmation
                                                ?
                                                errors?.passwordConfirmation.message === InputMessage.EmptyValue
                                                    ? <div data-test-id='hint'
                                                           className={s.helperError}
                                                    >
                                                        {InputMessage.EmptyValue}
                                                    </div>
                                                    : <div data-test-id='hint'
                                                           className={s.helperError}
                                                    >
                                                        {InputMessage.PasswordConfirmation}
                                                    </div>
                                                : ''
                                            }

                                            <button disabled={disabled} type='submit'
                                                    className={disabled ? `${s.buttonSubmit} ${s.buttonSubmitDisable}` : s.buttonSubmit}>
                                                сохранить изменения
                                            </button>

                                            <div className={s.bottom_block}>
                            <span className={s.bottom_block_title}>После сохранения войдите в библиотеку,
                                используя новый пароль</span>
                                            </div>
                                        </Fragment>
                                }
                            </form>

                            : <SendEmail/>
                    }
                </div>
            </div>
        </div>
    )
}
