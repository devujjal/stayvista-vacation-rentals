import { Outlet } from "react-router";

const Dashboard = () => {
    return (
        <div className="relative min-h-screen md:flex">
            <h1>hello</h1>
            
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