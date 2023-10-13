import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Login, Main } from "./pages";

import "./App.css";

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="dashboard/login" element={<Login />} />
        <Route path="dashboard/*" element={<Main />} />
      </Routes>
      
    </BrowserRouter>
  );
};

export default App;
