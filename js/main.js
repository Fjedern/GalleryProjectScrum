
"use strict";

let imgsElements = [];
let imgsObjects = [];

/**
 * Object for user uploaded images.
 * Holds information about the image such as name, last modified date and the igm description.
 */
class ImgObject {
  constructor(name, imgUrl, unix, date, description, id) {
    this.imgUrl = imgUrl;
    this.unix = unix;
    this.date = date;
    this.description = description;
    this.name = name;
    this.id = id;
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
        const galleryItem = createGalleryItem();

        const imgElement = document.createElement('img');
        imgElement.src = URL.createObjectURL(this.files[0]); // set src to blob url

        imgsElements.push(imgElement);

        const usrText = "Image Description"; // Simulate img description.

        // Used for setting id of "addescriptoion button" and imgObjects.
        const index = document.getElementsByClassName('add-description-btn')
          .length;

        // Create new ImgObject and sotre it in imgsObjects array.
        imgsObjects.push(
          new ImgObject(
            this.files[0].name,
            imgElement.src,
            this.files[0].lastModified,
            this.files[0].lastModifiedDate,
            usrText,
            index
          )
        );
            
        // Append the newly created img element to the div called galleryItem.

              
        galleryItem.appendChild(imgsElements[imgsElements.length - 1]);
        document.getElementById('gallery').appendChild(galleryItem);
        document.getElementById('gallery').scrollIntoView();

        imgAddDescription(index);
        igmShowDescription(index);
        likeButton(index);
        // Don't forget to revoke the objectUrl when rejecting duplicate or removing object.
            
      }
    });
});

/**
 * Event listener for sort button. Sorts images conatined in imgsObjects and displays them in new order on screen.
 * @type {html-element} sortButton - Html Button with id sortButton.
 */
(function () {
  const sortButton = document.getElementById('sort');
  sortButton.addEventListener('click', () => {
    if (imgsObjects && imgsObjects.length > 0) {
      sortButton.classList.toggle('rev');
      if (sortButton.className == 'iconButtons rev') {
        imgsObjects.sort((a, b) => (a.unix < b.unix ? 1 : -1));
      } else {
        imgsObjects.sort((a, b) => (a.unix > b.unix ? 1 : -1));
      }

      const galleryImgs = document.getElementsByTagName('img');
      if (galleryImgs.length > 0) {
        for (let i = 0; i < galleryImgs.length; i++) {
          galleryImgs[i].src = imgsObjects[i].imgUrl;
        }
      }
    }
  });
})();

// Eventlistener for add descripton btn.
function imgAddDescription(index) {
  const btns = document.getElementsByClassName('add-description-btn');
  const btn = btns[index];
  btn.addEventListener('click', () => {
    const id = btn.getAttribute("id");
    const usrDescription = prompt('Enter a description about the image');
    imgsObjects[id].description = usrDescription;
  });
}

function igmShowDescription(index) {
  const btns = document.getElementsByClassName('show-description');

  const btn = btns[index];
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('id');
    console.log(
      imgsObjects[id].description +
        " index: " +
        index +
        " object id " +
        imgsObjects[id].id
    );
  });
}

function likeButton(index) {
  const btns = document.getElementsByClassName('like');
  const btn = btns[index];
  let isLiked = false;
  btn.addEventListener('click', () => {
    const id = btn.getAttribute("id");
    isLiked = !isLiked;
    console.log('liked= ' + getlikes() + index);
    toggleLike(index);
    function getlikes() {
      return isLiked;
    }
  });
}
function toggleLike(index) {
  document.getElementById(index).classList.toggle('heartStyle');
}
// Create Gallery Item and all its children.
function createGalleryItem() {
  //Check how many gallery items there are in the DOM.
  const index = document.getElementsByClassName('gallery-item').length;

  //Create div with class of gallery-item.
  const galleryItem = document.createElement('div');
  galleryItem.setAttribute('class', 'gallery-item');

  //Create button for adding description to the img.
  //Give it class name of 'add-description-btn'.
  //Give it an index as id. Use when removing images.

  const likeButton = document.createElement('button');
  likeButton.innerHTML = '<i class="far fa-heart"></i>';
  likeButton.setAttribute('class', 'like');
  likeButton.setAttribute('id', index);
  galleryItem.appendChild(likeButton);

  const addDescriptionBtn = document.createElement('button');
  addDescriptionBtn.textContent = 'Add Description';
  addDescriptionBtn.setAttribute('class', 'add-description-btn');
  addDescriptionBtn.setAttribute('id', index);
  galleryItem.appendChild(addDescriptionBtn);

  //Primarily for debugging purposes. Reuse logic to show description later.
  const showDescription = document.createElement('button');
  showDescription.setAttribute('class', 'show-description');
  showDescription.textContent = 'Show Description';
  showDescription.setAttribute('id', index);
  galleryItem.appendChild(showDescription);

  return galleryItem;
}






