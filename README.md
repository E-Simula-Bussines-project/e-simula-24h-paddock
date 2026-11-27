# Portal de clase · DAM, DAW y ASIX

PWA estática publicada con GitHub Pages: https://e-simula-bussines-project.github.io/e-simula-24h-paddock/

Al cambiar archivos, sube `VERSION` en `sw.js` para renovar la caché offline.

## Prototipo TypeScript

```bash
npm install
npm run build
python3 -m http.server 8080
```

Abre http://localhost:8080/login.html. Usuarios de prueba: alumno, profesor y admin; contraseña 1234. El login es una simulación, no autenticación real. Editar los archivos de `ts/` y compilar; `js/` contiene el JavaScript para el navegador y GitHub Pages. Los datos siguen siendo ficticios y no se sincronizan entre usuarios. `npm run check` comprueba los tipos. TypeScript utiliza modo no estricto.
