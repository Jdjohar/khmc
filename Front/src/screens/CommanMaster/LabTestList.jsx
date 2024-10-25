import React, { useState, useEffect } from 'react'

import Topbar from '../component/TopNavBar';
import { Link } from 'react-router-dom';

const LabTestList = () => {

    const [LabTests, setLabTests] = useState([]);
    const [loading, setLoading] = useState(true); // For loading state

    // Fetch data from the API when the component is mounted
    useEffect(() => {
        const fetchLabTests = async () => {
            try {
                const response = await fetch("https://khmc-xdlm.onrender.com/api/testName");
                const data = await response.json();
                console.log(data, "data");

                setLabTests(data); // Set the response data in the LabTests state
                setLoading(false); // Stop the loading state
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false); // Stop the loading even in case of error
            }
        };

        fetchLabTests(); // Call the function
    }, []); // Empty dependency array to run only once

    // If still loading, show a loading message
    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <Topbar />
            <div className="container-fluid p-0 page-body-wrapper">
                {/* <SideNavbar /> */}
                <div className="main-panel">
                    <div className="content-wrapper">
                        <div className="page-header">
                            <h3 className="page-title">
                                <span className="page-title-icon bg-gradient-primary text-white me-2">
                                    <i className="mdi mdi-home"></i>
                                </span>
                                labtest List
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
                                        <h4 className="card-title">labtest List</h4>
                                        <div className="table-responsive">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Action</th>
                                                        <th>Test Name</th>
                                                        <th>Code</th>
                                                        <th>Rate</th>
                                                        <th>Deparment</th>

                                                    </tr>
                                                </thead>
                                                <tbody id="patient-table-body">
                                                    {console.log(LabTests, "LabTests")
                                                    }
                                                    {LabTests.map((labtest) => (
                                                        <tr key={labtest._id}>
                                                            <td>
                                                                {/* Dropdown menu */}
                                                                <div className="dropdown">
                                                                    <i
                                                                        className="mdi mdi-menu"
                                                                        type="button"
                                                                        id={`dropdownMenuButton${labtest._id}`}
                                                                        data-bs-toggle="dropdown"
                                                                        aria-expanded="false"
                                                                        style={{ cursor: "pointer" }}
                                                                    >
                                                                        {/* Menu Icon */}
                                                                    </i>
                                                                    <ul
                                                                        className="dropdown-menu mega-menu1"
                                                                        aria-labelledby={`dropdownMenuButton${labtest._id}`}
                                                                    >
                                                                        <div className="row">
                                                                            <div className="col-12">
                                                                                <Link to={`/master/testname/${labtest._id}`} className="dropdown-item text-dark text-decoration-none">
                                                                                    <li>Edit</li>
                                                                                </Link>

                                                                                <Link to={`/master/testComment/${labtest._id}`} className="dropdown-item text-dark text-decoration-none">
                                                                                    <li>Add Comment</li>
                                                                                </Link>

                                                                                <Link to={`/master/testComment/${labtest._id}`} className="dropdown-item text-dark text-decoration-none">
                                                                                    <li>Show Comment</li>
                                                                                </Link>

                                                                                {/* Delete button not wrapped in Link if it’s not a navigational action */}
                                                                                <li className="dropdown-item" onClick={() => handleDelete(labtest._id)}>Delete</li>
                                                                            </div>


                                                                        </div>
                                                                    </ul>
                                                                </div>
                                                            </td>
                                                            <td>{labtest.TestName}{labtest._id}</td>
                                                            <td>{labtest.TestCode}</td>
                                                            <td>{labtest.Rate}</td>
                                                            <td>{labtest.Department}</td>

                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div></div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default LabTestList