import axios from "axios";
import Select from "react-select";
import { useState, useEffect } from "react";
import { CgClose } from "react-icons/cg";
import { getCookie } from "cookies-next";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import { HOST } from "../../config";
import { Header } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";

import "react-toastify/dist/ReactToastify.css";

const UpdateTypeboxDetail = () => {
  const navigate = useNavigate();
  const { data } = useStateContext();

  if (data.length === 0) {
    navigate("/dashboard/master/type-box%20detail");
  }

  const [Id_tipebox, setId_tipebox] = useState({
    value: data.id_tipebox,
    label: data.tipebox,
  });
  const [nama, setNama] = useState(data.Nama);
  const [rumusPanjang, setRumusPanjang] = useState(data.rumus_panjang);
  const [rumusLebar, setRumusLebar] = useState(data.rumus_lebar);
  const [rumusOversize, setRumusOversize] = useState(data.rumus_oversize);
  const [tipebox, setTipeBox] = useState([]);

  const Validator = () => {
    if (!(Id_tipebox && rumusPanjang && rumusLebar && rumusOversize)) {
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
      .put(
        HOST + "/marketing/tipebox_detail/update/" + data.id,
        {
          id_tipebox: Id_tipebox.value,
          nama,
          rumusPanjang,
          rumusLebar,
          rumusOversize,
          // konstantaPanjang: JSON.parse(KonstantaPanjang),
          // konstantaLebar: JSON.parse(KonstantaLebar),
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
          navigate("/dashboard/master/type-box%20detail");
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

  const get = async () => {
    await axios
      .get(HOST + "/marketing/tipebox/get", {
        headers: {
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

  useEffect(() => {
    get();
  }, []);

  return (
    <div>
      <div className="m-2 md:m-10 mt-24 px-2 py-10 md:p-10 bg-white rounded-3xl ">
        <div className="flex justify-between">
          <Header title="Update Typebox Detail" />
          <CgClose
            className="text-4xl cursor-pointer"
            onClick={() => {
              navigate("/dashboard/master/type-box%20detail");
            }}
          />
        </div>
        <form>
          <div className="flex items-end justify-evenly">
            <table className="border-separate border-spacing-y-2">
              <tr>
                <td>ID Typebox</td>
                <td className="px-4">:</td>
                <td>
                  <td>
                    <Select
                      options={tipebox}
                      value={Id_tipebox}
                      onChange={(e) => {
                        setId_tipebox(e);
                      }}
                      isClearable={true}
                      required
                    />
                  </td>
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
                <td>Rumus Panjang</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="text"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
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
                <td className="px-4">:</td>
                <td>
                  <input
                    type="email"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
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
                <td className="px-4">:</td>
                <td>
                  <input
                    type="text"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={rumusOversize}
                    onChange={(e) => {
                      setRumusOversize(e.target.value);
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
export default UpdateTypeboxDetail;
