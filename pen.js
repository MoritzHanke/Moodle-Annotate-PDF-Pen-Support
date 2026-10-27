
let currentbutton = ""
let last_draw_button = "penbutton"

let dont_draw_classes = ["commentcolourbutton", "dragbutton"] //should not be switched back when drawing
let neutral_classes = ["selectbutton", "commentbutton"] //switch back only if manually selected
let draw_classes = ["penbutton", "linebutton", "rectanglebutton", "ovalbutton", // switch back
    "highlightbutton", "stampbutton", "currentstampbutton"]

function check_init(){
    if (currentbutton === "") {
        console.log("init Buttons");
        for (let bc of dont_draw_classes) {
            let button = document.getElementsByClassName(bc);

            if (button.length >= 1) {
                button[0].addEventListener("click", function() {
                    currentbutton=bc;
                });
            }
        }
        for (let bc of draw_classes) {
            let button = document.getElementsByClassName(bc);

            if (button.length >= 1) {
                button[0].addEventListener("click", function() {
                    currentbutton=bc;
                    last_draw_button=bc;
                });
            }
        }
        for (let bc of neutral_classes) {
            //if pressed normally, they should change last_draw_button, but not if pressed automatically
            let button = document.getElementsByClassName(bc);

            if (button.length >= 1) {
                button[0].addEventListener("click", function() {
                    currentbutton=bc;
                    last_draw_button=bc;
                });
            }
        }
    }
}

function reset_buttons(){
    console.log("RESET");
    currentbutton = "";
    last_draw_button = "penbutton";
    //in case the buttons somehow disappear and we need to reinit them
}

document.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'pen') {
        if (event.buttons === 32) { // Button 1 (primary barrel button)
            pressButtonAutomatically("selectbutton");
        } else {
            pressButtonAutomatically(last_draw_button);
        }
    } else if (event.pointerType === 'touch') {
        pressButtonAutomatically("dragbutton");
    }
});

function pressButtonAutomatically(button_class){
    if (currentbutton === button_class) return;

    if (neutral_classes.includes(button_class)) {
        // should be reset, meaning dont change last_draw_button
        let button = document.getElementsByClassName(button_class);

        if (button.length >= 1) {
            let b = last_draw_button; //
            check_init();
            button[0].click();
            last_draw_button = b;
        }else{
            reset_buttons();
        }
    } else {
        // just click the button
        let button = document.getElementsByClassName(button_class);
        if (button.length >= 1) {
            check_init();
            button[0].click();
        }else{
            reset_buttons();
        }
    }
}
