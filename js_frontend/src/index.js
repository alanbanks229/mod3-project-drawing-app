
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
    let publishedBtns = document.querySelectorAll('.post_button')
    publishedBtns.forEach(btn => btn.addEventListener('click', fetchAllDrawings))
    let aboutBtns = document.querySelectorAll('.about_button')
    aboutBtns.forEach(btn => btn.addEventListener('click', fetchAboutPage))
    let signUpBtn = document.querySelectorAll(".sign_up_button")[0]
    signUpBtn.addEventListener('click', signUpPage)
    let userDrawingBtn = document.querySelectorAll('.user_drawings_button')[0]
    userDrawingBtn.addEventListener('click', userShowPage )
    let pubUserDrawingBtn = document.querySelectorAll('.user_drawings_button')[1]
    pubUserDrawingBtn.addEventListener('click', is_user_logged_in)
    let submitBtn = document.getElementById('create_new_drawing')
    submitBtn.addEventListener('submit', (event) => processImage(event))
    let deleteBtn = document.querySelector('.remove_thy_self')
    deleteBtn.addEventListener('click', removeUser)
    let clearBtn = document.getElementById('clear_canvas')
    clearBtn.addEventListener('click', clearDrawingCanvas)

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
                maxParticles: 800,
              connectParticles: false
            }
          }]
        })
    }
})

function clearDrawingCanvas(){
  let draw_canvas = document.getElementById('imageView')
  let context = draw_canvas.getContext('2d')
  context.clearRect(0, 0, draw_canvas.width, draw_canvas.height)
}

//This method only applies for guest users who look at published page and attempt to view their own non-existent drawings
function is_user_logged_in(){
  debugger
  console.log("wtf bro")
  if (sessionStorage.getItem("id")){
    userShowPage()
  } else {
    alert("You need to create an account first to go here")
  }
}

function processImage(e){
  e.preventDefault()
  let canvas = document.getElementById('imageView')
  let imgData = canvas.toDataURL();
  document.getElementById('theImageData').value=imgData;
  save_or_publish(e, imgData)
}

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
    let i = 0
    acquireAllPages().forEach(page => {
        if (page.id === "login_page_container"){
            page.style.display = "block";
            console.log("login page")
            console.log(`We went into userLoginPage() call ${i} times`)
            i = i + 1
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
            console.log("sign up page")
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
        //See where this leads after you complete fetchUserDrawing
    } else {
        sessionStorage.setItem("id", new_user.user_id)
        sessionStorage.setItem("username", new_user.username)
        //debugger
        fetchUserDrawings()
    }
}

//Before calling this function... you have to call fetchUserDrawings
function userShowPage(user_images){
  acquireAllPages().forEach(page => {
      if (page.id === "user_drawings_show_page"){
              page.style.display = "block";
              console.log("Now on the users_show_page")
      } else {
              document.getElementById(`${page.id}`).style.display = "none";
      }
  })

  let h1 = document.getElementById('username_h1')
  h1.innerText = `Welcome ${sessionStorage.getItem("username")}. This is your show page`
  let div_container = document.getElementById('all_user_drawings')
  div_container.appendChild(user_images)
}


function createNewDrawing(){
    if (sessionStorage.getItem("id")){
      acquireAllPages().forEach(page => {
          if (page.id === "user_new_drawing_container"){
              page.style.display = "block";
              console.log("Now On Create Drawing Page")
          } else {
              document.getElementById(`${page.id}`).style.display = "none";
          }
      })
      //let div_container = document.getElementById('user_new_drawing_container')
      let greetingHeader = document.getElementById('username_drawpage_h1')
      greetingHeader.innerHTML = ""
      greetingHeader.innerText = `Welcome ${sessionStorage.getItem("username")}!`
      let draw_canvas = document.getElementById('imageView')
      let context = draw_canvas.getContext('2d')
      context.clearRect(0, 0, draw_canvas.width, draw_canvas.height)
    } else {
      alert("You must be logged in to use this feature")
    }
}

function save_or_publish(e, imgData){
    // After user creates drawing... make a new Fetch call to drawings database
    // after fetch call... 
    // imgdata is the imageDataURI
    console.log("inside save_or_publish function")
    e.preventDefault()
    newObj = {}
    newObj["title"] = e.currentTarget.querySelector('#title_input').value
    newObj["description"] = e.currentTarget.getElementsByTagName('textarea')[0].value
    newObj["image"] = imgData
    newObj["published"] = e.currentTarget.querySelector('#publish').checked //=> either true or false
    newObj["user_id"] = sessionStorage.getItem("id")

    fetch(DRAWING_URL, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newObj)
    })
    .then(resp => resp.json())
    .then(respJson => {
      if (respJson.status === 220){
        alert(respJson.message)
      } else {
        console.log(respJson)
        console.log(`Now we are about to call fetchUserDrawings()`)
        fetchUserDrawings()
      }
    })
}

