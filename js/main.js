'use strict';

let imgsObjects = []; // Holds objects for each uploaded image.
let totalLikes = 0;
let activeAlbum = null;

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
    this.album = ['All'];
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

        const gallery = document.getElementById('gallery');
        gallery.appendChild(galleryItem);
        gallery.scrollIntoView();
      }
    });
});

// Eventlisteners

/**
 * Event listener for sort button. Sorts images conatined in imgsObjects and displays them in new order on screen.
 * @type {html-element} sortButton - Html Button with id sortButton.
 */
(function () {
  const sortButton = document.getElementById('sort');
  sortButton.addEventListener('click', () => {
    if (activeAlbum === null) {
      setActiveAlbum('All');
    }

    if (imgsObjects && imgsObjects.length > 1) {
      sortButton.classList.toggle('rev');
      if (sortButton.className == 'iconButtons rev') {
        imgsObjects.sort((a, b) => (a.unix < b.unix ? 1 : -1));
      } else {
        imgsObjects.sort((a, b) => (a.unix > b.unix ? 1 : -1));
      }

      displayImages();
    }
  });
})();

function displayImages() {
  // TODO:Check if current album is the same as the previous album. If so: display the new images in new order.
  // Else:
  // TODO: Remove all galleryItems.
  // TODO: Create galleryItems for all the images in the album.
  // TODO: Display images.

  const galleryImgs = document.getElementsByTagName('img'); // Will not work if we add additional img elements to the html code.

  if (galleryImgs.length > 0) {
    for (let i = 0; i < imgsObjects.length; i++) {
      galleryImgs[i].src = imgsObjects[i].imgUrl;
    }
  }
}

//Handle for albums
(function () {
  document.getElementById('add-album').addEventListener('click', () => {
    const albumName = prompt('Name your album');
    if (albumName) {
      const navList = document.getElementById('nav-list');
      const navItem = document.createElement('li');
      navItem.setAttribute('class', 'nav-item');
      const itemLink = document.createElement('a');
      itemLink.setAttribute('href', '#');
      itemLink.innerHTML = albumName;

      navItem.append(itemLink);
      navList.appendChild(navItem);
    }
  });
})();

function getObjectIndex(src) {
  return imgsObjects.findIndex(({ imgUrl }) => {
    return imgUrl === src;
  });
}

// Eventlistener for add descripton btn.
function imgAddDescription(btn) {
  btn.addEventListener('click', (event) => {
    const usrDescription = prompt('Enter a description about the image');

    const imgIndex = getObjectIndex(
      event.target.parentElement.parentElement.parentElement.getElementsByTagName(
        'img'
      )[0].src
    );
    imgsObjects[imgIndex].description = usrDescription;
  });
}

function imgShowDescription(btn) {
  btn.addEventListener('click', (event) => {
    const galleryItem = event.target.parentElement.parentElement.parentElement;
    const imgObject = imgsObjects.find(({ imgUrl }) => {
      return imgUrl == galleryItem.getElementsByTagName('img')[0].src;
    });
    console.log(imgObject.description);
  });
}

function imgDelete(btn) {
  btn.addEventListener('click', (event) => {
    const galleryItem = event.target.parentElement.parentElement.parentElement;
    const imgIndex = getObjectIndex(
      event.target.parentElement.parentElement.parentElement.getElementsByTagName(
        'img'
      )[0].src
    );

    // Check if image is "Liked". Remove Like and update heartCounter if it is.
    if (imgsObjects[imgIndex].album.includes('Liked')) {
      totalLikes--;
      document.getElementById('heartCounter').innerHTML = totalLikes;
    }

    URL.revokeObjectURL(imgsObjects[imgIndex].imgUrl);
    imgsObjects.splice(imgIndex, 1);
    galleryItem.remove();
  });
}

function imgLike(btn) {
  let isLiked = false;
  btn.addEventListener('click', (event) => {
    isLiked = !isLiked;
    const objIndex = getObjectIndex(
      event.target.parentElement.parentElement.parentElement.getElementsByTagName(
        'img'
      )[0].src
    );
    if (isLiked) {
      totalLikes++;
      imgsObjects[objIndex].album.push('Liked');
    } else {
      totalLikes--;
      const index = imgsObjects[objIndex].album.indexOf('Liked');
      if (index > -1) {
        imgsObjects[objIndex].album.splice(index, 1);
      }
    }
    document.getElementById('heartCounter').innerHTML = totalLikes;
    btn.classList.toggle('heartStyle');
  });
}

function setActiveAlbum(albumName) {
  activeAlbum = albumName;
  // activeAlbum.imageObjects = imgsObjects.filter((object) => {
  //   return object.album.includes(albumName);
  // });
}

document.getElementById('heartCounter').addEventListener('click', () => {
  //const galleryItems = document.getElementsByClassName('gallery-item');
  const gallery = document.getElementById('gallery');
  setActiveAlbum('Liked');
});

function imgAddToAlbum(btn) {
  btn.addEventListener('click', () => {
    console.log('ADD TO ALBUM');
  });
}
//Eventlisteners End

// Create Gallery Item and all its children.
function createGalleryItem(imgSrc) {
  //Create div with class of gallery-item.
  const galleryItem = document.createElement('div');
  galleryItem.setAttribute('class', 'gallery-item');

  // Create img element and set src as imgSrc
  const imgElement = document.createElement('img');
  imgElement.src = imgSrc;
  galleryItem.appendChild(imgElement);

  const buttonBox = document.createElement('div');
  buttonBox.setAttribute('class', 'buttonBox');
  galleryItem.appendChild(buttonBox);

  //Create button for adding description to the img.
  //Give it class name of 'add-description-btn'.
  const addDescriptionBtn = createIcon(
    '<i class="far fa-comment"></i>',
    'add-description-btn'
  );
  imgAddDescription(addDescriptionBtn);

  //Primarily for debugging purposes. Reuse logic to show description later.
  const showDescriptionBtn = createIcon(
    '<i class="fas fa-flask"></i>',
    'show-description'
  );
  imgShowDescription(showDescriptionBtn);

  const deleteBtn = createIcon(
    '<i class="far fa-trash-alt"></i>',
    'delete-img'
  );
  imgDelete(deleteBtn);

  const likeButton = createIcon('<i class="far fa-heart"></i>', 'like');
  imgLike(likeButton);

  const addToAlbumBtn = createIcon(
    '<i class="fas fa-plus"></i>',
    'add-to-album'
  );
  imgAddToAlbum(addToAlbumBtn);

  function createIcon(icon, className) {
    const element = document.createElement('a');
    element.innerHTML = icon;
    element.classList.add(className, 'imgButton');
    buttonBox.appendChild(element);

    return element;
  }
  return galleryItem;
}

/*
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

  const addToAlbumBtn = document.createElement('button');
  addToAlbumBtn.setAttribute('class', 'fas fa-plus');
  imgAddToAlbum(addToAlbumBtn);
  galleryItem.appendChild(addToAlbumBtn);

  return galleryItem;
}
*/
