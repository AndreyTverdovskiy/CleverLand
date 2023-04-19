import s from './info-block.module.scss'

type InfoBlockPT = {
    title:string
    description: string
    contentTitle: string
}

export const InfoBlock = ({title,description,contentTitle}:InfoBlockPT) => (
        <div className={s.info}>
            <div className={s.info_header}>
                <div className={s.info_header_title}>{title}</div>
                <div className={s.info_header_description}>{description}
                </div>
            </div>
            <div className={s.info_content}>
                {contentTitle}
            </div>
        </div>
    )

