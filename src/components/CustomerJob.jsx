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
          tanggal_order: listOrder.tanggal_order,
          tanggal_kirim: listOrder.tanggal_kirim,
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
      <div className="border border-slate-700 rounded-xl">
        <table className=" text-left border-collapse border-spacing-2 ">
          <tr>
            <th colSpan={2} className=" border-b border-slate-700 py-2 pl-2">
              Customer
            </th>
          </tr>
          <tr>
            <th className=" border-b border-r border-slate-700 pr-6  pl-2">
              Kode
            </th>
            <td className=" border-b border-slate-700 px-3">{`${customer.kode}`}</td>
          </tr>

          <tr>
            <th className=" border-b border-r border-slate-700 pr-6  pl-2">
              No
            </th>
            <td className=" border-b border-slate-700 px-3">
              {`${customer.nomor}`}
            </td>
          </tr>

          <tr>
            <th className=" border-b border-r border-slate-700 pr-6  pl-2">
              Nama
            </th>
            <td className=" border-b border-slate-700 px-3">{`${customer.nama}`}</td>
          </tr>

          <tr>
            <th className=" border-b border-r border-slate-700 pr-6  pl-2">
              Alamat
            </th>
            <td className=" border-b border-slate-700 px-3">{`${customer.alamat}`}</td>
          </tr>

          <tr>
            <th className=" border-b border-r border-slate-700 pr-6  pl-2">
              No. Telpn
            </th>
            <td className=" border-b border-slate-700 px-3">{`${customer.notelp}`}</td>
          </tr>

          <tr>
            <th className=" border-b border-r border-slate-700 pr-6  pl-2">
              No. Fax
            </th>
            <td className=" border-b border-slate-700 px-3">{`${customer.nofax}`}</td>
          </tr>

          <tr>
            <th className="border-r border-slate-700 pr-6 pl-2">Email</th>
            <td className="px-3">{`${customer.email}`}</td>
          </tr>
        </table>
      </div>

      <div className="border border-slate-700 rounded-xl mt-6">
        <table className=" text-left border-collapse border-spacing-2 ">
          <tr>
            <th colSpan={2} className=" border-b border-slate-700 py-2 pl-2">
              Order
            </th>
          </tr>
          <tr>
            <th className=" border-b border-r border-slate-700 pr-6  pl-2">
              No. PO
            </th>
            <td className=" border-b border-slate-700 px-3">{`${order.no_po}`}</td>
          </tr>

          <tr>
            <th className=" border-b border-r border-slate-700 pr-6  pl-2">
              Tanggal Order
            </th>
            <td className=" border-b border-slate-700 px-3">
              {`${order.tanggal_order}`}
            </td>
          </tr>

          <tr>
            <th className="border-r border-slate-700 pr-6 pl-2">
              Tanggal Kirim
            </th>
            <td className=" px-3">{`${order.tanggal_kirim}`}</td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default CustomerJob;
