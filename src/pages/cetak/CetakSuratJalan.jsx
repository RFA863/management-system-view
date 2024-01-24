import axios from "axios";
import { getCookie } from "cookies-next";
import { useReactToPrint } from "react-to-print";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { HOST } from "../../config";

const CetakSuratJalan = (id) => {
  const navigate = useNavigate();
  const componentRef = useRef();

  const [suratJalan, setSuratJalan] = useState({
    no_po: "",
    no_job: "",
    jumlah: "",
    customer: "",
    keterangan: "",
    tanggal_kirim: "",
    no_suratjalan: "",
    nama_barang: "",
    mobil: "",
    supir: "",
  });

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Surat_Jalan_${suratJalan.customer || "unknown"}_${
      suratJalan.no_job || "unknown"
    }`,
  });

  const fetchData = async () => {
    await axios
      .get(HOST + "/ekspedisi/suratjalan/cetak_suratJalan/" + id.id, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: getCookie("admin_auth"),
        },
      })
      .then((response) => {
        const listSuratJalan = response.data.data;

        setSuratJalan({
          no_po: listSuratJalan.no_po,
          no_job: listSuratJalan.no_job + " / " + listSuratJalan.no_nt,
          jumlah: listSuratJalan.selesai + " BOX",
          customer: listSuratJalan.customer,
          keterangan: listSuratJalan.keterangan,
          tanggal_kirim: listSuratJalan.tanggal_kirim,
          no_suratjalan: listSuratJalan.no_suratjalan,
          nama_barang:
            "BOX " +
            listSuratJalan.kualitas +
            " Uk. " +
            listSuratJalan.ukuran +
            "mm",
          mobil: listSuratJalan.no_plat,
          supir: listSuratJalan.supir,
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
  }, []);

  useEffect(() => {
    if (suratJalan.customer !== "" && suratJalan.no_job !== "") {
      handlePrint();
    }
  }, [suratJalan]);

  return (
    <div ref={componentRef}>
      <div className="text-center my-10">
        <div className="text-2xl font-bold underline">SURAT JALAN</div>
        <div className="text-xl font-bold">CV. CAHAYA TERANG</div>
      </div>
      <div className="flex justify-between items-start mx-10 ">
        <table>
          <tr>
            <td>Tanggal SJ</td>
            <td>:</td>
            <td>{suratJalan.tanggal_kirim}</td>
          </tr>
          <tr>
            <td>Nomor SJ</td>
            <td>:</td>
            <td>{suratJalan.no_suratjalan}</td>
          </tr>
          <tr>
            <td>No. PO</td>
            <td>:</td>
            <td>{suratJalan.no_po}</td>
          </tr>
        </table>
        <table>
          <tr>
            <td>Kepada Yth.</td>
          </tr>
          <tr>
            <td>{suratJalan.customer}</td>
          </tr>
        </table>
      </div>
      <div className="mx-10 my-5">
        <table className="border-collapse border-black border  w-full">
          <tr>
            <td className="border border-black text-center">Quantity</td>
            <td className="border border-black text-center">Nama Barang</td>
            <td className="border border-black text-center">No. JOB</td>
            <td className="border border-black text-center">Harga</td>
            <td className="border border-black text-center">Keterangan</td>
          </tr>
          <tr>
            <td className="border border-black h-48 text-center">
              {suratJalan.jumlah}
            </td>
            <td className="border border-black h-48">
              {suratJalan.nama_barang}
            </td>
            <td className="border border-black h-48 text-center">
              {suratJalan.no_job}
            </td>
            <td className="border border-black h-48"></td>
            <td className="border border-black h-48">
              {suratJalan.keterangan}
            </td>
          </tr>
        </table>
      </div>
      <div className="flex justify-between items-start mx-10">
        <table className="basis-2/5">
          <tr>
            <td>No Kendaraan</td>
            <td>:</td>
            <td>{suratJalan.mobil}</td>
          </tr>
          <tr>
            <td>Supir</td>
            <td>:</td>
            <td>{suratJalan.supir}</td>
          </tr>
        </table>
        <table className="basis-2/5">
          <tr>
            <td>Tanda Terima</td>
            <td>Hormat Kami</td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default CetakSuratJalan;
