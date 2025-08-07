function parseTimeToDecimal(timeString) {
    const [h, m] = timeString.split(':').map(Number);
    return +(h + m / 60).toFixed(2);
}

module.exports = {
    parseTimeToDecimal
};