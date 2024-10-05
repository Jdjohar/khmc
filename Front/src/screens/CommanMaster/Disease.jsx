import React, { useState, useEffect } from 'react';
import Topbar from '../../component/TopNavBar'
import SideNavbar from '../../component/SideNavbar'
import { useParams, useNavigate } from 'react-router-dom';

const DiseaseName = () => {

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    diseasename: '',
    order: '',
    detail: '',
  });
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [disease, setdisease] = useState([]);
  const [selecteddiseaseId, setselecteddiseaseId] = useState(null);


  // Fetch data from the API when the component is mounted
  useEffect(() => {
    const fetchdisease = async () => {
      try {
        const response = await fetch("https://khmc-xdlm.onrender.com/api/disease");
        const data = await response.json();
        console.log(data);

        setdisease(data); // Set the response data in the State
        setLoading(false); // Stop the loading state
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Stop the loading even in case of error
      }
    };

    fetchdisease(); // Call the function
  }, []); // Empty dependency array to run only once

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission (add new diseaseor update an existing state)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selecteddiseaseId) {

      console.log("selecteddiseaseId:", selecteddiseaseId);

      // If a diseaseis selected, update the state
      try {
        const response = await fetch(`https://khmc-xdlm.onrender.com/api/disease/${selecteddiseaseId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const updateddisease = await response.json();
          alert('disease updated successfully!');

          // Update the diseasein the states array
          setdisease((prevStates) =>
            prevStates.map((disease) =>
              disease.id === selecteddiseaseId ? updateddisease : disease
            )
          );

          // Reset the form and the selected diseaseID
          setFormData({
            diseasename: '',
            order: '',
            detail: '',
          });
          setselecteddiseaseId(null);
          window.location.reload();
          alert('doen')
        } else {
          const errorData = await response.json();
          console.log(errorData);
          
        alert(`Failed to submit disease data: ${errorData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error updating state:', error);
      }
    } else {
      // If no diseaseis selected, add a new state
      try {
        const response = await fetch('https://khmc-xdlm.onrender.com/api/disease', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const newdisease = await response.json();
          alert('disease data submitted successfully!');
          // console.log(newState);
          
          // Update the states array with the newly added state
          setdisease((prevStates) => [...prevStates, newState]);
       
        
          // Clear the form
          setFormData({
            diseasename: '',
            order: '',
            detail: '',
          });
          window.location.reload();
        } else {
          const errorData = await response.json();
          console.log(errorData,"error");
          
          alert(`Failed to update disease 2: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        
        console.error('Error submitting diseasedata:', error);
      }
    }
  };

  // Handle deleting a state
  const handleDelete = async () => {
    if (selecteddiseaseId) {
      try {
        const response = await fetch(`https://khmc-xdlm.onrender.com/api/disease/${selecteddiseaseId}`, {
          method: 'DELETE', // Use DELETE for deleting the state
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          alert('diseasedeleted successfully!');

          // Remove the diseasefrom the states array
          setdisease((prevStates) =>
            prevStates.filter((state) => state.id !== selecteddiseaseId)
          );
          window.location.reload();
          // Clear the form and reset selecteddiseaseId
          setFormData({
            diseasename: '',
            order: '',
            detail: '',
          });
          setselecteddiseaseId(null); // Reset the selected diseaseID
        } else {
          alert('Failed to delete state');
        }
      } catch (error) {
        console.error('Error deleting state:', error);
      }
    }
  };


  // Handle click on the table row (populate form with the selected diseasedata)
  const handleRowClick = (disease) => {
    console.log("disease", disease);
    setFormData({
      diseasename: disease.diseasename,
      order: disease.order,
      detail: disease.detail,
    });
    setselecteddiseaseId(disease._id); // Set the selected diseaseID for editing
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
                Name Disease
              </h3>
              <nav aria-label="breadcrumb">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item active" aria-current="page">
                    <span></span>disease <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
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
                          <th>Disease List</th>

                        </tr>
                      </thead>
                      <tbody>
                        {disease.map((disease) => (
                          <tr key={disease.id} onClick={() => handleRowClick(disease)} style={{ cursor: 'pointer' }}>
                            <td>{disease.diseasename}</td>
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
                          <label htmlFor="diseasename">Disease Name </label>
                          <input 
                          type="text" 
                          className="form-control" 
                          id="diseasename" 
                          name='diseasename'
                          value={formData['diseasename']}
                          onChange={handleChange}
                          placeholder="Enter disease Name" />
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
                        <label htmlFor="order">Order </label>
                          <input
                            type="text"
                            name='detail'
                            value={formData['detail']}
                            onChange={handleChange}
                            className="form-control"
                            id="detail"
                            placeholder="detail" />
                        </div>

                      </div>
                      <button type="submit" className="btn btn-gradient-primary me-2">
                                                {selecteddiseaseId ? 'Update' : 'Submit'}
                                            </button>
                                            {selecteddiseaseId && (
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
                                                setselecteddiseaseId(null);
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

export default DiseaseName