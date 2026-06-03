import NavBarNormal from "../../components/NavBarNormal";
import { Outlet } from "react-router";

export default function UserNormalLayout() {

    return (
        <div className="font-sans bg-custom-white h-content min-h-screen m-0 flex flex-col tooltipBoundary">
            <NavBarNormal />
            <Outlet />
        </div>
    );
}
