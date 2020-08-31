const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

let isInitialLoad = true;
let ready = false;
let singleImageLoaded = 0;
let totalImages = 0;
let photoArray = [];

// Unsplash (performance issues considered)
let initialCount = 5;
const apiKey = "6dS97NKrKSWnOE3D8qZeE6VM1JGEnQ8EEmZgcS2QjT8";
let apiUrl = `https://api.unsplash.com/photos/random/?
client_id=${apiKey}&count=${initialCount}`;

//
function updateAPIURLWithNewCount(picCount) {
  apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${picCount}`;
}

// Check if all images were loaded
function imageLoaded() {
  singleImageLoaded++;
  if (singleImageLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  }
}

// Helper function to set Attribute on DOM Elements
function setAttributesHelper(element, attributes) {
  for (const key in attributes) {
    // element => <a> , <img>
    // attribute => href , target ...
    element.setAttribute(key, attributes[key]);
  }
}

// Create elements for links & photos, add to DOM
function displayPhotos() {
  // reset singleImageLoaded to zero
  singleImageLoaded = 0;

  // set totalImages
  totalImages = photoArray.length;

  // Run function for each object in photosArray
  photoArray.forEach((photo) => {
    // Create <a> to link to Unsplash
    const item = document.createElement("a");
    // => set "href" attribute to links.html
    // item.setAttribute("href", photo.links.html);
    // => set "target" attribute to _blank
    // item.setAttribute("target", "_blank");
    setAttributesHelper(item, {
      href: photo.links.html,
      target: "_blank",
    });

    // Create <img> for photo
    const img = document.createElement("img");
    // img.setAttribute("src", photo.urls.regular);
    // img.setAttribute("alt", photo.alt_description);
    // img.setAttribute("title", photo.alt_description);
    setAttributesHelper(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });
    // Event Listenerm => check when each is finished loading
    img.addEventListener("load", imageLoaded);

    // Put <img> inside <a>, then put them all inside imageContainer Element
    item.appendChild(img);
    imageContainer.appendChild(item);
    // imageContainer
    // <a href target >
    //  <img src alt title>
    // </a>
  });
}

// Get Photos from Unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photoArray = await response.json();
    displayPhotos();
    if (isInitialLoad) {
      updateAPIURLWithNewCount(30);
      isInitialLoad = false;
    }
  } catch (error) {
    // catch error here
  }
}

// Check to see if scrolling near bottom of page, load more Photos
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready: false;
    getPhotos();
  }
});

// On Load
getPhotos();
