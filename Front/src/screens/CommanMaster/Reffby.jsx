import React, { useEffect, useState } from 'react';
import Topbar from '../../component/TopNavBar';
import SideNavbar from '../../component/SideNavbar';

const Reffby = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    type: 'Doctor',
    doctorName: '',
    department: '',
    status: '',
    address: '',
    city: '',
    mobileNumber: '',
    dob: '',
    dom: '',
    email: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    branch: '',
    managedBy: '',
    background: '',
    investigations: [
      { id: 1, investigation: '', rate: '', incentiveType: '', incentiveValue: '' }
    ]
  });
  const [rows, setRows] = useState([{ id: 1, investigation: '', rate: '', incentiveType: '', incentiveValue: '' }]);
  const [reffbyList, setreffby] = useState([]);
  const [selectedReffbyId, setSelectedReffbyId] = useState(null);
  const [bank, setBank] = useState([])
  const [Department, setDepartment] = useState([])


  const handleInvestigationChange = (id, field, value) => {
    const updatedInvestigations = formData.investigations.map((investigation) => {
      if (investigation.id === id) {
        return { ...investigation, [field]: value };
      }
      return investigation;
    });
  
    setFormData({ ...formData, investigations: updatedInvestigations });
  };

  // Fetch data from the API when the component is mounted
  useEffect(() => {

    const fetchData = async () => {
      try {
        // Run both API requests in parallel
        const [reffbyResponse, departmentResponse, bankResponse] = await Promise.all([
          fetch("https://khmc.onrender.com/api/reffby"),
          fetch("https://khmc.onrender.com/api/bank"),
          fetch("https://khmc.onrender.com/api/department")
        ]);

        // Parse the JSON responses
        const [reffbyData, departmentData, bankData] = await Promise.all([
          reffbyResponse.json(),
          bankResponse.json(),
          departmentResponse.json()
        ]);

        // Log the type of each response to verify it's an array
        console.log("reffby Data:", reffbyData);
        console.log("Department Data:", departmentData);
        console.log("Bank Data:", bankData);

        // Set the state with the fetched data
        setreffby(reffbyData);
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

    // fetchReffbyData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const formatErrorMessage = (error) => {
    // Split the error message by commas and new lines
    const errorParts = error.split(', ').map(part => part.trim());

    // Create a readable error message
    const formattedErrors = errorParts.map(part => {
      // Extract the field name and message
      const [field, message] = part.split(': ');
      return `${field.trim()}: ${message.trim()}`;
    });

    // Join formatted errors into a single string
    return formattedErrors.join('\n');
  };

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setFormData({
      ...formData,
      type: selectedType,
      doctorName: ''
    });
  };

  const handleRowChange = (id, field, value) => {
    setRows(rows.map(row => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const handleAddRow = () => {
    const newInvestigation = { id: Date.now(), investigation: '', rate: '', incentiveType: '', incentiveValue: '' };
    setFormData({
      ...formData,
      investigations: [...formData.investigations, newInvestigation]
    });
  };

  const handleDeleteRow = (id) => {
    const updatedInvestigations = formData.investigations.filter(investigation => investigation.id !== id);
    setFormData({
      ...formData,
      investigations: updatedInvestigations
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedReffbyId) {
      try {
        const response = await fetch(`https://khmc.onrender.com/api/reffby/${selectedReffbyId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...formData, rows })
        });

        if (response.ok) {
          const updatedReffby = await response.json();
          alert('Reffby updated successfully!');
          setreffby(prevList =>
            prevList.map(item =>
              item.id === selectedReffbyId ? updatedReffby : item
            )
          );
          setFormData({
            type: 'Doctor',
            doctorName: '',
            department: '',
            status: '',
            address: '',
            city: '',
            mobileNumber: '',
            dob: '',
            dom: '',
            email: '',
            accountNumber: '',
            ifscCode: '',
            bankName: '',
            branch: '',
            managedBy: '',
            background: '',
            investigations: rows 
          });
          setSelectedReffbyId(null);
        } else {
          const updatedReffby = await response.json();
          console.log("updatedReffby", updatedReffby);

          setError(updatedReffby.error)
          alert('Failed to update reffby');

        }
      } catch (error) {
        console.error('Error updating reffby:', error);
      }
    } else {

      console.log("Before formData: ",formData);
      console.log("Before row: ",rows);


      try {
        const response = await fetch('https://khmc.onrender.com/api/reffby', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...formData, rows })
        });


        console.log("After formData: ",formData);
        console.log("After row: ",rows);
        
        if (response.ok) {
          const newReffby = await response.json();
          alert('Reffby data submitted successfully!');
          setreffby(prevList => [...prevList, newReffby]);
          setFormData({
            type: 'Doctor',
            doctorName: '',
            department: '',
            status: '',
            address: '',
            city: '',
            mobileNumber: '',
            dob: '',
            dom: '',
            email: '',
            accountNumber: '',
            ifscCode: '',
            bankName: '',
            branch: '',
            managedBy: '',
            background: '',
            investigations: [
              { id: 1, investigation: '', rate: '', incentiveType: '', incentiveValue: '' }
            ]
          });
        } else {
          alert('Failed to submit reffby data');
          const updatedReffby = await response.json();
          console.log("updatedReffby", updatedReffby);
          const formattedError = formatErrorMessage(updatedReffby.error);
          setError(formattedError);
        }
      } catch (error) {
        console.error('Error submitting reffby data:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (selectedReffbyId) {
      try {
        const response = await fetch(`https://khmc.onrender.com/api/reffby/${selectedReffbyId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          alert('Reffby deleted successfully!');
          setreffby(prevList =>
            prevList.filter(item => item.id !== selectedReffbyId)
          );
          setFormData({
            type: 'Doctor',
            doctorName: '',
            department: '',
            status: '',
            address: '',
            city: '',
            mobileNumber: '',
            dob: '',
            dom: '',
            email: '',
            accountNumber: '',
            ifscCode: '',
            bankName: '',
            branch: '',
            managedBy: '',
            background: '',
            investigations: [
              { id: 1, investigation: '', rate: '', incentiveType: '', incentiveValue: '' }
            ]
          });
          setSelectedReffbyId(null);
        } else {
          alert('Failed to delete reffby');
        }
      } catch (error) {
        console.error('Error deleting reffby:', error);
      }
    }
  };

  const handleRowClick = (reffby) => {
    console.log("reffby", reffby);
    
    setFormData({
      type: reffby.type,
      doctorName: reffby.doctorName,
      department: reffby.department,
      status: reffby.status,
      address: reffby.address,
      city: reffby.city,
      mobileNumber: reffby.mobileNumber,
      dob: reffby.dob,
      dom: reffby.dom,
      email: reffby.email,
      accountNumber: reffby.accountNumber,
      ifscCode: reffby.ifscCode,
      bankName: reffby.bankName,
      branch: reffby.branch,
      managedBy: reffby.managedBy,
      background: reffby.background,
      investigations: reffby.investigations
      
    });
    setRows(reffby.rows || []);
    setSelectedReffbyId(reffby._id);
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
                Reffby
              </h3>
              <nav aria-label="breadcrumb">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item active" aria-current="page">
                    <span></span>Reffby <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
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
                          <th>Department</th>
                        </tr>
                      </thead>
                      <tbody>
                        
                        
                        {reffbyList.map((doctor) => (
                          <tr key={doctor._id} onClick={() => handleRowClick(doctor)} style={{ cursor: 'pointer' }}>
                            <td>{doctor.doctorName}</td>
                            <td>{doctor.department}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Reffby Form */}
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
                            onChange={handleTypeChange}
                          >
                            <option value="Doctor">Doctor</option>
                            <option value="Ref / Agent">Ref / Agent</option>
                            <option value="Pathologist">Pathologist</option>
                            <option value="Anesthist">Anesthist</option>
                            <option value="OT Manager">OT Manager</option>
                            <option value="OT Assistent">OT Assistent</option>
                            <option value="Consultent">Consultent</option>
                          </select>
                        </div>

                        {/* Doctor Name (dynamic label based on type) */}
                        <div className="col-6 form-group">
                          <label htmlFor="doctorName">{formData.type} Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="doctorName"
                            name="doctorName"
                            value={formData.doctorName}
                            onChange={handleChange}
                            placeholder={`Enter ${formData.type} Name`}
                          />
                        </div>

                        {/* Department */}
                        <div className="col-6 form-group">
                          <label htmlFor="department">Department</label>
                          <select
                            className="form-control"
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                          >
                            <option value="">Select Department</option>
                            {Department.map((item) => (
                              <option key={item._id} value={item.type}>
                                {item.departmentname}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Status */}
                        <div className="col-6 form-group">
                          <label htmlFor="status">Status</label>
                          <select
                            className="form-control"
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                          >
                            <option value="">Select Status</option>

                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>

                        {/* Address */}
                        <div className="col-12 form-group">
                          <label htmlFor="address">Address</label>
                          <textarea
                            className="form-control"
                            id="address"
                            name="address"
                            rows="2"
                            value={formData.address}
                            onChange={handleChange}
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
                          <label htmlFor="mobileNumber">Mobile Number</label>
                          <input
                            type="text"
                            className="form-control"
                            id="mobileNumber"
                            name="mobileNumber"
                            value={formData.mobileNumber}
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
                          <label htmlFor="accountNumber">Account Number</label>
                          <input
                            type="text"
                            className="form-control"
                            id="accountNumber"
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleChange}
                            placeholder="Enter Account Number"
                          />
                        </div>

                        {/* IFSC Code */}
                        <div className="col-6 form-group">
                          <label htmlFor="ifscCode">IFSC Code</label>
                          <input
                            type="text"
                            className="form-control"
                            id="ifscCode"
                            name="ifscCode"
                            value={formData.ifscCode}
                            onChange={handleChange}
                            placeholder="Enter IFSC Code"
                          />
                        </div>

                        {/* Bank Name */}
                        <div className="col-6 form-group">
                          <label htmlFor="bankName">Bank Name</label>
                          <select
                            className="form-control"
                            id="bankName"
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleChange}
                          >
                            <option value="">Select Bank</option>
                            {bank.map((item) => (
                              <option key={item._id} value={item.type}>
                                {item.bankname}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* A/C @ Branch */}
                        <div className="col-6 form-group">
                          <label htmlFor="branch">A/C @ Branch</label>
                          <input
                            type="text"
                            className="form-control"
                            id="branch"
                            name="branch"
                            value={formData.branch}
                            onChange={handleChange}
                            placeholder="Enter Branch"
                          />
                        </div>

                        {/* Managed By */}
                        <div className="col-6 form-group">
                          <label htmlFor="managedBy">Managed By</label>
                          <input
                            type="text"
                            className="form-control"
                            id="managedBy"
                            name="managedBy"
                            value={formData.managedBy}
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

                        

                        

                        {console.log("s", formData.investigations)}


                        {/* Investigation and Rate for each row */}
                        {formData.investigations.map((investigation) => (
  <div key={investigation._id} className="row mb-3">
    <div className="col-6 form-group">
      <label htmlFor={`investigation-${investigation.id}`}>Investigation</label>
      <select
        className="form-control"
        id={`investigation-${investigation.id}`}
        value={investigation.investigation}
        onChange={(e) => handleInvestigationChange(investigation.id, 'investigation', e.target.value)}
      >
        <option value="">Select Investigation</option>
        <option value="Investigation1">Investigation 1</option>
        <option value="Investigation2">Investigation 2</option>
      </select>
    </div>

    <div className="col-6 form-group">
      <label htmlFor={`rate-${investigation.id}`}>Rate</label>
      <input
        type="text"
        className="form-control"
        id={`rate-${investigation.id}`}
        value={investigation.rate}
        onChange={(e) => handleInvestigationChange(investigation.id, 'rate', e.target.value)}
        placeholder="Enter Rate"
      />
    </div>

    <div className="col-6 form-group">
      <label htmlFor={`incentiveType-${investigation.id}`}>Incentive Type</label>
      <select
        className="form-control"
        id={`incentiveType-${investigation.id}`}
        value={investigation.incentiveType}
        onChange={(e) => handleInvestigationChange(investigation.id, 'incentiveType', e.target.value)}
      >
        <option value="">Select Incentive Type</option>
        <option value="fixed">Fixed Price</option>
        <option value="percentage">Percentage</option>
      </select>
    </div>

    <div className="col-6 form-group">
      <label htmlFor={`incentiveValue-${investigation.id}`}>Incentive Value</label>
      <input
        type="text"
        className="form-control"
        id={`incentiveValue-${investigation.id}`}
        value={investigation.incentiveValue}
        onChange={(e) => handleInvestigationChange(investigation.id, 'incentiveValue', e.target.value)}
        placeholder="Enter Incentive Value"
      />
    </div>

    <div className="col-6 form-group">
      <button type="button" className="btn btn-danger" onClick={() => handleDeleteRow(investigation.id)}>
        Delete
      </button>
    </div>
  </div>
))}

                        <div className="col-12 form-group">
                          <button type="button" className="btn btn-primary" onClick={handleAddRow}>
                            Add Row
                          </button>
                        </div>
                      </div>

                      {console.log("Rows",rows)}

                      {error && (
                        <div style={{ color: 'red' }}>
                          <h4>Validation Errors:</h4>
                          <pre>{error}</pre> {/* Use <pre> to preserve formatting */}
                        </div>
                      )}
                      
                      <button type="submit" className="btn btn-gradient-primary me-2">
                        {selectedReffbyId ? 'Update' : 'Submit'}
                      </button>
                      {selectedReffbyId && (
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
                        setSelectedReffbyId(null);
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
export default Reffby;
