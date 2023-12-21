import axios from "axios";
import { getCookie } from "cookies-next";
import { CgClose } from "react-icons/cg";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { HOST } from "../../config";
import { Header } from "../../components";

const JobDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [job, setJob] = useState({
    id: "",
    no_nt: "",
    warna: "",
    harga: "",
    jumlah: "",
    no_job: "",
    ukuran: "",
    perekat: "",
    tipebox: "",
    customer: "",
    kualitas: "",
    id_order: "",
    id_tipebox: "",
    keterangan: "",
    id_customer: "",
    id_kualitas: "",
    tanggal_order: "",
    id_kualitas_detai: "",
    ukuran_pengiriman: "",
  });

  const fetchJobDetail = async () => {
    await axios
      .get(HOST + "/marketing/job/getJob_detail/" + id, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: getCookie("admin_auth"),
        },
      })
      .then((response) => {
        const listJob = response.data.data;

        setJob({
          id: listJob.id,
          id_order: listJob.id_order,
          id_tipebox: listJob.id_tipebox,
          id_kualitas_detai: listJob.id_kualitas_detail,
          id_kualitas: listJob.id_kualitas,
          id_customer: listJob.id_customer,
          no_job: listJob.no_job,
          no_nt: listJob.no_nt,
          tipebox: listJob.tipebox,
          kualitas: listJob.kualitas,
          jumlah: listJob.jumlah,
          warna: listJob.warna,
          perekat: listJob.perekat,
          ukuran: listJob.ukuran,
          harga: listJob.harga,
          customer: listJob.customer,
          keterangan: listJob.keterangan,
          ukuran_pengiriman: listJob.ukuran_pengiriman,
          tanggal_order: listJob.tanggal_order,
        });
      })
      .catch((error) => {
        if (error.response.status === 401) {
          navigate("/dashboard/login");
        }
      });
  };

  useEffect(() => {
    fetchJobDetail();
  }, []);

  return (
    <div className="m-2 md:m-10 mt-24 px-2 py-10 md:p-10 bg-white rounded-3xl">
      <div className="flex justify-between">
        <Header title="Job Detail" />
        <CgClose
          className="text-4xl cursor-pointer"
          onClick={() => {
            navigate("/dashboard/job/job");
          }}
        />
      </div>

      <div className="flex justify-between">
        <div className="border border-slate-700 rounded-xl">
          <table className=" text-left border-collapse border-spacing-2 ">
            <tr>
              <th colSpan={2} className=" border-b border-slate-700 py-2 pl-2">
                Detail Job
              </th>
            </tr>

            <tr>
              <th className=" border-b border-r  border-slate-700 pr-6  pl-2">
                Customer
              </th>
              <td className=" border-b  border-slate-700 px-3">{`${job.customer}`}</td>
            </tr>

            <tr>
              <th className=" border-b border-r  border-slate-700 pr-6  pl-2">
                No. Job
              </th>
              <td className=" border-b  border-slate-700 px-3">{`${job.no_job}`}</td>
            </tr>

            <tr>
              <th className=" border-b border-r  border-slate-700 pr-6  pl-2">
                Type Box
              </th>
              <td className=" border-b  border-slate-700 px-3">{`${job.tipebox}`}</td>
            </tr>

            <tr>
              <th className=" border-b border-r  border-slate-700 pr-6  pl-2">
                Kualitas
              </th>
              <td className=" border-b  border-slate-700 px-3">{`${job.kualitas}`}</td>
            </tr>

            <tr>
              <th className=" border-b border-r  border-slate-700 pr-6  pl-2">
                Ukuran Pengiriman
              </th>
              <td className=" border-b  border-slate-700 px-3">{`${job.ukuran_pengiriman}`}</td>
            </tr>

            <tr>
              <th className=" border-b border-r  border-slate-700 pr-6  pl-2">
                Ukuran Produksi
              </th>
              <td className=" border-b  border-slate-700 px-3">{`${job.ukuran}`}</td>
            </tr>

            <tr>
              <th className="border-r  border-slate-700 pr-6 pl-2">
                keterangan
              </th>
              <td className="px-3">{`${job.keterangan}`}</td>
            </tr>
          </table>
        </div>

        <div className="border border-slate-700 rounded-xl h-fit">
          <table className=" text-center border-collapse border-spacing-y-4 ">
            <tr>
              <th
                colSpan={4}
                className="border-b border-slate-700 px-6 text-left py-2"
              >
                Harga
              </th>
            </tr>
            <tr>
              <th className="border-b border-r border-slate-700 px-3">
                No. NT
              </th>
              <th className="border-b border-r border-slate-700 px-3">
                Tanggal Order
              </th>
              <th className="border-b border-r border-slate-700 px-3">
                Quantity
              </th>
              <th className="border-b border-slate-700 px-3">Harga</th>
            </tr>
            <tr>
              <td className="border-r border-slate-700 px-3">{`${job.no_nt}`}</td>
              <td className="border-r border-slate-700 px-3">{`${job.tanggal_order}`}</td>
              <td className="border-r border-slate-700 px-3">{`${job.jumlah}`}</td>
              <td className=" px-3">{`${job.harga}`}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
