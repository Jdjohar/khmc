import React, { useState, useEffect } from 'react';
import Topbar from '../../component/TopNavBar';
import SideNavbar from '../../component/SideNavbar';

const State = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        statename: '',
        statecode: '',
    });
    const [states, setStates] = useState([]);
    const [selectedStateId, setSelectedStateId] = useState(null); // New state to track the selected state

    // Fetch data from the API when the component is mounted
    useEffect(() => {
        const fetchState = async () => {
            try {
                const response = await fetch("http://localhost:3001/api/state");
                const data = await response.json();
                console.log(data);

                setStates(data); // Set the response data in the State
                setLoading(false); // Stop the loading state
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false); // Stop the loading even in case of error
            }
        };

        fetchState(); // Call the function
    }, []); // Empty dependency array to run only once

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission (add new state or update an existing state)
    const handleSubmit = async (e) => {
        // e.preventDefault();

        if (selectedStateId) {

          console.log("selectedStateId:",selectedStateId);
          
            // If a state is selected, update the state
            try {
                const response = await fetch(`http://localhost:3001/api/state/${selectedStateId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    const updatedState = await response.json();
                    alert('State updated successfully!');

                    // Update the state in the states array
                    setStates((prevStates) =>
                        prevStates.map((state) =>
                            state.id === selectedStateId ? updatedState : state
                        )
                    );

                    // Reset the form and the selected state ID
                    setFormData({
                        statename: '',
                        statecode: '',
                    });
                    setSelectedStateId(null);
                } else {
                    alert('Failed to update state');
                }
            } catch (error) {
                console.error('Error updating state:', error);
            }
        } else {
            // If no state is selected, add a new state
            try {
                const response = await fetch('http://localhost:3001/api/state', {
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
                    setStates((prevStates) => [...prevStates, newState]);

                    // Clear the form
                    setFormData({
                        statename: '',
                        statecode: '',
                    });
                } else {
                    alert('Failed to submit State data');
                }
            } catch (error) {
                console.error('Error submitting State data:', error);
            }
        }
    };

     // Handle deleting a state
     const handleDelete = async () => {
      if (selectedStateId) {
          try {
              const response = await fetch(`http://localhost:3001/api/state/${selectedStateId}`, {
                  method: 'DELETE', // Use DELETE for deleting the state
                  headers: {
                      'Content-Type': 'application/json'
                  }
              });

              if (response.ok) {
                  alert('State deleted successfully!');

                  // Remove the state from the states array
                  setStates((prevStates) =>
                      prevStates.filter((state) => state.id !== selectedStateId)
                  );

                  // Clear the form and reset selectedStateId
                  setFormData({
                      statename: '',
                      statecode: '',
                  });
                  setSelectedStateId(null); // Reset the selected state ID
              } else {
                  alert('Failed to delete state');
              }
          } catch (error) {
              console.error('Error deleting state:', error);
          }
      }
  };


    // Handle click on the table row (populate form with the selected state data)
    const handleRowClick = (state) => {
      console.log("State",  state);
        setFormData({
            statename: state.statename,
            statecode: state.statecode,
        });
        setSelectedStateId(state._id); // Set the selected state ID for editing
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
                                State
                            </h3>
                            <nav aria-label="breadcrumb">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item active" aria-current="page">
                                        <span></span>State <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
                                    </li>
                                </ul>
                            </nav>
                        </div>

                        <div className="row">
                            <div className="col-4 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">Basic Table</h4>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>State Name</th>
                                                    <th>State Code</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {states.map((state) => (
                                                    <tr key={state.id} onClick={() => handleRowClick(state)} style={{ cursor: 'pointer' }}>
                                                        <td>{state.statename}</td>
                                                        <td>{state.statecode}</td>
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
                                                    <label htmlFor="statename">State Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="statename"
                                                        value={formData['statename']}
                                                        onChange={handleChange}
                                                        id="statename"
                                                        placeholder="Enter State Name"
                                                    />
                                                </div>
                                                <div className="col-6 mt-3">
                                                    <label htmlFor="statecode">State Code</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="statecode"
                                                        name='statecode'
                                                        value={formData['statecode']}
                                                        onChange={handleChange}
                                                        placeholder="Enter State Code"
                                                    />
                                                </div>
                                            </div>
                                            <button type="submit" className="btn btn-gradient-primary me-2">
                                                {selectedStateId ? 'Update' : 'Submit'}
                                            </button>
                                            {selectedStateId && (
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
                                                setSelectedStateId(null);
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

export default State;
