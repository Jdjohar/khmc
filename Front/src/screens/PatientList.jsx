import React, { useState, useEffect } from 'react'
import SideNavbar from './component/SideNavbar';
import Topbar from './component/TopNavBar';
import { Link } from 'react-router-dom';

const PatientList = () => {

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true); // For loading state

    // Fetch data from the API when the component is mounted
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await fetch("https://khmc-xdlm.onrender.com/api/patients");
                const data = await response.json();
                setPatients(data); // Set the response data in the patients state
                setLoading(false); // Stop the loading state
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false); // Stop the loading even in case of error
            }
        };

        fetchPatients(); // Call the function
    }, []); // Empty dependency array to run only once

    // If still loading, show a loading message
    if (loading) {
        return <p>Loading...</p>;
    }


    const handleDelete = async (id) => {
        console.log("Delete operation triggered");

        try {
            // Make a DELETE request to the API
            const response = await fetch(`https://khmc-xdlm.onrender.com/api/patients/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            console.log(data, "Response from delete operation");

            if (data.success) {
                // Update the state to remove the deleted patient
                setPatients((prevPatients) => prevPatients.filter((patient) => patient._id !== id));
                alert("Patient successfully deleted!");
            } else {
                alert("Failed to delete the patient. Please try again.");
            }

        } catch (error) {
            console.error("Error deleting patient:", error);
            alert("An error occurred while deleting the patient.");
        }
    };


    const handleQuickAction = (action, patientId) => {
        switch (action) {
            case 'edit':
                navigate(`/patients/edit/${patientId}`);
                break;
            case 'delete':
                // Add delete functionality here
                break;
            default:
                break;
        }
    };
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
                                Patient List
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
                                        <h4 className="card-title">Patient List</h4>
                                        <div className="table-responsive">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Action</th>
                                                        <th>UHID</th>
                                                        <th>OPD No</th>
                                                        <th>Mobile</th>
                                                        <th>Patient Name</th>
                                                        <th>Gender</th>
                                                        <th>Religion</th>
                                                        <th>Age</th>
                                                        <th>Guardian Name</th>
                                                        <th>Referred By</th>

                                                        <th>Guardian Number</th>
                                                        <th>Address</th>
                                                        <th>City</th>
                                                        <th>Email</th>
                                                        <th>Patient Type</th>
                                                        <th>Department</th>
                                                        <th>Referred To</th>
                                                        <th>Identity Status</th>
                                                        <th>Identity</th>
                                                        <th>Visit Type</th>
                                                        <th>Payment Type</th>
                                                        <th>Discount Type</th>
                                                        <th>Discount</th>
                                                        <th>Remarks</th>
                                                        <th>Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="patient-table-body">
                                                    {patients.map((patient) => (
                                                        <tr key={patient._id}>
                                                            <td>
                                                                {/* Dropdown menu */}
                                                                <div className="dropdown">
                                                                    <i
                                                                        className="mdi mdi-menu"
                                                                        type="button"
                                                                        id={`dropdownMenuButton${patient._id}`}
                                                                        data-bs-toggle="dropdown"
                                                                        aria-expanded="false"
                                                                        style={{ cursor: "pointer" }}
                                                                    >
                                                                        {/* Menu Icon */}
                                                                    </i>
                                                                    <ul
                                                                        className="dropdown-menu mega-menu"
                                                                        aria-labelledby={`dropdownMenuButton${patient._id}`}
                                                                    >
                                                                        <div className="row">
                                                                            <div className="col-lg-4">
                                                                                <Link to={patient?.documents[2]?.url || '#'} target="_blank" rel="noopener noreferrer" className="dropdown-item text-dark text-decoration-none">
                                                                                    <li>Print Bill</li>
                                                                                </Link>

                                                                                <Link to={patient?.documents[0]?.url || '#'} target="_blank" rel="noopener noreferrer" className="dropdown-item text-dark text-decoration-none">
                                                                                    <li>Print Prescription</li>
                                                                                </Link>

                                                                                <li className="dropdown-item">Lab</li>

                                                                                <Link to={`/master/labentry/${patient._id}`} className="dropdown-item text-dark text-decoration-none">
                                                                                    <li>Ultra Sound</li>
                                                                                </Link>

                                                                                <Link to={`/master/patientEdit/${patient._id}`} className="dropdown-item text-dark text-decoration-none">
                                                                                    <li>Edit</li>
                                                                                </Link>
                                                                            </div>

                                                                            <div className="col-lg-4">
                                                                                <li className="dropdown-item" onClick={() => handleDelete(patient._id)}>Delete</li>
                                                                                <li className="dropdown-item">Ladger Daycare Bill</li>
                                                                                <li className="dropdown-item">WhatsApp Bill & Prescription</li>

                                                                            </div>

                                                                        </div>
                                                                    </ul>
                                                                </div>
                                                            </td>
                                                            <td>{patient.uhid}</td>
                                                            <td>{patient.opdno}</td>
                                                            <td>{patient.mobile}</td>
                                                            <td>{patient.status} {patient.patientName}</td>
                                                            <td>{patient.gender}</td>
                                                            <td>{patient.religion}</td>
                                                            <td>{patient.age}</td>
                                                            <td>{patient.refBy}</td>
                                                            <td>{patient.gStatus} {patient.guardianName}</td>
                                                            <td>{patient.guardianNumber}</td>
                                                            <td>{patient.address}</td>
                                                            <td>{patient.city}</td>
                                                            <td>{patient.email}</td>
                                                            <td>{patient.type}</td>
                                                            <td>{patient.department}</td>
                                                            <td>{patient.refTo}</td>
                                                            <td>{patient.identStatus}</td>
                                                            <td>{patient.identity}</td>
                                                            <td>{patient.visitType}</td>
                                                            <td>{patient.paymentType}</td>
                                                            <td>{patient.discountType}</td>
                                                            <td>{patient.discount}</td>
                                                            <td>{patient.remarks}</td>
                                                            <td>{new Date(patient.date).toLocaleDateString()}</td>
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

export default PatientList