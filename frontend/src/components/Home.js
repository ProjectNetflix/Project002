import Navbar from "./Navbar"
// import './style.css'
import { useState, useEffect } from "react"
import { IconContext } from "react-icons";
import { AiTwotoneStar, AiTwotoneLike, AiTwotoneDislike, AiOutlineDislike } from "react-icons/ai";
import { CgFeed } from "react-icons/cg";
import { BiDislike, BiLike } from "react-icons/bi";
import { BsHeartFill, BsPlusCircle, BsHeart } from "react-icons/bs";

const Home = () => {

  const [allpost, setAllPost] = useState([]);
  const [postId, setPostId] = useState();
  const [post, setPost] = useState([]);
  const [success , setSuccess] = useState(false);

  const GetAllPost = async () => {
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
    fetch(`http://localhost:5000/allpost/following/${localStorage.getItem("userId")}`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setAllPost(data);
          console.log("allpost", data);
        } else {
          //alert("Token expired, sign in again");
        }
      });
  };
  
  const handleLike = async (postId) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`http://localhost:5000/posts/${postId}/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        const updatedPosts = allpost.map((post) => {
          if (post._id === updatedPost._id) {
            return updatedPost;
          }
          return post;
        });
        setAllPost(updatedPosts);
      } else {
        console.error("Failed to update post");
      }
      setSuccess(true);
      //GetAllPost();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    GetAllPost();
    setSuccess(false);
  }, [success]);

  return (
    <div>
      <Navbar />
      <div className="container">
        <br />
        <h3> <IconContext.Provider value={{ color: "blue", size: "50px" }}> <CgFeed /> <span /> Feed</IconContext.Provider></h3>
        <br />
        {allpost.map((item) => {
          
           const isLiked = item.likes.includes(localStorage.getItem("userId"));
           const likeCount = item.likes.length;

          return (
            <div className="post" key={item._id}>
              <div className="card m-2 ">
                <div className="card-body d-flex">
                  <div className=" img-post">
                    <img src={item.movie.pic} alt="Movie Image" style={{ height: "200px" }} />
                  </div>

                  <div className=" post-info m-2 ">
                    <h5>{item.owner.fname} {item.owner.lname}</h5>
                    <h6>{item.movie.name}</h6>
                    <p>{item.content}</p>
                    <IconContext.Provider value={{ color: "yellow", size: "25px" }}> <AiTwotoneStar /> {item.score}/5</IconContext.Provider>
                    <div className="post-action d-flex justify-content-center m-2 ">

                      <div className="m-2" onClick={() => handleLike(item._id)}>
                        <IconContext.Provider value={{ color: isLiked ? "red" : "black", size: "20px" }}> 
                          <BsHeartFill /> <span/> {likeCount} <span/> Like
                        </IconContext.Provider>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )

}

export default Home;


