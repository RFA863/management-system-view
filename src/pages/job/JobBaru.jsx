import axios from "axios";
import Select from "react-select";
import { getCookie } from "cookies-next";
import { CgClose } from "react-icons/cg";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { HOST } from "../../config";
import { Header } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";

const JobBaru = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [Id_TipeBox, setIdTipeBox] = useState();
  const [Id_KualitasDetail, setIdKualitasDetail] = useState();
  const [Panjang, setPanjang] = useState("");
  const [Lebar, setLebar] = useState("");
  const [Tinggi, setTinggi] = useState("");
  const [ukuranKirim, setUkuranKirim] = useState("");
  const [warna, setWarna] = useState("");
  const [perekat, setPerekat] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [Jumlah, setJumlah] = useState();
  const [panjangKirim, setPanjangKirim] = useState("0");
  const [lebarKirim, setLebarKirim] = useState("0");
  const [tinggiKirim, setTinggiKirim] = useState("0");

  const [tipeBox, setTipeBox] = useState([]);
  const [kualitasDetail, setKualitasDetail] = useState([]);

  const { data, setData } = useStateContext();

  const Validator = () => {
    if (
      !(
        Id_TipeBox &&
        Id_KualitasDetail &&
        Panjang &&
        Lebar &&
        Tinggi &&
        ukuranKirim &&
        Jumlah
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
        if (error.response.status === 401) {
          navigate("/dashboard/login");
        }
      });
  };

  const getKualitasDetail = async () => {
    await axios
      .get(HOST + "/marketing/kualitasdetail/get", {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: getCookie("admin_auth"),
        },
      })
      .then((response) => {
        const listKualitasDetail = response.data.data;

        setKualitasDetail(() =>
          listKualitasDetail.map((item) => ({
            label: item.kualitas + "||" + item.nama + "||" + item.kode,
            value: item.id,
          }))
        );
      })
      .catch((error) => {
        if (error.response.status === 401) {
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
        HOST + "/marketing/job/input/" + id,
        {
          id_tipebox: Id_TipeBox.value,
          id_kualitas_detail: Id_KualitasDetail.value,
          panjang: Number(Panjang),
          lebar: Number(Lebar),
          tinggi: Number(Tinggi),
          ukuran_kirim: JSON.parse(ukuranKirim),
          ukuran_pengiriman:
            panjangKirim + " x " + lebarKirim + " x " + tinggiKirim,
          warna,
          perekat,
          keterangan,
          jumlah: Number(Jumlah),
          index_harga: false,
          index_panjang: 0,
          index_lebar: 0,
          penambahan_harga: 0,
          pengurangan_harga: 0,
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
          // const idOrder = response.data.data;
          // setData(idOrder);
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
    getKualitasDetail();
    // setData([]);
  }, []);

  //   useEffect(() => {
  //     if (data.length !== 0) {
  //       navigate("/dashboard/order/detail");
  //     }
  //   }, [data]);

  return (
    <div>
      <div className="m-2 md:m-10 mt-24 px-2 py-10 md:p-10 bg-white rounded-3xl ">
        <div className="flex justify-between">
          <Header title="Job Baru" />
          <CgClose
            className="text-4xl cursor-pointer"
            onClick={() => {
              navigate("/dashboard/order/detail/" + id);
            }}
          />
        </div>
        <form>
          <table className="border-separate border-spacing-y-2">
            <tr>
              <td>Type Box</td>
              <td className="px-4">:</td>
              <td>
                <Select
                  options={tipeBox}
                  isClearable={true}
                  value={Id_TipeBox}
                  onChange={(e) => {
                    setIdTipeBox(e);
                  }}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>Kualitas</td>
              <td className="px-4">:</td>
              <td>
                <Select
                  options={kualitasDetail}
                  isClearable={true}
                  value={Id_KualitasDetail}
                  onChange={(e) => {
                    setIdKualitasDetail(e);
                  }}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>Ukuran</td>
              <td className="px-4">:</td>
              <td>
                <label className="flex gap-x-2 items-center">
                  Panjang
                  <input
                    type="text"
                    pattern="[0-9]*"
                    value={Panjang}
                    onChange={(e) =>
                      setPanjang(e.target.value.replace(/\D/g, ""))
                    }
                    required
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                  />
                </label>
              </td>
              <td>
                <label className="flex gap-x-2 items-center">
                  Lebar
                  <input
                    type="text"
                    pattern="[0-9]*"
                    value={Lebar}
                    onChange={(e) =>
                      setLebar(e.target.value.replace(/\D/g, ""))
                    }
                    required
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                  />
                </label>
              </td>
              <td>
                <label className="flex gap-x-2 items-center">
                  Tinggi
                  <input
                    type="text"
                    pattern="[0-9]*"
                    value={Tinggi}
                    onChange={(e) =>
                      setTinggi(e.target.value.replace(/\D/g, ""))
                    }
                    required
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                  />
                </label>
              </td>
            </tr>
            <tr>
              <td>Ukuran Surat Jalan</td>
              <td className="px-4">:</td>
              <td className="flex gap-4">
                <label className="flex gap-2">
                  <input
                    type="radio"
                    name="surat_jalan"
                    value={"true"}
                    checked={ukuranKirim === "true"}
                    onChange={(e) => setUkuranKirim(e.target.value)}
                    required
                  />
                  Sama
                </label>
                <label className="flex gap-2">
                  <input
                    type="radio"
                    name="surat_jalan"
                    value={"false"}
                    checked={ukuranKirim === "false"}
                    onChange={(e) => setUkuranKirim(e.target.value)}
                    required
                  />
                  Berbeda
                </label>
              </td>
            </tr>
            {ukuranKirim === "false" && (
              <tr>
                <td>Ukuran Pengiriman</td>
                <td className="px-4">:</td>
                <td>
                  <label className="flex gap-x-2 items-center">
                    Panjang
                    <input
                      type="text"
                      value={panjangKirim}
                      onChange={(e) =>
                        setPanjangKirim(e.target.value.replace(/\D/g, ""))
                      }
                      required
                      className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    />
                  </label>
                </td>
                <td>
                  <label className="flex gap-x-2 items-center">
                    Lebar
                    <input
                      type="text"
                      value={lebarKirim}
                      onChange={(e) =>
                        setLebarKirim(e.target.value.replace(/\D/g, ""))
                      }
                      required
                      className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    />
                  </label>
                </td>
                <td>
                  <label className="flex gap-x-2 items-center">
                    Tinggi
                    <input
                      type="text"
                      value={tinggiKirim}
                      onChange={(e) =>
                        setTinggiKirim(e.target.value.replace(/\D/g, ""))
                      }
                      required
                      className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    />
                  </label>
                </td>
              </tr>
            )}

            <tr>
              <td>Warna</td>
              <td className="px-4">:</td>
              <td>
                <input
                  type="text"
                  value={warna}
                  onChange={(e) => setWarna(e.target.value)}
                  required
                  className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                />
              </td>
            </tr>
            <tr>
              <td>Perekat</td>
              <td className="px-4">:</td>
              <td>
                <input
                  type="text"
                  value={perekat}
                  onChange={(e) => setPerekat(e.target.value)}
                  required
                  className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                />
              </td>
            </tr>
            <tr>
              <td>Keterangan</td>
              <td className="px-4">:</td>
              <td colSpan={3}>
                <input
                  type="text"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  required
                  className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                />
              </td>
            </tr>
            <tr>
              <td>Jumlah</td>
              <td className="px-4">:</td>
              <td>
                <input
                  type="text"
                  value={Jumlah}
                  onChange={(e) => setJumlah(e.target.value.replace(/\D/g, ""))}
                  required
                  className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                />
              </td>
            </tr>
          </table>
          <button
            className="bg-blue-700 rounded-xl text-white px-4 py-2"
            onClick={postData}
          >
            Next
          </button>
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
export default JobBaru;
