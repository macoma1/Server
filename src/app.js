const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db.config");
const userRoutes = require("./routes/user.routes");
const cors = require("cors");
const commentRoutes = require("./routes/comments.routes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const allowedOrigins = "https://videogames-3ce93.web.app";

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("CORS"));
      }
    },
  })
);

connectDB();

app.use(commentRoutes);
app.use(userRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
