import React, { useEffect, useState, Link } from 'react';

const SearchBar = () => {

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
    <div className='z-3 rounded-3'>
      <input className="form-control form-control-dark " placeholder="Search..." label="Search" onChange={handleChange} value={word} />
      <div className=" align-items-center col-12 px-3">
        <div className="list-group z-3" >
          {searchFollow(rearch).map((item, index) => {
            return (
              <Link to={`/${item.fname}`} className="list-group-item list-group-item-action z-5 " key={index}  > {item.fname}  {item.lname}</Link>
            )
          })}
        </div>
      </div>
    </div>
  )
};

export default SearchBar;
