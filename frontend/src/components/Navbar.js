import { useState, useEffect } from "react";
import MenuData from "../data/MenuData";
import "./Navbar.css";
import { IconContext } from "react-icons";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// import Movie from "./Movie.png";
const MySwal = withReactContent(Swal);

export default function Navbar() {
  const [userData, setUserData] = useState([]);
  const [word, setWord] = useState("");
  const [dataFilter] = useState(["lname", "fname"]);
  const [search, setSearch] = useState([]);

  const searchFollow = (search) => {
    return search.filter((item) => {
      return dataFilter.some((filter) => {
        if (item[filter]) {
          //check ค่าว่าง
          return (
            item[filter].toString().toLowerCase().indexOf(word.toLowerCase()) > -1
          );
        }
      });
    });
    // เรียกใช้งานฟังก์ชัน onSearch เพื่อส่งผลลัพธ์การค้นหา
    // onSearch(results);
    // return results;
  };

  const handleChange = (e) => {
    e.preventDefault();
    setWord(e.target.value);

  };

  const requestOptions = {
    method: "POST",
    crossDomain: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      token: window.localStorage.getItem("token"),
    }),
  };

  const GetAllUser = async () => {
    const requestOptions = {
      method: "GET",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };

    fetch(`http://localhost:5000/allusers`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        //console.log(data, "userData");
        if (data.status === "ok") {
          //console.log(data.data)
          setSearch(data.data);
        } else {
          alert("Token expired signin again");
        }
      });
  };

  const GetUserData = async () => {
    // let uid = localStorage.getItem("userid");
    fetch(`http://localhost:5000/userData`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        //console.log(data, "userData");
        if (data.data === "token expired") {
          alert("Token expired signin again");
          window.localStorage.clear();
          window.location.href = "./signin";
        } else {
          setUserData(data.data);
        }
      });
  };

  useEffect(() => {
    GetUserData();
    GetAllUser();
  }, []);

  const logOut = () => {
    window.localStorage.clear();
    // MySwal.fire({
    //   icon: "success",
    //   text: "Sign Out success",
    //   showConfirmButton: false,
    //   timer: 3000,
    // });
    window.location.href = "/signin";
  };

  return (
    <div className="p-2 bg-dark text-white">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <ul className="nav col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <Link to={{ pathname: `/`}}>
              <img src="3-wh.png" alt="3-wh" className="centered-image" />
            </Link>
            {MenuData.map((menu, index) => {
              return (
                <li key={index}>
                  <Link to={menu.path} className="nav-link text-white px-2 ">
                    <IconContext.Provider
                      value={{ color: "white", size: "30px" }}
                    >
                      {menu.icon}
                    </IconContext.Provider>
                  
                  <div to={menu.path} className="nav-link text-white px-2">
                    {menu.title}
                  </div>
                  </Link>
                </li>
              );
            })}
          </ul>
          {/* to={{ pathname: "/follow", state: { userid: item._id }, }} */}
          <form className="grid align-items-center col-4 px-3">
            <input
              className=" form-control"
              placeholder="Search for follow ..."
              label="Search"
              onChange={handleChange}
              value={word}
            />
            <div
              className="list-group position-absolute"
              onChange={handleChange}
            // onClick={setWord("")}
            >
              {word &&
                searchFollow(search).map((item, index) => {
                  return (
                    <Link
                      to={{
                        pathname: `/follow/${item._id}`,
                        // state: { userid: item._id } ,
                        state: { followid: item._id },

                      }}

                      className=" list-group-item align-items-center "
                      key={index}
                    >
                      {item.fname} {item.lname}
                    </Link>
                  );
                })}
            </div>
          </form>

          <a
            href="/profile"
            className="nav-link px-3  d-flex justify-content-center text-white"
          >
            {userData.fname} {userData.lname}
          </a>

          <button className="btn btn-outline-primary" onClick={logOut}>Sign Out</button>

          <div>
          </div>
        </div>
      </div>
    </div>
  );
}
