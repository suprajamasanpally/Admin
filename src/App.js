import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./Pages/SignupPage/SignupPage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import HomePage from "./Pages/HomePage/HomePage";
import SuperAdminDb from "./Components/SuperAdminDb";
import UserAdminDb from "./Pages/UserAdminDb/UserAdminDb";
import WorkflowManage from "./Components/WorkflowManage/WorkflowManage";
import PersonalInfoPage from "./Pages/PersonalInfoPage/PersonalInfoPage";
import EducationalInfoPage from "./Pages/EducationalInfoPage/EducationalInfoPage";
import ProfessionalInfoPage from "./Pages/ProfessionalInfoPage/ProfessionalInfoPage";
import DocumentUploadPage from "./Pages/DocumentUploadPage/DocumentUploadPage";
import ThankyouPage from "./Pages/ThankyouPage/ThankyouPage";
import TemplateManage from "./Components/TemplateManage/TemplateManage";
import FieldManage from "./Components/FieldManage/FieldManage";
import UnauthorizedPage from "./Pages/UnauthorizedPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>}></Route>
        <Route path="/signup" element={<SignupPage/>}></Route>
        <Route path="/login" element={<LoginPage/>}></Route>
        <Route path="/superadmin-dashboard" element={<SuperAdminDb/>} ></Route>
        <Route path="/useradmin-dashboard" element={<UserAdminDb/>}></Route>
        <Route path="/workflow-management" element={<WorkflowManage/>}></Route>
        <Route path="/template-management" element={<TemplateManage/>}></Route>
        <Route path="/field-management" element={<FieldManage/>}></Route>
        <Route path="/page-1" element={<PersonalInfoPage/>}></Route>
        <Route path="/page-2" element={<EducationalInfoPage/>}></Route>
        <Route path="/page-3" element={<ProfessionalInfoPage/>}></Route>
        <Route path="/page-4" element={<DocumentUploadPage/>}></Route>
        <Route path="/thank-you" element={<ThankyouPage/>}></Route>
        <Route path="/unauthorized" element={<UnauthorizedPage/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
