import { Chart } from "react-google-charts";
import PropTypes from "prop-types";
import { useState } from "react";
import { useEffect } from "react";
import LoadingSpinner from "../Shared/LoadingSpinner";


// const data = [
//     ["x", "dogs"],
//     [0, 0],
//     [1, 10],
//     [2, 23],
//     [3, 17],
//     [4, 18],
//     [5, 9],
//     [6, 11],
//     [7, 27],
//     [8, 33],
//     [9, 40],
//     [10, 32],
//     [11, 35],
// ];

const options = {
    title: "Total overview data",
    hAxis: { title: "Sales" },
    vAxis: { title: "Growth" },
    legend: "none",
};

function AdminChart({ data }) {

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 800)
    }, [])

    return (

        <>
            {
                loading ? <LoadingSpinner smallHeight={true} /> : (
                    <Chart
                        chartType="LineChart"
                        width="100%"
                        height="400px"
                        data={data}
                        options={options}
                    />
                )
            }
        </>

    );
}

AdminChart.propTypes = {
    data: PropTypes.array
}

export default AdminChart;