'use strict';

let imgsElements = [];
let imgsObjects = [];
let id = 0;

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
        // Used for setting "unique" class foro each gallery-item.

        // TODO: Make this a pseudo unique id number. Will not work as is!
        //const index = document.getElementsByClassName('gallery-item').length;

        const galleryItem = createGalleryItem(id);

        const imgElement = document.createElement('img');
        imgElement.src = URL.createObjectURL(this.files[0]); // set src to blob url

        imgsElements.push(imgElement);

        const usrText = 'Image Description'; // Simulate img description.

        // Create new ImgObject and sotre it in imgsObjects array.
        imgsObjects.push(
          new ImgObject(
            this.files[0].name,
            imgElement.src,
            this.files[0].lastModified,
            this.files[0].lastModifiedDate,
            usrText,
            id
          )
        );

        // Append the newly created img element to the div called galleryItem.
        galleryItem.appendChild(imgsElements[imgsElements.length - 1]);
        document.getElementById('gallery').appendChild(galleryItem);

        const btnsIndex =
          document.getElementsByClassName('add-description-btn').length - 1;
        imgAddDescription(btnsIndex);
        igmShowDescription(btnsIndex);
        imgDelete(btnsIndex);

        id++;
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
function imgAddDescription(index) {
  const btns = document.getElementsByClassName('add-description-btn');
  const btn = btns[index];
  btn.addEventListener('click', () => {
    const usrDescription = prompt('Enter a description about the image');

    // TODO get the correct object. Can't use index as is.
    imgsObjects[index].description = usrDescription;
  });
}

function igmShowDescription(index) {
  const btns = document.getElementsByClassName('show-description');

  const btn = btns[index];
  btn.addEventListener('click', () => {
    const galleryItem = document.getElementsByClassName('gallery-item')[index];
    const imgObject = imgsObjects.find((obj) => {
      return obj.imgUrl == galleryItem.getElementsByTagName('img')[0].src;
    });
    console.log(
      imgObject.description +
        ', object id:' +
        imgObject.id +
        ', div id: ' +
        index
    );
  });
}

function imgDelete(index) {
  const btns = document.getElementsByClassName('delete-img');
  const btn = btns[index];
  btn.addEventListener('click', () => {
    const galleryItem = btn.parentElement;
    console.log(btns);
    galleryItem.remove();
    console.log(btns);
  });
}

// Create Gallery Item and all its children.
function createGalleryItem(index) {
  //Create div with class of gallery-item.
  const galleryItem = document.createElement('div');
  galleryItem.setAttribute('class', 'gallery-item');
  galleryItem.setAttribute('id', index);

  //Create button for adding description to the img.
  //Give it class name of 'add-description-btn'.
  //Give it an index as id. Use when removing images.
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
