(function () {
    const form = document.querySelector('#login');
    const usuario = document.querySelector('#user');
    const password = document.querySelector('#pass');
    const error = document.querySelector('#error');
    const destinos = { alumno: 'index.html', profesor: 'pages/profesor.html', admin: 'pages/admin.html' };
    sessionStorage.removeItem('paddock-rol');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const rol = usuario.value.trim().toLowerCase();
        if (!Object.prototype.hasOwnProperty.call(destinos, rol) || password.value !== '1234') {
            error.hidden = false;
            return;
        }
        sessionStorage.setItem('paddock-rol', rol);
        location.href = new URL(destinos[rol], document.baseURI).href;
    });
})();
