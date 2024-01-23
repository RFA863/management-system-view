import axios from "axios";
import Swal from "sweetalert2";
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
  ExcelExport,
} from "@syncfusion/ej2-react-grids";

import { HOST } from "../../config";
import { Header, PageLoading } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";

import "react-toastify/dist/ReactToastify.css";

const Typebox = () => {
  const navigate = useNavigate();
  const { currentColor } = useStateContext();
  const [getActionButton, setActionButton] = useState("");
  const { data, setData } = useStateContext();

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

  const deleteData = async () => {
    await axios
      .put(
        HOST + "/marketing/tipebox/delete/" + data.id,
        {},
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: getCookie("admin_auth"),
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          toast.success("Data successfully deleted", {
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
        fetchData();
        setData([]);
      })
      .catch((error) => {
        if (error.response.status == 401) {
          navigate("/dashboard/login");
        }
      });
  };

  useEffect(() => {
    fetchData();
    setData([]);
  }, []);

  useEffect(() => {
    if (Typebox.length !== 0) {
      setPageLoading(false);
    }
  }, [Typebox]);

  const dataBound = () => {
    if (gridRef.current) {
      gridRef.current.autoFitColumns();
    }
  };

  const toolbarClick = (args) => {
    if (gridRef.current && args.item.id.includes("excelexport")) {
      const excelExportProperties = {
        fileName: "Data Pelamar.xlsx",
      };
      gridRef.current.excelExport(excelExportProperties);
    }
  };

  const rowSelected = () => {
    if (gridRef.current.selectionModule.focus.prevIndexes.cellIndex === 4) {
      setData(gridRef.current.selectionModule.data);
    }
  };

  useEffect(() => {
    if (getActionButton === "update" && data.length !== 0) {
      navigate("/dashboard/TypeBox/UpdateTypebox");
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
      <div className="flex gap-2 justify-center">
        <button
          className="bg-blue-700 rounded-xl py-2 px-4 text-white m-0"
          onClick={() => {
            setActionButton("update");
          }}
        >
          Update
        </button>
        <button
          className="bg-red-700 rounded-xl py-2 px-4 text-white m-0"
          onClick={() => {
            setActionButton("delete");
          }}
        >
          Delete
        </button>
      </div>
    );
  };

  return pageLoading ? (
    <PageLoading />
  ) : (
    <div className="">
      <ToastContainer hideProgressBar={true} autoClose={2000} theme="colored" />
      <div className="m-2 md:m-10 mt-24 px-2 py-10 md:p-10 bg-white rounded-3xl">
        <Header title="Data Type Box" />
        <div className="mb-4 -mt-4">
          <button
            className="bg-blue-700 rounded-xl text-white px-4 py-2"
            onClick={() => {
              navigate("/dashboard/TypeBox/BuatTypebox");
            }}
          >
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
              rowSelected={rowSelected}
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
                  field="Nama"
                  headerText="Nama"
                  textAlign="center"
                />
                <ColumnDirective
                  field="Kode"
                  headerText="Kode"
                  textAlign="center"
                />
                <ColumnDirective headerText="Action" template={actionButton} />
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
