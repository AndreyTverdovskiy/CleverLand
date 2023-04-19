import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import InputMask from 'react-input-mask';

import {
    FormDataType,
    InputMessage,
    InputPlaceholder,
    InputType
} from '../../../components/utils/custom-input/custom-input.types';
import {InputPatterns} from '../../../components/utils/custom-input/patterns';
import {AuthSelector} from '../../../selectors/selectors';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {UpdateInfoTC} from '../../../store/profile-reducer';
import eyeClose from '../../auth/registration/assets/eyeClose.svg';
import eyeOpen from '../../auth/registration/assets/eyeOpen.svg';
import success from '../../auth/registration/assets/success.svg';
import {passwordUtils} from '../../auth/utils/password-utils';
import {phoneUtils} from '../../auth/utils/phone-utils';
import {usernameUtils} from '../../auth/utils/username-utils';

import s from './user-info.module.scss';


export const UserInfo = () => {

    const {userInfo} = useAppSelector(AuthSelector)
    const dispatch = useAppDispatch()

    // Сет значений для полей
    const [valuePhone, setValuePhone] = useState('');


    // Проверка полей на пустоту
    const [usernameError, setUsernameError] = useState<string>('emptyField');
    const [passwordError, setPasswordError] = useState<string>('');

    const [comparePassword, setPasswordCompare] = useState<string[]>
    (['lengthComplete', 'upperCaseComplete', 'numberComplete']);


    const [isEyeOpen, setIsEyeOpen] = useState(false);

    const [editForm, setEditMode] = useState(false)

    const onEditClick = () => {
        setEditMode(!editForm)
    }


    const {
        register,
        formState: {errors, isValid},
        handleSubmit, clearErrors, watch, setError, setValue,
    } = useForm<FormDataType>()

    // отслеживание
    const valueUsername = watch('login');
    const valueFirstName = watch('firstName');
    const valueLastName = watch('lastName');
    const valuePassword = watch('password');
    const valueEmail = watch('email')

    const handleSetIsEyeOpen = () => {
        setIsEyeOpen(!isEyeOpen)
    };

    const onChangePhone = (phone: string) => {
        setValue('phone', phone);
        setValuePhone(phone)

        if (valuePhone.length !== 0) {
            if (phoneUtils(phone)) {
                clearErrors('phone')
            } else {
                setError('phone', {
                    type: 'onBlur',
                    message: InputMessage.Phone
                })
            }
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


    const onSubmit = () => {
        if(isValid){
            dispatch(UpdateInfoTC(
                userInfo.id, valueUsername,
                valueEmail, valuePassword,
                valueFirstName, valueLastName, valuePhone))
            setEditMode(false)
        }
    }


    useEffect(() => {
        const subscription = watch((value, {name}) => {

            const {login} = value
            const {password} = value

            if (name === 'login' && login) {
                setUsernameError(usernameUtils(login))
            }
            if (name === 'password' && password) {
                setPasswordCompare(passwordUtils(password))
            }

            return () => subscription.unsubscribe()
        })
    }, [watch]);

    useEffect(() => {
        setValue('login', userInfo.username)
        setValue('email', userInfo.email)
        setValue('firstName', userInfo.firstName)
        setValue('lastName', userInfo.lastName)
        setValue('phone', userInfo.phone)
        setValuePhone(userInfo.phone)
    }, [setValue, userInfo])

    return (
        <form onSubmit={handleSubmit(onSubmit)}
              className={s.profile_data_form}
              data-test-id='profile-form'
        >

            <div className={s.inputs_block}>
                {/* Login */}
                <div className={s.inputContainer}>
                    <div className={s.labelContainer}>
                            <span
                                className={valueUsername ? `${s.labelFocus} ${s.label}` : s.labelFocus}>{InputPlaceholder.CreateLogin}</span>
                        <input
                            autoComplete="new-password"
                            type={InputType.Text}
                            className={errors?.username ? `${s.inputCommon} ${s.inputCommonError}` : s.inputCommon}
                            placeholder={InputPlaceholder.CreateLogin}
                            disabled={!editForm}
                            onFocus={() => {
                                clearErrors('login')
                            }}
                            {...register('login', {
                                required: InputMessage.EmptyValue,
                                pattern: {
                                    value: InputPatterns.Login,
                                    message: InputMessage.CreateUserName,
                                },
                                onBlur: () => {
                                    if (!valueUsername) {
                                        setError('login', {
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
                    {errors?.login
                        ?
                        errors?.login.message === InputMessage.EmptyValue
                            ?
                            <div data-test-id='hint'
                                 className={s.helperError}>{InputMessage.EmptyValue}</div>
                            :
                            <div data-test-id='hint'
                                 className={s.helperError}>{InputMessage.CreateUserName}</div>
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
                </div>

                {/* password */}
                <div className={s.inputContainer}>
                    <div className={s.labelContainer}>
                            <span
                                className={valuePassword ? `${s.labelFocus} ${s.label}` : s.labelFocus}>{InputPlaceholder.Password}</span>
                        <input
                            type={isEyeOpen ? InputType.Text : InputType.Password}
                            className={errors?.password ? `${s.inputCommon} ${s.inputCommonError}` : s.inputCommon}
                            placeholder={InputPlaceholder.Password}
                            disabled={!editForm}
                            onFocus={() => {
                                clearErrors('password')
                                setPasswordError('')
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

                                    if (comparePassword.length < 3) {
                                        setPasswordError('error')
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
                                ? isEyeOpen
                                    ?
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
                        : passwordError === 'error'
                            ? <div data-test-id='hint'
                                   className={s.helperError}>{InputMessage.Password}
                            </div>
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
                </div>

                {/* Name */}
                <div className={s.inputContainer}>
                    <div className={s.labelContainer}>
                            <span
                                className={valueFirstName ? `${s.labelFocus} ${s.label}` : s.labelFocus}>{InputPlaceholder.FirstName}</span>
                        <input
                            autoComplete="new-password"
                            type={InputType.Text}
                            className={errors?.firstName ? `${s.inputCommon} ${s.inputCommonError}` : s.inputCommon}
                            placeholder={InputPlaceholder.FirstName}
                            disabled={!editForm}
                            onFocus={() => {
                                clearErrors('firstName')
                            }}
                            {...register('firstName',
                                {
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

                </div>

                {/* Last name */}
                <div className={s.inputContainer}>
                    <div className={s.labelContainer}>
                            <span
                                className={valueLastName ? `${s.labelFocus} ${s.label}` : s.labelFocus}>{InputPlaceholder.LastName}</span>
                        <input
                            autoComplete="new-password"
                            type={InputType.Text}
                            className={errors?.lastName ? `${s.inputCommon} ${s.inputCommonError}` : s.inputCommon}
                            placeholder={InputPlaceholder.LastName}
                            disabled={!editForm}
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


                </div>

                {/* Phone */}
                <div className={s.inputContainer}>
                    <div className={s.labelContainer}>
                            <span
                                className={valuePhone ? `${s.labelFocus} ${s.label}` : s.labelFocus}>{InputPlaceholder.Phone}</span>

                        <InputMask
                            value={valuePhone}
                            onChange={(e) => onChangePhone( e.target.value as string )}
                            alwaysShowMask={true}
                            mask='+375 (99) 999-99-99'
                            name='phone'
                            disabled={!editForm}
                            maskPlaceholder='+375 (xx) xxx-xx-xx'
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
                </div>

                {/* Email */}
                <div className={s.inputContainer}>
                    <div className={s.labelContainer}>
                            <span
                                className={valueEmail ? `${s.labelFocus} ${s.label}` : s.labelFocus}>{InputPlaceholder.Email}</span>
                        <input
                            type={InputType.Email}
                            className={errors?.email ? `${s.inputCommon} ${s.inputCommonError}` : s.inputCommon}
                            placeholder={InputPlaceholder.Email}
                            disabled={!editForm}
                            onFocus={() => {
                                clearErrors('email')
                            }}
                            {...register('email', {
                                required: InputMessage.EmptyValue,
                                onBlur: () => {
                                    if (!valueEmail) {
                                        setError('email', {
                                            type: 'onBlur',
                                            message: InputMessage.EmptyValue
                                        })
                                    }

                                    if(valueEmail && !valueEmail.match(InputPatterns.Email)){
                                        setError('email', {
                                            type: 'onBlur',
                                            message: InputMessage.Email
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
                </div>
            </div>


            <div className={s.button_block}>
                <button type='button'
                        onClick={onEditClick}
                        className={`${s.button}  ${s.edit}`}
                        data-test-id='edit-button'
                >
                    Редактировать
                </button>
                <button type='submit'
                        data-test-id='save-button'
                        disabled={!editForm}
                        className={`${s.button} ${editForm ? s.submit_act : s.submit_dis} `}
                >
                    Сохранить изменения
                </button>
            </div>

        </form>
    )
}
