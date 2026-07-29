define([], function() {

/* =========================================
   ESTADO GLOBAL Y LÓGICA DE APLICACIÓN CSS
========================================= */
const FARO_FILTER_DEFAULTS = Object.freeze({
    brillo: 50,
    contraste: 50,
    saturacion: 50,
    grises: false
});

const faroState = {

    // Lectura
    voz: false,
    velocidadVoz: 50,
    volumenVoz: 100,

    // Texto
    fuente: "default",        // default | sans | serif | dyslexic
    tamanoTexto: "normal",    // small | normal | large
    alineacion: "left",       // left | center | right

    // Visual
    brillo: FARO_FILTER_DEFAULTS.brillo,
    contraste: FARO_FILTER_DEFAULTS.contraste,
    saturacion: FARO_FILTER_DEFAULTS.saturacion,
    grises: FARO_FILTER_DEFAULTS.grises,

    altoContraste: false,
    modoOscuro: false,

    // Panel
    posicionBoton: "right",

    // Perfil aplicado
    perfil: null

};

const FARO_TOUR_KEY = "FARO_TOUR_VISTO";

function aplicarEstado() {

    actualizarFuente();

    actualizarTamanoTexto();

    actualizarAlineacion();

    actualizarFiltros(false);

    actualizarContraste();

    actualizarModoOscuro();

    actualizarPosicionBoton();

}

const SUBMENUS = [

    "submenuApariencia",
    "submenuPerfil",
    "submenuLectura",
    "submenuAjustes",
    "submenuAjustesVisuales",
    "submenuTexto",
    "submenuTecladoVirtual"

];

function marcarTourComoVisto() {
    localStorage.setItem(FARO_TOUR_KEY, "1");
}

function tourYaVisto() {
    return localStorage.getItem(FARO_TOUR_KEY) === "1";
}

// Generar e inyectar el tag <style> para cambios en el cuerpo general
(function initFaroStyles() {
    const style = document.createElement('style');
    style.id = 'faro-dynamic-styles';
    style.innerHTML = `
        /* Tamaños */
        body.faro-text-small { font-size:90% !important; }
        body.faro-text-large { font-size:120% !important; }        
        /* Alineaciones */
        body.faro-align-left, body.faro-align-left *:not(#faro-extension-root *) { text-align: left !important; }
        body.faro-align-center, body.faro-align-center *:not(#faro-extension-root *) { text-align: center !important; }
        body.faro-align-right, body.faro-align-right *:not(#faro-extension-root *) { text-align: right !important; }
        
        /* Fuentes */
        body.faro-font-sans, body.faro-font-sans *:not(#faro-extension-root *) { font-family: Arial, Helvetica, sans-serif !important; }
        body.faro-font-serif, body.faro-font-serif *:not(#faro-extension-root *) { font-family: "Times New Roman", Times, serif !important; }
        body.faro-font-dyslexic, body.faro-font-dyslexic *:not(#faro-extension-root *) { font-family: "Comic Sans MS", "OpenDyslexic", sans-serif !important; }

        /* Filtros visuales: se aplican al campus sin desplazar el widget fijo FARO. */
        body.faro-content-filtered > :not(#faro-extension-root):not(script):not(style) {
            filter: var(--faro-content-filter) !important;
        }
        
        /* Contraste Inteligente (Alto Contraste) */
        body.faro-high-contrast, body.faro-high-contrast *:not(#faro-extension-root *) { 
            background-color: #000000 !important; color: #ffff00 !important; border-color: #ffff00 !important;
        }
        
        /* Modo Oscuro */
        body.faro-dark-mode,
        body.faro-dark-mode *:not(#faro-extension-root):not(#faro-extension-root *) {
            background-color:#121212 !important;
            color:#e0e0e0 !important;
            border-color:#333 !important;
        }      
    `;
    document.head.appendChild(style);
})();

/* =========================================
   FUNCIONES DE NAVEGACIÓN FARO
========================================= */
function cerrarFaro(){

    marcarTourComoVisto();

    const faroBox=document.getElementById("faroBox");

    if(faroBox){
        faroBox.style.display="none";
    }

}

function ocultarSubmenus() {

    SUBMENUS.forEach(id => {

        const submenu = document.getElementById(id);

        if (!submenu) {
            return;
        }

        submenu.style.display = "none";
        submenu.setAttribute("aria-hidden", "true");

    });

}


function toggleMenu() {

    const menu = document.getElementById("menuAccesibilidad");
    const btnFlotante = document.getElementById("btnFlotante");

    let algunSubmenuAbierto = false;

    SUBMENUS.forEach(id => {

        const el = document.getElementById(id);

        if (el && el.style.display === "block") {
            algunSubmenuAbierto = true;
        }

    });

    if (menu.style.display === "flex" || algunSubmenuAbierto) {

        menu.style.display = "none";
        menu.setAttribute("aria-hidden", "true");

        ocultarSubmenus();

        btnFlotante.setAttribute("aria-expanded", "false");

        btnFlotante.focus();

    } else {

        menu.style.display = "flex";
        menu.setAttribute("aria-hidden", "false");

        btnFlotante.setAttribute("aria-expanded", "true");

        setTimeout(() => {

            menu.querySelector("button")?.focus();

        }, 50);

    }

}

let ultimoBotonMenu = null;

function abrirSubmenu(idSubmenu) {

    // Guarda el botón desde el que se abrió
    ultimoBotonMenu = document.activeElement;

    document.getElementById("menuAccesibilidad").style.display = "none";
    document.getElementById("menuAccesibilidad")
        .setAttribute("aria-hidden", "true");

    ocultarSubmenus();

    const submenu = document.getElementById(idSubmenu);

    if (!submenu) {
        return;
    }

    submenu.style.display = "block";
    submenu.setAttribute("aria-hidden", "false");

    // Llevar el foco al primer control del submenú
    setTimeout(() => {

        submenu.querySelector(
            'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )?.focus();

    }, 50);

}

function volverAlMenu() {

    ocultarSubmenus();

    const menu = document.getElementById("menuAccesibilidad");

    menu.style.display = "flex";
    menu.setAttribute("aria-hidden", "false");

    setTimeout(() => {

        if (ultimoBotonMenu) {

            ultimoBotonMenu.focus();

        } else {

            menu.querySelector(
                'button, [role="button"]'
            )?.focus();

        }

    }, 50);

}

function cerrarTodo(){

    const menu =
        document.getElementById("menuAccesibilidad");
    const habiaPanelAbierto =
        menu?.style.display === "flex" ||
        SUBMENUS.some(id => document.getElementById(id)?.style.display === "block");

    ocultarSubmenus();

    if(menu) {
        menu.style.display="none";
        menu.setAttribute("aria-hidden", "true");
    }

    const btnFlotante = document.getElementById("btnFlotante");

    if (btnFlotante && habiaPanelAbierto) {
        btnFlotante.setAttribute("aria-expanded", "false");
        btnFlotante.focus();
    }

}

function empezarFaro(){

    marcarTourComoVisto();

    cerrarFaro();

    const menu = document.getElementById("menuAccesibilidad");
    const btnFlotante = document.getElementById("btnFlotante");

    menu.style.display="flex";
    menu.setAttribute("aria-hidden", "false");
    btnFlotante?.setAttribute("aria-expanded", "true");

    setTimeout(() => {
        menu.querySelector("button")?.focus();
    }, 50);

}
/* =========================================
   LÓGICA DE HERRAMIENTAS (AJUSTES)
========================================= */

// TEXTO: Familia Tipográfica
function cambiarFuente(tipo) {

    const anterior = faroState.fuente;

    faroState.fuente = tipo;

    actualizarFuente();

    guardarPreferenciasBackend();

    registrarEvento("ACCESSIBILITY_CHANGED", {
        adjustment_type: "font_family",
        old_value: anterior,
        new_value: tipo
    });

}

function actualizarFuente() {

    document.body.classList.remove(
        "faro-font-sans",
        "faro-font-serif",
        "faro-font-dyslexic"
    );

    if (faroState.fuente !== "default") {
        document.body.classList.add("faro-font-" + faroState.fuente);
    }

}

// TEXTO: Tamaño y Alineación UI interactiva
function seleccionarTamano(elemento, tipo) {

    const anterior = faroState.tamanoTexto;

    elemento.parentNode
        .querySelectorAll(".size-pill")
        .forEach(p => p.classList.remove("active"));

    elemento.classList.add("active");

    faroState.tamanoTexto = tipo;

    actualizarTamanoTexto();

    guardarPreferenciasBackend();

    registrarEvento("ACCESSIBILITY_CHANGED", {
        adjustment_type: "font_size",
        old_value: anterior,
        new_value: tipo
    });

}

function actualizarTamanoTexto() {

    document.body.classList.remove(
        "faro-text-small",
        "faro-text-normal",
        "faro-text-large"
    );

    if (faroState.tamanoTexto !== "normal") {
        document.body.classList.add("faro-text-" + faroState.tamanoTexto);
    }

}

function seleccionarAlineacion(elemento, tipo) {

    const anterior = faroState.alineacion;

    elemento.parentNode
        .querySelectorAll(".align-pill")
        .forEach(p => p.classList.remove("active"));

    elemento.classList.add("active");

    faroState.alineacion = tipo;

    actualizarAlineacion();

    guardarPreferenciasBackend();

    registrarEvento("ACCESSIBILITY_CHANGED", {
        adjustment_type: "alignment",
        old_value: anterior,
        new_value: tipo
    });

}

function actualizarAlineacion() {

    document.body.classList.remove(
        "faro-align-left",
        "faro-align-center",
        "faro-align-right"
    );

    document.body.classList.add(
        "faro-align-" + faroState.alineacion
    );

}

// VISUALES: Filtros de imagen CSS (Brillo, Contraste, Saturación)
function sincronizarValorFiltro(id, valor) {

    const slider = document.getElementById(id);
    const valorNumerico = Number(valor);

    if(!slider) return;

    slider.value = valorNumerico;

    const valorTexto = valorNumerico === 50
        ? "Estándar"
        : valorNumerico < 50
            ? `Reducido (${valorNumerico})`
            : `Aumentado (${valorNumerico})`;

    slider.setAttribute("aria-valuetext", valorTexto);

    const output = document.getElementById(id.replace("slider-", "valor-"));
    if(output) output.textContent = valorTexto;
}

// La entrada directa necesita una ruta propia para no releer otros sliders.
function actualizarValorFiltro(id, valor) {

    const valorNumerico = Math.max(0, Math.min(100, Number(valor)));

    switch(id){

        case "slider-brillo":
            faroState.brillo = valorNumerico;
            break;

        case "slider-contraste":
            faroState.contraste = valorNumerico;
            break;

        case "slider-saturacion":
            faroState.saturacion = valorNumerico;
            break;

        default:
            console.warn("Filtro FARO no reconocido:", id);
            return;
    }

    sincronizarValorFiltro(id, valorNumerico);
    actualizarFiltros();
}

function ajustarSlider(id, cambio) {

    const slider = document.getElementById(id);
    const valorAnterior = Number(slider.value);
    const valor = Math.max(0, Math.min(100, valorAnterior + cambio));

    actualizarValorFiltro(id, valor);

    const mapa = {
        "slider-brillo": "brightness",
        "slider-contraste": "contrast",
        "slider-saturacion": "saturation"
    };

    registrarEvento("ACCESSIBILITY_CHANGED", {
        adjustment_type: mapa[id],
        old_value: valorAnterior,
        new_value: valor
    });
}

function actualizarFiltros(guardar = true) {

    const brillo = faroState.brillo / 50;
    const contraste = faroState.contraste / 50;
    const saturacion = faroState.saturacion / 50;
    const grises = faroState.grises ? 100 : 0;
    const filtrosActivos =
        faroState.brillo !== FARO_FILTER_DEFAULTS.brillo ||
        faroState.contraste !== FARO_FILTER_DEFAULTS.contraste ||
        faroState.saturacion !== FARO_FILTER_DEFAULTS.saturacion ||
        faroState.grises !== FARO_FILTER_DEFAULTS.grises;

    // Un filter sobre body desplaza los elementos position: fixed.
    // Se conserva body sin filtro y se filtra solo el contenido externo a FARO.
    document.body.style.filter = "";
    document.body.classList.toggle("faro-content-filtered", filtrosActivos);

    if (filtrosActivos) {
        document.body.style.setProperty(
            "--faro-content-filter",
            `brightness(${brillo}) contrast(${contraste}) saturate(${saturacion}) grayscale(${grises}%)`
        );
    } else {
        document.body.style.removeProperty("--faro-content-filter");
    }

    if(guardar){
        guardarPreferenciasBackend();
    }
}

// VISUALES: Toggles (Switches y Checkboxes)
function toggleFiltroFijo(tipo) {

    if(tipo === "grayscale") {

        faroState.grises =
            document.getElementById("check-grayscale").checked;

    } else {

        console.warn(
            "Filtro FARO no reconocido:",
            tipo
        );

        return;
    }

    actualizarFiltros();

    registrarEvento("ACCESSIBILITY_CHANGED", {
        adjustment_type: "grayscale",
        old_value: !faroState.grises,
        new_value: faroState.grises
    });
}

function toggleClase(checkbox, tipo){

    switch(tipo){

        case "modoOscuro":
        case "faro-dark-mode":

            faroState.modoOscuro = checkbox.checked;

            actualizarModoOscuro();

            registrarEvento("ACCESSIBILITY_CHANGED", {
                adjustment_type: "dark_mode",
                old_value: !checkbox.checked,
                new_value: checkbox.checked
            });

            break;


        case "altoContraste":
        case "faro-high-contrast":

            faroState.altoContraste = checkbox.checked;

            actualizarContraste();
            
            registrarEvento("ACCESSIBILITY_CHANGED", {
                adjustment_type: "contrast_mode",
                old_value: !checkbox.checked,
                new_value: checkbox.checked
            });

            break;

    }

    guardarPreferenciasBackend();
}

function actualizarContraste(){

    document.body.classList.toggle(
        "faro-high-contrast",
        faroState.altoContraste
    );

}

function actualizarModoOscuro(){

    document.body.classList.toggle(
        "faro-dark-mode",
        faroState.modoOscuro
    );

}

function sincronizarControles(){
    // ==========================
    // TOGGLES
    // ==========================

    const dark = document.getElementById("check-dark-mode");

    if(dark){
        dark.checked = faroState.modoOscuro;
    }

    const contrast = document.getElementById("check-high-contrast");

    if(contrast){
        contrast.checked = faroState.altoContraste;
    }

    const gray = document.getElementById("check-grayscale");

    if(gray){
        gray.checked = faroState.grises;
    }

    sincronizarValorFiltro("slider-brillo", faroState.brillo);
    sincronizarValorFiltro("slider-contraste", faroState.contraste);
    sincronizarValorFiltro("slider-saturacion", faroState.saturacion);

    const voice = document.getElementById("check-voice");

    if(voice){
        voice.checked = faroState.voz;
    }

    const voiceSpeed = document.getElementById("voice-speed");

    if(voiceSpeed){
        voiceSpeed.value = faroState.velocidadVoz;
    }

    const voiceVolume = document.getElementById("voice-volume");

    if(voiceVolume){
        voiceVolume.value = faroState.volumenVoz;
    }

    // ==========================
    // SELECT FUENTE
    // ==========================

    const fuente = document.getElementById("font-family");

    if (fuente) {
        fuente.value = faroState.fuente;
    }

    // ==========================
    // PILLS TAMAÑO
    // ==========================

    document.querySelectorAll(".size-pill").forEach(el => {
        el.classList.remove("active");
    });

    const size = document.querySelector(
        ".size-pill." + faroState.tamanoTexto
    );

    if(size){
        size.classList.add("active");
    }

    // ==========================
    // PILLS ALINEACIÓN
    // ==========================

    document.querySelectorAll(".align-pill").forEach(el => {
        el.classList.remove("active");
    });

    const align = document.querySelector(
        '.align-pill[onclick*="' + faroState.alineacion + '"]'
    );

    if(align){
        align.classList.add("active");
    }

}

// POSICION BOTÓN
function togglePosicion(){

    const anterior = faroState.posicionBoton;

    faroState.posicionBoton =
        faroState.posicionBoton === "right"
            ? "left"
            : "right";

    actualizarPosicionBoton();

    guardarPreferenciasBackend();

    registrarEvento("ACCESSIBILITY_CHANGED", {
        adjustment_type: "button_position",
        old_value: anterior,
        new_value: faroState.posicionBoton
    });

}

    /* =========================================
       EXTRAS / PERFILES / RESET
========================================= */

function actualizarPosicionBoton(){
    const izquierda = faroState.posicionBoton === "left";
    const btn = document.getElementById("btnFlotante"); const menuPrincipal = document.getElementById("menuAccesibilidad"); var faroBox = document.getElementById("faroBox"); var subMenus = document.querySelectorAll(".sub-menu-container");
    if(izquierda){
        btn.style.right = ""; btn.style.left = "20px"; menuPrincipal.style.right = ""; menuPrincipal.style.left = "20px"; faroBox.style.right = ""; faroBox.style.left = "25px"; subMenus.forEach(s => { s.style.right = ""; s.style.left = "20px"; });
    } else {
        btn.style.left = ""; btn.style.right = "20px"; menuPrincipal.style.left = ""; menuPrincipal.style.right = "20px"; faroBox.style.left = ""; faroBox.style.right = "25px"; subMenus.forEach(s => { s.style.left = ""; s.style.right = "20px"; });
    }
}

/* =========================================
    LECTOR DE VOZ
========================================= */
function togglePauseResumeVoice() {
    const icon = document.getElementById('faro-icon-pause-resume');
    const btn = document.getElementById('faro-btn-pause-resume');

    if (!window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        return;
    }

    if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        if (icon) icon.textContent = 'pause';
        if (btn) btn.setAttribute('aria-label', 'Pausar lectura');
    } else {
        window.speechSynthesis.pause();
        if (icon) icon.textContent = 'play_arrow';
        if (btn) btn.setAttribute('aria-label', 'Reanudar lectura');
    }
}

function stopVoice() {
    window.speechSynthesis.cancel();
    hideVoiceControls();
}

function showVoiceControls() {
    const controls = document.getElementById('faro-voice-controls');
    const icon = document.getElementById('faro-icon-pause-resume');
    const btn = document.getElementById('faro-btn-pause-resume');

    if (controls) controls.classList.add('active');
    if (icon) icon.textContent = 'pause';
    if (btn) btn.setAttribute('aria-label', 'Pausar lectura');
}

function hideVoiceControls() {
    const controls = document.getElementById('faro-voice-controls');
    const icon = document.getElementById('faro-icon-pause-resume');
    const btn = document.getElementById('faro-btn-pause-resume');

    if (controls) controls.classList.remove('active');
    if (icon) icon.textContent = 'pause';
    if (btn) btn.setAttribute('aria-label', 'Pausar lectura');
}

document.addEventListener('click', function(e) {
    if(!faroState.voz) return;
    if(e.target.closest('#faro-extension-root')) return;

    window.speechSynthesis.cancel();
    let textToRead = e.target.innerText || e.target.alt || e.target.value;
    if(textToRead && textToRead.trim() !== '') {
        let msg = new SpeechSynthesisUtterance(textToRead);
        msg.lang = document.documentElement.lang || "es-AR";
        msg.volume = faroState.volumenVoz / 100;
        msg.rate = 0.5 + (faroState.velocidadVoz / 100) * 1.5;
        msg.onstart = function() { showVoiceControls(); };
        msg.onend = function() { hideVoiceControls(); };
        msg.onerror = function() { hideVoiceControls(); };
        window.speechSynthesis.speak(msg);
    }
});

function hablarFaro(texto) {

    window.speechSynthesis.cancel();

    const msg =
        new SpeechSynthesisUtterance(texto);

    msg.lang = "es-ES";

    window.speechSynthesis.speak(msg);

}

function cambiarVelocidadVoz(valor){

    const anterior = faroState.velocidadVoz;

    faroState.velocidadVoz = Number(valor);

    guardarPreferenciasBackend();

    registrarEvento("ACCESSIBILITY_CHANGED", {
        adjustment_type: "voice_speed",
        old_value: anterior,
        new_value: faroState.velocidadVoz
    });

}

function cambiarVolumenVoz(valor){

    const anterior = faroState.volumenVoz;

    faroState.volumenVoz = Number(valor);

    guardarPreferenciasBackend();

    registrarEvento("ACCESSIBILITY_CHANGED", {
        adjustment_type: "voice_volume",
        old_value: anterior,
        new_value: faroState.volumenVoz
    });

}

function toggleVoz(checkbox){

    const anterior = faroState.voz;

    faroState.voz = Boolean(checkbox.checked);

    if (!faroState.voz) {
        stopVoice();

        if (faroState.perfil === "voz") {
            faroState.perfil = null;
        }
    }

    sincronizarControles();

    guardarPreferenciasBackend();

    if (anterior !== faroState.voz) {
        registrarEvento("ACCESSIBILITY_CHANGED", {
            adjustment_type: "voice",
            old_value: anterior,
            new_value: faroState.voz
        });
    }

    const anunciador = document.getElementById("faro-anunciador");

    if (anunciador) {
        anunciador.textContent = faroState.voz
            ? "Asistencia por voz activada."
            : "Asistencia por voz desactivada.";
    }

}

function togglePerfilVoz(){

    if (faroState.voz) {
        toggleVoz({checked: false});
        cerrarTodo();
        return;
    }

    aplicarPerfil("voz");

}

async function registrarEvento(tipo, datos = {}) {

    try {

        const body = {

            event_type: tipo,

            payload: datos,

            resultado: "SUCCESS"

        };

        const response = await apiFetch(
            "/api/v1/events",
            {
                method: "POST",
                body: JSON.stringify(body)
            }
        );

        const texto = await response.text();

        if(!response.ok){

            console.error(
                "❌ Error evento FARO:",
                response.status,
                texto
            );

            return;
        }

    } catch(e) {

        console.warn(
            "❌ No se pudo registrar evento",
            e
        );

    }

}

function activarFocusTrap(root){

    root.addEventListener("keydown", function(e){

        if(e.key !== "Tab"){
            return;
        }

        let panelActivo = document.getElementById("menuAccesibilidad");

        if(panelActivo.style.display !== "flex"){

            panelActivo = null;

            SUBMENUS.forEach(id=>{

                const el = document.getElementById(id);

                if(el && el.style.display === "block"){
                    panelActivo = el;
                }

            });

        }

        if(!panelActivo){
            return;
        }

        const focusables = panelActivo.querySelectorAll(
            'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if(!focusables.length){
            return;
        }

        const primero = focusables[0];
        const ultimo = focusables[focusables.length-1];

        if(e.shiftKey){

            if(document.activeElement === primero){

                e.preventDefault();
                ultimo.focus();

            }

        }else{

            if(document.activeElement === ultimo){

                e.preventDefault();
                primero.focus();

                primero.scrollIntoView({
                    block: "nearest",
                    behavior: "smooth"
                });

            }

        }

    });

}

function solicitarRestablecimiento() {
    const dialogo = document.getElementById("faro-reset-dialog");

    if (!dialogo) {
        return;
    }

    if (dialogo.dataset.faroKeyboardReady !== "true") {
        dialogo.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                e.stopPropagation();
            }
        });
        dialogo.dataset.faroKeyboardReady = "true";
    }

    dialogo.addEventListener("close", () => {
        const botonRestablecer = document.getElementById("btn-restablecer");

        if (botonRestablecer && botonRestablecer.offsetParent !== null) {
            botonRestablecer.focus();
        }
    }, {once: true});

    if (typeof dialogo.showModal === "function") {
        dialogo.showModal();
    } else {
        dialogo.setAttribute("open", "");
    }
}

