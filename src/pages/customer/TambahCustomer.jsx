import axios from "axios";
import { getCookie } from "cookies-next";
import { CgClose } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";

import { HOST } from "../../config";
import { Header } from "../../components";

const TambahCustomer = () => {
  const navigate = useNavigate();

  const [Nomor, setNomor] = useState("");
  const [nama, setNama] = useState("");
  const [kode, setKode] = useState("");
  const [email, setEmail] = useState("");
  const [Npwp, setNpwp] = useState("");
  const [noNpwp, setNoNpwp] = useState("");
  const [noTelp, setNoTelp] = useState("");
  const [noFax, setNoFax] = useState("");
  const [alamat, setAlamat] = useState("");
  const [alamatInvoice, setAlamatInvoice] = useState("");
  const [warning, setWarning] = useState("");

  const postData = () => {
    axios
      .post(
        HOST + "/marketing/customer/input",
        {
          nomor: Number(Nomor),
          nama,
          kode,
          email,
          npwp: Boolean(Npwp),
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
          console.log("ok");
        }
      })
      .catch((error) => {
        if (error.response) {
          setWarning(error.response.data.message);
        } else {
          setWarning("Internal Server Error, Try again later !");
        }
      });
  };

  useEffect(() => {
    getCookie("admin_auth");
  }, []);

  console.log(getCookie("admin_auth"));
  return (
    <div className="m-2 md:m-10 mt-24 px-2 py-10 md:p-10 bg-white rounded-3xl ">
      <div className="flex justify-between">
        <Header title="Tambah Customer" />
        <CgClose
          className="text-4xl cursor-pointer"
          onClick={() => {
            navigate("/dashboard/customer/customers");
          }}
        />
      </div>
      <form>
        <div className="flex items-end justify-evenly">
          <table className="font-semibold">
            <tr>
              <td>Nomor</td>
              <td>:</td>
              <td>
                <input
                  type="text"
                  className="border-b-2 focus:outline-none focus:border-blue-700 w-[300px]"
                  value={Nomor}
                  onChange={(e) => {
                    setWarning("");
                    setNomor(e.target.value);
                  }}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>Nama</td>
              <td>:</td>
              <td>
                <input
                  type="text"
                  className="border-b-2 focus:outline-none focus:border-blue-700 w-[300px] "
                  value={nama}
                  onChange={(e) => {
                    setWarning("");
                    setNama(e.target.value);
                  }}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>Kode</td>
              <td>:</td>
              <td>
                <input
                  type="text"
                  className="border-b-2 focus:outline-none focus:border-blue-700 w-[300px] "
                  value={kode}
                  onChange={(e) => {
                    setWarning("");
                    setKode(e.target.value);
                  }}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>Email</td>
              <td>:</td>
              <td>
                <input
                  type="email"
                  className="border-b-2 focus:outline-none focus:border-blue-700 w-[300px] "
                  value={email}
                  onChange={(e) => {
                    setWarning("");
                    setEmail(e.target.value);
                  }}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>Npwp</td>
              <td>:</td>
              <td className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    name="npwp"
                    value="true"
                    checked={Npwp === "true"}
                    onChange={(e) => {
                      setWarning("");
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
                      setWarning("");
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
              <td>:</td>
              <td>
                <input
                  type="text"
                  className="border-b-2 focus:outline-none focus:border-blue-700 w-[300px] "
                  value={noNpwp}
                  onChange={(e) => {
                    setWarning("");
                    setNoNpwp(e.target.value);
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>No. Telpn</td>
              <td>:</td>
              <td>
                <input
                  type="text"
                  className="border-b-2 focus:outline-none focus:border-blue-700 w-[300px] "
                  value={noTelp}
                  onChange={(e) => {
                    setWarning("");
                    setNoTelp(e.target.value);
                  }}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>No. Fax</td>
              <td>:</td>
              <td>
                <input
                  type="text"
                  className="border-b-2 focus:outline-none focus:border-blue-700 w-[300px] "
                  value={noFax}
                  onChange={(e) => {
                    setWarning("");
                    setNoFax(e.target.value);
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Alamat</td>
              <td>:</td>
              <td>
                <input
                  type="text"
                  className="border-b-2 focus:outline-none focus:border-blue-700 w-[300px] "
                  value={alamat}
                  onChange={(e) => {
                    setWarning("");
                    setAlamat(e.target.value);
                  }}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>Alamat Invoice</td>
              <td>:</td>
              <td>
                <input
                  type="text"
                  className="border-b-2 focus:outline-none focus:border-blue-700 w-[300px] "
                  value={alamatInvoice}
                  onChange={(e) => {
                    setWarning("");
                    setAlamatInvoice(e.target.value);
                  }}
                  required
                />
              </td>
            </tr>
          </table>
          <div>
            <button
              className="bg-blue-700 rounded-xl text-white px-4 py-2"
              onClick={postData}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
      <p className="text-red-600 mt-10">{warning}</p>
    </div>
  );
};
export default TambahCustomer;
