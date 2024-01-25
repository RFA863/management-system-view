import axios from "axios";

import { getCookie } from "cookies-next";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";

import {
  GridComponent,
  Inject,
  ColumnsDirective,
  ColumnDirective,
  Search,
  Page,
  Sort,
  Toolbar,
  Resize,
} from "@syncfusion/ej2-react-grids";

import { HOST } from "../../config";
import { Header, PageLoading } from "../../components";

import "react-toastify/dist/ReactToastify.css";

const InvoiceLunas = () => {
  const navigate = useNavigate();

  const gridRef = useRef(null);
  const [suratJalan, setSuratJalan] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  const fetchData = async () => {
    await axios
      .get(HOST + "/finance/pembayaran/getLunas", {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: getCookie("admin_auth"),
        },
      })
      .then((response) => {
        const suratJalanList = response.data.data;

        setSuratJalan(() =>
          suratJalanList.map((item, index) => ({
            id: item.id,
            No: index + 1,
            id_invoice: item.id_invoice,
            id_job: item.id_job,
            tgl_kontrabon:
              item.tgl_kontrabon.split("-")[2] +
              "-" +
              item.tgl_kontrabon.split("-")[1] +
              "-" +
              item.tgl_kontrabon.split("-")[0],
            tgl_bayar:
              item.tgl_bayar.split("-")[2] +
              "-" +
              item.tgl_bayar.split("-")[1] +
              "-" +
              item.tgl_bayar.split("-")[0],
            tgl_cair: item.tgl_cair,
            metode_bayar: item.metode_bayar,
            total_bayar: "Rp. " + item.total_bayar.toLocaleString(),
            pembulatan: "Rp. " + item.pembulatan.toLocaleString(),
            sisa_bayar: "Rp. " + item.sisa_bayar.toLocaleString(),
            dpp: "Rp. " + item.dpp.toLocaleString(),
            ppn: "Rp. " + item.ppn.toLocaleString(),
            total_harga: "Rp. " + item.total_harga.toLocaleString(),
          }))
        );
      })
      .catch((error) => {
        if (error.response.status == 401) {
          navigate("/dashboard/login");
        }
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (suratJalan.length !== 0) {
      setPageLoading(false);
    }
  }, [suratJalan]);

  const dataBound = () => {
    if (gridRef.current) {
      gridRef.current.autoFitColumns();
    }
  };

  const rowSelected = () => {
    if (gridRef.current.selectionModule.focus.prevIndexes.cellIndex === 12) {
      // setData(gridRef.current.selectionModule.data);
    }
  };

  return pageLoading ? (
    <PageLoading />
  ) : (
    <div>
      <ToastContainer hideProgressBar={true} autoClose={2000} theme="colored" />
      <div className="m-2 md:m-10 mt-24 px-2 py-10 md:p-10 bg-white rounded-3xl">
        <Header title="Invoice Lunas" />
        {/* <div className="mb-4 -mt-4">
          <button
            className="bg-blue-700 rounded-xl text-white px-4 py-2"
            onClick={() => {
              navigate("/dashboard/customer/tambah");
            }}
          >
            Tambah Customer
          </button>
        </div> */}
        <div className="overflow-x-auto">
          <div className="w-fit cursor-pointer">
            <GridComponent
              dataSource={suratJalan}
              width="auto"
              allowPaging
              allowSorting
              allowTextWrap={true}
              pageSettings={{
                pageCount: 5,
                pageSizes: ["All", "10", "25", "50"],
              }}
              textWrapSettings={{ wrapMode: "Content" }}
              toolbar={["Search"]}
              selectionSettings={{ type: "Single", mode: "Both" }}
              rowSelected={rowSelected}
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
                  field="id_invoice"
                  headerText="Id Invoice"
                  visible={false}
                />

                <ColumnDirective
                  field="id_job"
                  headerText="Id Job"
                  visible={false}
                />

                <ColumnDirective
                  field="No"
                  headerText="No."
                  textAlign="center"
                />

                <ColumnDirective
                  field="tgl_kontrabon"
                  headerText="Tanggal Kontrabon"
                  textAlign="center"
                />

                <ColumnDirective
                  field="tgl_bayar"
                  headerText="Tanggal Bayar"
                  textAlign="center"
                />

                {/* <ColumnDirective
                  field="tgl_cair"
                  headerText="Tanggal Cair"
                  textAlign="center"
                /> */}
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
                  field="total_harga"
                  headerText="Harga Total"
                  textAlign="center"
                />

                <ColumnDirective
                  field="metode_bayar"
                  headerText="Metode Bayar"
                  textAlign="center"
                />

                <ColumnDirective
                  field="total_bayar"
                  headerText="Total Bayar"
                  textAlign="center"
                />

                <ColumnDirective
                  field="pembulatan"
                  headerText="Pembulatan"
                  textAlign="center"
                />

                <ColumnDirective
                  field="sisa_bayar"
                  headerText="Sisa"
                  textAlign="center"
                />

                {/* <ColumnDirective headerText="Action" template={actionButton} /> */}
              </ColumnsDirective>
              <Inject services={[Search, Toolbar, Page, Sort, Resize]} />
            </GridComponent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceLunas;
