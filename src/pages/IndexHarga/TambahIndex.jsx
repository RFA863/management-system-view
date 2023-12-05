import axios from "axios";
import { getCookie } from "cookies-next";
import { CgClose } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { HOST } from "../../config";
import { Header } from "../../components";

import "react-toastify/dist/ReactToastify.css";

const TambahIndex = () => {
  const navigate = useNavigate();

  const [Id_customer, setIdCustomer] = useState("");
  const [Id_kualitasDetail, setKualitasDetail] = useState("");
  const [IndexValue, setIndexValue] = useState("");
  

  const Validator = () => {
   

    if (
      !(
        Id_customer &&
        Id_kualitasDetail &&
        IndexValue
        
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
        HOST + "/marketing/index/input",
        {
          id_customer: Number(Id_customer),
          id_kualitasDetail: Number(Id_kualitasDetail),
          indexValue: Number(IndexValue),
         
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
          <Header title="Tambah Customer" />
          <CgClose
            className="text-4xl cursor-pointer"
            onClick={() => {
              navigate("/dashboard/index/index");
            }}
          />
        </div>
        <form>
          <div className="flex items-end justify-evenly">
            <table className="font-semibold">
              
              <tr>
                <td>ID Customer</td>
                <td>:</td>
                <td>
                  <input
                    type="text"
                    className="border-b-2 focus:outline-none focus:border-blue-700 w-[300px] "
                    value={Id_customer}
                    onChange={(e) => {
                      setIdCustomer(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>ID Kualitas Detail</td>
                <td>:</td>
                <td>
                  <input
                    type="text"
                    className="border-b-2 focus:outline-none focus:border-blue-700 w-[300px] "
                    value={Id_kualitasDetail}
                    onChange={(e) => {
                      setKualitasDetail(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Index Value</td>
                <td>:</td>
                <td>
                  <input
                    type="text"
                    className="border-b-2 focus:outline-none focus:border-blue-700 w-[300px] "
                    value={IndexValue}
                    onChange={(e) => {
                      setIndexValue(e.target.value);
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
export default TambahIndex;
