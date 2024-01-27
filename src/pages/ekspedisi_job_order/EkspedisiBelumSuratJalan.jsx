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

const EkspedisiBelumSuratJalan = () => {
  const navigate = useNavigate();

  const [id, setId] = useState();

  const gridRef = useRef(null);
  const [detailOrder, setDetailOrder] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  const fetchData = async () => {
    await axios
      .get(HOST + "/ekspedisi/order_detail/get_no_suratjalan", {
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
            id_order: item.id_order,
            id_customer: item.id_customer,
            id_kualitas_detail: item.id_kualitas_detail,
            no_job: item.no_job,
            jumlah: item.jumlah,
            sisa: item.sisa,
            selesai: item.selesai,
            no_po: item.no_po,
            tanggal_order: item.tanggal_order,
            tanggal_kirim: item.tanggal_kirim,
            customer: item.customer[0],
            kualitas: item.kualitas,
            ukuran: item.ukuran,
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
    setId();
  }, []);

  // useEffect(() => {
  //   if (detailOrder.length !== 0) {
  //     setPageLoading(false);
  //   }
  // }, [detailOrder]);

  const dataBound = () => {
    if (gridRef.current) {
      gridRef.current.autoFitColumns();
    }
  };

  const rowSelected = () => {
    if (gridRef.current.selectionModule.focus.prevIndexes.cellIndex === 15) {
      setId(gridRef.current.selectionModule.data.id);
    }
  };

  useEffect(() => {
    if (id) {
      navigate("/dashboard/ekspedisi/surat-jalan/input/" + id);
    }
  }, [id]);

  const actionButton = () => {
    return (
      <div>
        <button
          className="bg-blue-700 rounded-xl py-2 px-4 text-white m-0"
          onClick={() => rowSelected()}
        >
          Create
        </button>
      </div>
    );
  };

  return (
    //  pageLoading ? (
    //   <PageLoading />
    // ) : (
    <div>
      <ToastContainer hideProgressBar={true} autoClose={2000} theme="colored" />
      <div className="m-2 md:m-10 mt-24 px-2 py-10 md:p-10 bg-white rounded-3xl">
        <Header title="Belum Surat Jalan" />
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
                  field="id_order"
                  headerText="Id Order"
                  visible={false}
                />

                <ColumnDirective
                  field="id_customer"
                  headerText="Id Customer"
                  visible={false}
                />

                <ColumnDirective
                  field="id_kualitas_detail"
                  headerText="Id Kualitas Detail"
                  visible={false}
                />

                <ColumnDirective
                  field="No"
                  headerText="No"
                  textAlign="Center"
                />
                <ColumnDirective
                  field="no_po"
                  headerText="No. PO"
                  textAlign="Center"
                />
                <ColumnDirective
                  field="no_job"
                  headerText="No. Job"
                  textAlign="Center"
                />
                <ColumnDirective
                  field="customer"
                  headerText="Customer"
                  textAlign="left"
                />
                <ColumnDirective
                  field="kualitas"
                  headerText="Kualitas"
                  textAlign="left"
                />
                <ColumnDirective
                  field="ukuran"
                  headerText="Ukuran"
                  textAlign="left"
                />
                <ColumnDirective
                  field="tanggal_order"
                  headerText="Tanggal Order"
                  textAlign="center"
                />
                <ColumnDirective
                  field="tanggal_kirim"
                  headerText="Tanggal Kirim"
                  textAlign="center"
                />
                <ColumnDirective
                  field="jumlah"
                  headerText="Quantity"
                  textAlign="center"
                />

                <ColumnDirective
                  field="sisa"
                  headerText="Sisa"
                  textAlign="center"
                />

                <ColumnDirective
                  field="selesai"
                  headerText="Keluar"
                  textAlign="center"
                />

                <ColumnDirective headerText="Action" template={actionButton} />
              </ColumnsDirective>
              <Inject services={[Search, Toolbar, Page, Sort, Resize]} />
            </GridComponent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EkspedisiBelumSuratJalan;
