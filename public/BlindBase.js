function Score(id, T) {
    // inscrit le score dans la case demandé
    let element = document.getElementById(id);
    let total = document.getElementById(T);
    let content = element.innerHTML;
    element.innerHTML = (parseInt(content) + 1).toString();
    new_total = total.innerHTML;
    total.innerHTML = (parseInt(new_total) + 1).toString();
}

function checkBox() {
    // changer les themes de la page
    let root = document.querySelector(":root");
    if (document.getElementById("checkbox").checked) {
        root.style.setProperty("--bg-color", "rgba(35, 35, 45, 0.9)");
        root.style.setProperty("--nav-color", "rgb(30, 30, 30)");
        root.style.setProperty("--font-color", "white");
        root.style.setProperty("--navlinks-color", "rgba(35, 35, 35, 0.7)");
    } else {
        root.style.setProperty("--bg-color", "white");
        root.style.setProperty("--nav-color", "white");
        root.style.setProperty("--font-color", "black");
        root.style.setProperty("--navlinks-color", "rgba(112, 112, 112, 0.7)");
    }
}

function sliderJs(id, num_value, num_base) {
    // change valeur du volume des bases
    let slider = document.getElementById(id);
    let valueX = document.querySelector(num_value);
    valueX.innerHTML = slider.value;
}

var button1 = document.getElementById("button1");
var text1 = document.querySelector(".on_off1");
var base1 = "eteint";
function changeColor1() {
    // change couleur base 1
    if (base1 == "eteint") {
        if (
            (base2 == "eteint" || base2 == "selectionné") &&
            (base3 == "eteint" || base3 == "selectionné") &&
            (base4 == "eteint" || base4 == "selectionné")
        ) {
            button1.style.backgroundColor = "orange";
            base1 = "selectionné";
        }
    } else if (base1 == "selectionné" || base1 == "allumé") {
        button1.style.backgroundColor = "white";
        base1 = "eteint";
        stopBase(0);
    }
    if (
        base1 == "eteint" &&
        base2 == "eteint" &&
        base3 == "eteint" &&
        base4 == "eteint"
    ) {
        buttonPlay.style.backgroundColor = "white";
        bPlay = "eteint";
    }
    if (text1.innerHTML == "ON") {
        text1.innerHTML = "OFF";
    }
}

var button2 = document.getElementById("button2");
var text2 = document.querySelector(".on_off2");
var base2 = "eteint";
function changeColor2() {
    // change couleur base 2
    if (base2 == "eteint") {
        if (
            (base1 == "eteint" || base1 == "selectionné") &&
            (base3 == "eteint" || base3 == "selectionné") &&
            (base4 == "eteint" || base4 == "selectionné")
        ) {
            button2.style.backgroundColor = "orange";
            base2 = "selectionné";
        }
    } else if (base2 == "selectionné" || base2 == "allumé") {
        button2.style.backgroundColor = "white";
        base2 = "eteint";
        stopBase(1);
    }
    if (
        base2 == "eteint" &&
        base1 == "eteint" &&
        base3 == "eteint" &&
        base4 == "eteint"
    ) {
        buttonPlay.style.backgroundColor = "white";
        bPlay = "eteint";
    }
    if (text2.innerHTML == "ON") {
        text2.innerHTML = "OFF";
    }
}

var button3 = document.getElementById("button3");
var text3 = document.querySelector(".on_off3");
var base3 = "eteint";
function changeColor3() {
    // change couleur base 3
    if (base3 == "eteint") {
        if (
            (base2 == "eteint" || base2 == "selectionné") &&
            (base1 == "eteint" || base1 == "selectionné") &&
            (base4 == "eteint" || base4 == "selectionné")
        ) {
            button3.style.backgroundColor = "orange";
            base3 = "selectionné";
        }
    } else if (base3 == "selectionné" || base3 == "allumé") {
        button3.style.backgroundColor = "white";
        base3 = "eteint";
        stopBase(2);
    }
    if (
        base3 == "eteint" &&
        base2 == "eteint" &&
        base1 == "eteint" &&
        base4 == "eteint"
    ) {
        buttonPlay.style.backgroundColor = "white";
        bPlay = "eteint";
    }
    if (text3.innerHTML == "ON") {
        text3.innerHTML = "OFF";
    }
}

var button4 = document.getElementById("button4");
var text4 = document.querySelector(".on_off4");
var base4 = "eteint";
function changeColor4() {
    // change couleur base 4
    if (base4 == "eteint") {
        if (
            (base2 == "eteint" || base2 == "selectionné") &&
            (base3 == "eteint" || base3 == "selectionné") &&
            (base1 == "eteint" || base1 == "selectionné")
        ) {
            button4.style.backgroundColor = "orange";
            base4 = "selectionné";
        }
    } else if (base4 == "selectionné" || base4 == "allumé") {
        button4.style.backgroundColor = "white";
        base4 = "eteint";
        stopBase(3);
    }
    if (
        base4 == "eteint" &&
        base2 == "eteint" &&
        base3 == "eteint" &&
        base1 == "eteint"
    ) {
        buttonPlay.style.backgroundColor = "white";
        bPlay = "eteint";
    }
    if (text4.innerHTML == "ON") {
        text4.innerHTML = "OFF";
    }
}