function cancelarRestablecimiento() {
    const dialogo = document.getElementById("faro-reset-dialog");

    if (!dialogo) {
        return;
    }

    if (typeof dialogo.close === "function") {
        dialogo.close();
    } else {
        dialogo.removeAttribute("open");
    }
}

function confirmarRestablecimiento() {
    cancelarRestablecimiento();
    restablecerAjustes();
}

function restablecerAjustes() {

    // Reset al estado lógico base
    faroState.voz = false;
    faroState.velocidadVoz = 50;
    faroState.volumenVoz = 100;

    faroState.fuente = "default";
    faroState.tamanoTexto = "normal";
    faroState.alineacion = "left";

    Object.assign(faroState, FARO_FILTER_DEFAULTS);
    faroState.altoContraste = false;
    faroState.modoOscuro = false;
    faroState.perfil = null;
    faroState.posicionBoton = "right";

    // Detener cualquier lectura
    stopVoice();

    // Aplicar el nuevo estado
    aplicarEstado();

    // Sincronizar controles
    sincronizarControles();

    // Guardar en backend
    guardarPreferenciasBackend();

    // Avisar a lectores de pantalla
    const anunciador = document.getElementById("faro-anunciador");

    if (anunciador) {
        anunciador.textContent =
            "Todos los ajustes de accesibilidad han sido restablecidos a sus valores por defecto.";
    }

    // Cerrar FARO
    cerrarTodo();

    registrarEvento("ACCESSIBILITY_RESET");

}

