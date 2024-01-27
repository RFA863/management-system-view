import axios from "axios";
import Select from "react-select";
import { getCookie } from "cookies-next";
import { CgClose } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { HOST } from "../../config";
import { Header } from "../../components";

import "react-toastify/dist/ReactToastify.css";

const TambahIndex = () => {
  const navigate = useNavigate();

  const [Id_customer, setIdCustomer] = useState();
  const [Id_kualitasDetail, setIdKualitasDetail] = useState();
  const [IndexValue, setIndexValue] = useState("");

  const [customer, setCustomer] = useState([]);
  const [kualitasDetail, setKualitasDetail] = useState([]);

  const Validator = () => {
    if (!(Id_customer && Id_kualitasDetail && IndexValue)) {
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

  const getCustomer = async () => {
    await axios
      .get(HOST + "/marketing/customer/get", {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: getCookie("admin_auth"),
        },
      })
      .then((response) => {
        const listCustomer = response.data.data;

        setCustomer(() =>
          listCustomer.map((item) => ({
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
          listKualitasDetail.map((item, index) => ({
            label: item.kualitas + " | " + item.nama,
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
        HOST + "/marketing/index/input",
        {
          id_customer: Id_customer.value,
          id_kualitasDetail: Id_kualitasDetail.value,
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
    getCustomer();
    getKualitasDetail();
  }, []);

  return (
    <div>
      <div className="m-2 md:m-10 mt-24 px-2 py-10 md:p-10 bg-white rounded-3xl ">
        <div className="flex justify-between">
          <Header title="Tambah Index" />
          <CgClose
            className="text-4xl cursor-pointer"
            onClick={() => {
              navigate("/dashboard/index/index");
            }}
          />
        </div>
        <form>
          <div className="flex items-end justify-evenly">
            <table className="border-separate border-spacing-y-2">
              <tr>
                <td>Customer</td>
                <td className="px-4">:</td>
                <td>
                  <Select
                    options={customer}
                    isClearable={true}
                    value={Id_customer}
                    onChange={(e) => {
                      setIdCustomer(e);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Kualitas Detail</td>
                <td className="px-4">:</td>

                <td>
                  <Select
                    options={kualitasDetail}
                    isClearable={true}
                    value={Id_kualitasDetail}
                    onChange={(e) => {
                      setIdKualitasDetail(e);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Index Value</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="text"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={IndexValue}
                    onChange={(e) => {
                      setIndexValue(e.target.value.replace(/[^0-9-]/g, ""));
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
export default TambahIndex;
