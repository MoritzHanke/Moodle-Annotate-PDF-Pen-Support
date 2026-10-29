
if (window.location.href.toLowerCase().includes("moodle")){
    let currentbutton = "";
    let last_draw_button = "penbutton";

    let dont_draw_classes = ["commentbutton", "commentcolourbutton", "dragbutton"]; //should not be switched back when drawing
    let neutral_classes = ["selectbutton"]; //switch back only if manually selected
    let draw_classes = ["penbutton", "linebutton", "rectanglebutton", "ovalbutton", // switch back
        "highlightbutton", "stampbutton", "currentstampbutton"];

    let observer = null;
    let test_button = null;

    function check_init(){
        console.log("button:" + test_button);
        if (currentbutton === "" || !document.contains(test_button)) {
            currentbutton = "_test";
            let _button = document.getElementsByClassName("penbutton");
            if (_button.length >= 1) {
                test_button = _button[0];
            }

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

            // remove the "changes-saved" message after every change
            let warning_container = document.getElementsByClassName("warningmessages");
            if (warning_container.length >= 1) {
                if (observer !== null) {
                    observer.disconnect();
                }
                observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === Node.ELEMENT_NODE &&
                                (node.textContent === "Entwurf für die Anmerkungen gespeichert" ||
                                    node.textContent === "Draft annotations saved")
                                ) {
                                node.remove();
                            }
                        });
                    });
                });
                observer.observe(warning_container[0], { childList: true });
            }
        }
    }

    function reset_buttons(){
        console.log("RESET");
        currentbutton = "";
        last_draw_button = "penbutton";
        //in case the buttons somehow disappear and we need to reinit them
        if (observer) {
            observer.disconnect();
        }
    }

    document.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'pen') {
            if ((event.buttons & 32) !== 0) { // Button 32 --> Pen eraser button
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
}
