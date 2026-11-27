document.querySelectorAll('#main-menu [data-atab]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); var b = document.querySelector<HTMLButtonElement>('#app button[data-atab="' + a.getAttribute('data-atab') + '"]'); if (b)
    b.click(); }); });
