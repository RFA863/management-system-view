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

const SuratJalan = () => {
  const navigate = useNavigate();

  const gridRef = useRef(null);

  const [id, setId] = useState();

  const [suratJalan, setSuratJalan] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [getActionButton, setActionButton] = useState("");

  const fetchData = async () => {
    await axios
      .get(HOST + "/ekspedisi/suratjalan/getAll", {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: getCookie("admin_auth"),
        },
      })
      .then((response) => {
        const listSuratJalan = response.data.data;

        setSuratJalan(() =>
          listSuratJalan.map((item, index) => ({
            id: item.id,
            No: index + 1,
            id_job: item.id_job,
            id_supir: item.id_supir,
            id_mobil: item.id_mobil,
            no_suratjalan: item.no_suratjalan,
            tanggal_kirim: item.tanggal_kirim,
            supir: item.supir,
            no_plat: item.no_plat,
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
    if (gridRef.current.selectionModule.focus.prevIndexes.cellIndex === 9) {
      setId(gridRef.current.selectionModule.data.id);
    }
  };

  useEffect(() => {
    if (getActionButton === "update" && id) {
      navigate("/dashboard/ekspedisi/surat-jalan/update/" + id);
    }
  }, [id, getActionButton]);

  const actionButton = () => {
    return (
      <div className="flex gap-2">
        {/* <button
          className="bg-green-700 rounded-xl py-2 px-4 text-white m-0"
          onClick={() => {
            setActionButton("order");
          }}
        >
          Order
        </button> */}
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
        <Header title="Surat Jalan" />
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
                  field="id_job"
                  headerText="Id Job"
                  visible={false}
                />

                <ColumnDirective
                  field="id_supir"
                  headerText="Id Supir"
                  visible={false}
                />

                <ColumnDirective
                  field="id_mobil"
                  headerText="Id Mobil"
                  visible={false}
                />

                <ColumnDirective
                  field="No"
                  headerText="No"
                  textAlign="Center"
                />
                <ColumnDirective
                  field="no_suratjalan"
                  headerText="No. Surat Jalan"
                  textAlign="Center"
                />
                <ColumnDirective
                  field="tanggal_kirim"
                  headerText="Tanggal Kirim"
                  textAlign="Center"
                />
                <ColumnDirective
                  field="supir"
                  headerText="Supir"
                  textAlign="Center"
                />
                <ColumnDirective
                  field="no_plat"
                  headerText="Mobil"
                  textAlign="Center"
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

export default SuratJalan;
