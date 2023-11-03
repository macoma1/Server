const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db.config');
const userRoutes = require('./routes/user.routes');
const errorMiddleware = require('./middlewares/error.middleware');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());

const allowedOrigins = ['http://localhost:4200', 'http://localhost','https://videogames-3ce93.web.app'];
app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'La política de CORS para este sitio no permite acceso desde el origen especificado.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));


connectDB();

app.use(userRoutes);



app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
