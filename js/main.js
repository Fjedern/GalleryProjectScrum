"use strict";

let imgs = [];
let imgsArray = [];

class Imgs {
  constructor(imgUrl, unix, date, note) {
    this.imgUrl = imgUrl;
    this.unix = unix;
    this.date = date;
    this.note = note;
  }
}

(function () {
  const sortButton = document.getElementById("sort");
  sortButton.addEventListener("click", () => {
    sortButton.classList.toggle("rev");
    if (sortButton.className == "rev") {
      imgsArray.sort((a, b) => (a.unix < b.unix ? 1 : -1));
    } else {
      imgsArray.sort((a, b) => (a.unix > b.unix ? 1 : -1));
    }

    const galleryImgs = document.getElementsByTagName("img");
    if (galleryImgs.length > 0) {
      for (let i = 0; i < galleryImgs.length; i++) {
        galleryImgs[i].src = imgsArray[i].imgUrl;
      }
    }
  });
})();

window.addEventListener("load", function () {
  document
    .querySelector('input[type="file"]')
    .addEventListener("change", function () {
      if (this.files && this.files[0]) {
        const galleryItem = document.getElementById("gallery-item");
        const imgItem = document.createElement("img");
        imgItem.src = URL.createObjectURL(this.files[0]); // set src to blob url

        imgs.push(imgItem);

        const usrText = "lorem  ipsum askjdaösdhaljwdlakjsdn";

        imgsArray.push(
          new Imgs(
            imgItem.src,
            this.files[0].lastModified,
            this.files[0].lastModifiedDate,
            usrText
          )
        );

        galleryItem.appendChild(imgs[imgs.length - 1]);

        // for (let i = 0; i < imgs.length; i++) {
        //   galleryItem.appendChild(imgs[i]);
        // }
      }
      console.log(imgsArray);
    });
});
