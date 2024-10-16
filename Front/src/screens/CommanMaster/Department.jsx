import React, { useEffect, useState } from 'react';
import Topbar from '../component/TopNavBar';
import SideNavbar from '../component/SideNavbar';

const Department = () => {
  const [formData, setFormData] = useState({
    departmentname: '',
    usein: '',
    order: '',
    comment: '',
    checkboxOptions: [],
  });

  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartId, setSelectedDepartId] = useState(null);

  // Fetch data from the API when the component is mounted
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('https://khmc-xdlm.onrender.com/api/department');
        const data = await response.json();
        setDepartments(data); // Set the response data in departments
        setLoading(false); // Stop the loading state
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false); // Stop loading in case of error
      }
    };

    fetchDepartments(); // Call the function
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(name,checked, "checked");
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
          checkboxOptions: prevData.checkboxOptions.filter(
            (option) => option !== value
          ),
        }));
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle form submission (add new department or update an existing department)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (selectedDepartId) {
      // If a department is selected, update the department
      try {
        const response = await fetch(
          `https://khmc-xdlm.onrender.com/api/department/${selectedDepartId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          const updatedDepartment = await response.json();
          alert('Department updated successfully!');

          // Update the department in the list
          setDepartments((prevDepartments) =>
            prevDepartments.map((department) =>
              department._id === selectedDepartId ? updatedDepartment : department
            )
          );

          // Reset the form and the selected department ID
          setFormData({
            departmentname: '',
            usein: '',
            order: '',
            comment: '',
            checkboxOptions: [],
          });
          setSelectedDepartId(null);
          window.location.reload();
        } else {
          const errorData = await response.json();

          
          alert(`Failed to update Prefix 2: ${errorData.error || 'Unknown error'}`);
          alert('Failed to update department');
        }
      } catch (error) {
        console.error('Error updating department:', error);
      }
    } else {
      // Add a new department
      try {
        const response = await fetch('https://khmc-xdlm.onrender.com/api/department', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const newDepartment = await response.json();
          alert('Department added successfully!');
          setDepartments((prevDepartments) => [...prevDepartments, newDepartment]);

          // Clear the form
          setFormData({
            departmentname: '',
            usein: '',
            order: '',
            comment: '',
            checkboxOptions: [],
          });
          window.location.reload();
        } else {
          const errorData = await response.json();
          console.log(errorData,"error");
          
          alert(`Failed to update Prefix 2: ${errorData.error || 'Unknown error'}`);

        }
      } catch (error) {
        console.error('Error adding department:', error);
      }
    }
  };

  // Handle deleting a department
  const handleDelete = async () => {
    console.log(selectedDepartId);
    
    if (selectedDepartId) {
      try {
        const response = await fetch(
          `https://khmc-xdlm.onrender.com/api/department/${selectedDepartId}`,
          {
            method: 'DELETE', // Use DELETE for deleting the department
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          alert('Department deleted successfully!');

          // Remove the department from the list
          setDepartments((prevDepartments) =>
            prevDepartments.filter(
              (department) => department._id !== selectedDepartId
            )
          );

          // Reset the form
          setFormData({
            departmentname: '',
            usein: '',
            order: '',
            comment: '',
            checkboxOptions: [],
          });
          setSelectedDepartId(null);
        } else {
          alert('Failed to delete department');
        }
      } catch (error) {
        console.error('Error deleting department:', error);
      }
    }
  };

  // Handle click on the table row (populate form with the selected department data)
  const handleRowClick = (department) => {
    setFormData({
      departmentname: department.departmentname,
      usein: department.usein,
      order: department.order,
      comment: department.comment,
      checkboxOptions: department.checkboxOptions || [],
    });
    setSelectedDepartId(department._id); // Set the selected department ID for editing
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
                Department
              </h3>
              <nav aria-label="breadcrumb">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item active" aria-current="page">
                    Department
                    <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="row">
              <div className="col-4 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Department List</h4>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Department Name</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {departments.map((department) => (
                          <tr
                            key={department._id}
                            onClick={() => handleRowClick(department)}
                            style={{ cursor: 'pointer' }}
                          >
                            <td>{department.departmentname}</td>
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
                          <label htmlFor="departmentname">Department Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="departmentname"
                            name="departmentname"
                            value={formData.departmentname}
                            onChange={handleChange}
                            placeholder="Enter Department Name"
                            required
                          />
                        </div>

                        <div className="col-6 mt-3">
                          <label htmlFor="usein">Use in</label>
                          <select
                            className="form-control"
                            id="usein"
                            name="usein"
                            value={formData.usein}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select Option</option>
                            <option value="Both">Both</option>
                            <option value="indooronly">Indoor Only</option>
                            <option value="outdooronly">Outdoor Only</option>
                            <option value="directpatient">Direct Patient</option>
                          </select>
                        </div>

                        <div className="col-6 mt-3">
                          <label htmlFor="order">Order</label>
                          <input
                            type="text"
                            className="form-control"
                            id="order"
                            name="order"
                            value={formData.order}
                            onChange={handleChange}
                            placeholder="0"
                            
                          />
                        </div>

                        {/* Comment Field */}
                        <div className="col-12 mt-3">
                          <label htmlFor="comment">Comment</label>
                          <textarea
                            className="form-control"
                            id="comment"
                            name="comment"
                            value={formData.comment}
                            onChange={handleChange}
                            placeholder="Enter your comment"
                            rows="4"
                            
                          ></textarea>
                        </div>

                        {/* Department Investigating - Checkboxes */}
                        <div className="col-12 mt-3">
                          <label>Name of the Department Investigating</label>
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="gyne"
                              name="checkboxOptions"
                              value="Gyne"
                              checked={formData.checkboxOptions.includes('Gyne')}
                              onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="gyne">
                              Gyne
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="infertility"
                              name="checkboxOptions"
                              value="Infertility"
                              checked={formData.checkboxOptions.includes('Infertility')}
                              onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="infertility">
                              Infertility
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="dental"
                              name="checkboxOptions"
                              value="Dental"
                              checked={formData.checkboxOptions.includes('Dental')}
                              onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="dental">
                              Dental
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="radiology"
                              name="checkboxOptions"
                              value="Radiology"
                              checked={formData.checkboxOptions.includes('Radiology')}
                              onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="radiology">
                              Radiology
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="eye"
                              name="checkboxOptions"
                              value="Eye"
                              checked={formData.checkboxOptions.includes('Eye')}
                              onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="eye">
                              Eye
                            </label>
                          </div>
                        </div>
                      </div>

                      <button type="submit" className="btn btn-gradient-primary me-2">
                        {selectedDepartId ? 'Update' : 'Submit'}
                      </button>
                      {selectedDepartId && (
                        <button
                          type="button"
                          className="btn btn-danger me-2"
                          onClick={handleDelete}
                        >
                          Delete
                        </button>
                      )}
                      <button
                        className="btn btn-light"
                        type="button"
                        onClick={() => {
                          setFormData({
                            departmentname: '',
                            usein: '',
                            order: '',
                            comment: '',
                            checkboxOptions: [],
                          });
                          setSelectedDepartId(null);
                        }}
                      >
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

export default Department;