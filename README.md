# EL ESENSIAL · Simulador de financiamiento + Inventario

App web autocontenida (un solo `index.html`, sin backend) para el lote de autos **EL ESENSIAL**.

## Qué incluye
- 🔒 **Acceso con contraseña** (pantalla de login).
- 🧮 **Simulador de financiamiento** — enganche, descuento/bonificación, plazo, tasa, seguro/GPS/comisión (de contado, financiado o mensual), cargo por atraso, tabla de amortización y resumen para WhatsApp.
- 🚗 **Inventario de coches editable** — agregar/editar/borrar autos (con foto), y botón **Simular** que carga el auto en el simulador.
- Logo **EL ESENSIAL** en el login, en la barra izquierda y en la portada.

## Contraseña
La contraseña **no** está en texto plano en el código: se guarda su hash SHA-256.
Contraseña actual: **`esensial2026`** (cámbiala pidiéndomelo y recalculo el hash en `CLAVE_HASH`).

> Nota de seguridad: al ser un sitio estático, esto es una barrera básica (disuade el acceso casual), no seguridad de servidor. Para control real de usuarios se necesitaría backend.

## Publicación
Pensado para **GitHub Pages**. El archivo raíz `index.html` se sirve tal cual.

Hecho por **Fiborti Analytics**.
