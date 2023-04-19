
import {Fragment} from 'react';

import star_bg from '../../../pages/main/catalog/assets/star_bg.svg'
import star_wth from '../../../pages/main/catalog/assets/star_wth.svg'

import s from './rating.module.scss'

type RatingPT = {
    value:number | null
}
export function Rating(props:RatingPT) {
    const {value} = props

    return (
        <div className={s.wrapper} data-test-id='rating'>
            {value === null || value === 0
                ? <span> ещё нет оценок </span>
                : <Fragment>
                    <Star selected={value > 0}/>
                    <Star selected={value > 1}/>
                    <Star selected={value > 2}/>
                    <Star selected={value > 3}/>
                    <Star selected={value > 4}/>
                </Fragment>
            }

        </div>
    )
}

type StarPT = {
    selected: boolean
}

function Star(props:StarPT) {
    const {selected} = props

    return (
        <div className={s.star} data-test-id='star'>
            <img src={selected ? star_bg : star_wth} alt='star'
                 data-test-id={selected? 'star-active' : ''}
            />
        </div>

    )

}




