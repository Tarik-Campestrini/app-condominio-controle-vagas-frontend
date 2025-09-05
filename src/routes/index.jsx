import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Index from "../pages/Index";



const RoutesApp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-center font-sans">
      <div className="p-8 max-w-lg mx-auto">
        
        <img
          src="src/assets/manutencao.png"
          alt="Under construction sign"
          className="mx-auto my-8 w-64"
        />        
      </div>
    </div>
  );
};

export default RoutesApp;
