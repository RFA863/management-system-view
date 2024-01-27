import axios from "axios";
import Select from "react-select";
import { getCookie } from "cookies-next";
import { CgClose } from "react-icons/cg";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";

import {
  GridComponent,
  Inject,
  ColumnsDirective,
  ColumnDirective,
  Sort,
  Resize,
} from "@syncfusion/ej2-react-grids";

import { HOST } from "../../config";
import { Header } from "../../components";

const Input_invoice = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const gridRef = useRef(null);

  const [noInvoice, setnoInvoice] = useState();
  const [tanggal, setTanggal] = useState();
  const [Berikat, setBerikat] = useState("");
  const [Ppn, setPpn] = useState("11");
  const [UbahHarga, setUbahHarga] = useState("false");
  const [Harga, setHarga] = useState("");

  const [suratJalan, setSuratJalan] = useState([]);

  const getSuratJalan = async () => {
    await axios
      .get(HOST + "/ekspedisi/suratjalan/get/" + id, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: getCookie("admin_auth"),
        },
      })
      .then((response) => {
        const listSuratJalan = response.data.data;

        setSuratJalan([
          {
            id: listSuratJalan.id,
            no_suratjalan: listSuratJalan.no_suratjalan,
            customer: listSuratJalan.customer,
            nama_barang:
              "BOX " +
              listSuratJalan.kualitas +
              " Uk. " +
              listSuratJalan.ukuran_pengiriman,
            jumlah: listSuratJalan.selesai,
            harga_satuan: "Rp. " + listSuratJalan.harga_satuan.toLocaleString(),
            total_harga: "Rp. " + listSuratJalan.total_harga.toLocaleString(),
          },
        ]);
        setHarga(listSuratJalan.total_harga);
      })
      .catch((error) => {
        if (error.response.status == 401) {
          navigate("/dashboard/login");
        }
      });
  };

  const Validator = () => {
    if (!(noInvoice && tanggal && Berikat && Ppn)) {
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
        HOST + "/finance/invoice/input/" + id,
        {
          noInvoice,
          tanggal,
          ppn: Number(Ppn),
          berikat: JSON.parse(Berikat),
          ubahHarga: JSON.parse(UbahHarga),
          harga: Number(Harga),
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

  const dataBound = () => {
    if (gridRef.current) {
      gridRef.current.autoFitColumns();
    }
  };

  useEffect(() => {
    getSuratJalan();
  }, []);

  return (
    <div>
      <div className="m-2 md:m-10 mt-24 px-2 py-10 md:p-10 bg-white rounded-3xl ">
        <div className="flex justify-between">
          <Header title="Input Invoice" />
          <CgClose
            className="text-4xl cursor-pointer"
            onClick={() => {
              navigate("/dashboard/job-order/belum-dibuat%20surat%20jalan");
            }}
          />
        </div>
        <form>
          <div className="flex items-end justify-evenly">
            <table className="border-separate border-spacing-y-2">
              <tr>
                <td>No. Invoice</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="text"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={noInvoice}
                    onChange={(e) => {
                      setnoInvoice(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>

              <tr>
                <td>Tanggal</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="date"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={tanggal}
                    onChange={(e) => {
                      setTanggal(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Berikat</td>
                <td className="px-4">:</td>
                <td className="flex gap-4">
                  <label>
                    <input
                      type="radio"
                      name="Berikat"
                      value="true"
                      checked={Berikat === "true"}
                      onChange={(e) => {
                        setBerikat(e.target.value);
                      }}
                      required
                    />
                    True
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="Berikat"
                      value="false"
                      checked={Berikat === "false"}
                      onChange={(e) => {
                        setBerikat(e.target.value);
                      }}
                      required
                    />
                    false
                  </label>
                </td>
              </tr>

              <tr>
                <td>PPN</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="text"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={Ppn}
                    onChange={(e) => {
                      setPpn(e.target.value);
                    }}
                  />
                </td>
              </tr>

              <tr>
                <td>Ubah Harga</td>
                <td className="px-4">:</td>
                <td className="flex gap-4">
                  <label>
                    <input
                      type="radio"
                      name="UbahHarga"
                      value="true"
                      checked={UbahHarga === "true"}
                      onChange={(e) => {
                        setUbahHarga(e.target.value);
                      }}
                      required
                    />
                    Ya
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="UbahHarga"
                      value="false"
                      checked={UbahHarga === "false"}
                      onChange={(e) => {
                        setUbahHarga(e.target.value);
                      }}
                      required
                    />
                    Tidak
                  </label>
                </td>
              </tr>
              {UbahHarga === "true" && (
                <tr>
                  <td>Harga</td>
                  <td className="px-4">:</td>
                  <td>
                    <input
                      type="text"
                      className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                      value={Harga}
                      onChange={(e) => {
                        setHarga(e.target.value);
                      }}
                    />
                  </td>
                </tr>
              )}
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

        <div className="overflow-x-auto">
          <div className="w-fit cursor-pointer">
            <GridComponent
              dataSource={suratJalan}
              width="auto"
              allowSorting
              allowTextWrap={true}
              textWrapSettings={{ wrapMode: "Content" }}
              selectionSettings={{ type: "Single", mode: "Both" }}
              dataBound={dataBound}
              ref={gridRef}
            >
              <ColumnsDirective>
                <ColumnDirective
                  field="id"
                  headerText="Id"
                  isPrimaryKey={true}
                  visible={false}
                />

                <ColumnDirective
                  field="no_suratjalan"
                  headerText="No. Surat Jalan"
                  textAlign="Center"
                />

                <ColumnDirective
                  field="customer"
                  headerText="Customer"
                  textAlign="Center"
                />

                <ColumnDirective
                  field="nama_barang"
                  headerText="Nama Barang"
                  textAlign="left"
                />

                <ColumnDirective
                  field="jumlah"
                  headerText="Quantity"
                  textAlign="Center"
                />

                <ColumnDirective
                  field="harga_satuan"
                  headerText="Harga Satuan"
                  textAlign="center"
                />

                <ColumnDirective
                  field="total_harga"
                  headerText="Total Harga"
                  textAlign="center"
                />

                {/* <ColumnDirective
                  headerText="Action"
                  template={updateOrder}
                  textAlign="Center"
                /> */}
              </ColumnsDirective>
              <Inject services={[Sort, Resize]} />
            </GridComponent>
          </div>
        </div>
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

export default Input_invoice;
