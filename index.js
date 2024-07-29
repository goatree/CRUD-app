import dotenv from 'dotenv'
import express, { json, urlencoded } from 'express';
import { connect } from 'mongoose';
import authRoutes from './routes/authentication.js';
import productRoutes from './routes/product.js'
import cookieParser from 'cookie-parser'
import path from "path";
import url from "url";
import multer from 'multer';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 8000;

app.use(json());
app.use(urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(cookieParser());
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use('/',authRoutes)
app.use('/products',productRoutes)

const connectDb = () => {
    connect(process.env.MONGO_URL)
      .then(() => {
        console.log("MongoDB Connection established");
        app.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
        });
      })
      .catch((err) => console.log(err));
  };


app.get("/", (req, res) => {
  res.render("home");
});


connectDb();
