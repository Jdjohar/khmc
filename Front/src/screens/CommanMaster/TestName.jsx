import React, { useState, useEffect } from 'react';
import Topbar from '../component/TopNavBar';
import SideNavbar from '../component/SideNavbar';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';


const TestName = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        TestName: '',
        Department: '',
        Rate: '',
        TestCode: '',
        Comment: '',
        AadharCard: false,
        FormF: false,
    });
    const [testNames, setTestNames] = useState([]);
    const [selectedTestId, setSelectedTestId] = useState(null); // State to track the selected test

    // Fetch data from the API when the component is mounted
    useEffect(() => {
        const fetchTestNames = async () => {
            try {
                const response = await fetch("https://khmc-xdlm.onrender.com/api/testName");
                const data = await response.json();
                console.log(data);

                setTestNames(data); // Set the response data in the testNames state
                setLoading(false); // Stop the loading state
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false); // Stop the loading even in case of error
            }
        };

        fetchTestNames(); // Call the function
    }, []); // Empty dependency array to run only once

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
           
        }));
    };
    const handleChange1 = (event, editor) => {
        const data = editor.getData();
        setFormData({
            ...formData,
            Comment: data // Update Comment field in formData
        });
    };

    // Handle form submission (add new test or update an existing test)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedTestId) {
            console.log("selectedTestId:", selectedTestId);

            // If a test is selected, update the test
            try {
                const response = await fetch(`https://khmc-xdlm.onrender.com/api/testName/${selectedTestId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    const updatedTest = await response.json();
                    alert('Test updated successfully!');

                    // Update the test in the testNames array
                    setTestNames((prevTestNames) =>
                        prevTestNames.map((test) =>
                            test._id === selectedTestId ? updatedTest : test
                        )
                    );

                    // Reset the form and the selected test ID
                    setFormData({
                        TestName: '',
                        Department: '',
                        Rate: '',
                        TestCode: '',
                        Comment: '',
                        AadharCard: false,
                        FormF: false,
                    });
                    setSelectedTestId(null);
                    window.location.reload();
                } else {
                    alert('Failed to update test');
                }
            } catch (error) {
                console.error('Error updating test:', error);
            }
        } else {
            // If no test is selected, add a new test
            try {
                const response = await fetch('https://khmc-xdlm.onrender.com/api/testName', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    const newTest = await response.json();
                    alert('Test data submitted successfully!');
                    console.log(newTest);

                    // Update the testNames array with the newly added test
                    setTestNames((prevTestNames) => [...prevTestNames, newTest]);

                    // Clear the form
                    setFormData({
                        TestName: '',
                        Department: '',
                        Rate: '',
                        TestCode: '',
                        Comment: '',
                        AadharCard: false,
                        FormF: false,
                    });
                } else {
                    alert('Failed to submit test data');
                }
            } catch (error) {
                console.error('Error submitting test data:', error);
            }
        }
    };

    // Handle deleting a test
    const handleDelete = async () => {
        if (selectedTestId) {
            try {
                const response = await fetch(`https://khmc-xdlm.onrender.com/api/testName/${selectedTestId}`, {
                    method: 'DELETE', // Use DELETE for deleting the test
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    alert('Test deleted successfully!');

                    // Remove the test from the testNames array
                    setTestNames((prevTestNames) =>
                        prevTestNames.filter((test) => test._id !== selectedTestId)
                    );

                    // Clear the form and reset selectedTestId
                    setFormData({
                        TestName: '',
                        Department: '',
                        Rate: '',
                        TestCode: '',
                        Comment: '',
                        AadharCard: false,
                        FormF: false,
                    });
                    setSelectedTestId(null); // Reset the selected test ID
                } else {
                    alert('Failed to delete test');
                }
            } catch (error) {
                console.error('Error deleting test:', error);
            }
        }
    };

    // Handle click on the table row (populate form with the selected test data)
    const handleRowClick = (test) => {
        console.log("Test", test);
        setFormData({
            TestName: test.TestName,
            Department: test.Department,
            Rate: test.Rate,
            TestCode: test.TestCode,
            Comment: test.Comment,
            AadharCard: test.AadharCard,
            FormF: test.FormF,
        });
        setSelectedTestId(test._id); // Set the selected test ID for editing
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
                                Test Names
                            </h3>
                            <nav aria-label="breadcrumb">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item active" aria-current="page">
                                        <span></span>Test Names <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
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
                                                    <th>Test Name</th>
                                                    <th>Test Code</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {testNames.map((test) => (
                                                    <tr key={test._id} onClick={() => handleRowClick(test)} style={{ cursor: 'pointer' }}>
                                                        <td>{test.TestName}</td>
                                                        <td>{test.TestCode}</td>
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
                                                    <label htmlFor="TestName">Test Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="TestName"
                                                        value={formData['TestName']}
                                                        onChange={handleChange}
                                                        id="TestName"
                                                        placeholder="Enter Test Name"
                                                    />
                                                </div>
                                                <div className="col-6 mt-3">
                                                    <label htmlFor="Department">Department</label>
                                                    <select
                                                        className='form-control'
                                                        name='Department'
                                                        value={formData['Department']}
                                                        onChange={handleChange}
                                                    >
                                                        <option>Select Department</option>
                                                        <option value="pathology">Pathology</option>
                                                        <option value="radiology">Radiology</option>

                                                    </select>

                                                </div>

                                                <div className="col-6 mt-3">
                                                    <label htmlFor="Rate">Rate</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        name="Rate"
                                                        value={formData['Rate']}
                                                        onChange={handleChange}
                                                        placeholder="Enter Rate"
                                                    />
                                                </div>
                                                <div className="col-6 mt-3">
                                                    <label htmlFor="TestCode">Test Code</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="TestCode"
                                                        value={formData['TestCode']}
                                                        onChange={handleChange}
                                                        placeholder="Enter Test Code"
                                                    />
                                                </div>

                                                <div className="col-12 mt-3">
                                                    <label htmlFor="Comment">Comment</label>
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        name="Comment"
                                                        config={{
                                                            toolbar: {
                                                                items: ['undo', 'redo', '|', 'bold', 'italic'],
                                                            },
                                                            plugins: [
                                                                Bold, Essentials, Italic, Mention, Paragraph, Undo
                                                            ],

                                                            mention: {
                                                                // Mention configuration
                                                            },
                                                            initialData: '<p>Hello!</p>',
                                                        }}
                                                        onReady={(editor) => {
                                                            // You can store the "editor" and use it later.
                                                            console.log('Editor is ready to use!', editor);
                                                        }}
                                                        onChange={handleChange1} // Update state on change
                                                    />
                                                </div>

                                            </div>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="FormF"
                                                    checked={formData['FormF']}
                                                    onChange={handleChange}
                                                    id="FormF"
                                                />
                                                <label className="form-check-label" htmlFor="FormF">Form F</label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="AadharCard"
                                                    checked={formData['AadharCard']}
                                                    onChange={handleChange}
                                                    id="AadharCard"
                                                />
                                                <label className="form-check-label" htmlFor="Aadhar Card">Aadhar Card</label>
                                            </div>
                                            <button type="submit" className="btn btn-gradient-primary me-2">
                                                {selectedTestId ? 'Update' : 'Submit'}
                                            </button>
                                            {selectedTestId && (
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
                                                    TestName: '',
                                                    Department: '',
                                                    Rate: '',
                                                    TestCode: '',
                                                    Comment: '',
                                                    AadharCard: '',
                                                    FormF: false,
                                                });
                                                setSelectedTestId(null);
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

export default TestName;
