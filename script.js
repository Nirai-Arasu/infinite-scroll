const getImages = () => {
  const randomNumber = Math.floor(Math.random() * 1000);
  const url = 'https://source.unsplash.com/collection/139386/250x250/?sig=';
  return url + randomNumber;
};
const db = [];
let prevSentTopTop = 0;
let prevSentBottomTop = 0;
let currentIndex = 0;
let counter = 0;
const initDb = (num) => {
  for (let i = counter; i < num + counter; i++) {
    db.push({
      imgSrc: getImages(),
      unique: i,
    });
  }
  counter = counter + num;
};
const n = 20;
const initList = (nums) => {
  const outer = document.querySelector('.outer');
  for (let i = 0; i < nums; i++) {
    const imgContainer = document.createElement('div');
    imgContainer.className = 'img-container';
    imgContainer.id = `c${db[i].unique}`;
    const spanText = document.createElement('p');
    spanText.textContent = i;
    imgContainer.appendChild(spanText);
    const image = document.createElement('img');
    image.src = db[i].imgSrc;
    imgContainer.appendChild(image);

    outer.appendChild(imgContainer);
  }
};

const slidingWindow = (isDown) => {
  let increment = n / 2;
  let firstIndex;
  if (isDown) {
    firstIndex = currentIndex + increment;
  } else {
    firstIndex = currentIndex - increment;
  }
  if (firstIndex < 0) {
    firstIndex = 0;
  }
  return firstIndex;
};
const recycleDom = (firstIndex) => {
  if (firstIndex + n >= counter) {
    initDb(200);
  }

  for (let i = 0; i < n; i++) {
    const curr = document.querySelector(`#c${i}`);
    curr.firstChild.textContent = db[firstIndex + i].unique;
    curr.lastChild.src = db[firstIndex + i].imgSrc;
  }
};
const getNumFromStyle = (numStr) => {
  return Number(numStr.substring(0, numStr.length - 2));
};
const adjustPaddings = (isDown) => {
  const outer = document.querySelector('.outer');
  let paddingTop = getNumFromStyle(outer.style.paddingTop);
  const paddingBottom = getNumFromStyle(outer.style.paddingBottom);

  if (isDown) {
    outer.style.paddingTop = `${paddingTop + 4000}px`;
    if (paddingBottom != 0) {
      outer.style.paddingBottom = `${paddingBottom - 4000}px`;
    }
  } else {
    outer.style.paddingBottom = `${paddingBottom + 4000}px`;
    if (paddingTop != 0) {
      outer.style.paddingTop = `${paddingTop - 4000}px`;
    }
  }
};
const topSentinel = (entry) => {
  const currentTop = entry.boundingClientRect.top;
  if (prevSentTopTop < currentTop) {
    const firstIndex = slidingWindow(false);
    recycleDom(firstIndex);
    adjustPaddings(false);
    currentIndex = firstIndex;
  }
  prevSentTopTop = currentTop;
};
const bottomSentinel = (entry) => {
  const currentTop = entry.boundingClientRect.top;
  if (prevSentBottomTop > currentTop) {
    const firstIndex = slidingWindow(true);
    recycleDom(firstIndex);
    adjustPaddings(true);
    currentIndex = firstIndex;
  }
  prevSentBottomTop = currentTop;
};
const initInterSectionObserver = () => {
  const intersection = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.target.id == 'c0') {
        topSentinel(entry);
      } else if (entry.target.id == 'c19') {
        bottomSentinel(entry);
      }
    });
  });
  intersection.observe(document.querySelector('#c0'));
  intersection.observe(document.querySelector('#c19'));
};
const init = () => {
  initDb(200);
  initList(20);
  initInterSectionObserver();
};

init();
