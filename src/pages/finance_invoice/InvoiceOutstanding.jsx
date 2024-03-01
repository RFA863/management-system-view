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

const InvoiceOutstanding = () => {
  const navigate = useNavigate();
  const [id, setId] = useState(0);
  const [getActionButton, setActionButton] = useState("");

  const [invoice, setInvoice] = useState([]);
  const gridRef = useRef(null);

  const fetchData = async () => {
    await axios
      .get(HOST + "/finance/pembayaran/getOutstanding", {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: getCookie("admin_auth"),
        },
      })
      .then((response) => {
        const listInvoice = response.data.data;

        setInvoice(() =>
          listInvoice.map((item, index) => ({
            id: item.id,
            No: index + 1,
            id_suratjalan: item.id_suratjalan,
            id_job: item.id_job,
            id_customer: item.id_customer,
            no_invoice: item.no_invoice,
            tanggal:
              item.tanggal.split("-")[2] +
              "-" +
              item.tanggal.split("-")[1] +
              "-" +
              item.tanggal.split("-")[0],
            nominal_ppn: "Rp. " + item.ppn.toLocaleString("id-ID"),
            harga_bayar: "Rp. " + item.total_harga.toLocaleString("id-ID"),
            total_bayar: "Rp. " + item.total_bayar.toLocaleString("id-ID"),
            sisa_bayar: "Rp. " + item.sisa_bayar.toLocaleString("id-ID"),
            dpp: "Rp. " + item.dpp.toLocaleString("id-ID"),
            customer: item.customer,
          }))
        );
      })
      .catch((error) => {
        if (error.response.status === 401) {
          navigate("/dashboard/login");
        }
      });
  };

  useEffect(() => {
    setId(0);
    fetchData();
  }, []);

  const dataBound = () => {
    if (gridRef.current) {
      gridRef.current.autoFitColumns();
    }
  };

  const rowSelected = () => {
    if (gridRef.current.selectionModule.focus.prevIndexes.cellIndex === 13) {
      setId(gridRef.current.selectionModule.data.id);
    }
  };

  useEffect(() => {
    if (getActionButton === "update" && id !== 0) {
      navigate("/dashboard/invoice/update/" + id);
    } else if (getActionButton === "bayar" && id !== 0) {
      navigate("/dashboard/pembayaran/update/" + id);
    }
  }, [id, getActionButton]);

  const actionButton = () => {
    return (
      <div className="flex gap-2">
        <button
          className="bg-blue-700 rounded-xl py-2 px-4 text-white m-0"
          onClick={() => {
            setActionButton("update");
          }}
        >
          Update
        </button>
        <button
          className="bg-green-700 rounded-xl py-2 px-4 text-white m-0"
          onClick={() => {
            setActionButton("bayar");
          }}
        >
          Bayar
        </button>
      </div>
    );
  };

  // return pageLoading ? (
  //   <PageLoading />
  // ) : (
  return (
    <div>
      <ToastContainer hideProgressBar={true} autoClose={2000} theme="colored" />
      <div className="m-2 md:m-10 mt-24 px-2 py-10 md:p-10 bg-white rounded-3xl">
        <Header title="Invoice Outstanding" />

        <div className="overflow-x-auto">
          <div className="w-fit cursor-pointer">
            <GridComponent
              dataSource={invoice}
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
                  field="id_customer"
                  headerText="Id Customer"
                  visible={false}
                />

                <ColumnDirective
                  field="id_job"
                  headerText="Id Job"
                  visible={false}
                />

                <ColumnDirective
                  field="id_suratjalan"
                  headerText="Id Surat Jalan"
                  visible={false}
                />

                <ColumnDirective
                  field="No"
                  headerText="No"
                  textAlign="Center"
                />

                <ColumnDirective
                  field="no_invoice"
                  headerText="No.Invoice"
                  textAlign="Center"
                />

                <ColumnDirective
                  field="tanggal"
                  headerText="Tanggal"
                  textAlign="Center"
                />

                <ColumnDirective
                  field="customer"
                  headerText="Customer"
                  textAlign="Left"
                />

                <ColumnDirective
                  field="dpp"
                  headerText="DPP"
                  textAlign="Center"
                />

                <ColumnDirective
                  field="nominal_ppn"
                  headerText="PPN"
                  textAlign="Left"
                />

                <ColumnDirective
                  field="harga_bayar"
                  headerText="Harga Bayar"
                  textAlign="Center"
                />

                <ColumnDirective
                  field="total_bayar"
                  headerText="Total Bayar"
                  textAlign="Center"
                />

                <ColumnDirective
                  field="sisa_bayar"
                  headerText="Sisa Bayar"
                  textAlign="Center"
                />

                <ColumnDirective
                  headerText="Action"
                  template={actionButton}
                  textAlign="center"
                />
              </ColumnsDirective>
              <Inject services={[Search, Toolbar, Page, Sort, Resize]} />
            </GridComponent>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InvoiceOutstanding;
