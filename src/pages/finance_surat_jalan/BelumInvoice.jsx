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

const BelumInvoice= () => {
  const navigate = useNavigate();

  const gridRef = useRef(null);
  const [detailOrder, setDetailOrder] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  const fetchData = async () => {
    await axios
      .get(HOST + "/finance/list_suratjalan/getNoPayment", {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: getCookie("admin_auth"),
        },
      })
      .then((response) => {
        const listOrderDetail = response.data.data;

        setDetailOrder(() =>
          listOrderDetail.map((item, index) => ({
            id: item.id,
            No: index + 1,
            no_suratjalan: item.no_suratjalan,
            tanggal_kirim: item.tanggal_kirim,
            id_supir: item.id_supir,
            id_mobil: item.id_mobil,
            
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
    if (detailOrder.length !== 0) {
      setPageLoading(false);
    }
  }, [detailOrder]);

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
        <Header title="List Surat Jalan" />
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
              dataSource={detailOrder}
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
                  field="No"
                  headerText="No."
                  textAlign="center"
                />
                <ColumnDirective
                  field="no_suratjalan"
                  headerText="No. Surat Jalan"
                  textAlign="center"
                />

                <ColumnDirective
                  field="tanggal_kirim"
                  headerText="Tanggal Kirim"
                  textAlign="center"
                />

                <ColumnDirective
                  field="id_supir"
                  headerText="Supir"
                  textAlign="center"                />

                <ColumnDirective
                  field="id_mobil"
                  headerText="No. Mobil"
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
}

export default BelumInvoice;