import Navbar from "./Navbar";
import "./MovieData.css";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { AiTwotoneStar, AiOutlineComment } from "react-icons/ai";
import { BsHeart } from "react-icons/bs";
import { RiAccountPinCircleFill } from "react-icons/ri";
import { IconContext } from "react-icons";

const MovieData = () => {
  const location = useLocation();
  const { Movieid } = location.state;
  const [Moviedata, setMoviedata] = useState([]);

  const GetMovie = async () => {
    console.log(Movieid);

    const requestOptions = {
      method: "GET",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    fetch(`http://localhost:5000/movie/${Movieid}`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log("check", data);
        if (data) {
          //console.log(data, "Moive");
          setMoviedata(data);
        }
      })
      .catch((error) => {
        console.error(error);
        alert("เกิดข้อผิดพลาด");
      });
  };

  const [post, setPost] = useState([]);
  const GetPost = async () => {
    let uid = localStorage.getItem("userId");

    const requestOptions = {
      method: "GET",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    fetch(`http://localhost:5000/postsmovie/${Movieid}`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setPost(data);
          console.log(data);
        } else {
          alert("Token expired, sign in again");
        }
      });
  };

  useEffect(() => {
    GetMovie();
    GetPost();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className=" movie mr-3">
          <div className="img-movie ">
            <img
              src={Moviedata.pic}
              alt="Movie Image"
              style={{ height: "250px" }}
            />
          </div>

          <div className="movie-info mt-2">
            <h4>{Moviedata.name}</h4>
            <p>{Moviedata.synopsis}</p>
            <IconContext.Provider value={{ color: "yellow", size: "30px" }}>
              {" "}
              <AiTwotoneStar /> 6/10
            </IconContext.Provider>
          </div>
        </div>
      </div>
      <div className="container">
        <br />
        <h4>
          <IconContext.Provider value={{ color: "purple", size: "35px" }}>
            {" "}
            <AiOutlineComment /> <span /> REVIEW{" "}
          </IconContext.Provider>
        </h4>
        <br />

        {post.map((item) => {
          return (
            <div className="post ">
              <div className="card m-2 ">
                <div className="card-body body-post">
                  <div className=" post-info m-2 ">
                    <h5>
                      <IconContext.Provider
                        value={{ color: "white", size: "25px" }}
                      >
                        <RiAccountPinCircleFill /> <span /> {item.owner.fname}{" "}
                        {item.owner.lname}
                      </IconContext.Provider>
                    </h5>
                    <p>{item.content}</p>
                    <IconContext.Provider
                      value={{ color: "yellow", size: "25px" }}
                    >
                      {" "}
                      <AiTwotoneStar /> {item.score}/5
                    </IconContext.Provider>
                  </div>
                  <div className="post-action d-flexed m-2">
                    <IconContext.Provider
                      value={{ color: "red", size: "25px" }}
                    >
                      {" "}
                      <BsHeart />
                    </IconContext.Provider>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MovieData;
