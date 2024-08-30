const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const EmployeeModel = require("./Models/Employee");
const PersonalInfoModel = require("./Models/PersonalInfo");
const DocumentUploadModel = require("./Models/DocUpload");

const WorkflowRoute = require("./Routes/WorkflowRoute");
const TemplateRoute = require("./Routes/TemplateRoute");
const ThemeRoute = require("./Routes/ThemeRoute");
const FieldRoute = require("./Routes/FieldRoute");
const EducationalInfoRoute = require("./Routes/EducationalInfoRoute");
const ProfessionalInfoRoute = require('./Routes/ProfessionalInfoRoute');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', WorkflowRoute);
app.use('/api/v1/templates', TemplateRoute);
app.use('/api', ThemeRoute);
app.use('/api/fields', FieldRoute);
app.use('/api/educational-info', EducationalInfoRoute);
app.use('/api/professional-info', ProfessionalInfoRoute);


const VALID_INVITATION_CODE = "7995731183";
const JWT_SECRET = "your_jwt_secret";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

mongoose
  .connect("mongodb://localhost:27017/admin")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.post("/signup", async (req, res) => {
  const { name, email, password, role, invitationCode } = req.body;
  try {
    if (role === "SuperAdmin") {
      if (invitationCode !== VALID_INVITATION_CODE) {
        return res.status(400).json({ error: "Invalid invitation code" });
      }
    }
    const existingUser = await EmployeeModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new EmployeeModel({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    res.json({
      status: "Success",
      message: "User registered successfully. You can now log in.",
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await EmployeeModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "No record existed" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Wrong password" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ status: "Success", token, role: user.role, email: user.email });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/personal-info", (req, res) => {
  console.log("Request Body:", req.body);  // Log the incoming request body
  const { email, ...personalInfo } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  PersonalInfoModel.findOneAndUpdate({ email }, personalInfo, {
    upsert: true,
    new: true,
  })
    .then((result) => res.json(result))
    .catch((err) => {
      console.error("Personal Info error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.post(
  "/documents-upload",
  upload.fields([
    { name: "identification[file]", maxCount: 1 },
    { name: "birthCertificate[file]", maxCount: 1 },
    { name: "addressVerification[file]", maxCount: 1 },
    { name: "educationalCredentials[file]", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  (req, res) => {
    console.log("Request Body:", req.body);  // Log the incoming request body
    console.log("Files:", req.files);  // Log the uploaded files
    const email = req.body.email;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const documentData = {
      identification: {
        type: req.body["identification[type]"],
        file: req.files["identification[file]"]
          ? req.files["identification[file]"][0].filename
          : null,
      },
      birthCertificate: {
        type: req.body["birthCertificate[type]"],
        file: req.files["birthCertificate[file]"]
          ? req.files["birthCertificate[file]"][0].filename
          : null,
      },
      addressVerification: {
        type: req.body["addressVerification[type]"],
        file: req.files["addressVerification[file]"]
          ? req.files["addressVerification[file]"][0].filename
          : null,
      },
      educationalCredentials: {
        type: req.body["educationalCredentials[type]"],
        file: req.files["educationalCredentials[file]"]
          ? req.files["educationalCredentials[file]"][0].filename
          : null,
      },
      resume: req.files.resume ? req.files.resume[0].filename : null,
    };

    DocumentUploadModel.findOneAndUpdate({ email }, { documents: documentData }, {
      upsert: true,
      new: true,
    })
      .then((result) => res.json(result))
      .catch((err) => {
        console.error("Documents Upload error:", err);
        res.status(500).json({ error: "Internal Server Error" });
      });
  }
);



app.listen(3001, () => {
  console.log("Server is running");
});
