require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const EmployeeModel = require("./Models/Employee");
const PersonalInfoModel = require("./Models/PersonalInfo");
const DocumentUploadModel = require("./Models/DocUpload");

const WorkflowRoute = require("./Routes/WorkflowRoute");
const TemplateRoute = require("./Routes/TemplateRoute");
const ThemeRoute = require("./Routes/ThemeRoute");
const FieldRoute = require("./Routes/FieldRoute");
const EducationalInfoRoute = require("./Routes/EducationalInfoRoute");
const ProfessionalInfoRoute = require("./Routes/ProfessionalInfoRoute");

const { authenticate, requireSuperAdmin, requireRole } = require('./middlewares/auth');

const app = express();
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Predefined constants
const SUPERADMIN_EMAILS = process.env.SUPERADMIN_EMAILS ? process.env.SUPERADMIN_EMAILS.split(",") : [];  // Predefined superadmin emails

app.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Ensure only allowed emails can register as SuperAdmin
    if (role === 'SuperAdmin' && !SUPERADMIN_EMAILS.includes(email)) {
      return res.status(403).json({ error: 'Unauthorized email for SuperAdmin signup' });
    }

    // Default role to 'User' if not provided
    const userRole = role || 'User';

    // Check if user already exists
    const existingUser = await EmployeeModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new EmployeeModel({ name, email, password: hashedPassword, role: userRole });
    await newUser.save();

    res.json({ status: 'Success' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login route with JWT token generation
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await EmployeeModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'No record existed' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Wrong password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ status: 'Success', role: user.role, email: user.email, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Protected routes using authentication
app.use("/api", authenticate);

app.use("/api", WorkflowRoute);
app.use("/api/v1/templates", TemplateRoute);
app.use("/api", ThemeRoute);
app.use("/api/fields", FieldRoute);
app.use("/api/educational-info", EducationalInfoRoute);
app.use("/api/professional-info", ProfessionalInfoRoute);

// Protect route with SuperAdmin check
app.get('/superadmin-dashboard', authenticate, requireSuperAdmin, (req, res) => {
  res.send('SuperAdmin Dashboard');
});


// Protect route with UserAdmin check
app.get('/useradmin-dashboard', authenticate, requireRole('UserAdmin'), (req, res) => {
  res.send('UserAdmin Dashboard');
});

// Route to validate invitation code
app.post('/validate-invitation-code', (req, res) => {
  const { invitationCode } = req.body;

  if (invitationCode === process.env.INVITATION_CODE) {
    return res.json({ status: 'Success', message: 'Valid invitation code' });
  } else {
    return res.status(401).json({ status: 'Failed', error: 'Invalid invitation code' });
  }
});

app.post("/api/personal-info", (req, res) => {
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

    DocumentUploadModel.findOneAndUpdate(
      { email },
      { documents: documentData },
      {
        upsert: true,
        new: true,
      }
    )
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
