import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import Navbar from "./Navbar"
import { AiFillGithub, AiFillHeart } from "react-icons/ai";
import './style.css'
import Topbar from "./topbar";


const Movie = () => {
    const data = [
        { id: 1, name: "thai", region: "asia" },
        { id: 2, name: "south korea", region: "asia" }

    ]

    const [countries, setCountries] = useState(data)
    const [word, setWord] = useState("")

    // useEffect(() => {
    //     const options = {
    //         method: 'GET',
    //         headers: {
    //             'X-RapidAPI-Key': 'cae1f4d48cmsh52392616602be7fp11ac17jsna1487b7aa27f',
    //             'X-RapidAPI-Host': 'unogs-unogs-v1.p.rapidapi.com'
    //         }
    //     };

    //     fetch('https://unogs-unogs-v1.p.rapidapi.com/search/titles?limit=10&order_by=rating&country_list=425', options)
    //         .then(response => response.json())
    //         .then(data => {
    //             setCountries(data.results)
    //         })
    //         .catch(err => console.error(err));
    // }, [])

    return (
        <div>
            <Topbar />
            <div className="container">
                <br />
                <h1>รายการภาพยนต์</h1>

                {/* <div className="search-container">
                    <label htmlFor="search-form">
                        <input type="text"
                            className="search-input"
                            placeholder="ค้นหาชื่อเรื่อง"
                            value={word}
                            onChange={(e) => setWord(e.target.value)}
                        />
                    </label>
                </div> */}

                <ul className="row">
                    {countries.map((item, index) => {
                        return (
                            <li key={index}>
                                <div className="card">

                                    <div className="card-title">
                                        <img src={item.img} alt={item.title} />
                                    </div>

                                    <div className="card-body">

                                        {/* <div className="card-title">
                                            <img src={item.img} alt={item.title} />
                                        </div> */}

                                        <div className="card-description">
                                            <h2>{item.name}</h2>
                                            {/*อย่าลืมแก้*/}
                                            <ol className="card-list">
                                                <br></br> 
                                                <li>ชื่อ :  <span>{item.name}</span></li> 
                                                <li>ประเภท : <span>{item.title_type}</span></li>
                                                <li>คำอธิบาย : <span>{item.synopsis}</span></li>
                                            </ol>
                                        </div>

                                    </div>
                                </div>

                                <div >
                                    <AiFillHeart />
                                </div>

                            </li>
                        )
                    })}
                </ul>

            </div>
        </div>
    )
}



export default Movie;