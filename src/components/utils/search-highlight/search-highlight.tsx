type SearchHighlightPT = {
    title: string,
    searchValue: string
}

export const SearchHighlight = ({title,searchValue}: SearchHighlightPT) => {

    if (!searchValue) return <span>{title}</span>

    const Reg = new RegExp(searchValue, 'gi')
    const match = title.match(Reg)

    if (match){
        const arr = title.split(Reg).map((l, i, array) => {
            if (i < array.length-1){
                const value = match.shift()

                return <span key={l}>
                    {l}
                    <span data-test-id='highlight-matches' style={{color: '#FF5253'}}>
                        {value}
                    </span>
                </span>
            }

            return <span>{l}</span>
        })

        return <span>{arr}</span>
    }

    return <span>{title} </span>
}