// PERFILES RÁPIDOS (Actualizados con las nuevas tarjetas)
function aplicarPerfil(perfil) {

    // Cada perfil reemplaza al anterior y debe detener cualquier lectura activa.
    stopVoice();

    // Guardar perfil seleccionado
    faroState.perfil = perfil;

    // Reset general
    faroState.voz = false;
    faroState.volumenVoz = 100;
    faroState.velocidadVoz = 50;

    faroState.grises = FARO_FILTER_DEFAULTS.grises;
    faroState.altoContraste = false;
    faroState.modoOscuro = false;

    faroState.fuente = "default";
    faroState.tamanoTexto = "normal";
    faroState.alineacion = "left";

    faroState.brillo = FARO_FILTER_DEFAULTS.brillo;
    faroState.contraste = FARO_FILTER_DEFAULTS.contraste;
    faroState.saturacion = FARO_FILTER_DEFAULTS.saturacion;

    switch(perfil){

        case "color":
            faroState.grises = true;
            break;

        case "voz":
            faroState.voz = true;
            setTimeout(()=>{
                if (faroState.voz && faroState.perfil === "voz") {
                    hablarFaro("Asistente por voz activado");
                }
            },300);

            break;

        case "fuentes":
            faroState.fuente = "dyslexic";
            faroState.tamanoTexto = "large";
            break;

        case "seguridad":
            faroState.brillo = 30;
            faroState.saturacion = 20;
            faroState.contraste = 40;
            break;

        case "visibilidad":
            faroState.altoContraste = true;
            faroState.tamanoTexto = "large";
            break;

        case "enfoque":
            faroState.modoOscuro = true;
            faroState.tamanoTexto = "large";
            break;
    }
    aplicarEstado();

    const nombresPerfil = {
        color: "Filtros de Color",
        voz: "Asistente por Voz",
        fuentes: "Fuentes legibles",
        seguridad: "Seguridad Visual",
        visibilidad: "Visibilidad",
        enfoque: "Enfoque"
    };

    const anunciador = document.getElementById("faro-anunciador");

    if (anunciador) {
        anunciador.textContent =
            `Perfil ${nombresPerfil[perfil] || perfil} activado`;
    }

    sincronizarControles();

    cerrarTodo();

    guardarPreferenciasBackend();

    registrarEvento("PRESET_SELECTED", {
        preset_name: perfil
    });

}

