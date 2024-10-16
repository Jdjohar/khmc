import React, { useEffect, useState } from 'react'
import Topbar from '../component/TopNavBar'
import SideNavbar from '../component/SideNavbar'

const DoseComment = () => {

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    dosecomment: ''
  });
  const [dosecomments, setdosecomment] = useState([]);
  const [selecteddosecommentId, setselecteddosecommentId] = useState(null);

  // Fetch data from the API when the component is mounted
  useEffect(() => {
    const fetchdosecomment = async () => {
      try {
        const response = await fetch("https://khmc-xdlm.onrender.com/api/dosecomment");
        const data = await response.json();
        

        setdosecomment(data); // Set the response data in the dosecomment
        setLoading(false); // Stop the loading dosecomment
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Stop the loading even in case of error
      }
    };

    fetchdosecomment(); // Call the function
  }, []); // Empty dependency array to run only once

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  // Handle form submission (add new dosecomment or update an existing dosecomment)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selecteddosecommentId) {

      console.log("selecteddosecommentId:", selecteddosecommentId);

      // If a dosecomment is selected, update the dosecomment
      try {
        const response = await fetch(`https://khmc-xdlm.onrender.com/api/dosecomment/${selecteddosecommentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const updateddosecomment = await response.json();
          alert('dosecomment updated successfully!');

          // Update the dosecomment in the dosecomment array
          setdosecomment((prevdosecomment) =>
            prevdosecomment.map((dosecomment) =>
              dosecomment.id === selecteddosecommentId ? updateddosecomment : dosecomment
            )
          );

          // Reset the form and the selected dosecomment ID
          setFormData({
            dosecomment: '',
          });
          setselecteddosecommentId(null);
          window.location.reload();
        } else {
          alert('Failed to update dosecomment');
        }
      } catch (error) {
        console.error('Error updating dosecomment:', error);
      }
    } else {
      // If no dosecomment is selected, add a new dosecomment
      try {
        const response = await fetch('https://khmc-xdlm.onrender.com/api/dosecomment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        console.log(response);
        

        if (response.ok) {
          const newdosecomment = await response.json();
          alert('dosecomment data submitted successfully!');
          console.log(newdosecomment);

          // Update the dosecomment array with the newly added dosecomment
          setdosecomment((prevdosecomment) => [...prevdosecomment, newdosecomment]);

          // Clear the form
          setFormData({
            dosecomment: '',
          });
          window.location.reload();
        } else {
          alert('Failed to submit dosecomment data');
        }
      } catch (error) {
        console.error('Error submitting dosecomment data:', error);
      }
    }
  };

  // Handle deleting a dosecomment
  const handleDelete = async () => {
    if (selecteddosecommentId) {
      try {
        const response = await fetch(`https://khmc-xdlm.onrender.com/api/dosecomment/${selecteddosecommentId}`, {
          method: 'DELETE', // Use DELETE for deleting the dosecomment
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          alert('dosecomment deleted successfully!');

          // Remove the dosecomment from the dosecomment array
          setdosecomment((prevdosecomment) =>
            prevdosecomment.filter((dosecomment) => dosecomment.id !== selecteddosecommentId)
          );

          // Clear the form and reset selecteddosecommentId
          setFormData({
            dosecomment: '',
          });
          setselecteddosecommentId(null); // Reset the selected dosecomment ID
          window.location.reload();
        } else {
          alert('Failed to delete dosecomment');
        }
      } catch (error) {
        console.error('Error deleting dosecomment:', error);
      }
    }
  };


  // Handle click on the table row (populate form with the selected dosecomment data)
  const handleRowClick = (dosecomment) => {
    console.log("dosecomment", dosecomment);
    setFormData({
      dosecomment: dosecomment.dosecomment,
    });
    setselecteddosecommentId(dosecomment._id); // Set the selected dosecomment ID for editing
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
                Dose Comment Name
              </h3>
              <nav aria-label="breadcrumb">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item active" aria-current="page">
                    <span></span>Dose Comment Name <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="row">
              <div className="col-4 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Dose Comment List</h4>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Dose Comment Name</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dosecomments.map((dosecomment) => (
                          <tr key={dosecomment.id} onClick={() => handleRowClick(dosecomment)} style={{ cursor: 'pointer' }}>
                            <td>{dosecomment.dosecomment}</td>
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
                          <label htmlFor="dosecomment">Dose Comment Name</label>
                          <input
                            type="text"
                            name='dosecomment'
                            value={formData['dosecomment']}
                            onChange={handleChange}
                            className="form-control"
                            id="dosecomment"
                            placeholder="Enter dosecomment Name" />
                        </div>

                      </div>
                      <button type="submit" className="btn btn-gradient-primary me-2">
                        {selecteddosecommentId ? 'Update' : 'Submit'}
                      </button>
                      {selecteddosecommentId && (
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
                          dosecomment: '',
                        });
                        setselecteddosecommentId(null);
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

export default DoseComment