function fetchUserDrawings(){
    console.log("inside fetchUserDrawings()... when this promise completes we call appendUserPicture(json_data)")
    fetch(`${USERS_URL}/${sessionStorage.id}`)
        .then(resp => resp.json())
        .then(json_data => {
          console.log(json_data)
          console.log("This must be the part where a duplicate is made... not sure why")
          appendUserPicture(json_data)
        })
}

//return this function and append it to all_user_drawings in showpage
function appendUserPicture(user_object){
  console.log(`${user_object.drawings.length} Is the number of drawings this user has` )
  console.log("We are finally in appendUserPicture(json_data)")
  let user_img_slides = document.getElementById("user_img_slides")
  user_img_slides.innerHTML = ""
  user_object.drawings.forEach( drawing => {
      let new_img = new Image();
      new_img.src = drawing.image
      new_img.className = "mySlides"
      user_img_slides.append(new_img)
  })
  userShowPage(user_img_slides)
}


function allDrawingsPage(div_containing_image_cards){

    acquireAllPages().forEach(page => {
        if (page.id === "all_users_published_drawings_container"){
            page.style.display = "block";
            console.log("All The Drawings Page")
        } else {
            document.getElementById(`${page.id}`).style.display = "none";
        }
    })
    
    let drawings_container = document.getElementById("container_for_all_pub_drawings_plus_content")
    drawings_container.innerHTML = "" //clearing our drawings page and rebuilding it
    drawings_container.appendChild(div_containing_image_cards)
    let canvas = document.querySelector(".background")
}

function fetchAllDrawings(){
  fetch(DRAWING_URL)
    .then(resp => resp.json())
    .then(drawing_arr => constructPublishedPage(drawing_arr))
}


// Lord help me... This function is essentially creating the page for
// All the Image cards we see on Published Drawings page.
function constructPublishedPage(drawing_arr){
    let parent_div = document.createElement('div')
    parent_div.className = "all_published_drawings"
    drawing_arr.forEach(drawing_object => {

      if (drawing_object.published === true){
        let ul_count = 0
        let drawing_card = document.createElement('div')
        drawing_card.className = "drawing_card"
        let creator_heading = document.createElement('h2')
        creator_heading.innerText = `Created By: ${drawing_object.user.username}`

        drawing_card.appendChild(creator_heading)

        let image_float_left_div = document.createElement('div')
        image_float_left_div.className = "publish_image_float_left"
          let img = new Image()
          img.className = "publishedPics"
          img.src = drawing_object.image
          let img_h2_title = document.createElement('h2')
          img_h2_title.innerText = `Title: ${drawing_object.title}`
          let p_description = document.createElement('p')
          p_description.innerText = `Description: ${drawing_object.description}`

          image_float_left_div.append(img, img_h2_title, p_description)

        let published_image_comments = document.createElement('div')
        published_image_comments.className = "published_image_comments"
          let commentsHeading = document.createElement('h4')
          commentsHeading.innerText = "Comments"
          let ul_comments = document.createElement('ul')
          ul_comments.className = "commentSection"
          ul_comments.dataset.ulId = ul_count
          ul_count = ul_count + 1
          let commentBtn = document.createElement('button')
          commentBtn.innerText = "New Comment"
          //debugger
          commentBtn.addEventListener('click', (event) => makeNewComment(event, `${drawing_object.user.username}`, ul_comments["dataset"].ulId, drawing_object.id))
          drawing_object.comments.forEach(comment => {
            let new_comment_li = document.createElement('li')
            let bold_element = document.createElement('B')
            let username_b = document.createTextNode(`${comment.user.username}: `)
            bold_element.appendChild(username_b)
            let comment_content = document.createElement('p')
            comment_content.innerText = `${comment.content}`
            new_comment_li.append(bold_element, comment_content) //How do I get username here
            ul_comments.appendChild(new_comment_li)
          })
          published_image_comments.append(commentsHeading, commentBtn, ul_comments)

          drawing_card.append(image_float_left_div, published_image_comments)
          parent_div.append(drawing_card)
        }
      allDrawingsPage(parent_div)
    })
}

