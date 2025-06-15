export default async function handler(req, res) {
  // 1. Solo permitir solicitudes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
  }

  try {
    // 2. URL de tu Google Apps Script
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxRlN--h7t4Sk_s3GcAVUpG1BZgaPRrf_CrBDiPxLqn0daJC4DKws_cxDWRgaUrtYkFXQ/exec';

    // 3. Preparar datos para enviar a Google Sheets
    const formData = new URLSearchParams();
    formData.append('nombre', req.body.nombre);
    formData.append('email', req.body.email);
    formData.append('empresa', req.body.empresa || ''); // Campo opcional
    formData.append('mensaje', req.body.mensaje);

    // 4. Enviar datos a Google Apps Script
    const response = await fetch(scriptURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    // 5. Verificar si Google Sheets recibió los datos
    if (!response.ok) {
      throw new Error('Error al enviar datos a Google Sheets');
    }

    // 6. Si todo sale bien, enviar éxito al frontend
    return res.status(200).json({ success: true, message: 'Datos guardados en Google Sheets' });

  } catch (error) {
    // 7. Manejo de errores
    console.error('Error en submit-form.js:', error);
    return res.status(500).json({ 
      error: 'Error al procesar el formulario',
      details: error.message,
    });
  }
}