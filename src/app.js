const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db.config');
const userRoutes = require('./routes/user.routes');
const cors = require('cors');
const commentRoutes = require('./routes/comments.routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());

const allowedOrigins = process.env.allowedOrigins;
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

app.use(commentRoutes);
app.use(userRoutes);



app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
