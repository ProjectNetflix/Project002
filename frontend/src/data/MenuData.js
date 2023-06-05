import { BiCameraMovie } from "react-icons/bi";
import { AiOutlineHome ,AiOutlineUsergroupAdd, AiOutlineUser} from "react-icons/ai";

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
        icon: <AiOutlineUser />
    },
    {
        title: "Movielist",
        heardertitle: "Movielist",
        path: "/movie",
        icon: <BiCameraMovie />
    },
    {
        title: "Follow",
        heardertitle: "follow",
        path: "/follow",
        icon: <AiOutlineUsergroupAdd />
    },

]
export default MenuData;