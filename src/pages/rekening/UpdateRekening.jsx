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

const UpdateRekening = () => {
  const navigate = useNavigate();
  const { data } = useStateContext();

  if (data.length === 0) {
    navigate("/dashboard/master/user");
  }
  const [bank, setbank] = useState(data.bank);
  const [noRekening, setnoRekening] = useState(data.noRekening);
  const [atasNama, setatasNama] = useState(data.atasNama);
  const [CT, setCT] = useState(data.CT);


  const Validator = () => {
    const isNumeric = (input) => {
      // Menggunakan ekspresi reguler untuk mengecek apakah input hanya berisi karakter angka
      const numericRegex = /^[0-9]+$/;
      return numericRegex.test(input);
    };

    if (
      !(
       
        bank &&
        noRekening &&
        atasNama &&
        CT
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

  const updateData = async (e) => {
    e.preventDefault();

    if (!Validator()) {
      return;
    }
    await axios
      .put(
        HOST + "/marketing/rekening/update/" + data.id,
        {
          bank,
          noRekening,
          atasNama,
          ct:JSON.parse(CT)
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

          navigate("/dashboard/master/rekening/");
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
          <p>{data.Nama}</p>
          <Header title="Update Rekening" />
          <CgClose
            className="text-4xl cursor-pointer"
            onClick={() => {
              navigate("/dashboard/master/rekening/");
            }}
          />
        </div>
        <form>
          <div className="flex items-end justify-evenly">
            <table className="font-semibold">
              
            <tr>
                <td>Bank</td>
                <td>:</td>
                <td>
                  <input
                    type="text"
                    className="border-b-2 focus:outline-none focus:border-blue-700 w-[300px] "
                    value={bank}
                    onChange={(e) => {
                      setbank(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>No.Rekening</td>
                <td>:</td>
                <td>
                  <input
                    type="text"
                    className="border-b-2 focus:outline-none focus:border-blue-700 w-[300px] "
                    value={noRekening}
                    onChange={(e) => {
                      setnoRekening(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Atas Nama</td>
                <td>:</td>
                <td>
                  <input
                    type="text"
                    className="border-b-2 focus:outline-none focus:border-blue-700 w-[300px] "
                    value={atasNama}
                    onChange={(e) => {
                      setatasNama(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>CT</td>
                <td>:</td>
                <td className="flex gap-4">
                  <label>
                    <input
                      type="radio"
                      value="true"
                      checked={CT === "true"}
                      onChange={(e) => {
                        setCT(e.target.value);
                      }}
                      required
                    />
                    True
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="false"
                      checked={CT === "false"}
                      onChange={(e) => {
                        setCT(e.target.value);
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
export default UpdateRekening;
