import axios from "axios";

import { useState } from "react";
import { CgClose } from "react-icons/cg";
import { getCookie } from "cookies-next";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import { HOST } from "../../config";
import { Header } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";

import "react-toastify/dist/ReactToastify.css";

const UpdateCustomer = () => {
  const navigate = useNavigate();
  const { data, setData } = useStateContext();

  if (data.length === 0) {
    navigate("/dashboard/customer/customers");
  }

  const [nama, setNama] = useState(data.Nama);
  const [Nomor, setNomor] = useState(data.Nomor);
  const [email, setEmail] = useState(data.Email);
  const [Npwp, setNpwp] = useState(String(data.NPWP));
  const [noNpwp, setNoNpwp] = useState(data.NoNpwp);
  const [kode, setKode] = useState(data.Kode);
  const [noTelp, setNoTelp] = useState(data.NoTelp);
  const [noFax, setNoFax] = useState(data.NoFax);
  const [alamat, setAlamat] = useState(data.Alamat);
  const [alamatInvoice, setAlamatInvoice] = useState(data.AlamatInvoice);

  const Validator = () => {
    const isNumeric = (input) => {
      // Menggunakan ekspresi reguler untuk mengecek apakah input hanya berisi karakter angka
      const numericRegex = /^[0-9]+$/;
      return numericRegex.test(input);
    };

    if (
      !(
        Nomor &&
        Npwp &&
        nama &&
        kode &&
        email &&
        alamat &&
        alamatInvoice &&
        noTelp
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
    } else if (isNumeric(Nomor) === false) {
      toast.error("Number must be numeric", {
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

  const updateData = async (e) => {
    e.preventDefault();

    if (!Validator()) {
      return;
    }
    await axios
      .put(
        HOST + "/marketing/customer/update/" + data.id,
        {
          nomor: Number(Nomor),
          nama,
          kode,
          email,
          npwp: JSON.parse(Npwp),
          noNpwp,
          noTelp,
          noFax,
          alamat,
          alamatInvoice,
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
          setData([]);
          navigate("/dashboard/customer/customers");
        }
      })
      .catch((error) => {
        if (error.response) {
          // console.log(error.response.data.type);
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
          <Header title="Update Customer" />
          <CgClose
            className="text-4xl cursor-pointer"
            onClick={() => {
              navigate("/dashboard/customer/customers");
            }}
          />
        </div>
        <form>
          <div className="flex items-end justify-evenly">
            <table className="border-separate border-spacing-y-2">
              <tr>
                <td>Nomor</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="text"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={Nomor}
                    onChange={(e) => {
                      setNomor(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Nama</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="text"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
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
                    type="text"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={kode}
                    onChange={(e) => {
                      setKode(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Email</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="email"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Npwp</td>
                <td className="px-4">:</td>
                <td className="flex gap-4">
                  <label>
                    <input
                      type="radio"
                      name="npwp"
                      value="true"
                      checked={Npwp === "true"}
                      onChange={(e) => {
                        setNpwp(e.target.value);
                      }}
                      required
                    />
                    True
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="npwp"
                      value="false"
                      checked={Npwp === "false"}
                      onChange={(e) => {
                        setNpwp(e.target.value);
                      }}
                      required
                    />
                    false
                  </label>
                </td>
              </tr>
              <tr>
                <td>No. Npwp</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="text"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={noNpwp}
                    onChange={(e) => {
                      setNoNpwp(e.target.value);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>No. Telpn</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="text"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={noTelp}
                    onChange={(e) => {
                      setNoTelp(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>No. Fax</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="text"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={noFax}
                    onChange={(e) => {
                      setNoFax(e.target.value);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>Alamat</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="text"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={alamat}
                    onChange={(e) => {
                      setAlamat(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Alamat Invoice</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="text"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={alamatInvoice}
                    onChange={(e) => {
                      setAlamatInvoice(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>
            </table>
            <div>
              <button
                className="bg-blue-700 text-white rounded-lg py-2 px-4 hover:bg-blue-600"
                onClick={updateData}
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
export default UpdateCustomer;
