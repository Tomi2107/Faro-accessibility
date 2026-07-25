<?php
defined('MOODLE_INTERNAL') || die();

/**
 * Inyecta el panel FARO al final de todas las páginas de Moodle.
 */
function local_accesspanel_before_footer() {

    global $USER, $COURSE, $CFG, $PAGE;

    if (!isloggedin() || isguestuser()) {
        return '';
    }

    $backendurl = get_config('local_accesspanel', 'backend_url');

    if (empty($backendurl)) {
        $backendurl = 'https://back-lti.onrender.com';
    }

    $frontendconfig = [
        'backendUrl' => rtrim($backendurl, '/'),
        'userId'     => (string)$USER->id,
        'courseId'   => !empty($COURSE->id) ? (string)$COURSE->id : null,
        'moodleUrl'  => $CFG->wwwroot,
        'username'   => fullname($USER),

        // todavía no se usa
        'navigation' => get_config('local_accesspanel', 'enablenav') !== '0',
        'reading'    => get_config('local_accesspanel', 'enablereading') !== '0',
        'visual'     => get_config('local_accesspanel', 'enablevisual') !== '0',
        'summary'    => get_config('local_accesspanel', 'enablesummary') !== '0',
        'progress'   => get_config('local_accesspanel', 'enableprogress') !== '0'
    ];
    

    $templatepath = __DIR__ . '/templates/faro.html';

    if (!file_exists($templatepath)) {
        return '<p>No se encontró templates/faro.html</p>';
    }

    $html = file_get_contents($templatepath);

    $script = '
<script>
window.FARO_CONFIG = ' .
json_encode(
    $frontendconfig,
    JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
)
. ';
</script>
';
    $PAGE->requires->js_call_amd('local_accesspanel/faro', 'init');

    return $script . $html;
}