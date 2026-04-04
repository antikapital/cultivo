const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/'))); // Serves the landing page files

// Contact Endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, service, message } = req.body;

    // 1. Validation
    if (!name || !email || !service) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // 2. Email Configuration (SMTP)
    // Replace with your real credentials in an .env file for production
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or 'outlook', or your custom SMTP
        auth: {
            user: 'antikapital@gmail.com',
            pass: 'ijvc yumv mkvw dlhy' 
        }
    });

    // 3. Email Content
    const mailOptions = {
        from: email,
        to: 'contacto@cultivodigital.mx', // Where leads will arrive
        subject: `Nueva Solicitud: ${service} - ${name}`,
        text: `Nombre: ${name}\nEmail: ${email}\nServicio: ${service}\n\nMensaje:\n${message}`,
        html: `
            <div style="font-family: sans-serif; padding: 20px; color: #191c1e;">
                <h2 style="color: #006948;">Nuevo Lead de Cultivo Digital</h2>
                <p><strong>Nombre:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Servicio:</strong> ${service}</p>
                <hr>
                <p><strong>Mensaje:</strong></p>
                <p>${message}</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.error('Nodemailer Error:', error);
        // During testing, we send 200 even if error to show UI success
        res.status(500).json({ error: 'Mail delivery failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor de Cultivo Digital corriendo en puerto ${PORT}`);
    console.log(`Visita: http://localhost:${PORT}`);
});
