/**
 * EL ESENSIAL — Receptor de prospectos del cotizador web.
 * Guarda cada prospecto en una hoja de cálculo y te manda un correo de aviso.
 *
 * CÓMO INSTALARLO (2 minutos):
 *  1. Ve a https://sheets.new  → crea una hoja nueva y ponle "Prospectos El Esensial".
 *  2. Menú  Extensiones → Apps Script.
 *  3. Borra todo el código de ejemplo y pega ESTE archivo completo.
 *  4. Cambia AVISAR_A por tu correo (o déjalo vacío si no quieres correos).
 *  5. Botón  Implementar → Nueva implementación → tipo "Aplicación web".
 *       - Ejecutar como:      Yo
 *       - Quién tiene acceso: Cualquier usuario
 *  6. Copia la URL que termina en /exec
 *  7. En el panel: Cotizador público → ⚙ Ajustes → "Base de datos de prospectos (URL)" → pega la URL → Guardar.
 *
 * Listo. Cada persona que complete el cotizador aparecerá como una fila nueva.
 */

const AVISAR_A = 'agencia@fiborti.com';   // deja '' para no enviar correo
const HOJA     = 'Prospectos';

function doPost(e) {
  try {
    const L = JSON.parse(e.postData.contents);
    const sh = obtenerHoja_();

    const opciones = (L.opciones || [])
      .map(o => `${o.marca} ${o.modelo} ${o.anio || ''} — $${Number(o.precio).toLocaleString('es-MX')}` +
                (o.mensualidad ? ` (${'$' + Number(o.mensualidad).toLocaleString('es-MX')}/mes)` : ''))
      .join('\n');

    sh.appendRow([
      new Date(L.fecha || Date.now()),
      L.nombre || '',
      "'" + (L.whatsapp || ''),            // apóstrofo: conserva ceros a la izquierda
      L.presupuesto ? L.presupuesto.min : '',
      L.presupuesto ? L.presupuesto.max : '',
      L.uso || '',
      L.marca || '',
      L.pago || '',
      L.enganchePct || '',
      L.plazo || '',
      L.tasaRef || '',
      L.esquema || '',
      L.coincidenciaExacta ? 'Sí' : 'No (cercanas)',
      opciones,
      L.estado || 'nuevo'
    ]);

    if (AVISAR_A) {
      MailApp.sendEmail({
        to: AVISAR_A,
        subject: `🆕 Prospecto El Esensial: ${L.nombre || 'sin nombre'}`,
        body:
          `Nombre: ${L.nombre}\n` +
          `WhatsApp: ${L.whatsapp}\n` +
          `Presupuesto: $${L.presupuesto.min.toLocaleString('es-MX')} – $${L.presupuesto.max.toLocaleString('es-MX')}\n` +
          `Uso: ${L.uso || '—'}\nMarca: ${L.marca || '—'}\nPago: ${L.pago || '—'}\n` +
          (L.plazo ? `Enganche: ${L.enganchePct}% · Plazo: ${L.plazo} meses · Tasa ${L.tasaRef}%\n` : '') +
          `\nOpciones que vio:\n${opciones}\n`
      });
    }

    return respuesta_({ ok: true });
  } catch (err) {
    return respuesta_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return respuesta_({ ok: true, mensaje: 'Receptor de prospectos activo.' });
}

function obtenerHoja_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(HOJA);
  if (!sh) {
    sh = ss.insertSheet(HOJA);
    sh.appendRow(['Fecha','Nombre','WhatsApp','Presup. mín','Presup. máx','Uso','Marca','Pago',
                  'Enganche %','Plazo','Tasa ref.','Esquema','Coincidencia exacta','Opciones mostradas','Estado']);
    sh.getRange(1, 1, 1, 15).setFontWeight('bold').setBackground('#000').setFontColor('#fff');
    sh.setFrozenRows(1);
  }
  return sh;
}

function respuesta_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
