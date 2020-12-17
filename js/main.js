"use strict";

let imgsObjects = []; // Holds objects for each uploaded image.
let totalLikes = 0;

/**
 * Object for user uploaded images.
 * Holds information about the image such as name, last modified date and the igm description.
 */
class ImgObject {
  constructor(name, imgUrl, unix, date, description) {
    this.imgUrl = imgUrl;
    this.unix = unix;
    this.date = date;
    this.description = description;
    this.name = name;
  }
}

/**
 * Eventlistener for html element input file.
 * Listens for changes, i.e when we load a new file.
 * Creates a html img element and sets file objectUrl (blob) as the src.
 * Adds the img element to array and creates
 */
window.addEventListener("load", function () {
  document
    .querySelector('input[type="file"]')
    .addEventListener("change", function () {
      if (this.files && this.files[0]) {
        const imgSrc = URL.createObjectURL(this.files[0]); // Get img src as blob url

        const galleryItem = createGalleryItem(imgSrc);

        const usrText = "Image Description"; // Default img description.

        // Create new ImgObject and sotre it in imgsObjects array.
        imgsObjects.push(
          new ImgObject(
            this.files[0].name,
            imgSrc,
            this.files[0].lastModified,
            this.files[0].lastModifiedDate,
            usrText
          )
        );

        const gallery = document.getElementById("gallery");
        gallery.appendChild(galleryItem);
        gallery.scrollIntoView();
      }
    });
});

/**
 * Event listener for sort button. Sorts images conatined in imgsObjects and displays them in new order on screen.
 * @type {html-element} sortButton - Html Button with id sortButton.
 */
(function () {
  const sortButton = document.getElementById("sort");
  sortButton.addEventListener("click", () => {
    if (imgsObjects && imgsObjects.length > 1) {
      sortButton.classList.toggle("rev");
      if (sortButton.className == "iconButtons rev") {
        imgsObjects.sort((a, b) => (a.unix < b.unix ? 1 : -1));
      } else {
        imgsObjects.sort((a, b) => (a.unix > b.unix ? 1 : -1));
      }

      const galleryImgs = document.getElementsByTagName("img"); // Will not work if we add additional img elements to the html code.
      if (galleryImgs.length > 0) {
        for (let i = 0; i < galleryImgs.length; i++) {
          galleryImgs[i].src = imgsObjects[i].imgUrl;
        }
      }
    }
  });
})();

// Eventlistener for add descripton btn.
function imgAddDescription(btn) {
  console.log("hey");
  btn.addEventListener("click", (event) => {
    const usrDescription = prompt("Enter a description about the image");

    // Make this function outside!
    const imgIndex = imgsObjects.findIndex(({ imgUrl }) => {
      return (
        imgUrl === event.target.parentElement.getElementsByTagName("img")[0].src
      );
    });

    imgsObjects[imgIndex].description = usrDescription;
  });
}

// Eventlistener for "show-description" button.
function imgShowDescription(btn) {
  btn.addEventListener("click", (event) => {
    const galleryItem = event.target.parentElement;
    const imgObject = imgsObjects.find(({ imgUrl }) => {
      return imgUrl == galleryItem.getElementsByTagName("img")[0].src;
    });
    console.log(imgObject.description);
  });
}

function imgDelete(btn) {
  btn.addEventListener("click", (event) => {
    const galleryItem = event.target.parentElement;
    const imgIndex = imgsObjects.findIndex(({ imgUrl }) => {
      return (
        imgUrl === event.target.parentElement.getElementsByTagName("img")[0].src
      );
    });
    URL.revokeObjectURL(imgsObjects[imgIndex].imgUrl);
    imgsObjects.splice(imgIndex, 1);
    galleryItem.remove();
  });
}

function imgLike(btn) {
  let isLiked = false;
  btn.addEventListener("click", () => {
    isLiked = !isLiked;
    console.log(isLiked);
    if(isLiked ? totalLikes++ : totalLikes--);
    document.getElementById("heartCounter").innerHTML = totalLikes;
    btn.classList.toggle("heartStyle");
  });
}




function imgEnlarge(elementBtn, srcImg){
let modelImg = document.getElementById("modalImg");
let modelBackground = document.getElementById("myModal");
elementBtn.addEventListener("click", () =>{
    console.log("click working");
      modelBackground.style.display = "block";
      modelImg.src = srcImg;
      
      
});


}

function imgClose(crossBtn){
let modelBackground = document.getElementById("myModal");

  crossBtn.addEventListener("click", ()=>{
    modelBackground.style.display = "none";


  });



}






// Create Gallery Item and all its children.
function createGalleryItem(imgSrc) {
  //Create div with class of gallery-item.
  const galleryItem = document.createElement("div");
  galleryItem.setAttribute("class", "gallery-item");

  // Create img element and set src as imgSrc
  const imgElement = document.createElement("img");
  imgElement.src = imgSrc;
  galleryItem.appendChild(imgElement);

  //Create button for adding description to the img.
  //Give it class name of 'add-description-btn'.
  const addDescriptionBtn = document.createElement("button");
  addDescriptionBtn.textContent = "Add";
  addDescriptionBtn.setAttribute("class", "add-description-btn");
  galleryItem.appendChild(addDescriptionBtn);
  imgAddDescription(addDescriptionBtn);


  //Primarily for debugging purposes. Reuse logic to show description later.
  const showDescriptionBtn = document.createElement("button");
  showDescriptionBtn.setAttribute("class", "show-description");
  showDescriptionBtn.textContent = "Show";
  galleryItem.appendChild(showDescriptionBtn);
  imgShowDescription(showDescriptionBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("class", "delete-img");
  deleteBtn.textContent = "Delete";
  galleryItem.appendChild(deleteBtn);
  imgDelete(deleteBtn);

  const likeButton = document.createElement("button");
  likeButton.innerHTML = '<i class="far fa-heart"></i>'; // Use set attribute. No <i> tag.
  likeButton.setAttribute("class", "like");
  imgLike(likeButton);
  galleryItem.appendChild(likeButton);

  
  
  const crossImg = document.createElement("p");              
  crossImg.setAttribute("class", "close");
  crossImg.insertAdjacentHTML('afterbegin', '&times;');
  
  

  const imgButton = document.createElement("img");
  imgButton.setAttribute("class", "modal-content");
  imgButton.setAttribute("id", "modalImg");
  

  const imgBackground = document.createElement("div");
  imgBackground.setAttribute("class", "modal");
  imgBackground.setAttribute("id", "myModal");

  document.body.appendChild(imgBackground);
  imgBackground.appendChild(imgButton);
  imgBackground.appendChild(crossImg);


  imgEnlarge(imgElement, imgElement.src);
  imgClose(crossImg);
  
  
  

  return galleryItem;
}
