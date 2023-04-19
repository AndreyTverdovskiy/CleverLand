export const phoneUtils = (str: string) => {

     const phoneCode: Set<string> = new Set(['29', '33', '44', '25']);
     const phoneNumber = new RegExp(/^\+\d{3}\s\(\d{2}\)\s\d{3}-\d{2}-\d{2}$/);

    const arr = Array.from(str).filter((char)=> !Number.isNaN(+char) && char !== ' ');

    return (phoneCode.has(str.slice(6,8)) && phoneNumber.test(str) && arr.length === 12);
}








