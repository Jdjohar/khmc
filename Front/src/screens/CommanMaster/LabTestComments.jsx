import React, { useState, useEffect } from 'react';
import Topbar from '../component/TopNavBar';
import SideNavbar from '../component/SideNavbar';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClassicEditor, Context, Bold, Essentials, Italic, Underline, Heading, Alignment, List, Paragraph, ContextWatchdog,Mention, Undo } from 'ckeditor5';


import 'ckeditor5/ckeditor5.css';
const LabTestComments = () => {
    const [formData, setFormData] = useState({
        TestId: '',
        Comments: '',
    });
    const { id } = useParams();
    const [testComment, settestComment] = useState([])
    const [loading, setLoading] = useState(true); // For loading state

    useEffect(() => {
        const fetchLabTests = async () => {
            console.log(id, "id - Params Id");
            try {
                const response = await fetch(`https://khmc-xdlm.onrender.com/api/testComment/${id}`);
                console.log(id, "id - APi Id");
                const data = await response.json();
                console.log(data, "data sd");
                console.log("data dsdfs zdsd");
                settestComment(data)
                setLoading(false); // Stop the loading state
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false); // Stop the loading even in case of error
            }
        };

        fetchLabTests(); // Call the function
    }, []); // Empty dependency array to run only once

    // If still loading, show a loading message
    if (loading) {
        return <p>Loading...</p>;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(formData, "Before");

        try {
            const response = await fetch('https://khmc-xdlm.onrender.com/api/testComment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const newTest = await response.json();
                alert('Comment submitted successfully!');
                console.log(newTest, "After");

                window.location.reload();
                // Clear the form
                setFormData({
                    TestId: '',
                    Comments: '',
                });
            } else {
                alert('Failed to submit comment data');
            }
        } catch (error) {
            console.error('Error submitting test data:', error);
        }


    }

    const handleDeleteClick = async (commentid) => {
        try {
            const response = await fetch(`https://khmc-xdlm.onrender.com/api/testComment/${commentid}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                alert('Comment deleted successfully!');
                window.location.reload();
                
            } else {
                alert('Failed to delete Comment');
            }
        } catch (error) {
            console.error('Error deleting Comment:', error);
        }

    };

    const handleChange1 = (event, editor) => {
        const data = editor.getData();
        setFormData({
            TestId: id,
            Comments: data // Update Comment field in formData
        }
        );
    };

    return (
        <>

            <Topbar />
            <div className="container-fluid p-0 page-body-wrapper">
                {/* <SideNavbar /> */}
                {console.log(formData, "formData")}
                <div className="main-panel">
                    <div className="content-wrapper">
                        <div className="page-header">
                            <h3 className="page-title">
                                <span className="page-title-icon bg-gradient-primary text-white me-2">
                                    <i className="mdi mdi-home"></i>
                                </span>
                                Add Comments
                            </h3>
                            <nav aria-label="breadcrumb">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item active" aria-current="page">
                                        <span></span>Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        <div className="row">
                            <div className="col-12 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">Add Comments</h4>

                                        <form onSubmit={handleSubmit}>
                                            <div className="form-group row">
                                                <div className='col-12 mt-3'>
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        name="Comment"
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
                                                <button type="submit" className="btn btn-gradient-primary me-2">
                                                    Submit
                                                </button>

                                            </div>
                                        </form>

                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="row">
                            <div className="col-12 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">Comment List</h4>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Comment</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {testComment.map((test) => (
                                                    <tr key={test._id} >
                                                        
                                                        <td><div className='information-content' dangerouslySetInnerHTML={{ __html: test.Comments }} /></td>
                                                        <td>
                                                            <button
                                                                className='btn btn-danger'
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // Prevents row click from triggering
                                                                    handleDeleteClick(test._id);
                                                                }}
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
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

export default LabTestComments