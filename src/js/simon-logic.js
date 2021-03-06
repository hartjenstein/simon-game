"use strict";

function playGame() {
// --------- Constants --------
    const MAX = 4;
    const MIN = 1;

// ---------Event Listeners ---------
 
// --- On-Off Switch 
const onOffSwitch = document.querySelector(".onoffswitch-checkbox");

onOffSwitch.addEventListener('click', turnOnOff);

// --- start Button 
const startBtn = document.querySelector(".start");
startBtn.addEventListener('click', startGame);

// --- strict Button 
const strictBtn = document.querySelector(".btn-round.strict");
strictBtn.addEventListener("click", activateStrictMode);

// ----- Pad Press --------
const pads = document.querySelectorAll(".pad");
for (let pad of pads) {
    pad.addEventListener("mousedown", padClicked );
}

// --------- Counter logic -------
// using closure pattern to avoid poluting global namespace
const makeCounter = function() {
  let privateCounter = 0;
  function changeBy(val) {
    privateCounter += val;
  }
  return{
    increment: function() {
      changeBy(1);
    },
    decrement: function() {
      changeBy(-1);
    },
    value: function() {
      return privateCounter;
    },
    reset: function() {
        privateCounter = 0;
        return privateCounter;
    }
  }   
};
// creating two instances of makeCounter
const Counter = makeCounter();
const ElementCounter = makeCounter();

// ----- On - Off Button logic -----
function turnOnOff(){
    Counter.reset();
    //let Counter = 0;
    document.getElementById("count").innerHTML = Counter.value();
    if(!onOffSwitch.checked) {
        onOffSwitch.checked = false; 
        document.querySelector(".strict-light").innerHTML = "";
        console.log("OFF", onOffSwitch.checked )
    } else {
        onOffSwitch.checked = true; 
        console.log("ON")
    }
}

function startGame() {
    
    if(onOffSwitch.checked) {
        compSequence = [];
        playerSequence = [];
        chooseColor();    
    }
}
// strict button
var strict = false;
function activateStrictMode() {
    if(onOffSwitch.checked) {
        let strictLight = document.querySelector(".strict-light");
        strictLight.classList.toggle("on");
        if(strictLight.classList.contains("on")) {
            strict = true;
        } else {
            strict = false;
        }
    }
}
// ----- Computer sequence logic -------
let compSequence = [];
let playerSequence = [];
let classNr = 0;
let sequenceInProgress = true;
let timeOut = 0;
let speedCount = 1;
let currentSpeed = 0;

function chooseColor(){
    const randomNumber =  Math.floor(Math.random() * (MAX - MIN + 1)) + MIN; 
    const shapeClass = ".shape"+randomNumber;
    const iluminated = "lit-up"+randomNumber;
    compSequence.push(randomNumber);
    computerLightUp(shapeClass, iluminated);
    setTimeout(function(){
        sequenceInProgress = false;
    }, 1000);     
}
function computerLightUp(shapeClass, iluminated){
    document.querySelector(shapeClass).classList.add(iluminated);
    getAudio(shapeClass);
    setTimeout(function(){
        if(document.querySelector(shapeClass).classList.contains(iluminated)) {
                document.querySelector(shapeClass).classList.remove(iluminated);
        }
    }, 1000); 

}

// ----- Play Sequence ------

function playSequence() {
    sequenceInProgress = true;
    let shapeClass = "";
    let iluminated = "";
    timeOut = 0;
    currentSpeed = gameSpeed(speedCount);
    ElementCounter.reset();
    compSequence.forEach((seq, index) => { 
        shapeClass = ".shape" + seq;
        iluminated = "lit-up" + seq;
        /* console.log("compSeq:", compSequence[i]) */

            timeOut += currentSpeed;
  
        console.log("TIMEOUT1",timeOut)
        ElementCounter.increment();
        setTimeout(function(){
            shapeClass = ".shape" + seq;
            iluminated = "lit-up" + seq;
            computerLightUp(shapeClass, iluminated);
            getAudio(shapeClass);
            sequenceInProgress = false;
        }, timeOut); 
        
    })
}
function gameSpeed(count) {
    let timings = [1500,1000,500,250];
    if (count % 5 == 0 && count > 0) {
        speedCount++; 
        console.log("SPEEDINCREASE")
    }
    return timings[count];
}
function addNewColor() {
    if (ElementCounter.value() === compSequence.length) {
        /* timeOut = gameSpeed(speedCount); */
        console.log("TIMEOUT2",timeOut)
        timeOut += currentSpeed;
     /*    timeOut += 1500*/
       

        setTimeout(function() {
            chooseColor();
        }, timeOut);
    }  
}
// ------ match sequence --------
function checkSequence() {
    
    let count = document.querySelector("#count");
    // ---- Check if Player pressed wrong button -----
    playerSequence.forEach((el, i) => {
        if (el !== compSequence[i]){
            if (strict !== true) {
                playerFail();
                setTimeout(function(){
                    count.innerHTML=Counter.value(); 
                    playSequence();
                    playerSequence = [];
                    /* sequenceInProgress = false; */
                }, 2000); 
            return    
            } else if (strict == true) {
                playerFail();
                activateStrictMode();
                gameOver(Counter)
            return;
            }     
        } 
    });  
    
    // ------- Check if whole sequence was correct
    if(compSequence.length == playerSequence.length && JSON.stringify(compSequence) == JSON.stringify(playerSequence) ) {
        Counter.increment();
        playSequence();
        addNewColor(); 
        count.innerHTML = Counter.value();
        playerSequence = [];
    } 
}

function playerFail() {
    let failAudio = new Audio('./audio/fail-buzzer-03.mp3');
    failAudio.play();
}

function gameOver(counter) {
    turnOnOff();
    flashScreen(counter,"",250,5);
    flashScreen(counter,"!!",500,5);
};

function flashScreen(counter, msg, milliSeconds, repeatXtimes) {
    console.log(repeatXtimes)
    let count = document.getElementById("count");
    if(repeatXtimes == 0) {
        setTimeout(function() {
            count.innerHTML = counter.reset();
        },milliSeconds);
        return turnOnOff();
    }
    setTimeout(function() {
        count.innerHTML = msg; 
    },milliSeconds);
    return flashScreen(counter, msg,milliSeconds+500,repeatXtimes-1);
}
// ------- logic for clicked pads ------
function padClicked(e) {
    if(onOffSwitch.checked) {
       if(sequenceInProgress === false) { 
        let classes = e.target.className;
        classes = classes.split(" ");
        let classShape = "." + classes[1];
        classNr = classShape.substring(6,7);
        let ilum = "lit-up" + classNr;
        playerLightUp(classShape, ilum);
        playerSequence.push(Number(classNr));
        document.querySelector(classShape).addEventListener('mouseup', lightsOut);
      } 
    }
}

function playerLightUp(shapeClass, iluminated){
    document.querySelector(shapeClass).classList.add(iluminated);
    getAudio(shapeClass);
}
// ------- shared logic - computer / player -------
function lightsOut(e) {
    let classes = e.target.classList.value.split(" ");
    e.target.classList.remove(classes[classes.length-1]);
    checkSequence()
}
// ------- Sound logic --------
function getAudio(shapeClass) {
    let audioFile = document.querySelector(shapeClass).querySelector("audio");
    audioFile.play();
}

};
playGame();