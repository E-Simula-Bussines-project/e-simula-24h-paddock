(function () {
    const rol = sessionStorage.getItem('paddock-rol');
    const pagina = location.pathname.split('/').pop();
    const requerido = pagina === 'profesor.html' ? 'profesor' : pagina === 'admin.html' ? 'admin' : 'alumno';
    if (rol !== requerido)
        location.replace(new URL('pages/login.html', document.baseURI).href);
})();
