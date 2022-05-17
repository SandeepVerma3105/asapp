const randomKey = async(key) => {
    key = await Math.floor(Math.random() * 90000) + 10000;
    return key
}

const coupon = async(key) => {
    key = await Math.floor(Math.random() * 90) + 10;
    return key
}

module.exports = {
    randomKey,
    coupon
}