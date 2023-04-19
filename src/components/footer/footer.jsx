import {Container} from '../container/container';

import facebook from './assets/facebook_icon.svg'
import instagram from './assets/instagram-icon.svg'
import linkedIn from './assets/linkedin-icon.svg'
import vk from './assets/vk-icon.svg'

import s from './footer.module.scss'

export const Footer = () => (
    <Container>
        <div className={s.footer}>
            <div className={s.footer_title}>
                <span>© 2020-2023 Cleverland. Все права защищены.</span>
            </div>
            <div className={s.footer_social}>
                <img className={s.footer_social__ico} src={facebook} alt='facebook' />
                <img className={s.footer_social__ico} src={instagram} alt='instagram' />
                <img className={s.footer_social__ico} src={vk} alt='vk' />
                <img className={s.footer_social__ico}  src={linkedIn} alt='linkedIn' />
            </div>
        </div>
    </Container>

)
