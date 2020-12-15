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

quickTest();

function quickTest() {
  document
    .getElementById("gallery")
    .appendChild(
      createGalleryItem(
        "https://images.unsplash.com/reserve/bOvf94dPRxWu0u3QsPjF_tree.jpg?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1355&q=80"
      )
    );
}

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
})()

// Eventlistener for add descripton btn.
function imgAddDescription(btn) {
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
    if (isLiked ? totalLikes++ : totalLikes--);
    document.getElementById("heartCounter").innerHTML = totalLikes;
    btn.classList.toggle("heartStyle");
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

  const buttonBox = document.createElement("div");
  buttonBox.setAttribute("class", "buttonBox");
  galleryItem.appendChild(buttonBox);

  //Create button for adding description to the img.
  //Give it class name of 'add-description-btn'.
  const addDescriptionBtn = createIcon('<i class="far fa-comment"></i>', "add-description-btn");
  imgAddDescription(addDescriptionBtn);

  //Primarily for debugging purposes. Reuse logic to show description later.
  const showDescriptionBtn = createIcon('<i class="fas fa-flask"></i>', "show-description");
  imgShowDescription(showDescriptionBtn);

  const deleteBtn = createIcon('<i class="far fa-trash-alt"></i>', "delete-img");
  imgDelete(deleteBtn);

  const likeButton = createIcon('<i class="far fa-heart"></i>', "like");
  imgLike(likeButton);

  function createIcon(icon, className){
    const element = document.createElement("a");
    element.innerHTML = icon;
    element.classList.add("imgButton", className);
    buttonBox.appendChild(element);

    return element;
  }

  return galleryItem;
}