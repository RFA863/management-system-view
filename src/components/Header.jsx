import React from "react";

const Header = ({ category, title, sub }) => (
  <div className="mb-10">
    <p className="text-lg text-gray-400">{category}</p>
    <p className="text-3xl text-center md:text-left font-extrabold tracking-tight text-slate-900">
      {title}
    </p>
    <p className="text-base text-center md:text-left text-gray-400 mt-4">{sub}</p>
  </div>
);

export default Header;