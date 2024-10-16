import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo } from 'ckeditor5';

import Topbar from '../component/TopNavBar';
import { Link } from 'react-router-dom';

const LablogResult = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        TestlablogId: '',
        result: '', // Use result to match your form submission field name
    });

    const [testDetail, settestDetail] = useState([]);
    const [testComments, settestComments] = useState(''); // State to hold CKEditor content
    const [testId, settestId] = useState('');
    const [loading, setLoading] = useState(true); // For loading state

    // Fetch data from the API when the component is mounted
    useEffect(() => {
        const fetchLabEntries = async () => {
            try {
                const response = await fetch(`https://khmc-xdlm.onrender.com/api/labentry/${id}`);
                const data = await response.json();
                console.log(data, "data");

                settestDetail([data]); // Set the response data in the LabEntries state
                settestId(data.tests[0]); // Assuming the test ID is at data.tests[0]
                setLoading(false); // Stop the loading state
                
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false); // Stop the loading even in case of error
            }
        };

        fetchLabEntries(); // Call the function
    }, [id]); // Dependency array includes id

    // Fetch test comments
    const fetchTestComments = async () => {
        try {
            const response = await fetch(`https://khmc-xdlm.onrender.com/api/testComment/${testId}`);
            const data = await response.json();
            console.log(data, "testComment");

            const fetchedComments = data[0]?.Comments || '';
            settestComments(fetchedComments); // Set the comment fetched from API

            setFormData({
                
                TestlablogId: id,
                result: fetchedComments, // Update Comment field in formData
            });
            setLoading(false); // Stop the loading state
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false); // Stop the loading even in case of error
        }
    };

    // Update CKEditor content
    const handleChange1 = (event, editor) => {
        const data = editor.getData();
        console.log("CKEditor Data:", data); // Debugging CKEditor data
        setFormData({
            ...formData,
            result: data // Update Comment field in formData with CKEditor content
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting form data:", formData); // Debugging form data

        // Submit logic here
        try {
            const response = await fetch('https://khmc-xdlm.onrender.com/api/testResult', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    TestlablogId:id
                })
            });

            if (response.ok) {
                const newTest = await response.json();
                alert('Comment submitted successfully!');
                console.log(newTest, "After submission");

                // window.location.reload();
                // Clear the form
                setFormData({
                    TestlablogId: '',
                    result: '',
                });
            } else {
                alert('Failed to submit comment data');
            }
        } catch (error) {
            console.error('Error submitting test data:', error);
        }
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
                                Result Report
                            </h3>
                        </div>

                        <div className="row">
                            <div className="card">
                                <div className="card-body">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Sno</th>
                                                <th>Test</th>
                                                <th>Normal Value</th>
                                                <th>Result</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {testDetail.map((labtest, index) => (
                                                <tr key={labtest._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{labtest.tests}</td>
                                                    <td>Normal Value</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-danger text-dark"
                                                            onClick={fetchTestComments}  // Trigger fetching comments
                                                        >
                                                            Show Comment
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <form onSubmit={handleSubmit}>
                                        <div className='row'>
                                            <div className="col-12">
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    name="Comments"
                                                    data={testComments} // Set the fetched comments here
                                                    config={{
                                                        toolbar: {
                                                            items: ['undo', 'redo', '|', 'bold', 'italic'],
                                                        },
                                                        plugins: [Bold, Essentials, Italic, Mention, Paragraph, Undo],
                                                    }}
                                                    onChange={handleChange1} // Update state on change
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary mt-3">Submit</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LablogResult;
