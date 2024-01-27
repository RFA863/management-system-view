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

const JobList = () => {
  const navigate = useNavigate();

  const gridRef = useRef(null);
  const [jobList, setJobList] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  const fetchData = async () => {
    await axios
      .get(HOST + "/marketing/job/getAll", {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: getCookie("admin_auth"),
        },
      })
      .then((response) => {
        const listJob = response.data.data;

        setJobList(() =>
          listJob.map((item, index) => ({
            id: item.id,
            No: index + 1,
            id_order: item.id_order,
            id_customer: item.id_customer,
            id_kualitas_detail: item.id_kualitas_detail,
            id_kualitas: item.id_kualitas,
            no_job: item.no_job,
            kualitas: item.kualitas,
            ukuran: item.ukuran,
            ukuran_pengiriman: item.ukuran_pengiriman,
            total_harga: "Rp. " + item.total_harga.toLocaleString(),
            keterangan: item.keterangan,
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
    if (jobList.length !== 0) {
      setPageLoading(false);
    }
  }, [jobList]);

  const dataBound = () => {
    if (gridRef.current) {
      gridRef.current.autoFitColumns();
    }
  };

  const rowSelected = () => {
    if (gridRef.current.selectionModule) {
      const id = gridRef.current.selectionModule.data.id;
      console.log(id);
      navigate("/dashboard/job/detail/" + id);
    }
  };

  const actionButton = () => {
    return (
      <div>
        <button
          className="bg-green-700 rounded-xl py-2 px-4 text-white m-0"
          onClick={() => rowSelected()}
        >
          Detail
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
        <Header title="Job List" />
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
              dataSource={jobList}
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
                  field="id_kualitas"
                  headerText="Id Kualitas Detail"
                  visible={false}
                />

                <ColumnDirective
                  field="No"
                  headerText="No"
                  textAlign="Center"
                />

                <ColumnDirective
                  field="no_job"
                  headerText="No. Job"
                  textAlign="Center"
                />
                <ColumnDirective
                  field="ukuran_pengiriman"
                  headerText="Ukuran Pengiriman"
                  textAlign="Center"
                />
                <ColumnDirective
                  field="ukuran"
                  headerText="Ukuran Produksi"
                  textAlign="Center"
                />
                <ColumnDirective
                  field="kualitas"
                  headerText="Kualitas"
                  textAlign="Center"
                />
                <ColumnDirective
                  field="total_harga"
                  headerText="Harga"
                  textAlign="center"
                />
                <ColumnDirective
                  field="keterangan"
                  headerText="Keterangan"
                  textAlign="center"
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
export default JobList;
