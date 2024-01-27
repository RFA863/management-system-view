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

const UpdateSuratJalan = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const gridRef = useRef(null);

  const [idSupir, setIdSupir] = useState();
  const [idMobil, setIdMobil] = useState();
  const [Selesai, setSelesai] = useState("");
  const [CloseOrder, setCloseOrder] = useState("");
  const [tanggalKirim, setTanggalKirim] = useState("");
  const [noSuratJalan, setNoSuratJalan] = useState("");

  const [job, setJob] = useState([]);
  const [supir, setSupir] = useState([]);
  const [mobil, setMobil] = useState([]);

  const Validator = () => {
    // const isNumeric = (input) => {
    //   // Menggunakan ekspresi reguler untuk mengecek apakah input hanya berisi karakter angka
    //   const numericRegex = /^[0-9]+$/;
    //   return numericRegex.test(input);
    // };

    if (
      !(
        idSupir &&
        idMobil &&
        tanggalKirim &&
        CloseOrder &&
        Selesai &&
        noSuratJalan
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

  const getSupir = async () => {
    await axios
      .get(HOST + "/marketing/supir/get", {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: getCookie("admin_auth"),
        },
      })
      .then((response) => {
        const listSupir = response.data.data;

        setSupir(() =>
          listSupir.map((item) => ({
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

  const getMobil = async () => {
    await axios
      .get(HOST + "/marketing/mobil/get", {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: getCookie("admin_auth"),
        },
      })
      .then((response) => {
        const listMobil = response.data.data;

        setMobil(() =>
          listMobil.map((item) => ({
            label: item.noplat,
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

  const getJob = async () => {
    await axios
      .get(HOST + "/marketing/Job/get/" + id, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: getCookie("admin_auth"),
        },
      })
      .then((response) => {
        const listJob = response.data.data;

        setJob([
          {
            id: listJob.id,
            id_order: listJob.id_order,
            no_nt: listJob.no_nt,
            nama_barang:
              "BOX " + listJob.kualitas + " Uk. " + listJob.ukuran_pengiriman,
            jumlah: listJob.jumlah,
            keterangan: listJob.keterangan,
          },
        ]);
      })
      .catch((error) => {
        if (error.response.status == 401) {
          navigate("/dashboard/login");
        }
      });
  };

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

        setIdSupir({
          value: listSuratJalan.id_supir,
          label: listSuratJalan.supir,
        });
        setIdMobil({
          value: listSuratJalan.id_mobil,
          label: listSuratJalan.no_plat,
        });
        setTanggalKirim(listSuratJalan.tanggal_kirim);
        setCloseOrder(String(listSuratJalan.close_order));
        setSelesai(listSuratJalan.selesai);
        setNoSuratJalan(listSuratJalan.no_suratjalan);
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
        HOST + "/ekspedisi/suratjalan/update/" + id,
        {
          tanggalKirim,
          noSuratJalan,
          id_supir: idSupir.value,
          id_mobil: idMobil.value,
          selesai: Number(Selesai),
          closeOrder: JSON.parse(CloseOrder),
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
    getSupir();
    getMobil();
    getJob();
    getSuratJalan();
  }, []);

  return (
    <div>
      <div className="m-2 md:m-10 mt-24 px-2 py-10 md:p-10 bg-white rounded-3xl ">
        <div className="flex justify-between">
          <Header title="Update Surat Jalan" />
          <CgClose
            className="text-4xl cursor-pointer"
            onClick={() => {
              navigate("/dashboard/surat-jalan/surat-jalan");
            }}
          />
        </div>

        <form>
          <div className="flex items-end justify-evenly">
            <table className="border-separate border-spacing-y-2">
              <tr>
                <td>No. Surat Jalan</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="text"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={noSuratJalan}
                    onChange={(e) => {
                      setNoSuratJalan(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Supir</td>
                <td className="px-4">:</td>
                <td>
                  <Select
                    options={supir}
                    isClearable={true}
                    value={idSupir}
                    onChange={(e) => {
                      setIdSupir(e);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Mobil</td>
                <td className="px-4">:</td>
                <td>
                  <Select
                    options={mobil}
                    isClearable={true}
                    value={idMobil}
                    onChange={(e) => {
                      setIdMobil(e);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Tanggal Kirim</td>
                <td className="px-4">:</td>
                <td>
                  <input
                    type="date"
                    className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                    value={tanggalKirim}
                    onChange={(e) => {
                      setTanggalKirim(e.target.value);
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Close Order</td>
                <td className="px-4">:</td>
                <td className="flex gap-4">
                  <label>
                    <input
                      type="radio"
                      name="CloseOrder"
                      value="true"
                      checked={CloseOrder === "true"}
                      onChange={(e) => {
                        setCloseOrder(e.target.value);
                      }}
                      required
                    />
                    True
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="CloseOrder"
                      value="false"
                      checked={CloseOrder === "false"}
                      onChange={(e) => {
                        setCloseOrder(e.target.value);
                      }}
                      required
                    />
                    false
                  </label>
                </td>
              </tr>
              {CloseOrder === "true" && (
                <tr>
                  <td>Pesanan Selesai</td>
                  <td className="px-4">:</td>
                  <td>
                    <input
                      type="text"
                      className="w-full border-2 py-1 px-2 rounded-md focus:outline-none focus:border-blue-700"
                      value={Selesai}
                      onChange={(e) => {
                        setSelesai(e.target.value);
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
              dataSource={job}
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
                  field="id_order"
                  headerText="id_customer"
                  visible={false}
                />

                <ColumnDirective
                  field="no_nt"
                  headerText="No. NT"
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
                  field="keterangan"
                  headerText="Keterangan"
                  textAlign="left"
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

export default UpdateSuratJalan;
