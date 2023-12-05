import axios from "axios";
import Swal from "sweetalert2";
import { CgClose } from "react-icons/cg";
import { getCookie } from "cookies-next";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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
import { Header, PageLoading } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";

import "react-toastify/dist/ReactToastify.css";

const Detail = () => {
  const navigate = useNavigate();

  const { data, setData } = useStateContext();
  const [getActionButton, setActionButton] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [order, setOrder] = useState([]);
  const [jobOrder, setJobOrder] = useState([]);
  const gridRef = useRef(null);

  if (data.length === 0) {
    navigate("/dashboard/order/list");
  }

  const fetchData = async () => {
    await axios
      .get(HOST + "/marketing/order/getDetail/" + data.id, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: getCookie("admin_auth"),
        },
      })
      .then((response) => {
        const listOrder = response.data.data;
        setOrder([listOrder]);
        // setOrder(() =>
        //   listOrder.map((item, index) => ({
        //     id: item.id,
        //     No: index + 1,
        //     id_customer: item.id_customer,
        //     no_po: item.no_po,
        //     tanggal_order: item.tanggal_order,
        //     tanggal_kirim: item.tanggal_kirim,
        //     Customer: item.Customer,
        //   }))
        // );
      })
      .catch((error) => {
        if (error.response.status === 401) {
          navigate("/dashboard/login");
        }
      });
  };

  const fetchJobOrder = async () => {
    await axios
      .get(HOST + "/marketing/job/getJobOrder/" + data.id, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: getCookie("admin_auth"),
        },
      })
      .then((response) => {
        const listOrder = response.data.data;
        // setOrder([listOrder]);
        setJobOrder(() =>
          listOrder.map((item, index) => ({
            id: item.id,
            No: index + 1,
            id_order: item.id_order,
            id_tipebox: item.id_tipebox,
            id_kualitas_detai: item.id_kualitas_detail,
            id_kualitas: item.id_kualitas,
            id_customer: item.id_customer,
            no_job: item.no_job,
            no_nt: item.no_nt,
            tipebox: item.tipebox,
            kualitas: item.kualitas,
            kualitas_detail: item.kualitas_detail,
            jumlah: item.jumlah,
            warna: item.warna,
            perekat: item.perekat,
            ukuran: item.ukuran,
            harga: item.harga,
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
    // setData([]);
    fetchData();
    fetchJobOrder();
  }, []);

  useEffect(() => {
    if (order.length !== 0) {
      setPageLoading(false);
    }
  }, [order]);

  const dataBound = () => {
    if (gridRef.current) {
      gridRef.current.autoFitColumns();
    }
  };

  const rowSelected = () => {
    if (gridRef.current.selectionModule.focus.prevIndexes.cellIndex === 12) {
      setData(gridRef.current.selectionModule.data);
    }
  };

  useEffect(() => {
    if (getActionButton === "update" && data.length !== 0) {
      navigate("/dashboard/customer/update");
    } else if (getActionButton === "delete" && data.length !== 0) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!" + data.Nama,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        console.log(result);
        if (result.isConfirmed) {
          deleteData();
        } else if (result.isDismissed) {
          setData([]);
        }
      });
    }
  }, [data, getActionButton]);

  const actionButton = () => {
    return (
      <button
        className="bg-blue-700 rounded-xl py-2 px-4 text-white m-0"
        // onClick={() => {
        //   setActionButton("update");
        // }}
      >
        Update
      </button>
    );
  };

  return pageLoading ? (
    <PageLoading />
  ) : (
    <div>
      <ToastContainer hideProgressBar={true} autoClose={2000} theme="colored" />
      <div className="m-2 md:m-10 mt-24 px-2 py-10 md:p-10 bg-white rounded-3xl">
        <div className="flex justify-between">
          <Header title="Order Detail" />
          <CgClose
            className="text-4xl cursor-pointer"
            onClick={() => {
              navigate("/dashboard/order/list");
            }}
          />
        </div>

        <div className="overflow-x-auto">
          <div className="w-fit cursor-pointer">
            <GridComponent
              dataSource={order}
              width="auto"
              allowSorting
              allowTextWrap={true}
              textWrapSettings={{ wrapMode: "Content" }}
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
                  headerText="id_customer"
                  visible={false}
                />
                <ColumnDirective
                  field="no_po"
                  headerText="No. PO"
                  textAlign="Center"
                />
                <ColumnDirective
                  field="Customer"
                  headerText="Customer"
                  textAlign="Center"
                />
                <ColumnDirective
                  field="tanggal_order"
                  headerText="Tanggal Order"
                  textAlign="Center"
                />
                <ColumnDirective
                  field="tanggal_kirim"
                  headerText="Tanggal Kirim"
                  textAlign="Center"
                />

                <ColumnDirective
                  headerText="Action"
                  template={actionButton}
                  textAlign="Center"
                />
              </ColumnsDirective>
              <Inject services={[Sort, Resize]} />
            </GridComponent>
          </div>
          <div className="my-10">
            <button
              className="bg-blue-700 rounded-xl text-white px-4 py-2"
              // onClick={() => {
              //   navigate("/dashboard/order/order-baru");
              // }}
            >
              Job Baru
            </button>
          </div>
          <div className="w-fit cursor-pointer">
            <GridComponent
              dataSource={jobOrder}
              width="auto"
              allowSorting
              textWrapSettings={{ wrapMode: "Content" }}
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
                  field="id_tipebox"
                  headerText="Id Tipe Box"
                  visible={false}
                />

                <ColumnDirective
                  field="id_kualitas_detail"
                  headerText="Id Kualitas Detail"
                  visible={false}
                />

                <ColumnDirective
                  field="id_kualitas"
                  headerText="Id Kualitas"
                  visible={false}
                />

                <ColumnDirective
                  field="id_customer"
                  headerText="id_customer"
                  visible={false}
                />

                <ColumnDirective
                  field="no_nt"
                  headerText="No. NT"
                  textAlign="Center"
                />

                <ColumnDirective
                  field="no_job"
                  headerText="No. Job"
                  textAlign="Center"
                />

                <ColumnDirective
                  field="tipebox"
                  headerText="Type Box"
                  textAlign="Center"
                />

                <ColumnDirective
                  field="kualitas"
                  headerText="Kualitas"
                  textAlign="Center"
                />

                <ColumnDirective
                  field="kualitas_detail"
                  headerText="Kualitas Detail"
                  textAlign="Center"
                />

                <ColumnDirective
                  field="jumlah"
                  headerText="Jumlah"
                  textAlign="Center"
                />

                <ColumnDirective
                  field="ukuran"
                  headerText="Ukuran"
                  textAlign="Center"
                />

                <ColumnDirective
                  field="warna"
                  headerText="Warna"
                  textAlign="Center"
                />

                <ColumnDirective
                  field="perekat"
                  headerText="Perekat"
                  textAlign="Center"
                />

                <ColumnDirective
                  field="harga"
                  headerText="Harga"
                  textAlign="Center"
                />

                <ColumnDirective
                  headerText="Action"
                  template={actionButton}
                  textAlign="Center"
                />
              </ColumnsDirective>
              <Inject services={[Sort, Resize]} />
            </GridComponent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
