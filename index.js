import express from "express";
import mongoose from "mongoose";

// The body-parser module is used to parse the incoming request bodies in middleware.
// It's essential when you want to extract data
// from the body of HTTP requests, especially when
// dealing with POST and PUT requests.
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

// multer is a middleware used for handling multipart/form-data,
//  which is primarily used for uploading files. It's commonly used when you want to accept file uploads from users.
import multer from "multer";

// helmet is a collection of middleware functions that enhance the security
// of your Express application by setting various HTTP headers to prevent common security vulnerabilities.
import helmet from "helmet";

// morgan is a middleware used for logging HTTP requests to the console.
//  It's often used for debugging and monitoring purposes.
import morgan from "morgan";

// path is a built-in Node.js module that provides utilities for working with file and directory paths.
import path from "path";

// fileURLToPath is a function provided by the url module. It's used to convert a file: URL to a file path.
import { fileURLToPath } from "url";

import authRoutes from "./Routes/auth.js";

import userRouter from "./Routes/user.js";
// import postRoutes from "./Routes/posts.js";


// Importing the register method from auth.js
import { register } from "./Controllers/auth.js";

/*  Configurations  */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
// This line adds the json middleware to your Express application.
// It parses incoming JSON payloads of HTTP requests and
// makes them available on the req.body object.
app.use(express.json());

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// These lines below set up the bodyParser middleware to parse JSON and URL-encoded request bodies.
// The limit option restricts the size of the incoming payloads, and the extended option allows parsing of rich objects and arrays.

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
// app.use("/", function(){
//     return "hello this is me";
// })

// This line sets up a route that serves static files from the "public/assets" directory.
// When a request is made to /assets, the express.static middleware will serve
// the files from the specified directory. The path.join(__dirname, "public/assets")
// constructs an absolute path to the directory, and express.static handles the rest.
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* Files Storage */

// This code configures the multer middleware to store uploaded files on the disk.
// The diskStorage function specifies how the files should be stored. The destination
//  function determines the directory where the uploaded files will be saved, in this
//   case, "public/assets". The filename function determines the name of the uploaded
//   file when saved on the server.

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// `Here, you're creating an instance of multer with the specified storage configuration
//  (upload) and setting up a route for registering users. The upload.single("picture")
//   middleware specifies that you expect a single file upload with the field name "picture"
//    in the incoming request. The uploaded file will be saved according to the storage configuration.
//     After the file is uploaded, the register function from the imported auth.js controller will
//      be called to handle the registration process.

// The rest of the code seems to be about setting up the server, connecting to a MongoDB database
//  using mongoose, and then starting the server to listen on a specified port (PORT).

// To summarize, the additional code you've provided adds functionality for handling static
//  files (such as images), configuring file uploads using multer, and then connecting your
//   server to a MongoDB database using mongoose. It also specifies a route for user registration
//   that involves uploading a profile picture.`

const upload = multer({ storage });
app.post("/auth/register", upload.single("picture"), register);

// We are not using this structure for the register as we need to upload files for that and we might be able to upload that using the multer
// that is why we used that separately
// All the routes that have auth as prefix will hit this file
// except the auth/register
app.use("/auth", authRoutes);

// User Routes

app.use("/users", userRouter);
// app.use("/users", postRoutes);

// Routes with Files

// Mongoose setup
const PORT = process.env.PORT || 6001;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port : ${PORT}`));
  })
  .catch((error) => {
    console.log(`${error} did not connect`);
  });
