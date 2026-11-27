"use strict";
(function () {
    var NOMBRES = [
        ['Entrega de la escudería', 'pre'], ['Test oficial', 'pre'],
        ['6 Horas de Prometeo · tramo 1', 'carrera', 'Carrera de aprendizaje', 'normal'], ['6 Horas de Prometeo · tramo 2', 'carrera', 'Carrera de aprendizaje', 'normal'],
        ['12 Horas Quantum Race · tramo 1', 'carrera', 'Calor: fiabilidad y calidad', 'calor'], ['12 Horas Quantum Race · tramo 2', 'carrera', 'Calor: fiabilidad y calidad', 'calor'],
        ['6 Horas de las Ardenas · tramo 1', 'carrera', 'Lluvia: gestión del riesgo', 'lluvia'], ['6 Horas de las Ardenas · tramo 2', 'carrera', 'Lluvia: gestión del riesgo', 'lluvia'],
        ['Junta de patrocinadores', 'junta', 'Reformular la estrategia', 'normal'],
        ['8 Horas de Eifel · tramo 1', 'carrera', 'Circuito largo: daños y seguros', 'normal'], ['8 Horas de Eifel · tramo 2', 'carrera', 'Circuito largo: daños y seguros', 'normal'],
        ['10 Horas del Atardecer · tramo 1', 'carrera', 'Primera noche: turnos y fatiga', 'noche'], ['10 Horas del Atardecer · tramo 2', 'carrera', 'Primera noche: turnos y fatiga', 'noche'],
        ['24 Horas del Mare Nostrum · preparación', 'prep', 'Planificar con todos los recursos', 'normal'],
        ['24 Horas del Mare Nostrum · tramo 1', 'carrera', 'Ritmo sin castigar la mecánica', 'calor'], ['24 Horas del Mare Nostrum · tramo 2', 'carrera', 'Fatiga, errores y averías', 'noche'], ['24 Horas del Mare Nostrum · tramo 3', 'carrera', 'Arriesgar o asegurar la posición', 'normal'],
        ['Cierre del ejercicio', 'cierre', 'Rendir cuentas', 'normal']
    ];
    var HORAS = { 3: [0, 3, 6], 4: [3, 6, 6], 5: [0, 6, 12], 6: [6, 12, 12], 7: [0, 3, 6], 8: [3, 6, 6], 10: [0, 4, 8], 11: [4, 8, 8], 12: [0, 5, 10], 13: [5, 10, 10], 15: [0, 8, 24], 16: [8, 16, 24], 17: [16, 24, 24] };
    var TIPO = { pre: 'Pretemporada', carrera: 'Tramo de carrera', junta: 'Junta', prep: 'Preparación', cierre: 'Cierre' };
    function $(s) { return document.querySelector(s); }
    function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function eur(n) { return (n < 0 ? '−' : '') + Math.abs(Math.round(n)).toLocaleString('es-ES', { useGrouping: 'always' }) + ' €'; }
    function num(n, d) { return n.toLocaleString('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d }); }
    function rnd(seed) { var x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); }
    // ---- Datos de ejemplo (faltan las fórmulas del motor de cálculo) ----
    function tes(r) { return 250000 + Math.round((rnd(r + 8) - .3) * 220) * 1000 + r * 8000; }
    function ing(r) { return Math.round((420 + rnd(r + 5) * 180 + r * 12) / 5) * 5 * 1000; }
    function cos(r) { return Math.round((380 + rnd(r + 6) * 170 + r * 9) / 5) * 5 * 1000; }
    function estados(k) {
        var e = {};
        e.inmov = 1100000 - 20000 * k;
        e.exist = 60000 + Math.round(rnd(k + 31) * 30) * 1000;
        e.cli = 80000 + Math.round(rnd(k + 32) * 40) * 1000;
        e.tes = tes(k);
        e.activo = e.inmov + e.exist + e.cli + e.tes;
        e.cap = 900000;
        e.pre = 400000 - 12000 * k;
        e.prov = 150000 + Math.round(rnd(k + 33) * 60) * 1000;
        e.res = e.activo - e.cap - e.pre - e.prov;
        e.pn = e.cap + e.res;
        if (k > 0) {
            var I = ing(k), C = cos(k);
            e.I = I;
            e.C = C;
            e.pat = Math.round(I * .55 / 1000) * 1000;
            e.prem = Math.round(I * .25 / 1000) * 1000;
            e.merch = I - e.pat - e.prem;
            e.amort = 20000;
            e.finan = Math.round(e.pre * .01 / 1000) * 1000;
            var r = C - e.amort - e.finan;
            e.pers = Math.round(r * .45 / 1000) * 1000;
            e.comp = Math.round(r * .28 / 1000) * 1000;
            e.id = Math.round(r * .14 / 1000) * 1000;
            e.rep = r - e.pers - e.comp - e.id;
            e.rdo = I - C;
            e.dt = tes(k) - tes(k - 1);
            e.inv = -Math.round(rnd(k + 40) * 25) * 1000;
            e.fin = -12000;
            e.oper = e.dt - e.inv - e.fin;
            e.ti = tes(k - 1);
        }
        return e;
    }
    function resp(n) {
        if (n === 1)
            return [];
        if (n === 2)
            return [['Nova Energía', 'Aceptado', 'good'], ['Atlas Seguros', 'Rechazado', 'warn'], ['Piloto promesa', 'Fichado', 'good']];
        if (n === 9)
            return [['I+D Refrigeración', 'En curso', 'amber'], ['Nova Energía', 'En estudio', 'amber']];
        var ok = rnd(n + 20) > .5, pay = rnd(n + 21) > .3;
        return [['I+D Refrigeración', ok ? 'Completado' : 'En curso', ok ? 'good' : 'amber'], ['Nova Energía', pay ? 'Pago recibido' : 'Pago retenido', pay ? 'good' : 'amber']];
    }
    function alertas(n, e) {
        var a = [], c = NOMBRES[n - 1];
        if (e.tes < 300000)
            a.push(['warn', 'Tesorería ajustada', 'Tienes ' + eur(e.tes) + '. Vigila los pagos de la ronda.']);
        if (e.I && e.rdo < 0)
            a.push(['warn', 'Pérdidas en la ronda anterior', 'Resultado de ' + eur(e.rdo) + '.']);
        if (c[1] === 'carrera') {
            a.push(['amber', 'Patrocinador «Nova Energía»', 'Exige terminar la carrera para pagar el bono.']);
            if (c[3] === 'calor')
                a.push(['amber', 'Calor previsto', 'Más averías si la calidad operativa es baja.']);
            if (c[3] === 'lluvia')
                a.push(['amber', 'Lluvia prevista', 'Manda el riesgo, no el ritmo.']);
            if (c[3] === 'noche')
                a.push(['amber', 'Conducción nocturna', 'Cuida turnos y fatiga de los pilotos.']);
        }
        if (n === 8)
            a.push(['info', 'La próxima ronda es la junta', 'Cierre contable semestral.']);
        if (n === 13)
            a.push(['info', 'Después viene la preparación de la final', 'Planifica presupuesto y recambios.']);
        if (n === 17)
            a.push(['info', 'Última carrera', 'La siguiente ronda es el cierre del ejercicio.']);
        if (!a.length)
            a.push(['good', 'Sin alertas', 'No hay avisos especiales para esta ronda.']);
        return a;
    }
    var CARRERA = { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 10: 1, 11: 1, 12: 1, 13: 1, 15: 1, 16: 1, 17: 1 };
    function k1(x) { return Math.round(x / 1000) * 1000; }
    function pygRonda(r) {
        var I = ing(r), C = cos(r), car = !!CARRERA[r], pre = 400000 - 12000 * r, d = {};
        var prem = car ? k1(I * .25) : 0, pat = k1(I * (car ? .55 : .8)), merch = I - prem - pat;
        d.cal = k1(prem * .2);
        d.car = k1(prem * .65);
        d.vr = prem - d.cal - d.car;
        d.pat = pat;
        d.merch = merch;
        d.amort = 20000;
        d.inter = k1(pre * .01);
        var R = C - d.amort - d.inter, pers = k1(R * .45), idv = k1(R * .12), comp = k1(R * (car ? .25 : .43)), rep = R - pers - idv - comp;
        d.pil = k1(pers * .35);
        d.ing = k1(pers * .2);
        d.mec = k1(pers * .3);
        d.jefe = pers - d.pil - d.ing - d.mec;
        d.indem = 0;
        d.proy = k1(idv * .7);
        d.lic = idv - d.proy;
        d.rec = k1(comp * .6);
        d.taller = comp - d.rec;
        d.reps = car ? k1(rep * .7) : 0;
        d.log = rep - d.reps;
        return d;
    }
    var CLAVES = ['cal', 'car', 'vr', 'pat', 'merch', 'amort', 'inter', 'pil', 'ing', 'mec', 'jefe', 'indem', 'proy', 'lic', 'rec', 'taller', 'reps', 'log'];
    function periodo(k, cod) {
        var d = {};
        CLAVES.forEach(function (c) { d[c] = 0; });
        var desde = cod === 'temp' ? 1 : cod === 'ult' ? k : +cod.slice(1), hasta = cod === 'temp' ? k : cod === 'ult' ? k : +cod.slice(1);
        for (var r = desde; r <= hasta; r++) {
            var x = pygRonda(r);
            CLAVES.forEach(function (c) { d[c] += x[c]; });
        }
        d.pers = d.pil + d.ing + d.mec + d.jefe + d.indem;
        d.idv = d.proy + d.lic;
        d.comp = d.rec + d.taller;
        d.carr = d.reps + d.log;
        d.fin = d.amort + d.inter;
        d.G = d.pers + d.idv + d.comp + d.carr + d.fin;
        d.prem = d.cal + d.car + d.vr;
        d.I = d.prem + d.pat + d.merch;
        return d;
    }
    var perL = 'ult', perR = 'temp';
    function pr(l, v, cls) { return '<div class="pr ' + cls + (v === 0 ? ' z' : '') + '"><span>' + l + '</span><b style="font-weight:' + (cls === 'g' ? 700 : 400) + '">' + eur(v) + '</b></div>'; }
    function columna(side, k, cod) {
        var d = periodo(k, cod), res = d.I - d.G, tot = d.I + d.G;
        var title = side === 'L' ? 'Última ronda (ronda ' + k + ')' : 'Final de temporada';
        return '<div class="pcol"><div class="phead"><b>' + esc(title) + '</b>' + (side === 'R' && k < 18 ? '<small class="pacc">Acumulado hasta la ronda ' + k + '</small>' : '') + '</div>' +
            '<div class="pbig' + (res < 0 ? ' neg' : '') + '"><small>Resultado</small>' + eur(res) + '</div>' +
            '<div class="pbar" role="img" aria-label="Gastos ' + Math.round(d.G / tot * 100) + ' % e ingresos ' + Math.round(d.I / tot * 100) + ' %"><i style="width:' + d.G / tot * 100 + '%"></i><i style="width:' + d.I / tot * 100 + '%"></i></div>' +
            '<div class="pg"><details class="pdetails"><summary class="pgh"><span>Gastos</span><b>' + eur(d.G) + '</b></summary><div class="pbody">' +
            pr('Gastos de personal', d.pers, 'g') + pr('Pilotos', d.pil, 's') + pr('Ingenieros', d.ing, 's') + pr('Mecánicos', d.mec, 's') + pr('Jefe de equipo deportivo', d.jefe, 's') + pr('Indemnizaciones', d.indem, 's') +
            pr('I+D', d.idv, 'g') + pr('Proyectos', d.proy, 's') + pr('Licencias de tecnología', d.lic, 's') +
            pr('Compras y operaciones', d.comp, 'g') + pr('Recambios', d.rec, 's') + pr('Taller y subcontratación', d.taller, 's') +
            pr('Carrera', d.carr, 'g') + pr('Reparaciones y averías', d.reps, 's') + pr('Logística', d.log, 's') +
            pr('Amortización e intereses', d.fin, 'g') + pr('Amortización', d.amort, 's') + pr('Intereses', d.inter, 's') + '</div></details></div>' +
            '<div class="pi"><details class="pdetails"><summary class="pgh"><span>Ingresos</span><b>' + eur(d.I) + '</b></summary><div class="pbody">' +
            pr('Por resultados', d.prem, 'g') + pr('Calificación', d.cal, 's') + pr('Carrera', d.car, 's') + pr('Vuelta rápida', d.vr, 's') +
            pr('Patrocinadores', d.pat, 'g') + pr('Hospitality y merchandising', d.merch, 'g') + '</div></details></div></div>';
    }
    function render(n) {
        var k = n - 1, e = estados(k), c = NOMBRES[n - 1], hr = HORAS[n], h = '';
        $('#top').innerHTML = '<span class="pillc">' + (k ? 'Datos al cierre de la ronda ' + k : 'Inicio de temporada') + '</span><span class="pillc" style="background:var(--track);color:var(--ink)">Ronda ' + n + ' abierta</span>';
        // 1. Dossier de la ronda (lo que recibe el equipo al abrirse la ronda y no es otra sección)
        var rs = resp(n);
        h += '<section class="sec" id="dossier" aria-labelledby="t1"><h2 id="t1">Dossier de la ronda</h2><div class="cards g2">' +
            '<div class="card race"><h3>Próxima carrera</h3><b>' + esc(c[0]) + '</b><p>' + TIPO[c[1]] + (hr ? ' · horas ' + hr[0] + ' a ' + hr[1] + ' de ' + hr[2] : '') + '</p>' + (c[2] ? '<p>Reto: ' + esc(c[2]) + '</p>' : '') + '</div>' +
            '<div class="card"><h3>Respuestas a decisiones anteriores</h3>' + (rs.length ? '<div class="resp" style="grid-template-columns:1fr">' + rs.map(function (x) { return '<div class="r"><span>' + esc(x[0]) + '</span><span class="pill ' + x[2] + '">' + esc(x[1]) + '</span></div>'; }).join('') + '</div>' : '<p class="empty">Llegan a partir de la ronda 2.</p>') + '</div></div></section>';
        // 2. Ingresos y gastos (siempre los de la ronda anterior)
        h += '<section class="sec" id="estados" aria-labelledby="t2"><h2 id="t2">Ingresos y gastos</h2><p class="hint">Consulta los resultados de las rondas publicadas y el total de la temporada.</p>';
        if (e.I) {
            h += '<div class="pyg">' + columna('L', k, perL) + columna('R', k, perR) + '</div>';
        }
        else {
            h += '<div class="card"><p class="empty">Primera ronda: los gastos e ingresos aparecerán al publicar la ronda 1.</p></div>';
        }
        h += '</section>';
        // 5. Alertas
        h += '<section class="sec" id="alertas" aria-labelledby="t5"><h2 id="t5">Alertas</h2><div class="al">' + alertas(n, e).map(function (x) { return '<div class="a ' + x[0] + '"><i></i><span>' + esc(x[1]) + '<small>' + esc(x[2]) + '</small></span></div>'; }).join('') + '</div></section>';
        h += '<div class="note"><i></i>Datos de ejemplo: faltan las fórmulas de cálculo del simulador</div>';
        $('#app').innerHTML = h;
        document.title = 'Situación financiera · Ronda ' + n;
    }
    var sel = $('#sel');
    sel.innerHTML = NOMBRES.map(function (c, i) { return '<option value="' + (i + 1) + '">' + (i + 1) + ' · ' + esc(c[0]) + '</option>'; }).join('');
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
    sel.addEventListener('change', function () {
        perL = 'ult';
        perR = 'temp';
        try {
            localStorage.setItem('ronda', sel.value);
        }
        catch (e) { }
        render(+sel.value);
    });
    document.addEventListener('change', function (ev) {
        var t = ev.target;
        if (!t.dataset || !t.dataset.per)
            return;
        if (t.dataset.per === 'L')
            perL = t.value;
        else
            perR = t.value;
        render(+sel.value);
        var nb = document.querySelector('[data-per="' + t.dataset.per + '"]');
        if (nb)
            nb.focus();
    });
    render(start);
})();
