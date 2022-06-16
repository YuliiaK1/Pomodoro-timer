// Settings panel open/close
const btnSettingOpen = document.querySelector('.block-setting');
let settingModal = document.querySelector('.setting-modal');
const applyButton = document.querySelector('.modal__apply-setting');

btnSettingOpen.addEventListener('click', () => {
  settingModal.classList.remove('hidden');
  addShadow();
});

let inputPomodoro = document.getElementById("input-pomodoro").value;
let inputShort = document.getElementById("input-short").value;
let inputLong = document.getElementById("input-long").value;

applyButton.addEventListener('click', () => {
  isPaused = true;
  validationTime();
  if (checkInputs) {
    settingModal.classList.add('hidden');
    inputPomodoro = document.getElementById("input-pomodoro").value;
    inputShort = document.getElementById("input-short").value;
    inputLong = document.getElementById("input-long").value;
    changeControlButton();
    removeShadow();
  }
});

// Check form validation
let checkInputs = false;
let allInput = document.querySelectorAll(".input");
function validationTime() {
    for (let i = 0; i < allInput.length; i++) { 
      if (allInput[0].checkValidity() && allInput[1].checkValidity() && allInput[2].checkValidity()) {
        checkInputs = true;
      } else if (allInput[i].checkValidity() === false) {
        checkInputs = false;
      }
    }
}



// Change font weight
let fontElementList = document.getElementsByClassName("font__list-element");

function changeFont (element, font) {
   const s = `;font-family: ${font}`;
   element.setAttribute("style", element.getAttribute("style") + s);
   for (let i = 0; i < element.children.length; i++) {
    changeFont(element.children[i], font);
   }
 }

 toggleActive (fontElementList, "active");

for(let i = 0; i<fontElementList.length; i++) {
  fontElementList[i].addEventListener("click", function(){    
      let dataControl = fontElementList[i].dataset.font;
      let body = document.getElementsByTagName("body")[0];
      switch (dataControl) {  
        case 'Kumbh': changeFont(body, "Kumbh Sans, sans-serif"); break;  
        case 'Roboto': changeFont(body, "Roboto Slab, sans-serif"); break;  
        case 'Space': changeFont(body, "Space Mono, monospace"); break;
     }
   });
}


// Change elements active color 
let containerOfColors = document.getElementById("colorList");
let colorElementList  = containerOfColors.getElementsByClassName("color__list-element");
let activeNavElement = document.getElementsByClassName("button--active");
let colorBtnApply = document.getElementById("button-change");
let currentColor;

function changeColorNav (color) {
  for(let i = 0; i<activeNavElement.length; i++) {
    activeNavElement[i].className = `control__button button--active active-${color}`;
  }
}

function toggleActive (elem, cls) {
	for (let i = 0; i < elem.length; i++) {
	elem[i].addEventListener("click", function() {
    let currents = document.getElementsByClassName(cls);
    currents[0].className = currents[0].className.replace(` ${cls}`, "");
    this.className += ` ${cls}`;
  });
}
}
toggleActive(colorElementList, "color-active");

function circleColor (color) {
	document.getElementById("app").innerHTML = `
         <div class="base-timer">
           <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
             <g class="base-timer__circle">
               <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
               <path
                 id="base-timer-path-remaining"
                 stroke-dasharray="283"
                 class="base-timer__path-remaining ${color}"
                 d="
                   M 50, 50
                   m -45, 0
                   a 45,45 0 1,0 90,0
                   a 45,45 0 1,0 -90,0
                 "
               ></path>
             </g>
           </svg>
         </div>
         `;
}

function changeColorElements (color) {
         currentColor = color;
         changeColorNav(color);
         circleColor (color);
}
for(let i = 0; i<colorElementList.length; i++) {
  colorElementList[i].addEventListener("click", function(){
   let dataColor = colorElementList[i].dataset.color;
      switch (dataColor) {  
        case 'blue': colorBtnApply.style.background = "#70f3f8"; changeColorElements ("blue"); break;  
        case 'fiolet': colorBtnApply.style.background = "#D881F8"; changeColorElements ("fiolet");  break;  
        case 'pink': colorBtnApply.style.background = "#F87070"; changeColorElements ("pink");break;
     }
});
}

// Timer circle. Credit: Mateusz Rybczonec css.tricks (changed)
let FULL_DASH_ARRAY = 283;

let colorBase = {
   info: {
     color: "base"
   }
 };

let timeLi = document.getElementById("time");
let timeSplit = timeLi.textContent.split(":");
let timeLimit = timeSplit[0]*60;
let timePassed = 0;
let timeLeft = timeLimit;
let timerInterval = null;
let remainingPathColor = colorBase.info.color;

document.getElementById("app").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
</div>
`;


function onTimesUp() {
  clearInterval(timerInterval);
}

function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = timeLimit - timePassed;
    document.getElementById("time").innerHTML = formatTime(
      timeLeft
    );
    setCircleDasharray();
    if (timeLeft === 0) {
      onTimesUp();
      start.innerHTML = "START";
      isPaused = true;
      document.getElementById("time").innerHTML = formatTime(timeLimit);
      timeLeft = timeLeft + timePassed;
      timePassed = 0;
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${seconds}`;
}


function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / timeLimit;
  return rawTimeFraction - (1 / timeLimit) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}


//Navigation buttons switch
let navigationContainer = document.getElementById("control");
let controlBtnNav = navigationContainer.querySelectorAll("button");

controlBtnNav.forEach(buttons => {
   buttons.addEventListener("click", function(){
      controlBtnNav.forEach(btn=> btn.classList.remove("button--active", `active-${currentColor}`));
      this.className = `control__button button--active active-${currentColor}`;

      switch (buttons.value) {  
        case 'short': changeTimePanel (inputShort); break;  
        case 'long':  changeTimePanel (inputLong);  break;  
        case 'pomodoro': changeTimePanel (inputPomodoro);break;
     }
   });
});

function changeTimePanel (btnValue) {
	      timeLi.textContent = btnValue +":00";
        onTimesUp();
        timeSplit = timeLi.textContent.split(":");
        timeLimit = timeSplit[0]*60;
        timePassed = 0;
        start.innerHTML = "START";
        isPaused = true;
        document.getElementById("base-timer-path-remaining").setAttribute("stroke-dasharray", 283);
}

// Functionality of the start/pause button
let start = document.getElementById("start");
let clickTimer = document.getElementById("timer");
let isPaused = true;
clickTimer.addEventListener('click', () => {
  if(isPaused){
		isPaused = false;
    startTimer();
    start.innerHTML = "PAUSE";
	} else {
		isPaused = true;
    onTimesUp();
    start.innerHTML = "START";
	}
});

// Draw the value of the input active element
function changeControlButton() {
  let ones = Array.from(controlBtnNav);
  for(let i = 0; i<ones.length; i++){
    switch (true) {  
      case ones[i].value === "long" && ones[i].classList.contains('button--active'): changeTimePanel(inputLong); break;  
      case ones[i].value === "short" && ones[i].classList.contains('button--active'): changeTimePanel(inputShort); break; 
      case ones[i].value === "pomodoro" && ones[i].classList.contains('button--active'): changeTimePanel(inputPomodoro); break; 
   }
  }
}

// Add shadow on background on click
let openClass ="is-open";
function addShadow() {
  document.querySelector('.overlay01').classList.add(openClass);
  document.querySelector('.overlay-close').classList.add(openClass);
}

function removeShadow() {
  document.querySelector('.overlay01').classList.remove(openClass);
  document.querySelector('.overlay-close').classList.remove(openClass);
}