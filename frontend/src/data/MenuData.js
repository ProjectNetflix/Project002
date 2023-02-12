import { BiUserCircle, BiMovie } from "react-icons/bi";
import { AiOutlineHome} from "react-icons/ai";

const MenuData = [
    {
        title: "หน้าแรก",
        path: "/home",
        heardertitle:"หน้าแรก",
        icon: <AiOutlineHome />
    },

    {
        title: "สมาชิก",
        heardertitle:"สมาชิก",
        path: "/user",
        icon: <BiUserCircle />
    },
    {
        title: "ภาพยนต์",
        heardertitle:"รายการภาพยนต์",
        path: "/movie",
        icon: <BiMovie />
    },
  
]
export default MenuData;