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
let makeCounter =   function() {
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
// creating to instances of makeCounter
let counter = makeCounter();
let elementCounter = makeCounter();

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

// ----- Computer sequence logic -------
let compSequence = [];
let playerSequence = [];
let classNr = 0;
function chooseColor(){
    const randomNumber =  Math.floor(Math.random() * (MAX - MIN + 1)) + MIN; 
    const shapeClass = ".shape"+randomNumber;
    const iluminated = "lit-up"+randomNumber;
    compSequence.push(randomNumber);
    computerLightUp(shapeClass, iluminated);
    console.log("compSeq: ",compSequence);
}
function computerLightUp(shapeClass, iluminated){
        document.querySelector(shapeClass).classList.add(iluminated);
        setTimeout(function(){
            if(document.querySelector(shapeClass).classList.contains(iluminated)) {
                document.querySelector(shapeClass).classList.remove(iluminated);
            }
        }, 1000); 

}
// ----- Play Sequence ------
function playSequence() {
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
           // counter++;
           counter.increment();
            playSequence();
            document.getElementById("count").innerHTML = counter.value();
            playerSequence = [];
    }
}
// ------- logic for clicked pads ------
function padClicked(e) {
    if(onOff.checked) {
        let classes = e.target.className
        console.log(classes)
        classes = classes.split(" ");
        console.log(classes)
        let classShape = "."+classes[1];
        console.log(classShape)
        classNr = classShape.substring(6, 7);
        console.log("classNr", classNr)
        
        let ilum = "lit-up" + classNr;
        console.log(ilum)
        playerLightUp(classShape, ilum);
        playerSequence.push(Number(classNr));
        document.querySelector(classShape).addEventListener('mouseup', lightsOut);
        console.log("playerSeq: ", playerSequence)
        
    }
}

function playerLightUp(shapeClass, iluminated){
        document.querySelector(shapeClass).classList.add(iluminated);
}
// ------- shared logic - computer / player -------
function lightsOut(e) {
  let classes = e.target.classList.value.split(" ");
  e.target.classList.remove(classes[classes.length-1]);
  checkSequence();
}



