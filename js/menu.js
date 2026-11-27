(function () { var root = document.documentElement, button = document.getElementById('menu-toggle'), nav = document.getElementById('main-menu'), backdrop = document.getElementById('menu-backdrop'), mobile = matchMedia('(max-width:700px)'), collapsed = false, open = false; try {
    collapsed = localStorage.getItem('paddock-menu-collapsed') === 'true';
}
catch (e) { } function renderMenu() { root.classList.toggle('menu-collapsed', !mobile.matches && collapsed); root.classList.toggle('menu-open', mobile.matches && open); var expanded = mobile.matches ? open : !collapsed; button.setAttribute('aria-expanded', String(expanded)); button.setAttribute('aria-label', expanded ? 'Plegar menú' : 'Desplegar menú'); button.title = expanded ? 'Plegar menú' : 'Desplegar menú'; nav.inert = mobile.matches && !open; } button.addEventListener('click', function () { if (mobile.matches)
    open = !open;
else {
    collapsed = !collapsed;
    try {
        localStorage.setItem('paddock-menu-collapsed', String(collapsed));
    }
    catch (e) { }
} renderMenu(); }); backdrop.addEventListener('click', function () { open = false; renderMenu(); button.focus(); }); nav.addEventListener('click', function (e) { if (mobile.matches && e.target.closest('a')) {
    open = false;
    renderMenu();
} }); document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mobile.matches && open) {
    open = false;
    renderMenu();
    button.focus();
} }); mobile.addEventListener('change', function () { open = false; renderMenu(); }); renderMenu(); })();
