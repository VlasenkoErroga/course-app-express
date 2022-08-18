const cardView = document.getElementById('view-card')
const formView = document.getElementById('form-view')

if (cardView && formView) {

    formView.addEventListener('keyup', (e) => {

        switch (e.target.name) {
            case 'title':
                cardView
                    .querySelector('.card-title')
                    .textContent = 'Course ' + e.target.value
                break;
            case 'price':
                cardView
                    .querySelector('.new.badge.badge-currency')
                    .textContent = e.target.value + ',00 $'
                break;
            case 'img':
                cardView
                    .querySelector('.card-image__wrap>img')
                    .setAttribute('src', e.target.value)
                break;
                case 'short_description':
                    cardView.querySelector('.card-content>p').textContent = e.target.value
                    break;
            default:
                break;
        }

    })

}