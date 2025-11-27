import { useAuth } from "../Navigation/Authprovider";
import Navbar2 from "../Navigation/Navbar2";
import Navbar1 from "../Navigation/Navigation";



export default function NavbarSwitcher(){
     const { loggedIn } = useAuth();
    return loggedIn ? <Navbar1 /> : <Navbar2 />;
}