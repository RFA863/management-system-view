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
} from "@syncfusion/ej2-react-grids";

import { HOST } from "../../config";
import { Header, PageLoading } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";

import "react-toastify/dist/ReactToastify.css";

const Sopir = () => {
  const navigate = useNavigate();
  const { currentColor } = useStateContext();
  const { data, setData } = useStateContext();

  const [getActionButton, setActionButton] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [customer, setCustomer] = useState([]);
  const gridRef = useRef(null);

  const fetchData = async () => {
    await axios
      .get( HOST + "/marketing/supir/get", {
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
            no: index + 1,
            nama : item.nama

           
          }))
        );
      })
      .catch((error) => {
        if (error.response.status == 401) {
          navigate("/dashboard/login");
        }
      });
  };

  const deleteData = async (id) => {
    await axios
      .delete(HOST + "marketing/supir/get" + id, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: getCookie("admin_auth"),
        },
      })
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

  const dataBound = () => {
    if (gridRef.current) {
      gridRef.current.autoFitColumns();
    }
  };

  const rowSelected = () => {
    if (gridRef.current.selectionModule.focus.prevIndexes.cellIndex == 3) {
      setData(gridRef.current.selectionModule.data);
      if (getActionButton === "update") {
        if (data.length !== 0) {
          console.log(data);
          navigate("/dashboard/master/sopir/update");
        }
      } else if (getActionButton === "delete") {
        deleteData(data.id);
      }
    }
  };

  const actionButton = () => {
    return (
      <div className="flex gap-2">
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
        <Header title="Data Sopir" />
        <div className="mb-4 -mt-4">
          <button
            className="bg-blue-700 rounded-xl text-white px-4 py-2"
            onClick={() => {
              navigate("/dashboard/master/sopir/tambah");
            }}
          >
            Tambah Sopir
          </button>
        </div>
        <div className="overflow-x-auto">
          <div className=" cursor-pointer">
            <GridComponent
              dataSource={customer}
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
                  field="no"
                  headerText="No"
                  textAlign="Center"
                />
                
                <ColumnDirective
                  field="nama"
                  headerText="Nama"
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
export default Sopir;
