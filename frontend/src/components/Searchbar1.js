import React, { useState, useEffect } from "react";
import "./searchbar.css";


function SearchBar({ placeholder, data }) {
  const [word, setWord] = useState("")
  const [dataFilter] = useState(["lname", "fname"])
  const [rearch, setRearch] = useState([]);

  const searchFollow = (rearch) => {
    return rearch.filter((item) => {
      return dataFilter.some((filter) => {
        if (item[filter]) {//check ค่าว่าง
          return item[filter].toString().toLowerCase().indexOf(word.toLowerCase()) > -1
        }
      })
    })
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
          setRearch(data.data);
        } else {
          alert("Token expired signin again");
        }
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (

    <form className=" align-items-center col-12 col-lg px-3">
      <input className=" form-control form-control-dark " placeholder="Search..." label="Search" onChange={handleChange} value={word} />
      <div className="position-absolute list-group" onChange={handleChange}>
        {word.length != 0 && searchFollow(rearch).map((item, index) => {
          return (
            <a className="list-group-item list-group-item-action" key={index}  > {item._id} {item.fname}  {item.lname}</a>
          )
        })}
      </div>
    </form>
  );
}

export default SearchBar;