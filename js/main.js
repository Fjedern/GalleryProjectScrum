"use strict";

let imgsElements = [];
let imgsObjects = [];

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
    .addEventListener("change", function () {
      if (this.files && this.files[0]) {
        const galleryItem = document.getElementById('gallery-item');
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

        // Don't forget to revoke the objectUrl when rejecting duplicate or removing object.
      }
    });
});

/**
 * Event listener for sort button. Sorts images conatined in img array and displays them in new order on screen.
 * @type {html-element} sortButton - Html Button with id sortButton.
 */
(function () {
  const sortButton = document.getElementById('sort');
  sortButton.addEventListener('click', () => {
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
  });
})();
