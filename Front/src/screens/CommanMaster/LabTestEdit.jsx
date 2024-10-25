import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Topbar from '../component/TopNavBar';
import SideNavbar from '../component/SideNavbar';
import { useParams, useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo } from 'ckeditor5';


const LabTestEdit = () => {
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
  const { id } = useParams();
  const [FetchData, setFetchData] = useState([])

  const [Editor, setEditor] = useState('');


  const navigate = useNavigate();

  // Fetch lab logs from the API when the component is mounted
  useEffect(() => {
    console.log(id,"User ID");
    const fetchData = async () => {
      try {
        // Fire both API requests simultaneously
        const [FetchTestDetailResponse] = await Promise.all([
            fetch(`https://khmc-xdlm.onrender.com/api/testName/${id}`),
          ]);

        // Wait for both responses to be converted to JSON
        const [
          FetchTestDetailData,
        ] = await Promise.all([
          FetchTestDetailResponse.json(),
        ]);

      setFetchData(FetchTestDetailData);
      console.log(FetchTestDetailData,"FetchTestDetailData");
      // setSno(snoData.sno);
        setFormData(FetchTestDetailData)
        setEditor('sdds')
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false on error
      }
    };
    fetchData(); // Call the function to fetch data
  }, []);



  // Handle input changes for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChange1 = (event, editor) => {
    const data = editor.getData();
    setEditor({
      Comment: data // Update Comment field in formData
  });
};
  // Handle form submission (add or update lab)
  const handleSubmit = async (e) => {
    e.preventDefault();
console.log(formData, 'Before');
console.log(Editor.Comment, 'Before');

      // Update lab log
      try {
        const response = await fetch(`https://khmc-xdlm.onrender.com/api/testName/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            Comment: Editor.Comment,
          }),
        });

        if (response.ok) {
          alert('Lab log updated successfully!');

          console.log(formData, 'After');
          navigate('/master/testlist')
        } else {
          alert('Failed to update lab log');
        }
      } catch (error) {
        console.error('Error updating lab log:', error);
      }
  
  };

  // Handle deleting a lab log
  const handleDelete = async () => {
    if (selectedLabId) {
      try {
        const response = await fetch(`https://khmc-xdlm.onrender.com/api/testName/${selectedLabId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Lab log deleted successfully!');
          window.location.reload();
        } else {
          alert('Failed to delete lab log');
        }
      } catch (error) {
        console.error('Error deleting lab log:', error);
      }
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
                           
                            <div className="col-8 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="forms-sample" onSubmit={handleSubmit}>
                                            <div className="form-group row">'
                                              
                                              {console.log(formData,"formData ===")}
                                                <div className="col-6 mt-3">
                                                    <label htmlFor="TestName">Test Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="TestName"
                                                        value={formData.TestName}
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
                                                  {console.log(formData,"Editor")
                                                  }
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
                                                        data={formData.Comment}
                                                        onReady={(editor) => {
                                                            // You can store the "editor" and use it later.
                                                            console.log('Editor is ready to use!', editor);
                                                        }}
                                                        onChange={handleChange1} // Update state on change
                                                    />
                                                    {/* <input
                                                        type="text"
                                                        className="form-control"
                                                        name="Comment"
                                                        value={formData['Comment']}
                                                        onChange={handleChange}
                                                        placeholder="Enter Comment"
                                                    /> */}
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
                                              Update
                                            </button>
                                           
                                                <button
                                                    type="button"
                                                    className="btn btn-danger me-2"
                                                    onClick={handleDelete}
                                                >
                                                    Delete
                                                </button>
                                           
                                            <button className="btn btn-light" type="button" onClick={() => {
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

export default LabTestEdit;
