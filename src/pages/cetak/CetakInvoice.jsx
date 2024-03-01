import axios from "axios";
import { getCookie } from "cookies-next";
import { useReactToPrint } from "react-to-print";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { HOST } from "../../config";

const CetakInvoice = (id) => {
  const navigate = useNavigate();
  const componentRef = useRef();

  const [invoice, setInvoice] = useState({
    no_invoice: "",
    customer: "",
    alamat: "",
    no_suratjalan: "",
    nama_barang: "",
    jumlah: "",
    harga_satuan: "",
    total_harga: "",
    ppn: "",
    nominal_ppn: "",
    harga_bayar: "",
    terbilang: "Test",
    tanggal: "",
    rekening: [],
  });

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Invoice_${invoice.customer || "unknown"}_${
      invoice.no_job || "unknown"
    }`,
  });

  function formatRupiahTerbilang(angka) {
    let bilangan = [
      "",
      "Satu",
      "Dua",
      "Tiga",
      "Empat",
      "Lima",
      "Enam",
      "Tujuh",
      "Delapan",
      "Dembilan",
      "Sepuluh",
      "Sebelas",
    ];
    if (angka < 12) {
      return bilangan[angka].trim();
    } else if (angka >= 12 && angka <= 19) {
      return (bilangan[angka - 10] + " Belas").trim();
    } else if (angka >= 20 && angka <= 99) {
      return (
        bilangan[Math.floor(angka / 10)] +
        " Puluh " +
        bilangan[angka % 10]
      ).trim();
    } else if (angka >= 100 && angka <= 199) {
      return ("seratus " + formatRupiahTerbilang(angka % 100)).trim();
    } else if (angka >= 200 && angka <= 999) {
      return (
        bilangan[Math.floor(angka / 100)] +
        " Ratus " +
        formatRupiahTerbilang(angka % 100)
      ).trim();
    } else if (angka >= 1000 && angka <= 1999) {
      return ("seribu " + formatRupiahTerbilang(angka % 1000)).trim();
    } else if (angka >= 2000 && angka <= 999999) {
      return (
        formatRupiahTerbilang(Math.floor(angka / 1000)) +
        " Ribu " +
        formatRupiahTerbilang(angka % 1000)
      ).trim();
    } else if (angka >= 1000000 && angka <= 999999999) {
      return (
        formatRupiahTerbilang(Math.floor(angka / 1000000)) +
        " Juta " +
        formatRupiahTerbilang(angka % 1000000)
      ).trim();
    } else {
      return "Angka terlalu besar";
    }
  }

  function ubahFormatTanggal(tanggalAwal) {
    // Membuat objek Date dari string tanggalAwal
    let date = new Date(tanggalAwal);

    // Daftar nama bulan dalam Bahasa Indonesia
    let namaBulan = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    // Mendapatkan tanggal, bulan, dan tahun dari objek Date
    let tanggal = date.getDate();
    let bulan = namaBulan[date.getMonth()];
    let tahun = date.getFullYear();

    // Menggabungkan hasilnya menjadi string dengan format yang diinginkan
    let tanggalAkhir = `${tanggal} ${bulan} ${tahun}`;

    return tanggalAkhir;
  }

  const fetchData = async () => {
    await axios
      .get(HOST + "/finance/invoice/cetakInvoice/" + 1, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: getCookie("admin_auth"),
        },
      })
      .then((response) => {
        const listInvoice = response.data.data;

        let angkaTerbilang = formatRupiahTerbilang(listInvoice.harga_bayar);

        let invoiceAlamat = listInvoice.alamat_invoice;

        if (listInvoice.alamat_invoice === null) {
          invoiceAlamat = listInvoice.alamat;
        }

        setInvoice({
          no_invoice: listInvoice.no_invoice,
          customer: listInvoice.customer,
          alamat: invoiceAlamat,
          no_suratjalan: listInvoice.no_suratjalan,
          nama_barang:
            "BOX " +
            listInvoice.kualitas +
            " Uk. " +
            listInvoice.ukuran_pengiriman,
          jumlah: listInvoice.jumlah,
          harga_satuan:
            "Rp. " + listInvoice.harga_satuan.toLocaleString("id-ID"),
          total_harga: "Rp. " + listInvoice.total_harga.toLocaleString("id-ID"),
          ppn: listInvoice.ppn + "%",
          nominal_ppn: "Rp. " + listInvoice.nominal_ppn.toLocaleString("id-ID"),
          harga_bayar: "Rp. " + listInvoice.harga_bayar.toLocaleString("id-ID"),
          terbilang: angkaTerbilang + " rupiah.",
          tanggal: ubahFormatTanggal(listInvoice.tanggal),
          rekening: listInvoice.rekening.map((item, index) => ({
            id: index + 1, // You can add an id if needed
            detail: item,
          })),
        });
      })
      .catch((error) => {
        if (error.response.status === 401) {
          navigate("/dashboard/login");
        }
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (invoice.customer !== "" && invoice.no_job !== "") {
      handlePrint();
    }
  }, [invoice]);

  return (
    <div ref={componentRef}>
      <div className="text-center font-bold my-10 text-xl">
        <div className="underline">CV. CAHAYA TERANG</div>
        <div>INVOICE</div>
      </div>

      <div>
        <div className="mx-10 border border-black">
          <table className="border-collapse  w-full  inline-blok">
            <tr>
              <td className="text-left absolute z-[1]">INVOICE NUMBER :</td>
              <td className="text-center w-full">{invoice.no_invoice}</td>
            </tr>
          </table>

          <table className="border-collapse  w-full">
            <tr>
              <td className="border-y border-black" colSpan={3}>
                CUSTOMER INFORMATION
              </td>
            </tr>
            <tr>
              <td>NAME</td>
              <td>:</td>
              <td>{invoice.customer}</td>
            </tr>
            <tr>
              <td className="border-b border-black h-12">ADDRESS</td>
              <td className="border-b border-black h-12">:</td>
              <td className="border-b border-black h-12">{invoice.alamat}</td>
            </tr>
          </table>

          <table className="border-collapse w-full">
            <tr>
              <td className="border-b border-r border-black">NO.</td>
              <td className="border-b border-r border-black">
                NO. SURAT JALAN
              </td>
              <td className="border-b border-r border-black">NAMA BARANG</td>
              <td className="border-b border-r border-black">JUMLAH (Pcs)</td>
              <td className="border-b border-r border-black">HARGA SATUAN</td>
              <td className="border-b border-black">TOTAL HARGA</td>
            </tr>
            <tr>
              <td className="border-b border-r border-black h-36">1.</td>
              <td className="border-b border-r border-black h-36">
                {invoice.no_suratjalan}
              </td>
              <td className="border-b border-r border-black h-36">
                {invoice.nama_barang}
              </td>
              <td className="border-b border-r border-black h-36">
                {invoice.jumlah}
              </td>
              <td className="border-b border-r border-black h-36">
                {invoice.harga_satuan}
              </td>
              <td className="border-b  border-black h-36">
                {invoice.total_harga}
              </td>
            </tr>
            <tr>
              <td className="border-b border-r border-black" colSpan={5}>
                SELLING PRICE (TOTAL)
              </td>
              <td className="border-b border-black">{invoice.total_harga}</td>
            </tr>
            <tr>
              <td
                className="border-b border-r border-black"
                colSpan={5}
              >{`PPN ${invoice.ppn}`}</td>
              <td className="border-b border-black">{invoice.nominal_ppn}</td>
            </tr>
            <tr>
              <td className="border-b border-r border-black" colSpan={5}>
                TOTAL
              </td>
              <td className="border-b border-black">{invoice.harga_bayar}</td>
            </tr>
            <tr>
              <td
                className="text-center font-bold italic capitalize border-y border-black h-10"
                colSpan={6}
              >
                "{invoice.terbilang}"
              </td>
            </tr>
          </table>

          <div>
            <p className="m-8 underline">KETERANGAN</p>
            <div className="flex items-start justify-between">
              <div className=" mb-5">
                <table className="border-separate border-spacing-8 ">
                  <tr>
                    <td>Pembayaran</td>
                  </tr>
                  <tr>
                    <td>Giro</td>
                    <td>:</td>
                    <td>
                      Di isi a/n CV. CAHAYA TERANG
                      {invoice.rekening.map((rekeningItem) => (
                        <div>{`Bank ${rekeningItem.detail}`}</div>
                      ))}
                    </td>
                  </tr>

                  <tr>
                    <td>Transfer</td>
                    <td>:</td>
                    <td>
                      Di isi a/n CV. CAHAYA TERANG
                      {invoice.rekening.map((rekeningItem) => (
                        <div>{`Bank ${rekeningItem.detail}`}</div>
                      ))}
                    </td>
                  </tr>
                </table>
                <table className="mx-8">
                  <tr>
                    <td>Kofirmasi Pembayaran Transfer</td>
                  </tr>
                  <tr>
                    <td>*Bukti Transfer FAX ke no</td>
                    <td>:</td>
                    <td>(022) 86061659</td>
                  </tr>
                  <tr>
                    <td>*Konfirmasi By Phone</td>
                    <td>:</td>
                    <td>(022) 6077928</td>
                  </tr>
                </table>
              </div>
              <div className="mr-8 mt-8">{`Bandung, ${invoice.tanggal}`}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CetakInvoice;
