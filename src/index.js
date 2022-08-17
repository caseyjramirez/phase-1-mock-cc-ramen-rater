const d = document;
const ramenMenu = d.getElementById('ramen-menu');
const ramenForm = d.getElementById('new-ramen')
const ramenDetail = d.getElementById('ramen-detail');
const rating = d.querySelectorAll('h3')[2]
const comment = d.querySelectorAll('h3')[3]
const ratingText = d.getElementById('rating-display').parentNode;
const commentText = d.getElementById('comment-display');
const editRamen = d.getElementById('edit-ramen');
const deleteRamen = d.getElementById('del-btn');
const ramenURL = 'http://localhost:3000/ramens';

let initialLoad = true;
let ramenId;

/*
-------------- FETCH FUNCITONS --------------
*/

function getResources(url) {
    return fetch(url).then(res => res.json())
}

function postResources(url, body) {
    return fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(res => res.json())
}

function updateResources(url, body) {
    return fetch(url, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(res => res.json())
}

function deleteResources(url) {
    return fetch(url, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
}

/*
-------------- FUNCITONS --------------
*/

function clearRamens() {
    while (ramenMenu.firstChild) ramenMenu.lastChild.remove()
}

function renderOnPageLoad(data) {
    if(!initialLoad) return
    initialLoad = false;

    handleImageClick(data)
}

function getRamens() {
    clearRamens()

    getResources(ramenURL)
    .then(res => {
        res.forEach(renderRamen)
        renderOnPageLoad(res[0]);
    })
    
}

function hideRamenDetails() {
    ramenDetail.style.display = "none"
    rating.style.display = "none"
    comment.style.display = "none"
    ratingText.style.display = "none"
    commentText.style.display = "none"
}

function showRamenDetails() {
    ramenDetail.style.display = "block"
    rating.style.display = "block"
    comment.style.display = "block"
    ratingText.style.display = "block"
    commentText.style.display = "block"    
}

function hideEditRamenForm() {
    editRamen.style.display = "none"
    deleteRamen.style.display = "none"
}

function showEditRamenForm() {
    editRamen.style.display = "block"
    deleteRamen.style.display = "block"
}

/*
-------------- EVENT HANDLERS --------------
*/

function handleImageClick(data) {
    
    const image = d.querySelector('#ramen-detail > .detail-image');
    const name = d.querySelector('#ramen-detail > .name');
    const restaurant = d.querySelector('#ramen-detail > .restaurant');
    image.src = data.image;
    name.textContent = data.name;
    restaurant.textContent = data.restaurant
    ratingText.textContent = `${data.rating} / 10`
    commentText.textContent = data.comment
    
    ramenId = data.id

    showRamenDetails()
    showEditRamenForm()
}

function handleSubmit(e) {
    e.preventDefault();
    
    // grab input fields
    const name = e.target.name.value
    const restaurant = e.target.restaurant.value
    const image = e.target.image.value
    const rating = e.target.rating.value
    const newComment = e.target['new-comment'].value

    // create elements
    const newRamen = {
        name, restaurant, image, rating, 
        comment: newComment
    }

    postResources(ramenURL, newRamen)
    .then(renderRamen(newRamen))
}

function handleEdit(e, id) {
    e.preventDefault();

    const rating = e.target.rating.value
    const newComment = e.target['new-comment'].value

    const editRamen = {
        rating, 
        comment: newComment
    }

    updateResources(`${ramenURL}/${id}`, editRamen)
    .then(res => handleImageClick(res));
}

function handleDelete(id) {
    deleteResources(`${ramenURL}/${id}`)
    .then(() => {
        hideRamenDetails()
        hideEditRamenForm();
    })
    .then(getRamens);
}

/*
-------------- RENDER FUNCITONS --------------
*/
function renderRamen(data) {
    const img = d.createElement('img')
    img.src = data.image;
    img.addEventListener('click', () => handleImageClick(data))
    ramenMenu.append(img)
}



/*
-------------- FUNCITONS INVOKATION --------------
*/
getRamens()
hideRamenDetails()
hideEditRamenForm();
ramenForm.addEventListener('submit', handleSubmit)
editRamen.addEventListener('submit', (e) => handleEdit(e, ramenId))
deleteRamen.addEventListener('click', () => handleDelete(ramenId))