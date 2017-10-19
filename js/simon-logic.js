"use strict";
// --------- Constants --------
    const MAX = 4;
    const MIN = 1;

// ---------Event Listeners ---------

// --- On-Off Switch 
const onOff = document.querySelector(".onoffswitch-checkbox");
onOff.addEventListener('click', turnOnOff);

// --- start Button 
const startBtn = document.querySelector(".start");
startBtn.addEventListener('click', startGame);

// --- strict Button 
const strictBtn = document.querySelector(".btn-round.strict");
strictBtn.addEventListener("click", strictMode);

// ----- Pad Press --------
const pads = document.querySelectorAll(".pad");

for (let pad of pads) {
    pad.addEventListener("mousedown", padClicked );
}
if(onOff.checked) {
    turnOn();
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
const counter = makeCounter();
const elementCounter = makeCounter();

// ----- On - Off Button logic -----
function turnOnOff(){
    counter.reset();
    //let counter = 0;
    document.getElementById("count").innerHTML = counter.value();
    if(!onOff.checked) {
        onOff.checked = false; 
    } else {
        onOff.checked = true; 
    }
}

function startGame() {
    
    if(onOff.checked) {
        compSequence = [];
        playerSequence = [];
        chooseColor();    
    }
}
// strict button
var strict = false;
function strictMode(e) {
    if(onOff.checked) {
           

    console.log("fired")
    
    let strictLight = document.querySelector(".strict-light");
    console.log(strictLight);
    strictLight.classList.toggle("on");
    console.log(strictLight.classList)
        if(strictLight.classList.contains("on")) {
            strict = true;
            console.log(strict);
        } else {
            strict = false;
            console.log(strict);
        }
    }
}
// ----- Computer sequence logic -------
let compSequence = [];
let playerSequence = [];
let classNr = 0;
let sequenceInProgress = true;

function chooseColor(){
    const randomNumber =  Math.floor(Math.random() * (MAX - MIN + 1)) + MIN; 
    const shapeClass = ".shape"+randomNumber;
    const iluminated = "lit-up"+randomNumber;
    compSequence.push(randomNumber);
    computerLightUp(shapeClass, iluminated);
    console.log("compSeq: ",compSequence);
    setTimeout(function(){
        sequenceInProgress = false;
          console.log("SEQUENCESTATUS :", sequenceInProgress)
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
    console.log("SEQUENCESTATUS :", sequenceInProgress)
    let shapeClass = "";
    let iluminated = "";
    let timeOut = 0;
    
    elementCounter.reset();
    //let elementCounter = 0;
    compSequence.forEach((seq, index) => { 
        shapeClass = ".shape" + seq;
        iluminated = "lit-up" + seq;
        timeOut += 1500;
         //elementCounter++;
        elementCounter.increment();
        setTimeout(function(){
            shapeClass = ".shape" + seq;
            iluminated = "lit-up" + seq;
            computerLightUp(shapeClass, iluminated);
            getAudio(shapeClass);
        }, timeOut); 
    })
    if (elementCounter.value() === compSequence.length) {
            timeOut += 1500
            setTimeout(function() {
                console.log("fired")
                chooseColor();
            }, timeOut);
        }     
        
   
}

// ------ match sequence --------
function checkSequence() {
     if(JSON.stringify(compSequence) == JSON.stringify(playerSequence) ) {
        console.log("true")
        counter.increment();
        playSequence();
        document.getElementById("count").innerHTML = counter.value();
        playerSequence = [];
    } else {
            if (strict === true) {
            let failAudio = new Audio('./audio/fail-buzzer-03.mp3');
            failAudio.play();
           /*  for (var i = 0; i < 3; i++) {
                setTimeout(function() {
                    document.getElementById("counter").innerHTML="! !";
                    console.log("Test");
                }, 500 * i);
            };
            for (var i = 0; i < 3; i++) {
                setTimeout(function() {
                    document.getElementById("counter").innerHTML="--";
                    console.log("Test2");
                }, 500 * i);
            }; */
            document.getElementById("counter").innerHTML="! !";
        } else {
            playSequence();
        }
    }
}
// ------- logic for clicked pads ------
function padClicked(e) {
    console.log("SEQUENCESTATUS :", sequenceInProgress)
    if(onOff.checked) {
       if(sequenceInProgress === false) { 
        let classes = e.target.className;
        classes = classes.split(" ");
        let classShape = "." + classes[1];
        classNr = classShape.substring(6,7);
        let ilum = "lit-up" + classNr;
        playerLightUp(classShape, ilum);
        playerSequence.push(Number(classNr));
        document.querySelector(classShape).addEventListener('mouseup', lightsOut);
        console.log("playerSeq: ", playerSequence)
      } 
    }
}

function playerLightUp(shapeClass, iluminated){
    document.querySelector(shapeClass).classList.add(iluminated);
    console.log("shapeClass:", shapeClass)
    getAudio(shapeClass);
}
// ------- shared logic - computer / player -------
function lightsOut(e) {
    let classes = e.target.classList.value.split(" ");
    e.target.classList.remove(classes[classes.length-1]);
    checkSequence();
}

// ------- Sound logic --------
function getAudio(shapeClass) {
    let audioFile = document.querySelector(shapeClass).querySelector("audio");
    console.log(audioFile)
    audioFile.play();
}

