import useRole from "../../hooks/useRole";
import AdminStatistics from "../Dashboard/Statistics/AdminStatistics";

const Statistics = () => {

    const [role, isLoading] = useRole();

    console.log(role)

    return (
        <>
            {role.role === 'admin' && <AdminStatistics />}
        </>
    );
};

export default Statistics;