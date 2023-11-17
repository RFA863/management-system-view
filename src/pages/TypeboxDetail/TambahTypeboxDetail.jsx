import axios from "axios";
import { getCookie } from "cookies-next";
import { CgClose } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { HOST } from "../../config";
import { Header } from "../../components";

import "react-toastify/dist/ReactToastify.css";

const TambahTypeboxDetail = () => {
  const navigate = useNavigate();

  const [Id_tipebox, setId_tipebox] = useState("");
  const [nama, setNama] = useState("");
  const [rumusPanjang, setRumusPanjang] = useState("");
  const [rumusLebar, setRumusLebar] = useState("");
  const [rumusOversize, setRumusOversize] = useState("");
  const [KonstantaPanjang, setKonstantaPanjang] = useState("");
  const [KonstantaLebar, setKonstantaLebar] = useState("");

  const Validator = () => {
    if (
      !(
        Id_tipebox &&
        rumusPanjang &&
        rumusLebar &&
        rumusOversize &&
        KonstantaPanjang &&
        KonstantaLebar
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
        HOST + "/marketing/tipebox_detail/input",
        {
          id_tipebox: Number(Id_tipebox),
          nama,
          rumusPanjang,
          rumusLebar,
          rumusOversize,
          konstantaPanjang: JSON.parse(KonstantaPanjang),
          konstantaLebar: JSON.parse(KonstantaLebar),
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
          <Header title="Tambah Typebox Detail" />
          <CgClose
            className="text-4xl cursor-pointer"
            onClick={() => {
              navigate("/dashboard/master/type-box%20detail");
            }}
          />
        </div>
        <form>
          <div className="flex items-end justify-evenly">
            <table className="font-semibold">
              <tr>
                <td>ID Typebox</td>
                <td>:</td>
                <td>
                  <input
                    type="text"
                    className="border-b-2 focus:outline-none focus:border-blue-700 w-[300px]"
                    value={Id_tipebox}
                    onChange={(e) => {
                      setId_tipebox(e.target.value);
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
                      setNama(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Rumus Panjang</td>
                <td>:</td>
                <td>
                  <input
                    type="text"
                    className="border-b-2 focus:outline-none focus:border-blue-700 w-[300px] "
                    value={rumusPanjang}
                    onChange={(e) => {
                      setRumusPanjang(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Rumus Lebar</td>
                <td>:</td>
                <td>
                  <input
                    type="email"
                    className="border-b-2 focus:outline-none focus:border-blue-700 w-[300px] "
                    value={rumusLebar}
                    onChange={(e) => {
                      setRumusLebar(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Rumus Oversize</td>
                <td>:</td>
                <td>
                  <input
                    type="text"
                    className="border-b-2 focus:outline-none focus:border-blue-700 w-[300px] "
                    value={rumusOversize}
                    onChange={(e) => {
                      setRumusOversize(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Konstanta Panjang</td>
                <td>:</td>
                <td className="flex gap-4">
                  <label>
                    <input
                      type="radio"
                      name="KonstantaPanjang"
                      value="true"
                      checked={KonstantaPanjang === "true"}
                      onChange={(e) => {
                        setKonstantaPanjang(e.target.value);
                      }}
                      required
                    />
                    True
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="KonstantaPanjang"
                      value="false"
                      checked={KonstantaPanjang === "false"}
                      onChange={(e) => {
                        setKonstantaPanjang(e.target.value);
                      }}
                      required
                    />
                    false
                  </label>
                </td>
              </tr>
              <tr>
                <td>Konstanta Lebar</td>
                <td>:</td>
                <td className="flex gap-4">
                  <label>
                    <input
                      type="radio"
                      name="KonstantaLebar"
                      value="true"
                      checked={KonstantaLebar === "true"}
                      onChange={(e) => {
                        setKonstantaLebar(e.target.value);
                      }}
                      required
                    />
                    True
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="KonstantaLebar"
                      value="false"
                      checked={KonstantaLebar === "false"}
                      onChange={(e) => {
                        setKonstantaLebar(e.target.value);
                      }}
                      required
                    />
                    false
                  </label>
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
export default TambahTypeboxDetail;
