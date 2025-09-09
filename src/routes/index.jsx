import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Index from "../pages/Index";
import Login from "../pages/login";


const RoutesApp = () => {
  return (
    <BrowserRouter>      
      <Routes>
        <Route path="/" element={<Index />} />{" "}
        <Route path="/login" element={<Login />} />{" "}
      </Routes>
    </BrowserRouter>
  );
};
export default RoutesApp;
