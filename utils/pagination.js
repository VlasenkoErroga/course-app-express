function paginationFn(page = 1, size, countItems, req){
    const pagination = {
        page: []
    }

    if (!size) {
        size = req.user ? req.user.limit : 4
    }

    for (let i = 1; i <= countItems; i++) {
        if (Math.ceil(countItems / size) >= i) {
            pagination
                .page
                .push({count: i})
        }
    }

    pagination.activePage = Number(page)
    pagination.nextPage = Number(page) + 1 > pagination.page.length
        ? Number(page)
        : Number(page) + 1
    pagination.prevPage = Number(page) > 0
        ? Number(page) - 1
        : null
    pagination.size = size
    pagination.limit = parseInt(size)
    pagination.skip = (page - 1) * size

    return pagination
}

module.exports = paginationFn