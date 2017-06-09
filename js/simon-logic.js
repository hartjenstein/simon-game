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
console.log(startBtn)
startBtn.addEventListener('click', startGame);

// ----- Pad Press --------
let pads = document.querySelectorAll(".pad");

for (let pad of pads) {
    pad.addEventListener("click", padClicked );
}
if(onOff.checked) {
    turnOn();
}
function turnOnOff(){
    console.log(onOff.checked)
    if(!onOff.checked) {
        onOff.checked = false; 
    } else {
        onOff.checked = true; 
    }
}

function startGame() {
    
    if(onOff.checked) {
        console.log("start");
        chooseColor();

    }

}
function chooseColor(){
    let randomNumber =  Math.floor(Math.random() * (MAX - MIN +1)) + MIN; 
    var shapeClass = ".shape"+randomNumber;
    var iluminated = "lit-up"+randomNumber;
    console.log(iluminated);
    setTimeout(function(){
         lightUp(shapeClass, iluminated);
    }, 1000);
   
   
}
function padClicked(e) {
    let classes = e.target.className
    console.log(classes)
    classes = classes.split(" ");
    console.log(classes)
    let classShape = "."+classes[1];
    console.log(classShape)
    let classNr = classShape.substring(6, 7);
    let ilum = "lit-up" + classNr;
    console.log(ilum)
    lightUp(classShape, ilum);
}
function lightUp(shapeClass, iluminated){
    document.querySelector(shapeClass).classList.add(iluminated);
    setTimeout(function(){
        document.querySelector(shapeClass).classList.remove(iluminated);
    }, 1000);
}