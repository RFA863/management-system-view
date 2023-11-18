import axios from "axios";
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
  ExcelExport,
} from "@syncfusion/ej2-react-grids";

// import "./data.css";
import { HOST } from "../../config";
import { Header, PageLoading } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";

import "react-toastify/dist/ReactToastify.css";

const Customer = () => {
  const navigate = useNavigate();
  const { currentColor } = useStateContext();

  const [pageLoading, setPageLoading] = useState(true);
  const [customer, setCustomer] = useState([]);
  const gridRef = useRef(null);

  const fetchData = async () => {
    await axios
      .get(HOST + "/marketing/customer/get", {
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
            Nomor: item.nomor,
            Nama: item.nama,
            Kode: item.kode,
            Email: item.email,
            NPWP: item.npwp,
            NoNpwp: item.nonpwp,
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
    if (customer.length !== 0) {
      setPageLoading(false);
    }
  }, [customer]);

  //   const lampiranTemplate = (props) => {
  //     return (
  //       <div className="e-lampiranParent">
  //         <a href={props.LampiranCv} target="_blank" className="e-lampiran">
  //           <HiDocument className="e-lampiranIcon" />
  //           <div>Buka</div>
  //         </a>
  //       </div>
  //     );
  //   };

  //   const nomorHpTemplate = (props) => {
  //     return <div className="e-nomorHp">{props.NomorHp}</div>;
  //   };

  const dataBound = () => {
    if (gridRef.current) {
      gridRef.current.autoFitColumns();
    }
  };

  //   const rowSelected = () => {
  //     if (gridRef.current) {
  //       if (gridRef.current.selectionModule.focus.prevIndexes.cellIndex == 2)
  //         return;
  //       else if (
  //         gridRef.current.selectionModule.focus.prevIndexes.cellIndex == 4
  //       ) {
  //         const selectedNomorHp = gridRef.current.getSelectedRecords()[0].NomorHp;

  //         window.open(
  //           `https://api.whatsapp.com/send/?phone=${selectedNomorHp}&text=&type=phone_number&app_absent=0`,
  //           "_blank"
  //         );
  //       }
  //     }
  //   };

  const toolbarClick = (args) => {
    if (gridRef.current && args.item.id.includes("excelexport")) {
      const excelExportProperties = {
        fileName: "Data Pelamar.xlsx",
      };
      gridRef.current.excelExport(excelExportProperties);
    }
  };

  return pageLoading ? (
    <PageLoading />
  ) : (
    <div className="">
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
              toolbar={["Search", "ExcelExport"]}
              selectionSettings={{ type: "Single", mode: "Both" }}
              //   rowSelected={rowSelected}
              allowExcelExport={true}
              toolbarClick={toolbarClick}
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
                  field="Nomor"
                  headerText="Nomor"
                  textAlign="Center"
                />
                <ColumnDirective
                  field="Nama"
                  headerText="Nama"
                  textAlign="Center"
                />
                <ColumnDirective
                  field="Kode"
                  headerText="Kode"
                  textAlign="Center"
                />
                <ColumnDirective
                  field="Email"
                  headerText="Email"
                  textAlign="Center"
                />
                <ColumnDirective
                  field="NPWP"
                  headerText="NPWP"
                  textAlign="Center"
                />
                <ColumnDirective
                  field="NoNpwp"
                  headerText="No. NPWP"
                  textAlign="center"
                />
                {/* <ColumnDirective
                  field="KeahlianTeknis"
                  headerText="Keahlian Teknis"
                  textAlign="Left"
                /> */}
              </ColumnsDirective>
              <Inject
                services={[Search, Toolbar, Page, Sort, Resize, ExcelExport]}
              />
            </GridComponent>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Customer;
