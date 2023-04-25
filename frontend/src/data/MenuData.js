import { BiUserCircle, BiMovie } from "react-icons/bi";
import { AiOutlineHome, AiOutlineBars } from "react-icons/ai";

const MenuData = [

    {
        title: "Home",
        path: "/",
        heardertitle: "Home",
        icon: <AiOutlineHome />
    },

    {
        title: "Profile",
        heardertitle: "Profile",
        path: "/profile",
        icon: <BiUserCircle />
    },
    {
        title: "Movielist",
        heardertitle: "Movielist",
        path: "/movie",
        icon: <BiMovie />
    },

]
export default MenuData;