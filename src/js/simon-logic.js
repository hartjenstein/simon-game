"use strict";
/* ----------- Simon Game Logic -------------*/
// Constants
    const MAX = 4;
    const MIN = 1;
// ---------Event Listeners ---------

// --- On-Off Switch 
let onOff = document.querySelector(".onoffswitch-checkbox");
onOff.addEventListener('click', turnOnOff);

// --- start Button 
let startBtn = document.querySelector(".start");
startBtn.addEventListener('click', startGame);

// ----- Pad Press --------
let pads = document.querySelectorAll(".pad");

for (let pad of pads) {
    pad.addEventListener("mousedown", padClicked );
}
if(onOff.checked) {
    turnOn();
}

// --------- Counter logic -------
let counter = 0;

// ----- On - Off Button logic -----
function turnOnOff(){
    counter = 0;
    document.getElementById("count").innerHTML = counter;
    if(!onOff.checked) {
        onOff.checked = false; 
    } else {
        onOff.checked = true; 
    }
}

function startGame() {
    
    if(onOff.checked) {
        counter === 0
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
    let randomNumber =  Math.floor(Math.random() * (MAX - MIN +1)) + MIN; 
    var shapeClass = ".shape"+randomNumber;
    var iluminated = "lit-up"+randomNumber;
    compSequence.push(randomNumber);
    computerLightUp(shapeClass, iluminated);
    /*setTimeout(function(){
         computerLightUp(shapeClass, iluminated);
    }, 1000);*/
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
    var shapeClass;
    var iluminated;
    let timeOut = 0;
    let elementCounter = 0;
    compSequence.forEach((seq, index) => { 
        shapeClass = ".shape" + seq;
        iluminated = "lit-up" + seq;
         timeOut += 1500;
         elementCounter++;
        setTimeout(function(){
            shapeClass = ".shape" + seq;
            iluminated = "lit-up" + seq;
            computerLightUp(shapeClass, iluminated);
        }, timeOut); 
    })
    if (elementCounter === compSequence.length) {
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
            counter++;
            playSequence();
            document.getElementById("count").innerHTML = counter;
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



