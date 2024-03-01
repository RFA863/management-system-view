import axios from "axios";
import { useState, useEffect } from "react";
import { CgClose } from "react-icons/cg";
import { Header } from "../../components";
import { getCookie } from "cookies-next";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { HOST } from "../../config";

const BuatTypebox = () => {
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [kode, setKode] = useState("");

  const Validator = () => {
    if (!(nama && kode)) {
      toast.error("Data must be entered", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      return false;
    }

    return true;
  };

  return (
    <div className="m-2 md:m-10 mt-24 px-2 py-10 md:p-10 bg-white rounded-3xl ">
      <div className="flex justify-between">
        <Header title="BUAT TYPE BOX" />
        <CgClose
          className="text-4xl cursor-pointer"
          onClick={() => {
            navigate("/dashboard/master/type-box");
          }}
        />
      </div>
      <form>
        <table className="border-separate border-spacing-y-2">
          <tr>
            <td>Name</td>
            <td className="px-4">:</td>
            <td>
              <input
                className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                type="text"
                value={nama}
                onChange={(e) => {
                  setNama(e.target.value);
                }}
                required
              />
            </td>
          </tr>
          <tr>
            <td>Kode</td>
            <td className="px-4">:</td>
            <td>
              <input
                className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                type="text"
                name="KODE"
                id="KODE"
                value={kode}
                onChange={(e) => {
                  setKode(e.target.value);
                }}
                required
              />
            </td>
          </tr>
        </table>

        <button
          className="bg-blue-700 text-white rounded-lg py-2 px-4 hover:bg-blue-600"
          onClick={(e) => {
            e.preventDefault();
            if (!Validator()) {
              return;
            }
            axios
              .post(
                HOST + "/marketing/tipebox/input",
                { nama, kode },
                {
                  headers: {
                    "ngrok-skip-browser-warning": true,
                    Authorization: getCookie("admin_auth"),
                  },
                }
              )
              .then((response) => {
                if (response.status === 200) {
                  toast.success("Data successfully inputted", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                  });
                  navigate("/dashboard/master/type-box");
                }
              })
              .catch((error) => {
                if (error.response) {
                  if (
                    error.response.data.type === "token" &&
                    error.response.data.data.code === -2
                  ) {
                    navigate("/dashboard/login");
                  }
                  toast.error(error.response.data.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                  });
                } else {
                  toast.error("Internal Server Error, Try again later !", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                  });
                }
              });
          }}
        >
          Submit
        </button>
      </form>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default BuatTypebox;
