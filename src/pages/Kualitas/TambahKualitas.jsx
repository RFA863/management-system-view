import axios from "axios";
import { useState, useEffect } from "react";Kualitas
import React from "react";
import { Header, PageLoading } from "../../components";
import { getCookie } from "cookies-next";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { HOST } from "../../config";

const TambahKualitas = () => {
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
      <Header title="BUAT TYPE BOX" />

      <form className="max-w-md mx-auto p-4  rounded-lg">
        <div className="mb-4">
          <label className="block font-bold" htmlFor="NAMA">
            Name:
          </label>
          <input
            className="bg-gray-200 border rounded w-full py-2 px-3"
            type="text"
            name="NAMA"
            id="NAMA"
            value={nama}
            onChange={(e) => {
              setNama(e.target.value);
            }}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold" htmlFor="KODE">
            Kode:
          </label>
          <input
            className="bg-gray-200 border rounded w-full py-2 px-3"
            type="text"
            name="KODE"
            id="KODE"
            value={kode}
            onChange={(e) => {
              setKode(e.target.value);
            }}
            required
          />
        </div>
        <button
          className="bg-blue-700 text-white rounded-lg py-2 px-4 hover:bg-blue-600"
          onClick={(e) => {
            e.preventDefault();
            if (!Validator()) {
              return;
            }
            axios
              .post(
                HOST + "/marketing/kualitas/input",
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
                }
              })
              .catch((error) => {
                if (error.response) {
                  console.log(error.response.data.message);
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

export default TambahKualitas;