# Ilustrador ACS — Sacrificio y Admin Charge

Página estática que muestra, para una prima y un término dados, cómo se mueven
juntos el **sacrificio de comisión**, la **comisión upfront del asesor** y el
**admin charge anual**. Se edita cualquiera de los tres y los otros dos se
recalculan.

Publicada con GitHub Pages desde la raíz de `main`.

## Estructura

```
index.html          markup de la página
assets/styles.css   estilos (claro/oscuro)
assets/data.js      TODOS los números publicados — es lo único que se toca
assets/app.js       lógica: interpolación, cálculo y gráfico
assets/gate.js      pantalla de contraseña
```

Sin build ni dependencias: se abre `index.html` y funciona (también con doble
clic, sin servidor).

## Cambiar los números

Todo vive en [`assets/data.js`](assets/data.js):

| Constante | Qué es |
|---|---|
| `AC0` / `AC100` | admin charge anual por término, con 0% y 100% de sacrificio |
| `MATRIX` | matriz publicada de admin charge (sacrificio × término) |
| `LEVELS` | escala de comisión de la estructura, fija |
| `DEFAULT_LEVEL` | nivel que viene seleccionado al abrir |
| `PRIMA_MIN` / `PRIMA_MAX` | rango de prima admitido |

### Escala de comisión

Cada nivel trae su `pct` (el % que le corresponde en la estructura) y su `acs`:
la comisión upfront máxima —sin sacrificio— como % de la prima, a **3, 5, 8 y
10 años**. Entre esos términos se interpola con una curva monótona (pchip), así
que en 3, 5, 8 y 10 los valores dan exactos y en el medio no hay saltos ni
sobrepasos.

```js
{n:15, pct:85, acs:[5.00, 7.00, 7.50, 7.90]}
```

El cálculo es:

```
Comisión upfront = ACS(nivel, término) × Prima × (1 − Sacrificio%)
Admin charge     = interpolación entre AC0 y AC100 según el sacrificio
```

## Cambiar la contraseña

En [`assets/gate.js`](assets/gate.js) se guarda el SHA-256 de la clave. Para
cambiarla:

```bash
printf %s "nuevaClave" | sha256sum
```

y se pega el hash en la constante `HASH`.

> **No es seguridad real.** El sitio es público: todo el HTML y el JS se
> descargan antes de pedir la clave, así que cualquiera que mire el código
> fuente o borre el `<div id="gate">` desde el inspector ve el ilustrador
> completo. El hash sólo evita que la contraseña quede legible en el repo.
> Para que sea privado de verdad hay que mover el sitio a algo con
> autenticación en el servidor (Cloudflare Access, Netlify password protection,
> o Pages privado con plan Team/Enterprise).
