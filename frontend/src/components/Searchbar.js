import { useState, useEffect } from "react";

const SearchBar = ({ onSearch }) => {

    const [word, setWord] = useState("")
    const [dataFilter] = useState(["lname", "fname"])
    const [search, setSearch] = useState([]);

    const searchFollow = (search) => {
        return search.filter((item) => {
            return dataFilter.some((filter) => {
                if (item[filter]) {//check ค่าว่าง
                    return item[filter].toString().toLowerCase().indexOf(word.toLowerCase()) > -1
                }
            })
        })
    }

    const handleChangeWord = (e) => {
        e.preventDefault();

        setWord(e.target.value);
    };

    const [userId, setUserId] = useState('');

    const handleChange = (event) => {
        setUserId(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(userId);
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

    useEffect(() => {
        getUser();
    }, []);


    return (

        <div >
            <form className="grid align-items-center col-4 px-3">
                <input className=" form-control  " placeholder="Search..." label="Search" onChange={handleChangeWord} value={word} />
                <div className="list-group position-absolute " onChange={handleChange}>
                    {word.length != 0 && searchFollow(search).map((item, index) => {
                        return (
                            <a className=" list-group-item align-items-center " key={index} >{item.fname}  {item.lname}</a>
                        )
                    })}
                </div>
            </form>
        </div>
    )
}
export default SearchBar;