var buttonPlay = document.getElementById("bplay");
var bPlay = "eteint";
function playGame() {
    // fonction play, active les bases electionné
    if (bPlay == "eteint") {
        if (
            base1 == "selectionné" ||
            base2 == "selectionné" ||
            base3 == "selectionné" ||
            base4 == "selectionné"
        ) {
            buttonPlay.style.backgroundColor = "rgb(25, 255, 25)";
            bPlay = "allumé";
        }
        if (base1 == "selectionné") {
            button1.style.backgroundColor = "rgb(25, 255, 25)";
            text1.innerHTML = "ON";
            base1 = "allumé";
            playBase(0);
        }
        if (base2 == "selectionné") {
            button2.style.backgroundColor = "rgb(25, 255, 25)";
            text2.innerHTML = "ON";
            base2 = "allumé";
            playBase(1);
        }
        if (base3 == "selectionné") {
            button3.style.backgroundColor = "rgb(25, 255, 25)";
            text3.innerHTML = "ON";
            base3 = "allumé";
            playBase(2);
        }
        if (base4 == "selectionné") {
            button4.style.backgroundColor = "rgb(25, 255, 25)";
            text4.innerHTML = "ON";
            base4 = "allumé";
            playBase(3);
        }
    } else if ((bPlay = "allumé")) {
        if (
            base1 == "allumé" ||
            base2 == "allumé" ||
            base3 == "allumé" ||
            base4 == "allumé"
        ) {
            buttonPlay.style.backgroundColor = "white";
            bPlay = "eteint";
        }
        if (base1 == "allumé") {
            button1.style.backgroundColor = "white";
            text1.innerHTML = "OFF";
            base1 = "eteint";
            stopBase(0);
        }
        if (base2 == "allumé") {
            button2.style.backgroundColor = "white";
            text2.innerHTML = "OFF";
            base2 = "eteint";
            stopBase(1);
        }
        if (base3 == "allumé") {
            button3.style.backgroundColor = "white";
            text3.innerHTML = "OFF";
            base3 = "eteint";
            stopBase(2);
        }
        if (base4 == "allumé") {
            button4.style.backgroundColor = "white";
            text4.innerHTML = "OFF";
            base4 = "eteint";
            stopBase(3);
        }
    }
}

function toggleMenu() {
    // pour afficher le menu avec les detailles des 4 bases
    flA = "OFF";
    fl1 = "OFF";
    fl2 = "OFF";
    fl3 = "OFF";
    fl4 = "OFF";
    const navbar = document.querySelector(".navbar");
    const burger = document.querySelector(".burger");
    const fleche1 = document.querySelector(".first");
    const fleche2 = document.querySelector(".second");
    const fleche3 = document.querySelector(".third");
    const fleche4 = document.querySelector(".four");
    const flecheAll = document.querySelector(".all");
    burger.addEventListener("click", () => {
        navbar.classList.toggle("show-nav");
        if (flA == "ON") {
            navbar.classList.toggle("show-fleche_all");
            flA = "OFF";
        }
        if (fl1 == "ON") {
            navbar.classList.toggle("show-fleche1");
            fl1 = "OFF";
        }
        if (fl2 == "ON") {
            navbar.classList.toggle("show-fleche2");
            fl2 = "OFF";
        }
        if (fl3 == "ON") {
            navbar.classList.toggle("show-fleche3");
            fl3 = "OFF";
        }
        if (fl4 == "ON") {
            navbar.classList.toggle("show-fleche4");
            fl4 = "OFF";
        }
    });
    flecheAll.addEventListener("click", () => {
        if (flA == "OFF") {
            navbar.classList.toggle("show-fleche_all");
            flA = "ON";
            if (fl1 == "OFF") {
                navbar.classList.toggle("show-fleche1");
                fl1 = "ON";
            }
            if (fl2 == "OFF") {
                navbar.classList.toggle("show-fleche2");
                fl2 = "ON";
            }
            if (fl3 == "OFF") {
                navbar.classList.toggle("show-fleche3");
                fl3 = "ON";
            }
            if (fl4 == "OFF") {
                navbar.classList.toggle("show-fleche4");
                fl4 = "ON";
            }
        } else if (flA == "ON") {
            navbar.classList.toggle("show-fleche_all");
            flA = "OFF";
            if (fl1 == "ON") {
                navbar.classList.toggle("show-fleche1");
                fl1 = "OFF";
            }
            if (fl2 == "ON") {
                navbar.classList.toggle("show-fleche2");
                fl2 = "OFF";
            }
            if (fl3 == "ON") {
                navbar.classList.toggle("show-fleche3");
                fl3 = "OFF";
            }
            if (fl4 == "ON") {
                navbar.classList.toggle("show-fleche4");
                fl4 = "OFF";
            }
        }
    });
    fleche1.addEventListener("click", () => {
        if (fl1 == "OFF") {
            navbar.classList.toggle("show-fleche1");
            fl1 = "ON";
        } else if (fl1 == "ON") {
            navbar.classList.toggle("show-fleche1");
            fl1 = "OFF";
        }
    });
    fleche2.addEventListener("click", () => {
        if (fl2 == "OFF") {
            navbar.classList.toggle("show-fleche2");
            fl2 = "ON";
        } else if (fl2 == "ON") {
            navbar.classList.toggle("show-fleche2");
            fl2 = "OFF";
        }
    });
    fleche3.addEventListener("click", () => {
        if (fl3 == "OFF") {
            navbar.classList.toggle("show-fleche3");
            fl3 = "ON";
        } else if (fl3 == "ON") {
            navbar.classList.toggle("show-fleche3");
            fl3 = "OFF";
        }
    });
    fleche4.addEventListener("click", () => {
        if (fl4 == "OFF") {
            navbar.classList.toggle("show-fleche4");
            fl4 = "ON";
        } else if (fl4 == "ON") {
            navbar.classList.toggle("show-fleche4");
            fl4 = "OFF";
        }
    });
}
toggleMenu();

function playBase(i) {
    fetch(`/api/play/${i}`, { method: "post" }).catch((e) => {
        console.log(e);
    });
}

function stopBase(i) {
    fetch(`/api/stop/${i}`, { method: "post" }).catch((e) => {
        console.log(e);
    });
}
