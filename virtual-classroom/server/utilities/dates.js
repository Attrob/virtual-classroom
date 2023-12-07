function isValidDate(dateStr) {
    return !isNaN(new Date(dateStr));
}

module.exports = {
    isValidDate
};