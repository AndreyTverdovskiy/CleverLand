import {forwardRef, useState} from 'react';
import {UseFormRegister} from 'react-hook-form';

import {FormValues, InputId, InputMessage, InputPlaceholder, InputType} from './custom-input.types';

import s from './custom-input.module.scss'


export const CustomInput = forwardRef<HTMLInputElement,
    { type: InputType; id: InputId; placeholder: InputPlaceholder; message?: InputMessage; isValidLoginData?: boolean }
    & ReturnType<UseFormRegister<FormValues>>>
(({onChange, name, type, id, placeholder, message, isValidLoginData}, ref) => {

    const [isEyeOpen, setIsEyeOpen] = useState(false)

    const handleSetIsEyeOpen = () => {
        setIsEyeOpen(!isEyeOpen)
    }

    return (
        <div className={s.custom_field}>
            <input
                className={`${s.custom_field_input} ${isValidLoginData ? s.custom_field_input_error :''}`}
                type={type}
                placeholder={placeholder}
                name={name}
                id={id}
                onChange={onChange}
                ref={ref}
            />
            <label className={s.custom_field_label} data-content={placeholder}>
                <span className={s.custom_field_label_hidden}>{placeholder}</span>
            </label>

            {
                message && <p className={s.custom_field_message}>{message}</p>
            }
        </div>
    )
})
