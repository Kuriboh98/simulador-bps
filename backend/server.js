import 'dotenv/config';
import app from './app.js';
import { connectMongoDB } from './database/mongodb.js';

const PORT = process.env.PORT || 3001;

try {
    await connectMongoDB();
    app.listen(PORT, () => {
        console.log(`Simulador BPS API en http://localhost:${PORT}`);
    });
} catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
}
