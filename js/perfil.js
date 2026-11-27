"use strict";
(function () {
    var CICLOS = ['DAM', 'DAW', 'ASIX'], CLASES = [1, 2], MAX = 3, MIN = 2;
    var groups = [{ id: 1, n: 'Grupo Alfa', t: null, coche: '' }, { id: 2, n: 'Grupo Beta', t: null, coche: '' }, { id: 3, n: 'Grupo Gamma', t: null, coche: '' }, { id: 4, n: 'Grupo Delta', t: null, coche: '' }, { id: 5, n: 'Grupo Épsilon', t: null, coche: '' }];
    var S = [
        [1, 'Marta Puig', 'DAM', 1, 1], [2, 'Youssef El Amrani', 'DAM', 1, 1], [3, 'Salma Benali', 'DAM', 1, 1],
        [4, 'Pau Roca', 'DAM', 2, 2], [5, 'Núria Vidal', 'DAM', 2, 2],
        [6, 'Arjun Patel', 'DAW', 1, 3], [7, 'Clara Soler', 'DAW', 1, 3],
        [8, 'Diego Mamani', 'DAW', 2, 4], [9, 'Valeria Quispe', 'DAW', 2, 4], [10, 'Dani Costa', 'DAW', 2, 4],
        [11, 'Mariana Rodríguez', 'ASIX', 1, 5], [12, 'Marc Gil', 'ASIX', 1, 5], [13, 'Irene Vega', 'ASIX', 2, null], [14, 'Samuel Diop', 'ASIX', 2, 5]
    ];
    var students = S.map(function (r, i) {
        var first = r[1].split(' ')[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        return { id: r[0], nombre: r[1], email: first + '@alumnos.centro.cat', tel: '6' + (10000000 + i * 3719311).toString().slice(0, 8), ciclo: r[2], clase: r[3], grupo: r[4], alta: '2025-09-' + String(10 + i).padStart(2, '0') };
    });
    var nextS = 100, nextG = 10, role = document.body.dataset.rol || 'alumno', meId = 1, tab = 'alumnos', fCiclo = '', fClase = '', fQ = '';
    function $(s) { return document.querySelector(s); }
    var app = $('#app'), dlg = $('#dlg'), frm = $('#frm');
    function fv(f, k) { var _a; return String((_a = f.get(k)) !== null && _a !== void 0 ? _a : ''); }
    var FOTOS_PREVIEW = ["assets/usuario-01.webp", "assets/usuario-02.webp", "assets/usuario-03.webp", "assets/usuario-04.webp", "assets/usuario-05.webp", "assets/usuario-06.webp", "assets/usuario-07.webp", "assets/usuario-08.webp", "assets/usuario-09.webp", "assets/usuario-10.webp", "assets/usuario-11.webp", "assets/usuario-12.webp", "assets/usuario-13.webp", "assets/usuario-14.webp", "assets/usuario-15.webp", "assets/usuario-16.webp", "assets/usuario-17.webp", "assets/usuario-18.webp"];
    function face(seed, name, adulto) {
        var id = adulto ? 14 + (seed - 101 + 4) % 4 : seed === 14 ? 18 : (seed - 1) % 13 + 1;
        return '<img src="' + FOTOS_PREVIEW[id - 1] + '" alt="">';
    }
    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function ini(n) { return n.split(' ').map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase(); }
    function gById(id) { return groups.filter(function (g) { return g.id === id; })[0]; }
    function sById(id) { return students.filter(function (s) { return s.id === id; })[0]; }
    function members(gid) { return students.filter(function (s) { return s.grupo === gid; }); }
    function cb(c) { return '<span class="badge b-' + c + '">' + c + '</span>'; }
    function clb(n) { return '<span class="badge b-c">Clase ' + n + '</span>'; }
    function fmt(d) { var p = d.split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }
    var toastT;
    var undoSnap = null;
    function snap() { undoSnap = JSON.stringify({ students: students, groups: groups, TUT: TUT, PART: PART }); }
    function toast(m, undo) {
        var t = $('#toast');
        t.textContent = m;
        if (undo && undoSnap) {
            var b = document.createElement('button');
            b.className = 'btn sm';
            b.textContent = 'Deshacer';
            b.onclick = function () { var o = JSON.parse(undoSnap); students = o.students; groups = o.groups; TUT = o.TUT; PART = o.PART; t.classList.remove('on'); render(); toast('Cambio deshecho'); };
            t.appendChild(b);
        }
        t.classList.add('on');
        clearTimeout(toastT);
        toastT = window.setTimeout(function () { t.classList.remove('on'); }, undo ? 7000 : 2800);
    }
    function intro(t) { return '<p class="intro">' + t + '</p>'; }
    function dayName(d) { return new Date(d + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }); }
    function head() {
        $('#vAlu').setAttribute('aria-pressed', String(role === 'alumno'));
        $('#vPro').setAttribute('aria-pressed', String(role === 'profesor'));
        $('#vAdm').setAttribute('aria-pressed', String(role === 'admin'));
        var u = $('#usr'), me0 = role === 'alumno' ? sById(meId) : null;
        if (me0) {
            var g0 = gById(me0.grupo);
            u.innerHTML = '<span><b>' + esc(me0.nombre) + '</b><small>' + esc(g0 ? g0.n : 'Sin grupo') + '</small></span>' + face(me0.id, me0.nombre);
            u.setAttribute('aria-label', 'Mi perfil: ' + me0.nombre + (g0 ? ', ' + g0.n : ''));
            u.hidden = false;
        }
        else {
            var nombre = role === 'admin' ? 'Administrador' : 'Ana Martínez';
            u.innerHTML = '<span><b>' + nombre + '</b><small>' + (role === 'admin' ? 'Administración' : 'Profesora') + '</small></span>' + face(role === 'admin' ? 104 : 101, nombre, true);
            u.hidden = false;
        }
        var w = $('#who');
        if (role === 'alumno') {
            w.innerHTML = '<label for="sel" style="display:flex;gap:8px;align-items:center">Ver como <select id="sel">' +
                students.map(function (s) { return '<option value="' + s.id + '"' + (s.id === meId ? ' selected' : '') + '>' + esc(s.nombre) + '</option>'; }).join('') + '</select></label>';
        }
        else
            w.innerHTML = 'Sesión: <b>' + (role === 'admin' ? 'Administrador/a del simulador' : 'Profesor/a') + '</b>';
    }
    /* ---------- ALUMNO ---------- */
    function viewAlumno() {
        var s = sById(meId);
        if (!s) {
            app.innerHTML = '<div class="card empty">Este alumno ya no existe. Elige otro en el selector.</div>';
            return;
        }
        var g = gById(s.grupo), mem = g ? members(g.id) : [];
        app.innerHTML = intro('Hola, ' + esc(s.nombre.split(' ')[0]) + '. Aquí ves tus datos y con quién trabajas.') + '<div class="grid g2">' +
            '<section class="card" aria-labelledby="pt"><div class="prof"><div class="avatar b-' + s.ciclo + '">' + face(s.id, s.nombre) + '</div>' +
            '<div><h2 id="pt">' + esc(s.nombre) + '</h2><div>' + (g ? '<span class="badge b-c">' + esc(g.n) + '</span>' : '') + '</div></div></div>' +
            '<dl>' +
            '<dt>Correo</dt><dd>' + esc(s.email) + '</dd><dt>Teléfono</dt><dd>' + esc(s.tel) + '</dd>' +
            '<dt>Alta</dt><dd>' + fmt(s.alta) + '</dd></dl>' +
            '<div class="row" style="justify-content:flex-start;margin-top:16px"><button class="btn ghost" data-a="editme">Editar mis datos</button></div></section>' +
            '<section class="card" aria-labelledby="gt"><h2 id="gt">Mi grupo de trabajo</h2>' +
            (g ? '<p style="margin:0 0 12px"><b>' + esc(g.n) + '</b> · ' + mem.length + ' alumnos</p><ul class="members">' +
                mem.map(function (m) { return '<li class="' + (m.id === s.id ? 'me' : '') + '"><span class="avatar b-' + m.ciclo + '">' + face(m.id, m.nombre) + '</span><span>' + esc(m.nombre) + (m.id === s.id ? ' (tú)' : '') + '</span></li>'; }).join('') + '</ul>'
                : '<p class="empty">Todavía no tienes grupo. El profesor te asignará uno.</p>') +
            '</section></div>' +
            '<section class="card" style="margin-top:16px" aria-labelledby="rt"><h2 id="rt">Escudería de Resistencia</h2>' +
            '<p style="margin:0 0 12px;color:var(--muted)">Consulta la ronda que toca gestionar y los resultados de la anterior.</p>' +
            '<a class="btn" style="display:inline-flex;align-items:center;text-decoration:none" href="index.html">Ir a la ronda actual</a></section>';
    }
    /* ---------- PROFESOR ---------- */
    function alerts() {
        var out = '', sin = students.filter(function (x) { return !x.grupo; }).length;
        var inc = groups.filter(function (g) { return members(g.id).length < MIN; }).length;
        if (sin)
            out += '<div class="alert" role="status"><span><b>' + sin + (sin === 1 ? ' alumno no tiene' : ' alumnos no tienen') + ' grupo de trabajo.</b> Asígnalo desde la tabla de alumnos.</span><button class="btn sm" data-tab="alumnos">Ver alumnos</button></div>';
        if (inc)
            out += '<div class="alert" role="status"><span><b>' + inc + (inc === 1 ? ' grupo tiene' : ' grupos tienen') + ' menos de ' + MIN + ' alumnos.</b> Añade alumnos para completarlos.</span><button class="btn sm" data-tab="grupos">Ver grupos</button></div>';
        return out;
    }
    function viewProfe() {
        var tabs = '<div class="vista tabs" role="group" aria-label="Secciones"><button data-tab="alumnos" aria-pressed="' + (tab === 'alumnos') + '">Alumnos</button><button data-tab="grupos" aria-pressed="' + (tab === 'grupos') + '">Grupos de trabajo</button><button data-tab="carreras" aria-pressed="' + (tab === 'carreras') + '">Carreras</button></div>';
        var sinG = students.filter(function (s) { return !s.grupo; }).length;
        var stats = '<div class="stats">' +
            '<div class="stat"><b>' + students.length + '</b><span>alumnos</span></div>' +
            CICLOS.map(function (c) { return '<div class="stat"><b>' + students.filter(function (s) { return s.ciclo === c; }).length + '</b><span>' + c + '</span></div>'; }).join('') +
            '<div class="stat"><b>' + groups.length + '</b><span>grupos</span></div>' +
            '<div class="stat"><b>' + sinG + '</b><span>sin grupo</span></div></div>';
        app.innerHTML = intro('Desde aquí gestionas a los alumnos y sus grupos. Pulsa un grupo de la lista para ver quién está dentro.') + alerts() + profCard() + stats + tabs + (tab === 'alumnos' ? tblAlumnos() : tab === 'carreras' ? tblCarreras() : tblGrupos());
    }
    function profCard() {
        return '<section class="card pgrid" aria-labelledby="pp"><div class="prof" style="margin:0"><div class="avatar b-c">' + face(101, 'Ana', true) + '</div><div><h2 id="pp">Ana Martínez</h2><div style="color:var(--muted)">Profesora · ana.martinez@centro.cat</div></div></div>' + '<div><h2>Grupos de trabajo</h2><p style="color:var(--muted)">Consulta y gestiona los equipos de alumnos.</p><button class="btn ghost sm" data-tab="grupos">Ver grupos</button></div></section>';
    }
    function tblAlumnos() {
        var list = students.filter(function (s) {
            return (!fCiclo || s.ciclo === fCiclo) && (!fQ || (s.nombre + ' ' + s.email).toLowerCase().indexOf(fQ.toLowerCase()) > -1);
        });
        var tools = '<div class="tools"><input class="grow" id="q" type="search" placeholder="Buscar por nombre o correo" aria-label="Buscar" value="' + esc(fQ) + '">' +
            '<select id="fc" aria-label="Filtrar por ciclo"><option value="">Todos los ciclos</option>' + CICLOS.map(function (c) { return '<option' + (c === fCiclo ? ' selected' : '') + '>' + c + '</option>'; }).join('') + '</select>' +
            '<button class="btn" data-a="newS">Añadir alumno</button></div>';
        var rows = list.map(function (s) {
            var g = gById(s.grupo);
            return '<tr><td><div style="display:flex;gap:10px;align-items:center"><span class="avatar" style="width:36px;height:36px">' + face(s.id, s.nombre) + '</span><span><b>' + esc(s.nombre) + '</b><br><small style="color:var(--muted)">' + esc(s.email) + '</small></span></div></td><td>' + cb(s.ciclo) + '</td><td><select data-asg="' + s.id + '" aria-label="Grupo de trabajo de ' + esc(s.nombre) + '">' + groupOpts(s.grupo, s.id) + '</select></td>' +
                '<td class="act"><button class="btn ghost sm" data-a="editS" data-id="' + s.id + '">Editar</button> <button class="btn danger sm" data-a="delS" data-id="' + s.id + '">Eliminar</button></td></tr>';
        }).join('');
        return '<section class="card" aria-labelledby="at"><h2 id="at">Todos los alumnos (' + list.length + ')</h2>' + tools +
            (list.length ? '<div class="tablewrap"><table><thead><tr><th>Alumno</th><th>Ciclo</th><th>Grupo de trabajo</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>' : '<p class="empty">Ningún alumno coincide con los filtros.</p>') + '</section>';
    }
    function tblCarreras() {
        var rows = RONDAS.map(function (r, i) { return '<tr><td>' + (i + 1) + '</td><td><b>' + esc(r[0]) + '</b></td><td>' + esc(r[1]) + '</td></tr>'; }).join('');
        return '<section class="card"><h2>Carreras de la temporada</h2><p>6 carreras · 18 rondas</p><div class="tablewrap"><table><thead><tr><th>Ronda</th><th>Carrera o fase</th><th>Tramo</th></tr></thead><tbody>' + rows + '</tbody></table></div></section>';
    }
    function tblGrupos() {
        var cards = groups.map(function (g) {
            var m = members(g.id), bad = m.length < MIN;
            return '<article class="card"><div style="display:flex;justify-content:space-between;gap:8px;align-items:start"><h2 style="margin:0">' + esc(g.n) + '</h2>' +
                '<span class="badge ' + (bad ? 'b-warn' : 'b-c') + '">' + m.length + '/' + MAX + (bad ? ' incompleto' : '') + '</span></div>' +
                (m.length ? '<ul class="members" style="margin-top:12px">' + m.map(function (s) { return '<li><span class="avatar b-' + s.ciclo + '">' + face(s.id, s.nombre) + '</span><span style="flex:1">' + esc(s.nombre) + '<small>' + esc(s.ciclo) + '</small></span><button class="btn danger sm" data-a="rmM" data-id="' + s.id + '" aria-label="Quitar a ' + esc(s.nombre) + ' del grupo">Quitar</button></li>'; }).join('') + '</ul>' : '<p class="empty">Grupo vacío.</p>') +
                '<div class="row" style="justify-content:flex-start;margin-top:12px"><button class="btn sm" data-a="addM" data-id="' + g.id + '"' + (m.length >= MAX ? ' disabled title="El grupo está completo"' : '') + '>Añadir alumno</button><button class="btn ghost sm" data-a="renG" data-id="' + g.id + '">Renombrar</button><button class="btn danger sm" data-a="delG" data-id="' + g.id + '">Eliminar</button></div></article>';
        }).join('');
        return '<div class="tools"><h2 style="margin:0" class="grow">Grupos de trabajo (de ' + MIN + ' a ' + MAX + ' alumnos)</h2><button class="btn" data-a="newG">Crear grupo</button></div>' +
            (groups.length ? '<div class="groups">' + cards + '</div>' : '<p class="empty">No hay grupos. Crea el primero.</p>');
    }
    /* ---------- DIALOGOS ---------- */
    function open(html, onSubmit) {
        frm.innerHTML = html + '<p class="err" id="err" role="alert"></p>';
        frm.onsubmit = function (e) {
            e.preventDefault();
            var ok = onSubmit(new FormData(frm));
            if (ok !== false) {
                dlg.close();
                render();
            }
        };
        var cancel = frm.querySelector('[data-cancel]');
        if (cancel)
            cancel.onclick = function () { dlg.close(); };
        dlg.showModal();
        var fi = frm.querySelector('input,select');
        if (fi)
            fi.focus();
    }
    function actions(label) { return '<div class="row"><button type="button" class="btn ghost" data-cancel>Cancelar</button><button class="btn" type="submit">' + label + '</button></div>'; }
    function err(m) { $('#err').textContent = m; return false; }
    function groupOpts(sel, exceptId) {
        return '<option value="">Sin grupo</option>' + groups.map(function (g) {
            var n = members(g.id).filter(function (m) { return m.id !== exceptId; }).length;
            return '<option value="' + g.id + '"' + (g.id === sel ? ' selected' : '') + (n >= MAX ? ' disabled' : '') + '>' + esc(g.n) + ' (' + n + '/' + MAX + ')' + (n >= MAX ? ' · completo' : '') + '</option>';
        }).join('');
    }
    function studentForm(s0) {
        var isNew = !s0;
        var s = s0 || { id: 0, nombre: '', email: '', tel: '', ciclo: 'DAM', clase: 1, grupo: null, alta: '' };
        open('<h2>' + (isNew ? 'Añadir alumno' : 'Editar alumno') + '</h2>' +
            '<label>Nombre completo<input name="nombre" required value="' + esc(s.nombre) + '"></label>' +
            '<label>Correo<input name="email" type="email" required value="' + esc(s.email) + '"></label>' +
            '<label>Teléfono<input name="tel" inputmode="tel" value="' + esc(s.tel) + '"></label>' +
            '<label>Ciclo<select name="ciclo">' + CICLOS.map(function (c) { return '<option' + (c === s.ciclo ? ' selected' : '') + '>' + c + '</option>'; }).join('') + '</select></label>' +
            '<label>Grupo de trabajo<select name="grupo">' + groupOpts(s.grupo, s.id) + '</select></label>' + actions(isNew ? 'Añadir alumno' : 'Guardar cambios'), function (f) {
            var gid = fv(f, 'grupo') ? Number(fv(f, 'grupo')) : null;
            if (gid && members(gid).filter(function (m) { return !s.id || m.id !== s.id; }).length >= MAX)
                return err('Ese grupo ya tiene ' + MAX + ' alumnos.');
            var d = { nombre: fv(f, 'nombre').trim(), email: fv(f, 'email').trim(), tel: fv(f, 'tel').trim(), ciclo: fv(f, 'ciclo'), clase: s.clase, grupo: gid };
            if (isNew) {
                students.push({ ...d, id: nextS++, alta: new Date().toISOString().slice(0, 10) });
                toast('Alumno añadido');
            }
            else {
                Object.assign(s, d);
                toast('Cambios guardados');
            }
        });
    }
    function meForm() {
        var s = sById(meId);
        open('<h2>Editar mis datos</h2><label>Correo<input name="email" type="email" required value="' + esc(s.email) + '"></label>' +
            '<label>Teléfono<input name="tel" inputmode="tel" value="' + esc(s.tel) + '"></label>' +
            '<p style="margin:0;color:var(--muted);font-size:.9rem">El ciclo y el grupo solo los cambia el profesor.</p>' + actions('Guardar cambios'), function (f) { s.email = fv(f, 'email').trim(); s.tel = fv(f, 'tel').trim(); toast('Datos guardados'); });
    }
    function addMember(gid) {
        var g = gById(gid), c = students.filter(function (s) { return s.grupo !== gid; }).sort(function (a, b) { return (a.grupo ? 1 : 0) - (b.grupo ? 1 : 0); });
        if (!c.length) {
            toast('No hay más alumnos para añadir');
            return;
        }
        open('<h2>Añadir alumno a ' + esc(g.n) + '</h2><label>Alumno<select name="s">' + c.map(function (s) { var o = gById(s.grupo); return '<option value="' + s.id + '">' + esc(s.nombre) + ' · ' + s.ciclo + (o ? ' (se moverá de ' + esc(o.n) + ')' : ' (sin grupo)') + '</option>'; }).join('') + '</select></label>' + actions('Añadir al grupo'), function (f) {
            if (members(gid).length >= MAX)
                return err('El grupo ya tiene ' + MAX + ' alumnos.');
            sById(Number(fv(f, 's'))).grupo = gid;
            toast('Alumno añadido al grupo');
        });
    }
    function nameForm(title, val, cb2) {
        open('<h2>' + title + '</h2><label>Nombre del grupo<input name="n" required value="' + esc(val) + '"></label>' + actions('Guardar'), function (f) { cb2(fv(f, 'n').trim()); toast('Grupo guardado'); });
    }
    function confirmBox(title, text, label, fn) {
        open('<h2>' + title + '</h2><p style="margin:0">' + text + '</p>' + actions(label), function () { snap(); fn(); toast('Hecho. Si te has equivocado, puedes deshacerlo.', true); });
    }
    /* ---------- EVENTOS ---------- */
    document.addEventListener('click', function (e) {
        var t = e.target.closest('button');
        if (!t)
            return;
        if (t.id === 'vAlu') {
            role = 'alumno';
            render();
            return;
        }
        if (t.id === 'vPro') {
            role = 'profesor';
            render();
            return;
        }
        if (t.dataset.tab) {
            tab = t.dataset.tab;
            render();
            return;
        }
        var a = t.dataset.a, id = Number(t.dataset.id);
        if (a === 'editme')
            meForm();
        else if (a === 'newS')
            studentForm();
        else if (a === 'editS')
            studentForm(sById(id));
        else if (a === 'delS') {
            var s = sById(id);
            confirmBox('Eliminar alumno', '¿Eliminar a <b>' + esc(s.nombre) + '</b>? Esta acción no se puede deshacer.', 'Eliminar alumno', function () { students = students.filter(function (x) { return x.id !== id; }); });
        }
        else if (a === 'addM')
            addMember(id);
        else if (a === 'rmM') {
            snap();
            var rs = sById(id);
            rs.grupo = null;
            render();
            toast('Alumno quitado del grupo', true);
        }
        else if (a === 'newG')
            nameForm('Crear grupo', 'Grupo ' + (groups.length + 1), function (n) { groups.push({ id: nextG++, n: n, t: null, coche: '' }); });
        else if (a === 'renG') {
            var g = gById(id);
            nameForm('Renombrar grupo', g.n, function (n) { g.n = n; });
        }
        else if (a === 'delG') {
            var g2 = gById(id), c = members(id).length;
            confirmBox('Eliminar grupo', '¿Eliminar <b>' + esc(g2.n) + '</b>?' + (c ? ' Sus ' + c + ' alumnos quedarán sin grupo.' : ''), 'Eliminar grupo', function () {
                students.forEach(function (s) {
                    if (s.grupo === id)
                        s.grupo = null;
                });
                groups = groups.filter(function (x) { return x.id !== id; });
            });
        }
    });
    document.addEventListener('change', function (e) {
        var t = e.target;
        if (t.id === 'sel') {
            meId = Number(t.value);
            render();
        }
        else if (t.id === 'fc') {
            fCiclo = t.value;
            render();
        }
        else if (t.id === 'fk') {
            fClase = t.value;
            render();
        }
    });
    document.addEventListener('input', function (e) {
        var el = e.target;
        if (el.id === 'q') {
            fQ = el.value;
            var p = el.selectionStart;
            render();
            var q = $('#q');
            q.focus();
            q.setSelectionRange(p, p);
        }
    });
    /* ---------- ADMIN: simulador GT ---------- */
    var TUT = [{ id: 1, n: 'Ana Martínez', e: 'ana.martinez@centro.cat', c: 'DAM, DAW' }, { id: 2, n: 'Carlos Ibáñez', e: 'carlos.ibanez@centro.cat', c: 'ASIX' }, { id: 3, n: 'Rosa Pons', e: 'rosa.pons@centro.cat', c: 'DAW, ASIX' }];
    var COCHES = ['Porsche 911 GT3 R', 'Ferrari 296 GT3', 'Mercedes-AMG GT3', 'BMW M4 GT3', 'Audi R8 LMS GT3', 'Lamborghini Huracán GT3'];
    var RONDAS = [["Entrega de la escudería", "Declara tu estrategia y puja por pilotos"], ["Test oficial", "Llegan patrocinadores y fichajes"], ["6 Horas de Prometeo", "Tramo 1 · 0 a 3 h"], ["6 Horas de Prometeo", "Tramo 2 · 3 a 6 h"], ["12 Horas Quantum Race", "Tramo 1 · 0 a 6 h"], ["12 Horas Quantum Race", "Tramo 2 · 6 a 12 h"], ["6 Horas de las Ardenas", "Tramo 1 · 0 a 3 h"], ["6 Horas de las Ardenas", "Tramo 2 · 3 a 6 h"], ["Junta de patrocinadores", "Revisa el plan y el mercado de verano"], ["8 Horas de Eifel", "Tramo 1 · 0 a 4 h"], ["8 Horas de Eifel", "Tramo 2 · 4 a 8 h"], ["10 Horas del Atardecer", "Tramo 1 · 0 a 5 h"], ["10 Horas del Atardecer", "Tramo 2 · 5 a 10 h"], ["24 Horas del Mare Nostrum", "Preparación de la final"], ["24 Horas del Mare Nostrum", "Tramo 1 · 0 a 8 h"], ["24 Horas del Mare Nostrum", "Tramo 2 · 8 a 16 h"], ["24 Horas del Mare Nostrum", "Tramo 3 · 16 a 24 h"], ["Cierre del ejercicio", "Memoria y defensa ante el consejo"]];
    var PART = [], nextP = 1, nextT = 10, aTab = 'partidas';
    groups.forEach(function (g, i) { g.t = TUT[i % 3].id; g.coche = COCHES[i % COCHES.length]; });
    function addDays(d, n) { var x = new Date(d + 'T12:00:00'); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); }
    function gen(d) { return RONDAS.map(function (r, i) { return { n: i + 1, f: addDays(d.inicio, i * d.cada), nombre: r[0], tramo: r[1] }; }); }
    function mkPart(d) { PART.push(Object.assign({}, d, { nr: 18, id: nextP++, rondas: gen(d) })); }
    mkPart({ nombre: 'Temporada 1', nr: 18, inicio: '2026-12-07', cada: 7, estado: 'Abierta' });
    mkPart({ nombre: 'Temporada 2', nr: 18, inicio: '2027-01-11', cada: 14, estado: 'Borrador' });
    function pById(id) { return PART.filter(function (p) { return p.id === id; })[0]; }
    function tById(id) { return TUT.filter(function (t) { return t.id === id; })[0]; }
    function tn(id) { var t = tById(id); return t ? t.n : 'Sin tutor'; }
    function opt(a, v) { return a.map(function (x) { return `<option${x === v ? ' selected' : ''}>${x}</option>`; }).join(''); }
    var INTROS = {
        partidas: 'Cada partida tiene 18 rondas. Configura su nombre y sus fechas.',
        calendario: 'Puedes modificar las fechas, pero el calendario de carreras es fijo.',
        tutores: 'Los tutores son los profesores que acompañan a los equipos.',
        equipos: 'Un equipo son 2 o 3 alumnos que gestionan una escudería.'
    };
    function viewAdmin() {
        var tb = [['partidas', 'Partidas'], ['calendario', 'Calendario'], ['tutores', 'Tutores'], ['equipos', 'Equipos']].map(function (x) { return `<button data-atab="${x[0]}" aria-pressed="${aTab === x[0]}">${x[1]}</button>`; }).join('');
        var nr = PART.reduce(function (a, p) { return a + p.rondas.length; }, 0);
        var st = `<div class="stats"><div class="stat"><b>${PART.length}</b><span>partidas</span></div><div class="stat"><b>${nr}</b><span>rondas</span></div><div class="stat"><b>${TUT.length}</b><span>tutores</span></div><div class="stat"><b>${groups.length}</b><span>equipos</span></div></div>`;
        app.innerHTML = intro(INTROS[aTab]) + st + `<div class="vista tabs" role="group" aria-label="Secciones de administración">${tb}</div>` + (aTab === 'partidas' ? aPart() : aTab === 'calendario' ? aCal() : aTab === 'tutores' ? aTut() : aEq());
    }
    function aPart() {
        var c = PART.map(function (p) {
            var cls = p.estado === 'Abierta' ? 'b-ASIX' : p.estado === 'Finalizada' ? 'b-DAM' : 'b-c';
            return `<article class="card"><div style="display:flex;justify-content:space-between;gap:8px;align-items:start"><h2 style="margin:0">${esc(p.nombre)}</h2><span class="badge ${cls}">${p.estado}</span></div><dl style="margin-top:12px"><dt>Rondas</dt><dd>${p.rondas.length}, cada ${p.cada} días desde el ${fmt(p.inicio)}</dd></dl><div class="row" style="justify-content:flex-start;margin-top:12px"><button class="btn ghost sm" data-ad="editP" data-id="${p.id}">Editar</button><button class="btn danger sm" data-ad="delP" data-id="${p.id}">Eliminar</button></div></article>`;
        }).join('');
        return `<div class="tools"><h2 class="grow" style="margin:0">Partidas</h2><button class="btn" data-ad="newP">Crear partida</button></div>` + (PART.length ? `<div class="groups">${c}</div>` : '<p class="empty">No hay partidas. Crea la primera.</p>');
    }
    function aCal() {
        var rows = [];
        PART.forEach(function (p) { p.rondas.forEach(function (r) { rows.push({ p: p, r: r }); }); });
        rows.sort(function (a, b) { return a.r.f < b.r.f ? -1 : a.r.f > b.r.f ? 1 : 0; });
        var h = rows.map(function (x) { return `<tr><td><input type="date" data-cal="f" data-p="${x.p.id}" data-r="${x.r.n}" value="${x.r.f}" aria-label="Fecha de la ronda"><br><small style="color:var(--muted)">${dayName(x.r.f)}</small></td><td>${esc(x.p.nombre)}<br><small style="color:var(--muted)">Ronda ${x.r.n} de ${x.p.rondas.length}</small></td><td><b>${esc(x.r.nombre)}</b><br><small>${esc(x.r.tramo)}</small></td></tr>`; }).join('');
        return `<section class="card"><h2>Calendario de rondas</h2>` + (rows.length ? `<div class="tablewrap"><table><thead><tr><th>Fecha</th><th>Partida</th><th>Carrera o fase</th></tr></thead><tbody>${h}</tbody></table></div>` : '<p class="empty">Sin rondas. Crea una partida para generar el calendario.</p>') + `</section>`;
    }
    function aTut() {
        var h = TUT.map(function (t) { var n = groups.filter(function (g) { return g.t === t.id; }).length; return `<tr><td style="display:flex;gap:10px;align-items:center"><span class="avatar" style="width:36px;height:36px">${face(100 + t.id, t.n, true)}</span><span><b>${esc(t.n)}</b><br><small style="color:var(--muted)">${esc(t.e)}</small></span></td><td>${esc(t.c)}</td><td>${n} equipos</td><td class="act"><button class="btn ghost sm" data-ad="editT" data-id="${t.id}">Editar</button> <button class="btn danger sm" data-ad="delT" data-id="${t.id}">Dar de baja</button></td></tr>`; }).join('');
        return `<section class="card"><div class="tools"><h2 class="grow" style="margin:0">Tutores</h2><button class="btn" data-ad="newT">Dar de alta tutor</button></div>` + (TUT.length ? `<div class="tablewrap"><table><thead><tr><th>Tutor</th><th>Ciclos</th><th>Equipos</th><th></th></tr></thead><tbody>${h}</tbody></table></div>` : '<p class="empty">No hay tutores.</p>') + `</section>`;
    }
    function aEq() {
        var c = groups.map(function (g) { var m = members(g.id); return `<article class="card"><div style="display:flex;justify-content:space-between;gap:8px"><h2 style="margin:0">${esc(g.n)}</h2><span class="badge b-c">${m.length}/${MAX} alumnos</span></div><dl style="margin-top:12px"><dt>Coche</dt><dd>${esc(g.coche || 'Sin asignar')}</dd><dt>Tutor</dt><dd>${esc(tn(g.t))}</dd></dl><p style="color:var(--muted);margin:8px 0 0;font-size:.9rem">${m.map(function (s) { return esc(s.nombre); }).join(', ') || 'Sin alumnos'}</p><div class="row" style="justify-content:flex-start;margin-top:12px"><button class="btn ghost sm" data-ad="editE" data-id="${g.id}">Editar</button><button class="btn danger sm" data-ad="delE" data-id="${g.id}">Eliminar</button></div></article>`; }).join('');
        return `<div class="tools"><h2 class="grow" style="margin:0">Equipos</h2><button class="btn" data-ad="newE">Dar de alta equipo</button></div>` + (groups.length ? `<div class="groups">${c}</div>` : '<p class="empty">No hay equipos.</p>');
    }
    function pForm(p0) {
        var n = !p0;
        var p = p0 || { id: 0, rondas: [], nombre: '', nr: 18, inicio: new Date().toISOString().slice(0, 10), cada: 7, estado: 'Borrador' };
        open(`<h2>${n ? 'Crear partida' : 'Editar partida'}</h2><label>Nombre<input name="nombre" required value="${esc(p.nombre)}"></label><label>Número de rondas<input name="nr" value="18" readonly><small class="hint">Temporada completa de 18 rondas.</small></label><label>Fecha de la primera ronda<input name="inicio" type="date" required value="${p.inicio}"></label><label>Días entre rondas<input name="cada" type="number" min="1" max="90" required value="${p.cada}"><small class="hint">Por ejemplo, 7 significa una ronda cada semana.</small></label><label>Estado<select name="estado">${opt(['Borrador', 'Abierta', 'Finalizada'], p.estado)}</select><small class="hint">Borrador: aún se está preparando. Abierta: en marcha. Finalizada: terminada.</small></label>` + actions(n ? 'Crear partida' : 'Guardar cambios'), function (f) {
            var d = { nombre: fv(f, 'nombre').trim(), nr: 18, inicio: fv(f, 'inicio'), cada: Number(fv(f, 'cada')), estado: fv(f, 'estado') };
            if (n) {
                mkPart(d);
                toast('Partida creada');
            }
            else {
                var ch = d.nr !== p.rondas.length || d.inicio !== p.inicio || d.cada !== p.cada;
                Object.assign(p, d);
                if (ch)
                    p.rondas = gen(d);
                toast('Cambios guardados');
            }
        });
    }
    function tForm(t0) {
        var n = !t0;
        var t = t0 || { id: 0, n: '', e: '', c: '' };
        open(`<h2>${n ? 'Dar de alta tutor' : 'Editar tutor'}</h2><label>Nombre completo<input name="n" required value="${esc(t.n)}"></label><label>Correo<input name="e" type="email" required value="${esc(t.e)}"></label><label>Ciclos que tutoriza<input name="c" placeholder="DAM, DAW" value="${esc(t.c)}"></label>` + actions(n ? 'Dar de alta' : 'Guardar cambios'), function (f) {
            var d = { n: fv(f, 'n').trim(), e: fv(f, 'e').trim(), c: fv(f, 'c').trim() };
            if (n) {
                TUT.push({ ...d, id: nextT++ });
                toast('Tutor dado de alta');
            }
            else {
                Object.assign(t, d);
                toast('Cambios guardados');
            }
        });
    }
    function eForm(g0) {
        var n = !g0;
        var g = g0 || { id: 0, n: 'Equipo ' + (groups.length + 1), coche: COCHES[0], t: TUT.length ? TUT[0].id : null };
        open(`<h2>${n ? 'Dar de alta equipo' : 'Editar equipo'}</h2><label>Nombre del equipo<input name="n" required value="${esc(g.n)}"></label><label>Coche<select name="coche">${opt(COCHES, g.coche)}</select></label><label>Tutor<select name="t"><option value="">Sin tutor</option>${TUT.map(function (t) { return `<option value="${t.id}"${t.id === g.t ? ' selected' : ''}>${esc(t.n)}</option>`; }).join('')}</select></label><p style="margin:0;color:var(--muted);font-size:.9rem">Los alumnos del equipo (2 o 3 alumnos) los asigna el profesor.</p>` + actions(n ? 'Dar de alta' : 'Guardar cambios'), function (f) {
            var d = { n: fv(f, 'n').trim(), coche: fv(f, 'coche'), t: fv(f, 't') ? Number(fv(f, 't')) : null };
            if (n) {
                groups.push({ ...d, id: nextG++ });
                toast('Equipo dado de alta');
            }
            else {
                Object.assign(g, d);
                toast('Cambios guardados');
            }
        });
    }
    document.addEventListener('click', function (e) {
        var t = e.target.closest('button');
        if (!t)
            return;
        if (t.id === 'vAdm') {
            role = 'admin';
            render();
            return;
        }
        if (t.dataset.atab) {
            aTab = t.dataset.atab;
            render();
            return;
        }
        var a = t.dataset.ad, id = Number(t.dataset.id);
        if (!a)
            return;
        if (a === 'newP')
            pForm();
        else if (a === 'editP')
            pForm(pById(id));
        else if (a === 'delP') {
            var p = pById(id);
            confirmBox('Eliminar partida', '¿Eliminar <b>' + esc(p.nombre) + '</b> y sus ' + p.rondas.length + ' rondas?', 'Eliminar partida', function () { PART = PART.filter(function (x) { return x.id !== id; }); });
        }
        else if (a === 'newT')
            tForm();
        else if (a === 'editT')
            tForm(tById(id));
        else if (a === 'delT') {
            var u = tById(id);
            confirmBox('Dar de baja tutor', '¿Dar de baja a <b>' + esc(u.n) + '</b>? Sus equipos quedarán sin tutor.', 'Dar de baja', function () {
                groups.forEach(function (g) {
                    if (g.t === id)
                        g.t = null;
                });
                TUT = TUT.filter(function (x) { return x.id !== id; });
            });
        }
        else if (a === 'newE')
            eForm();
        else if (a === 'editE')
            eForm(gById(id));
        else if (a === 'delE') {
            var g = gById(id);
            confirmBox('Eliminar equipo', '¿Eliminar <b>' + esc(g.n) + '</b>? Sus alumnos quedarán sin equipo.', 'Eliminar equipo', function () {
                students.forEach(function (s) {
                    if (s.grupo === id)
                        s.grupo = null;
                });
                groups = groups.filter(function (x) { return x.id !== id; });
            });
        }
    });
    document.addEventListener('change', function (e) {
        var t = e.target;
        if (!t.dataset.cal)
            return;
        var p = pById(Number(t.dataset.p)), r = p.rondas.filter(function (x) { return x.n === Number(t.dataset.r); })[0];
        if (t.dataset.cal === 'f') {
            if (!t.value)
                return;
            r.f = t.value;
        }
        render();
        toast('Calendario actualizado');
    });
    document.addEventListener('change', function (e) {
        var t = e.target;
        if (!t.dataset.asg)
            return;
        snap();
        sById(Number(t.dataset.asg)).grupo = t.value ? Number(t.value) : null;
        render();
        toast('Grupo actualizado', true);
    });
    function render() { document.querySelectorAll('#main-menu [data-tab], #main-menu [data-atab]').forEach(function (a) { if (a.getAttribute('data-tab') === tab || a.getAttribute('data-atab') === aTab)
        a.setAttribute('aria-current', 'page');
    else
        a.removeAttribute('aria-current'); }); head(); role === 'alumno' ? viewAlumno() : role === 'admin' ? viewAdmin() : viewProfe(); }
    render();
})();
