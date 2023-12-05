import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Login, Main, } from "./pages";
// import {Typebox} from "./pages/TypeBox/"

import "./App.css";

const App = () => {

  return (

    <BrowserRouter>
      <Routes>
        <Route path="dashboard/login" element={<Login />} />
        <Route path="dashboard/*" element={<Main />} />
        <Route
          path="/"
          element={<Navigate to="/dashboard/login" />}
        />
        {/* <Route path="dashboard/Typebox" element={<Typebox />} /> */}
      </Routes>
    </BrowserRouter>

  );
};

export default App;
