import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { logo } from "./assets";
import { Home, CreatePost } from "./pages";

const App = () => {
  return (
    <BrowserRouter>
      <header className="w-full flex justify-between items-centre bg-white sm:px-8 py-4 border-b border-b-[#e6ebf4]">
        <Link to="/">
          <img src={logo} alt="logo" className="w-28 object-contain" />
        </Link>
        <Link
          to="create-post"
          className="absolute right-1 mr-5 bg-cyan-500 shadow-md shadow-pink-500/70 ... font-inter  font-medium text-white px-4 py-1 rounded-lg hover:rounded-md hover:bg-green-400 ... hover:shadow-cyan-500/80"
        >
          Create
        </Link>
        <Link
          to="/"
          className="mr-24 bg-pink-500 shadow-md shadow-cyan-500/70 ...  font-inter font-medium text-white px-5 py-1 rounded-lg hover:rounded-md hover:bg-orange-400 ... hover:shadow-yellow-500/80"
        >
          Home
        </Link>
      </header>
      <main className="sm:p-8 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh-73px)]">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/create-post" element={<CreatePost />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
