define([], function() {


/* =========================================
   ESTADO GLOBAL Y LÓGICA...
/* =========================================
   ESTADO GLOBAL Y LÓGICA DE APLICACIÓN CSS
========================================= */
/* =========================================
   ESTADO GLOBAL
========================================= */
console.log("FARO JS CARGADO - VERSION TEST 2026");
console.log("🔥 FARO JS CARGADO");
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
    brillo: 50,
    contraste: 50,
    saturacion: 50,
    grises: false,

    altoContraste: false,
    modoOscuro: false,

    // Panel
    posicionBoton: "right",

    // Perfil aplicado
    perfil: null

};

const FARO_TOUR_KEY = "FARO_TOUR_VISTO";

function aplicarEstado() {

    console.log("====== APLICAR ESTADO ======");

    console.log(faroState);

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
        
        /* Contraste Inteligente (Alto Contraste) */
        body.faro-high-contrast, body.faro-high-contrast *:not(#faro-extension-root *) { 
            background-color: #000000 !important; color: #ffff00 !important; border-color: #ffff00 !important;
        }
        
        /* Modo Oscuro */
        body.faro-dark-mode,
        body.faro-dark-mode * {
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

        const el = document.getElementById(id);

        if (el) {
            el.style.display = "none";
        }

    });

}

function toggleMenu() {

    const menu = document.getElementById("menuAccesibilidad");

    let algunSubmenuAbierto = false;

    SUBMENUS.forEach(id => {

        const el = document.getElementById(id);

        if (el && el.style.display === "block") {
            algunSubmenuAbierto = true;
        }

    });

    if (menu.style.display === "flex" || algunSubmenuAbierto) {

        menu.style.display = "none";

        ocultarSubmenus();

    } else {

        menu.style.display = "flex";

    }

}

function abrirSubmenu(idSubmenu) {

    ocultarSubmenus();

    document.getElementById("menuAccesibilidad").style.display = "none";

    document.getElementById(idSubmenu).style.display = "block";

}
function volverAlMenu() { ocultarSubmenus(); document.getElementById("menuAccesibilidad").style.display = "flex"; }
function cerrarTodo(){

    ocultarSubmenus();

    const menu =
        document.getElementById("menuAccesibilidad");

    if(menu)
        menu.style.display="none";

}
function empezarFaro(){

    marcarTourComoVisto();

    cerrarFaro();

    document.getElementById("menuAccesibilidad").style.display="flex";

}
/* =========================================
   LÓGICA DE HERRAMIENTAS (AJUSTES)
========================================= */

