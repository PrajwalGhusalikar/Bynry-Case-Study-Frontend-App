import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProfileList from "../src/Pages/ProfileList";
import ProfileDetails from "../src/Pages/ProfileDetails"; 
import AdminPanel from "./Components/AdminPanel";
import "./style.css"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProfileList />} />
        <Route path="/profile/:id" element={<ProfileDetails />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
};

export default App;
