import React, { useEffect, useState } from 'react';
import SideNavbar from '../component/SideNavbar';
import Topbar from '../component/TopNavBar';

// Modal component to show the popup
const Modal = ({ isOpen, onClose, patients }) => {
    if (!isOpen) return null; // Don't render if the modal is not open
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Select a Patient</h3>
          {console.log(patients, "++++++++++++++")}
          <ul>
            {patients.map((patient, index) => (
              <li key={index}>
                <button onClick={() => onClose(patient)}>{patient.patientName}</button>
              </li>
            ))}
          </ul>
          <button className="close-button" onClick={() => onClose(null)}>Close</button>
        </div>
      </div>
    );
  };
  

const PatientReg = () => {
    const [patientType, setPatientType] = useState(''); // State to track the selected patient type
    const [error, setError] = useState('')
    const [Loading, setLoading] = useState('')
    const [Gender, setGender] = useState('')
    const [Department, setDepartment] = useState([])
    const [Doctor, setDoctor] = useState([])
    const [Reffby, setReffby] = useState([])
    const [Religion, setReligion] = useState([])
    const [dataFetched, setDataFetched] = useState(false)
    const [searchResults, setSearchResults] = useState([]);
const [selectedPatient, setSelectedPatient] = useState(null);
const [patients, setPatients] = useState([]);
const [isModalOpen, setIsModalOpen] = useState(false);
    const fetchSequenceNumbers = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/patientsNumber');
            if (response.ok) {
                const data = await response.json();

                const latestPatient = data[data.length - 1]; // Get the latest entry (last item in the array)
                console.log("sd:", latestPatient);
                // Extract the numeric part of UHID and OPD, then increment for the new patient
                const nextUhid = parseInt(latestPatient.uhid) + 1;
                const nextOpdno = parseInt(latestPatient.opdno) + 1;
                console.log("sd:", nextUhid);
                console.log("sdsd:", nextOpdno);
                setFormData((prevData) => ({
                    ...prevData,
                    uhid: `${nextUhid}`,  // Set the next UHID
                    opdno: `${nextOpdno}` // Set the next OPD number
                }));
                setLoading(false); // Set loading to false after data is fetched
            } else {
                throw new Error('Failed to fetch sequence numbers');
            }
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

   
    const handleSelectPatient = (patient) => {
        setSelectedPatient(patient);
        setFormData({
            ...formData,
            ...patient
        });
       
    };
    const importPatient = () => {
        
        setoldFormData((prevData) => ({
            ...prevData,
            ...data,  // Assuming the response contains all the required patient fields
        }));
       
    };

    

    useEffect(() => {

        const fetchData = async () => {
            try {
                // Run all API requests in parallel
                const [genderResponse, religionResponse, departmentResponse, doctorResponse, reffbyResponse] = await Promise.all([
                    fetch("http://localhost:3001/api/category"),
                    fetch("http://localhost:3001/api/religion"),
                    fetch("http://localhost:3001/api/department"),
                    fetch("http://localhost:3001/api/doctor"),
                    fetch("http://localhost:3001/api/reffby"),
                ]);

                // Parse the JSON responses
                const [genderData, religionData, departmentData, doctorData, reffbyData] = await Promise.all([
                    genderResponse.json(),
                    religionResponse.json(),
                    departmentResponse.json(),
                    doctorResponse.json(),
                    reffbyResponse.json()
                ]);

                // Log the type of each response to verify it's an array
                console.log("Gender Data:", genderData);
                console.log("Religion Data:", religionData);
                console.log("Department Data:", departmentData);
                console.log("Doctor Data:", doctorData);
                console.log("Reff Data:", reffbyData);

                // Set the state with the fetched data
                setGender(genderData);
                setReligion(religionData);
                setDepartment(departmentData);
                setReffby(reffbyData);
                setDoctor(doctorData);

                // Stop the loading state when all data is fetched
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false); // Stop the loading even in case of error
            }
        };

        fetchData();

        // You can also call other functions like fetchSequenceNumbers here
        fetchSequenceNumbers();
    }, []);
    // Handler for changing patient type
    const handlePatientTypeChange = (e) => {
        setPatientType(e.target.value);

        
    };

    const [formData, setFormData] = useState({
        uhid: '',
        uhidprefix: 'KHMC/',
        mobile: '',
        date: '',
        opdno: '',
        email: '',
        status: '',
        patientName: '',
        gStatus: '',
        guardianName: '',
        guardianNumber: '',
        address: '',
        city: '',
        gender: '',
        religion: '',
        age: '',
        agetype: '',
        refBy: '',
        type: '',
        department: '',
        refTo: '',
        identStatus: '',
        identity: '',
        visitType: '',
        paymentType: '',
        discountType: '',
        discount: '',
        remarks: ''
    });
    const [OldformData, setoldFormData] = useState({
        uhid: '',
        uhidprefix: 'KHMC/',
        mobile: '',
        date: '',
        opdno: '',
        email: '',
        status: '',
        patientName: '',
        gStatus: '',
        guardianName: '',
        guardianNumber: '',
        address: '',
        city: '',
        gender: '',
        religion: '',
        age: '',
        agetype: '',
        refBy: '',
        type: '',
        department: '',
        refTo: '',
        identStatus: '',
        identity: '',
        visitType: '',
        paymentType: '',
        discountType: '',
        discount: '',
        remarks: ''
    });


    // Function to handle API call when UHID or mobile is entered
    const fetchPatientData = async () => {
        if (!OldformData.uhid && !OldformData.mobile) {            
            setError('Please enter either UHID or Mobile Number.');
            return;
        }
        setLoading(true);
        try {
            // Make a GET request with query parameters
            const response = await fetch(`http://localhost:3001/api/patientsearch?uhid=${OldformData.uhid}&mobile=${OldformData.mobile}`);
            const data = await response.json();
            console.log("Data",data);
            
    
            if (response.ok && data.length > 0) {
                if (data.length > 1) {
                  setPatients(data); // Store all the patients if more than one is returned
                  setIsModalOpen(true); // Open the modal for selection
                } else {
                  setoldFormData(data[0]); // Automatically fill the form with the first patient's data
                  setDataFetched(true);
                }
              } else {
                setError('No patients found.');
              }
        } catch (error) {
            setError('Failed to fetch patient data.');
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = (selectedPatient) => {
        if (selectedPatient) {
          setoldFormData(selectedPatient); // Populate oldFormData with the selected patient's data
          setDataFetched(true); // Indicate that data has been fetched and populated
        }
        setIsModalOpen(false); // Close the modal
      };
    const oldhandleChange = (e) => {
        const { name, value } = e.target;

        setoldFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/api/patients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                alert('Patient data submitted successfully!');
                console.log(data);

                // Optionally, refresh the sequence by fetching the latest again
                fetchSequenceNumbers(); // To reset UHID and OPD with the next number
            } else {
                alert('Failed to submit patient data');
            }
        } catch (error) {
            console.error('Error submitting patient data:', error);
        }
    };

    const Popup = ({ results, onSelect, onClose }) => (
        <div className="popup-overlay">
            <div className="popup-content">
                <h4>Select a Patient</h4>
                <button onClick={onClose} className="btn btn-light">Close</button>
                <table className="table">
                    <thead>
                        <tr>
                            <th>UHID</th>
                            <th>Mobile</th>
                            <th>Name</th>
                            {/* Add other columns as needed */}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map(patient => (
                            <tr key={patient.uhid}>
                                <td>{patient.uhid}</td>
                                <td>{patient.mobile}</td>
                                <td>{patient.patientName}</td>
                                <td>
                                    <button onClick={() => onSelect(patient)} className="btn btn-primary">Import</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

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
                                Patient Registration
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
                                        <form className="forms-sample" onSubmit={handleSubmit}>
                                            <div className="form-group row">
                                                <div className="col-4 mt-3">
                                                    <label htmlFor="patientType">Patient Type</label>
                                                    <select
                                                        className="form-control"
                                                        id="patientType"
                                                        value={patientType}
                                                        onChange={handlePatientTypeChange}
                                                    >
                                                        <option value="">Select Patient Type</option>
                                                        <option value="new">New Patient</option>
                                                        <option value="old">Old Patient</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {patientType === 'old' && (
                                    <>
                                        
                                        <div className="form-group row">
                                            <div className="col-4 mt-3">
                                                <label htmlFor="uhid">UHID</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="uhid"
                                                    name="uhid"
                                                    value={OldformData.uhid}
                                                    onChange={oldhandleChange}
                                                    placeholder="Enter UHID"
                                                />
                                            </div>
                                            <div className="col-4 mt-3">
                                                <label htmlFor="mobilenumber">Mobile Number</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="mobilenumber"
                                                    name="mobile"
                                                    value={OldformData.mobile}
                                                    onChange={oldhandleChange}
                                                    placeholder="Enter Mobile Number"
                                                />
                                            </div>
                                            
                                           

                                            {dataFetched && (
                                            <>
                                               
                                                    <div className="col-4 mt-3">
                                                        <label htmlFor="date">Date</label>
                                                        <input
                                                            type="date"
                                                            value={OldformData.date}
                                                            name="date"
                                                            onChange={oldhandleChange}
                                                            className="form-control"
                                                            id="date"
                                                        />
                                                    </div>
                                                    <div className="col-4 mt-3">
                                                        <label htmlFor="opdno">OPD No</label>
                                                        <div className="input-group">
                                                            <div className="input-group-prepend"></div>
                                                            <input
                                                                type="text"
                                                                name="uhidprefix"
                                                                disabled
                                                                value={OldformData.uhidprefix}
                                                                onChange={oldhandleChange}
                                                                className="form-control"
                                                            />
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={OldformData.opdno}
                                                                name="opdno"
                                                                onChange={handleChange}
                                                                aria-label="Text input with dropdown button"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div class="col-4 mt-3">
                                                            <label for="exampleInputName1">Email</label>
                                                            <input
                                                                type="email"
                                                                class="form-control"
                                                                value={OldformData.email}
                                                                onChange={oldhandleChange}
                                                                name='email'
                                                                id="email"
                                                                placeholder="Enter email" />

                                                        </div>
                                                        <div class="col-4 mt-3">
                                                            <div className="mb-3 d-flex">
                                                                <div className="me-2" style={{ width: '30%' }}>
                                                                    <label htmlFor="status" className="form-label">Status</label>
                                                                    <select
                                                                        className="form-select"
                                                                        value={OldformData.status}
                                                                        onChange={oldhandleChange}
                                                                        name='status'
                                                                        id="status">
                                                                        <option value="Mr">Mr.</option>
                                                                        <option value="Mrs">Mrs.</option>
                                                                        <option value="Ms">Ms.</option>
                                                                        <option value="Dr">Dr.</option>
                                                                        <option value="Prof">Prof.</option>
                                                                    </select>
                                                                </div>
                                                                <div style={{ flexGrow: 1 }}>
                                                                    <label htmlFor="patientName" className="form-label">Patient Name</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="patientName"
                                                                        name='patientName'
                                                                        value={OldformData.patientName}
                                                                        onChange={oldhandleChange}
                                                                        placeholder="Enter patient name" />
                                                                </div>
                                                            </div>

                                                        </div>


                                                        <div class="col-4 mt-3">
                                                            <div className="mb-3 d-flex">
                                                                <div className="me-2" style={{ width: '30%' }}>
                                                                    <label htmlFor="status" className="form-label">Status</label>
                                                                    <select
                                                                        className="form-select"
                                                                        value={OldformData.gStatus}
                                                                        name='gStatus'
                                                                        onChange={oldhandleChange}
                                                                        id="status">
                                                                        <option value=''>Select</option>
                                                                        <option value='self'>Self</option>
                                                                        <option value='C/O'>C/O</option>
                                                                        <option value='D/O'>D/O </option>
                                                                        <option value='S/O'>S/O </option>
                                                                        <option value='W/O'>W/O </option>
                                                                        <option value='H/O'>H/O </option>
                                                                    </select>
                                                                </div>
                                                                <div style={{ flexGrow: 1 }}>
                                                                    <label htmlFor="GuardianName" className="form-label">Guardian Name</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="GuardianName"
                                                                        name='guardianName'
                                                                        value={OldformData.guardianName}
                                                                        onChange={oldhandleChange}
                                                                        placeholder="Enter Guardian Name" />
                                                                </div>
                                                            </div>

                                                        </div>

                                                        <div class="col-4 mt-3">
                                                            <label for="GuardianNumber">Guardian Number</label>
                                                            <input
                                                                type="text"
                                                                class="form-control"
                                                                id="GuardianNumber"
                                                                value={OldformData.guardianNumber}
                                                                name='guardianNumber'
                                                                onChange={oldhandleChange}
                                                                placeholder="Enter Guardian Number" />
                                                        </div>
                                                        <div class="col-12 mt-3">
                                                            <label for="address">Address</label>
                                                            <input
                                                                type="text"
                                                                class="form-control"
                                                                id="address"
                                                                name='address'
                                                                value={OldformData.address}
                                                                onChange={oldhandleChange}
                                                                placeholder="Enter full address" />
                                                        </div>
                                                        <div class="col-4 mt-3">
                                                            <label for="city">City</label>
                                                            <input
                                                                type="text"
                                                                class="form-control"
                                                                id="city"
                                                                name='city'
                                                                value={OldformData.city}
                                                                onChange={oldhandleChange}
                                                                placeholder="Enter city name" />
                                                        </div>
                                                        <div class="col-4 mt-3">
                                                            <label for="exampleInputName1">Gender</label>
                                                            {console.log("dsdsd", OldformData.gender)}
                                                            <select
                                                                value={OldformData.gender}
                                                                onChange={oldhandleChange}
                                                                name='gender'
                                                                className='form-control'
                                                            >
                                                                <option value=''>Select Gender</option>
                                                                {/* Dynamically create option elements from Gender array */}
                                                                {Gender.map((item) => (
                                                                    <option key={item._id} value={item.type}>
                                                                        {item.categoryname}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div class="col-4 mt-3">
                                                            <label for="exampleInputName1">Religion</label>
                                                            <select
                                                                value={OldformData.religion}
                                                                onChange={oldhandleChange}
                                                                name='religion'
                                                                className='form-control'>
                                                                    <option value=''>Select Religion</option>
                                                                {Religion.map((item) => (
                                                                    <option key={item._id} value={item.type}>
                                                                        {item.religionname}
                                                                    </option>
                                                                ))}

                                                                
                                                              

                                                            </select>
                                                        </div>
                                                        <div class="col-4 mt-3">
                                                            <div className="mb-3 d-flex">
                                                                <div className="me-2" style={{ width: '30%' }}>
                                                                    <label htmlFor="status" className="form-label">Age</label>
                                                                    <select
                                                                        className="form-select"
                                                                        value={OldformData.agetype}
                                                                        name='agetype'
                                                                        onChange={oldhandleChange}
                                                                        id="status">
                                                                        <option value=''>Select</option>
                                                                        <option value='year'>Year</option>
                                                                        <option value='month'>Month</option>
                                                                        <option value='day'>Day </option>
                                                                    </select>
                                                                </div>
                                                                <div style={{ flexGrow: 1 }}>
                                                                    <label htmlFor="age" className="form-label"></label>
                                                                    <input type="text"
                                                                        className="form-control"
                                                                        value={OldformData.age}
                                                                        name='age'
                                                                        onChange={oldhandleChange}
                                                                        id="GuardianName" placeholder="Enter Guardian Name" />
                                                                </div>
                                                            </div>

                                                        </div>

                                                        <div class="col-4 mt-3">
                                                            <label for="exampleInputName1">Ref By</label>
                                                            <select
                                                                value={OldformData.refBy}
                                                                onChange={oldhandleChange}
                                                                name='refBy'
                                                                className='form-control'>
                                                                <option value=''>Select Reff</option>
                                                                {Reffby.map((item) => (
                                                                    <option key={item._id} value={item.doctorName}>
                                                                        {item.doctorName}
                                                                    </option>
                                                                ))}

                                                            </select>
                                                        </div>

                                                        <div class="col-4 mt-3">
                                                            <label for="exampleInputName1">Type</label>
                                                            <select
                                                                value={OldformData.type}
                                                                onChange={oldhandleChange}
                                                                name='type'
                                                                className='form-control'>
                                                                <option value=''>Select Type</option>
                                                                <option value='Indoor'>Indoor</option>
                                                                <option value='Outdoor'>Outdoor</option>
                                                                <option value='Tele Medicine'>Tele Medicine</option>
                                                            </select>
                                                        </div>
                                                        <div class="col-4 mt-3">
                                                            <label for="exampleInputName1">Department</label>
                                                            <select
                                                                value={OldformData.department}
                                                                onChange={oldhandleChange}
                                                                name='department'
                                                                className='form-control'>
                                                                <option value=''>Select Type</option>
                                                                {Department.map((item) => (
                                                                    <option key={item._id} value={item.type}>
                                                                        {item.departmentname}
                                                                    </option>
                                                                ))}
                                                               
                                                            </select>
                                                        </div>
                                                        <div class="col-4 mt-3">
                                                            <label for="exampleInputName1">Reff To</label>
                                                            <select
                                                                value={OldformData.refTo}
                                                                name='refTo'
                                                                onChange={oldhandleChange}
                                                                className='form-control'>
                                                                <option value=''>Select Type</option>
                                                                {Doctor.map((item) => (
                                                                    <option key={item._id} value={item.doctorname}>
                                                                        {item.doctorname}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div class="col-4 mt-3">
                                                            <div className="mb-3 d-flex">
                                                                <div className="me-2" style={{ width: '30%' }}>
                                                                    <label htmlFor="status" className="form-label">Status</label>
                                                                    <select
                                                                        value={OldformData.identStatus}
                                                                        onChange={oldhandleChange}
                                                                        name='identStatus'
                                                                        className="form-select"
                                                                        id="status">
                                                                        <option value=''>Select</option>
                                                                        <option value='Aadhar No'>Aadhar No</option>
                                                                        <option value='DL NO'>DL NO</option>
                                                                        <option value='VOTER ID'>VOTER ID</option>
                                                                        <option value='PAN CARD'>PAN CARD </option>
                                                                        <option value='RASHAN CARD'>RASHAN CARD </option>
                                                                        <option value='OTHER'>OTHER </option>
                                                                    </select>
                                                                </div>
                                                                <div style={{ flexGrow: 1 }}>
                                                                    <label htmlFor="identity" className="form-label">Identity</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="GuardianName"
                                                                        name='identity'
                                                                        value={OldformData.identity}
                                                                        onChange={oldhandleChange}
                                                                        placeholder="Enter Guardian Name" />
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div class="col-4 mt-3">
                                                            <label for="exampleInputName1">Visit Type</label>
                                                            <select value={OldformData.visitType}
                                                                name='visitType'
                                                                onChange={oldhandleChange}
                                                                className='form-control'>
                                                                <option value=''>Select Type</option>
                                                                <option value='Regular'>Regular</option>
                                                                <option value='Police Case'>Police Case</option>
                                                                <option value='Reffer'>Reffer</option>
                                                                <option value='LFP'>LFP</option>
                                                            </select>
                                                        </div>
                                                        <div class="col-4 mt-3">
                                                            <label for="exampleInputName1">Payment Type</label>
                                                            <select
                                                                value={OldformData.paymentType}
                                                                onChange={oldhandleChange}
                                                                name='paymentType'
                                                                className='form-control'>
                                                                <option value=''>Select Type</option>
                                                                <option value='cash'>Cash</option>
                                                                <option value='UPI'>UPI</option>
                                                                <option value='Credit-Debit-card'>Credit Debit Card</option>
                                                                <option value='Other'>Other</option>
                                                            </select>
                                                        </div>

                                                        <div class="col-4 mt-3">
                                                            <div className="mb-3 d-flex">
                                                                <div className="me-2" style={{ width: '30%' }}>
                                                                    <label htmlFor="status" className="form-label">Discount Type </label>
                                                                    <select
                                                                        value={OldformData.discountType}
                                                                        onChange={oldhandleChange}
                                                                        name='discountType'
                                                                        className="form-select" id="status">
                                                                        <option value=''>Select</option>
                                                                        <option value='Self'>Self</option>
                                                                        <option value='Ref'>Ref</option>
                                                                    </select>
                                                                </div>
                                                                <div style={{ flexGrow: 1 }}>
                                                                    <label htmlFor="identity" className="form-label">Discount</label>
                                                                    <input
                                                                        type="text"
                                                                        name='discount'
                                                                        value={OldformData.discount}
                                                                        onChange={oldhandleChange}
                                                                        className="form-control"
                                                                        id="Discount"
                                                                        placeholder="Enter Discount" />
                                                                </div>
                                                            </div>

                                                        </div>

                                                        <div class="col-12 mt-3">
                                                            <label for="city">Remarks</label>
                                                            <textarea
                                                                onChange={oldhandleChange}
                                                                name='remarks'
                                                                value={OldformData.remarks}
                                                                class="form-control"
                                                                id="city" ></textarea>
                                                        </div>
                                               
                                            </>
                                        )}


                                        </div>
                                        <div className="form-group row">
                                        <div className="col-4 mt-4">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary mt-4"
                                                    onClick={fetchPatientData}
                                                    disabled={Loading}
                                                >
                                                    {Loading ? 'Fetching...' : 'Fetch Data'}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                                            {patientType === 'new' && (
                                                <>
                                                    {/* Full form content goes here */}
                                                    <div className="form-group row">

                                                        <div className="col-4 mt-3">
                                                            <label htmlFor="mobilenumber">Mobile Number</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name='mobile'
                                                                // value={formData.mobile || '2525'}
                                                                value={formData['mobile']}
                                                                onChange={handleChange}
                                                                id="mobilenumber"
                                                                placeholder="Enter Mobile Number" />
                                                        </div>
                                                        <div className="col-4 mt-3">
                                                            <label htmlFor="date">Date</label>
                                                            <input
                                                                type="date"
                                                                value={formData.date}
                                                                name="date"
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                id="date" />
                                                        </div>

                                                        <div class="col-4 mt-3">
                                                            <label for="exampleInputName1">UHID</label>
                                                            <div class="input-group">
                                                                <div class="input-group-prepend">

                                                                </div>

                                                                <input type="text" disabled value="KHMC/" class="form-control" />
                                                                <input type="text"
                                                                    value={formData.uhid}
                                                                    name="uhid"
                                                                    onChange={handleChange}
                                                                    class="form-control" />
                                                            </div>

                                                        </div>
                                                        <div class="col-4 mt-3">
                                                            <label for="exampleInputName1">OPD No</label>
                                                            <div class="input-group">
                                                                <div class="input-group-prepend">

                                                                </div>

                                                                <input type="text"

                                                                    name="uhidprefix"
                                                                    disabled
                                                                    value={formData.uhidprefix}
                                                                    onChange={handleChange}
                                                                    class="form-control"
                                                                />
                                                                <input type="text"
                                                                    class="form-control"
                                                                    value={formData.opdno}
                                                                    name='opdno'
                                                                    onChange={handleChange}
                                                                    aria-label="Text input with dropdown button" />
                                                            </div>

                                                        </div>

                                                        <div class="col-4 mt-3">
                                                            <label for="exampleInputName1">Email</label>
                                                            <input
                                                                type="email"
                                                                class="form-control"
                                                                value={formData.email}
                                                                onChange={handleChange}
                                                                name='email'
                                                                id="email"
                                                                placeholder="Enter email" />

                                                        </div>
                                                        <div class="col-4 mt-3">
                                                            <div className="mb-3 d-flex">
                                                                <div className="me-2" style={{ width: '30%' }}>
                                                                    <label htmlFor="status" className="form-label">Status</label>
                                                                    <select
                                                                        className="form-select"
                                                                        value={formData.status}
                                                                        onChange={handleChange}
                                                                        name='status'
                                                                        id="status">
                                                                        <option value="Mr">Mr.</option>
                                                                        <option value="Mrs">Mrs.</option>
                                                                        <option value="Ms">Ms.</option>
                                                                        <option value="Dr">Dr.</option>
                                                                        <option value="Prof">Prof.</option>
                                                                    </select>
                                                                </div>
                                                                <div style={{ flexGrow: 1 }}>
                                                                    <label htmlFor="patientName" className="form-label">Patient Name</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="patientName"
                                                                        name='patientName'
                                                                        value={formData.patientName}
                                                                        onChange={handleChange}
                                                                        placeholder="Enter patient name" />
                                                                </div>
                                                            </div>

                                                        </div>


                                                        <div class="col-4 mt-3">
                                                            <div className="mb-3 d-flex">
                                                                <div className="me-2" style={{ width: '30%' }}>
                                                                    <label htmlFor="status" className="form-label">Status</label>
                                                                    <select
                                                                        className="form-select"
                                                                        value={formData.gStatus}
                                                                        name='gStatus'
                                                                        onChange={handleChange}
                                                                        id="status">
                                                                        <option value=''>Select</option>
                                                                        <option value='self'>Self</option>
                                                                        <option value='C/O'>C/O</option>
                                                                        <option value='D/O'>D/O </option>
                                                                        <option value='S/O'>S/O </option>
                                                                        <option value='W/O'>W/O </option>
                                                                        <option value='H/O'>H/O </option>
                                                                    </select>
                                                                </div>
                                                                <div style={{ flexGrow: 1 }}>
                                                                    <label htmlFor="GuardianName" className="form-label">Guardian Name</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="GuardianName"
                                                                        name='guardianName'
                                                                        value={formData.guardianName}
                                                                        onChange={handleChange}
                                                                        placeholder="Enter Guardian Name" />
                                                                </div>
                                                            </div>

                                                        </div>

                                                        <div class="col-4 mt-3">
                                                            <label for="GuardianNumber">Guardian Number</label>
                                                            <input
                                                                type="text"
                                                                class="form-control"
                                                                id="GuardianNumber"
                                                                value={formData.guardianNumber}
                                                                name='guardianNumber'
                                                                onChange={handleChange}
                                                                placeholder="Enter Guardian Number" />
                                                        </div>
                                                        <div class="col-12 mt-3">
                                                            <label for="address">Address</label>
                                                            <input
                                                                type="text"
                                                                class="form-control"
                                                                id="address"
                                                                name='address'
                                                                value={formData.address}
                                                                onChange={handleChange}
                                                                placeholder="Enter full address" />
                                                        </div>
                                                        <div class="col-4 mt-3">
                                                            <label for="city">City</label>
                                                            <input
                                                                type="text"
                                                                class="form-control"
                                                                id="city"
                                                                name='city'
                                                                value={formData.city}
                                                                onChange={handleChange}
                                                                placeholder="Enter city name" />
                                                        </div>
                                                        <div class="col-4 mt-3">
                                                            <label for="exampleInputName1">Gender</label>
                                                            {console.log("dsdsd", formData.gender)}
                                                            <select
                                                                value={formData.gender}
                                                                onChange={handleChange}
                                                                name='gender'
                                                                className='form-control'
                                                            >
                                                                <option value=''>Select Gender</option>
                                                                {/* Dynamically create option elements from Gender array */}
                                                                {Gender.map((item) => (
                                                                    <option key={item._id} value={item.type}>
                                                                        {item.categoryname}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div class="col-4 mt-3">
                                                            <label for="exampleInputName1">Religion</label>
                                                            <select
                                                                value={formData.religion}
                                                                onChange={handleChange}
                                                                name='religion'
                                                                className='form-control'>
                                                                    <option value=''>Select Religion</option>
                                                                {Religion.map((item) => (
                                                                    <option key={item._id} value={item.type}>
                                                                        {item.religionname}
                                                                    </option>
                                                                ))}

                                                                
                                                              

                                                            </select>
                                                        </div>
                                                        <div class="col-4 mt-3">
                                                            <div className="mb-3 d-flex">
                                                                <div className="me-2" style={{ width: '30%' }}>
                                                                    <label htmlFor="status" className="form-label">Age</label>
                                                                    <select
                                                                        className="form-select"
                                                                        value={formData.agetype}
                                                                        name='agetype'
                                                                        onChange={handleChange}
                                                                        id="status">
                                                                        <option value=''>Select</option>
                                                                        <option value='year'>Year</option>
                                                                        <option value='month'>Month</option>
                                                                        <option value='day'>Day </option>
                                                                    </select>
                                                                </div>
                                                                <div style={{ flexGrow: 1 }}>
                                                                    <label htmlFor="age" className="form-label"></label>
                                                                    <input type="text"
                                                                        className="form-control"
                                                                        value={formData.age}
                                                                        name='age'
                                                                        onChange={handleChange}
                                                                        id="GuardianName" placeholder="Enter Guardian Name" />
                                                                </div>
                                                            </div>

                                                        </div>

                                                        <div class="col-4 mt-3">
                                                            <label for="exampleInputName1">Ref By</label>
                                                            <select
                                                                value={formData.refBy}
                                                                onChange={handleChange}
                                                                name='refBy'
                                                                className='form-control'>
                                                                <option value=''>Select Reff</option>
                                                                {Reffby.map((item) => (
                                                                    <option key={item._id} value={item.doctorName}>
                                                                        {item.doctorName}
                                                                    </option>
                                                                ))}

                                                            </select>
                                                        </div>

                                                        <div class="col-4 mt-3">
                                                            <label for="exampleInputName1">Type</label>
                                                            <select
                                                                value={formData.type}
                                                                onChange={handleChange}
                                                                name='type'
                                                                className='form-control'>
                                                                <option value=''>Select Type</option>
                                                                <option value='Indoor'>Indoor</option>
                                                                <option value='Outdoor'>Outdoor</option>
                                                                <option value='Tele Medicine'>Tele Medicine</option>
                                                            </select>
                                                        </div>
                                                        <div class="col-4 mt-3">
                                                            <label for="exampleInputName1">Department</label>
                                                            <select
                                                                value={formData.department}
                                                                onChange={handleChange}
                                                                name='department'
                                                                className='form-control'>
                                                                <option value=''>Select Type</option>
                                                                {Department.map((item) => (
                                                                    <option key={item._id} value={item.type}>
                                                                        {item.departmentname}
                                                                    </option>
                                                                ))}
                                                               
                                                            </select>
                                                        </div>
                                                        <div class="col-4 mt-3">
                                                            <label for="exampleInputName1">Reff To</label>
                                                            <select
                                                                value={formData.refTo}
                                                                name='refTo'
                                                                onChange={handleChange}
                                                                className='form-control'>
                                                                <option value=''>Select Type</option>
                                                                {Doctor.map((item) => (
                                                                    <option key={item._id} value={item.doctorname}>
                                                                        {item.doctorname}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div class="col-4 mt-3">
                                                            <div className="mb-3 d-flex">
                                                                <div className="me-2" style={{ width: '30%' }}>
                                                                    <label htmlFor="status" className="form-label">Status</label>
                                                                    <select
                                                                        value={formData.identStatus}
                                                                        onChange={handleChange}
                                                                        name='identStatus'
                                                                        className="form-select"
                                                                        id="status">
                                                                        <option value=''>Select</option>
                                                                        <option value='Aadhar No'>Aadhar No</option>
                                                                        <option value='DL NO'>DL NO</option>
                                                                        <option value='VOTER ID'>VOTER ID</option>
                                                                        <option value='PAN CARD'>PAN CARD </option>
                                                                        <option value='RASHAN CARD'>RASHAN CARD </option>
                                                                        <option value='OTHER'>OTHER </option>
                                                                    </select>
                                                                </div>
                                                                <div style={{ flexGrow: 1 }}>
                                                                    <label htmlFor="identity" className="form-label">Identity</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="GuardianName"
                                                                        name='identity'
                                                                        value={formData.identity}
                                                                        onChange={handleChange}
                                                                        placeholder="Enter Guardian Name" />
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div class="col-4 mt-3">
                                                            <label for="exampleInputName1">Visit Type</label>
                                                            <select value={formData.visitType}
                                                                name='visitType'
                                                                onChange={handleChange}
                                                                className='form-control'>
                                                                <option value=''>Select Type</option>
                                                                <option value='Regular'>Regular</option>
                                                                <option value='Police Case'>Police Case</option>
                                                                <option value='Reffer'>Reffer</option>
                                                                <option value='LFP'>LFP</option>
                                                            </select>
                                                        </div>
                                                        <div class="col-4 mt-3">
                                                            <label for="exampleInputName1">Payment Type</label>
                                                            <select
                                                                value={formData.paymentType}
                                                                onChange={handleChange}
                                                                name='paymentType'
                                                                className='form-control'>
                                                                <option value=''>Select Type</option>
                                                                <option value='cash'>Cash</option>
                                                                <option value='UPI'>UPI</option>
                                                                <option value='Credit-Debit-card'>Credit Debit Card</option>
                                                                <option value='Other'>Other</option>
                                                            </select>
                                                        </div>

                                                        <div class="col-4 mt-3">
                                                            <div className="mb-3 d-flex">
                                                                <div className="me-2" style={{ width: '30%' }}>
                                                                    <label htmlFor="status" className="form-label">Discount Type </label>
                                                                    <select
                                                                        value={formData.discountType}
                                                                        onChange={handleChange}
                                                                        name='discountType'
                                                                        className="form-select" id="status">
                                                                        <option value=''>Select</option>
                                                                        <option value='Self'>Self</option>
                                                                        <option value='Ref'>Ref</option>
                                                                    </select>
                                                                </div>
                                                                <div style={{ flexGrow: 1 }}>
                                                                    <label htmlFor="identity" className="form-label">Discount</label>
                                                                    <input
                                                                        type="text"
                                                                        name='discount'
                                                                        value={formData.discount}
                                                                        onChange={handleChange}
                                                                        className="form-control"
                                                                        id="Discount"
                                                                        placeholder="Enter Discount" />
                                                                </div>
                                                            </div>

                                                        </div>

                                                        <div class="col-12 mt-3">
                                                            <label for="city">Remarks</label>
                                                            <textarea
                                                                onChange={handleChange}
                                                                name='remarks'
                                                                value={formData.remarks}
                                                                class="form-control"
                                                                id="city" ></textarea>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            <button type="submit" className="btn btn-gradient-primary me-2">Submit</button>
                                            <button className="btn btn-light">Cancel</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Render the modal when multiple patients are found */}
      <Modal isOpen={isModalOpen} onClose={handleModalClose} patients={patients} />
            </div>
        </>
    );
};

export default PatientReg;