// TEXTO: Familia Tipográfica
function cambiarFuente(tipo) {

    faroState.fuente = tipo;

    actualizarFuente();

    guardarPreferenciasBackend();

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

    elemento.parentNode
        .querySelectorAll(".size-pill")
        .forEach(p => p.classList.remove("active"));

    elemento.classList.add("active");

    faroState.tamanoTexto = tipo;

    actualizarTamanoTexto();

    guardarPreferenciasBackend();

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

    elemento.parentNode
        .querySelectorAll(".align-pill")
        .forEach(p => p.classList.remove("active"));

    elemento.classList.add("active");

    faroState.alineacion = tipo;

    actualizarAlineacion();

    guardarPreferenciasBackend();

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
function ajustarSlider(id, cambio) {

    const slider = document.getElementById(id);

    let valor = Number(slider.value) + cambio;

    valor = Math.max(0, Math.min(100, valor));

    slider.value = valor;

    switch(id){

        case "slider-brillo":
            faroState.brillo = valor;
            break;

        case "slider-contraste":
            faroState.contraste = valor;
            break;

        case "slider-saturacion":
            faroState.saturacion = valor;
            break;

    }

    actualizarFiltros();

    guardarPreferenciasBackend();

}

function actualizarFiltros(guardar = true) {


    if(guardar){

        const brilloSlider =
            document.getElementById("slider-brillo");

        const contrasteSlider =
            document.getElementById("slider-contraste");

        const saturacionSlider =
            document.getElementById("slider-saturacion");


        if(brilloSlider)
            faroState.brillo =
                Number(brilloSlider.value);


        if(contrasteSlider)
            faroState.contraste =
                Number(contrasteSlider.value);


        if(saturacionSlider)
            faroState.saturacion =
                Number(saturacionSlider.value);

    }


    const brillo =
        faroState.brillo / 50;

    const contraste =
        faroState.contraste / 30;

    const saturacion =
        faroState.saturacion / 40;


    const grises =
        faroState.grises
        ? "grayscale(100%)"
        : "";


    document.body.style.filter =
    `
    brightness(${brillo})
    saturate(${saturacion})
    contrast(${contraste})
    ${grises}
    `;


    if(guardar){
        guardarPreferenciasBackend();
    }

}

// VISUALES: Toggles (Switches y Checkboxes)
function toggleFiltroFijo(tipo) {

    console.log("========== FILTRO ==========");
    console.log("Tipo:", tipo);

    if(tipo === "grayscale") {

        faroState.grises =
            document.getElementById("check-grayscale").checked;

        console.log(
            "Nuevo grayscale:",
            faroState.grises
        );

    } else {

        console.warn(
            "Filtro FARO no reconocido:",
            tipo
        );

        return;
    }

    console.log("Estado:", structuredClone(faroState));

    actualizarFiltros();

    guardarPreferenciasBackend();
}

function toggleClase(checkbox, tipo){

    console.log("========== TOGGLE ==========");
    console.log("Tipo:", tipo);
    console.log("Checked:", checkbox.checked);

    switch(tipo){

        case "modoOscuro":
        case "faro-dark-mode":

            faroState.modoOscuro = checkbox.checked;

            console.log(
                "Nuevo modoOscuro:",
                faroState.modoOscuro
            );

            actualizarModoOscuro();

            break;


        case "altoContraste":
        case "faro-high-contrast":

            faroState.altoContraste = checkbox.checked;

            console.log(
                "Nuevo altoContraste:",
                faroState.altoContraste
            );

            actualizarContraste();

            break;

    }

    console.log("Estado:", structuredClone(faroState));

    guardarPreferenciasBackend();
}

function actualizarContraste(){
    console.log(
    "Contraste:",
    faroState.altoContraste
);

    document.body.classList.toggle(
        "faro-high-contrast",
        faroState.altoContraste
    );

}

function actualizarModoOscuro(){
    console.log(
    "Modo oscuro:",
    faroState.modoOscuro
);

    document.body.classList.toggle(
        "faro-dark-mode",
        faroState.modoOscuro
    );

}

function sincronizarControles(){

    console.log("========== SINCRONIZANDO ==========");
    console.log(structuredClone(faroState));

    // ==========================
    // TOGGLES
    // ==========================

    const dark = document.getElementById("check-dark-mode");

    if(dark){
        console.log("Antes de asignar DARK:", dark.checked);
        dark.checked = faroState.modoOscuro;
        console.log("Después de asignar DARK:", dark.checked);
    }

    const contrast = document.getElementById("check-high-contrast");

    if(contrast){
        console.log("Antes de asignar CONTRASTE:", contrast.checked);
        contrast.checked = faroState.altoContraste;
        console.log("Después de asignar CONTRASTE:", contrast.checked);
    }

    const gray = document.getElementById("check-grayscale");

    if(gray){
        console.log("Antes de asignar GRISES:", gray.checked);
        gray.checked = faroState.grises;
        console.log("Después de asignar GRISES:", gray.checked);
    }

    const voice = document.getElementById("check-voice");

    if(voice){
        console.log("Antes de asignar VOZ:", voice.checked);
        voice.checked = faroState.voz;
        console.log("Después de asignar VOZ:", voice.checked);
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

    console.log("========== FIN SINCRONIZAR ==========");

}

// LECTURA: Asistencia de Voz
document.addEventListener('click', function(e) {

    console.log("🎤 CLICK DETECTADO PARA VOZ");

    console.log("Estado voz:", faroState.voz);

    if(!faroState.voz){

        console.log("❌ Voz desactivada, salgo");
        return;
    }


    if(e.target.closest('#faro-extension-root')){

        console.log(
            "❌ Click dentro de FARO, ignorado"
        );

        return;
    }


    console.log(
        "Elemento clickeado:",
        e.target
    );


    console.log(
        "MAIN encontrado:",
        e.target.closest("main")
    );


    const zona =
        e.target.closest("main") ||
        e.target.closest("#region-main") ||
        e.target.closest(".page-content") ||
        document.body;


    console.log("Zona lectura:", zona);


    const textToRead =
        e.target.innerText ||
        e.target.alt ||
        e.target.value;


    console.log(
        "Texto encontrado:",
        textToRead
    );


    if(!textToRead || textToRead.trim()===""){

        console.log(
            "❌ No hay texto para leer"
        );

        return;
    }


    console.log(
        "🔊 INTENTO HABLAR:",
        textToRead
    );


    window.speechSynthesis.cancel();


    const msg =
        new SpeechSynthesisUtterance(textToRead);


    msg.volume =
        faroState.volumenVoz / 100;


    msg.rate =
        0.5 +
        (faroState.velocidadVoz / 100) * 1.5;


    msg.lang = "es-ES";


    msg.onstart = () => {
        console.log("✅ VOZ INICIADA");
    };


    msg.onend = () => {
        console.log("✅ VOZ FINALIZADA");
    };


    msg.onerror = (err)=>{

        console.error(
            "❌ ERROR SPEECH:",
            err
        );

    };


    window.speechSynthesis.speak(msg);


});

// POSICION BOTÓN
function togglePosicion(){

    faroState.posicionBoton =
        faroState.posicionBoton === "right"
            ? "left"
            : "right";

    actualizarPosicionBoton();

    guardarPreferenciasBackend();

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
    const icon = document.getElementById('faro-icon-pause-resume'); const btn = document.getElementById('faro-btn-pause-resume');
    if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume(); icon.textContent = 'pause'; btn.setAttribute('aria-label', 'Pausar lectura');
    } else {
        window.speechSynthesis.pause(); icon.textContent = 'play_arrow'; btn.setAttribute('aria-label', 'Reanudar lectura');
    }
}
function stopVoice() { window.speechSynthesis.cancel(); hideVoiceControls(); }
function showVoiceControls() {
    document.getElementById('faro-voice-controls').classList.add('active');
    const icon = document.getElementById('faro-icon-pause-resume'); const btn = document.getElementById('faro-btn-pause-resume');
    icon.textContent = 'pause'; btn.setAttribute('aria-label', 'Pausar lectura');
}
function hideVoiceControls() { document.getElementById('faro-voice-controls').classList.remove('active'); }

document.addEventListener('click', function(e) {
    if(!faroState.voz) return;
    if(e.target.closest('#faro-extension-root')) return;

    window.speechSynthesis.cancel();
    let textToRead = e.target.innerText || e.target.alt || e.target.value;
    if(textToRead && textToRead.trim() !== '') {
        let msg = new SpeechSynthesisUtterance(textToRead);
        msg.volume = faroState.volumenVoz / 100; msg.rate = 0.5 + (faroState.velocidadVoz / 100) * 1.5; 
        msg.onstart = function() { showVoiceControls(); }; msg.onend = function() { hideVoiceControls(); }; msg.onerror = function() { hideVoiceControls(); };
        window.speechSynthesis.speak(msg);
    }
});

function hablarFaro(texto){

    console.log("🎤 hablarFaro llamado");
    console.log("voz estado:", faroState.voz);
    console.log("texto:", texto);

    if(!faroState.voz){
        console.log("❌ Voz apagada");
        return;
    }

    // Detener cualquier lectura anterior
    window.speechSynthesis.cancel();

    const msg =
        new SpeechSynthesisUtterance(texto);

    msg.lang = "es-ES";

    msg.onstart = ()=>{
        console.log("🔊 Speech iniciado");
    };

    msg.onerror = (e)=>{
        console.error("ERROR SPEECH", e);
    };

    window.speechSynthesis.speak(msg);
}

function cambiarVelocidadVoz(valor){

    faroState.velocidadVoz = valor;

    guardarPreferenciasBackend();

}

function cambiarVolumenVoz(valor){

    faroState.volumenVoz = valor;

    guardarPreferenciasBackend();

}

function toggleVoz(checkbox){

    faroState.voz = checkbox.checked;

    guardarPreferenciasBackend();

}

function restablecerAjustes() {

    // Reset al estado lógico base
    faroState.voz = false;
    faroState.velocidadVoz = 50;
    faroState.volumenVoz = 100;

    faroState.fuente = "default";
    faroState.tamanoTexto = "normal";
    faroState.alineacion = "left";

    faroState.brillo = 50;
    faroState.contraste = 50;
    faroState.saturacion = 50;

    faroState.grises = false;
    faroState.altoContraste = false;
    faroState.modoOscuro = false;
    faroState.perfil = null;

    // Detener cualquier lectura
    window.speechSynthesis.cancel();

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
}

// PERFILES RÁPIDOS (Actualizados con las nuevas tarjetas)
function aplicarPerfil(perfil) {

    console.log("=================================");
    console.log("🎯 APLICAR PERFIL");
    console.log("Perfil recibido:", perfil);
    console.log("Estado ANTES:", structuredClone(faroState));

    // Guardar perfil seleccionado
    faroState.perfil = perfil;

    // Reset general
    faroState.voz = false;
    faroState.volumenVoz = 100;
    faroState.velocidadVoz = 50;

    faroState.grises = false;
    faroState.altoContraste = false;
    faroState.modoOscuro = false;

    faroState.fuente = "default";
    faroState.tamanoTexto = "normal";
    faroState.alineacion = "left";

    faroState.brillo = 50;
    faroState.contraste = 50;
    faroState.saturacion = 50;

    switch(perfil){

        case "color":
            console.log("➡ Perfil COLOR");
            faroState.grises = true;
            break;

        case "voz":
            console.log("➡ Perfil VOZ");
            faroState.voz = true;
            console.log("VOZ ACTIVADA:", faroState.voz);
            setTimeout(()=>{
                hablarFaro("Asistente por voz activado");
            },300);

            break;

        case "fuentes":
            console.log("➡ Perfil FUENTES");
            faroState.fuente = "dyslexic";
            faroState.tamanoTexto = "large";
            break;

        case "seguridad":
            console.log("➡ Perfil SEGURIDAD");
            faroState.brillo = 30;
            faroState.saturacion = 20;
            faroState.contraste = 40;
            break;

        case "visibilidad":
            console.log("➡ Perfil VISIBILIDAD");
            faroState.altoContraste = true;
            faroState.tamanoTexto = "large";
            break;

        case "enfoque":
            console.log("➡ Perfil ENFOQUE");
            faroState.modoOscuro = true;
            faroState.tamanoTexto = "large";
            break;
    }

    console.log("Estado DESPUÉS:", structuredClone(faroState));

    console.log("▶ aplicarEstado()");
    aplicarEstado();

    console.log("▶ sincronizarControles()");
    sincronizarControles();

    console.log("▶ cerrarTodo()");
    cerrarTodo();

    console.log("▶ guardarPreferenciasBackend()");
    guardarPreferenciasBackend();

    console.log("=================================");
}

// Secuencia de Onboarding del Faro
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


console.log("FARO CONFIG:", window.FARO_CONFIG);
console.log("API BACKEND:",getAPI());
/**
 * Obtener JWT FARO desde backend
 */
async function autenticarFaro() {
    console.log("FARO CONFIG:", window.FARO_CONFIG);


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


    console.log("Generando nuevo JWT FARO");


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

    console.log("TOKEN RESPONSE:", data);


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

    console.log("➡️ Entrando obtenerConfiguracion");


    try {

        const r = await apiFetch(
            "/api/v1/users/me/accessibility"
        );


        console.log(
            "STATUS CONFIG:",
            r.status
        );


        const texto = await r.text();


        console.log(
            "RESPUESTA RAW:",
            texto
        );


        const datos = JSON.parse(texto);


        console.log(
            "RESPUESTA COMPLETA CONFIG:",
            datos
        );


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

    console.log("========== GUARDANDO ==========");
    console.trace();

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
                faroState.volumenVoz


        };
        console.log("📡 ENVIANDO PREFERENCIAS FARO:", preferencias);


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


            // Visual
            faroState.altoContraste =
                settings.contrast_mode ?? false;


            faroState.modoOscuro =
                settings.dark_mode ?? false;


            faroState.grises =
                settings.grayscale ?? false;



            // Texto
            faroState.fuente =
                settings.font_family ?? "default";


            faroState.tamanoTexto =
                settings.font_size ?? "normal";


            faroState.alineacion =
                settings.alignment ?? "left";



            // Filtros visuales

            faroState.brillo =
                settings.brightness ?? 50;


            faroState.contraste =
                settings.contrast ?? 50;


            faroState.saturacion =
                settings.saturation ?? 50;



            // Voz

            faroState.voz =
                settings.voice ?? false;


            faroState.velocidadVoz =
                settings.voice_speed ?? 50;


            faroState.volumenVoz =
                settings.voice_volume ?? 100;



            console.log(
                "Preferencias FARO cargadas:",
                faroState
            );

        }

        const brillo = document.getElementById("slider-brillo");
        const contraste = document.getElementById("slider-contraste");
        const saturacion = document.getElementById("slider-saturacion");

        if (brillo) brillo.value = faroState.brillo;
        if (contraste) contraste.value = faroState.contraste;
        if (saturacion) saturacion.value = faroState.saturacion;


        aplicarEstado();


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

    try {

        await cargarPreferenciasBackend();

        FARO_READY = true;

        console.log("✅ FARO_READY =", FARO_READY);

        if (tourYaVisto()) {
            cerrarFaro();
        }


    } catch(e) {

        console.error(
            "Error iniciando FARO:",
            e
        );

    }

}

