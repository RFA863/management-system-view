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

const UpdateMobil = () => {
  const navigate = useNavigate();
  const { data } = useStateContext();

  if (data.length === 0) {
    navigate("/dashboard/master/mobil/");
  }

  const [noPlat, setnoPlat] = useState(data.Noplat);

  const Validator = () => {
    const isNumeric = (input) => {
      // Menggunakan ekspresi reguler untuk mengecek apakah input hanya berisi karakter angka
      const numericRegex = /^[0-9]+$/;
      return numericRegex.test(input);
    };

    if (!noPlat) {
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

  const updateData = async (e) => {
    e.preventDefault();

    if (!Validator()) {
      return;
    }
    await axios
      .put(
        HOST + "/marketing/mobil/update/" + data.id,
        {
          noPlat,
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

          navigate("/dashboard/master/mobil");
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
          <p>{data.noPlat}</p>
          <Header title="Update Mobil" />
          <CgClose
            className="text-4xl cursor-pointer"
            onClick={() => {
              navigate("/dashboard/master/mobil");
            }}
          />
        </div>
        <form>
          <div className="flex items-end justify-evenly">
            <table className="border-separate border-spacing-y-2">
              <tr>
                <td>No. Plat</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="text"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={noPlat}
                    onChange={(e) => {
                      setnoPlat(e.target.value);
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
export default UpdateMobil;