// Secuencia de Onboarding del Faro

setTimeout(function() {

    const m =
        document.getElementById("faroMensaje");

    if(m) {

        m.innerHTML =
        '<h3>¡Personaliza tu perfil!</h3>' +
        '<p>Elige el perfil que mejor se ajuste<br>a tus necesidades.</p>';

    }

},4000);



setTimeout(function() {

    const m =
        document.getElementById("faroMensaje");


    if(m) {

        m.innerHTML =
        '<h3>¡Adapta tu experiencia!</h3>' +
        '<p>Configura el tamaño del texto, el contraste<br>y otras opciones de accesibilidad.</p>';

    }

},8000);



setTimeout(function() {

    const fb =
        document.getElementById("faroBox");


    const fmsg =
        document.getElementById("faroMensaje");


    const fopt =
        document.getElementById("faroOptions");


    const bflot =
        document.getElementById("btnFlotante");



    if(fmsg) {

        fmsg.innerHTML =
        '<h3>¡Todo listo!</h3>' +
        '<p>Comienza a utilizar la herramienta<br>y acceder a todas sus funcionalidades.</p>';

    }


    if(fopt) {

        fopt.innerHTML =
        '<button onclick="empezarFaro()">Empezar</button>';

    }



    document.addEventListener(
        "click",
        function cerrarAlClicarAfuera(evento) {


            if (
                fb &&
                bflot &&
                !fb.contains(evento.target) &&
                !bflot.contains(evento.target) &&
                !evento.target.closest("#menuAccesibilidad") &&
                !evento.target.closest(".sub-menu-container")
            ){

                cerrarFaro();

                cerrarTodo();

            }

        }
    );


},12000);

