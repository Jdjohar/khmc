import React, { useState, useEffect } from 'react'
import SideNavbar from '../component/SideNavbar';
import Topbar from '../component/TopNavBar';
import { Link } from 'react-router-dom';

const PatientList = () => {

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true); // For loading state

    // Fetch data from the API when the component is mounted
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await fetch("https://khmc.onrender.com/api/patients");
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
            <div className="container-fluid page-body-wrapper">
                <SideNavbar />
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
                                    <div class="card-body">
                                        <h4 class="card-title">Patient List</h4>
                                        <div class="table-responsive">
                                            <table class="table">
                                                <thead>
                                                    <tr>
                                                        <th>Action</th>
                                                        <th>UHID</th>
                                                        <th>OPD No</th>
                                                        <th>Mobile</th>
                                                        <th>Email</th>
                                                        <th>Status</th>
                                                        <th>Patient Name</th>
                                                        <th>Guardian Status</th>
                                                        <th>Guardian Name</th>
                                                        <th>Guardian Number</th>
                                                        <th>Address</th>
                                                        <th>City</th>
                                                        <th>Gender</th>
                                                        <th>Religion</th>
                                                        <th>Age</th>
                                                        <th>Referred By</th>
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

                                                                                <li className="dropdown-item"> 
                                                                                    
                                                                                    <a href={`/master/patientEdit/${patient._id}`}
                                                                                    className="dropdown-item" > Edit Patient </a></li>

                                                                                <li className="dropdown-item">Print Bill</li>
                                                                                <li className="dropdown-item">Print Prescription</li>
                                                                                <li className="dropdown-item">Lab</li>
                                                                                <li className="dropdown-item">Ultra Sound</li>
                                                                                <li className="dropdown-item">Edit</li>
                                                                            </div>
                                                                            <div className="col-lg-4">
                                                                                <li className="dropdown-item">Delete</li>
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
                                                            <td>{patient.email}</td>
                                                            <td>{patient.status}</td>
                                                            <td>{patient.patientName}</td>
                                                            <td>{patient.gStatus}</td>
                                                            <td>{patient.guardianName}</td>
                                                            <td>{patient.guardianNumber}</td>
                                                            <td>{patient.address}</td>
                                                            <td>{patient.city}</td>
                                                            <td>{patient.gender}</td>
                                                            <td>{patient.religion}</td>
                                                            <td>{patient.age}</td>
                                                            <td>{patient.refBy}</td>
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