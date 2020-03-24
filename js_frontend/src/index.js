
const BASE_URL = "http://localhost:3000"
const USERS_URL = `${BASE_URL}/users`
const COMMENTS_URL = `${BASE_URL}/comments`
const DRAWING_URL = `${BASE_URL}/drawings`
const SESSIONS_URL = `${BASE_URL}/sessions`

//I will be referencing the below a lot to switch between hidden and block display

// page_array will be called in each btn function call and will iterate through this
// array in order to change what it's display mode is. 


document.addEventListener("DOMContentLoaded", ()=> {
    let new_drawing_btns = document.querySelectorAll('.new_drawing_button')
    new_drawing_btns.forEach(btn => btn.addEventListener('click', createNewDrawing))

    let loginBtns = document.querySelectorAll('.login_button')
    loginBtns.forEach(btn => btn.addEventListener('click', userLoginPage))

    let logoutBtns = document.querySelectorAll('.logout_button')
    logoutBtns.forEach(btn => btn.addEventListener('click', clearSession))
    let postBtns = document.querySelectorAll('.post_button')
    postBtns.forEach(btn => btn.addEventListener('click', allDrawingsPage))
    let aboutBtns = document.querySelectorAll('.about_button')
    aboutBtns.forEach(btn => btn.addEventListener('click', fetchAboutPage))
    let signUpBtn = document.querySelectorAll(".sign_up_button")[0]
    signUpBtn.addEventListener('click', signUpPage)
    let userDrawingBtns = document.querySelectorAll('.user_drawings_button')[0]
    userDrawingBtns.addEventListener('click', userShowPage )
    fetchAboutPage()
    window.onload = function() {
        Particles.init({
            selector: '.background',
          color: ['#1258DC', '#FB8604'],
          connectParticles: true,
          responsive: [{
              breakpoint: 800,
            options: {
                color: '#00C9B1',
                maxParticles: 80,
              connectParticles: false
            }
          }]
        })
    }
})
 
function clearSession(){
    sessionStorage.clear()
    fetchAboutPage()
}

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
    loginForm.addEventListener('submit', (event) => validateLogin(event))
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
    submitForm.addEventListener('submit', (event) => validateUserCreation(event))
}

function validateLogin(e){
    e.preventDefault()
    userObj = {}
    userObj["username"] = e.currentTarget.querySelector('#login_username').value
    userObj["password"] = e.currentTarget.querySelector('#login_password').value
    fetch(SESSIONS_URL, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(userObj)
    })
    .then(resp => resp.json())
    .then(resp => {
        if (resp.status === 220){
            alert(resp.message)
            userLoginPage()            
        } else {
            return createSession(resp)
        }
    }) //{id: 18, username: "testing123", password_digest: ... }
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
    .then(resp => resp.json())
    .then(respJson => {
        if (respJson.status === 220){
            alert(respJson.message)
            signUpPage()
        } else {
            return createSession(respJson)
        }
    })
}

// coming from login our new_user is => new_user = {user_id: 37, username: "Alan"}
// coming from signup our new_user is => new_user = {id: 42, username: "Bob Doe"}
function createSession(new_user){

    if (new_user.id){
        sessionStorage.setItem("id", new_user.id)
        sessionStorage.setItem("username", new_user.username)
        createNewDrawing()
    } else {
        sessionStorage.setItem("id", new_user.user_id)
        sessionStorage.setItem("username", new_user.username)
        userShowPage()
    }
}
function createNewDrawing(){
    //After creating an account make a pop-up saying You have no drawings yet
    //Create a new drawing!
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
    let greetingHeader = document.getElementById('username_drawpage_h1')
    greetingHeader.innerHTML = ""
    greetingHeader.innerText = `Welcome ${sessionStorage.getItem("username")}!`
    
    //Let's get newbie paragraph to show up if user's drawings.length === 0
    // let newbie_paragraph = document.createElement('p')
    // newbie_paragraph.innerText = "Let's get you started off by creating a drawing\n You can choose either to publish it now or save it to work on for later!"
    // div_container.append(greetingHeader, newbie_paragraph)
    
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
    
    let drawings_container = document.getElementsByClassName("all_published_drawings")[0]
    
}

function userShowPage(){

    acquireAllPages().forEach(page => {
        if (page.id === "user_drawings_show_page"){
                page.style.display = "block";
                console.log("login page")
        } else {
                document.getElementById(`${page.id}`).style.display = "none";
        }
    })

    let h1 = document.getElementById('username_h1')
    h1.innerText = `Welcome ${sessionStorage.getItem("username")}. This is your show page`
    let div_container = document.getElementById('all_user_drawings')
    //fetchUserDrawings()

}
function fetchUserDrawings(){
    debugger
    //check to see if sessionStorage is still working here
    //fetch(USERS_URL)
}

function fetchAllDrawings(){

}

function removeUser(){
    debugger
    let userId = sessionStorage("id").value
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


//ehhh i should get rid of these as global variable stuff

var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("mySlides");
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length} ;
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  x[slideIndex-1].style.display = "block";
}




/*
************ DRAWING CODEEEE *************
*/

// function start (e) {
//   isDrawing = true;
//   draw(e);
// }

// function draw ({clientX: x, clientY: y}) {
//   if (!isDrawing) return;
//   ctx.lineWidth = stroke_weight.value;
//   ctx.lineCap = "round";
//   ctx.strokeStyle = color_picker.value;

//   ctx.lineTo(x, y);
//   ctx.stroke();
//   ctx.beginPath();
//   ctx.moveTo(x, y);
// }

// function stop () {
//   isDrawing = false;
//   ctx.beginPath();
// }

// function clearCanvas () {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
// }

// window.addEventListener('resize', resizeCanvas);
// function resizeCanvas () {
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
// }
// resizeCanvas();