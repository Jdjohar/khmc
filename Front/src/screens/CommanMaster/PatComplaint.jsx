import React, { useState, useEffect } from 'react';
import Topbar from '../../component/TopNavBar'
import SideNavbar from '../../component/SideNavbar'
import { useParams, useNavigate } from 'react-router-dom';

const Complaints = () => {

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    complaintsname: '',
    order: '',
    group: '',
  });
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [complaints, setcomplaints] = useState([]);
  const [selectedcomplaintsId, setselectedcomplaintsId] = useState(null);


  // Fetch data from the API when the component is mounted
  useEffect(() => {
    const fetchcomplaints = async () => {
      try {
        const response = await fetch("https://khmc-xdlm.onrender.com/api/complaints");
        const data = await response.json();
        console.log(data);

        setcomplaints(data); // Set the response data in the State
        setLoading(false); // Stop the loading state
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Stop the loading even in case of error
      }
    };

    fetchcomplaints(); // Call the function
  }, []); // Empty dependency array to run only once

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission (add new complaintsor update an existing state)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedcomplaintsId) {

      console.log("selectedcomplaintsId:", selectedcomplaintsId);

      // If a complaintsis selected, update the state
      try {
        const response = await fetch(`https://khmc-xdlm.onrender.com/api/complaints/${selectedcomplaintsId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const updatedcomplaints = await response.json();
          alert('complaints updated successfully!');

          // Update the complaintsin the states array
          setcomplaints((prevStates) =>
            prevStates.map((complaints) =>
              complaints.id === selectedcomplaintsId ? updatedcomplaints : complaints
            )
          );

          // Reset the form and the selected complaintsID
          setFormData({
            complaintsname: '',
            order: '',
            usefor: '',
          });
          setselectedcomplaintsId(null);
          window.location.reload();
          alert('doen')
        } else {
          const errorData = await response.json();
          console.log(errorData);
          
        alert(`Failed to submit complaints data: ${errorData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error updating state:', error);
      }
    } else {
      // If no complaintsis selected, add a new state
      try {
        const response = await fetch('https://khmc-xdlm.onrender.com/api/complaints', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const newcomplaints = await response.json();
          alert('complaints data submitted successfully!');
          // console.log(newState);
          
          // Update the states array with the newly added state
          setcomplaints((prevStates) => [...prevStates, newState]);
       
        
          // Clear the form
          setFormData({
            complaintsname: '',
            order: '',
            usefor: '',
          });
          window.location.reload();
        } else {
          const errorData = await response.json();
          console.log(errorData,"error");
          
          alert(`Failed to update complaints 2: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        
        console.error('Error submitting complaintsdata:', error);
      }
    }
  };

  // Handle deleting a state
  const handleDelete = async () => {
    if (selectedcomplaintsId) {
      try {
        const response = await fetch(`https://khmc-xdlm.onrender.com/api/complaints/${selectedcomplaintsId}`, {
          method: 'DELETE', // Use DELETE for deleting the state
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          alert('complaintsdeleted successfully!');

          // Remove the complaintsfrom the states array
          setcomplaints((prevStates) =>
            prevStates.filter((state) => state.id !== selectedcomplaintsId)
          );
          window.location.reload();
          // Clear the form and reset selectedcomplaintsId
          setFormData({
            complaintsname: '',
            order: '',
            usefor: '',
          });
          setselectedcomplaintsId(null); // Reset the selected complaintsID
        } else {
          alert('Failed to delete state');
        }
      } catch (error) {
        console.error('Error deleting state:', error);
      }
    }
  };


  // Handle click on the table row (populate form with the selected complaintsdata)
  const handleRowClick = (complaints) => {
    console.log("complaints", complaints);
    setFormData({
      complaintsname: complaints.complaintsname,
      order: complaints.order,
      usefor: complaints.usefor,
    });
    setselectedcomplaintsId(complaints._id); // Set the selected complaintsID for editing
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
                Name complaints
              </h3>
              <nav aria-label="breadcrumb">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item active" aria-current="page">
                    <span></span>complaints <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="row">
              <div className="col-4 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">

                    <table className="table">
                      <thead>
                        <tr>
                          <th>Complaints List</th>

                        </tr>
                      </thead>
                      <tbody>
                        {complaints.map((complaints) => (
                          <tr key={complaints.id} onClick={() => handleRowClick(complaints)} style={{ cursor: 'pointer' }}>
                            <td>{complaints.complaintsname}</td>
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
                          <label htmlFor="complaintsname">Complaints Name </label>
                          <input 
                          type="text" 
                          className="form-control" 
                          id="complaintsname" 
                          name='complaintsname'
                          value={formData['complaintsname']}
                          onChange={handleChange}
                          placeholder="Enter complaints Name" />
                        </div>
                        <div className="col-6 mt-3">
                          <label htmlFor="order">Order </label>
                          <input
                            type="text"
                            name='order'
                            value={formData['order']}
                            onChange={handleChange}
                            className="form-control"
                            id="order"
                            placeholder="0" />
                        </div>
                        <div className="col-6 mt-3">
                          <label htmlFor="usefo">Use for</label>
                          <select
                            className="form-control"
                            id="usefor"
                            name='usefor'
                            value={formData['usefor']}
                            onChange={handleChange}
                          >
                            <option value="">Select Patient Type</option>
                            <option value="pathology">Pathology</option>
                            <option value="hospital">Hospital</option>
                          </select>
                        </div>

                      </div>
                      <button type="submit" className="btn btn-gradient-primary me-2">
                                                {selectedcomplaintsId ? 'Update' : 'Submit'}
                                            </button>
                                            {selectedcomplaintsId && (
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
                                                    statename: '',
                                                    statecode: '',
                                                });
                                                setselectedcomplaintsId(null);
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

export default Complaints