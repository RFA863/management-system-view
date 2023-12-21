import axios from "axios";
import { getCookie } from "cookies-next";
import { CgClose } from "react-icons/cg";
import { useNavigate, useParams } from "react-router-dom";
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
import { Header } from "../../components";

import "react-toastify/dist/ReactToastify.css";

const CustomerOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [idOrder, setIdOrder] = useState();
  const [order, setOrder] = useState([]);
  const gridRef = useRef(null);

  const fetchData = async () => {
    await axios
      .get(HOST + "/marketing/order/get_customer/" + id, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: getCookie("admin_auth"),
        },
      })
      .then((response) => {
        const listOrder = response.data.data;

        setOrder(() =>
          listOrder.map((item, index) => ({
            id: item.id,
            No: index + 1,
            id_customer: item.id_customer,
            no_po: item.no_po,
            tanggal_order: item.tanggal_order,
            tanggal_kirim: item.tanggal_kirim,
            Customer: item.Customer[0],
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
    setIdOrder();
    fetchData();
  }, []);

  //   useEffect(() => {
  //     if (order.length !== 0) {
  //       setPageLoading(false);
  //     }
  //   }, [order]);

  const dataBound = () => {
    if (gridRef.current) {
      gridRef.current.autoFitColumns();
    }
  };

  const rowSelected = () => {
    if (gridRef.current.selectionModule.focus.prevIndexes.cellIndex === 7) {
      setIdOrder(gridRef.current.selectionModule.data.id);
      // navigate("/dashboard/order/detail/" + id);
    }
  };

  useEffect(() => {
    if (idOrder) {
      navigate("/dashboard/order/detail/" + idOrder);
    }
  }, [idOrder]);

  const actionButton = () => {
    return (
      <button
        className="bg-green-700 rounded-xl py-2 px-4 text-white m-0"
        onClick={() => rowSelected()}
      >
        Detail
      </button>
    );
  };

  return (
    <div>
      <ToastContainer hideProgressBar={true} autoClose={2000} theme="colored" />
      <div className="m-2 md:m-10 mt-24 px-2 py-10 md:p-10 bg-white rounded-3xl">
        <div className="flex justify-between">
          <Header title="Customer Order" />
          <CgClose
            className="text-4xl cursor-pointer"
            onClick={() => {
              navigate("/dashboard/customer/customers");
            }}
          />
        </div>
        <div className="mb-4 -mt-4">
          <button
            className="bg-blue-700 rounded-xl text-white px-4 py-2"
            onClick={() => {
              navigate("/dashboard/order/order-baru");
            }}
          >
            Order Baru
          </button>
        </div>
        <div className="overflow-x-auto">
          <div className="w-fit cursor-pointer">
            <GridComponent
              dataSource={order}
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
                  headerText="No"
                  textAlign="Center"
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
              <Inject services={[Search, Toolbar, Page, Sort, Resize]} />
            </GridComponent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrder;
