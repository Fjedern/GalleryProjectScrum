'use strict';

let imgsElements = [];
let imgsObjects = [];
let objectIndex = 0;

/**
 * Object for user uploaded images.
 * Holds information about the image such as name, last modified date and the user note for that image.
 */
class ImgObject {
  constructor(name, imgUrl, unix, date, note) {
    this.imgUrl = imgUrl;
    this.unix = unix;
    this.date = date;
    this.note = note;
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
        const galleryItem = createGalleryItem();

        const imgElement = document.createElement('img');
        imgElement.src = URL.createObjectURL(this.files[0]); // set src to blob url

        imgsElements.push(imgElement);

        const usrText = 'lorem  ipsum askjdaösdhaljwdlakjsdn'; // Simulate user note.

        // Create new ImgObject and sotre it in imgsObjects array.
        imgsObjects.push(
          new ImgObject(
            this.files[0].name,
            imgElement.src,
            this.files[0].lastModified,
            this.files[0].lastModifiedDate,
            usrText
          )
        );

        // Append the newly created img element to the div called galleryItem.
        galleryItem.appendChild(imgsElements[imgsElements.length - 1]);
        document.getElementById('gallery').appendChild(galleryItem);
        imgAddDescription();
        igmShowDescription();

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
      if (sortButton.className == 'rev') {
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

// Eventlistener for addNoteBtn.
function imgAddDescription() {
  const btns = document.getElementsByClassName('add-description-btn');
  const btn = btns[btns.length - 1];
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('id');
    const usrDescription = prompt('Enter a description about the image');
    imgsObjects[id].note = usrDescription;
  });
}

function igmShowDescription() {
  const btns = document.getElementsByClassName('show-description');

  const btn = btns[btns.length - 1];
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('id');
    console.log(imgsObjects[id].note);
  });
}

// Create Gallery Item and all its children.
function createGalleryItem() {
  const galleryItem = document.createElement('div');
  galleryItem.setAttribute('id', 'gallery-item');

  const addDescriptionBtn = document.createElement('button');
  addDescriptionBtn.textContent = 'Add Description';
  addDescriptionBtn.setAttribute('class', 'add-description-btn');
  addDescriptionBtn.setAttribute('id', objectIndex);
  galleryItem.appendChild(addDescriptionBtn);

  const showDescription = document.createElement('button');
  showDescription.setAttribute('class', 'show-description');
  showDescription.textContent = 'Show Note';
  showDescription.setAttribute('id', objectIndex);

  galleryItem.appendChild(showDescription);

  objectIndex++;
  return galleryItem;
}
