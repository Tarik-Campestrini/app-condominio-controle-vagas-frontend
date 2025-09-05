import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Index from "../pages/Index";


const RoutesApp = () => {
  return (
    <BrowserRouter>      
      <Routes>        
        <Route path="/" element={<Index />} />{" "}        
      </Routes>     
    </BrowserRouter>
  );
};
export default RoutesApp;
