async function indicateurColor() {
    for (let i = 0; i < 4; i++) {
        let borderBase = document.getElementById(`buttonBase${i}`);
        let r = await fetch(`/api/ping/${i}`);
        let rjson = await r.json();
        if (rjson.up == false) {
            borderBase.style.borderColor = 'red';
        } else if (rjson.up == true) {
            borderBase.style.borderColor = 'green';
        }
    }
}
indicateurColor();
setInterval(() => {indicateurColor();}, 10000);

function checked() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark-mode');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.documentElement.classList.add('light-mode');
    }
}   
checked();

// function btnChecked() {
//     if (document.documentElement.classList.contains('dark-mode')) {
//         document.documentElement.classList.remove('dark-mode');
//         document.documentElement.classList.add('light-mode');
//     } else {
//         document.documentElement.classList.remove('light-mode');
//         document.documentElement.classList.add('dark-mode');
//     }
// }

function sliderJs(id, num_value) {
    // change valeur du volume des bases
    let slider = document.getElementById(id);
    let valueX = document.querySelector(num_value);
    valueX.innerHTML = slider.value;
}

Array.prototype.forEach.call(document.getElementsByClassName("slider"), (e) => {
    let slider = e.children[0];
    slider.addEventListener("change", (e) => {
        let id = parseInt(e.target.id.at(-1)) - 1;
        fetch(`/api/volume/${id}`, {
            method: "POST",
            body: JSON.stringify({ volume: parseInt(e.target.value) }),
            headers: { "Content-Type": "application/json" },
        });
    });
});

function updateSliders() {
    for (let i = 0; i < 4; i++) {
        let sliderId = `slider${i}`;
        let valueSelector = `.value${i}`;
        let slider = document.getElementById(sliderId);
        let value = document.querySelector(valueSelector);
        fetch(`/api/volume/${i}`)
            .then(async (r) => {
                let val = (await r.json()).volume;
                slider.value = val;
                value.innerHTML = val;
            })
            .catch(() => (value.innerHTML = "--"));
    }
}
updateSliders();

const BASE_ETEINTE = 0;
const BASE_ALLUME = 2;

for (let i = 0; i < 4; i++) {
    const e = document.getElementById(`buttonBase${i}`);
    e.status = BASE_ETEINTE;
    e.onclick = baseClick;
}

async function baseClick(event) {
    const element = event.srcElement;
    let otherBases = [];
    let etatBases = [];
    for (let i = 0; i < 4; i++) {
        let e = document.getElementById(`buttonBase${i}`);
        var t = document.querySelector(`.on_off${i}`);
        etatBases.push(t);
        if (e != element) otherBases.push(e);
    }
    if (element.status == BASE_ETEINTE) {
        let r = await fetch(`/api/play/${element.value - 1}`, { method: "POST" });
        if (r.status == 200) {
            element.style.backgroundColor = "green";
            element.status = BASE_ALLUME;
            if (etatBases[element.value - 1].innerHTML == "OFF") {
                etatBases[element.value - 1].innerHTML = "ON";
            }
        }
    } else if (element.status == BASE_ALLUME) {
        await fetch(`/api/stop/${element.value - 1}`, { method: "POST" });
        element.style.backgroundColor = "white";
        element.status = BASE_ETEINTE;
        if (etatBases[element.value - 1].innerHTML == "ON") {
            etatBases[element.value - 1].innerHTML = "OFF";
        }
    }
}

async function reponseFetch() {
    let reponse = Boolean();
    try {
        fetch(`/api/play/${i}`, { method: "POST" });
    } catch (e) {
        if (e instanceof TypeError) {
            reponse = Boolean(fetch(`/api/play/${i}`, { method: "POST" }));
        }
    }
    return reponse;
}

function toggleMenu() {
    // pour afficher le menu avec les detailles des 4 bases
    const ARROW_OFF = 0;
    const ARROW_ON = 1;
    let flA = ARROW_OFF;
    let otherArrows = [];
    const navbar = document.querySelector(".navbar");
    const burger = document.querySelector(".menu_burger");
    for (let i = 0; i < 4; i++) {
        let f = document.getElementById(`Arrow${i}`);
        f.status = ARROW_OFF;
        otherArrows.push(f);
    }
    const arrowAll = document.getElementById("all_descriptions");
    burger.addEventListener("click", () => {
        navbar.classList.toggle("show_nav");
        if (flA == ARROW_ON) {
            navbar.classList.toggle("show_all_arrows");
            flA = ARROW_OFF;
        }
        for (let i = 0; i < 4; i++) {
            if (otherArrows[i].status == ARROW_ON) {
                navbar.classList.toggle(`show_arrow${i}`);
                otherArrows[i].status = ARROW_OFF;
            }
        }
    });
    arrowAll.addEventListener("click", () => {
        if (flA == ARROW_OFF) {
            navbar.classList.toggle("show_all_arrows");
            flA = ARROW_ON;
            for (let i = 0; i < 4; i++) {
                if (otherArrows[i].status == ARROW_OFF) {
                    navbar.classList.toggle(`show_arrow${i}`);
                    otherArrows[i].status = ARROW_ON;
                }
            }
        } else if (flA == ARROW_ON) {
            navbar.classList.toggle("show_all_arrows");
            flA = ARROW_OFF;
            for (let i = 0; i < 4; i++) {
                if (otherArrows[i].status == ARROW_ON) {
                    navbar.classList.toggle(`show_arrow${i}`);
                    otherArrows[i].status = ARROW_OFF;
                }
            }
        }
    });
    for (let i = 0; i < 4; i++) {
        otherArrows[i].addEventListener("click", () => {
            if (otherArrows[i].status == ARROW_OFF) {
                navbar.classList.toggle(`show_arrow${i}`);
                otherArrows[i].status = ARROW_ON;
            } else if (otherArrows[i].status == ARROW_ON) {
                navbar.classList.toggle(`show_arrow${i}`);
                otherArrows[i].status = ARROW_OFF;
            }
        });
    }
}
toggleMenu();