function makeNewComment(e, publisher_username, ul_id, drawing_object_id){
  if (sessionStorage.getItem("id")){
    var txt;
    var input = prompt(`You are commenting on ${publisher_username}'s picture. What would you like to say?\n\n`, "");
    if (input == null || input == "") {
      txt = "User cancelled the prompt."
    } else {
      txt = input
    }
    let new_li = document.createElement('li')
    let target_ul = document.querySelector("[data-ul-id=\"" + `${ul_id}` + "\"]")
    new_li.innerText = input
    debugger
    target_ul.appendChild(new_li)
  
    newObj = {}
    newObj["content"] = input
    newObj["user_id"] = sessionStorage.getItem("id")
    newObj["drawing_id"] = drawing_object_id
    //adding comment to database
    fetch(COMMENTS_URL, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newObj)
    })
  } else {
    alert("\n* * * You must be logged in to make a comment!* * *")
  }
}

function removeUser(){
  debugger
    let userId = sessionStorage["id"]
    fetch(`${USERS_URL}/${userId}`, {
        method: "DELETE"
    })
    .then(resp => resp.json())
    .then(resp => console.log(resp))
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
************ DRAWING CODEEEE *************
*/

if(window.addEventListener) {
	window.addEventListener('load', function () {
    let colorInput = document.getElementById('favcolor')
	  var canvas, context, canvaso, contexto;
	
	  // The active tool instance.
	  var tool;
	  var tool_default = 'pencil';
	
	  function init () {
		// Find the canvas element.
		canvaso = document.getElementById('imageView');
		if (!canvaso) {
		  alert('Error: I cannot find the canvas element!');
		  return;
		}
		if (!canvaso.getContext) {
		  alert('Error: no canvas.getContext!');
		  return;
		}
		// Get the 2D canvas context.
		contexto = canvaso.getContext('2d');
		if (!contexto) {
		  alert('Error: failed to getContext!');
		  return;
		}
		// Add the temporary canvas.
		var container = canvaso.parentNode;
		canvas = document.createElement('canvas');
		if (!canvas) {
		  alert('Error: I cannot create a new canvas element!');
		  return;
		}
		canvas.id     = 'imageTemp';
		canvas.width  = canvaso.width;
		canvas.height = canvaso.height;
		container.appendChild(canvas);
		context = canvas.getContext('2d');
		// Get the tool select input.
		var tool_select = document.getElementById('dtool');
		if (!tool_select) {
		  alert('Error: failed to get the dtool element!');
		  return;
		}
		tool_select.addEventListener('change', ev_tool_change, false);
		// Activate the default tool.
		if (tools[tool_default]) {
		  tool = new tools[tool_default]();
		  tool_select.value = tool_default;
		}
		// Attach the mousedown, mousemove and mouseup event listeners.
		canvas.addEventListener('mousedown', ev_canvas, false);
		canvas.addEventListener('mousemove', ev_canvas, false);
		canvas.addEventListener('mouseup',   ev_canvas, false);
	  }
	  // The general-purpose event handler. This function just determines the mouse 
	  // position relative to the canvas element.
	  function ev_canvas (ev) {
		if (ev.layerX || ev.layerX == 0) { // Firefox
		  ev._x = ev.layerX;
		  ev._y = ev.layerY;
		} else if (ev.offsetX || ev.offsetX == 0) { // Opera
		  ev._x = ev.offsetX;
		  ev._y = ev.offsetY;
		}
		// Call the event handler of the tool.
		var func = tool[ev.type];
		if (func) {
		  func(ev);
		}
	  }
	  // The event handler for any changes made to the tool selector.
	  function ev_tool_change (ev) {
		if (tools[this.value]) {
		  tool = new tools[this.value]();
		}
	  }
	  // This function draws the #imageTemp canvas on top of #imageView, after which 
	  // #imageTemp is cleared. This function is called each time when the user 
	  // completes a drawing operation.
	  function img_update () {
			contexto.drawImage(canvas, 0, 0);
			context.clearRect(0, 0, canvas.width, canvas.height);
	  }
	  // This object holds the implementation of each drawing tool.
	  var tools = {};
	  // The drawing pencil.
	  tools.pencil = function () {
		var tool = this;
		this.started = false;
		// This is called when you start holding down the mouse button.
		// This starts the pencil drawing.
		this.mousedown = function (ev) {
			context.beginPath();
			context.moveTo(ev._x, ev._y);
			tool.started = true;
		};
		// This function is called every time you move the mouse. Obviously, it only 
		// draws if the tool.started state is set to true (when you are holding down 
		// the mouse button).
		this.mousemove = function (ev) {
		  if (tool.started) {
      context.lineTo(ev._x, ev._y);
      context.strokeStyle = colorInput.value
			context.stroke();
		  }
		};
		// This is called when you release the mouse button.
		this.mouseup = function (ev) {
		  if (tool.started) {
			tool.mousemove(ev);
			tool.started = false;
			img_update();
		  }
		};
	  };
	  // The rectangle tool.
	  tools.rect = function () {
		var tool = this;
		this.started = false;
		this.mousedown = function (ev) {
		  tool.started = true;
		  tool.x0 = ev._x;
		  tool.y0 = ev._y;
		};
		this.mousemove = function (ev) {
		  if (!tool.started) {
			return;
		  }
		  var x = Math.min(ev._x,  tool.x0),
			  y = Math.min(ev._y,  tool.y0),
			  w = Math.abs(ev._x - tool.x0),
			  h = Math.abs(ev._y - tool.y0);
		  context.clearRect(0, 0, canvas.width, canvas.height);
		  if (!w || !h) {
			return;
      }
      context.strokeStyle = colorInput.value
		  context.strokeRect(x, y, w, h);
		};
		this.mouseup = function (ev) {
		  if (tool.started) {
			tool.mousemove(ev);
			tool.started = false;
			img_update();
		  }
		};
	  };
	  // The line tool.
	  tools.line = function () {
		var tool = this;
		this.started = false;
		this.mousedown = function (ev) {
		  tool.started = true;
		  tool.x0 = ev._x;
		  tool.y0 = ev._y;
		};
		this.mousemove = function (ev) {
		  if (!tool.started) {
			return;
		  }
		  context.clearRect(0, 0, canvas.width, canvas.height);
		  context.beginPath();
		  context.moveTo(tool.x0, tool.y0);
      context.lineTo(ev._x,   ev._y);
      context.strokeStyle = colorInput.value
		  context.stroke();
		  context.closePath();
		};
		this.mouseup = function (ev) {
		  if (tool.started) {
			tool.mousemove(ev);
			tool.started = false;
			img_update();
		  }
		};
	  };
	  init();
	}, false); }