import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import imagesRoutes from "./routes/images.js";
import userRoutes from "./routes/userRoutes.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors({
    origin: ['https://frontenddd-production.up.railway.app', 'https://backendauth-production.up.railway.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", imagesRoutes);
app.use("/api", userRoutes);
app.use("/api/uploads", express.static("uploads"));
dotenv.config();

//Como hostear react directo desde express? Asi --> 
//Primero le decimos a express que use todos los archivos del build de react asi:
app.use(express.static(
    path.join(__dirname, "../../frontend/build")
));
//Luego le decimos a express que sirva todo eso desde el home
app.get("/", (req, res) => {
    res.sendFile(path.join(
        __dirname, "../../frontend/build/index.html"
    ))
});


const PORT = /* process.env.PORT ||  */5000;

mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });
    }
    )
    .catch((error) => {
        console.log(error.message);
    }
    );