import React, { useState, useEffect } from 'react'

import Topbar from '../component/TopNavBar';
import { Link } from 'react-router-dom';

const LablogEntry = () => {

    const [LabEntries, setLabentries] = useState([]);
    const [loading, setLoading] = useState(true); // For loading state
    const [testNames, setTestNames] = useState({});

    const fetchTestNames = async () => {
        try {
            const response = await fetch("https://khmc-xdlm.onrender.com/api/testName");
            const testData = await response.json();

            // Create a mapping of test _id to TestName
            const testNameMap = {};
            testData.forEach(test => {
                testNameMap[test._id] = test.TestName;
            });

            setTestNames(testNameMap);
        } catch (error) {
            console.error("Error fetching test names:", error);
        }
    };

    // Fetch data from the API when the component is mounted
    useEffect(() => {
        const fetchLabEntries = async () => {
            try {
                const response = await fetch("https://khmc-xdlm.onrender.com/api/labentry");
                const data = await response.json();
                console.log(data, "data");

                // Filter entries with TestType equal to "Pathology"
                const filteredEntries = data.filter(entry => entry.testType === "Radiology");
                setLabentries(filteredEntries); // Set the filtered response data in the LabEntries state
                setLoading(false); // Stop the loading state
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false); // Stop the loading even in case of error
            }
        };

        fetchLabEntries(); // Call the function
        fetchTestNames(); // Call the function
    }, []); // Empty dependency array to run only once
    const handleDelete = async (id) => {
        console.log(id, "Delete operation triggered");

        try {
            // Make a DELETE request to the API
            const response = await fetch(`https://khmc-xdlm.onrender.com/api/labentry/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            console.log(data, "Response from delete operation");

            if (data.success) {
                // Update the state to remove the deleted patient
                setLabentries((prevEntries) => prevEntries.filter((entry) => entry._id !== id));
                alert("Test successfully deleted!");
            } else {
                alert("Failed to delete the patient. Please try again.");
            }

        } catch (error) {
            console.error("Error deleting patient:", error);
            alert("An error occurred while deleting the patient.");
        }
    };
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
                                Radiology Test List
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
                                    <div className="card-body" style={{ minHeight: "600px" }}>
                                        <h4 className="card-title">labtest List</h4>
                                        <div className="table-responsive">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Action</th>
                                                        <th>Sno</th>
                                                        <th>Reg Date</th>
                                                        <th>Reg No</th>
                                                        <th>Name</th>
                                                        <th>Gender</th>
                                                        <th>Age</th>
                                                        <th>Mobile No</th>
                                                        <th>Test Name</th>
                                                        <th>City</th>

                                                    </tr>
                                                </thead>
                                                <tbody id="patient-table-body">
                                                    {console.log(LabEntries, "LabEntries")
                                                    }
                                                    {LabEntries.map((labtest) => (
                                                        <tr key={labtest._id}>
                                                            <td>
                                                                {/* Dropdown menu */}
                                                                <div className="dropdown">
                                                                    {labtest.result == false
                                                                        ?
                                                                        <i
                                                                            className="mdi mdi-menu bg-warning"
                                                                            type="button"
                                                                            id={`dropdownMenuButton${labtest._id}`}
                                                                            data-bs-toggle="dropdown"
                                                                            aria-expanded="false"
                                                                            style={{ cursor: "pointer" }}
                                                                        >
                                                                            {/* Menu Icon */}
                                                                        </i>
                                                                        :
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
                                                                    }

                                                                    <ul
                                                                        className="dropdown-menu mega-menu1"
                                                                        aria-labelledby={`dropdownMenuButton${labtest._id}`}
                                                                    >
                                                                        <div className="row">
                                                                            <div className="col-12">

                                                                                <li className="dropdown-item" onClick={() => handleDelete(labtest._id)}>
                                                                                    Delete
                                                                                </li>
                                                                                {/* <li className="dropdown-item">
                                                                                    <Link to={`/master/testEdit/${labtest._id}`}
                                                                                        className="text-dark text-decoration-none" > Edit </Link>
                                                                                </li> */}

                                                                                <li className="dropdown-item">
                                                                                    <Link to={`/master/LablogResult/${labtest._id}`}
                                                                                        className="text-dark text-decoration-none" >  Result Entry </Link>

                                                                                </li>
                                                                                <li className="dropdown-item">
                                                                                    <Link
                                                                                        to={
                                                                                            labtest?.documents?.find(doc => doc.documentType === 'testreport')?.url || '#'
                                                                                        }
                                                                                        className="text-dark text-decoration-none"
                                                                                    >
                                                                                        Report Print
                                                                                    </Link>

                                                                                    {/* <Link to={labtest?.documents[0]?.url || '#'}
                                                                                        className="text-dark text-decoration-none" > Report Print </Link> */}
                                                                                </li>
                                                                                <li className="dropdown-item">
                                                                                    <Link to={`/master/LablogResult/${labtest._id}`}
                                                                                        className="text-dark text-decoration-none" > Show Result </Link>
                                                                                </li>
                                                                                <li className="dropdown-item">
                                                                                <Link
                                                                                        to={
                                                                                            labtest?.documents?.find(doc => doc.documentType === 'testbill')?.url || '#'
                                                                                        }
                                                                                        className="text-dark text-decoration-none"
                                                                                    >
                                                                                        Receipt
                                                                                    </Link>

                                                                                    {/* <Link to={labtest?.documents[1]?.url || '#'}
                                                                                        className="text-dark text-decoration-none" >Receipt </Link> */}
                                                                                </li>

                                                                            </div>


                                                                        </div>
                                                                    </ul>
                                                                </div>
                                                            </td>
                                                            <td>{labtest.sno}</td>
                                                            <td>{labtest.date}</td>
                                                            <td>{labtest.labReg}</td>
                                                            <td>{labtest.patientName}</td>
                                                            <td>{labtest.category}</td>
                                                            <td>{labtest.age}</td>
                                                            <td>{labtest.mobile}</td>
                                                            <td>
                                                                {labtest.tests.map((testId, index) => (
                                                                    <p key={index}>{testNames[testId] || 'Unknown Test'}</p>
                                                                ))}
                                                            </td>
                                                            <td>{labtest.city}</td>

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

export default LablogEntry