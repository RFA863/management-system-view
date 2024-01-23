import axios from "axios";
import Swal from "sweetalert2";
import { getCookie } from "cookies-next";
// import { HiDocument } from "react-icons/hi";
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
import { useStateContext } from "../../contexts/ContextProvider";

import "react-toastify/dist/ReactToastify.css";

const Invoice = () => {
  const navigate = useNavigate();

  const { data, setData } = useStateContext();
  const [getActionButton, setActionButton] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [customer, setCustomer] = useState([]);
  const gridRef = useRef(null);

  const fetchData = async () => {
    await axios
      .get(HOST + "/finance/invoice/getAll", {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: getCookie("admin_auth"),
        },
      })
      .then((response) => {
        const listCustomer = response.data.data;

        setCustomer(() =>
          listCustomer.map((item, index) => ({
            id: item.id,
            No: index + 1,
            id_suratjalan: item.id_suratjalan,
            id_job: item.id_job,
            no_invoice: item.no_invoice,
            tanggal: item.tanggal,
            berikat : item.berikat,
            ppn: item.ppn,
            nominal_ppn : item.nominal_ppn,
            harga_bayar : item.harga_bayar,
            id_customer: item.id_customer,
            sub_total: item.sub_total,
            customer : item.customer,
          }))
        );
      })
      .catch((error) => {
        if (error.response.status == 401) {
          navigate("/dashboard/login");
        }
      });
  };


  // const deleteData = async () => {
  //   // console.log(data);
  //   await axios
  //     .delete(HOST + "/marketing/customer/delete/" + data.id, {
  //       headers: {
  //         "ngrok-skip-browser-warning": "true",
  //         Authorization: getCookie("admin_auth"),
  //       },
  //     })
  //     .then((response) => {
  //       if (response.status === 200) {
  //         Swal.fire({
  //           title: "Deleted!",
  //           text: "Your file has been deleted.",
  //           icon: "success",
  //         });
  //         // toast.success("Data successfully deleted", {
  //         //   position: "top-center",
  //         //   autoClose: 5000,
  //         //   hideProgressBar: false,
  //         //   closeOnClick: true,
  //         //   pauseOnHover: true,
  //         //   draggable: true,
  //         //   progress: undefined,
  //         //   theme: "colored",
  //         // });
  //       }


  //       setData([]);
  //       fetchData();
  //     })
  //     .catch((error) => {
  //       if (error.response.status == 401) {
  //         navigate("/dashboard/login");
  //       }
  //     });
  // };

  useEffect(() => {
    setData([]);
    fetchData();
  }, []);

  useEffect(() => {
    if (customer.length !== 0) {
      setPageLoading(false);
    }
  }, [customer]);

  const dataBound = () => {
    if (gridRef.current) {
      gridRef.current.autoFitColumns();
    }
  };

  const rowSelected = () => {
    if (gridRef.current.selectionModule.focus.prevIndexes.cellIndex === 8) {
      setData(gridRef.current.selectionModule.data);
    }
  };

  // const rowSelected = () => {
  //   if (gridRef) {
  //     /** Get the selected row indexes */
  //     const selectedrowindex = gridRef.getSelectedRowIndexes();
  //     /** Get the selected records. */
  //     const selectedrecords = gridRef.getSelectedRecords();
  //     alert(selectedrowindex + " : " + JSON.stringify(selectedrecords));
  //   }
  // };

  useEffect(() => {
    if (getActionButton === "update" && data.length !== 0) {
      navigate("/dashboard/customer/update");
    } else if (getActionButton === "order" && data.length !== 0) {
      navigate("/dashboard/customer/order/" + data.id);
    }
  }, [data, getActionButton]);

  const actionButton = () => {
    return (
      <div className="flex gap-2">
        <button
          className="bg-green-700 rounded-xl py-2 px-4 text-white m-0"
          onClick={() => {
            setActionButton("order");
          }}
        >
          Order
        </button>
        <button
          className="bg-blue-700 rounded-xl py-2 px-4 text-white m-0"
          onClick={() => {
            setActionButton("update");
          }}
        >
          Update
        </button>
      </div>
    );
  };

  return pageLoading ? (
    <PageLoading />
  ) : (
    <div>
      <ToastContainer hideProgressBar={true} autoClose={2000} theme="colored" />
      <div className="m-2 md:m-10 mt-24 px-2 py-10 md:p-10 bg-white rounded-3xl">
        <Header title="Data Customer" />
        <div className="mb-4 -mt-4">
          <button
            className="bg-blue-700 rounded-xl text-white px-4 py-2"
            onClick={() => {
              navigate("/dashboard/customer/tambah");
            }}
          >
            Tambah Customer
          </button>
        </div>
        <div className="overflow-x-auto">
          <div className="w-fit cursor-pointer">
            <GridComponent
              dataSource={customer}
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
                  field="no_invoice"
                  headerText="No.Invoice"
                  textAlign="Center"
                />
                <ColumnDirective
                  field="customer"
                  headerText="Customer"
                  textAlign="Left"
                />
                <ColumnDirective
                  field="sub_total"
                  headerText="Sub Total"
                  textAlign="Center"
                />
                <ColumnDirective
                  field="nominal_ppn"
                  headerText="PPN"
                  textAlign="Left"
                />
                <ColumnDirective
                  field="harga_bayar"
                  headerText="Total"
                  textAlign="Center"
                />
                {/* <ColumnDirective
                  field="NoNpwp"
                  headerText="No. NPWP"
                  textAlign="center"
                /> */}
                {/* <ColumnDirective
                  field="NoTelp"
                  headerText="No. Telpn"
                  textAlign="center"
                />
                <ColumnDirective
                  field="NoFax"
                  headerText="No. fax"
                  textAlign="center"
                />

                <ColumnDirective
                  field="Alamat"
                  headerText="Alamat"
                  textAlign="center"
                />

                <ColumnDirective
                  field="AlamatInvoice"
                  headerText="Alamat Invoice"
                  textAlign="center"
                /> */}

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
export default Invoice;