export const DecipherToken = (token:string) => {

    const tokenInfo = token.split('.')[1]
    const tokenInfoDecoded = window.atob(tokenInfo)
    const {id} = JSON.parse(tokenInfoDecoded)

    return JSON.stringify(id)

}
