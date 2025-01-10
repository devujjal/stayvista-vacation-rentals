import { Navigate } from "react-router";
import useRole from "../hooks/useRole";
import PropTypes from 'prop-types'
import LoadingSpinner from "../components/Shared/LoadingSpinner";

const HostRoute = ({ children }) => {
    const [role, isLoading] = useRole();

    if (isLoading) {
        return <LoadingSpinner />
    }

    if (role?.role === 'host') {
        return children;
    }

    return <Navigate to={'/dashboard'} />
};

HostRoute.propTypes = {
    children: PropTypes.element,
}

export default HostRoute;