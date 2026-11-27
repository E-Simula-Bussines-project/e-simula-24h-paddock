"use strict";
(function () {
    var RONDAS = [["Entrega de la escudería", "Declara tu estrategia y puja por pilotos"], ["Test oficial", "Llegan patrocinadores y fichajes"], ["6 Horas de Prometeo", "Tramo 1 · 0 a 3 h"], ["6 Horas de Prometeo", "Tramo 2 · 3 a 6 h"], ["12 Horas Quantum Race", "Tramo 1 · 0 a 6 h"], ["12 Horas Quantum Race", "Tramo 2 · 6 a 12 h"], ["6 Horas de las Ardenas", "Tramo 1 · 0 a 3 h"], ["6 Horas de las Ardenas", "Tramo 2 · 3 a 6 h"], ["Junta de patrocinadores", "Revisa el plan y el mercado de verano"], ["8 Horas de Eifel", "Tramo 1 · 0 a 4 h"], ["8 Horas de Eifel", "Tramo 2 · 4 a 8 h"], ["10 Horas del Atardecer", "Tramo 1 · 0 a 5 h"], ["10 Horas del Atardecer", "Tramo 2 · 5 a 10 h"], ["24 Horas del Mare Nostrum", "Preparación de la final"], ["24 Horas del Mare Nostrum", "Tramo 1 · 0 a 8 h"], ["24 Horas del Mare Nostrum", "Tramo 2 · 8 a 16 h"], ["24 Horas del Mare Nostrum", "Tramo 3 · 16 a 24 h"], ["Cierre del ejercicio", "Memoria y defensa ante el consejo"]];
    var ROLES = ['Jefe de equipo deportivo', 'Piloto', 'Ingenieros', 'Mecánicos'], LIMITES = [1, 1, 2, 3];
    var PERSONAS: Persona[] = ([[0, 'David Martín', 0, 15000], [1, 'Álex Torres', 1, 12000], [2, 'Sara Costa', 2, 8000], [3, 'Mateo Rivas', 2, 8000], [4, 'Hamza El Mansouri', 3, 4000], [5, 'Júlia Serra', 3, 4000], [6, 'Eric Molina', 3, 4000], [7, 'Clara Navarro', 1, 11000], [8, 'Pablo Rivas', 2, 9000], [9, 'Nora Campos', 3, 4500], [10, 'Elena Castro', 0, 16000]] as [number, string, number, number][]).map(function (p) { return { id: p[0], nombre: p[1], grupo: p[2], salario: p[3] }; });
    var FOTOS = ["assets/rrhh-01.webp", "assets/rrhh-02.webp", "assets/rrhh-03.webp", "assets/rrhh-04.webp", "assets/rrhh-05.webp", "assets/rrhh-06.webp", "assets/rrhh-07.webp", "assets/rrhh-08.webp", "assets/rrhh-09.webp", "assets/rrhh-10.webp", "assets/rrhh-11.webp"];
    var OFICIOS = ["Jefe de equipo deportivo", "Piloto", "Ingeniera", "Ingeniero", "Mecánico", "Mecánica", "Mecánico", "Piloto", "Ingeniero", "Mecánica", "Jefa de equipo deportivo"];
    var decisiones: Record<number, DecisionRRHH> = {}, cerradas: Record<number, boolean> = {}, editor = null;
    try {
        decisiones = JSON.parse(localStorage.getItem('rrhh-decisiones') || '{}');
        cerradas = JSON.parse(localStorage.getItem('paddock-cerradas') || '{}');
    }
    catch (e) { }
    function $(s) { return document.querySelector(s); }
    function eur(n) { return n.toLocaleString('es-ES', { useGrouping: 'always' as unknown as boolean }) + ' €'; }
    function decision(n: number) { if (!decisiones[n])
        decisiones[n] = { salarios: {}, despidos: {}, ofertas: {} }; return decisiones[n]; }
    function guardar() { try {
        localStorage.setItem('rrhh-decisiones', JSON.stringify(decisiones));
    }
    catch (e) { } }
    function total(list: Persona[]) { return list.reduce(function (a, p) { return a + p.salario; }, 0); }
    function plantilla(n: number) { var list = PERSONAS.slice(0, 7).map(function (p) { return Object.assign({}, p); }), respuestas = []; for (var r = 1; r < n; r++) {
        var d = decisiones[r], rs = [];
        if (d) {
            list = list.filter(function (p) { if (!d.despidos[p.id])
                return true; rs.push([p.nombre, 'Despido aplicado']); return false; });
            list.forEach(function (p) { if (d.salarios[p.id] !== undefined) {
                p.salario = d.salarios[p.id];
                rs.push([p.nombre, 'Salario actualizado']);
            } });
            Object.keys(d.ofertas).forEach(function (id) { var p = PERSONAS[+id], v = d.ofertas[id]; if (!p || list.some(function (x) { return x.id === p.id; }))
                return; var hueco = list.filter(function (x) { return x.grupo === p.grupo; }).length < LIMITES[p.grupo]; if (hueco && v >= p.salario) {
                list.push(Object.assign({}, p, { salario: v }));
                rs.push([p.nombre, 'Fichaje aceptado']);
            }
            else
                rs.push([p.nombre, hueco ? 'Oferta rechazada' : 'Sin plaza disponible']); });
        }
        if (r === n - 1)
            respuestas = rs;
    } return { list: list, respuestas: respuestas }; }
    function button(label: string, act: string, id: number, cls?: string) { return '<button class="' + (cls || '') + '" data-act="' + act + '" data-id="' + id + '">' + label + '</button>'; }
    function persona(p: Persona, d: DecisionRRHH, mercado: boolean, n: number) { var id = p.id, h = '<div class="rr-person"><img class="rr-face" src="' + FOTOS[id] + '" alt="" width="64" height="64"><div class="rr-person-info"><b>' + p.nombre + '</b><small>' + OFICIOS[id] + ' · ' + eur(p.salario) + ' / ronda</small>'; if (d.salarios[id] !== undefined)
        h += '<span class="rr-pending">Nuevo salario: ' + eur(d.salarios[id]) + '</span>'; if (d.despidos[id])
        h += '<span class="rr-pending">Despido pendiente</span>'; if (d.ofertas[id] !== undefined)
        h += '<span class="rr-pending">Oferta: ' + eur(d.ofertas[id]) + '</span>'; h += '</div><div class="actions">'; if (n === 18 || cerradas[n])
        return h + '</div></div>'; if (editor && editor.id === id && editor.mercado === mercado)
        h += '<input type="number" min="1" step="500" id="importe" value="' + (mercado ? p.salario : (d.salarios[id] || p.salario)) + '" aria-label="Importe">' + button('Guardar', 'guardar', id, 'primary') + button('Cancelar', 'cancelar', id);
    else if (mercado)
        h += d.ofertas[id] !== undefined ? button('Retirar', 'retirar', id) : button('Ofertar', 'ofertar', id, 'primary');
    else if (d.despidos[id])
        h += button('Cancelar', 'anular', id);
    else
        h += button('Salario', 'salario', id) + button('Despedir', 'despedir', id, 'danger'); return h + '</div></div>'; }
    function render(n) {
        var a = plantilla(n), list = a.list, d = decision(n);
        $('#top').textContent = 'Ronda ' + n + ' de 18 · ' + (cerradas[n] ? 'Cerrada' : n === 18 ? 'Cierre' : 'Abierta');
        var h = '<div class="rr-stats"><div class="card"><small>Plantilla actual</small><b>' + list.length + ' / 7</b><small>Empleados</small></div><div class="card"><small>Gastos de personal</small><b>' + eur(total(list)) + '</b><small>Por ronda</small></div><div class="card"><small>Capital humano</small><b>50 / 100</b><small>Valor provisional</small></div></div><div class="rr-layout"><section class="card"><h2>Mi plantilla</h2>';
        ROLES.forEach(function (rol, g) { var grupo = list.filter(function (p) { return p.grupo === g; }); h += '<div class="rr-group"><div class="rr-group-head"><div><b>' + rol + '</b><small>' + grupo.length + ' / ' + LIMITES[g] + ' plazas</small></div><b>' + eur(total(grupo)) + '</b></div>' + (grupo.length ? grupo.map(function (p) { return persona(p, d, false, n); }).join('') : '<p style="padding:12px;margin:0">Sin personal contratado.</p>') + '</div>'; });
        h += '</section><div class="rr-right"><section class="card"><h2>Mercado de fichajes</h2><p class="rr-note">Los fichajes se resuelven en la siguiente ronda. Si no hay plazas libres, marca un despido antes de ofertar.</p>';
        var mercado = PERSONAS.filter(function (p) { return !list.some(function (x) { return x.id === p.id; }); });
        h += mercado.map(function (p) { return persona(p, d, true, n); }).join('') + '</section><section class="card"><h2>Respuestas a decisiones</h2>' + (a.respuestas.length ? a.respuestas.map(function (x) { return '<div class="rr-resp"><b>' + x[0] + '</b><span>' + x[1] + '</span></div>'; }).join('') : '<p class="rr-note">No hay nuevas respuestas en esta ronda.</p>') + '</section></div></div><div class="rr-alert">' + (cerradas[n] ? 'Ronda cerrada. No se pueden modificar decisiones.' : list.length < 7 ? 'Hay plazas vacantes en tu plantilla.' : n === 18 ? 'Cierre del ejercicio.' : 'Los cambios se aplican en la siguiente ronda.') + '</div><p class="rr-note">Datos de ejemplo: faltan las fórmulas de cálculo del simulador.</p>';
        $('#app').innerHTML = h;
    }
    var sel = $('#sel'), start = 5;
    sel.innerHTML = RONDAS.map(function (r, i) { return '<option value="' + (i + 1) + '">' + (i + 1) + ' · ' + r[0] + '</option>'; }).join('');
    try {
        var v = +localStorage.getItem('ronda');
        if (v >= 1 && v <= 18)
            start = v;
    }
    catch (e) { }
    sel.value = start;
    sel.addEventListener('change', function () { editor = null; try {
        localStorage.setItem('ronda', sel.value);
    }
    catch (e) { } $('#notice').textContent = ''; render(+sel.value); });
    $('#app').addEventListener('click', function (e) { var b = (e.target as HTMLElement).closest<HTMLElement>('[data-act]'), n = +sel.value; if (!b || n === 18 || cerradas[n])
        return; var act = b.dataset.act, id = +b.dataset.id, d = decision(n), msg = ''; if (act === 'salario' || act === 'ofertar')
        editor = { id: id, mercado: act === 'ofertar' }; if (act === 'cancelar')
        editor = null; if (act === 'guardar') {
        var v = $('#importe').valueAsNumber;
        if (!Number.isFinite(v) || v <= 0) {
            $('#notice').textContent = 'Introduce un importe válido.';
            return;
        }
        if (editor.mercado) {
            d.ofertas[id] = v;
            msg = 'Oferta guardada.';
        }
        else {
            d.salarios[id] = v;
            msg = 'Salario guardado.';
        }
        editor = null;
    } if (act === 'despedir') {
        d.despidos[id] = true;
        delete d.salarios[id];
        msg = 'Despido pendiente.';
        editor = null;
    } if (act === 'anular')
        delete d.despidos[id]; if (act === 'retirar')
        delete d.ofertas[id]; guardar(); render(n); $('#notice').textContent = msg; });
    render(start);
})();
