import axios from "axios";
import Select from "react-select";
import { getCookie } from "cookies-next";
import { CgClose } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { HOST } from "../../config";
import { Header } from "../../components";

const TambahKualitasTipeBox = () => {
  const navigate = useNavigate();

  const [Kuping, setKuping] = useState("");
  const [idTipeBox, setIdTipeBox] = useState();
  const [idKualitas, setIdKualitas] = useState();
  const [konstantaPanjang, setKonstantaPanjang] = useState("");
  const [konstantaLebarGenap, setKonstantaLebarGenap] = useState("");
  const [konstantaLebarGanjil, setKonstantaLebarGanjil] = useState("");

  const [tipeBox, setTipeBox] = useState([]);
  const [kualitas, setKualitas] = useState([]);

  const Validator = () => {
    if (
      !(Kuping, konstantaPanjang, konstantaLebarGanjil, konstantaLebarGenap) ||
      idKualitas === null ||
      idTipeBox === null
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

  const getKualitas = async () => {
    await axios
      .get(HOST + "/marketing/kualitas/get", {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: getCookie("admin_auth"),
        },
      })
      .then((response) => {
        const listKualitas = response.data.data;

        setKualitas(() =>
          listKualitas.map((item) => ({
            label: item.nama,
            value: item.id,
          }))
        );
      })
      .catch((error) => {
        if (error.response.status == 401) {
          navigate("/dashboard/login");
        }
      });
  };

  const getTipeBox = async () => {
    await axios
      .get(HOST + "/marketing/tipebox/get", {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: getCookie("admin_auth"),
        },
      })
      .then((response) => {
        const listTipeBox = response.data.data;

        setTipeBox(() =>
          listTipeBox.map((item) => ({
            label: item.nama,
            value: item.id,
          }))
        );
      })
      .catch((error) => {
        if (error.response.status == 401) {
          navigate("/dashboard/login");
        }
      });
  };

  const postData = async (e) => {
    e.preventDefault();

    if (!Validator()) {
      return;
    }
    await axios
      .post(
        HOST + "/marketing/kualitas_tipebox/input",
        {
          kuping: Number(Kuping),
          id_tipebox: idTipeBox.value,
          id_kualitas: idKualitas.value,
          konstanta_panjang: Number(konstantaPanjang),
          konstanta_lebar_genap: Number(konstantaLebarGenap),
          konstanta_lebar_ganjil: Number(konstantaLebarGanjil),
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

  useEffect(() => {
    getTipeBox();
    getKualitas();
  }, []);

  return (
    <div>
      <div className="m-2 md:m-10 mt-24 px-2 py-10 md:p-10 bg-white rounded-3xl ">
        <div className="flex justify-between">
          <Header title="Tambah Kualitas Tipe Box" />
          <CgClose
            className="text-4xl cursor-pointer"
            onClick={() => {
              navigate("/dashboard/master/kualitas-type%20box");
            }}
          />
        </div>
        <form>
          <div className="flex items-end justify-evenly">
            <table className="border-separate border-spacing-y-2">
              <tr>
                <td>Tipe Box</td>
                <td className="px-4">:</td>
                <td>
                  <Select
                    options={tipeBox}
                    isClearable={true}
                    value={idTipeBox}
                    onChange={(e) => {
                      setIdTipeBox(e);
                    }}
                    required
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                  />
                </td>
              </tr>

              <tr>
                <td>Kualitas</td>
                <td className="px-4">:</td>
                <td>
                  <Select
                    options={kualitas}
                    isClearable={true}
                    value={idKualitas}
                    onChange={(e) => {
                      setIdKualitas(e);
                    }}
                    required
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                  />
                </td>
              </tr>

              <tr>
                <td>Konstanta Panjang</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="text"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={konstantaPanjang}
                    onChange={(e) => {
                      setKonstantaPanjang(
                        e.target.value.replace(/[^0-9-]/g, "")
                      );
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Konstanta Lebar Ganjil</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="text"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={konstantaLebarGanjil}
                    onChange={(e) => {
                      setKonstantaLebarGanjil(
                        e.target.value.replace(/[^0-9-]/g, "")
                      );
                    }}
                    required
                  />
                </td>
              </tr>

              <tr>
                <td>Konstanta Lebar Genap</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="text"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={konstantaLebarGenap}
                    onChange={(e) => {
                      setKonstantaLebarGenap(
                        e.target.value.replace(/[^0-9-]/g, "")
                      );
                    }}
                    required
                  />
                </td>
              </tr>

              <tr>
                <td>Kuping</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="text"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={Kuping}
                    onChange={(e) => {
                      setKuping(e.target.value.replace(/[^0-9-]/g, ""));
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
export default TambahKualitasTipeBox;
