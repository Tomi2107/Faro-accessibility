Abrir faro con teclado
Alt+F
o
Ctrl+Alt+A

Salir
Esc

apretar boton
enter 
o 
barra

recorrer
tab >
< shift tab


-----------------------------------------------------------
as haría en este orden:

✅ Cambiar los div interactivos por <button> donde sea posible.
✅ Agregar Escape para cerrar el panel.
✅ Enfocar automáticamente el primer control al abrir.
✅ Devolver el foco al botón flotante al cerrar.
✅ Implementar el focus trap para que Tab no salga del panel.
✅ Agregar un atajo global como Alt + F.
✅ Completar los atributos ARIA dinámicos (aria-expanded, aria-hidden) y anuncios con aria-live













----------------------------------------------------
-Antes de instalar el plugin
habilitar servicio web
el que sigue
y sacar el token para que se comuniquen back y front
token id sirve para express
si van a desarrollar Lti 1.3 completa usar Clien_Id generado al habilitar la herramienta
-Nota, la herramienta pide En lti 1.3 el client_Id o sea que lo sacas de otra parte..?

------------
CORREGIR / MEJORAR LO EXISTENTE
⭐ 1. Sincronización completa de preferencias Backend → Front

Falta cargar todos los campos:

dark_mode
contrast_mode
font_family
font_size
alignment
brightness
contrast
saturation
grayscale
voice
voice_speed
voice_volume
button_position
profile
⭐ 2. Dark Mode

Problemas actuales:

El checkbox cambia visualmente pero no siempre actualiza estado.
Revisar toggleClase().
Revisar carga desde backend.
Revisar persistencia.
Registrar evento.
⭐ 3. Alto Contraste

Revisar:

Activación.
Desactivación.
Sincronización del checkbox.
Guardado.
Carga desde backend.
⭐ 4. Sliders Visuales

Revisar:

Brillo.
Contraste.
Saturación.

Agregar:

Guardado correcto.
Recuperación.
Sincronización del valor del slider.
⭐ 5. Botón Flotante

Falta:

Guardar posición.
Recuperar posición.
Registrar evento.
⭐ 6. Perfiles FARO

Completar:

Guardado del perfil seleccionado.
Recuperación del perfil.
Registro:

PRESET_SELECTED

⭐ 7. Tour

Actualmente:

Usa solamente localStorage.

Cambiar a:

Backend:

Obtener estado del tour.
Guardar estado del tour.
⭐ 8. Manejo de errores API

Agregar:

Token vencido.
Reautenticación automática.
Errores 401.
Errores 500.
🚀 FUNCIONALIDADES QUE FALTAN AGREGAR AL FRONT
⭐ 1. Sistema de Eventos FARO

Crear:

events.js

Funciones:

registrarEvento()
registrarCambioAccesibilidad()
registrarNavegacion()
registrarUsoIA()
registrarTTS()

Eventos:

ACCESSIBILITY_CHANGED
NAVIGATION_EVENT
TTS_INTERACTION
AI_COGNITIVE_REQUEST
PRESET_SELECTED
TASK_COMPLETED
FOCUS_MODE_TOGGLED
⭐ 2. Analytics

Crear:

analytics.js

Enviar:

tiempo de uso
botones usados
perfiles utilizados
ajustes más usados
navegación
IA utilizada

Controller:

analyticsController

⭐ 3. Assistant IA

Crear:

assistant.js

Funciones:

getContext()
getHome()
getRecommendations()
getNextSteps()
getDailySummary()
getCurrentActivity()
getStudyAssistant()
getAccessibilityAssistant()
getProgressAssistant()
getNotifications()
⭐ 4. TTS Mejorado

Crear:

tts.js

Agregar:

Play
Pause
Stop
Auto lectura
Velocidad
Volumen

Registrar:

TTS_INTERACTION

⭐ 5. Focus Mode

Crear:

focus.js

Funciones:

iniciarModoFoco()
detenerModoFoco()
contador tiempo
enviar duración

Eventos:

