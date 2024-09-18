import React, { useState, useEffect } from 'react';
import Topbar from '../../component/TopNavBar'
import SideNavbar from '../../component/SideNavbar'
const Religions = () => {

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    statename: '',
    statecode: '',
  });
  const [religion, setreligion] = useState([]);
  const [SelectedreligionId, setSelectedreligionId] = useState(null);

  // Fetch data from the API when the component is mounted
  useEffect(() => {
    const fetchReligion = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/religion");
        const data = await response.json();
        console.log(data);

        setreligion(data); // Set the response data in the State
        setLoading(false); // Stop the loading state
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Stop the loading even in case of error
      }
    };

    fetchReligion(); // Call the function
  }, []); // Empty dependency array to run only once

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // Handle deleting a state
  const handleDelete = async () => {
    if (SelectedreligionId) {
      try {
        const response = await fetch(`http://localhost:3001/api/religion/${SelectedreligionId}`, {
          method: 'DELETE', // Use DELETE for deleting the state
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          alert('religion deleted successfully!');

          // Remove the state from the states array
          setreligion((prevStates) =>
            prevStates.filter((religion) => religion.id !== SelectedreligionId)
          );

          // Clear the form and reset SelectedreligionId
          setFormData({
            religionname: '',

          });
          setSelectedreligionId(null); // Reset the selected state ID
        } else {
          alert('Failed to delete state');
        }
      } catch (error) {
        console.error('Error deleting state:', error);
      }
    }
  };


  // Handle click on the table row (populate form with the selected state data)
  const handleRowClick = (religion) => {
    console.log("religion", religion);
    setFormData({
      religionname: religion.religionname,
    });
    setSelectedreligionId(religion._id); // Set the selected state ID for editing
  };

  // Handle form submission (add new state or update an existing state)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (SelectedreligionId) {

      console.log("SelectedreligionId:", SelectedreligionId);

      // If a state is selected, update the state
      try {
        const response = await fetch(`http://localhost:3001/api/religion/${SelectedreligionId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const updatedState = await response.json();
          alert('religion updated successfully!');

          // Update the state in the states array
          setreligion((prevreligion) =>
            prevreligion.map((religion) =>
              religion.id === SelectedreligionId ? updatedState : religion
            )
          );

          // Reset the form and the selected state ID
          setFormData({
            religionname: '',
          });
          setSelectedreligionId(null);
        } else {
          alert('Failed to update state');
        }
      } catch (error) {
        console.error('Error updating state:', error);
      }
    } else {
      // If no state is selected, add a new state
      try {
        const response = await fetch('http://localhost:3001/api/religion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const newState = await response.json();
          alert('State data submitted successfully!');
          console.log(newState);

          // Update the states array with the newly added state
          setreligion((prevStates) => [...prevStates, newState]);

          // Clear the form
          setFormData({
            religionname: '',
          });
        } else {
          alert('Failed to submit State data');
        }
      } catch (error) {
        console.error('Error submitting State data:', error);
      }
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
                Religions
              </h3>
              <nav aria-label="breadcrumb">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item active" aria-current="page">
                    <span></span>Religions <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="row">
              <div className="col-4 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 class="card-title">Religion List</h4>
                    <table class="table">
                      <thead>
                        <tr>
                          <th>Religion Name</th>

                        </tr>
                      </thead>
                      <tbody>
                        {religion.map((religion) => (
                          <tr key={religion._id} onClick={() => handleRowClick(religion)} style={{ cursor: 'pointer' }}>
                            <td>{religion.religionname}</td>

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
                          <label htmlFor="religionname">Religion Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="religionname"
                            name='religionname'
                            value={formData['religionname']}
                            onChange={handleChange}
                            placeholder="Enter Religion Name"

                          />
                        </div>

                      </div>
                      <button type="submit" className="btn btn-gradient-primary me-2">
                        {SelectedreligionId ? 'Update' : 'Submit'}
                      </button>
                      {SelectedreligionId && (
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
                        setSelectedreligionId(null);
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

export default Religions