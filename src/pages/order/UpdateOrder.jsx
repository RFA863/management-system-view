import axios from "axios";
import Select from "react-select";
import { getCookie } from "cookies-next";
import { CgClose } from "react-icons/cg";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { HOST } from "../../config";
import { Header } from "../../components";

const UpdateOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [Id_Customer, setIdCustomer] = useState();
  const [noPo, setNoPo] = useState("");
  const [tanggalOrder, setTanggalOrder] = useState("");
  const [tanggalKirim, setTanggalKirim] = useState("");
  const [customer, setCustomer] = useState([]);

  const getOrder = async () => {
    await axios
      .get(HOST + "/marketing/order/getDetail/" + id, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: getCookie("admin_auth"),
        },
      })
      .then((response) => {
        const listOrder = response.data.data;

        console.log(listOrder[0].tanggal_order);

        setNoPo(listOrder[0].no_po);
        setTanggalOrder(listOrder[0].tanggal_order);
        setTanggalKirim(listOrder[0].tanggal_kirim);

        setIdCustomer({
          label: listOrder[0].Customer,
          value: listOrder[0].id_customer,
        });
      })
      .catch((error) => {
        if (error.response.status == 401) {
          navigate("/dashboard/login");
        }
      });
  };

  const Validator = () => {
    if (!(Id_Customer && noPo && tanggalOrder && tanggalKirim)) {
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

  const postData = async (e) => {
    e.preventDefault();

    if (!Validator()) {
      return;
    }
    await axios
      .put(
        HOST + "/marketing/order/update/" + id,
        {
          id_customer: Id_Customer.value,
          noPo,
          tanggalOrder,
          tanggalKirim,
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
          navigate("/dashboard/order/detail/" + id);
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
    getOrder();
    getCustomer();
  }, []);

  return (
    <div>
      <div className="m-2 md:m-10 mt-24 px-2 py-10 md:p-10 bg-white rounded-3xl ">
        <div className="flex justify-between">
          <Header title="Update Order" />
          <CgClose
            className="text-4xl cursor-pointer"
            onClick={() => {
              navigate("/dashboard/order/detail/" + id);
            }}
          />
        </div>
        <form>
          <div className=" mx-10 font-semibold">
            <div>
              <div className="my-2">
                <p>Customer</p>
                <Select
                  options={customer}
                  isClearable={true}
                  value={Id_Customer}
                  onChange={(e) => {
                    setIdCustomer(e);
                  }}
                  required
                />
              </div>
              <div className="my-2">
                <p>No. PO</p>
                <input
                  type="text"
                  className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                  value={noPo}
                  onChange={(e) => setNoPo(e.target.value)}
                  required
                />
              </div>
              <div className="my-2">
                <p>Tanggal Order</p>
                <input
                  type="date"
                  className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                  value={tanggalOrder}
                  onChange={(e) => setTanggalOrder(e.target.value)}
                  required
                />
              </div>
              <div className="my-2">
                <p>Tanggal Kirim</p>
                <input
                  type="date"
                  className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                  value={tanggalKirim}
                  onChange={(e) => setTanggalKirim(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-center">
                <button
                  className="bg-blue-700 rounded-xl text-white px-4 py-2"
                  onClick={postData}
                >
                  Submit
                </button>
              </div>
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
export default UpdateOrder;
