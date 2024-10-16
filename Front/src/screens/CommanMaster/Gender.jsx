import React, { useState, useEffect } from 'react';
import Topbar from '../component/TopNavBar';
import SideNavbar from '../component/SideNavbar';

const Gender = () => {
  const [formData, setFormData] = useState({
    categoryname: '',
    agelessthan: '',
    type: '',
  });

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch categories from the API when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://khmc-xdlm.onrender.com/api/category');
        const data = await response.json();
        setCategories(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (add new category or update existing one)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedCategoryId) {
      // Update an existing category
      try {
        const response = await fetch(`https://khmc-xdlm.onrender.com/api/category/${selectedCategoryId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          const updatedCategory = await response.json();
          alert('Category updated successfully!');
          setCategories((prevCategories) =>
            prevCategories.map((category) =>
              category._id === selectedCategoryId ? updatedCategory : category
            )
          );
          resetForm();
          window.location.reload();
        } else {
          const errorData = await response.json();
          console.log(errorData,"error");
          
          alert(`Failed to update Prefix 2: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error updating category:', error);
      }
    } else {
      // Add a new category
      try {
        const response = await fetch('https://khmc-xdlm.onrender.com/api/category', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          const newCategory = await response.json();
          alert('Category added successfully!');
          setCategories([...categories, newCategory]);
          resetForm();
          window.location.reload();
        } else {

          const errorData = await response.json();
          console.log(errorData,"error");
          
          alert(`Failed to update Prefix 2: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error adding category:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      categoryname: '',
      agelessthan: '',
      type: '',
    });
    setSelectedCategoryId(null);
  };

  const handleDelete = async () => {
    if (selectedCategoryId) {
      try {
        const response = await fetch(`https://khmc-xdlm.onrender.com/api/category/${selectedCategoryId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          alert('Category deleted successfully!');
          setCategories(categories.filter((category) => category._id !== selectedCategoryId));
          resetForm();
        } else {
          alert('Failed to delete category');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleRowClick = (category) => {
    setFormData({
      categoryname: category.categoryname,
      agelessthan: category.agelessthan,
      type: category.type,
    });
    setSelectedCategoryId(category._id);
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
                Category
              </h3>
              <nav aria-label="breadcrumb">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item active" aria-current="page">
                    Category <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="row">
              <div className="col-4 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Category List</h4>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Category Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((category) => (
                          <tr key={category._id} onClick={() => handleRowClick(category)} style={{ cursor: 'pointer' }}>
                            <td>{category.categoryname}</td>
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
                          <label htmlFor="categoryname">Category Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="categoryname"
                            name="categoryname"
                            value={formData.categoryname}
                            onChange={handleChange}
                            placeholder="Enter Category Name"
                            required
                          />
                        </div>

                        <div className="col-6 mt-3">
                          <label htmlFor="agelessthan">Age Less than</label>
                          <input
                            type="text"
                            className="form-control"
                            id="agelessthan"
                            name="agelessthan"
                            value={formData.agelessthan}
                            onChange={handleChange}
                            placeholder="Enter Age"
                            required
                          />
                        </div>

                        <div className="col-6 mt-3">
                          <label htmlFor="type">Type</label>
                          <input
                            type="text"
                            className="form-control"
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            placeholder="Enter Type"
                            required
                          />
                        </div>
                      </div>

                      <button type="submit" className="btn btn-gradient-primary me-2">
                        {selectedCategoryId ? 'Update' : 'Submit'}
                      </button>
                      {selectedCategoryId && (
                        <button type="button" className="btn btn-danger me-2" onClick={handleDelete}>
                          Delete
                        </button>
                      )}
                      <button type="button" className="btn btn-light" onClick={resetForm}>
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

export default Gender;
