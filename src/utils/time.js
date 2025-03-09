/**
 * @param {Number} seconds
 * @returns {String}
 */
export const secondsToDhms = (seconds) => {
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor(seconds % (3600 * 24) / 3600);
    const dDisplay = d > 0 ? d + (d === 1 ? " day, " : " days, ") : "";
    const hDisplay = h > 0 ? h + (h === 1 ? " hour" : " hours") : "";
    return dDisplay + hDisplay;
}
