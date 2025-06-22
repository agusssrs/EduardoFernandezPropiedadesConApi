let ubicacionPrincipal = window.scrollY;
let $nav = document.querySelector("header");

window.addEventListener("scroll", function() {
    let desplazamientoActual = window.scrollY;

    if(ubicacionPrincipal >= desplazamientoActual) {
        $nav.style.top = "0px";
    } else {
        $nav.style.top = "-96px";
    }

    ubicacionPrincipal = desplazamientoActual;
});