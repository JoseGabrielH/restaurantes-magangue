# Restaurantes de Magangué

Directorio web de restaurantes de Magangué, Bolívar, Colombia.

## Estructura

- `index.html` – página principal
- `styles.css` – estilos (mínimos por ahora)
- `app.js` – lee los datos y los muestra
- `data/restaurantes.json` – **lista de restaurantes (edita aquí)**

## Cómo actualizar restaurantes

Cada restaurante debe tener **todos** estos campos (para que la información sea uniforme):

| Campo | Ejemplo |
|---|---|
| `nombre` | La Serrata Steak House |
| `tipo` | Parrilla y steak house: carnes, hamburguesas... |
| `direccion` | Cra. 15 # 16B-63, barrio San José, Magangué |
| `telefono` | 305 310 5599 |
| `horario` | Lun a Jue: 12:00 m. - 3:00 p.m. ... |
| `instagram` | laserratahouse (solo el usuario, sin @) |
| `web` | Enlace al menú o sitio web (https://...) |

1. Edita `data/restaurantes.json` (agrega, quita o cambia restaurantes).
2. Guarda y sube el cambio a GitHub:
   ```
   git add .
   git commit -m "Actualizo restaurantes"
   git push
   ```
3. Vercel publica la nueva versión automáticamente en 1–2 minutos.

## Ver en local

```
npx serve .
```
y abre http://localhost:3000