/* =========================================
   BACKEND FARO (API v1)
========================================= */

function getAPI(){

    return window.FARO_CONFIG?.backendUrl || "";

}

let FARO_TOKEN = sessionStorage.getItem("FARO_TOKEN") || null;

/**
 * Obtener JWT FARO desde backend
 */
async function autenticarFaro() {

    const token =
        sessionStorage.getItem("FARO_TOKEN");

    const exp =
        sessionStorage.getItem("FARO_TOKEN_EXP");

    if(token && exp){

        const ahora =
            Math.floor(Date.now()/1000);

        if(ahora < Number(exp)){

            FARO_TOKEN = token;

            return token;

        }

    }

    const r = await fetch(
        getAPI() + "/tool/token",
        {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                moodle_user_sub:
                    window.FARO_CONFIG.userId,

                moodle_course_id:
                    window.FARO_CONFIG.courseId,

                moodleUrl:
                    window.FARO_CONFIG.moodleUrl

            })

        }
    );


    if(!r.ok){

        throw new Error(
            "No se pudo autenticar FARO"
        );

    }

    const data =
        await r.json();

    FARO_TOKEN =
        data.session_token;

    sessionStorage.setItem(
        "FARO_TOKEN",
        FARO_TOKEN
    );

    /*
       leer expiración del JWT
    */

    const payload =
        JSON.parse(
            atob(
                FARO_TOKEN.split(".")[1]
            )
        );


    sessionStorage.setItem(
        "FARO_TOKEN_EXP",
        payload.exp
    );


    return FARO_TOKEN;

}




