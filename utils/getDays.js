export const getTimeDays = (day1, day2) => {
    let ms1 = day1.getTime();
    let ms2 = day2.getTime();
    return (Math.ceil((ms2 - ms1) / (24*60*60*1000))) + 1;
};