// eslint-disable-next-line import/no-extraneous-dependencies
import Lottie from 'lottie-react';

import animationData from './assets/loader.json'

import s from './loader.module.scss'


export const Loader = () => (
    <div className={s.wrapper} data-test-id='loader'>
        <div className={s.loader}>
           <Lottie animationData={animationData} height={150} width={150}/>
        </div>
    </div>
)