/**
 * Fetch autenticado
 */
async function apiFetch(url, options={}){


    const token =
        await autenticarFaro();


    const response =
        await fetch(
            getAPI() + url,
            {

                ...options,

                headers:{

                    ...(options.headers || {}),

                    Authorization:
                        `Bearer ${token}`,

                    "Content-Type":
                        "application/json"

                }

            }
        );


    /*
       Si el JWT venció
    */
    if(response.status === 401){

        console.warn(
            "JWT vencido. Renovando sesión FARO"
        );


        sessionStorage.removeItem(
            "FARO_TOKEN"
        );


        FARO_TOKEN = null;


        // vuelve a pedir token nuevo
        const nuevoToken =
            await autenticarFaro();


        return fetch(
            getAPI() + url,
            {

                ...options,

                headers:{

                    ...(options.headers || {}),

                    Authorization:
                        `Bearer ${nuevoToken}`,

                    "Content-Type":
                        "application/json"

                }

            }
        );

    }


    return response;

}



/**
 * Cargar usuario y preferencias
 */
async function obtenerConfiguracion(){

    try {

        const r = await apiFetch(
            "/api/v1/users/me/accessibility"
        );

        const texto = await r.text();

        const datos = JSON.parse(texto);

        return datos;


    }catch(e){

        console.error(
            "Error configuración FARO",
            e
        );

        return null;

    }

}



