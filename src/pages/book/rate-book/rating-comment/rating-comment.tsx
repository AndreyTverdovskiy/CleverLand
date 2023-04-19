import star_bg from '../../../main/catalog/assets/star_bg.svg';
import star_wth from '../../../main/catalog/assets/star_wth.svg';

import s from './rating-comment.module.scss'






type StarPT = {
    selected: boolean
    setValue: (value: number) => void
    value:number

}

const Star = (props:StarPT)  => {
    const {selected, setValue, value} = props

    return (
        <div className={s.star} data-test-id='star'>
            <img src={selected ? star_bg : star_wth}
                 role='presentation'
                 onClick={() => setValue(value)}
                 alt='star'
                 data-test-id={selected? 'star-active' : ''}
            />
        </div>
    )
}




type RatingCommentPT = {
    value: number
    setValue: (value:number) => void
}

export const RatingComment = (props:RatingCommentPT) => {

    const {value,setValue} = props

    return (
        <div className={s.rating_comment} data-test-id='rating'>
            <Star selected={value > 0} value = {1} setValue = {setValue}/>
            <Star selected={value > 1} value = {2} setValue = {setValue}/>
            <Star selected={value > 2} value = {3} setValue = {setValue}/>
            <Star selected={value > 3} value = {4} setValue = {setValue}/>
            <Star selected={value > 4} value = {5} setValue = {setValue}/>
        </div>
    )
}


