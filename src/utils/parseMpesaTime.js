function parseMpesaRecvTime(rawTimeStamp) {
    const year = parseInt(rawTimeStamp.substring(0, 4), 10);
    const month = parseInt(rawTimeStamp.substring(4, 6), 10) - 1; // Months are 0-based
    const day = parseInt(rawTimeStamp.substring(6, 8), 10);
    const hour = parseInt(rawTimeStamp.substring(8, 10), 10);
    const minutes = parseInt(rawTimeStamp.substring(10, 12), 10);
    const seconds = parseInt(rawTimeStamp.substring(12, 14), 10);

    return new Date(year, month, day, hour, minutes, seconds);
}

function genTimeStamp() {
    const date = new Date();
    return date.getFullYear() +
    (`0${  date.getMonth() + 1}`).slice(-2) +
    (`0${  date.getDate()}`).slice(-2) +
    (`0${  date.getHours()}`).slice(-2) +
    (`0${  date.getMinutes()}`).slice(-2) +
    (`0${  date.getSeconds()}`).slice(-2);
}

module.exports = {parseMpesaRecvTime, genTimeStamp};