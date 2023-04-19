import {useState} from 'react';
import {Navigation, Pagination,Thumbs} from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react';

import {baseURL} from '../../../api/api';

import './book-swiper.scss';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';


export const BookSwiper = ({images}) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    return (
        <>

            <Swiper
                loop = {true}
                spaceBetween={10}
                navigation={true}
                thumbs={{swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null}}
                modules={[Navigation, Thumbs,Pagination]}
                grabCursor={true}
                pagination={true}
                className='mySwiper2'
                data-test-id='slide-big'
            >
                {
                    images.map((image) => (
                        <SwiperSlide key={image.url} >
                            <img src={`${baseURL}${image.url}`} alt='book'/>
                        </SwiperSlide>
                    ))
                }
            </Swiper>

            <div className='thumbs'>
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={3}
                    modules={[Navigation, Thumbs]}
                    className='mySwiper'
                    watchSlidesProgress={true}
                >
                    {
                        images.map((image) => (
                            <SwiperSlide key={image.url} data-test-id='slide-mini'>
                                <div className='book-image-swiper-thumbs-wrapper'>
                                    <img src={`${baseURL}${image.url}`} alt='book'/>
                                </div>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>

        </>
    );
}


