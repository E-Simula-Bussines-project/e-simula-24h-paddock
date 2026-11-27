"use strict";
(function () {
    var TIPO = { pre: 'Pretemporada', carrera: 'Tramo de carrera', junta: 'Junta', prep: 'Preparación', cierre: 'Cierre' };
    var FASE = ['Pretemporada', 'Campeonato', 'Mitad de temporada', 'Campeonato', 'Gran final', 'Cierre'];
    // [ronda, fase, tipo, carrera, tramo, reto, horas desde, hasta, total]
    var CAL = ([
        [1, 0, 'pre', 'Entrega de la escudería', 'Declara tu estrategia y puja por pilotos', 'Formular la estrategia'],
        [2, 0, 'pre', 'Test oficial', 'Llegan patrocinadores y fichajes', 'Ajustar el plan a la realidad'],
        [3, 1, 'carrera', '6 Horas de Prometeo', 'Tramo 1', 'Carrera de aprendizaje', 0, 3, 6],
        [4, 1, 'carrera', '6 Horas de Prometeo', 'Tramo 2', 'Carrera de aprendizaje', 3, 6, 6],
        [5, 1, 'carrera', '12 Horas Quantum Race', 'Tramo 1', 'Calor: fiabilidad y calidad', 0, 6, 12],
        [6, 1, 'carrera', '12 Horas Quantum Race', 'Tramo 2', 'Calor: fiabilidad y calidad', 6, 12, 12],
        [7, 1, 'carrera', '6 Horas de las Ardenas', 'Tramo 1', 'Lluvia: gestión del riesgo', 0, 3, 6],
        [8, 1, 'carrera', '6 Horas de las Ardenas', 'Tramo 2', 'Lluvia: gestión del riesgo', 3, 6, 6],
        [9, 2, 'junta', 'Junta de patrocinadores', 'Revisa el plan y el mercado de verano', 'Reformular la estrategia'],
        [10, 3, 'carrera', '8 Horas de Eifel', 'Tramo 1', 'Circuito largo: daños y seguros', 0, 4, 8],
        [11, 3, 'carrera', '8 Horas de Eifel', 'Tramo 2', 'Circuito largo: daños y seguros', 4, 8, 8],
        [12, 3, 'carrera', '10 Horas del Atardecer', 'Tramo 1', 'Primera noche: turnos y fatiga', 0, 5, 10],
        [13, 3, 'carrera', '10 Horas del Atardecer', 'Tramo 2', 'Primera noche: turnos y fatiga', 5, 10, 10],
        [14, 4, 'prep', '24 Horas del Mare Nostrum', 'Preparación de la final', 'Planificar con todos los recursos'],
        [15, 4, 'carrera', '24 Horas del Mare Nostrum', 'Tramo 1', 'Ritmo sin castigar la mecánica', 0, 8, 24],
        [16, 4, 'carrera', '24 Horas del Mare Nostrum', 'Tramo 2', 'Fatiga, errores y averías', 8, 16, 24],
        [17, 4, 'carrera', '24 Horas del Mare Nostrum', 'Tramo 3', 'Arriesgar o asegurar la posición', 16, 24, 24],
        [18, 5, 'cierre', 'Cierre del ejercicio', 'Memoria y defensa ante el consejo', 'Rendir cuentas']
    ] as FilaRonda[]).map(function (c) { return { r: c[0], f: c[1], t: c[2], n: c[3], s: c[4], reto: c[5], h: c[6] === undefined ? null : [c[6], c[7], c[8]] }; });
    function $(s) { return document.querySelector(s); }
    function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function eur(n) { return n.toLocaleString('es-ES') + ' €'; }
    function rnd(seed) { var x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); }
    function clamp(n) { return Math.max(0, Math.min(100, Math.round(n))); }
    function res(r) {
        var b = 48 + r * 1.6;
        return {
            idx: [['Tecnología', 50], ['Personas', 50], ['Calidad', 50], ['Finanzas', 50]],
            nota: 50, tes: 250000 + Math.round((rnd(r + 8) - .3) * 220) * 1000 + r * 8000,
            pos: 1 + Math.floor(rnd(r + 9) * 9), aband: rnd(r + 11) > .82
        };
    }
    function ring(pct, r, cls) {
        var C = 2 * Math.PI * r;
        return '<svg viewBox="0 0 ' + (r * 2 + 12) + ' ' + (r * 2 + 12) + '" aria-hidden="true"><circle class="t" cx="' + (r + 6) + '" cy="' + (r + 6) + '" r="' + r + '"/><circle class="v" cx="' + (r + 6) + '" cy="' + (r + 6) + '" r="' + r + '" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + (C * (1 - pct)).toFixed(1) + '"/></svg>';
    }
    function delta(a, b, inv, unit) {
        var d = a - b;
        if (!d)
            return '<span class="dt flat">= igual</span>';
        var good = inv ? d < 0 : d > 0;
        return '<span class="dt ' + (good ? 'up' : 'down') + '">' + (d > 0 ? '▲ ' : '▼ ') + Math.abs(d).toLocaleString('es-ES') + (unit || '') + '</span>';
    }
    function alertas(c, p) {
        var a = [];
        if (c.t === 'carrera')
            a.push(['warn', 'Fija el riesgo antes de cerrar']);
        if (/Calor/.test(c.reto))
            a.push(['amber', 'Calor: más averías si la calidad es baja']);
        if (/Lluvia/.test(c.reto))
            a.push(['amber', 'Lluvia: manda el riesgo, no el ritmo']);
        if (/noche|Fatiga/.test(c.reto))
            a.push(['amber', 'Noche: cuida los turnos']);
        if (c.t === 'junta')
            a.push(['info', 'Cierre semestral: ¿cambias de estrategia?']);
        if (c.r === 14)
            a.push(['info', 'La final puntúa doble']);
        if (c.r === 18)
            a.push(['info', 'Cierre anual y entrega de premios']);
        if (p && p.idx[3][1] < 50)
            a.push(['warn', 'Índice financiero bajo (' + p.idx[3][1] + ')']);
        if (p && p.aband)
            a.push(['warn', 'Abandono en la ronda anterior']);
        if (!a.length)
            a.push(['good', 'Sin alertas']);
        return a.slice(0, 4);
    }
    function resp(r) {
        if (r === 1)
            return [];
        if (r === 2)
            return [['Nova Energía', 'Aceptado', 'good'], ['Atlas Seguros', 'Rechazado', 'warn'], ['Piloto promesa', 'Fichado', 'good']];
        if (r === 9)
            return [['I+D Refrigeración', 'En curso', 'amber'], ['Nova Energía', 'En estudio', 'amber']];
        var ok = rnd(r + 20) > .5, pay = rnd(r + 21) > .3;
        return [['I+D Refrigeración', ok ? 'Completado' : 'En curso', ok ? 'good' : 'amber'], ['Nova Energía', pay ? 'Pago recibido' : 'Pago retenido', pay ? 'good' : 'warn']];
    }
    // Clasificación (datos de ejemplo). Ponderación del documento: 40 % empresa, 40 % estrategia, 20 % deporte.
    var EQUIPOS = ['Grupo Alfa', 'Grupo Beta', 'Grupo Gamma', 'Grupo Delta', 'Grupo Épsilon'];
    var YO = 0, mode = 'global';
    var MODOS = [['global', 'Final'], ['emp', 'Empresa'], ['est', 'Estrategia'], ['dep', 'Deporte']];
    function puntos(g, r, m) {
        return 50; // provisional: faltan las fórmulas de cálculo
    }
    function orden(r, m) { return EQUIPOS.map(function (_, g) { return { g: g, v: puntos(g, r, m) }; }).sort(function (a, b) { return b.v - a.v; }); }
    function clasif(n) {
        var h = '<section class="card" id="clasif" aria-labelledby="hc"><h2 id="hc">Clasificación</h2>';
        if (n < 2)
            return h + '<p class="empty">Aparece cuando se publique la primera ronda.</p></section>';
        var now = orden(n - 1, mode), before = n > 2 ? orden(n - 2, mode) : null;
        h += '<div class="a amber" style="margin-bottom:12px"><i></i>Faltan las fórmulas de cálculo: valores provisionales (50)</div>' + '<div class="seg" role="group" aria-label="Tipo de clasificación">' + MODOS.map(function (x) { return '<button type="button" data-mode="' + x[0] + '" aria-pressed="' + (mode === x[0]) + '">' + x[1] + '</button>'; }).join('') + '</div><ol class="rank">';
        now.forEach(function (x, i) {
            var mv = '';
            if (before) {
                var old = before.map(function (y) { return y.g; }).indexOf(x.g);
                var d = old - i;
                mv = d > 0 ? '<span class="mv up">▲' + d + '</span>' : d < 0 ? '<span class="mv down">▼' + Math.abs(d) + '</span>' : '<span class="mv flat">=</span>';
            }
            h += '<li class="' + (x.g === YO ? 'mine' : '') + '"><span class="p">' + (i + 1) + '</span><span class="nm"><b>' + esc(EQUIPOS[x.g]) + (x.g === YO ? ' (tú)' : '') + '</b><span class="meter"><i style="width:' + x.v + '%"></i></span></span><span class="sc">' + x.v.toLocaleString('es-ES', { minimumFractionDigits: 1 }) + '</span>' + mv + '</li>';
        });
        return h + '</ol><p class="hintw">Final = 40 % empresa + 40 % estrategia + 20 % deporte.</p></section>';
    }
    var ICON = { "home": "<svg class=\"ico\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m3 10 9-7 9 7v10h-6v-7H9v7H3z\"/></svg>", "chart": "<svg class=\"ico\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"12\" width=\"4\" height=\"8\" rx=\"1\"/><rect x=\"10\" y=\"7\" width=\"4\" height=\"13\" rx=\"1\"/><rect x=\"17\" y=\"3\" width=\"4\" height=\"17\" rx=\"1\"/></svg>", "users": "<svg class=\"ico\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"9\" cy=\"7\" r=\"3\"/><path d=\"M2 21v-3a7 7 0 0 1 14 0v3zM16 4a3 3 0 0 1 0 6m2 4a5 5 0 0 1 4 5v2\"/></svg>", "user": "<svg class=\"ico\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"7\" r=\"4\"/><path d=\"M4 22v-3a8 8 0 0 1 16 0v3z\"/></svg>", "bell": "<svg class=\"ico\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M18 8a6 6 0 0 0-12 0c0 6-2 7-2 8h16c0-1-2-2-2-8M10 20h4\"/></svg>", "calendar": "<svg class=\"ico\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M7 2v6M17 2v6M3 11h18\"/></svg>", "trophy": "<svg class=\"ico\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M7 3h10v7a5 5 0 0 1-10 0V3ZM7 5H3v3a5 5 0 0 0 5 5m9-8h4v3a5 5 0 0 1-5 5m-4 2v5m-5 1h10\"/></svg>", "wallet": "<svg class=\"ico\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"15\" rx=\"2\"/><path d=\"M3 8h18M16 12h5v5h-5a2 2 0 0 1 0-5Z\"/></svg>", "gear": "<svg class=\"ico\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"8\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M12 1v3M12 20v3M1 12h3M20 12h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2\"/></svg>", "shield": "<svg class=\"ico\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 2 21 6v6c0 5-4 8-9 10-5-2-9-5-9-10V6zM8 12l3 3 5-6\"/></svg>", "clipboard": "<svg class=\"ico\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"5\" y=\"4\" width=\"14\" height=\"18\" rx=\"2\"/><rect x=\"9\" y=\"2\" width=\"6\" height=\"4\" rx=\"1\"/><path d=\"M8 11h8m-8 4h8m-8 4h5\"/></svg>", "arrow": "<svg class=\"ico\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m9 5 7 7-7 7\"/></svg>", "clock": "<svg class=\"ico\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 6v6l4 2\"/></svg>", "flag": "<svg class=\"ico\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 22V3m0 1c6-4 10 4 16 0v11c-6 4-10-4-16 0\"/></svg>", "alert": "<svg class=\"ico\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m12 3 10 18H2zM12 9v5m0 3v1\"/></svg>" };
    var CIRCUITOS_PREVIEW = ["assets/circuito-01.webp", "assets/circuito-02.webp"];
    var expanded = false, closed = {};
    try {
        closed = JSON.parse(localStorage.getItem('paddock-cerradas') || '{}');
    }
    catch (e) { }
    function metric(label, value, caption, ico, percentage, tone) {
        return '<div class="card metric"><div class="metric-top">' + ICON[ico] + label + '</div><strong>' + value + '</strong>' + (percentage === null ? '' : '<div class="mbar" style="--tone:' + tone + '"><i style="width:' + percentage + '%"></i></div>') + '<span class="detail">' + caption + '</span></div>';
    }
    function fechaLimite(n) {
        var d = new Date(2026, 11, 11 + (n - 1) * 7, 18);
        return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) + ' · 18:00';
    }
    function render(n) {
        var c = CAL[n - 1], prev = n > 1 ? res(n - 1) : null, rs = resp(n), closedNow = !!closed[n];
        var h = '<div class="dashboard"><div class="dash-main"><div class="dash-head"><div><h1 class="page-title">' + ICON.flag + 'Ronda actual</h1><p class="page-sub">Gestiona tu escudería, toma decisiones y compite a lo largo de la temporada.</p></div></div>';
        h += '<section class="race-hero"><img class="race-car" src="assets/gt.webp" alt="GT de resistencia número 24"><div class="hero-content"><p class="round-tag"><i class="' + (closedNow ? 'closed' : '') + '"></i>Ronda ' + n + ' de 18 · ' + (closedNow ? 'Cerrada' : 'Abierta') + '</p><h2>' + esc(c.n) + '</h2><p class="desc">' + esc(c.reto) + '</p><div class="race-meta"><span>' + ICON.flag + FASE[c.f] + '</span>' + (c.h ? '<span>' + ICON.clock + c.h[2] + ' horas</span>' : '') + '</div></div><div class="tramo-panel"><h3>' + ICON.flag + (c.h ? 'Tramo actual' : TIPO[c.t]) + '</h3><p>' + esc(c.s) + '</p>';
        if (c.h) {
            h += '<div class="progress"><i style="width:' + (c.h[1] / c.h[2] * 100) + '%"></i></div><small>Duración del tramo</small><strong>' + (c.h[1] - c.h[0]) + ' horas · ' + c.h[0] + ' a ' + c.h[1] + ' h</strong>';
        }
        else
            h += '<small>Fase de la temporada</small><strong>' + FASE[c.f] + '</strong>';
        h += '</div></section><div class="dash-bottom">' + clasif(n).replace('<h2 id="hc">Clasificación</h2>', '<h2 id="hc" class="heading-icon">' + ICON.trophy + 'Clasificación</h2>') + '<section class="card management"><h2 class="heading-icon">' + ICON.gear + 'Índices de gestión</h2><div class="kpi-row kpi-four">';
        var idx = [['Índice financiero', 'wallet', '#237bc5', 3], ['Capital humano', 'users', '#2c9a6c', 1], ['Índice tecnológico', 'gear', '#8851c4', 0], ['Calidad operativa', 'shield', '#2c9a6c', 2]];
        idx.forEach(function (a) { var v = prev ? prev.idx[a[3]][1] : 0; h += metric(a[0], prev ? v + ' <small>/ 100</small>' : '—', prev ? 'Valor provisional' : 'Sin resultados', a[1], v, a[2]); });
        h += '</div></section></div>';
        h += '<div class="alert-band" id="alerts">' + ICON.alert + '<strong>Alertas</strong><span>' + esc(alertas(c, prev).map(function (a) { return a[1]; }).join(' · ')) + '</span></div><section class="card"><h2 class="heading-icon">' + ICON.clipboard + 'Respuestas a tus decisiones</h2>' + (rs.length ? '<div class="reply-list">' + rs.map(function (x) { return '<div class="r"><span>' + esc(x[0]) + '</span><span class="pill ' + x[2] + '">' + esc(x[1]) + '</span></div>'; }).join('') + '</div>' : '<p class="empty">Llegan a partir de la ronda 2.</p>') + '</section><p class="dash-note">Datos de ejemplo: los índices y la clasificación son provisionales hasta disponer del motor de cálculo.</p></div>';
        h += '<aside class="dash-right"><section class="card"><h2 class="heading-icon">' + ICON.calendar + 'Calendario de la temporada</h2><ol class="round-list">';
        var max = expanded ? 18 : Math.min(18, Math.max(8, n + 2));
        CAL.slice(0, max).forEach(function (x) { var cls = x.r < n ? 'past' : x.r === n ? 'current' : 'future'; h += '<li><button data-round="' + x.r + '" class="' + cls + '"><span class="round-dot">' + (x.r < n ? '✓' : x.r === n ? '▶' : '›') + '</span><span class="rn">' + x.r + '</span><span>' + esc(x.n) + (expanded && x.t === 'carrera' ? '<br><small style="opacity:.7">' + esc(x.s) + '</small>' : '') + '</span></button></li>'; });
        h += '</ol><button class="cal-toggle" id="calendarToggle">' + (expanded ? 'Mostrar menos' : 'Ver calendario completo (18 rondas)') + ICON.arrow + '</button></section><section class="card round-close-card"><h2 class="heading-icon">' + ICON.clock + 'Cierre de ronda</h2><p class="deadline-label">Fecha límite <small>(ejemplo)</small></p><p class="deadline-date">' + fechaLimite(n) + '</p><button class="close-round" id="closeRound" ' + (closedNow ? 'disabled' : '') + '>' + ICON.flag + (closedNow ? 'Ronda cerrada' : 'Cerrar ronda') + '</button></section></aside></div>';
        $('#app').innerHTML = h;
        document.title = 'Ronda ' + n + ' · E-SIMULA 24H Paddock';
    }
    var sel = $('#sel');
    sel.innerHTML = CAL.map(function (c) { return '<option value="' + c.r + '">' + c.r + ' · ' + esc(c.n) + (c.s && c.t === 'carrera' ? ' (' + c.s.toLowerCase() + ')' : '') + '</option>'; }).join('');
    var start = 5;
    try {
        var st = parseInt(localStorage.getItem('ronda'), 10);
        if (st >= 1 && st <= 18)
            start = st;
    }
    catch (e) { }
    try {
        var q = parseInt(new URLSearchParams(location.search).get('ronda'), 10);
        if (q >= 1 && q <= 18)
            start = q;
    }
    catch (e) { }
    sel.value = String(start);
    sel.addEventListener('change', function () { try {
        localStorage.setItem('ronda', sel.value);
    }
    catch (e) { } render(+sel.value); });
    $('#app').addEventListener('click', function (e) { var b = (e.target as HTMLElement).closest<HTMLElement>('[data-mode]'); if (b) {
        mode = b.getAttribute('data-mode');
        render(+sel.value);
        var nb = document.querySelector<HTMLElement>('[data-mode="' + mode + '"]');
        if (nb)
            nb.focus();
    } });
    $('#app').addEventListener('click', function (e) {
        var b = (e.target as HTMLElement).closest<HTMLElement>('button');
        if (!b)
            return;
        if (b.dataset.round) {
            sel.value = b.dataset.round;
            try {
                localStorage.setItem('ronda', sel.value);
            }
            catch (e) { }
            render(+sel.value);
        }
        if (b.id === 'calendarToggle') {
            expanded = !expanded;
            render(+sel.value);
        }
        if (b.id === 'closeRound' && confirm('¿Cerrar esta ronda? Tus decisiones quedarán bloqueadas.')) {
            closed[sel.value] = true;
            try {
                localStorage.setItem('paddock-cerradas', JSON.stringify(closed));
            }
            catch (e) { }
            render(+sel.value);
        }
    });
    render(start);
})();
