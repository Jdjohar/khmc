import React, { useState, useEffect } from 'react';
import Topbar from '../component/TopNavBar';
import SideNavbar from '../component/SideNavbar';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Context, Bold, Essentials, Italic, Underline, Heading, Alignment, List, Paragraph, ContextWatchdog, Mention, Undo } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { useParams } from 'react-router-dom';


const TestName = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [formData, setFormData] = useState({
        TestName: '',
        Department: '',
        Rate: '',
        Catid: '',
        TestCode: '',
        Comment: '',
        TestComment: '',
        AadharCard: false,
        FormF: false,
    });
    const [testNames, setTestNames] = useState([]);
    const [testCatNames, settestCatNames] = useState([]);
    const [selectedTestId, setSelectedTestId] = useState(null); // State to track the selected test
    const [testDetails, setTestDetails] = useState([
        { Investigation: '', Result: '', Unit: '', NormalRange: { start: '', end: '' }, TestComment: '' }
    ])
    // Fetch data from the API when the component is mounted
    useEffect(() => {
        console.log(id, "Use Params");

        const FindTestDetail = async () => {
            try {
                const response = await fetch(`https://khmc-xdlm.onrender.com/api/testName/${id}`);
                const data = await response.json();
                console.log(data, "FindTestDetail");
                setFormData({
                    TestName: data.TestName,
                    Department: data.Department,
                    Rate: data.Rate,
                    TestCode: data.TestCode,
                    Comment: data.Comment,
                    TestComment: data.TestComment,
                    AadharCard: data.AadharCard,
                    FormF: data.FormF,
                });

            } catch (error) {

            }

        }



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
        const fetchTestCat = async () => {
            try {
                const response = await fetch("https://khmc-xdlm.onrender.com/api/testCat");
                const data = await response.json();
                console.log(data, "Data Cate Names");

                settestCatNames(data); // Set the response data in the testNames state
                setLoading(false); // Stop the loading state
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false); // Stop the loading even in case of error
            }
        };

        fetchTestNames(); // Call the function
        FindTestDetail(); // Call the function
        fetchTestCat(); // Call the function
    }, []); // Empty dependency array to run only once

    // Function to handle changes for each test detail
    const handleTestDetailChange1 = (index, field, value) => {
        const updatedDetails = [...testDetails];
        if (field === 'TestComment') {
            updatedDetails[index].TestComment = value; // For CKEditor content
        } else {
            updatedDetails[index][field] = value;
        }
        setTestDetails(updatedDetails);
    };
    // Handle dynamic changes to Investigation, Result, Unit, and Normal Range
    const handleTestDetailChange = (index, field, value) => {
        const updatedDetails = [...testDetails];

        if (field === 'NormalRangeStart' || field === 'NormalRangeEnd') {
            const rangeField = field === 'NormalRangeStart' ? 'start' : 'end';
            updatedDetails[index].NormalRange[rangeField] = value;
        } else {
            updatedDetails[index][field] = value;
        }

        setTestDetails(updatedDetails);
    };

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
    // Handle form submission (add new test or update an existing test)
    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalFormData = {
            ...formData,
            testDetails: testDetails, // Include the dynamic test details in the final data
            Catid: formData.Catid
        };
        console.log(finalFormData, "Start Submit finalFormData Data")

        if (selectedTestId) {
            // Update the test
            try {
                const response = await fetch(`https://khmc-xdlm.onrender.com/api/testName/${selectedTestId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(finalFormData)
                });

                if (response.ok) {
                    const updatedTest = await response.json();
                    alert('Test updated successfully!');
                    setTestNames((prevTestNames) =>
                        prevTestNames.map((test) =>
                            test._id === selectedTestId ? updatedTest : test
                        )
                    );
                    setFormData({
                        TestName: '',
                        Department: '',
                        Rate: '',
                        TestCode: '',
                        Catid: '',
                        TestComment: '',
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
            // Add a new test
            console.log(finalFormData, "finalFormData Data")

            try {
                const response = await fetch('https://khmc-xdlm.onrender.com/api/testName', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(finalFormData)
                });

                if (response.ok) {
                    const newTest = await response.json();
                    alert('Test data submitted successfully!');
                    setTestNames((prevTestNames) => [...prevTestNames, newTest]);
                    setFormData({
                        TestName: '',
                        Department: '',
                        Rate: '',
                        TestCode: '',
                        Comment: '',
                        TestComment: '',
                        Catid: '',
                        AadharCard: false,
                        FormF: false,
                    });
                    setTestDetails([{ Investigation: '', Result: '', Unit: '', NormalRange: { start: '', end: '' } }]);
                } else {
                    alert('Failed to submit test data');
                }
            } catch (error) {
                console.error('Error submitting test data:', error);
            }
        }
    };

    // Add a new row of fields for Investigation, Result, Unit, and Normal Range
    const handleAddTestDetail = () => {
        setTestDetails([...testDetails, { Investigation: '', Result: '', Unit: '', NormalRange: { start: '', end: '' } }]);
    };

    const handleRemoveTestDetail = (index) => {
        const updatedTestDetails = testDetails.filter((_, i) => i !== index);
        setTestDetails(updatedTestDetails);
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
                        Catid: '',
                        TestCode: '',
                        TestComment: '',
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
            Catid: test.Catid,
            TestCode: test.TestCode,
            TestComment: test.TestComment,
            Comment: test.Comment,
            AadharCard: test.AadharCard,
            FormF: test.FormF
        });
        // If testDetails exist, set them as well
        if (test.testDetails && test.testDetails.length > 0) {
            setTestDetails(test.testDetails); // Assuming you have a state for testDetails
        } else {
            setTestDetails([{ Investigation: '', Result: '', Unit: '', NormalRange: { start: '', end: '' } }]);
        }

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
                                Test Names {console.log(formData, "Test formData")}
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
                                                <div className="col-3 mt-3">
                                                    <label htmlFor="TestName">Test Name</label>
                                                    <input
                                                        type="text" className="form-control" name="TestName" value={formData['TestName']} onChange={handleChange} id="TestName" placeholder="Enter Test Name"
                                                    />
                                                </div>
                                                <div className="col-3 mt-3">
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
                                                        <option value="both">Both</option>

                                                    </select>

                                                </div>
                                                <div className="col-3 mt-3">
                                                    {console.log(testCatNames, "ds ")}
                                                    <label htmlFor="catid">Category</label>
                                                    <select
                                                        className='form-control'
                                                        name='Catid'
                                                        value={formData['Catid']}
                                                        onChange={handleChange}
                                                    >
                                                        <option>Select Category</option>
                                                        {testCatNames.map((testcat) => (
                                                            <option key={testcat._id} value={testcat._id}>
                                                                {testcat.categoryname}
                                                            </option>
                                                        ))}


                                                    </select>

                                                </div>

                                                <div className="col-3 mt-3">
                                                    <label htmlFor="Rate">Rate</label>
                                                    <input
                                                        type="number" className="form-control" name="Rate" value={formData['Rate']} onChange={handleChange} placeholder="Enter Rate"
                                                    />
                                                </div>
                                                <div className="col-3 mt-3">
                                                    <label htmlFor="TestCode">Test Code</label>
                                                    <input
                                                        type="text" 
                                                        className="form-control" 
                                                        name="TestCode" 
                                                        value={formData['TestCode']} 
                                                        onChange={handleChange} placeholder="Enter Test Code"
                                                    />
                                                </div>

                                                <div className="col-12 mt-3">
                                                    <label htmlFor="Comment">Comment</label>
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        name="Comment"
                                                        data={formData.Comment || ""}
                                                        config={{
                                                            plugins: [
                                                                Essentials, Bold, Italic, Underline, Heading, Alignment, List, Paragraph, Undo
                                                            ],
                                                            toolbar: [
                                                                'heading', '|', 'bold', 'italic', 'underline', '|', 'alignment', '|', 'bulletedList', 'numberedList', '|', 'undo', 'redo'
                                                            ]
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
                                                    onChange={handleChange} id="FormF"
                                                />
                                                <label className="form-check-label" htmlFor="FormF">Form F</label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input" 
                                                    name="AadharCard" 
                                                    checked={formData['AadharCard']} 
                                                    onChange={handleChange} id="AadharCard"
                                                />
                                                <label className="form-check-label" htmlFor="Aadhar Card">Aadhar Card</label>
                                            </div>

                                            <div className='py-5'>
                                                {testDetails.map((detail, index) => (
                                                    <div key={index} className="row mb-3">
                                                        <div className="col-3">
                                                            <labe>Investigation</labe>
                                                            <input
                                                                type="text" className="form-control" placeholder="Investigation" value={detail.Investigation} onChange={(e) => handleTestDetailChange(index, 'Investigation', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-2">
                                                            <labe>Result</labe>
                                                            <input
                                                                type="text" className="form-control" placeholder="Result" value={detail.Result}
                                                                onChange={(e) => handleTestDetailChange(index, 'Result', e.target.value)}
                                                            />
                                                        </div>

                                                        <div className="col-2">
                                                            <labe>Unit</labe>
                                                            <input
                                                                type="text" className="form-control" placeholder="Unit" value={detail.Unit}
                                                                onChange={(e) => handleTestDetailChange(index, 'Unit', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-2">
                                                            <labe>Range Start</labe>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                placeholder="Normal Range Start"
                                                                value={detail.NormalRange.start}
                                                                onChange={(e) => handleTestDetailChange(index, 'NormalRangeStart', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-2">
                                                            <labe>Range End</labe>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                placeholder="Normal Range End"
                                                                value={detail.NormalRange.end}
                                                                onChange={(e) => handleTestDetailChange(index, 'NormalRangeEnd', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-6">
                                                            <labe>Test Comment</labe>
                                                            <CKEditor
                                                                editor={ClassicEditor}
                                                                config={{
                                                                    plugins: [Essentials, Bold, Italic, Underline, Heading, Alignment, List, Paragraph, Undo],
                                                                    toolbar: [
                                                                        'heading', '|', 'bold', 'italic', 'underline', '|', 'alignment', '|', 'bulletedList', 'numberedList', '|', 'undo', 'redo'
                                                                    ]
                                                                }}
                                                                data={detail.TestComment || ""}  // Ensure data is a string
                                                                onChange={(event, editor) => {
                                                                    const data = editor.getData();
                                                                    handleTestDetailChange(index, 'TestComment', data); // Update `TestComment` on change
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="col-2">

                                                            <button
                                                                type="button"
                                                                className="btn mt-4 btn-danger"
                                                                onClick={() => handleRemoveTestDetail(index)}
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}

                                                <button type="button" className="btn btn-success mb-3" onClick={handleAddTestDetail}>
                                                    Add More
                                                </button>
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
                                                    TestComment: '',
                                                    Catid: '',
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
