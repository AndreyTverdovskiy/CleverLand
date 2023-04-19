import {baseURL} from '../../../api/api';
import {Rating} from '../../../components/utils/rating/rating';
import image2 from '../../profile/assets/def_profile.jpg';

import s from './review.module.scss';



type ReviewPT = {
    image: string,
    name: string,
    lastName: string,
    date: string,
    rating: number,
    comment: string,


}
export const Review = ({image,name,lastName,date,rating,comment}: ReviewPT) => {
    const date2 = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }

    const fullDate = date2.toLocaleDateString('ru-Ru', options);



    return (
        <div className={s.reviews_container} data-test-id='comment-wrapper'>
            <div className={s.reviews_item}>
                <div className={s.reviews_item__header}>
                    <img src={image ? `${baseURL}${image}` : image2} alt='reviews author'/>
                    <div className={s.reviews_item__block}>
                        <span className={s.reviews_name} data-test-id='comment-author'>{name} {lastName}</span>
                        <div className={s.reviews_name} data-test-id='comment-date'>{fullDate}</div>
                    </div>
                </div>
                <Rating value={rating}/>
                <div className={s.reviews_item__comment}>
                    {comment}
                </div>
            </div>
        </div>
    )
}


