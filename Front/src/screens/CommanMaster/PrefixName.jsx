import React, { useState, useEffect } from 'react';
import Topbar from '../../component/TopNavBar'
import SideNavbar from '../../component/SideNavbar'

const PrefixName = () => {

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    prefixname: '',
    order: '',
    usefor: '',
  });
  const [prefix, setprefix] = useState([]);
  const [selectedprefixId, setselectedprefixId] = useState(null);


  // Fetch data from the API when the component is mounted
  useEffect(() => {
    const fetchprefix = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/prefix");
        const data = await response.json();
        console.log(data);

        setprefix(data); // Set the response data in the State
        setLoading(false); // Stop the loading state
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Stop the loading even in case of error
      }
    };

    fetchprefix(); // Call the function
  }, []); // Empty dependency array to run only once

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission (add new Prefixor update an existing state)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedprefixId) {

      console.log("selectedprefixId:", selectedprefixId);

      // If a Prefixis selected, update the state
      try {
        const response = await fetch(`http://localhost:3001/api/prefix/${selectedprefixId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const updatedPrefix = await response.json();
          alert('Prefix updated successfully!');

          // Update the Prefixin the states array
          setprefix((prevStates) =>
            prevStates.map((prefix) =>
              prefix.id === selectedprefixId ? updatedPrefix : prefix
            )
          );

          // Reset the form and the selected PrefixID
          setFormData({
            prefixname: '',
            order: '',
            usefor: '',
          });
          setselectedprefixId(null);
        } else {
          alert('Failed to update state');
        }
      } catch (error) {
        console.error('Error updating state:', error);
      }
    } else {
      // If no Prefixis selected, add a new state
      try {
        const response = await fetch('http://localhost:3001/api/prefix', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const newPrefix = await response.json();
          alert('Prefixdata submitted successfully!');
          console.log(newState);

          // Update the states array with the newly added state
          setprefix((prevStates) => [...prevStates, newState]);

          // Clear the form
          setFormData({
            prefixname: '',
            order: '',
            usefor: '',
          });
        } else {
          alert('Failed to submit Prefixdata');
        }
      } catch (error) {
        console.error('Error submitting Prefixdata:', error);
      }
    }
  };

  // Handle deleting a state
  const handleDelete = async () => {
    if (selectedprefixId) {
      try {
        const response = await fetch(`http://localhost:3001/api/prefix/${selectedprefixId}`, {
          method: 'DELETE', // Use DELETE for deleting the state
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          alert('Prefixdeleted successfully!');

          // Remove the Prefixfrom the states array
          setprefix((prevStates) =>
            prevStates.filter((state) => state.id !== selectedprefixId)
          );

          // Clear the form and reset selectedprefixId
          setFormData({
            prefixname: '',
            order: '',
            usefor: '',
          });
          setselectedprefixId(null); // Reset the selected PrefixID
        } else {
          alert('Failed to delete state');
        }
      } catch (error) {
        console.error('Error deleting state:', error);
      }
    }
  };


  // Handle click on the table row (populate form with the selected Prefixdata)
  const handleRowClick = (prefix) => {
    console.log("prefix", prefix);
    setFormData({
      prefixname: prefix.prefixname,
      order: prefix.order,
      usefor: prefix.usefor,
    });
    setselectedprefixId(prefix._id); // Set the selected PrefixID for editing
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
                Name Prefix
              </h3>
              <nav aria-label="breadcrumb">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item active" aria-current="page">
                    <span></span>Prefix <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="row">
              <div className="col-4 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">

                    <table class="table">
                      <thead>
                        <tr>
                          <th>PrefixName</th>

                        </tr>
                      </thead>
                      <tbody>
                        {prefix.map((prefix) => (
                          <tr key={prefix.id} onClick={() => handleRowClick(prefix)} style={{ cursor: 'pointer' }}>
                            <td>{prefix.prefixname}</td>
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
                          <label htmlFor="prefixname">Prefix Name </label>
                          <input 
                          type="text" 
                          className="form-control" 
                          id="prefixname" 
                          name='prefixname'
                          value={formData['prefixname']}
                          onChange={handleChange}
                          placeholder="Enter Prefix Name" />
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
                                                {selectedprefixId ? 'Update' : 'Submit'}
                                            </button>
                                            {selectedprefixId && (
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
                                                setselectedprefixId(null);
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

export default PrefixName