// Exponer funciones usadas por HTML
// Exponer funciones usadas por HTML
window.empezarFaro = empezarFaro;
window.cerrarFaro = cerrarFaro;
window.toggleMenu = toggleMenu;
window.aplicarPerfil = aplicarPerfil;
window.toggleClase = toggleClase;
window.toggleVoz = toggleVoz;
window.cambiarVelocidadVoz = cambiarVelocidadVoz;
window.cambiarVolumenVoz = cambiarVolumenVoz;
window.abrirSubmenu = abrirSubmenu;
window.volverAlMenu = volverAlMenu;
window.cerrarTodo = cerrarTodo;
window.cambiarFuente = cambiarFuente;
window.seleccionarTamano = seleccionarTamano;
window.seleccionarAlineacion = seleccionarAlineacion;

window.actualizarFiltros = actualizarFiltros;
window.ajustarSlider = ajustarSlider;
window.toggleFiltroFijo = toggleFiltroFijo;

window.togglePosicion = togglePosicion;
window.actualizarPosicionBoton = actualizarPosicionBoton;

window.restablecerAjustes = restablecerAjustes;

window.faroState = faroState;

console.log("🔥 FARO JS FINALIZADO");


return {

    init: function() {

        console.log("🚀 Moodle AMD llamó FARO");

        iniciarFaro();

    }

};


});