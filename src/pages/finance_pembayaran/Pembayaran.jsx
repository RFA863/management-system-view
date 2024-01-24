import axios from "axios";
import Select from "react-select";
import { getCookie } from "cookies-next";
import { CgClose } from "react-icons/cg";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { HOST } from "../../config";
import { Header } from "../../components";

const Pembayaran = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [tglKontraBon, setTglKontraBon] = useState();
  const [tglBayar, setTglBayar] = useState();
  const [metodeBayar, setmetodeBayar] = useState("");
  const [TotalBayar, setTotalBayar] = useState("");
  const [Pembulatan, setlPembulatan] = useState("");
  const [keterangan, setKeterangan] = useState("");

  const Validator = () => {
    // const isNumeric = (input) => {
    //   // Menggunakan ekspresi reguler untuk mengecek apakah input hanya berisi karakter angka
    //   const numericRegex = /^[0-9]+$/;
    //   return numericRegex.test(input);
    // };

    if (
      !(
        tglKontraBon &&
        tglBayar &&
        metodeBayar &&
        TotalBayar &&
        Pembulatan &&
        keterangan
      )
    ) {
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

  const postData = async (e) => {
    e.preventDefault();

    if (!Validator()) {
      return;
    }
    await axios
      .post(
        HOST + "/finance/pembayaran/input/" + id,
        {
          tglKontraBon,
          tglBayar,
          metodeBayar,
          totalBayar: Number(TotalBayar),
          pembulatan: Number(Pembulatan),
          keterangan,
        },
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
  };

const PayMethod = [{value:"Transfer", label:"Transfer"},{value:"Cek/Giro", label:"Cek/Giro"}, {value:"Cash", label:"Cash"}]

  return (
    <div>
      <div className="m-2 md:m-10 mt-24 px-2 py-10 md:p-10 bg-white rounded-3xl ">
        <div className="flex justify-between">
          <Header title="Input Pembayaran" />
          <CgClose
            className="text-4xl cursor-pointer"
            onClick={() => {
              navigate("/dashboard/job-order/belum-dibuat%20surat%20jalan");
            }}
          />
        </div>
        <form>
          <div className="flex items-end justify-evenly">
            <table className="border-separate border-spacing-y-2">
              <tr>
                <td>Tanggal Kontra Bon</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="date"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={tglKontraBon}
                    onChange={(e) => {
                      setTglKontraBon(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Tanggal Bayar</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="date"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={tglBayar}
                    onChange={(e) => {
                      setTglBayar(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Metode Bayar</td>
                <td className="px-4">:</td>
                <td>
                <Select
                    options={PayMethod}
                    isClearable={true}
                    value={metodeBayar}
                    onChange={(e) => {
                      setmetodeBayar(e);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Total Bayar</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="text"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={TotalBayar}
                    onChange={(e) => {
                      setTotalBayar(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Pembulatan</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="text"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={Pembulatan}
                    onChange={(e) => {
                      setlPembulatan(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Keterangan</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="text"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={keterangan}
                    onChange={(e) => {
                      setKeterangan(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>
            </table>
            <div>
              <button
                className="bg-blue-700 text-white rounded-lg py-2 px-4 hover:bg-blue-600"
                onClick={postData}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
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

export default Pembayaran;
