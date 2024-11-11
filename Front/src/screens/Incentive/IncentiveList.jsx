import React, { useState, useEffect } from 'react';
import Topbar from '../component/TopNavBar';
import { Link } from 'react-router-dom';

const IncentiveList = () => {
    const [incentiveReports, setIncentiveReports] = useState([]);
    const [incentiveTypes, setIncentiveTypes] = useState([]);
    const [testNames, setTestNames] = useState([]);
    const [reffByList, setReffByList] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all necessary data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const incentiveReportsResponse = await fetch("https://khmc-xdlm.onrender.com/api/incentiveReport");
                const incentiveReportsData = await incentiveReportsResponse.json();

                const incentiveTypesResponse = await fetch("https://khmc-xdlm.onrender.com/api/incentiveType");
                const incentiveTypesData = await incentiveTypesResponse.json();

                const testNamesResponse = await fetch("https://khmc-xdlm.onrender.com/api/testName");
                const testNamesData = await testNamesResponse.json();

                const reffByResponse = await fetch("https://khmc-xdlm.onrender.com/api/reffby");
                const reffByData = await reffByResponse.json();

                // Set the data in states
                setIncentiveReports(incentiveReportsData);
                setIncentiveTypes(incentiveTypesData);
                setTestNames(testNamesData);
                setReffByList(reffByData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Helper functions to get names from IDs
    const getIncentiveTypeName = (id) => {
        const incentiveType = incentiveTypes.find((type) => type._id === id);
        return incentiveType ? incentiveType.typeName : "Unknown Type";
    };

    const getTestName = (id) => {
        const test = testNames.find((test) => test._id === id);
        return test ? test.TestName : "Unknown Test";
    };

    const getReffByName = (id) => {
        const ref = reffByList.find((ref) => ref._id === id);
        return ref ? ref.doctorName : "Unknown Referrer";
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`https://khmc-xdlm.onrender.com/api/incentiveReport/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert("Incentive Report deleted successfully!");
                setIncentiveReports((prevReports) => prevReports.filter((report) => report._id !== id));
            } else {
                alert("Failed to delete Incentive Report");
            }
        } catch (error) {
            console.error("Error deleting incentive report:", error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <Topbar />
            <div className="container-fluid p-0 page-body-wrapper">
                <div className="main-panel">
                    <div className="content-wrapper">
                        <div className="page-header">
                            <h3 className="page-title">
                                <span className="page-title-icon bg-gradient-primary text-white me-2">
                                    <i className="mdi mdi-home"></i>
                                </span>
                                Incentive Report List
                            </h3>
                            <nav aria-label="breadcrumb">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item active" aria-current="page">
                                        <span></span>Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
                                    </li>
                                </ul>
                            </nav>
                        </div>

                        <div className="row">
                            <div className="col-12 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">Incentive Report List</h4>
                                        <div className="table-responsive">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Action</th>
                                                        <th>Test Type</th>
                                                        <th>Referred By</th>
                                                        <th>Test Name</th>
                                                        <th>Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="incentive-table-body">

                                                    {console.log(incentiveReports,"dsf")}
                                                    {incentiveReports.map((report) => (
                                                        <tr key={report._id}>
                                                            <td>
                                                                <div className="dropdown">
                                                                    <i
                                                                        className="mdi mdi-menu"
                                                                        type="button"
                                                                        id={`dropdownMenuButton${report._id}`}
                                                                        data-bs-toggle="dropdown"
                                                                        aria-expanded="false"
                                                                        style={{ cursor: "pointer" }}
                                                                    ></i>
                                                                    <ul
                                                                        className="dropdown-menu mega-menu1"
                                                                        aria-labelledby={`dropdownMenuButton${report._id}`}
                                                                    >
                                                                        <div className="row">
                                                                            <div className="col-12">
                                                                                <Link to={`/master/incentiveReport/${report._id}`} className="dropdown-item text-dark text-decoration-none">
                                                                                    <li>Edit</li>
                                                                                </Link>
                                                                                <li className="dropdown-item" onClick={() => handleDelete(report._id)}>Delete</li>
                                                                            </div>
                                                                        </div>
                                                                    </ul>
                                                                </div>
                                                            </td>
                                                            <td>{getIncentiveTypeName(report.TesttypeId)}</td>
                                                            <td>{getReffByName(report.Reffby)}</td>
                                                            <td>{getTestName(report.testid)}</td>
                                                            <td>{report.incAmount}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default IncentiveList;
