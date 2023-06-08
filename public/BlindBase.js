async function indicateurColor() {
    for (let i = 0; i < 4; i++) {
        let borderBase = document.getElementsByClassName(`base_${i}`);
        let r = await fetch(`/api/play/${i}`, { method: "POST" });
        let rjson = await r.json();
        if (rjson.up == false) {
            borderBase.style.borderColor = 'red';
        } else if (rjson.up == true) {
            borderBase.style.borderColor = 'green';
        }
    }
}
// setInterval(() => {indicateurColor();}, 3000);

// function checked() {
//     if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
//         document.getElementById("checkbox").checked = true;
//     } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
//         document.getElementById("checkbox").checked = false;
//     }
// }
// checked();

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
        let sliderId = `slider${i + 1}`;
        let valueSelector = `.value${i + 1}`;
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
    const e = document.getElementById(`button${i}`);
    e.status = BASE_ETEINTE;
    e.onclick = baseClick;
}

async function baseClick(event) {
    const element = event.srcElement;
    let otherBases = [];
    let etatBases = [];
    for (let i = 0; i < 4; i++) {
        let e = document.getElementById(`button${i}`);
        var t = document.querySelector(`.on_off${i}`);
        etatBases.push(t);
        if (e != element) otherBases.push(e);
    }
    if (element.status == BASE_ETEINTE) {
        let r = await fetch(`/api/play/${element.value - 1}`, { method: "POST" });
        if (r.status == 200) {
            element.style.backgroundColor = "green";
            element.status = BASE_ALLUME;
        }
        else {
            element.style.backgroundColor = "rgb(200, 200, 200)";
            
            setTimeout(() => { element.style.backgroundColor = "white"; }, 250);
        }
    } else if (element.status == BASE_ALLUME) {
        fetch(`/api/stop/${element.value - 1}`, { method: "POST" });
        element.style.backgroundColor = "white";
        element.status = BASE_ETEINTE;
    }
    if (etatBases[element.value - 1].innerHTML == "ON") {
        etatBases[element.value - 1].innerHTML = "OFF";
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
    const FELCHE_OFF = 0;
    const FELCHE_ON = 1;
    let flA = FELCHE_OFF;
    let otherFleches = [];
    const navbar = document.querySelector(".navbar");
    const burger = document.querySelector(".burger");
    for (let i = 0; i < 4; i++) {
        let f = document.getElementById(`Fleche${i}`);
        f.status = FELCHE_OFF;
        otherFleches.push(f);
    }
    const flecheAll = document.getElementById("all");
    burger.addEventListener("click", () => {
        navbar.classList.toggle("show-nav");
        if (flA == FELCHE_ON) {
            navbar.classList.toggle("show-fleche_all");
            flA = FELCHE_OFF;
        }
        for (let i = 0; i < 4; i++) {
            if (otherFleches[i].status == FELCHE_ON) {
                navbar.classList.toggle(`show-fleche${i}`);
                otherFleches[i].status = FELCHE_OFF;
            }
        }
    });
    flecheAll.addEventListener("click", () => {
        if (flA == FELCHE_OFF) {
            navbar.classList.toggle("show-fleche_all");
            flA = FELCHE_ON;
            for (let i = 0; i < 4; i++) {
                if (otherFleches[i].status == FELCHE_OFF) {
                    navbar.classList.toggle(`show-fleche${i}`);
                    otherFleches[i].status = FELCHE_ON;
                }
            }
        } else if (flA == FELCHE_ON) {
            navbar.classList.toggle("show-fleche_all");
            flA = FELCHE_OFF;
            for (let i = 0; i < 4; i++) {
                if (otherFleches[i].status == FELCHE_ON) {
                    navbar.classList.toggle(`show-fleche${i}`);
                    otherFleches[i].status = FELCHE_OFF;
                }
            }
        }
    });
    for (let i = 0; i < 4; i++) {
        otherFleches[i].addEventListener("click", () => {
            if (otherFleches[i].status == FELCHE_OFF) {
                navbar.classList.toggle(`show-fleche${i}`);
                otherFleches[i].status = FELCHE_ON;
            } else if (otherFleches[i].status == FELCHE_ON) {
                navbar.classList.toggle(`show-fleche${i}`);
                otherFleches[i].status = FELCHE_OFF;
            }
        });
    }
}
toggleMenu();