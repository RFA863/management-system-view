import axios from "axios";
import { useState, useEffect } from "react";
import React from "react";
import { Header, PageLoading } from "../../components";
import { getCookie } from "cookies-next";

import { HOST } from "../../config";

const BuatTypebox = () => {
  const [nama, setNama] = useState("");
  const [kode, setKode] = useState("");

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
                 console.log("ok")

                 

                 
                }
              })
              .catch((error) => {
                console.log(error)
              });
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default BuatTypebox;
