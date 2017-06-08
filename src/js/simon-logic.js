"use strict";
/* ----------- Simon Game Logic -------------*/
// Constants
    const MAX = 4;
    const MIN = 1;
// ---------EventListener ---------

// --- On-Off Switch 
let onOff = document.querySelector(".onoffswitch-checkbox");
onOff.addEventListener('click', turnOnOff);

// --- start Button 
let startBtn = document.querySelector(".start");
console.log(startBtn)
startBtn.addEventListener('click', startGame);


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

    setTimeout(function(){
         document.querySelector(shapeClass).classList.add(iluminated);
    }, 1000);
   
    setTimeout(function(){
        document.querySelector(shapeClass).classList.remove(iluminated);
    }, 2000);
}
