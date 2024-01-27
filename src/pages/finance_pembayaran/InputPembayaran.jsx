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
import { convertPixelToValue } from "@syncfusion/ej2/lineargauge";

const InputPembayaran = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const gridRef = useRef(null);

  const [tglKontraBon, setTglKontraBon] = useState();
  const [tglBayar, setTglBayar] = useState();
  const [MetodeBayar, setmetodeBayar] = useState();
  const [TotalBayar, setTotalBayar] = useState("");
  const [Pembulatan, setlPembulatan] = useState("0");
  const [keterangan, setKeterangan] = useState("");

  const [invoice, setInvoice] = useState([]);

  const getInvoice = async () => {
    await axios
      .get(HOST + "/finance/invoice/get/" + id, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: getCookie("admin_auth"),
        },
      })
      .then((response) => {
        const listInvoice = response.data.data;
        console.log(listInvoice);

        setInvoice([
          {
            id: listInvoice.id,
            no_invoice: listInvoice.no_invoice,
            customer: listInvoice.customer,
            nama_barang:
              "BOX " +
              listInvoice.kualitas +
              " Uk. " +
              listInvoice.ukuran_pengiriman,
            jumlah: listInvoice.jumlah,
            dpp: "Rp. " + listInvoice.total_harga.toLocaleString("id-ID"),
            ppn: "Rp. " + listInvoice.nominal_ppn.toLocaleString("id-ID"),
            total_bayar:
              "Rp. " + listInvoice.harga_bayar.toLocaleString("id-ID"),
          },
        ]);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          navigate("/dashboard/login");
        }
      });
  };

  const Validator = () => {
    if (
      !(
        tglKontraBon &&
        tglBayar &&
        MetodeBayar &&
        TotalBayar &&
        Pembulatan &&
        keterangan
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
        HOST + "/finance/pembayaran/input/" + id,
        {
          tglKontraBon,
          tglBayar,
          metodeBayar: MetodeBayar.value,
          totalBayar: Number(TotalBayar),
          pembulatan: Number(Pembulatan),
          keterangan,
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

  const PayMethod = [
    { value: "Transfer", label: "Transfer" },
    { value: "Cek/Giro", label: "Cek/Giro" },
    { value: "Cash", label: "Cash" },
  ];

  const dataBound = () => {
    if (gridRef.current) {
      gridRef.current.autoFitColumns();
    }
  };

  useEffect(() => {
    getInvoice();
  }, []);

  useEffect(() => {
    console.log(invoice);
  }, [invoice]);

  return (
    <div>
      <div className="m-2 md:m-10 mt-24 px-2 py-10 md:p-10 bg-white rounded-3xl ">
        <div className="flex justify-between">
          <Header title="Input Pembayaran" />
          <CgClose
            className="text-4xl cursor-pointer"
            onClick={() => {
              navigate("/dashboard/invoice/belum-bayar");
            }}
          />
        </div>
        <form>
          <div className="flex items-end justify-evenly">
            <table className="border-separate border-spacing-y-2">
              <tr>
                <td>Tanggal Kontra Bon</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="date"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={tglKontraBon}
                    onChange={(e) => {
                      setTglKontraBon(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Tanggal Bayar</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="date"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={tglBayar}
                    onChange={(e) => {
                      setTglBayar(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Metode Bayar</td>
                <td className="px-4">:</td>
                <td>
                  <Select
                    options={PayMethod}
                    isClearable={true}
                    value={MetodeBayar}
                    onChange={(e) => {
                      setmetodeBayar(e);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Total Bayar</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="text"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={TotalBayar}
                    onChange={(e) => {
                      setTotalBayar(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Pembulatan</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="text"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={Pembulatan}
                    onChange={(e) => {
                      setlPembulatan(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Keterangan</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="text"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={keterangan}
                    onChange={(e) => {
                      setKeterangan(e.target.value);
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

        <div className="overflow-x-auto">
          <div className="w-fit cursor-pointer">
            <GridComponent
              dataSource={invoice}
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
                  field="no_invoice"
                  headerText="No. Invoice"
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
                  field="dpp"
                  headerText="DPP"
                  textAlign="center"
                />

                <ColumnDirective
                  field="ppn"
                  headerText="PPN"
                  textAlign="center"
                />

                <ColumnDirective
                  field="total_bayar"
                  headerText="Harga Bayar"
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

export default InputPembayaran;
