import AppNavBar from "../../components/AppNavBar";
import { Outlet } from "react-router";

export default function AdminLayout() {
    return (
        <div className="font-sans bg-custom-white h-content min-h-screen m-0 flex flex-col tooltipBoundary">
            <AppNavBar role="admin" />
            <Outlet />
        </div>
    );
}
