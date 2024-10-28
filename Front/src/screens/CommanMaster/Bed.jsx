import React, { useState, useEffect } from 'react';
import Topbar from '../component/TopNavBar';
import SideNavbar from '../component/SideNavbar';
import { useNavigate } from 'react-router-dom';

const Bed = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    ward: '',
    department: '',
    bedname: '',
    rate: '',
    gst: '',
    hsncode: '',
    slotStart: '',
    slotCount: '',
    options: {
      inclusiveTax: false,
      otRoom: false,
      default: false,
      alwaysAvailable: false
    }
  });
  const [beds, setBeds] = useState([]);
  const [wards, setWards] = useState([]);
  const [department, setDepartment] = useState([]);
  const [selectedBedId, setSelectedBedId] = useState(null);

  // Fetch data from the API when the component is mounted
  useEffect(() => {

    const fetchData = async () => {
      try {
        // Run all API requests in parallel
        const [bedResponse, wardResponse, departmentResponse] = await Promise.all([
          fetch("https://khmc-xdlm.onrender.com/api/beds"),
          fetch("https://khmc-xdlm.onrender.com/api/wards"),
          fetch("https://khmc-xdlm.onrender.com/api/department"),
        ]);

        // Parse the JSON responses
        const [bedData, wardData, departmentData] = await Promise.all([
          bedResponse.json(),
          wardResponse.json(),
          departmentResponse.json(),
        ]);

        // Log the type of each response to verify it's an array
        console.log("Bed Data:", bedData);
        console.log("Ward Data:", wardData);
        console.log("Department Data:", departmentData);

        // Set the state with the fetched data
        setBeds(bedData);
        setWards(wardData);
        setDepartment(departmentData); // If setDepartment is for departments, keep this line

        // Stop the loading state when all data is fetched
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Stop the loading even in case of error
      }
    };

    fetchData(); // Call the function
  }, []); // Empty dependency array to run only once

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkbox state
    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        options: {
          ...prevData.options,
          [name]: checked,
        }
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle form submission (add new bed or update an existing bed)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedBedId) {
      // If a bed is selected, update the bed
      try {
        const response = await fetch(`https://khmc-xdlm.onrender.com/api/beds/${selectedBedId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const updatedBed = await response.json();
          alert('Bed updated successfully!');

          // Update the bed in the beds array
          setBeds((prevBeds) =>
            prevBeds.map((bed) =>
              bed._id === selectedBedId ? updatedBed : bed
            )
          );

          // Reset the form and the selected bed ID
          setFormData({
            ward: '',
            department: '',
            bedname: '',
            rate: '',
            gst: '',
            hsncode: '',
            slotStart: '',
            slotCount: '',
            options: {
              inclusiveTax: false,
              otRoom: false,
              default: false,
              alwaysAvailable: false
            }
          });
          setSelectedBedId(null);
        } else {
          alert('Failed to update bed');
        }
      } catch (error) {
        console.error('Error updating bed:', error);
      }
    } else {
      // If no bed is selected, add a new bed
      try {
        const response = await fetch('https://khmc-xdlm.onrender.com/api/beds', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const newBed = await response.json();
          alert('Bed data submitted successfully!');
          setBeds((prevBeds) => [...prevBeds, newBed]);

          // Clear the form
          setFormData({
            ward: '',
            department: '',
            bedname: '',
            rate: '',
            gst: '',
            hsncode: '',
            slotStart: '',
            slotCount: '',
            options: {
              inclusiveTax: false,
              otRoom: false,
              default: false,
              alwaysAvailable: false
            }
          });
        } else {
          alert('Failed to submit bed data');
        }
      } catch (error) {
        console.error('Error submitting bed data:', error);
      }
    }
  };

  // Handle deleting a bed
  const handleDelete = async () => {
    if (selectedBedId) {
      try {
        const response = await fetch(`https://khmc-xdlm.onrender.com/api/beds/${selectedBedId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          alert('Bed deleted successfully!');

          // Remove the bed from the beds array
          setBeds((prevBeds) =>
            prevBeds.filter((bed) => bed._id !== selectedBedId)
          );

          // Clear the form and reset selectedBedId
          setFormData({
            ward: '',
            department: '',
            bedname: '',
            rate: '',
            gst: '',
            hsncode: '',
            slotStart: '',
            slotCount: '',
            options: {
              inclusiveTax: false,
              otRoom: false,
              default: false,
              alwaysAvailable: false
            }
          });
          setSelectedBedId(null);
        } else {
          alert('Failed to delete bed');
        }
      } catch (error) {
        console.error('Error deleting bed:', error);
      }
    }
  };

  // Handle click on the table row (populate form with the selected bed data)
  const handleRowClick = (bed) => {
    setFormData({
      ward: bed.ward,
      department: bed.department,
      bedname: bed.bedname,
      rate: bed.rate,
      gst: bed.gst,
      hsncode: bed.hsncode,
      slotStart: bed.slotStart,
      slotCount: bed.slotCount,
      options: bed.options
    });
    setSelectedBedId(bed._id); // Set the selected bed ID for editing
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
                Bed
              </h3>
              <nav aria-label="breadcrumb">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item active" aria-current="page">
                    <span></span>Bed <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="row">
              <div className="col-4 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Bed List</h4>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Ward</th>
                          <th>Bed Name</th>
                          <th>Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(beds) && beds.map((bed) => {
                          // Find the corresponding ward object using the ward ID
                          const matchingWard = wards.find(ward => ward._id === bed.ward);
                          return (
                            <tr key={bed._id} onClick={() => handleRowClick(bed)} style={{ cursor: 'pointer' }}>
                              {/* Display the ward name instead of the ward ID */}
                              <td>{matchingWard ? matchingWard.wardname : 'Unknown Ward'}</td>
                              <td>{bed.bedname}</td>
                              <td>{bed.rate}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-8 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <form className="forms-sample" onSubmit={handleSubmit}>
                      <div className="form-group row">
                        <div className="col-3 mt-3">
                          <label htmlFor="ward">Select Ward *</label>
                          <select className="form-control" name="ward" value={formData.ward} onChange={handleChange} required>
                            {/* Replace with actual wards fetched from API if needed */}
                            <option value="">Select Ward</option>
                            {wards.map((item) => (
                              <option key={item._id} value={item._id}>
                                {item.wardname}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-3 mt-3">
                          <label htmlFor="department">Department</label>
                          <select className="form-control"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required>
                            {/* Replace with actual wards fetched from API if needed */}
                            <option value="">Select Department</option>
                            {department.map((item) => (
                              <option key={item._id} value={item.departmentname}>
                                {item.departmentname}
                              </option>
                            ))}
                          </select>

                        </div>
                        <div className="col-3 mt-3">
                          <label htmlFor="bedname">Bed Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="bedname"
                            value={formData.bedname}
                            required
                            onChange={handleChange}
                            id="bedname"
                            placeholder="Enter Bed Name"
                          />
                        </div>
                        <div className="col-3 mt-3">
                          <label htmlFor="rate">Rate</label>
                          <input
                            type="text"
                            className="form-control"
                            name="rate"
                            value={formData.rate}
                            onChange={handleChange}
                            id="rate"
                            placeholder="Enter Rate"
                          />
                        </div>
                        <div className="col-3 mt-3">
                          <label htmlFor="gst">GST</label>
                          <input
                            type="number"
                            className="form-control"
                            name="gst"
                            value={formData.gst}
                            onChange={handleChange}
                            id="gst"
                            placeholder="Enter GST"
                          />
                        </div>
                        <div className="col-3 mt-3">
                          <label htmlFor="hsncode">HSN Code</label>
                          <input
                            type="text"
                            className="form-control"
                            name="hsncode"
                            value={formData.hsncode}
                            onChange={handleChange}
                            id="hsncode"
                            placeholder="Enter HSN Code"
                          />
                        </div>
                        <div className="col-3 mt-3">
                          <label htmlFor="slotStart">Slot Start</label>
                          <input
                            type="text"
                            className="form-control"
                            name="slotStart"
                            value={formData.slotStart}
                            onChange={handleChange}
                            id="slotStart"
                            placeholder="Enter Slot Start"
                          />
                        </div>
                        <div className="col-3 mt-3">
                          <label htmlFor="slotCount">Slot Count</label>
                          <input
                            type="text"
                            className="form-control"
                            name="slotCount"
                            value={formData.slotCount}
                            onChange={handleChange}
                            id="slotCount"
                            placeholder="Enter Slot Count"
                          />
                        </div>
                        <div className="col-12 mt-3">
                          <label>Options</label>
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              name="inclusiveTax"
                              checked={formData.options.inclusiveTax}
                              onChange={handleChange}
                            />
                            <label className="form-check-label">Inclusive Tax</label>
                          </div>
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              name="otRoom"
                              checked={formData.options.otRoom}
                              onChange={handleChange}
                            />
                            <label className="form-check-label">OT Room</label>
                          </div>
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              name="default"
                              checked={formData.options.default}
                              onChange={handleChange}
                            />
                            <label className="form-check-label">Default</label>
                          </div>
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              name="alwaysAvailable"
                              checked={formData.options.alwaysAvailable}
                              onChange={handleChange}
                            />
                            <label className="form-check-label">Always Available</label>
                          </div>
                        </div>
                      </div>
                      <button type="submit" className="btn btn-gradient-primary me-2">
                        {selectedBedId ? 'Update' : 'Submit'}
                      </button>
                      {selectedBedId && (
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
                          ward: '',
                          department: '',
                          bedname: '',
                          rate: '',
                          gst: '',
                          hsncode: '',
                          slotStart: '',
                          slotCount: '',
                          options: {
                            inclusiveTax: false,
                            otRoom: false,
                            default: false,
                            alwaysAvailable: false
                          }
                        });
                        setSelectedBedId(null);
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

export default Bed;
