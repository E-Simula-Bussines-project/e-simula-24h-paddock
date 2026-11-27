# E-SIMULA 24H Paddock

Prototipo HTML, CSS y TypeScript con tres roles. Sin backend ni base de datos.

## Ejecutar

```bash
npm install
npm run build
python3 -m http.server 8080
```

Abrir http://localhost:8080/. Usuarios: `alumno`, `profesor`, `admin`. Contraseña: `1234`.

## Estructura

- `index.html`: ronda actual del alumno y entrada del sitio (redirige al login si no hay sesión).
- `pages/`: resto de pantallas HTML. `<base href="../">` permite resolver las rutas desde la raíz del proyecto, también en GitHub Pages.
- `css/`: 8 hojas de estilos. `theme`, `layout` y `menu` son compartidas; las otras cinco son de pantallas concretas.
- `ts/`: código que editamos. `perfil.ts` comparte la gestión de alumnos, profesor y administrador; `types.ts` define tipos e interfaces.
- `js/`: JavaScript compilado, no se edita a mano. Se incluye en GitHub Pages porque el navegador ejecuta JavaScript.
- `assets/`, `icons/`: imágenes e iconos.
- `sw.js`, `manifest.webmanifest`: PWA. Actualizar la versión de caché y las rutas si se añaden pantallas o archivos.

`npm run check` comprueba tipos; `npm run build` genera JavaScript. El modo estricto está desactivado por ahora. El login es de prueba y los datos no son persistentes ni seguros. No se ha añadido Bootstrap.
