import axios from "axios";
import Select from "react-select";
import { getCookie } from "cookies-next";
import { CgClose } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { HOST } from "../../config";
import { Header } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";

const JobBaru = () => {
  //   const navigate = useNavigate();

  //   const [Id_Customer, setIdCustomer] = useState();
  //   const [noPo, setNoPo] = useState("");
  //   const [tanggalOrder, setTanggalOrder] = useState("");
  //   const [tanggalKirim, setTanggalKirim] = useState("");
  //   const [customer, setCustomer] = useState([]);

  //   const { data, setData } = useStateContext();

  //   const Validator = () => {
  //     if (!(Id_Customer && noPo && tanggalOrder && tanggalKirim)) {
  //       toast.error("Data must be entered", {
  //         position: "top-center",
  //         autoClose: 5000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "colored",
  //       });

  //       return false;
  //     }

  //     return true;
  //   };

  //   const getCustomer = async () => {
  //     await axios
  //       .get(HOST + "/marketing/customer/get", {
  //         headers: {
  //           "ngrok-skip-browser-warning": "true",
  //           Authorization: getCookie("admin_auth"),
  //         },
  //       })
  //       .then((response) => {
  //         const listCustomer = response.data.data;

  //         setCustomer(() =>
  //           listCustomer.map((item, index) => ({
  //             label: item.nama,
  //             value: item.id,
  //           }))
  //         );
  //       })
  //       .catch((error) => {
  //         if (error.response.status == 401) {
  //           navigate("/dashboard/login");
  //         }
  //       });
  //   };

  //   const postData = async (e) => {
  //     e.preventDefault();

  //     if (!Validator()) {
  //       return;
  //     }
  //     await axios
  //       .post(
  //         HOST + "/marketing/order/input",
  //         {
  //           id_customer: Id_Customer.value,
  //           noPo,
  //           tanggalOrder,
  //           tanggalKirim,
  //         },
  //         {
  //           headers: {
  //             "ngrok-skip-browser-warning": true,
  //             Authorization: getCookie("admin_auth"),
  //           },
  //         }
  //       )
  //       .then((response) => {
  //         if (response.status === 200) {
  //           const idOrder = response.data.data;
  //           setData(idOrder);
  //           toast.success("Data successfully inputted", {
  //             position: "top-center",
  //             autoClose: 5000,
  //             hideProgressBar: false,
  //             closeOnClick: true,
  //             pauseOnHover: true,
  //             draggable: true,
  //             progress: undefined,
  //             theme: "colored",
  //           });
  //         }
  //       })
  //       .catch((error) => {
  //         if (error.response) {
  //           if (
  //             error.response.data.type === "token" &&
  //             error.response.data.data.code === -2
  //           ) {
  //             navigate("/dashboard/login");
  //           }
  //           toast.error(error.response.data.message, {
  //             position: "top-center",
  //             autoClose: 5000,
  //             hideProgressBar: false,
  //             closeOnClick: true,
  //             pauseOnHover: true,
  //             draggable: true,
  //             progress: undefined,
  //             theme: "colored",
  //           });
  //         } else {
  //           toast.error("Internal Server Error, Try again later !", {
  //             position: "top-center",
  //             autoClose: 5000,
  //             hideProgressBar: false,
  //             closeOnClick: true,
  //             pauseOnHover: true,
  //             draggable: true,
  //             progress: undefined,
  //             theme: "colored",
  //           });
  //         }
  //       });
  //   };

  //   useEffect(() => {
  //     getCustomer();
  //     setData([]);
  //   }, []);

  //   useEffect(() => {
  //     if (data.length !== 0) {
  //       navigate("/dashboard/order/detail");
  //     }
  //   }, [data]);

  return (
    <div>
      <div className="m-2 md:m-10 mt-24 px-2 py-10 md:p-10 bg-white rounded-3xl ">
        <div className="flex justify-between">
          <Header title="Order Baru" />
          <CgClose
            className="text-4xl cursor-pointer"
            onClick={() => {
              navigate("/dashboard/order/list");
            }}
          />
        </div>
        <form>
          <table className="border-separate border-spacing-y-2">
            <tr>
              <td>No.Job</td>
              <td>:</td>
              <td>
                <input
                  type="text"
                  className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                />
              </td>
            </tr>
            <tr>
              <td>Type Box</td>
              <td>:</td>
              <td>
                <input
                  type="text"
                  className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                />
              </td>
            </tr>
            <tr>
              <td>Kualitas</td>
              <td>:</td>
              <td>
                <input
                  type="text"
                  className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                />
              </td>
            </tr>
            <tr>
              <td>Ukuran</td>
              <td>:</td>
              <td>
                <label>Panjang</label>
                <input
                  type="text"
                  className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                />
              </td>
              <td>
                <label>Lebar</label>
                <input
                  type="text"
                  className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                />
              </td>
              <td>
                <label>Tinggi</label>
                <input
                  type="text"
                  className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                />
              </td>
            </tr>
            <tr>
              <td>Ukuran Surat Jalan</td>
              <td>:</td>
              <td>
                <input
                  type="text"
                  className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                />
              </td>
            </tr>
            <tr>
              <td>Warna</td>
              <td>:</td>
              <td>
                <input
                  type="text"
                  className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                />
              </td>
            </tr>
            <tr>
              <td>Perekat</td>
              <td>:</td>
              <td>
                <input
                  type="text"
                  className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                />
              </td>
            </tr>
            <tr>
              <td>Keterangan</td>
              <td>:</td>
              <td>
                <input
                  type="text"
                  className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                />
              </td>
            </tr>
            <tr>
              <td>Jumlah</td>
              <td>:</td>
              <td>
                <input
                  type="text"
                  className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                />
              </td>
            </tr>
            <tr>
              <td>Index</td>
              <td>:</td>
              <td>
                <input
                  type="text"
                  className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                />
              </td>
            </tr>
            <tr>
              <td>Penambahan Panjang </td>
              <td>:</td>
              <td>
                <input
                  type="text"
                  className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                />
              </td>
            </tr>
            <tr>
              <td>Penambahan Lebar</td>
              <td>:</td>
              <td>
                <input
                  type="text"
                  className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                />
              </td>
            </tr>
            <tr>
              <td>Penambahan Harga</td>
              <td>:</td>
              <td>
                <input
                  type="text"
                  className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                />
              </td>
            </tr>
            <tr>
              <td>Pengurangan Harga</td>
              <td>:</td>
              <td>
                <input
                  type="text"
                  className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                />
              </td>
            </tr>
          </table>
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
