import React, { useState, useEffect } from 'react';
import Topbar from '../../component/TopNavBar';
import SideNavbar from '../../component/SideNavbar';
import { useNavigate } from 'react-router-dom';

const Ward = () => {
  const [wards, setWards] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    wardname: '',
    floorno: '',
  });
  const [selectedWardId, setSelectedWardId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWards = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/wards");
        const data = await response.json();
        console.log(data);
        
        setWards(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchWards();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedWardId) {
      // Update existing ward
      try {
        const response = await fetch(`http://localhost:3001/api/wards/${selectedWardId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const updatedWard = await response.json();
          setWards((prevWards) =>
            prevWards.map((ward) => (ward._id === selectedWardId ? updatedWard : ward))
          );
          alert('Ward updated successfully!');
          navigate("/master/ward");
        } else {
          alert('Failed to update ward');
        }
      } catch (error) {
        console.error('Error updating ward:', error);
      }
    } else {
      // Add new ward
      try {
        const response = await fetch('http://localhost:3001/api/wards', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const newWard = await response.json();
          setWards(newWard);
          alert('Ward added successfully!');
          navigate("/master/ward")
        } else {
          alert('Failed to add ward');
        }
      } catch (error) {
        console.error('Error adding ward:', error);
      }
    }

    // Clear form
    setFormData({
      wardname: '',
      floorno: '',
    });
    setSelectedWardId(null);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/wards/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWards((prevWards) => prevWards.filter((ward) => ward._id !== id));
        alert('Ward deleted successfully!');
      } else {
        alert('Failed to delete ward');
      }
    } catch (error) {
      console.error('Error deleting ward:', error);
    }
  };

  const handleRowClick = (ward) => {
    setFormData({
      wardname: ward.wardname,
      floorno: ward.floorno,
    });
    setSelectedWardId(ward._id);
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
                Ward
              </h3>
              <nav aria-label="breadcrumb">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item active" aria-current="page">
                    <span></span>Ward <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="row">
              <div className="col-4 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Ward List</h4>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Ward Name</th>
                          <th>Floor Number</th>
                          <th>Action</th>
                        </tr>
                      </thead>{console.log("wards", wards)
                      }
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="3">Loading...</td>
                          </tr>
                        ) : (
                          Array.isArray(wards) && wards.map((ward) => (
                            <tr key={ward._id} onClick={() => handleRowClick(ward)} style={{ cursor: 'pointer' }}>
                              <td>{ward.wardname}</td>
                              <td>{ward.floorno}</td>
                              <td>
                                <button className="btn btn-danger" onClick={() => handleDelete(ward._id)}>Delete</button>
                              </td>
                            </tr>
                          ))
                        )}
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
                          <label htmlFor="wardname">Ward Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="wardname"
                            name="wardname"
                            value={formData.wardname}
                            onChange={handleChange}
                            placeholder="Enter Ward Name"
                          />
                        </div>

                        <div className="col-6 mt-3">
                          <label htmlFor="floorno">Floor Number</label>
                          <input
                            type="text"
                            className="form-control"
                            id="floorno"
                            name="floorno"
                            value={formData.floorno}
                            onChange={handleChange}
                            placeholder="Enter Floor Number"
                          />
                        </div>
                      </div>

                      <button type="submit" className="btn btn-gradient-primary me-2">
                        {selectedWardId ? 'Update' : 'Submit'}
                      </button>
                      <button className="btn btn-light" type="button" onClick={() => {
                        setFormData({ wardname: '', floorno: '' });
                        setSelectedWardId(null);
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

export default Ward;
