import React, { useEffect, useState } from 'react'
import Topbar from '../component/TopNavBar'
import SideNavbar from '../component/SideNavbar'
import { Link, useNavigate } from 'react-router-dom'

const LabName = () => {

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    labname: '',
    labid:''
  });
  const [labs, setlab] = useState([]);
  const [selectedlabId, setselectedlabId] = useState(null);

  const navigate = useNavigate();

  // Fetch data from the API when the component is mounted
  useEffect(() => {
    const fetchlab = async () => {
      try {
        const response = await fetch("https://khmc-xdlm.onrender.com/api/lab");
        const data = await response.json();
        

        setlab(data); // Set the response data in the lab
        setLoading(false); // Stop the loading lab
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Stop the loading even in case of error
      }
    };

    fetchlab(); // Call the function
  }, []); // Empty dependency array to run only once

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      // Update checkbox options
      if (checked) {
        setFormData((prevData) => ({
          ...prevData,
          checkboxOptions: [...prevData.checkboxOptions, value],
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          checkboxOptions: prevData.checkboxOptions.filter((option) => option !== value),
        }));
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  // Handle form submission (add new lab or update an existing lab)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedlabId) {

      console.log("selectedlabId:", selectedlabId);

      // If a lab is selected, update the lab
      try {
        const response = await fetch(`https://khmc-xdlm.onrender.com/api/lab/${selectedlabId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const updatedlab = await response.json();
          alert('lab updated successfully!');

          // Update the lab in the lab array
          setlab((prevlab) =>
            prevlab.map((lab) =>
              lab.id === selectedlabId ? updatedlab : lab
            )
          );
          window.location.reload();

          // Reset the form and the selected lab ID
          setFormData({
            labname: '',
            labid:''
          });
          setselectedlabId(null);
        } else {
          alert('Failed to update lab');
        }
      } catch (error) {
        console.error('Error updating lab:', error);
      }
    } else {
      // If no lab is selected, add a new lab
      try {
        const response = await fetch('https://khmc-xdlm.onrender.com/api/lab', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const newlab = await response.json();
          alert('lab data submitted successfully!');
          console.log(newlab);

          // Update the lab array with the newly added lab
          setlab((prevlab) => [...prevlab, newlab]);

          // Clear the form
          setFormData({
            labname: '',
            labid: '',
          });
          window.location.reload();
        } else {
          alert('Failed to submit lab data');
        }
      } catch (error) {
        console.error('Error submitting lab data:', error);
      }
    }
  };

  // Handle deleting a lab
  const handleDelete = async () => {
    if (selectedlabId) {
      try {
        const response = await fetch(`https://khmc-xdlm.onrender.com/api/lab/${selectedlabId}`, {
          method: 'DELETE', // Use DELETE for deleting the lab
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          alert('lab deleted successfully!');

          // Remove the lab from the lab array
          setlab((prevlab) =>
            prevlab.filter((lab) => lab.id !== selectedlabId)
          );

          // Clear the form and reset selectedlabId
          setFormData({
            labname: '',
            labid: '',
          });
          setselectedlabId(null); // Reset the selected lab ID
        } else {
          alert('Failed to delete lab');
        }
      } catch (error) {
        console.error('Error deleting lab:', error);
      }
    }
  };


  // Handle click on the table row (populate form with the selected lab data)
  const handleRowClick = (lab) => {
    console.log("lab", lab);
    setFormData({
      labname: lab.labname,
      labid: lab.labid,
    });
    setselectedlabId(lab._id); // Set the selected lab ID for editing
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
                Lab Name
              </h3>
              <nav aria-label="breadcrumb">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item active" aria-current="page">
                    <span></span>Lab Name <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="row">
              <div className="col-4 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Lab List</h4>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Lab Name</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {labs.map((lab) => (
                          <tr key={lab.id} onClick={() => handleRowClick(lab)} style={{ cursor: 'pointer' }}>
                            <td>{lab.labname}</td>
                            <td>{lab.labid}</td>
                          </tr>
                        ))}
                        
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
                        <div className="col-6 mt-3">
                          <label htmlFor="labname">Lab Name</label>
                          <input
                            type="text"
                            name='labname'
                            value={formData['labname']}
                            onChange={handleChange}
                            className="form-control"
                            id="labname"
                            placeholder="Enter Lab Name" />
                        </div>
                        <div className="col-6 mt-3">
                          <label htmlFor="labid">Set Lab ID</label>
                          <input
                            type="text"
                            name='labid'
                            value={formData['labid']}
                            onChange={handleChange}
                            className="form-control"
                            id="labid"
                            placeholder="Enter lab Id" />
                        </div>

                      </div>
                      <button type="submit" className="btn btn-gradient-primary me-2">
                        {selectedlabId ? 'Update' : 'Submit'}
                      </button>
                      {selectedlabId && (
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
                          labname: '',
                        });
                        setselectedlabId(null);
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
  )
}

export default LabName