FOCUS_MODE_TOGGLED

⭐ 6. Notificaciones

Crear:

notifications.js

Funciones:

obtenerNotificaciones()
marcarLeida()

Mostrar:

próximas actividades
recomendaciones
avisos IA
⭐ 7. Progreso del Usuario

Crear:

progress.js

Funciones:

obtenerProgreso()
actualizarActividad()
obtenerSugerencias()

Conectar:

progressController

⭐ 8. Cursos Moodle

Crear:

course.js

Funciones:

obtenerCurso()
obtenerSecciones()
obtenerActividades()

Conectar:

courseController

⭐ 9. Contenido Moodle

Crear:

content.js

Funciones:

cargarContenidoActividad()
guardar cache

Conectar:

contentController

⭐ 10. IA Cognitiva

Crear:

ai.js

Funciones:

resumir()
simplificar()
conceptosClave()

Eventos:

AI_COGNITIVE_REQUEST

⭐ 11. Sesiones

Crear:

session.js

Funciones:

iniciar sesión FARO
cerrar sesión
tiempo activo

Eventos:

SESSION_START
SESSION_END
🏗️ REORGANIZACIÓN DEL FRONT

Separar el script actual:

js/

state.js ⭐

api.js ⭐

accessibility.js ⭐

events.js ⭐

analytics.js ⭐

assistant.js ⭐

tts.js ⭐

tour.js ⭐

focus.js ⭐

notifications.js ⭐

progress.js ⭐

course.js ⭐

content.js ⭐

ai.js ⭐

session.js ⭐

init.js ⭐
🔌 Controllers Backend que ya tenemos o faltan
Ya existen

✅ userController
✅ progressController
✅ sessionController
✅ courseController
✅ contentController
✅ aiController

Faltan crear

⭐ accessibilityController
⭐ analyticsController
⭐ assistantController
⭐ profileController
⭐ notificationController
⭐ ttsController
⭐ tourController
⭐ focusController

Orden recomendado de trabajo
⭐ Arreglar accessibilityController + conexión con front
⭐ Crear events.js
⭐ Integrar sessionController
⭐ Crear analyticsController
⭐ Crear ttsController
⭐ Crear focusController
⭐ Crear assistantController
⭐ Crear notificationsController
⭐ Crear tourController
⭐ Separar el script grande en módulos

Así no seguimos acumulando código y queda una arquitectura de plugin LTI más profesional.

--------------
console.log("📡 ENVIANDO PREFERENCIAS FARO:", preferencias);

-----------------


------------
Ejecutar desde  consola para verificar flujo completo
--------------------
init_mi_plugin(null,"https://back-lti.onrender.com")
--------------------
------------

                <label class="sub-switch"><input type="checkbox" id="check-voice" onchange="faroState.voz = this.checked; guardarPreferenciasBackend();"><span class="sub-slider sub-round"></span></label>

                <span>Lenta</span><input type="range" id="voice-speed" min="0" max="100" value="50" oninput="faroState.velocidadVoz = this.value; guardarPreferenciasBackend()" style="margin: 0 10px;"><span>Rápida</span>

                <input type="range" id="voice-volume" min="0" max="100" value="100" oninput="faroState.volumenVoz = this.value; guardarPreferenciasBackend()" style="margin: 0 10px;">

                cambiarFuente(tipo)

                seleccionarTamano(elemento, tipo)

                seleccionarAlineacion(elemento, tipo)

                ajustarSlider(id, cambio)

                actualizarFiltros(guardar = true)

                 toggleFiltroFijo(tipo)

                 toggleClase(checkbox, tipo)

                togglePosicion() 

                cambiarVelocidadVoz(valor)

                cambiarVolumenVoz(valor)

                toggleVoz(checkbox)

                aplicarPerfil(perfil)

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


                 ESTA NO TIENE function actualizarContraste(){
    console.log(
    "Contraste:",
    faroState.altoContraste
);

    document.body.classList.toggle(
        "faro-high-contrast",
        faroState.altoContraste
    );

}
