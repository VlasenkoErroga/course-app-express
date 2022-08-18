 
const $basket = document.querySelector('#basket')
if ($basket) {
    $basket.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-remove-card')) {
            const id = e.target.dataset.id
            const csrf = e.target.dataset.csrf

                fetch(`/card/remove/${id}`, {
                    method: 'delete',
                    headers: {
                        'X-CSRF-TOKEN': csrf
                    }
                })
                .then(res => res.json())
                .then(card => {
                    if(card.courses.length){
                        const html = card.courses.map(c => {
                            return `
                            <tr>
                                <td>${c.title}</td>
                                <td>${c.counter}</td>
                                <td>${c.price}</td>
                                <td><button class="btn btn-primary waves-effect btn-remove-card" data-id="${c.id}" data-csrf="${csrf}">Delete</button></td>
                            </tr>
                            `
                        }).join('')
                        $basket.querySelector('tbody').innerHTML = html
                        $basket.querySelector('.badge-currency').textContent = toCurrency(card.totalPrice)
                    } else {
                        $basket.innerHTML = '<p>Basket is empty</p>'
                    } 
                })
        }
    })
}

//favorite

function toBase64(arr) {
   //arr = new Uint8Array(arr) if it's an ArrayBuffer
   return btoa(String.fromCharCode.apply(null, new Uint8Array(arr)));
}

const $favorite = document.querySelector('#favorite')
if ($favorite) {
    $favorite.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-remove-favorite-card')) {
            const id = e.target.dataset.id
            const csrf = e.target.dataset.csrf


            console.log(id, csrf, '\n\n', `/favorite/remove/${id}`)

                fetch(`/favorite/remove/${id}`, {
                    method: 'delete',
                    headers: {
                        'X-CSRF-TOKEN': csrf
                    }
                })
                .then(res => res.json())
                .then(card => {
                    console.log(card)
                    if(card.length){
                        const html = card.map(c => {
                            return `
                            <div class="col s12 m6 l4 xl3 d-flex-center">
                            <div class="card  hoverable">
                                <div class="card-image">
                                    <a href="/courses/${c.id}" class="card-image__wrap">
                                    
                                    <img src="data:${c.file.contentType};base64,
                                            ${String.fromCharCode.apply(null, new Uint8Array(c.file.data.data))}">
                                    
                                    </a>
                                    <div class="new badge badge-currency teal lighten-2 white-text">
                                        ${c.price}
                                        </div>
                                </div>
                                <div class="card-content">
                                <a href="/courses/${c.id}" class="card-title">Course ${c.title}</a>
                                <p>${c.short_description}</p>
                                </div>
                                <div class="card-action">
                                <div class="d-flex-center">
                                <form action="/card/add" method="POST">
                                    <input type="hidden" name="_csrf" value="${csrf}">
                                    <input type="hidden" name="id" value="${c.id}">
                                    <button type="submit" class="btn waves-effect waves-light red"><i class="material-icons left">local_mall</i>Buy</button>
                                </form>

                                <button class="btn btn-primary waves-effect btn-remove-favorite-card" data-id="${c.id}" data-csrf="${csrf}"><i class="material-icons left">remove</i>Delete</button>
                                </div>
                                </div>
                            </div>
                            </div>
                            `
                        }).join('')
                        $favorite.innerHTML = html
                    } else {
                        $favorite.innerHTML = '<p>Favorite list is empty</p>'
                    } 
                })
        }
    })
}