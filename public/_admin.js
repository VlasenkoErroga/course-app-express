const $courseList = document.querySelector('#course-list')
const $users = document.querySelector('#users')
const $courses = document.querySelector('#courses')

document.addEventListener('DOMContentLoaded', function () {
    const elems = document.querySelectorAll('.modal');
    const instances = M
        .Modal
        .init(elems, {opacity: 0.2});
});

document.addEventListener('DOMContentLoaded', function () {
    const elems = document.querySelectorAll('select');
    const instances = M
        .FormSelect
        .init(elems, {classes: 'active'});
});

if ($courseList) {
    $courseList.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-remove-course')) {
            console.log(e.target)
            const id = e.target.dataset.id
            const csrf = e
                .target
                .dataset
                .csrf

                fetch(`/admin/course/remove/${id}`, {
                    method: 'delete',
                    headers: {
                        'X-CSRF-TOKEN': csrf
                    }
                })
                .then(res => res.json())
                .then(card => {
                    if (card.length) {
                        const html = card
                            .map(c => {
                                console.log(c)
                                return `
                            <li class="collection-item avatar">
                            <img src="data:${c
                                    .file
                                    .contentType};base64,
                             ${String
                                    .fromCharCode
                                    .apply(null, new Uint8Array(c.file.data.data))}" class="circle">
                            <span class="title">${c
                                    .title}</span>
                            <p><strong class="badge-currency">${c
                                    .price}</strong></p>
                                <p class="short-decr">${c
                                    .short_description}</p>
                            
                            <div class="secondary-content">
                                                <button class="waves-effect waves-light btn red btn-remove-course" data-id="${c
                                    ._id}" data-csrf="${csrf}">
                                                    <i class="material-icons left">delete</i>Delete</button>
                                                    <button class="waves-effect waves-light btn modal-trigger" data-id="${c
                                    ._id}" data-target="modal1" data-csrf="${csrf}>
                                                    <i class="material-icons left">edit</i>Edit</button>
                                                    </div>
                      
                        </li>
                            `
                            })
                            .join('')
                        $courseList.innerHTML = html
                    } else {
                        $courseList.innerHTML = '<p>Course list is empty</p>'
                    }
                })
        }

        if(e.target.classList.contains('btn-course-edit')){
            const id = e.target.dataset.id
            const csrf = e.target.dataset.csrf
            const form = document.getElementById('course-edit')
            if (form) {
                form.remove()
            }

            fetch(`/admin/course/edit/${id}`, {
                method: 'GET',
                headers: {
                    'X-CSRF-TOKEN': csrf
                }
            })
                .then(res => res.json())
                .then(course => {
                    if (course.length) {

                        const content = course.map(c => {

                            console.log(c)
                            return `
                            <form
                            action="course/add"
                            method="POST"
                            enctype="multipart/form-data"
                            id="course-edit">
                            <h3>Edit course ${c.title}</h3>
                            <div class="input-field">
                                <input
                                    value="${c.title}"
                                    id="c-e-title"
                                    name="title"
                                    type="text"
                                    class="validate"
                                    required="required"
                                    data-length="30">
                                <label for="title" ${c.title ? `class="active"` : null}>Course name</label>
                                <span class="helper-text" data-error="Plase is not be empty"></span>
                            </div>
                            <div class="input-field">
                                <input
                                    value="${c.price}"
                                    id="c-e-price"
                                    name="price"
                                    type="number"
                                    class="validate"
                                    required="required"
                                    min="1">
                                <label for="price" ${c.price ? `class="active"` : null}>Pricing</label>
                                <span class="helper-text" data-error="Plase is not be empty"></span>
                            </div>
                            <div class="row">
                                <div class="input-field col s12 m6">
                                    <input value="${c.img}" id="c-e-img" name="img" type="text" class="validate">
                                    <label for="img" ${c.img ? `class="active"` : null}>Image URL</label>
                                    <span class="helper-text" data-error="Plase is not be empty"></span>
                                </div>
                
                                <div class="file-field input-field col s12 m6">
                                    <div class="btn">
                                        <span>File</span>
                                        <input type="file" multiple="multiple" name="file"></div>
                                    <div class="file-path-wrapper">
                                        <input
                                            class="file-path validate"
                                            type="text"
                                            name="file_extention"
                                            placeholder="Upload one or more files"></div>
                                </div>
                            </div>
                            <div class="input-field">
                                <textarea
                                    id="s_desc"
                                    name="short_description"
                                    cols="30"
                                    rows="10"
                                    class="validate materialize-textarea"
                                    required="required">${c.short_description}</textarea>
                                <label for="s_desc"${c.short_description ? `class="active"` : null}>Short description</label>
                                <span class="helper-text" data-error="Plase is not be empty"></span>
                            </div>
                            <input type="hidden" name="_id" value="${c._id}">
                            <input type="hidden" name="_csrf" value="${csrf}">
                
                        </form>
                            `
                        })
                        document
                            .querySelector('#modal-course-edit > .modal-content')
                            .insertAdjacentHTML('beforeend', content)
                    }
                })

        }
    })
}

