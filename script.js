let timer;
let deleteFirstPhotoDelay;

async function start() {
  try {
    const response = await fetch("https://dog.ceo/api/breeds/list/all");
    const data = await response.json();
    createBreedList(data.message);
  } catch (e) {
    console.error("There was a problem fetching the breed list.", e);
  }
}

start();

function createBreedList(breedList) {
  const breedSelect = `
    <select onchange="loadByBreed(this.value)">
      <option>Choose a dog breed</option>
      ${Object.keys(breedList)
        .map((breed) => `<option>${breed}</option>`)
        .join("")}
    </select>
  `;
  document.getElementById("breed").innerHTML = breedSelect;
}

async function loadByBreed(breed) {
  if (breed !== "Choose a dog breed") {
    try {
      const response = await fetch(`https://dog.ceo/api/breed/${breed}/images`);
      const data = await response.json();
      createSlideshow(data.message);
    } catch (e) {
      console.error("Error fetching breed images.", e);
    }
  }
}

function createSlideshow(images) {
  let currentPosition = 0;
  clearInterval(timer);
  clearTimeout(deleteFirstPhotoDelay);

  const slideshow = document.getElementById("slideshow");
  slideshow.innerHTML = "";

  if (images.length === 0) {
    slideshow.innerHTML = "<p>No images found.</p>";
    return;
  }

  // Add first image
  const firstSlide = document.createElement("div");
  firstSlide.className = "slide active";
  firstSlide.style.backgroundImage = `url('${images[0]}')`;
  slideshow.appendChild(firstSlide);
  currentPosition = 1;

  if (images.length > 1) {
    // Start slideshow
    timer = setInterval(() => {
      const newSlide = document.createElement("div");
      newSlide.className = "slide";
      newSlide.style.backgroundImage = `url('${images[currentPosition]}')`;
      slideshow.appendChild(newSlide);

      // Activate new slide
      setTimeout(() => {
        newSlide.classList.add("active");
      }, 50);

      // Remove first slide after transition
      deleteFirstPhotoDelay = setTimeout(() => {
        const first = slideshow.querySelector(".slide");
        if (first) first.remove();
      }, 1000);

      currentPosition = (currentPosition + 1) % images.length;
    }, 3000);
  }
}
