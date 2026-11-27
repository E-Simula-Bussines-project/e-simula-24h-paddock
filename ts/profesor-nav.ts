document.querySelectorAll('#main-menu [data-tab]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); var b = document.querySelector<HTMLButtonElement>('#app button[data-tab="' + a.getAttribute('data-tab') + '"]'); if (b)
    b.click(); }); });
