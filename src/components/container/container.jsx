import cn from 'classnames'
import {PropTypes} from 'prop-types';

import s from './container.module.scss'

export const Container = (props) => {
    const {className, children} = props

    return(
        <div className={cn(s.container, className)}>{children}</div>
    )
}




Container.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
}

