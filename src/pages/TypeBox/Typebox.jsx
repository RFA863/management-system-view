import axios from "axios";
import { getCookie } from "cookies-next";
// import { HiDocument } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
// import { Routes, Route } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";
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

import "./Typebox.css";
import { HOST } from "../../config";
import { Header, PageLoading } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";

import "react-toastify/dist/ReactToastify.css";

const Typebox = () => {
  const navigate = useNavigate();
  const { currentColor } = useStateContext();

  const [pageLoading, setPageLoading] = useState(true);
  const [Typebox, setTypebox] = useState([]);
  const gridRef = useRef(null);

  const fetchData = async () => {
    await axios
      .get(HOST + "/marketing/tipebox/get", {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: getCookie("admin_auth"),
        },
      })
      .then((response) => {
        const listTypebox = response.data.data;

        setTypebox(() =>
          listTypebox.map((item, index) => ({
            id: item.id,
            No: index + 1,
            Nama: item.nama,
            Kode: item.kode,
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
    if (Typebox.length !== 0) {
      setPageLoading(false);
    }
  }, [Typebox]);

  // const lampiranTemplate = (props) => {
  //   return (
  //     <div className="e-lampiranParent">
  //       <a href={props.LampiranCv} target="_blank" className="e-lampiran">
  //         <HiDocument className="e-lampiranIcon" />
  //         <div>Buka</div>
  //       </a>
  //     </div>
  //   );
  // };

  // const nomorHpTemplate = (props) => {
  //   return <div className="e-nomorHp">{props.NomorHp}</div>;
  // };

  const dataBound = () => {
    if (gridRef.current) {
      gridRef.current.autoFitColumns();
    }
  };

  // const rowSelected = () => {
  //   if (gridRef.current) {
  //     if (gridRef.current.selectionModule.focus.prevIndexes.cellIndex == 2)
  //       return;
  //     else if (
  //       gridRef.current.selectionModule.focus.prevIndexes.cellIndex == 4
  //     ) {
  //       const selectedNomorHp = gridRef.current.getSelectedRecords()[0].NomorHp;

  //       window.open(
  //         `https://api.whatsapp.com/send/?phone=${selectedNomorHp}&text=&type=phone_number&app_absent=0`,
  //         "_blank"
  //       );
  //     }
  //   }
  // };

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
        <Header title="Data Type Box" />
        <div className="mb-4 -mt-4">
        
            <button className="bg-blue-700 rounded-xl text-white px-4 py-2" onClick={() => {navigate("/dashboard/TypeBox/BuatTypebox")}}>
              Tambah Typebox
            </button>
        
        </div>
        <div className="overflow-x-auto">
          <div className="w-fit cursor-pointer">
            <GridComponent
              dataSource={Typebox}
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
              // rowSelected={rowSelected}
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
                {/* <ColumnDirective
                  field="LampiranCv"
                  headerText="Lampiran CV"
                  textAlign="Center"
                  template={lampiranTemplate}
                /> */}
                <ColumnDirective
                  field="Nama"
                  headerText="Nama"
                  textAlign="Left"
                />
                <ColumnDirective
                  field="Kode"
                  headerText="Kode"
                  textAlign="Left"
                  // template={nomorHpTemplate}
                />
                {/* <ColumnDirective
                  field="JenisKelamin"
                  headerText="Jenis Kelamin"
                  textAlign="Center"
                />
                <ColumnDirective
                  field="PengalamanKerja"
                  headerText="Pengalaman Kerja"
                  textAlign="Center"
                />
                <ColumnDirective
                  field="SpesialisUtama"
                  headerText="SpesialisUtama"
                  textAlign="Left"
                />
                <ColumnDirective
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
export default Typebox;
