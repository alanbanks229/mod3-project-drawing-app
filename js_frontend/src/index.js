
const BASE_URL = "http://localhost:3000"
const USERS_URL = `${BASE_URL}/users`
const COMMENTS_URL = `${BASE_URL}/comments`
const DRAWING_URL = `${BASE_URL}/drawings`
const SESSIONS_URL = `${BASE_URL}/sessions`

//I will be referencing the below a lot to switch between hidden and block display

// page_array will be called in each btn function call and will iterate through this
// array in order to change what it's display mode is. 


document.addEventListener("DOMContentLoaded", ()=> {
    fetchAboutPage()
    let new_drawing_btns = document.querySelectorAll('.new_drawing_button')
    new_drawing_btns.forEach(btn => btn.addEventListener('click', createNewDrawing))
    let loginBtns = document.querySelectorAll('.login_button')
    loginBtns.forEach(btn => btn.addEventListener('click', userLoginPage))
    let logoutBtns = document.querySelectorAll('.logout_button')
    logoutBtns.forEach(btn => btn.addEventListener('click', userLoginPage))
    let postBtns = document.querySelectorAll('.post_button')
    postBtns.forEach(btn => btn.addEventListener('click', allDrawingsPage))
    let aboutBtns = document.querySelectorAll('.about_button')
    aboutBtns.forEach(btn => btn.addEventListener('click', fetchAboutPage))
    let signUpBtn = document.querySelectorAll(".sign_up_button")[0]
    signUpBtn.addEventListener('click', signUpPage)
    let userDrawingBtns = document.querySelectorAll('.user_drawings_button')[0]
    userDrawingBtns.addEventListener('click', userShowPage )
})

function fetchAboutPage(){
    acquireAllPages().forEach(page => {
        if (page.id === "about_container"){
            page.style.display = "block";
            console.log("about page")
        } else {
            document.getElementById(`${page.id}`).style.display = "none";
        }
    })
}

function userLoginPage(){
    document.getElementById('login_form').reset()
    acquireAllPages().forEach(page => {
        if (page.id === "login_page_container"){
            page.style.display = "block";
            console.log("login page")
        } else {
            document.getElementById(`${page.id}`).style.display = "none";
        }
    })
    let loginForm = document.getElementById("login_form")
    loginForm.addEventListener('submit', (event) => getUserObject(event))
}

function getUserObject(event){
    //Why do I need event.preventDefault here... in order to prevent
    //catch error from occuring
    event.preventDefault()
    let newObj = {}
    username = event.currentTarget.querySelector('#login_username').value
    password = event.currentTarget.querySelector('#login_password').value
    newObj["username"] = username
    newObj["password"] = password
    fetch(SESSIONS_URL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newObj)
    })
        .then(resp => {
            if(resp.status === 200){
                return resp.json();
            }
        })
        .then(user_obj => userShowPage(user_obj)
            //console.log(desired_user) //=> {user_id: 17} //refer too sessions_controller
        )
        .catch((error) => {
            userLoginPage()
            alert("That combination of username and password is invalid")
        })
}
    
function userShowPage(user_obj){
    acquireAllPages().forEach(page => {
        if (page.id === "user_drawings_show_page"){
                page.style.display = "block";
                console.log("login page")
        } else {
                document.getElementById(`${page.id}`).style.display = "none";
        }
    })
    let h1 = document.getElementById('username_h1')
    h1.innerText = `Welcome ${user_obj.username}. This is your show page`
    let div_container = document.getElementById('user_drawings_show_page')
}

function signUpPage(){
    acquireAllPages().forEach(page => {
        if (page.id === "create_user_form_container"){
            page.style.display = "block";
            console.log("about page")
        } else {
            document.getElementById(`${page.id}`).style.display = "none";
        }
    })
    let submitForm = document.getElementById("create_user_form")
    submitForm.reset()
    submitForm.addEventListener('submit', validateUserCreation)
}

function validateUserCreation(e){
    e.preventDefault()
    let username = e.currentTarget.children[1].value
    //debugger
    let password = e.currentTarget.children[4].value
    //making fetch call... this goes to create method in user_controller
    let newUserObj = {}
    newUserObj["username"] = username
    newUserObj["password"] = password
    console.log(newUserObj)
    fetch(USERS_URL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUserObj)
    })
}

function createNewDrawing(e){
    //After creating an account make a pop-up saying You have no drawings yet
    //Create a new drawing!
    let username = e.currentTarget.children[1].value
    acquireAllPages().forEach(page => {
        if (page.id === "user_new_drawing_container"){
            page.style.display = "block";
            console.log("about page")
        } else {
            document.getElementById(`${page.id}`).style.display = "none";
        }
    })
    //targetting event listener here
    let div_container = document.getElementById('user_new_drawing_container')
    let greetingHeader = document.createElement('h1')
    greetingHeader.innerText = `Welcome ${username}!`
    let noob_paragraph = document.createElement('p')
    noob_paragraph.innerText = "Let's get you started off by creating a drawing\n You can choose either to publish it now or save it to work on for later!"
    div_container.append(greetingHeader, noob_paragraph)
    
    let submitBtn = document.getElementById('create_new_drawing')
    submitBtn.addEventListener('submit', (event) => save_or_publish(event))
    
}

function save_or_publish(e){
    // After user creates drawing... make a new Fetch call to drawings database
    // after fetch call... 

    e.preventDefault()
    if (e.currentTarget.querySelector('#publish').checked === false){
        userShowPage(e)
        console.log("The User Selected To Save and work on it later")
    } else {
        allDrawingsPage(e)
        console.log("The user selected Publish")
    }
}

function allDrawingsPage(drawing_form){
    acquireAllPages().forEach(page => {
        if (page.id === "all_users_published_drawings_container"){
            page.style.display = "block";
            console.log("All The Drawings Page")
        } else {
            document.getElementById(`${page.id}`).style.display = "none";
        }
    })
}

function removeUser(event){
    let userId = event.curretTarget.dataset.userId

    fetch(`${USERS_URL}/${userId}`, {
        method: "DELETE"
    })

    fetchAboutPage()
}

function acquireAllPages(){

    const about_page = document.getElementById('about_container')
    const login_page = document.getElementById('login_page_container')
    const create_user_page = document.getElementById('create_user_form_container')
    const new_draw_page = document.getElementById('user_new_drawing_container')
    const user_drawings_page = document.getElementById('user_drawings_show_page')
    const all_drawings_page = document.getElementById('all_users_published_drawings_container')

    let page_array = [
        about_page,
        login_page,
        create_user_page,
        new_draw_page,
        user_drawings_page,
        all_drawings_page
    ]

    return page_array
}

/*
 display: none removes the element completely from the document. it doesn't take up any space

 to show div again you do

 <div id="id_name" style="display:block">

*/