/**
 * Guardar preferencias
 */
async function guardarPreferenciasBackend(){

    if(!FARO_READY){
    console.warn(
        "FARO todavía no está listo, no guardo preferencias"
    );
    return;
}

    try {


        const preferencias = {

            button_position:
                faroState.posicionBoton,


            contrast_mode:
                faroState.altoContraste,


            dark_mode:
                faroState.modoOscuro,


            font_family:
                faroState.fuente,


            font_size:
                faroState.tamanoTexto,


            alignment:
                faroState.alineacion,


            brightness:
                faroState.brillo,


            contrast:
                faroState.contraste,


            saturation:
                faroState.saturacion,


            grayscale:
                faroState.grises,


            voice:
                faroState.voz,


            voice_speed:
                faroState.velocidadVoz,


            voice_volume:
                faroState.volumenVoz,

            profile:
                faroState.perfil

        };
      

        await apiFetch(
            "/api/v1/users/me/accessibility",
            {

                method:"PATCH",

                body:
                    JSON.stringify(preferencias)

            }
        );


    }catch(e){

        console.error(
            "Error guardando FARO",
            e
        );

    }

}



/**
 * Recuperar preferencias
 */
async function cargarPreferenciasBackend(){

    try {

        const datos = await obtenerConfiguracion();


        if(!datos)
            return;


        const settings = datos.accessibility_settings;


        if(settings){

            faroState.posicionBoton =
                settings.button_position ?? "right";

            faroState.perfil =
                settings.profile ?? null;


            // Visual
            faroState.altoContraste =
                settings.contrast_mode ?? false;


            faroState.modoOscuro =
                settings.dark_mode ?? false;


            faroState.grises =
                settings.grayscale ?? FARO_FILTER_DEFAULTS.grises;



            // Texto
            faroState.fuente =
                settings.font_family ?? "default";


            faroState.tamanoTexto =
                settings.font_size ?? "normal";


            faroState.alineacion =
                settings.alignment ?? "left";



            // Filtros visuales

            faroState.brillo =
                settings.brightness ?? FARO_FILTER_DEFAULTS.brillo;


            faroState.contraste =
                settings.contrast ?? FARO_FILTER_DEFAULTS.contraste;


            faroState.saturacion =
                settings.saturation ?? FARO_FILTER_DEFAULTS.saturacion;



            // Voz

            faroState.voz =
                settings.voice ?? false;


            faroState.velocidadVoz =
                settings.voice_speed ?? 50;


            faroState.volumenVoz =
                settings.voice_volume ?? 100;

        }

        sincronizarControles();

    }catch(e){

        console.error(
            "Error cargando FARO",
            e
        );

    }

}

