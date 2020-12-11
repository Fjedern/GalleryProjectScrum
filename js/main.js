'use strict';

let imgsObjects = []; // Holds objects for each uploaded image.

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
window.addEventListener('load', function () {
  document
    .querySelector('input[type="file"]')
    .addEventListener('change', function () {
      if (this.files && this.files[0]) {
        // TODO: Move this to createGalleryItem function and remove imgElement array!

        const imgSrc = URL.createObjectURL(this.files[0]); // Get img src as blob url

        const galleryItem = createGalleryItem(imgSrc);

        const usrText = 'Image Description'; // Default img description.

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

        document.getElementById('gallery').appendChild(galleryItem);
        document.getElementById('gallery').scrollIntoView();
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
    if (imgsObjects && imgsObjects.length > 1) {
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
function imgAddDescription(btn) {
  btn.addEventListener('click', (event) => {
    const usrDescription = prompt('Enter a description about the image');
    const imgIndex = imgsObjects.findIndex((object) => {
      return (
        object.imgUrl ===
        event.target.parentElement.getElementsByTagName('img')[0].src
      );
    });

    imgsObjects[imgIndex].description = usrDescription;
  });
}

// Eventlistener for "show-description" button.
function imgShowDescription(btn) {
  btn.addEventListener('click', (event) => {
    const galleryItem = event.target.parentElement;
    const imgObject = imgsObjects.find((obj) => {
      return obj.imgUrl == galleryItem.getElementsByTagName('img')[0].src;
    });
    console.log(imgObject.description);
  });
}

function imgDelete(btn) {
  btn.addEventListener('click', (event) => {
    const galleryItem = event.target.parentElement;
    const imgIndex = imgsObjects.findIndex((object) => {
      return (
        object.imgUrl ===
        event.target.parentElement.getElementsByTagName('img')[0].src
      );
    });
    URL.revokeObjectURL(imgsObjects[imgIndex].imgUrl);
    imgsObjects.splice(imgIndex, 1);
    galleryItem.remove();
  });
}

function imgLike(btn) {
  let isLiked = false;
  btn.addEventListener('click', () => {
    isLiked = !isLiked;
    console.log(isLiked);
    btn.classList.toggle('heartStyle');
  });
}

// Create Gallery Item and all its children.
function createGalleryItem(imgSrc) {
  //Create div with class of gallery-item.
  const galleryItem = document.createElement('div');
  galleryItem.setAttribute('class', 'gallery-item');

  // Create img element and set src as imgSrc
  const imgElement = document.createElement('img');
  imgElement.src = imgSrc;
  galleryItem.appendChild(imgElement);

  //Create button for adding description to the img.
  //Give it class name of 'add-description-btn'.
  const addDescriptionBtn = document.createElement('button');
  addDescriptionBtn.textContent = 'Add';
  addDescriptionBtn.setAttribute('class', 'add-description-btn');
  galleryItem.appendChild(addDescriptionBtn);
  imgAddDescription(addDescriptionBtn);

  //Primarily for debugging purposes. Reuse logic to show description later.
  const showDescriptionBtn = document.createElement('button');
  showDescriptionBtn.setAttribute('class', 'show-description');
  showDescriptionBtn.textContent = 'Show';
  galleryItem.appendChild(showDescriptionBtn);
  imgShowDescription(showDescriptionBtn);

  const deleteBtn = document.createElement('button');
  deleteBtn.setAttribute('class', 'delete-img');
  deleteBtn.textContent = 'Delete';
  galleryItem.appendChild(deleteBtn);
  imgDelete(deleteBtn);

  const likeButton = document.createElement('button');
  likeButton.innerHTML = '<i class="far fa-heart"></i>'; // Use set attribute. No <i> tag.
  likeButton.setAttribute('class', 'like');
  imgLike(likeButton);
  galleryItem.appendChild(likeButton);

  return galleryItem;
}
