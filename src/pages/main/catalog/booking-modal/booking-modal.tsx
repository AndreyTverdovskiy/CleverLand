import {useState} from 'react';

import {Calendar} from '../../../../components/calendar/calendar';
import {AuthSelector} from '../../../../selectors/selectors';
import {BookingTC, EditBookingTC, RemoveBookingTC} from '../../../../store/book-reducer';
import {useAppDispatch, useAppSelector} from '../../../../store/hooks';
import close_iso from '../../../book/rate-book/assets/close.svg';

import s from './booking-modal.module.scss'


type BookingModalPT = {
    toggleBooking: () => void
    bookId: string
    bookingId: string,
    dateOrder: string
}


export const BookingModal = ({toggleBooking, bookId, bookingId, dateOrder}: BookingModalPT) => {

    const dispatch = useAppDispatch()

    const [selectedDate, setSelectedDate] = useState<Date>()

    const disable = !selectedDate

    const {id} = useAppSelector(AuthSelector).userInfo


    const onSubmit = () => {
        if (selectedDate) {
            const dateFormat = new Date(selectedDate);

            dateFormat.setHours(dateFormat.getHours() + 3);
            const isoDate = dateFormat.toISOString();

            if (bookingId) {
                dispatch(EditBookingTC(bookingId, isoDate, bookId, (id).toString()))
            } else {
                dispatch(BookingTC(isoDate, bookId, (id).toString()))
            }
        }

        toggleBooking()
    }

    const onDelete = () => {
        dispatch(RemoveBookingTC(bookingId))
        toggleBooking()
    }

    return (
        <div className={s.booking}
             role='presentation'
             onClick={toggleBooking}
             data-test-id='modal-outer'
        >
            <div className={s.booking_modal}
                 role='presentation'
                 onClick={e => e.stopPropagation()}
                 data-test-id='booking-modal'
            >
                <div className={s.booking_modal_title} data-test-id='modal-title'>
                    {
                        bookingId
                            ? <h3>Изменение даты бронирования</h3>
                            : <h3>Выбор даты бронирования</h3>
                    }

                    <div className={s.booking_modal_close} role='presentation'
                         onClick={toggleBooking}
                         data-test-id='modal-close-button'
                    >
                        <img src={close_iso} alt='close modal'/>
                    </div>
                </div>

                <Calendar selectDate={setSelectedDate}
                          selectedDate={
                              dateOrder && !selectedDate
                                  ? new Date(dateOrder)
                                  : dateOrder && selectedDate
                                      ? selectedDate
                                      : selectedDate
                          }
                />

                <button
                    data-test-id='booking-button'
                    disabled={disable}
                    className={disable ? s.booking_modal_button_disable : s.booking_modal_button_submit}
                    onClick={onSubmit}
                    type='submit'
                >
                    забронировать
                </button>

                {
                    bookingId &&

                    <button
                        data-test-id='booking-cancel-button'
                        className={s.booking_modal_button_remove}
                        onClick={onDelete}
                        type='submit'
                    >
                        отменить бронь
                    </button>
                }
            </div>
        </div>
    )
}
