import { FiSettings } from "react-icons/fi";
import { Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

<<<<<<< HEAD
import {
  Typebox,
  BuatTypebox,
  Customer,
  TambahCustomer,
  UpdateCustomer,
} from "../pages";
=======
import { Typebox, BuatTypebox, Customer, TambahCustomer } from "../pages";
>>>>>>> parent of 599209e (feat: customer update, delete)

import {
  Navbar,
  Footer,
  Sidebar,
  ThemeSettings,
  LoadingScreen,
} from "../components";

import "../App.css";

import { useStateContext } from "../contexts/ContextProvider";

const Main = () => {
  const [isLoading, setIsLoading] = useState(true);

  const {
    setCurrentColor,
    setCurrentMode,
    currentMode,
    activeMenu,
    currentColor,
    themeSettings,
    setThemeSettings,
  } = useStateContext();

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("colorMode");
    const currentThemeMode = localStorage.getItem("themeMode");

    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }

    setIsLoading(false);
  }, []);

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <div className={currentMode === "Dark" ? "dark" : ""}>
      <div className="flex relative dark:bg-main-dark-bg">
        <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
          <TooltipComponent content="Settings" position="Top">
            <button
              type="button"
              onClick={() => setThemeSettings(true)}
              style={{ background: currentColor, borderRadius: "50%" }}
              className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
            >
              <FiSettings />
            </button>
          </TooltipComponent>
        </div>
        {activeMenu ? (
          <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
            <Sidebar />
          </div>
        ) : (
          <div className="w-0 dark:bg-secondary-dark-bg">
            <Sidebar />
          </div>
        )}
        <div
          className={
            activeMenu
              ? "dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-72 w-full md:w-[calc(100vw-288px)] relative "
              : "bg-main-bg dark:bg-main-dark-bg w-full min-h-screen flex-2 relative "
          }
        >
          <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
            <Navbar />
          </div>
          <div>
            {themeSettings && <ThemeSettings />}

            <Routes>
             
              <Route path="/TypeBox/Typebox" element={<Typebox />} />
              <Route path="/TypeBox/BuatTypebox" element={<BuatTypebox />} />
              <Route path="/customer/customers" element={<Customer />} />
              <Route path="/customer/tambah" element={<TambahCustomer />} />
              <Route path="/customer/update" element={<UpdateCustomer />} />
           </Routes>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Main;