/* =========================================
   INICIALIZACIÓN FARO
========================================= */
let FARO_READY = false;

async function iniciarFaro() {

    const root = document.getElementById("faro-extension-root");

    if (root) {
        root.style.visibility = "hidden";
    }

    FARO_READY = false;

    try {

        await cargarPreferenciasBackend();

        aplicarEstado();

        sincronizarControles();

        if (tourYaVisto()) {
            cerrarFaro();
        }

        FARO_READY = true;

    } catch (e) {

        console.error(e);

    } finally {

        requestAnimationFrame(() => {

            if (root) {
                root.style.visibility = "visible";
            }

        });

    }
    activarFocusTrap(document.getElementById("faro-extension-root"));

}

// Exponer funciones usadas por HTML
window.empezarFaro = empezarFaro;
window.cerrarFaro = cerrarFaro;
window.toggleMenu = toggleMenu;
window.aplicarPerfil = aplicarPerfil;
window.togglePerfilVoz = togglePerfilVoz;
window.toggleClase = toggleClase;
window.toggleVoz = toggleVoz;
window.cambiarVelocidadVoz = cambiarVelocidadVoz;
window.cambiarVolumenVoz = cambiarVolumenVoz;
window.togglePauseResumeVoice = togglePauseResumeVoice;
window.stopVoice = stopVoice;
window.abrirSubmenu = abrirSubmenu;
window.volverAlMenu = volverAlMenu;
window.cerrarTodo = cerrarTodo;
window.cambiarFuente = cambiarFuente;
window.seleccionarTamano = seleccionarTamano;
window.seleccionarAlineacion = seleccionarAlineacion;

window.actualizarFiltros = actualizarFiltros;
window.actualizarValorFiltro = actualizarValorFiltro;
window.ajustarSlider = ajustarSlider;
window.toggleFiltroFijo = toggleFiltroFijo;

window.togglePosicion = togglePosicion;
window.actualizarPosicionBoton = actualizarPosicionBoton;

window.restablecerAjustes = restablecerAjustes;
window.solicitarRestablecimiento = solicitarRestablecimiento;
window.cancelarRestablecimiento = cancelarRestablecimiento;
window.confirmarRestablecimiento = confirmarRestablecimiento;

window.faroState = faroState;

window.guardarPreferenciasBackend = guardarPreferenciasBackend;
window.registrarEvento = registrarEvento;
window.obtenerConfiguracion = obtenerConfiguracion;


document.addEventListener("keydown", (e)=>{

    if(e.altKey && e.key.toLowerCase() === "f"){

        e.preventDefault();

        toggleMenu();

    }

});
document.addEventListener("keydown",(e)=>{

    if(e.key !== "Escape"){
        return;
    }

    const dialogoRestablecer = document.getElementById("faro-reset-dialog");

    if (
        dialogoRestablecer?.open ||
        e.target.closest?.("#faro-reset-dialog")
    ) {
        return;
    }

    const menu = document.getElementById("menuAccesibilidad");
    const faroAbierto =
        menu?.style.display === "flex" ||
        SUBMENUS.some(id => document.getElementById(id)?.style.display === "block");

    if (faroAbierto) {
        cerrarTodo();
    }

});
document.addEventListener("keydown",(e)=>{

    const controlFaro = e.target.closest?.(
        "#faro-extension-root [role='button']"
    );

    if(

        (e.key==="Enter" || e.key===" ")

        &&

        controlFaro

    ){

        e.preventDefault();

        controlFaro.click();

    }

});



return {

    init: function() {

        iniciarFaro();

    }

};


});
