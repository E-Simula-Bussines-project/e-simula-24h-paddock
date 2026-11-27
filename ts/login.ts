(function () {
    const form = document.querySelector<HTMLFormElement>('#login')!;
    const usuario = document.querySelector<HTMLInputElement>('#user')!;
    const password = document.querySelector<HTMLInputElement>('#pass')!;
    const error = document.querySelector<HTMLElement>('#error')!;
    const destinos: Record<Rol, string> = { alumno: 'index.html', profesor: 'pages/profesor.html', admin: 'pages/admin.html' };
    sessionStorage.removeItem('paddock-rol');
    form.addEventListener('submit', (e: SubmitEvent) => {
        e.preventDefault();
        const rol = usuario.value.trim().toLowerCase();
        if (!Object.prototype.hasOwnProperty.call(destinos, rol) || password.value !== '1234') {
            error.hidden = false;
            return;
        }
        sessionStorage.setItem('paddock-rol', rol);
        location.href = new URL(destinos[rol as Rol], document.baseURI).href;
    });
})();
