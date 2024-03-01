import axios from "axios";
import Select from "react-select";
import { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { getCookie } from "cookies-next";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import { HOST } from "../../config";
import { Header } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";

import "react-toastify/dist/ReactToastify.css";

const UpdateIndex = () => {
  const navigate = useNavigate();
  const { data } = useStateContext();

  if (data.length === 0) {
    navigate("/dashboard/index/index");
  }

  const [Id_customer, setIdCustomer] = useState({
    value: data.id_customer,
    label: data.Customer,
  });
  const [Id_kualitasDetail, setIdKualitasDetail] = useState({
    value: data.id_kualitasdetail,
    label: data.Kualitas_Detail,
  });
  const [IndexValue, setIndexValue] = useState(
    parseInt(data.indexvalue.replace(/\D+/g, ""))
  );

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
          listCustomer.map((item, index) => ({
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

  const updateData = async (e) => {
    e.preventDefault();

    if (!Validator()) {
      return;
    }
    await axios
      .put(
        HOST + "/marketing/index/update/" + data.id,
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
          navigate("/dashboard/index/index");
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
          <p>{data.Nama}</p>
          <Header title="Update Index" />
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
export default UpdateIndex;
