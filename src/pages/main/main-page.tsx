import {Catalog} from './catalog/catalog';

import s from './main-page.module.scss'


type MainPagePT = {
    toggleBooking: () => void
    setBookId: (id: string) => void
    setBookingId: (id: string) => void
    setDateOrder: (date: string) => void
}


export const MainPage = ({toggleBooking, setBookId, setBookingId, setDateOrder}: MainPagePT) => (
    <section className={s.mainPage} data-test-id='main-page'>
        <Catalog toggleBooking={toggleBooking}
                 setBookId={setBookId}
                 setDateOrder={setDateOrder}
                 setBookingId={setBookingId}
        />
    </section>

);
