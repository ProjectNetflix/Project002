import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { AiFillGithub, AiFillHeart } from "react-icons/ai";
import './style.css'
import Navbar from "./Navbar";


const Movie = () => {
    const data = [
        {
            id: 1, pic: "https://m.media-amazon.com/images/M/MV5BZjZjNzI5MDctY2Y4YS00NmM4LTljMmItZTFkOTExNGI3ODRhXkEyXkFqcGdeQXVyNjc3MjQzNTI@._V1_.jpg",
            name: "Demonslayer",
            synopsis: "asia"
        },
        {
            id: 2, pic: "https://images.justwatch.com/poster/269914828/s718/a-business-proposal.%7Bformat%7D",
            name: "Business Proposal",
            synopsis: "asia"
        },
        {
            id: 3, pic: "https://puui.wetvinfo.com/vcover_hz_pic/0/w9cphb9w7ev2m931582334936/0",
            name: "Naruto",
            synopsis: "asia"
        },
        {
            id: 4, pic: "https://thaipublica.org/wp-content/uploads/2023/03/11-The_Glory.jpg",
            name: "Glory",
            synopsis: "ซีรีส์จะเล่าเรื่องราวเกี่ยวกับชีวิตของ มุนดงอึน (รับบทโดย ซงฮเยคโย) หญิงสาวคนหนึ่งที่ใฝ่ฝันอยากเป็นสถาปนิก แต่เธอต้องลาออกจากโรงเรียน หลังถูกรังแกและทำร้ายร่างกายอย่างรุนแรงสมัยมัธยมปลาย เธอจึงเฝ้ารอให้คู่กรณีเติบโตขึ้นจนแต่งงานและมีลูก เมื่อลูกของคู่กรณีโตพอที่จะเข้าโรงเรียนประถม เธอก็ได้เข้ามาเป็นคุณครูประจำชั้นของเด็กคนนั้น และเริ่มต้นการแก้แค้น"
        }
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
            <Navbar />
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
                            <div className="col">

                                <div className="card">
                                    <div className="card-body">
                                        <img
                                            src={item.picture}
                                            className="card-img-top playlist-image"
                                            alt="Playlist Image"
                                            style={{ height: '150px' }}
                                        />

                                        <div className="card-title">
                                            <h4>{item.name}</h4>
                                        </div>

                                        <div className="card-text">
                                            <span>{item.synopsis}</span>

                                        </div>

                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </ul>

            </div>
        </div>
    )
}



export default Movie;