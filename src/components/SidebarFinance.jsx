import React, { useState } from "react";
import { IoMdContacts, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Link, NavLink } from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import { useStateContext } from "../contexts/ContextProvider";
import { list } from "postcss";

const SidebarFinance = () => {
  const [openSection, setOpenSection] = useState(null);

  const handleSectionClick = (sectionIndex) => {
    if (sectionIndex === openSection) {
      setOpenSection(null);
    } else {
      setOpenSection(sectionIndex);
    }
  };

  const links = [
    {
      title: "Surat Jalan",

      links: [
        {
          name: "list",
        },
        {
          name: "belum invoice",
        },
        {
          name: "sudah invoice",
        },
      ],
    },
    {
      title: "invoice",
      links: [
        {
          name: "list",
        },
        {
          name: "belum bayar",
        },
        {
          name: "outstanding",
        },
      ],
    },
    // {
    //   title: "pembayaran",
    //   links: [
    //     {
    //       name: "pembayaran",
    //     },
    //   ],
    // },
    {
      title: "lunas",
      links: [
        {
          name: "lunas",
        },
      ],
    },
  ];

  const { currentColor, activeMenu, setActiveMenu, screenSize } =
    useStateContext();

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg  text-white  text-md m-2";
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2";

  return (
    <div className="ml-3 pr-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-center items-center">
            <Link
              to="/"
              onClick={handleCloseSideBar}
              className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
            >
              <span>Dashboard</span>
            </Link>
            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() => setActiveMenu(!activeMenu)}
                style={{ color: currentColor }}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          <div className="mt-10 ">
            {links.map((item, index) => (
              <div key={item.title}>
                <button
                  className="flex justify-between items-center w-[240px] cursor-pointer text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase"
                  onClick={() => handleSectionClick(index)}
                >
                  <div>
                    {item.title}
                    {item.icon}
                  </div>
                  <div>
                    {openSection === index ? (
                      <IoIosArrowUp />
                    ) : (
                      <IoIosArrowDown />
                    )}
                  </div>
                </button>
                {openSection === index &&
                  item.links.map((link) => (
                    <NavLink
                      to={`/dashboard/${item.title
                        .toLowerCase()
                        .replace(" ", "-")}/${link.name
                        .toLowerCase()
                        .replace(" ", "-")}`}
                      key={link.name}
                      onClick={handleCloseSideBar}
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? currentColor : "",
                      })}
                      className={({ isActive }) =>
                        isActive ? activeLink : normalLink
                      }
                    >
                      {link.icon}
                      <span className="capitalize ">{link.name}</span>
                    </NavLink>
                  ))}
                <hr />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SidebarFinance;
