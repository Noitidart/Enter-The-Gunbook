/**
 * https://stackoverflow.com/a/5002161/1828637
 * @param {string} strInputCode
 */
export function stripTags(strInputCode: string) {
    return strInputCode.replace(/<\/?[^>]+(>|$)/g, "");
}
