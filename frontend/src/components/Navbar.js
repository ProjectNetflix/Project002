import "./topbar.css";
import { useState, useEffect, Link } from "react";
import MenuData from "../data/MenuData";
import './Navbar.css'
import { IconContext } from "react-icons";
import Follow from "./Follow";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export default function Navbar() {

    const [userData, setUserData] = useState([]);
    const [word, setWord] = useState("")
    const [dataFilter] = useState(["lname", "fname"])
    const [search, setSearch] = useState([]);

    const handleSearch = (searchResult) => {
        console.log(searchResult);
        Follow(searchResult);
        window.location.reload();
    };

    const searchFollow = (search) => {
        return search.filter((item) => {
            return dataFilter.some((filter) => {
                if (item[filter]) {//check ค่าว่าง
                    return item[filter].toString().toLowerCase().indexOf(word.toLowerCase()) > -1
                }
            })
        })
        // เรียกใช้งานฟังก์ชัน onSearch เพื่อส่งผลลัพธ์การค้นหา
        // onSearch(results);
        // return results;
    }

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

    const getUser = async () => {

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
                console.log(data, "userData");
                if (data.status === "ok") {
                    console.log(data.data)
                    setSearch(data.data);
                } else {
                    alert("Token expired signin again");
                }
            });
    };

    const getUserData = async () => {
        let uid = localStorage.getItem("userid");
        fetch(`http://localhost:5000/userData`, requestOptions)
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "userData");
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
        getUserData();
        getUser();

    }, []);

    const logOut = () => {
        window.localStorage.clear();
        MySwal.fire({
            icon: "success",
            text: "Sign Out success",
            showConfirmButton: true,

        })

        window.location.href = "/signin";


    };

    return (

        <div className="p-2 bg-dark text-white">
            <div className="container">
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">

                    <ul className="nav col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">

                        {MenuData.map((menu, index) => {

                            return (
                                <li key={index}>
                                    <a href={menu.path} className="nav-link text-white px-2 "> <IconContext.Provider value={{ color: "white", size: '30px' }}> {menu.icon}</IconContext.Provider> </a>
                                    <a href={menu.path} className="nav-link text-white px-2">{menu.title}</a>
                                </li>
                            )

                        })}

                    </ul>

                    <form className="grid align-items-center col-4 px-3" >
                        <input className=" form-control  " placeholder="Search..." label="Search" onChange={handleChange} value={word} />
                        <div className="list-group position-absolute " onChange={handleChange} >
                            {word.length != 0 && searchFollow(search).map((item, index) => {
                                return (
                                    <Link to={{ pathname: "/follow", state: { userid: item._id }, }} className=" list-group-item align-items-center " key={index} >{item.fname}  {item.lname}</Link>
                                )
                            })}
                        </div>
                    </form>

                    <a href='/profile' className="nav-link px-3  d-flex justify-content-center text-white">  {userData.fname}  {userData.lname} </a>

                    <div className="">
                        <button type="button" className="btn btn-outline-primary" onClick={logOut}>Sign Out</button>
                    </div>

                </div>
            </div>
        </div >

    )
}