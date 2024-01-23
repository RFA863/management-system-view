import axios from "axios";
import Select from "react-select";
import { getCookie } from "cookies-next";
import { CgClose } from "react-icons/cg";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { HOST } from "../../config";
import { Header } from "../../components";

const Input_invoice = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [noInvoice, setnoInvoice] = useState();
  const [tanggal, setTanggal] = useState();
  const [Berikat, setBerikat] = useState("");
  const [Ppn, setPpn] = useState("");

  const Validator = () => {
    // const isNumeric = (input) => {
    //   // Menggunakan ekspresi reguler untuk mengecek apakah input hanya berisi karakter angka
    //   const numericRegex = /^[0-9]+$/;
    //   return numericRegex.test(input);
    // };

    if (!(noInvoice && tanggal && Berikat && Ppn)) {
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
        HOST + "/finance/invoice/input/" + id,
        {
          noInvoice,
          tanggal,

          ppn: Number(Ppn),
          berikat: JSON.parse(Berikat),
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

  
  return (
    <div>
      <div className="m-2 md:m-10 mt-24 px-2 py-10 md:p-10 bg-white rounded-3xl ">
        <div className="flex justify-between">
          <Header title="Input Surat Jalan" />
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
                <td>No. Invoice</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="text"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={noInvoice}
                    onChange={(e) => {
                      setnoInvoice(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>

              <tr>
                <td>Tanggal</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="date"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={tanggal}
                    onChange={(e) => {
                      setTanggal(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Berikat</td>
                <td className="px-4">:</td>
                <td className="flex gap-4">
                  <label>
                    <input
                      type="radio"
                      name="Berikat"
                      value="true"
                      checked={Berikat === "true"}
                      onChange={(e) => {
                        setBerikat(e.target.value);
                      }}
                      required
                    />
                    True
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="Berikat"
                      value="false"
                      checked={Berikat === "false"}
                      onChange={(e) => {
                        setBerikat(e.target.value);
                      }}
                      required
                    />
                    false
                  </label>
                </td>
              </tr>

              <tr>
                <td>PPN</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="text"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={Ppn}
                    onChange={(e) => {
                      setPpn(e.target.value);
                    }}
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

export default Input_invoice;
