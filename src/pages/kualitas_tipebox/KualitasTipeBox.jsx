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
} from "@syncfusion/ej2-react-grids";

import { HOST } from "../../config";
import { Header, PageLoading } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";

import "react-toastify/dist/ReactToastify.css";

const KualitasTipeBox = () => {
  const navigate = useNavigate();
  const { data, setData } = useStateContext();

  const [getActionButton, setActionButton] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [kualitasTipeBox, setKualitasTipeBox] = useState([]);
  const gridRef = useRef(null);

  const fetchData = async () => {
    await axios
      .get(HOST + "/marketing/kualitas_tipebox/get", {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: getCookie("admin_auth"),
        },
      })
      .then((response) => {
        const listKualitasTipeBox = response.data.data;

        setKualitasTipeBox(() =>
          listKualitasTipeBox.map((item, index) => ({
            id: item.id,
            No: index + 1,
            id_tipebox: item.id_tipebox,
            id_kualitas: item.id_tipebox,
            konstanta_panjang: item.konstanta_panjang,
            konstanta_lebar_ganjil: item.konstanta_lebar_ganjil,
            konstanta_lebar_genap: item.konstanta_lebar_genap,
            kuping: item.kuping,
            tipebox: item.tipebox,
            kualitas: item.kualitas,
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
        HOST + "/marketing/kualitas_tipebox/delete/",
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
    if (kualitasTipeBox.length !== 0) {
      setPageLoading(false);
    }
  }, [kualitasTipeBox]);

  const dataBound = () => {
    if (gridRef.current) {
      gridRef.current.autoFitColumns();
    }
  };

  const rowSelected = () => {
    if (gridRef.current.selectionModule.focus.prevIndexes.cellIndex === 10) {
      setData(gridRef.current.selectionModule.data);
    }
  };

  useEffect(() => {
    if (getActionButton === "update" && data.length !== 0) {
      navigate("/dashboard/master/kualitas_tipebox/update");
    } else if (getActionButton === "delete" && data.length !== 0) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
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
    <div>
      <ToastContainer hideProgressBar={true} autoClose={2000} theme="colored" />
      <div className="m-2 md:m-10 mt-24 px-2 py-10 md:p-10 bg-white rounded-3xl">
        <Header title="Data Kualitas Tipe Box" />
        <div className="mb-4 -mt-4">
          <button
            className="bg-blue-700 rounded-xl text-white px-4 py-2"
            onClick={() => {
              navigate("/dashboard/master/kualitas_tipebox/input");
            }}
          >
            Tambah Kualitas Tipe Box
          </button>
        </div>
        <div className="overflow-x-auto">
          <div className=" cursor-pointer">
            <GridComponent
              dataSource={kualitasTipeBox}
              width="fit-content"
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
                  field="id_tipebox"
                  headerText="Id_tipebox"
                  visible={false}
                />

                <ColumnDirective
                  field="id_kualitas"
                  headerText="Id_kualitas"
                  visible={false}
                />

                <ColumnDirective
                  field="No"
                  headerText="No"
                  textAlign="Center"
                />

                <ColumnDirective
                  field="tipebox"
                  headerText="Tipe Box"
                  textAlign="Center"
                />

                <ColumnDirective
                  field="kualitas"
                  headerText="Kualitas"
                  textAlign="Center"
                />

                <ColumnDirective
                  field="konstanta_panjang"
                  headerText="Konstanta Panjang"
                  textAlign="Center"
                />

                <ColumnDirective
                  field="konstanta_lebar_ganjil"
                  headerText="Konstanta Lebar Ganjil"
                  textAlign="Center"
                />

                <ColumnDirective
                  field="konstanta_lebar_genap"
                  headerText="Konstanta Lebar Genap"
                  textAlign="Center"
                />

                <ColumnDirective
                  field="kuping"
                  headerText="Kuping"
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
export default KualitasTipeBox;
