module.exports = regex = {
    email: /^[0-9a-zA-Z]+[@]{1}[a-z]+(.com){1}$/,
    password: /^[1-9a-zA-Z@$&#]+$/,
    productName: /^[A-Z]+([a-zA-Z1-9,/]+[\s]?)+$/,
    categoryName: /^([a-zA-Z]+[\s]?)+$/,
    description: /^[A-Za-z'0-9,.&#$/ ]+$/,
    title: /^([A-Z]+[A-Za-z]+[\s]?)+$/,
    phoneNumber: /^[6-9]{1}[0-9]{9}$/,
    name: /^[A-Z]+[a-z]+$/,
    coupon: /^(ASAPP){1}[0-9]{2}$/,
    cardNo: /^[0-9]{16}$/,
    cvvNo: /^[0-9]{3}$/,
    cardHoldarName: /^[A-Za-z0-9]{2,30}$/,
    cardName: /^[A-Za-z]{4,20}$/,
    paymentType: /^(CASH|ONLINE)$/,
    question: /^[A-Za-z0-9 ]+[?]{1}$/



}