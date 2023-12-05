import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setCookie, deleteCookie } from "cookies-next";

import Background_1 from "../data/background_1.png";
import Logo from "../data/Group 2.png";

import { HOST } from "../config";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState("");

  useEffect(() => {
    deleteCookie("admin_auth");
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-cover relative">
      <img
        src={Background_1}
        className="absolute top-0 w-full h-full object-cover"
      />
      <div className="absolute top-0 w-full h-full bg-[#EE8300] opacity-20"></div>
      <div className="sm:w-[400px] w-[300px] px-10 py-16 bg-white rounded-lg shadow-lg z-10 opacity-80">
        <img src={Logo} />
        <form className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col">
            <label
              htmlFor="username-input"
              className="text-sm font-medium text-gray-700 font-bold"
            ></label>
            <input
              type="text"
              placeholder="USERNAME"
              name="username-input"
              className="p-2 border border-gray-300 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-[#EE8300] text-gray"
              value={username}
              onChange={(e) => {
                setWarning("");
                setUsername(e.target.value);
              }}
              required
            />
            {/* menambahkan kelas text-gray */}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="password-input"
              className="text-sm font-medium text-gray-700 font-bold"
            ></label>
            <input
              type="password"
              placeholder="PASSWORD"
              id="password-input"
              className="p-2 border border-gray-300 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-[#EE8300] text-gray"
              value={password}
              onChange={(e) => {
                setWarning("");
                setPassword(e.target.value);
              }}
              required
            />
            {/* menambahkan kelas text-gray */}
          </div>

          {/* <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember-input"
                name="remember-input"
                className="w-4 h-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#EE8300]"
              />
              <label
                htmlFor="remember-input"
                className="mr-11 ml-2 text-sm text-gray font-bold"
              >
                REMEMBER ME
              </label>
            </div>
            <a href="#" className="text-sm text-gray hover:underline font-bold">
              FORGOT PASSWORD?
            </a>
          </div> */}
          <p className="text-red-600 mt-10">{warning}</p>
          <button
            type="submit"
            className="w-full p-3 text-white bg-[#EE8300] rounded-md hover:bg-[#FF9900] focus:outline-none focus:ring-2 focus:ring-[#CC6600] font-bold "
            onClick={(e) => {
              e.preventDefault();
              axios
                .post(
                  HOST + "/auth",
                  { username, password },
                  {
                    headers: {
                      "ngrok-skip-browser-warning": true,
                    },
                  }
                )
                .then((response) => {
                  if (response.status === 200) {
                    const admin_auth = response.data.data.token;


                    setCookie("admin_auth", admin_auth, {
                      expires: new Date(new Date().getTime() + 10800000),
                    });

                    navigate("/dashboard");
                  }
                })
                .catch((error) => {
                  if (error.response) {
                    setWarning(error.response.data.message);
                  } else {
                    setWarning("Internal Server Error, Try again later !");
                  }
                });
            }}
          >
            {/* mengganti properti margin-y dengan margin-top dan margin-bottom */}
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