if ($users) {
    $users.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-user-edit')) {
            const id = e.target.dataset.id
            const csrf = e.target.dataset.csrf
            const form = document.getElementById('user-edit')
            if (form) {
                form.remove()
            }

            fetch(`/admin/user/edit/${id}`, {
                method: 'GET',
                headers: {
                    'X-CSRF-TOKEN': csrf
                }
            })
                .then(res => res.json())
                .then(user => {
                    if (user.length) {

                        const content = user.map(u => {
                            return `<form
                       action="admin/user/update"
                       method="POST"
                       id="user-edit"
                       enctype="multipart/form-data">
           
                       <div class="input-field">
                           <input
                               value="${u.name}"
                               id="e-name"
                               name="name"
                               type="text"
                               class="validate">
                           <label for="name" class="active">Enter name</label>
                           <span class="helper-text" data-error="Plase is not be empty"></span>
                       </div>
                       <div class="input-field">
                           <input
                               value="${u.email}"
                               id="e-remail"
                               name="email"
                               type="email"
                               class="validate">
                           <label for="remail" class="active">Enter email</label>
                           <span class="helper-text" data-error="Plase is not be empty"></span>
                       </div>
                       <div class="input-field">
                           <input
                               value=""
                               id="e-rpassword"
                               name="password"
                               type="password"
                               class="validate">
                           <label for="rpassword">Enter passwords</label>
                           <span class="helper-text" data-error="Plase is not be empty"></span>
                       </div>
           
                       <div class="input-field">
                           <input
                               value=""
                               id="e-confirm"
                               name="confirm"
                               type="password"
                               class="validate">
                           <label for="confirm">Re-enter password</label>
                           <span class="helper-text" data-error="Plase is not be empty"></span>
                       </div>
           
                       <div class="file-field input-field">
                           <div class="btn">
                               <span>Avatar</span>
                               <input type="file" name="file"></div>
                           <div class="file-path-wrapper">
                               <input
                                   class="file-path validate"
                                   type="text"
                                   name="avatar_extention"
                                   placeholder="Upload one or more files"></div>
           
                       </div>
           
                       <div class="input-field">
                           <select id="e-role" name="role" value="${u.role}">
                           <option value="client" disabled selected>Choose your option</option>
                           <option value="root">Admin</option>
                           <option value="client">Client</option>
                           </select>
                           <label >Materialize Select</label>
                       </div>
                       <input type="hidden" name="_id" value="${id}">
                       <input type="hidden" name="_csrf" value="${csrf}">
           
                   </form>`
                        })
                        document
                            .querySelector('#modal-user-edit > .modal-content')
                            .insertAdjacentHTML('beforeend', content)
                    }
                })
                .then(next => {
                    M
                        .FormSelect
                        .init(document.getElementById('e-role'), {classes: 'active'});
                })

        }

        if (e.target.classList.contains('btn-user-remove')) {
            try {
                const id = e.target.dataset.id
                const csrf = e
                    .target
                    .dataset
                    .csrf

                    fetch(`/admin/user/remove/${id}`, {
                        method: 'delete',
                        headers: {
                            'X-CSRF-TOKEN': csrf
                        }
                    })
                    .then(res => res.json())
                    .then(user => {
                        const content = user
                            .map(u => {
                                console.log(u)
                                return `
                            <li class="collection-item avatar">
                        <img
                        
                            src="data:${u
                                    .avatar
                                    .contentType};base64,
                            ${String
                                    .fromCharCode
                                    .apply(null, new Uint8Array(u.avatar.data.data))}"
                            class="circle">
                        <span class="title">${u
                                    .role}</span>
                        <p>${u
                                    .name}<br>
                        ${u
                                    .email}
                        </p>
    
                        <button class="waves-effect waves-light btn red btn-user-remove" data-remove="${u
                                    ._id}">
                            <i class="material-icons left" data-id="${u
                                    ._id}" data-csrf="${csrf}">delete</i>Delete</button>
                        <button
                            class="waves-effect waves-light btn modal-trigger btn-user-edit"
                            data-id="${u
                                    ._id}"
                            data-target="modal-user-edit"
                            data-csrf="${csrf}">
                            <i class="material-icons left">edit</i>Edit</button>
    
                    </li>`
                            })
                            .join('')

                        document
                            .querySelector('#users > ul.collection')
                            .innerHTML = content

                    })
            } catch (error) {
                console.log(error)
            }
        }
    })
}

const modalEdit = document.getElementById('modal-user-edit')
if (modalEdit) {
    modalEdit.addEventListener('click', (e) => {
        console.log('qweq')
        if (e.target.dataset.submit) {

            const form = document.getElementById('user-edit')
            form.submit()
            form.remove()

        }
    })
}
