if (document.deviceready) {
    document.addEventlistener('deviceready', onDeviceReady);
} else {
    document.addEventListener('DOMContentLoaded', onDeviceReady)
}

var currentReview = 0;
var storedReview = [];
var key = "reviewr-desj0251";
var currentimage = "";

var rating = 3;
var stars = null;

function onDeviceReady(){
    
    if (!localStorage.getItem(key)) {
        console.log("No saved data");
        localStorage.setItem(key, JSON.stringify(storedReview));
    } else {
        console.log("Retrieving Local Storage Data: ");
        storedReview = JSON.parse(localStorage.getItem(key));
        console.log(storedReview);
    }
    
    stars = document.querySelectorAll('.star');
    addListeners();
    setRating(); //based on global rating variable value
    
    document.getElementById("delete").addEventListener("click", function(){ deleteReview(); });
    document.getElementById("picture").addEventListener("click", function(){ takePicture(); });
    document.getElementById("save").addEventListener("click", function(){ saveReviews(); });
    document.getElementById("cancel").addEventListener("click", function(){ toggleDisplay(); });
    document.getElementById("add").addEventListener("touchstart", function(){ hitAddReview(); });
    displayReviews();
}

function addListeners(){
  [].forEach.call(stars, function(star, index){
    star.addEventListener('click', (function(idx){
      console.log('adding listener', index);
      return function(){
        rating = idx + 1;  
        console.log('Rating is now', rating)
        setRating();
      }
    })(index));
  });
  
}

function setRating(){
  [].forEach.call(stars, function(star, index){
    if(rating > index){
      star.classList.add('rated');
      console.log('added rated on', index );
    }else{
      star.classList.remove('rated');
      console.log('removed rated on', index );
    }
  });
}

function takePicture() {
    
    var options = {
        quality: 80,
        destinationType: Camera.DestinationType.DATA_URL,
        encodingType: Camera.EncodingType.PNG,
        mediaType: Camera.MediaType.PICTURE,
        pictureSourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        targetWidth: 300,
        targetHeight: 300
    }
    
    function successCallback(img_URI){
        currentimage = document.getElementById('myImage');
        currentimage.classList.add("bigpic");
        currentimage.src = "data:image/jpeg;base64," + img_URI;
        console.log(currentimage.src);
        togglePicButton();
    }

    function errorCallback(){
        console.log("Picture failure");
    }
    
    navigator.camera.getPicture( successCallback, errorCallback, options );
    
}

function hitAddReview() {
    currentimage = "";
    rating = 3;
    setRating();
    var picbtnAdd = document.getElementById("picture");
    picbtnAdd.style.display = "block";
    var picimgAdd = document.getElementById("myImage");
    picimgAdd.style.display = "none";
    var savebtnAdd = document.getElementById("save");
    savebtnAdd.style.display = "none";
    document.getElementById("name").value = "";
    document.getElementById("stars").value = "";
}

function saveReviews(){
    
    var name = "";
    if (document.getElementById("name").value == "") { name = "No Title" }
    else { name = document.getElementById("name").value; }
    
    var newImage = currentimage.src;
    
    var newReview = {
        id: Date.now(),
        name: name,
        stars: rating,
        img: newImage
    };
        
    // Push and save newContact
    storedReview.push(newReview);
    localStorage.setItem(key, JSON.stringify(storedReview));
    
    toggleDisplay();
    displayReviews();
}

function displayReviews(){
    
    var ul = document.getElementById("contact-list");
    ul.innerHTML = "";
    
    storedReview.forEach(function (value) {
        
        var listItem = document.createElement("li");
            listItem.classList.add("table-view-cell");
        var span = document.createElement("span");
            span.classList.add("name");
        var a1 = document.createElement("p");
            a1.classList.add("name");
            a1.setAttribute("id", name);
            a1.setAttribute("review-id", value.id);
            a1.innerHTML = value.name;
     
        var spanStars = document.createElement("span");
            var string = "";
            for (var i = 0; i < value.stars; i++){
                string += "<span class=\"icon icon-star-filled\"></span>";
            }
        var img = document.createElement("img");
            img.classList.add("pull-left");
            img.classList.add("thumb");
            img.src = value.img;
      
        img.addEventListener("touchend", function(ev){
            toggleReviewModal();
        })
        
            spanStars.classList.add("stars");
            spanStars.innerHTML = string;
        
            span.appendChild(a1);
            span.appendChild(spanStars);
            listItem.appendChild(img);
            listItem.appendChild(span);
           
            ul.appendChild(listItem);
        
        listItem.addEventListener("touchstart", function(ev){
                currentReview = a1.getAttribute("review-id");
                console.log(currentReview);
                //toggleReviewModal();
        })
        
    })
                         
}

function showreview(){
    
    var reviewdiv = document.getElementById("showreview");
    reviewdiv.innerHTML = "";
    
    var revimg = document.createElement("img");
        revimg.classList.add("bigpic");
    var revname = document.createElement("h2");
    var revstars = document.createElement("h3");
    var starstring = "";
    storedReview.forEach(function (value, index) {
        if(value.id == currentReview){
            revimg.src = value.img;
            revname.innerHTML = value.name;
            for (var i = 0; i < value.stars; i++){
                starstring += "<span class=\"icon icon-star-filled\"></span>";
            }
            revstars.innerHTML = starstring;
        }
    })
    reviewdiv.appendChild(revname);
    reviewdiv.appendChild(revstars);
    reviewdiv.appendChild(revimg);
}

function togglePicButton(){
    var picbtn = document.getElementById("picture");
    picbtn.style.display = "none";
    var picimg = document.getElementById("myImage");
    picimg.style.display = "block";
    var savebtn = document.getElementById("save");
    savebtn.style.display = "block";
}

function toggleReviewModal(){
    console.log("click");
    var reviewform = document.querySelector("#deleteModal");
    reviewform.classList.toggle("active");
    showreview();
}

function toggleDisplay(){
    var contactform = document.querySelector("#addModal");
    contactform.classList.toggle("active");
}

function deleteReview(){
    storedReview.forEach(function (value, index){
        if(currentReview == value.id){
            storedReview.splice(index, 1);
            localStorage.setItem(key, JSON.stringify(storedReview));
            displayReviews();
            toggleReviewModal();
        }  
    })
}