import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Test from "./Pages/Test/Test";

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/t" element={<Test/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
