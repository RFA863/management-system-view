import axios from "axios";
import { getCookie } from "cookies-next";
import { CgClose } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { HOST } from "../../config";
import { Header } from "../../components";

const TambahUser = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [posisi, setPosisi] = useState("");
  const [Akses, setAkses] = useState("");


  const Validator = () => {
    const isNumeric = (input) => {
      // Menggunakan ekspresi reguler untuk mengecek apakah input hanya berisi karakter angka
      const numericRegex = /^[0-9]+$/;
      return numericRegex.test(input);
    };

    if (!
      email &&
      password &&
      posisi &&
      Akses
      
      )
        
     {
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
        HOST + "/marketing/user/input",
        {
         
          email,
          password,
          posisi,
          akses:JSON.parse(Akses)
       
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
          <Header title="Tambah User" />
          <CgClose
            className="text-4xl cursor-pointer"
            onClick={() => {
              navigate("/dashboard/master/user");
            }}
          />
        </div>
        <form>
          <div className="flex items-end justify-evenly">
            <table className="font-semibold">
              
              <tr>
                <td>Email</td>
                <td>:</td>
                <td>
                  <input
                    type="text"
                    className="border-b-2 focus:outline-none focus:border-blue-700 w-[300px] "
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>

              <tr>
                <td>Password</td> 
                <td>:</td>
                <td>
                  <input
                    type="text"
                    className="border-b-2 focus:outline-none focus:border-blue-700 w-[300px] "
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>

              <tr>
                <td>Posisi</td>
                <td>:</td>
                <td>
                  <input
                    type="text"
                    className="border-b-2 focus:outline-none focus:border-blue-700 w-[300px] "
                    value={posisi}
                    onChange={(e) => {
                      setPosisi(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Akses</td>
                <td>:</td>
                <td className="flex gap-4">
                  <label>
                    <input
                      type="radio"
                      name="npwp"
                      value="true"
                      checked={Akses === "true"}
                      onChange={(e) => {
                        setAkses(e.target.value);
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
                      checked={Akses === "false"}
                      onChange={(e) => {
                        setAkses(e.target.value);
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
export default TambahUser;
