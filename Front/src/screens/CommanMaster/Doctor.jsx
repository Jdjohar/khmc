import React, { useEffect, useState } from 'react';
import Topbar from '../component/TopNavBar';
import SideNavbar from '../component/SideNavbar';
import { useParams, useNavigate } from 'react-router-dom';

const Doctor = () => {
  const [loading, setLoading] = useState(true);
  const [doctorList, setDoctorList] = useState([]);
  const [bank, setBank] = useState([])
  const [Department, setDepartment] = useState([])
  const [Religion, setReligion] = useState([])
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [formData, setFormData] = useState({
    type: '',
    doctorname: '',
    doctordepartment: '',
    doctorstatus: '',
    doctoraddress: '',
    city: '',
    mobilenumber: '',
    dob: '',
    dom: '',
    email: '',
    accountnumber: '',
    ifsccode: '',
    bankname: '',
    acbranch: '',
    manageby: '',
    background: '',
    incentiveonvisit: '',
    consfee: '',
    secondshiftfee: '',
    emergencyfee: '',
    revisitfeeafter: '',
    visitschedule: '',
    tpp: '',
    ppd: '',
    header: '',
    footer: '',
    footerheight: '',
    profile: '',
  });
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Run both API requests in parallel
        const [doctorResponse, departmentResponse, bankResponse] = await Promise.all([
          fetch("https://khmc-xdlm.onrender.com/api/doctor"),
          fetch("https://khmc-xdlm.onrender.com/api/bank"),
          fetch("https://khmc-xdlm.onrender.com/api/department")
        ]);

        // Parse the JSON responses
        const [doctorData, departmentData, bankData] = await Promise.all([
          doctorResponse.json(),
          bankResponse.json(),
          departmentResponse.json()
        ]);

        // Log the type of each response to verify it's an array
        console.log("Doctor Data:", doctorData);
        console.log("Department Data:", departmentData);
        console.log("Bank Data:", bankData);

        // Set the state with the fetched data
        setDoctorList(doctorData);
        setDepartment(departmentData);
        setBank(bankData);

        // Stop the loading state when all data is fetched
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Stop the loading even in case of error
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedDoctorId) {
      // Update existing doctor
      try {
        const response = await fetch(`https://khmc-xdlm.onrender.com/api/doctor/${selectedDoctorId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const updatedDoctor = await response.json();
          alert('Doctor updated successfully!');
          setDoctorList((prevDoctors) =>
            prevDoctors.map((doctor) =>
              doctor._id === selectedDoctorId ? updatedDoctor : doctor
            )
          );
          // navigate('/doctor')
          window.location.reload();
          resetForm();
        } else {
          alert('Failed to update doctor');
        }
      } catch (error) {
        console.error('Error updating doctor:', error);
      }
    } else {
      // Add new doctor
      try {
        const response = await fetch('https://khmc-xdlm.onrender.com/api/doctor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const newDoctor = await response.json();
          alert('Doctor added successfully!');
          setDoctorList((prevDoctors) => [...prevDoctors, newDoctor]);
          resetForm();
          //  navigate('/master/doctor')
           window.location.reload();
        } else {
          alert('Failed to add doctor');
        }
      } catch (error) {
        console.error('Error adding doctor:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (selectedDoctorId) {
      try {
        const response = await fetch(`https://khmc-xdlm.onrender.com/api/doctor/${selectedDoctorId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          alert('Doctor deleted successfully!');
          setDoctorList((prevDoctors) =>
            prevDoctors.filter((doctor) => doctor._id !== selectedDoctorId)
          );
          resetForm();
        } else {
          alert('Failed to delete doctor');
        }
      } catch (error) {
        console.error('Error deleting doctor:', error);
      }
    }
  };

  const handleRowClick = (doctor) => {
    setFormData({
      type: doctor.type,
      doctorname: doctor.doctorname,
      doctordepartment: doctor.doctordepartment,
      doctorstatus: doctor.doctorstatus,
      doctoraddress: doctor.doctoraddress,
      city: doctor.city,
      mobilenumber: doctor.mobilenumber,
      dob: doctor.dob,
      dom: doctor.dom,
      email: doctor.email,
      accountnumber: doctor.accountnumber,
      ifsccode: doctor.ifsccode,
      bankname: doctor.bankname,
      acbranch: doctor.acbranch,
      manageby: doctor.manageby,
      background: doctor.background,
      incentiveonvisit: doctor.incentiveonvisit,
      consfee: doctor.consfee,
      secondshiftfee: doctor.secondshiftfee,
      emergencyfee: doctor.emergencyfee,
      revisitfeeafter: doctor.revisitfeeafter,
      visitschedule: doctor.visitschedule,
      tpp: doctor.tpp,
      ppd: doctor.ppd,
      header: doctor.header,
      footer: doctor.footer,
      footerheight: doctor.footerheight,
      profile: doctor.profile,
    });
    setSelectedDoctorId(doctor._id);
  };

  const resetForm = () => {
    setFormData({
      type: 'Doctor',
      doctorname: '',
      doctordepartment: '',
      doctorstatus: '',
      doctoraddress: '',
      city: '',
      mobilenumber: '',
      dob: '',
      dom: '',
      email: '',
      accountnumber: '',
      ifsccode: '',
      bankname: '',
      acbranch: '',
      manageby: '',
      background: '',
      incentiveonvisit: '',
      consfee: '',
      secondshiftfee: '',
      emergencyfee: '',
      revisitfeeafter: '',
      visitschedule: '',
      tpp: '',
      ppd: '',
      header: '',
      footer: '',
      footerheight: '',
      profile: '',
    });
    setSelectedDoctorId(null);
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
                Doctor
              </h3>
              <nav aria-label="breadcrumb">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item active" aria-current="page">
                    <span></span>Doctor <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="row">
              {/* Doctor List Table */}
              <div className="col-4 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Doctor List</h4>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Doctor Name</th>
                        
                          <th>Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {doctorList.map((doctor) => (
                          <tr key={doctor._id} onClick={() => handleRowClick(doctor)} style={{ cursor: 'pointer' }}>
                            <td>{doctor.doctorname}</td>

                            <td>{doctor.type}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Doctor Form */}
              <div className="col-8 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <form className="forms-sample" onSubmit={handleSubmit}>
                      <div className="row">
                        {/* Type */}
                        <div className="col-6 form-group">
                          <label htmlFor="type">Type</label>
                          <select
                            className="form-control"
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                          >
                            <option value="">Select type</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Ref / Agent">Ref / Agent</option>
                            <option value="Pathologist">Pathologist</option>
                            <option value="Anesthist">Anesthist</option>
                            <option value="OT Manager">OT Manager</option>
                            <option value="OT Assistent">OT Assistent</option>
                            <option value="Consultent">Consultent</option>
                          </select>
                        </div>

                        {/* Doctor Name */}
                        <div className="col-6 form-group">
                          <label htmlFor="doctorname">{formData.type} Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="doctorname"
                            name="doctorname"
                            value={formData.doctorname}
                            onChange={handleChange}
                            placeholder={`Enter ${formData.type} Name`}
                          />
                        </div>

                        {/* Department */}
                        <div className="col-6 form-group">
                          <label htmlFor="doctordepartment">Department</label>
                          <select
                            className="form-control"
                            id="doctordepartment"
                            name="doctordepartment"
                            value={formData.doctordepartment}
                            onChange={handleChange}
                          >
                            <option > Select Department</option>
                            {Department.map((item) => (
                              <option key={item._id} value={item.type}>
                                {item.departmentname}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Status */}
                        <div className="col-6 form-group">
                          <label htmlFor="doctorstatus">Status</label>
                          <select
                            className="form-control"
                            id="doctorstatus"
                            name="doctorstatus"
                            value={formData.doctorstatus}
                            onChange={handleChange}
                          >
                             <option value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>

                        {/* Address */}
                        <div className="col-12 form-group">
                          <label htmlFor="doctoraddress">Address</label>
                          <textarea
                            className="form-control"
                            id="doctoraddress"
                            name="doctoraddress"
                            value={formData.doctoraddress}
                            onChange={handleChange}
                            rows="2"
                            placeholder="Enter Address"
                          ></textarea>
                        </div>

                        {/* City */}
                        <div className="col-6 form-group">
                          <label htmlFor="city">City</label>
                          <input
                            type="text"
                            className="form-control"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Enter City"
                          />
                        </div>

                        {/* Mobile Number */}
                        <div className="col-6 form-group">
                          <label htmlFor="mobilenumber">Mobile Number</label>
                          <input
                            type="text"
                            className="form-control"
                            id="mobilenumber"
                            name="mobilenumber"
                            value={formData.mobilenumber}
                            onChange={handleChange}
                            placeholder="Enter Mobile Number"
                          />
                        </div>

                        {/* DOB */}
                        <div className="col-6 form-group">
                          <label htmlFor="dob">Date of Birth (DOB)</label>
                          <input
                            type="date"
                            className="form-control"
                            id="dob"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                          />
                        </div>

                        {/* DOM */}
                        <div className="col-6 form-group">
                          <label htmlFor="dom">Date of Marriage (DOM)</label>
                          <input
                            type="date"
                            className="form-control"
                            id="dom"
                            name="dom"
                            value={formData.dom}
                            onChange={handleChange}
                          />
                        </div>

                        {/* Email */}
                        <div className="col-6 form-group">
                          <label htmlFor="email">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter Email"
                          />
                        </div>

                        {/* Account Number */}
                        <div className="col-6 form-group">
                          <label htmlFor="accountnumber">Account Number</label>
                          <input
                            type="text"
                            className="form-control"
                            id="accountnumber"
                            name="accountnumber"
                            value={formData.accountnumber}
                            onChange={handleChange}
                            placeholder="Enter Account Number"
                          />
                        </div>

                        {/* IFSC Code */}
                        <div className="col-6 form-group">
                          <label htmlFor="ifsccode">IFSC Code</label>
                          <input
                            type="text"
                            className="form-control"
                            id="ifsccode"
                            name="ifsccode"
                            value={formData.ifsccode}
                            onChange={handleChange}
                            placeholder="Enter IFSC Code"
                          />
                        </div>

                        {/* Bank Name */}
                        <div className="col-6 form-group">
                          <label htmlFor="bankname">Bank Name</label>
                          <select
                            className="form-control"
                            id="bankname"
                            name="bankname"
                            value={formData.bankname}
                            onChange={handleChange}
                          >
                            <option >Select Bank name</option>
                            {bank.map((item) => (
                              <option key={item._id} value={item.type}>
                                {item.bankname}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* A/C @ Branch */}
                        <div className="col-6 form-group">
                          <label htmlFor="acbranch">A/C @ Branch</label>
                          <input
                            type="text"
                            className="form-control"
                            id="acbranch"
                            name="acbranch"
                            value={formData.acbranch}
                            onChange={handleChange}
                            placeholder="Enter Branch"
                          />
                        </div>

                        {/* Managed By */}
                        <div className="col-6 form-group">
                          <label htmlFor="manageby">Managed By</label>
                          <input
                            type="text"
                            className="form-control"
                            id="manageby"
                            name="manageby"
                            value={formData.manageby}
                            onChange={handleChange}
                            placeholder="Enter Managed By"
                          />
                        </div>

                        {/* Background */}
                        <div className="col-6 form-group">
                          <label htmlFor="background">Background</label>
                          <input
                            type="text"
                            className="form-control"
                            id="background"
                            name="background"
                            value={formData.background}
                            onChange={handleChange}
                            placeholder="Enter Background"
                          />
                        </div>

                        {/* Incentive On Visit */}
                        <div className="col-6 form-group">
                          <label htmlFor="incentiveonvisit">Incentive On Visit</label>
                          <input
                            type="text"
                            className="form-control"
                            id="incentiveonvisit"
                            name="incentiveonvisit"
                            value={formData.incentiveonvisit}
                            onChange={handleChange}
                            placeholder="Enter Incentive On Visit"
                          />
                        </div>

                        {/* Cons. Fee */}
                        <div className="col-6 form-group">
                          <label htmlFor="consfee">Cons. Fee</label>
                          <input
                            type="text"
                            className="form-control"
                            id="consfee"
                            name="consfee"
                            value={formData.consfee}
                            onChange={handleChange}
                            placeholder="Enter Cons. Fee"
                          />
                        </div>

                        {/* 2nd Shift Fee */}
                        <div className="col-6 form-group">
                          <label htmlFor="secondshiftfee">2nd Shift Fee</label>
                          <input
                            type="text"
                            className="form-control"
                            id="secondshiftfee"
                            name="secondshiftfee"
                            value={formData.secondshiftfee}
                            onChange={handleChange}
                            placeholder="Enter 2nd Shift Fee"
                          />
                        </div>

                        {/* Emergency Fee */}
                        <div className="col-6 form-group">
                          <label htmlFor="emergencyfee">Emergency Fee</label>
                          <input
                            type="text"
                            className="form-control"
                            id="emergencyfee"
                            name="emergencyfee"
                            value={formData.emergencyfee}
                            onChange={handleChange}
                            placeholder="Enter Emergency Fee"
                          />
                        </div>

                        {/* Revisit Fee After */}
                        <div className="col-6 form-group">
                          <label htmlFor="revisitfeeafter">Revisit Fee After</label>
                          <input
                            type="text"
                            className="form-control"
                            id="revisitfeeafter"
                            name="revisitfeeafter"
                            value={formData.revisitfeeafter}
                            onChange={handleChange}
                            placeholder="Enter Revisit Fee After"
                          />
                        </div>

                        {/* Visit Schedule */}
                        <div className="col-6 form-group">
                          <label htmlFor="visitschedule">Visit Schedule</label>
                          <input
                            type="text"
                            className="form-control"
                            id="visitschedule"
                            name="visitschedule"
                            value={formData.visitschedule}
                            onChange={handleChange}
                            placeholder="Enter Visit Schedule"
                          />
                        </div>

                        {/* Time Per Patient (Minute) */}
                        <div className="col-6 form-group">
                          <label htmlFor="tpp">Time Per Patient (Minute)</label>
                          <input
                            type="text"
                            className="form-control"
                            id="tpp"
                            name="tpp"
                            value={formData.tpp}
                            onChange={handleChange}
                            placeholder="Enter Time Per Patient"
                          />
                        </div>

                        {/* Patient Per Day */}
                        <div className="col-6 form-group">
                          
                          <label htmlFor="ppd">Patient Per Day</label>
                          <input
                            type="text"
                            className="form-control"
                            id="ppd"
                            name="ppd"
                            value={formData.ppd}
                            onChange={handleChange}
                            placeholder="Enter Patient Per Day"
                          />
                        </div>

                        {/* Header (Pad) */}
                        <div className="col-6 form-group">
                          <label htmlFor="headerpad">Header (Pad)</label>
                          <textarea
                            className="form-control"
                            id="header"
                            name="header"
                            value={formData.header}
                            onChange={handleChange}
                            rows="2"
                            placeholder="Enter Header"
                          ></textarea>
                        </div>

                        {/* Footer */}
                        <div className="col-6 form-group">
                          <label htmlFor="footer">Footer</label>
                          <textarea
                            className="form-control"
                            id="footer"
                            name="footer"
                            value={formData.footer}
                            onChange={handleChange}
                            rows="2"
                            placeholder="Enter Footer"
                          ></textarea>
                        </div>

                        {/* Footer Height */}
                        <div className="col-6 form-group">
                          <label htmlFor="footerheight">Footer Height</label>
                          <input
                            type="number"
                            className="form-control"
                            id="footerheight"
                            name="footerheight"
                            value={formData.footerheight}
                            onChange={handleChange}
                            placeholder="Enter Footer Height"
                          />
                        </div>

                        {/* Profile */}
                        <div className="col-6 form-group">
                          <label htmlFor="profile">Profile</label>
                          <input
                            type="text"
                            className="form-control"
                            id="profile"
                            name="profile"
                            value={formData.profile}
                            onChange={handleChange}
                            placeholder="Enter Profile"
                          />
                        </div>
                      </div>

                      <button type="submit" className="btn btn-gradient-primary me-2">
                        {selectedDoctorId ? 'Update' : 'Submit'}
                      </button>
                      {selectedDoctorId && (
                        <button
                          type="button"
                          className="btn btn-danger me-2"
                          onClick={handleDelete}
                        >
                          Delete
                        </button>
                      )}
                      <button className="btn btn-light" type="button" onClick={() => {
                        setFormData({
                          bankname: '',
                        });
                        setSelectedDoctorId(null);
                      }}>
                        Cancel
                      </button>
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

export default Doctor;