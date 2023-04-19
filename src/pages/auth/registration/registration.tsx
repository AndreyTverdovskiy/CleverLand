import {Fragment, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import {InputMask} from 'primereact/inputmask';

import {
    FormDataType,
    InputMessage,
    InputPlaceholder,
    InputType
} from '../../../components/utils/custom-input/custom-input.types';
import {InputPatterns} from '../../../components/utils/custom-input/patterns';
import {AuthSelector} from '../../../selectors/selectors';
import {RegistrationTC} from '../../../store/auth-reducer';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {InfoModal} from '../info-modal/info-modal';
import {passwordUtils} from '../utils/password-utils';
import {phoneUtils} from '../utils/phone-utils';
import {usernameUtils} from '../utils/username-utils';

import arrowIcon from './assets/arrow.svg'
import eyeClose from './assets/eyeClose.svg'
import eyeOpen from './assets/eyeOpen.svg'
import success from './assets/success.svg'

import s from './registration.module.scss'


export const Registration = () => {

    const {isAuth, isRegistrError, isRegistrResError, isRegistrSuccess} = useAppSelector(AuthSelector)


    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const [step, setStep] = useState(1)

    const buttonTitle =
        step === 1
            ? 'Следующий шаг'
            : step === 2
                ? 'Последний шаг'
                : 'Зарегистрироваться'


    const {
        register,
        formState: {errors, isValid},
        handleSubmit, clearErrors, watch, setError, setValue
    } = useForm<FormDataType>()


    const valueUsername = watch('username');
    const valuePassword = watch('password');
    const valueFirstName = watch('firstName');
    const valueLastName = watch('lastName');
    const valueEmail = watch('email')


    const [isEyeOpen, setIsEyeOpen] = useState(false);

    const handleSetIsEyeOpen = () => {
        setIsEyeOpen(!isEyeOpen)
    };

    const [usernameError, setUsernameError] = useState<string>('emptyField');

    const [valuePhone, setValuePhone] = useState<string>('');
    const [comparePassword, setPasswordCompare] = useState<string[]>
    (['lengthComplete', 'upperCaseComplete', 'numberComplete']);


    const setHandleStep = () => {
        setStep(step + 1)
    }

    const onSubmit = (data: FormDataType) => {
        if (step < 3) {
            setHandleStep()
        } else {
            dispatch(RegistrationTC(data))
        }
    }

    const onLoginClick = () => {
        navigate('/auth')
    }

    const onChangePhone = (phone: string) => {
        setValue('phone', valuePhone);
        setValuePhone(phone)

        if (phoneUtils(phone)) {
            clearErrors('phone')
        } else {
            setError('phone', {
                type: 'onBlur',
                message: InputMessage.Phone
            })
        }
    }

    const onPhoneBlur = () => {
        if (!valuePhone) {
            setError('phone', {
                type: 'onBlur',
                message: InputMessage.EmptyValue
            })
        }

        if (!phoneUtils(valuePhone) && valuePhone) {
            setError('phone', {
                type: 'onBlur',
                message: InputMessage.Phone
            })
        }
    }

    useEffect(() => {
        if (isAuth) {
            navigate('/')
        }
    }, [isAuth, navigate])

    useEffect(() => {
        const subscription = watch((value, {name}) => {

            const {username} = value
            const {password} = value

            if (name === 'username' && username) {
                setUsernameError(usernameUtils(username))
            }
            if (name === 'password' && password) {
                setPasswordCompare(passwordUtils(password))
            }

            return () => subscription.unsubscribe()
        })
    }, [watch]);

    useEffect(() => {
        setStep(1)
    }, [isRegistrResError])


    const disabled = !isValid

    return (
        <div className={s.registration} data-test-id='auth'>
            <div className={s.title}>Cleverland</div>
            <div className={s.commonContainer}>
                <div className={s.container}>
                    {
                        !isRegistrError && !isRegistrResError && !isRegistrSuccess &&
                        <div className={s.stepContainer}>
                            <h4 className={s.register}>Регистрация</h4>
                            <span className={s.step}>{`${step} шаг из 3`}</span>
                        </div>
                    }

                    <form onSubmit={handleSubmit(onSubmit)} className={s.formContainer}
                          data-test-id='register-form'>
                        {
                            isRegistrResError
                                ? < InfoModal title='Данные не сохранились'
                                              massage='Такой логин или e-mail уже записан в системе. Попробуйте зарегистрироваться по другому логину или e-mail.'
                                              path='/registration'
                                              buttonTitle='назад к регистрации'
                                              dataTest='status-block'

                                />
                                : isRegistrError
                                    ? <InfoModal title='Вход не выполнен'
                                                 massage='Что-то пошло не так и ваша регистрация не завершилась. Попробуйте ещё раз'
                                                 buttonTitle='повторить'
                                                 isError={true}
                                                 dataTest='status-block'
                                    />
                                    : isRegistrSuccess
                                        ? <InfoModal title='Регистрация успешна'
                                                     massage='Регистрация прошла успешно. Зайдите в личный кабинет, используя свои логин и пароль'
                                                     buttonTitle='вход'
                                                     isError={false}
                                                     path='/auth'
                                                     dataTest='status-block'
                                        />
                                        : <Fragment>
                                            {step === 1 &&
                                                <Fragment>
                                                    <div className={s.labelContainer}>
                            <span
                                className={valueUsername ? `${s.labelFocus} ${s.label}` : s.labelFocus}>{InputPlaceholder.CreateLogin}</span>
                                                        <input
                                                            autoComplete="new-password"
                                                            type={InputType.Text}
                                                            className={errors?.username ? `${s.inputCommon} ${s.inputCommonError}` : s.inputCommon}
                                                            placeholder={InputPlaceholder.CreateLogin}
                                                            onFocus={() => {
                                                                clearErrors('username')
                                                            }}
                                                            {...register('username', {
                                                                required: InputMessage.EmptyValue,
                                                                pattern: {
                                                                    value: /^(?=^.{1,}$)((?=.*\d)(?=.*[a-zA-Z]))[0-9a-zA-Z]*$/,
                                                                    message: InputMessage.CreateUserName,
                                                                },
                                                                onBlur: () => {
                                                                    if (!valueUsername) {
                                                                        setError('username', {
                                                                            type: 'onBlur',
                                                                            message: InputMessage.EmptyValue
                                                                        })
                                                                    }
                                                                    if (usernameError !== 'emptyField') {
                                                                        setUsernameError('error')
                                                                    }
                                                                }
                                                            })}
                                                        />
                                                    </div>
                                                    {errors?.username
                                                        ?
                                                        (errors?.username.message === InputMessage.EmptyValue
                                                            ?
                                                            <div data-test-id='hint'
                                                                 className={s.helperError}>{InputMessage.EmptyValue}</div>
                                                            :
                                                            <div data-test-id='hint'
                                                                 className={s.helperError}>{InputMessage.CreateUserName}</div>)
                                                        : usernameError === 'error'
                                                            ?
                                                            <div data-test-id='hint'
                                                                 className={s.helperError}>{InputMessage.CreateUserName}</div>
                                                            :
                                                            <div data-test-id='hint'
                                                                 className={s.helper}>
                                                                Используйте для логина
                                                                <span
                                                                    className={usernameError === 'numberField' || usernameError === 'AllField' ? s.red : ''}
                                                                > латинский алфавит
                                                                </span> и
                                                                <span
                                                                    className={usernameError === 'letterField' || usernameError === 'AllField' ? s.red : ''}
                                                                > цифры
                                                            </span>
                                                            </div>
                                                    }


                                                    <div className={s.labelContainer}>
                            <span
                                className={valuePassword ? `${s.labelFocus} ${s.label}` : s.labelFocus}>{InputPlaceholder.Password}</span>
                                                        <input
                                                            autoComplete="new-password"
                                                            type={isEyeOpen ? InputType.Text : InputType.Password}
                                                            className={errors?.password ? `${s.inputCommon} ${s.inputCommonError}` : s.inputCommon}
                                                            placeholder={InputPlaceholder.Password}
                                                            onFocus={() => {
                                                                clearErrors('password')
                                                            }}
                                                            {...register('password', {
                                                                required: InputMessage.EmptyValue,
                                                                pattern: {
                                                                    value: /(?=.*[A-ZА-Я])(?=.*[0-9])[a-zA-Zа-яА-Я0-9]{8,}/,
                                                                    message: InputMessage.Password
                                                                },
                                                                onBlur: () => {
                                                                    if (!valuePassword) {
                                                                        setError('password', {
                                                                            type: 'onBlur',
                                                                            message: InputMessage.EmptyValue
                                                                        })
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
                                                        (errors?.password.message === InputMessage.EmptyValue ?
                                                            <div data-test-id='hint'
                                                                 className={s.helperError}>{InputMessage.EmptyValue}</div> :
                                                            <div data-test-id='hint'
                                                                 className={s.helperError}>{InputMessage.Password}</div>)
                                                        :
                                                        comparePassword.length < 3 ?
                                                            <div className={s.helper}
                                                                 data-test-id='hint'>
                                                                Пароль <span
                                                                className={comparePassword[0] === 'lengthComplete' ? '' : s.red}>не менее 8 символов</span>,
                                                                с <span
                                                                className={comparePassword[0] === 'upperCaseComplete' || comparePassword[1] === 'upperCaseComplete' ? '' : s.red}> заглавной буквой</span> и <span
                                                                className={comparePassword[0] === 'numberComplete' || comparePassword[1] === 'numberComplete' ? '' : s.red}>цифрой</span>
                                                            </div>
                                                            : <div
                                                                className={s.helper}
                                                                data-test-id='hint'>{InputMessage.Password}</div>

                                                    }
                                                    <button disabled={disabled} type='submit'
                                                            className={disabled ? `${s.buttonSubmit} ${s.buttonSubmitDisable}` : s.buttonSubmit}>
                                                        {buttonTitle}
                                                    </button>
                                                </Fragment>
                                            }

                                            {step === 2 &&
                                                <Fragment>
                                                    <div className={s.labelContainer}>
                            <span
                                className={valueUsername ? `${s.labelFocus} ${s.label}` : s.labelFocus}>{InputPlaceholder.FirstName}</span>
                                                        <input
                                                            autoComplete="new-password"
                                                            type={InputType.Text}
                                                            className={errors?.firstName ? `${s.inputCommon} ${s.inputCommonError}` : s.inputCommon}
                                                            placeholder={InputPlaceholder.FirstName}
                                                            onFocus={() => {
                                                                clearErrors('firstName')
                                                            }}
                                                            {...register('firstName', {
                                                                required: InputMessage.EmptyValue,
                                                                onBlur: () => {
                                                                    if (!valueFirstName) {
                                                                        setError('firstName', {
                                                                            type: 'onBlur',
                                                                            message: InputMessage.EmptyValue
                                                                        })
                                                                    }
                                                                }
                                                            })}
                                                        />
                                                    </div>
                                                    {errors?.firstName?.message ?
                                                        <div data-test-id='hint'
                                                             className={s.helperError}>{InputMessage.EmptyValue}</div> :
                                                        <div data-test-id='hint'
                                                             className={`${s.emptyDiv} ${s.helper}`}>{true}</div>
                                                    }


                                                    <div className={s.labelContainer}>
                            <span
                                className={valuePassword ? `${s.labelFocus} ${s.label}` : s.labelFocus}>{InputPlaceholder.LastName}</span>
                                                        <input
                                                            autoComplete="new-password"
                                                            type={InputType.Text}
                                                            className={errors?.lastName ? `${s.inputCommon} ${s.inputCommonError}` : s.inputCommon}
                                                            placeholder={InputPlaceholder.LastName}
                                                            onFocus={() => {
                                                                clearErrors('lastName')
                                                            }}
                                                            {...register('lastName', {
                                                                required: InputMessage.EmptyValue,
                                                                onBlur: () => {
                                                                    if (!valueLastName) {
                                                                        setError('lastName', {
                                                                            type: 'onBlur',
                                                                            message: InputMessage.EmptyValue
                                                                        })
                                                                    }
                                                                }
                                                            })}
                                                        />
                                                    </div>
                                                    {errors?.lastName?.message
                                                        ?
                                                        <div data-test-id='hint'
                                                             className={s.helperError}>{InputMessage.EmptyValue}</div>
                                                        :
                                                        <div data-test-id='hint'
                                                             className={`${s.emptyDiv} ${s.helper}`}>{true}</div>
                                                    }

                                                    <button disabled={disabled} type='submit'
                                                            className={disabled ? `${s.buttonSubmit} ${s.buttonSubmitDisable}` : s.buttonSubmit}>
                                                        {buttonTitle}
                                                    </button>
                                                </Fragment>
                                            }

                                            {step === 3 &&
                                                <Fragment>
                                                    <div className={s.labelContainer}>
                            <span
                                className={valuePhone ? `${s.labelFocus} ${s.label}` : s.labelFocus}>{InputPlaceholder.Phone}</span>

                                                        <InputMask
                                                            value={valuePhone}
                                                            onChange={(e) => onChangePhone(e.target.value as string)}
                                                            mask='+375 (99) 999-99-99'
                                                            slotChar='x'
                                                            name='phone'
                                                            autoClear={false}
                                                            required={true}
                                                            placeholder={InputPlaceholder.Phone}
                                                            className={errors?.phone ? `${s.inputCommon} ${s.inputCommonError}` : s.inputCommon}
                                                            onFocus={() => {
                                                                clearErrors('phone')
                                                            }}
                                                            onBlur={onPhoneBlur}
                                                        />

                                                    </div>
                                                    {errors?.phone
                                                        ?
                                                        (errors.phone?.message === InputMessage.EmptyValue
                                                            ?
                                                            <div data-test-id='hint'
                                                                 className={s.helperError}>{InputMessage.EmptyValue}</div>
                                                            : <div data-test-id='hint'
                                                                   className={s.helperError}>{errors.phone.message}</div>)
                                                        : <div data-test-id='hint'
                                                               className={s.helper}>{InputMessage.Phone}</div>
                                                    }
                                                    <div className={s.labelContainer}>
                                                        <span
                                                            className={valueEmail ? `${s.labelFocus} ${s.label}` : s.labelFocus}>{InputPlaceholder.Email}</span>
                                                        <input
                                                            type={InputType.Email}
                                                            className={errors?.email ? `${s.inputCommon} ${s.inputCommonError}` : s.inputCommon}
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
                                                                    if (!valueEmail) {
                                                                        setError('email', {
                                                                            type: 'onBlur',
                                                                            message: InputMessage.EmptyValue
                                                                        })
                                                                    }
                                                                }
                                                            })}
                                                        />
                                                    </div>
                                                    {errors?.email
                                                        ?
                                                        (errors.email?.message === InputMessage.EmptyValue
                                                            ?
                                                            <div data-test-id='hint'
                                                                 className={s.helperError}>{InputMessage.EmptyValue}</div>
                                                            : <div data-test-id='hint'
                                                                   className={s.helperError}>{errors.email.message}</div>)
                                                        : <div data-test-id='hint'
                                                               className={s.helper}>{InputMessage.Email}</div>
                                                    }
                                                    <button disabled={disabled} type='submit'
                                                            className={disabled ? `${s.buttonSubmit} ${s.buttonSubmitDisable}` : s.buttonSubmit}>
                                                        {buttonTitle}
                                                    </button>
                                                </Fragment>
                                            }

                                            <div className={s.enterContainer}>
                                                <div className={s.account
                                                }>Есть учётная запись?
                                                </div>
                                                <button
                                                    type='button'
                                                    className={s.arrow}
                                                    onClick={onLoginClick}
                                                >
                                                    войти
                                                    <img src={arrowIcon} alt=''/>
                                                </button>
                                            </div>
                                        </Fragment>
                        }
                    </form>
                </div>
            </div>
        </div>
    );


}
