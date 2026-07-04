import AppNavBar from "../../components/AppNavBar";
import { Outlet } from "react-router";

export default function UserNormalLayout() {
    return (
        <div className="font-sans bg-custom-white h-content min-h-screen m-0 flex flex-col tooltipBoundary">
            <AppNavBar role="normal" />
            <div style={{ display: "flex", flexDirection: "column", flex: 1, width: "100%" }}>
                <Outlet />
            </div>
        </div>
    );
}
