import { Outlet } from "react-router";
import SideBar from "../components/SideBar/SideBar";

const Dashboard = () => {
    return (
        <div className="relative min-h-screen md:flex">
            <SideBar />

            {/* Dynamic Content */}
            <main className="flex-1 md:ml-64">
                <div className="p-5">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;