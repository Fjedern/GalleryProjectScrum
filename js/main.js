'use strict';

document.getElementById('imgObj').addEventListener('click', () => {
  // console.log(imgsObjects);

  const galleryItems = document.getElementsByClassName('gallery-item');
  console.log(
    galleryItems.indexOf((item) => {
      item.id == 1;
    })
  );
  console.log(galleryItems);
});

let imgsObjects = []; // Holds objects for each uploaded image.
let id = 0; // Simmulating unique id. Could be generated in backend.

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
window.addEventListener('load', function () {
  document
    .querySelector('input[type="file"]')
    .addEventListener('change', function () {
      if (this.files && this.files[0]) {
        // TODO: Move this to createGalleryItem function and remove imgElement array!

        const imgSrc = URL.createObjectURL(this.files[0]); // Get img src as blob url

        const galleryItem = createGalleryItem(id, imgSrc);

        const usrText = 'Image Description'; // Default img description.

        // Create new ImgObject and sotre it in imgsObjects array.
        imgsObjects.push(
          new ImgObject(
            this.files[0].name,
            imgSrc,
            this.files[0].lastModified,
            this.files[0].lastModifiedDate,
            usrText,
            id
          )
        );

        document.getElementById('gallery').appendChild(galleryItem);

        const btnsIndex =
          document.getElementsByClassName('add-description-btn').length - 1;
        imgAddDescription(id);
        igmShowDescription(id);
        imgDelete(id);

        id++;
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
      if (sortButton.className == 'button rev') {
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
function imgAddDescription(id) {
  const galleryItem = document.getElementById(id);
  const btn = galleryItem.getElementsByClassName('add-description-btn')[0];

  btn.addEventListener('click', (event) => {
    const usrDescription = prompt('Enter a description about the image');

    imgsObjects[id].description = usrDescription;
  });
}

// Eventlistener för knappen show-description.
function igmShowDescription(id) {
  const galleryItem = document.getElementById(id);
  const btn = galleryItem.getElementsByClassName('show-description')[0];
  btn.addEventListener('click', () => {
    // const galleryItem = document.getElementsByClassName('gallery-item')[id];
    const imgObject = imgsObjects.find((obj) => {
      return obj.imgUrl == galleryItem.getElementsByTagName('img')[0].src;
    });
    console.log(
      imgObject.description + ', object id:' + imgObject.id + ', div id: ' + id
    );
  });
}

function imgDelete(id) {
  const galleryItem = document.getElementById(id);
  const btn = galleryItem.getElementsByClassName('delete-img')[0];
  btn.addEventListener('click', () => {
    galleryItem.remove();
    const id = galleryItem.getAttribute('id');
    const imgObjectIndex = imgsObjects.findIndex((obj) => obj.id == id); // Not supported by IE!!
    console.log(imgObjectIndex);
    URL.revokeObjectURL(imgsObjects[imgObjectIndex].imgUrl);
    imgsObjects.splice(imgObjectIndex, 1);
  });
}

// Create Gallery Item and all its children.
function createGalleryItem(id, imgSrc) {
  //Create div with class of gallery-item.
  const galleryItem = document.createElement('div');
  galleryItem.setAttribute('class', 'gallery-item');
  galleryItem.setAttribute('id', id);

  // Create img element and set src as imgSrc
  const imgElement = document.createElement('img');
  imgElement.src = imgSrc;
  galleryItem.appendChild(imgElement);

  //Create button for adding description to the img.
  //Give it class name of 'add-description-btn'.
  const addDescriptionBtn = document.createElement('button');
  addDescriptionBtn.textContent = 'Add Description';
  addDescriptionBtn.setAttribute('class', 'add-description-btn');
  galleryItem.appendChild(addDescriptionBtn);

  //Primarily for debugging purposes. Reuse logic to show description later.
  const showDescription = document.createElement('button');
  showDescription.setAttribute('class', 'show-description');
  showDescription.textContent = 'Show Description';
  galleryItem.appendChild(showDescription);

  const deleteBtn = document.createElement('button');
  deleteBtn.setAttribute('class', 'delete-img');
  deleteBtn.textContent = 'Delete';
  galleryItem.appendChild(deleteBtn);

  return galleryItem;
}
