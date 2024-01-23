import axios from "axios";
import { getCookie } from "cookies-next";
import { useReactToPrint } from "react-to-print";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { HOST } from "../../config";

const CetakJobOrder = (id) => {
  const navigate = useNavigate();
  const componentRef = useRef();

  const [jobOrder, setJobOrder] = useState({
    warna: "",
    no_po: "",
    no_nt: "",
    nomor: "",
    ukuran: "",
    no_job: "",
    alamat: "",
    jumlah: "",
    tipebox: "",
    kualitas: "",
    customer: "",
    uk_pendek: "",
    keterangan: "",
    uk_panjang: "",
    tanggal_order: "",
    tanggal_kirim: "",
    total_panjang: "",
    total_lebar: "",
  });

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `job_order_${jobOrder.customer || "unknown"}_${
      jobOrder.no_job || "unknown"
    }`,
  });

  const fetchData = async () => {
    await axios
      .get(HOST + "/marketing/job/cetakJob/" + id.id, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: getCookie("admin_auth"),
        },
      })
      .then((response) => {
        const listJob = response.data.data;

        let konstantaLebar = 0;

        if (listJob.lebar % 2 === 0) {
          konstantaLebar = listJob.konstanta_lebar_genap;
        } else if (listJob.lebar % 2 !== 0) {
          konstantaLebar = listJob.konstanta_lebar_ganjil;
        }

        setJobOrder({
          warna: listJob.warna,
          no_po: listJob.no_po,
          no_nt: listJob.no_nt,
          nomor: listJob.nomor,
          ukuran: listJob.ukuran,
          no_job: listJob.no_job,
          alamat: listJob.alamat,
          jumlah: listJob.jumlah,
          tipebox: listJob.tipebox,
          kualitas:
            listJob.kualitas +
            " / " +
            listJob.kualitas_detail +
            " = " +
            listJob.kode_kualitas_detail,
          customer: listJob.customer,
          uk_pendek:
            (listJob.lebar + konstantaLebar) / 2 +
            " + " +
            listJob.tinggi +
            " + " +
            (listJob.lebar + konstantaLebar) / 2,
          keterangan: listJob.keterangan,
          uk_panjang:
            listJob.kuping +
            " + " +
            listJob.panjang +
            " + " +
            listJob.lebar +
            " + " +
            listJob.panjang +
            " + " +
            (listJob.lebar + listJob.konstanta_panjang),
          tanggal_order: listJob.tanggal_order,
          tanggal_kirim: listJob.tanggal_kirim,
          total_panjang: listJob.total_panjang,
          total_lebar: listJob.total_lebar,
        });
      })
      .catch((error) => {
        if (error.response.status == 401) {
          navigate("/dashboard/login");
        }
      });
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (jobOrder.customer !== "" && jobOrder.no_job !== "") {
      handlePrint();
    }
  }, [jobOrder]);

  return (
    <div ref={componentRef}>
      <div className="text-center my-10 font-bold underline-offset-8 text-xl">
        JOB PRODUKSI <span className="text-red-600"> CV. CAHAYA TERANG </span>
      </div>

      <div className="border border-black mx-10">
        <div className=" flex justify-between px-6 py-2">
          <table>
            <tr>
              <td>NO. CUSTOMER</td>
              <td>:</td>
              <td>{jobOrder.nomor}</td>
            </tr>
            <tr>
              <td>NAMA CUSTOMER</td>
              <td>:</td>
              <td>{jobOrder.customer}</td>
            </tr>
            <tr>
              <td>ALAMAT CUST.</td>
              <td>:</td>
              <td>{jobOrder.alamat}</td>
            </tr>
          </table>
          <table>
            <tr>
              <td>TGL. ORDER</td>
              <td>:</td>
              <td>{jobOrder.tanggal_order}</td>
            </tr>
            <tr>
              <td>NO. JOB</td>
              <td>:</td>
              <td>{jobOrder.no_job}</td>
            </tr>
            <tr>
              <td>NO. NT</td>
              <td>:</td>
              <td>{jobOrder.no_nt}</td>
            </tr>
          </table>
        </div>
        <div className="border border-y-black px-6 py-2">
          <table>
            <tr>
              <td>NO. PO</td>
              <td>:</td>
              <td>{jobOrder.no_po}</td>
            </tr>
            <tr>
              <td>KETERANGAN</td>
              <td>:</td>
              <td>{jobOrder.keterangan}</td>
            </tr>
          </table>
        </div>
        <div>
          <table className="border-collapse  w-full  text-left">
            <tr>
              <th className="border border-b-black px-6 py-2">UKURAN</th>
              <td className="border border-b-black">:</td>
              <td className="border border-b-black" colSpan={2}>
                {jobOrder.ukuran}
              </td>
            </tr>
            <tr>
              <th className="border border-y-black px-6 py-2">
                KUALITAS / KODE
              </th>
              <td className="border border-y-black">:</td>
              <td className="border border-y-black" colSpan={2}>
                {jobOrder.kualitas}
              </td>
            </tr>
            <tr>
              <th className="border border-y-black px-6 py-2">JUMLAH ORDER</th>
              <td className="border border-y-black">:</td>
              <td className="border border-y-black" colSpan={2}>
                {jobOrder.jumlah}
              </td>
            </tr>
            <tr>
              <th className="border border-y-black px-6 py-2">UK. PANJANG</th>
              <td className="border border-y-black">:</td>
              <td className="border border-y-black">{jobOrder.uk_panjang}</td>
              <td className="border border-y-black">{`= ${jobOrder.total_panjang}`}</td>
            </tr>
            <tr>
              <th className="border border-y-black px-6 py-2">UK. PENDEK</th>
              <td className="border border-y-black">:</td>
              <td className="border border-y-black">{jobOrder.uk_pendek}</td>
              <td className="border border-y-black">{`= ${jobOrder.total_lebar}`}</td>
            </tr>
          </table>
        </div>
        <div className=" flex justify-between items-start">
          <table className="border-collapse  basis-1/2">
            <tr>
              <td className="px-6 py-2">TGL. KIRIM</td>
              <td>:</td>
              <td className="border border-r-black">
                {jobOrder.tanggal_kirim}
              </td>
            </tr>
            <tr>
              <td className="border border-b-black px-6 py-2">JUMLAH</td>
              <td className="border border-b-black">:</td>
              <td className="border-r border-b border-black"></td>
            </tr>
            <tr>
              <td className="px-6 py-2">TGL. POTONG</td>
              <td>:</td>
              <td className="border border-r-black"> </td>
            </tr>
            <tr>
              <td className="border border-b-black px-6 py-2">JUMLAH</td>
              <td className="border border-b-black">:</td>
              <td className="border-r border-b border-black"></td>
            </tr>
            <tr>
              <td className="px-6 py-2">TGL. SABLON</td>
              <td>:</td>
              <td className="border border-r-black"></td>
            </tr>
            <tr>
              <td className="border border-b-black px-6 py-2">JUMLAH</td>
              <td className="border border-b-black">:</td>
              <td className="border-r border-b border-black"></td>
            </tr>
            <tr>
              <td className="px-6 py-2">TGL. SLOT</td>
              <td>:</td>
              <td className="border border-r-black"></td>
            </tr>
            <tr>
              <td className="border border-b-black px-6 py-2">JUMLAH</td>
              <td className="border border-b-black">:</td>
              <td className="border-b border-r border-black"></td>
            </tr>
            <tr>
              <td className="px-6 py-2">TGL. LEM / STITCH</td>
              <td>:</td>
              <td className="border border-r-black"></td>
            </tr>
            <tr>
              <td className="px-6 py-2">JUMLAH</td>
              <td>:</td>
              <td className="border-r  border-black"></td>
            </tr>
          </table>
          <table className="border-collapse basis-1/2">
            <tr>
              <td className="px-6 py-2">TIPE</td>
              <td>:</td>
              <td>{jobOrder.tipebox}</td>
              <td colSpan={2} className="border border-l-black">
                TIDAK
              </td>
            </tr>
            <tr>
              <td
                colSpan={3}
                className="border-r border-b border-black text-white px-6 py-2"
              >
                test
              </td>
            </tr>
            <tr>
              <td className="border border-t-black px-6 py-2">WARNA</td>
              <td className="border border-t-black">:</td>
              <td className="border border-t-black" colSpan={3}>
                {jobOrder.warna}
              </td>
            </tr>
            <tr>
              <td
                colSpan={5}
                className=" border-b border-black text-white px-6 py-2"
              >
                test
              </td>
            </tr>
            <tr>
              <td className=" border-b  border-black px-6 py-2" colSpan={3}>
                SABLON
              </td>
              <td className=" border-b border-l border-black" colSpan={2}>
                LONGWAY
              </td>
            </tr>
            <tr>
              <td className="px-6 py-2" colSpan={4}>
                DATA PENGIRIMAN
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CetakJobOrder;
