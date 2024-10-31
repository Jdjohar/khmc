import React, { useState, useEffect } from 'react';
import Topbar from '../component/TopNavBar';
import SideNavbar from '../component/SideNavbar';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClassicEditor, Context, Bold, Essentials, Italic, Underline, Heading, Alignment, List, Paragraph, ContextWatchdog,Mention, Undo } from 'ckeditor5';



const TestCat = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        categoryname: '',
        description: '',
    });
    const [categoryname, setcategoryname] = useState([]);
    const [selectedStateId, setSelectedStateId] = useState(null); // New state to track the selected state

    // Fetch data from the API when the component is mounted
    useEffect(() => {
        const fetchState = async () => {
            try {
                const response = await fetch("https://khmc-xdlm.onrender.com/api/testCat");
                const data = await response.json();
                console.log(data);

                setcategoryname(data); // Set the response data in the State
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

    const handleChange1 = (event, editor) => {
        const data = editor.getData();
        setFormData((prevData) => ({ 
           ...prevData,
            description: data // Update Comment field in formData
        }
        ));
    };

    // Handle form submission (add new state or update an existing state)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedStateId) {

          console.log("selectedStateId:",selectedStateId);
          
            // If a state is selected, update the state
            try {
                const response = await fetch(`https://khmc-xdlm.onrender.com/api/testCat/${selectedStateId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    const updatedState = await response.json();
                    alert('State updated successfully!');

                    // Update the state in the categoryname array
                    setcategoryname((prevcategoryname) =>
                        prevcategoryname.map((state) =>
                            state.id === selectedStateId ? updatedState : state
                        )
                    );

                    // Reset the form and the selected state ID
                    setFormData({
                        categoryname: '',
                        description: '',
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
                const response = await fetch('https://khmc-xdlm.onrender.com/api/testCat', {
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
                    window.location.reload();

                    // Update the categoryname array with the newly added state
                    setcategoryname((prevcategoryname) => [...prevcategoryname, newState]);

                    // Clear the form
                    setFormData({
                        categoryname: '',
        description: '',
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
              const response = await fetch(`https://khmc-xdlm.onrender.com/api/testCat/${selectedStateId}`, {
                  method: 'DELETE', // Use DELETE for deleting the state
                  headers: {
                      'Content-Type': 'application/json'
                  }
              });

              if (response.ok) {
                  alert('category deleted successfully!');

                  // Remove the state from the categoryname array
                  setcategoryname((prevcategoryname) =>
                      prevcategoryname.filter((state) => state.id !== selectedStateId)
                  );

                  // Clear the form and reset selectedStateId
                  setFormData({
                    categoryname: '',
                    description: '',
                  });
                  setSelectedStateId(null); // Reset the selected state ID
              } else {
                  alert('Failed to delete category');
              }
          } catch (error) {
              console.error('Error deleting state:', error);
          }
      }
  };


    // Handle click on the table row (populate form with the selected state data)
    const handleRowClick = (testcat) => {
      console.log("State",  testcat);
        setFormData({

            categoryname: testcat.categoryname,
            description: testcat.description,
        });
        setSelectedStateId(testcat._id); // Set the selected state ID for editing
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
                                Test Category
                            </h3>
                            <nav aria-label="breadcrumb">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item active" aria-current="page">
                                        <span></span> Test Category <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
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
                                                    <th>Category Name</th>
                                                    {/* <th>State Code</th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {categoryname.map((state) => (
                                                    <tr key={state.id} onClick={() => handleRowClick(state)} style={{ cursor: 'pointer' }}>
                                                        <td>{state.categoryname}</td>
                                                        {/* <td>{state.description}</td> */}
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
                                                    <label htmlFor="statename">Category Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="categoryname"
                                                        value={formData['categoryname']}
                                                        onChange={handleChange}
                                                        id="categoryname"
                                                        placeholder="Enter Category Name"
                                                    />
                                                </div>
                                                <div className="col-12 mt-3">
                                                    <label htmlFor="description">Description</label>
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        name="description"
                                                        data={formData.description}
                                                        config={ {
                                                            plugins: [
                                                              Essentials, Bold, Italic, Underline, Heading, Alignment, List, Paragraph, Undo
                                                            ],
                                                            toolbar: [
                                                              'heading', '|', 'bold', 'italic', 'underline', '|', 'alignment', '|', 'bulletedList', 'numberedList', '|', 'undo', 'redo'
                                                            ]
                                                          } }
                                                        onReady={(editor) => {
                                                            // You can store the "editor" and use it later.
                                                            console.log('Editor is ready to use!', editor);
                                                        }}
                                                        onChange={handleChange1} // Update state on change
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
                                                    categoryname: '',
                                                    description: '',
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

export default TestCat;
