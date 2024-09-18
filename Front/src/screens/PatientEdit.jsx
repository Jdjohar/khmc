import React, {useEffect, useState} from 'react'
import SideNavbar from '../component/SideNavbar';
import Topbar from '../component/TopNavBar';
import { useParams, useNavigate } from 'react-router-dom';

const PatientEdit = () => {
    
    const { id } = useParams(); // Get patient ID from the URL
    const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Hook to navigate programmatically
    // Handler for changing patient type
   

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

    useEffect(() => {
        const fetchPatient = async () => {
          try {
            const response = await fetch(`http://localhost:3001/api/patients/${id}`);
            const data = await response.json();
            setPatients(data);
            setFormData(data);
            setLoading(false);
          } catch (error) {
            console.error('Error fetching patient data:', error);
            setLoading(false);
          }
        };
        fetchPatient();
    }, [id]);
    

   
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch(`http://localhost:3001/api/patients/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          if (response.ok) {
            alert('Patient updated successfully');
            navigate('/patients'); // Navigate back to the patients list
          } else {
            alert('Failed to update patient');
          }
        } catch (error) {
          console.error('Error updating patient:', error);
        }
      };
    
      if (loading) {
        return <p>Loading...</p>;
      }
    


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
                                Edit Patient
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

                                                                <input type="text" value="KHMC/" class="form-control" />
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
                                                            <select
                                                                value={formData.gender}
                                                                onChange={handleChange}
                                                                name='gender'
                                                                className='form-control'>
                                                                <option value=''>Select Gender</option>
                                                                <option value='male'>Male</option>
                                                                <option value='female'>Female</option>
                                                                <option value='child'>Child</option>
                                                                <option value='infant'>Infant</option>
                                                                <option value='Other'>Other</option>

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
                                                                <option value='na'>na</option>

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
                                                                <option value='dr'>Doctor List</option>

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
                                                                <option value='Department'>Department</option>
                                                                <option value='Department'>Department</option>
                                                                <option value='Department'>Department</option>
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
                                                                <option value='Doctor List'>Doctor List</option>
                                                                <option value='Department'>Department</option>
                                                                <option value='Department'>Department</option>
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
                                               
                                         

                                            <button type="submit" className="btn btn-gradient-primary me-2">Submit</button>
                                            <button className="btn btn-light">Cancel</button>
                                        </form>
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

export default PatientEdit