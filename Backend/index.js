import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import {fileURLToPath} from  "url";

/* Configuration */
const __filename = fileURLToPath(import.meta.url);  // get the current file name
const __dirname = path.dirname(__filename) // get the directory of the filename
dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.urlencoded({limit:"30mb", extended: true}))
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")))


//File Storage
// Multer diskStorage is an engine which is used to store the file and name the file
// multer basically handles the multipart/formdata of the forms
const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(new Error("Destination Error"), "public/assets")
    },
    filename:function (req, file, callback) {
        cb(new Error("Filename Error"), file.originalname)
    }
})

const upload = multer({storage})


/* Mongoose setup */
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL).then(() => {
    app.listen(PORT, () => {
        console.log(`Server Port: ${PORT}`);
    })
}).catch((error) => {
    console.log("connection failed")
})