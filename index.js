// 1. The unified logic function (handles both clicks and keys)
function makeBreakSound(key) {
    // Convert to lowercase so Caps Lock doesn't break the instrument
    switch (key.toLowerCase()) {
        case "w":
            new Audio("sounds/tom-1.mp3").play();
            break;
        case "a":
            new Audio("sounds/tom-2.mp3").play();
            break;
        case "s":
            new Audio("sounds/tom-3.mp3").play();
            break;
        case "d":
            new Audio("sounds/tom-4.mp3").play();
            break;
        case "j":
            new Audio("sounds/snare.mp3").play();
            break;
        case "k":
            new Audio("sounds/crash.mp3").play();
            break;
        case "l":
            new Audio("sounds/kick-bass.mp3").play();
            break;
        default:
            console.log(`No sound assigned to: ${key}`);
    }
}

// 2. Click Event Listener
document.querySelectorAll(".drum").forEach(button => {
    button.addEventListener("click", function () {
        makeBreakSound(this.innerHTML);
        buttonAnimation(this.innerHTML);
    });
});

// 3. Keyboard Event Listener
document.addEventListener("keydown", function (event) {
    makeBreakSound(event.key);
    buttonAnimation(event.key);
});

function buttonAnimation(currentKey) {
    var activeButton = document.querySelector("." + currentKey);
    activeButton.classList.add("pressed");
    setTimeout(function () {
        activeButton.classList.remove("pressed");
    }, 100);
}