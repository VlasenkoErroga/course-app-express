
function toCurrency (totalPrice) {
    return new Intl.NumberFormat('us-US', {
        currency: 'usd',
        style:'currency',
    }).format(totalPrice)
}

document.querySelectorAll('.badge-currency').forEach(node => {
    node.textContent = toCurrency(node.textContent)
})

const toDate = date => {

    console.log(date)
    return new Intl.DateTimeFormat(
        'us-US',
        {
            year: 'numeric', 
            month: 'long', 
            weekday:'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        }
    ).format(new Date(date))
}

document.querySelectorAll('.date').forEach(node => {
    console.log(node)
    node.textContent = toDate(node.textContent)
})