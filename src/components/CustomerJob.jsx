import axios from "axios";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { HOST } from "../config";

const CustomerJob = ({ idOrder }) => {
  const id = { idOrder };

  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    id: "",
    kode: "",
    nomor: "",
    nama: "",
    alamat: "",
    notelp: "",
    nofax: "",
    email: "",
  });
  const [order, setOrder] = useState({
    id: "",
    no_po: "",
    tanggal_order: "",
    tanggal_kirim: "",
  });

  const getCustomer = async () => {
    await axios
      .get(HOST + "/marketing/job/get_customer/" + id.idOrder, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: getCookie("admin_auth"),
        },
      })
      .then((response) => {
        const listCustomer = response.data.data.getCustomer;
        const listOrder = response.data.data.getOrder;

        setCustomer({
          id: listCustomer.id,
          kode: listCustomer.kode,
          nomor: listCustomer.nomor,
          nama: listCustomer.nama,
          alamat: listCustomer.alamat,
          notelp: listCustomer.notelp,
          nofax: listCustomer.nofax,
          email: listCustomer.email,
        });

        setOrder({
          id: listOrder.id,
          no_po: listOrder.no_po,
          tanggal_order:
            listOrder.tanggal_order.split("-")[2] +
            "-" +
            listOrder.tanggal_order.split("-")[1] +
            "-" +
            listOrder.tanggal_order.split("-")[0],
          tanggal_kirim:
            listOrder.tanggal_kirim.split("-")[2] +
            "-" +
            listOrder.tanggal_kirim.split("-")[1] +
            "-" +
            listOrder.tanggal_kirim.split("-")[0],
        });
      })
      .catch((error) => {
        if (error.response.status === 401) {
          navigate("/dashboard/login");
        }
      });
  };

  useEffect(() => {
    getCustomer();
  }, []);

  return (
    <div>
      <div className="border border-slate-300 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse border-spacing-0">
          <thead className="bg-slate-300 text-gray-600">
            <tr>
              <th colSpan={2} className="py-2 pl-4">
                Customer
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="border-b border-r border-slate-300 pr-4 pl-4  text-gray-600">
                Kode
              </th>
              <td className="border-b border-slate-300 px-4">{`${customer.kode}`}</td>
            </tr>

            <tr>
              <th className="border-b border-r border-slate-300 pr-4 pl-4  text-gray-600">
                No
              </th>
              <td className="border-b border-slate-300 px-4">
                {`${customer.nomor}`}
              </td>
            </tr>

            <tr>
              <th className="border-b border-r border-slate-300 pr-4 pl-4  text-gray-600">
                Nama
              </th>
              <td className="border-b border-slate-300 px-4">{`${customer.nama}`}</td>
            </tr>

            <tr>
              <th className="border-b border-r border-slate-300 pr-4 pl-4  text-gray-600">
                Alamat
              </th>
              <td className="border-b border-slate-300 px-4">{`${customer.alamat}`}</td>
            </tr>

            <tr>
              <th className="border-b border-r border-slate-300 pr-4 pl-4  text-gray-600">
                No. Telpn
              </th>
              <td className="border-b border-slate-300 px-4">{`${customer.notelp}`}</td>
            </tr>

            <tr>
              <th className="border-b border-r border-slate-300 pr-4 pl-4  text-gray-600">
                No. Fax
              </th>
              <td className="border-b border-slate-300 px-4">{`${customer.nofax}`}</td>
            </tr>

            <tr>
              <th className="border-r border-slate-300 pr-4 pl-4  text-gray-600">
                Email
              </th>
              <td className="px-4">{`${customer.email}`}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="border border-slate-300 rounded-xl mt-6 overflow-hidden">
        <table className="w-full text-left border-collapse border-spacing-0">
          <thead className="bg-slate-300  text-gray-600">
            <tr>
              <th colSpan={2} className="py-2 pl-4">
                Order
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="border-b border-r border-slate-300  text-gray-600 pr-4 pl-4">
                No. PO
              </th>
              <td className="border-b border-slate-300   px-4">{`${order.no_po}`}</td>
            </tr>

            <tr>
              <th className="border-b border-r border-slate-300  text-gray-600 pr-4 pl-4">
                Tanggal Order
              </th>
              <td className="border-b border-slate-300   px-4">
                {`${order.tanggal_order}`}
              </td>
            </tr>

            <tr>
              <th className="border-r border-slate-300  text-gray-600 pr-4 pl-4">
                Tanggal Kirim
              </th>
              <td className="px-4">{`${order.tanggal_kirim}`}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerJob;
