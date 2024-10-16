import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Topbar from '../component/TopNavBar';
import SideNavbar from '../component/SideNavbar';
import { useNavigate } from 'react-router-dom';

const labentrys = () => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    labReg: '',
    sno: '',
    labId: '',
    patientName: '',
    careofstatus: '',
    careofName: '',
    address: '',
    city: '',
    mobile: '',
    email: '',
    category: '',
    agetype: '',
    age: '',
    aadharnumber: '',
    reffby: '',
    remarks: '',
    payment: '',
    discountType: '',
    discount: '',
    totalamount: 0,
    recivedamount: '',
    dueamount: '',
    sampledate: '',
    tests: [],
  });
  const [labs, setLabs] = useState([]);
  const [tests, setTest] = useState([]);
  const [LabReg, setLabReg] = useState('');
  const [LabEntry, setLabentry] = useState([]);
  const [Gender, setGender] = useState([]);
  const [Reffby, setReffby] = useState([])
  const [sno, setSno] = useState('');
  const [selectedLabId, setSelectedLabId] = useState(null);

  const navigate = useNavigate();

  // Options for the react-select (available test options)
  // Create `testOptions` by mapping over `test` state
  const testOptions = tests.map(t => ({
    value: t._id, // Use unique ID as value
    label: t.TestName // Use TestName as label
  }));

  // Helper to format date as YYYY-MM-DD (to compare only by day)
  const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };
  // Fetch lab logs from the API when the component is mounted
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fire both API requests simultaneously
        const [snoResponse,
          labResponse,
          testResponse,
          labRegResponse,
          labEntryResponse,
          genderResponse,
          reffbyResponse] = await Promise.all([

            fetch("https://khmc-xdlm.onrender.com/api/labentrynumber"),
            fetch("https://khmc-xdlm.onrender.com/api/lab"),
            fetch("https://khmc-xdlm.onrender.com/api/testName"),
            fetch("https://khmc-xdlm.onrender.com/api/next-labreg"),
            fetch("https://khmc-xdlm.onrender.com/api/labentry"),
            fetch("https://khmc-xdlm.onrender.com/api/category"),
            fetch("https://khmc-xdlm.onrender.com/api/reffby"),
          ]);

        // Wait for both responses to be converted to JSON
        const [snoData,
          labData,
          testData,
          labRegData,
          labEntryData,
          genderData,
          reffbyData
        ] = await Promise.all([

          snoResponse.json(),
          labResponse.json(),
          testResponse.json(),
          labRegResponse.json(),
          labEntryResponse.json(),
          genderResponse.json(),
          reffbyResponse.json(),
        ]);

        // Set state based on the data
        setSno(snoData.sno);
        setLabs(labData);
        setTest(testData)
        setLabReg(labRegData)
        setLabentry(labEntryData)
        setFormData({
          ...formData,
          labReg: labRegData.nextLabReg
        })
        setGender(genderData)
        setReffby(reffbyData)
        console.log(labRegData, "dsdsfds");


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
  // Handle input changes for form fields
  const handleChangeReceived = (e) => {
    const { name, value } = e.target;
    console.log(typeof name, "sdds");
    const totalAmount = formData.totalamount
    const receivedAmount = value
    const setDueAmount = totalAmount - parseInt(receivedAmount)

    setFormData({
      ...formData,
      dueamount: setDueAmount,
      [name]: value,
    });
  };


  // Handle changes in the select dropdown
  const handleTestChange = (selectedOptions) => {
    // Map selected options to only include their `value` (which is _id)
    const selectedTests = selectedOptions ? selectedOptions.map(option => option.value) : [];

    
    // Calculate the total amount based on the selected test rates
    const totalAmount = selectedTests.reduce((sum, selectedTestId) => {
      const selectedTest = tests.find(t => t._id === selectedTestId);

      
      return sum + (selectedTest ? selectedTest.Rate : 0); // Add the test rate to the total
    }, 0);

    // Update the form data state with the selected test IDs and the total amount
    setFormData(prevFormData => ({
      ...prevFormData,
      tests: selectedTests,
      totalamount: totalAmount // Set the total amount of the selected tests
    }));


    
  };
  

  // Handle form submission (add or update lab)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedLabId) {
      // Update lab log
      try {
        const response = await fetch(`https://khmc-xdlm.onrender.com/api/labentry/${selectedLabId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert('Lab log updated successfully!');
          setSelectedLabId(null);
          window.location.reload();
        } else {
          alert('Failed to update lab log');
        }
      } catch (error) {
        console.error('Error updating lab log:', error);
      }
    } else {
      // Add new lab log
      console.log(labs[0]._id, "labs==========");

      try {
        const response = await fetch('https://khmc-xdlm.onrender.com/api/labentry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData, // Send the formData without _id
            sno: sno,
            labId: labs[0]._id,
            labReg: LabReg.nextLabReg,
          }),

        });

        if (response.ok) {
          alert(sno, 'Lab log submitted successfully!');
          setFormData({
            sno: '',
            labId: '',
            labReg: '',
            patientName: '',
            careofstatus: '',
            careofName: '',
            address: '',
            city: '',
            mobile: '',
            email: '',
            category: '',
            agetype: '',
            age: '',
            aadharnumber: '',
            reffby: '',
            remarks: '',
            payment: '',
            discountType: '',
            discount: '',
            totalamount: '',
            recivedamount: '',
            dueamount: '',
            sampledate: '',
            tests: [],
          });
          window.location.reload();
        } else {
          alert('Failed to submit lab log');
        }
      } catch (error) {
        console.error('Error submitting lab log:', error);
      }
    }
  };

  // Handle deleting a lab log
  const handleDelete = async () => {
    if (selectedLabId) {
      try {
        const response = await fetch(`https://khmc-xdlm.onrender.com/api/labentry/${selectedLabId}`, {
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

  // Handle row click to populate form with selected lab log data
  const handleRowClick = (lab) => {
    setFormData({
      labReg: lab.labReg,
      patientName: lab.patientName,
      careofstatus: lab.careofstatus,
      careofName: lab.careofName,
      address: lab.address,
      city: lab.city,
      mobile: lab.mobile,
      email: lab.email,
      category: lab.category,
      agetype: lab.agetype,
      age: lab.age,
      aadharnumber: lab.aadharnumber,
      reffby: lab.reffby,
      remarks: lab.remarks,
      payment: lab.payment,
      discountType: lab.discountType,
      discount: lab.discount,
      totalamount: lab.totalamount,
      recivedamount: lab.recivedamount,
      dueamount: lab.dueamount,
      sampledate: lab.sampledate,
      tests: lab.tests || [],
    });
    setSelectedLabId(lab._id);
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
                Lab Logs
              </h3>
            </div>

            <div className="row">
              <div className="col-4">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Lab Logs</h4>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Lab Reg</th>
                          <th>Patient Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {console.log(LabEntry, "labs")
                        }
                        {LabEntry.map((lab) => (
                          <tr key={lab._id} onClick={() => handleRowClick(lab)} style={{ cursor: 'pointer' }}>
                            <td>{lab.labReg}</td>
                            <td>{lab.patientName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-8">
                <div className="card">
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">


                        Lab SNo. {sno || 'Sno no found'}

                      </div>
                      <div className="form-group row">


                        <div className="col-md-6 col-12">
                          <label className="my-2">Lab Reg No.</label>
                          <div className="input-group">
                            <div className="input-group-prepend"></div>
                            <input
                              type="text"
                              name="uhidprefix"
                              disabled
                              value="KHMC/"
                              onChange={handleChange}
                              className="form-control"
                            />

                            <input
                              type="text"
                              name="labReg"
                              value={formData.labReg}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Enter Lab Reg"
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-12">
                          <label className="my-2">Patient Name</label>
                          <input
                            type="text"
                            name="patientName"
                            value={formData.patientName}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter Patient Name"
                          />
                        </div>

                        <div className="col-md-6 col-12">
                          <label className="my-2">Care Of Status</label>
                          <select
                            className='form-control'
                            name="careofstatus"
                            value={formData.careofstatus}
                            onChange={handleChange}
                          >
                            <option value=''>Select</option>
                            <option value='self'>Self</option>
                            <option value='C/O'>C/O</option>
                            <option value='D/O'>D/O </option>
                            <option value='S/O'>S/O </option>
                            <option value='W/O'>W/O </option>
                            <option value='H/O'>H/O </option>
                          </select>
                          {/* <input
                            type="text"
                            name="careofstatus"
                            value={formData.careofstatus}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter Care Of Status"
                          /> */}
                        </div>
                        <div className="col-md-6 col-12">
                          <label className="my-2">Care Of Name</label>
                          <input
                            type="text"
                            name="careofName"
                            value={formData.careofName}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter Care Of Name"
                          />
                        </div>
                        <div className="col-md-6 col-12">
                          <label className="my-2">Address</label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter Address"
                          />
                        </div>
                        <div className="col-md-6 col-12">
                          <label className="my-2">City</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter City"
                          />
                        </div>
                        <div className="col-md-6 col-12">
                          <label className="my-2">Mobile</label>
                          <input
                            type="text"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter Mobile"
                          />
                        </div>
                        <div className="col-md-6 col-12">
                          <label className="my-2">Email</label>
                          <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter Email"
                          />
                        </div>
                        <div className="col-md-6 col-12">
                          <label className="my-2">Category</label>
                          <select
                            value={formData.category}
                            onChange={handleChange}
                            name="category"
                            className='form-control'
                          >
                            <option value=''>Select Gender</option>
                            {/* Dynamically create option elements from Gender array */}
                            {Gender.map((item) => (
                              <option key={item._id} value={item.type}>
                                {item.categoryname}
                              </option>
                            ))}
                          </select>

                        </div>
                        <div className="col-md-6 col-12">
                          <label className="my-2">Age</label>
                          <div className="input-group">
                            <div className="input-group-prepend"></div>
                            <select
                              name="agetype"
                              className='form-control'
                              value={formData.agetype}
                              onChange={handleChange}
                            >
                              <option value=''>Select</option>
                              <option value='year'>Year</option>
                              <option value='month'>Month</option>
                              <option value='day'>Day </option>
                            </select>


                            <input
                              type="text"
                              name="age"
                              value={formData.age}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Enter Age"
                            />
                          </div>
                        </div>



                        <div className="col-md-6 col-12">
                          <label className="my-2">Aadhar Number</label>
                          <input
                            type="text"
                            name="aadharnumber"
                            value={formData.aadharnumber}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter Aadhar Number"
                          />
                        </div>
                        <div className="col-md-6 col-12">
                          <label className="my-2">Referred By</label>
                          <select
                            value={formData.reffby}
                            onChange={handleChange}
                            name='refBy'
                            className='form-control'>
                            <option value=''>Select Reff</option>
                            {Reffby.map((item) => (
                              <option key={item._id} value={item.doctorName}>
                                {item.doctorName}
                              </option>
                            ))}

                          </select>

                        </div>
                        <div className="col-md-6 col-12">
                          <label className="my-2">Remarks</label>
                          <input
                            type="text"
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter Remarks"
                          />
                        </div>
                        <div className="col-md-6 col-12">
                          <label className="my-2">Payment</label>
                          <input
                            type="text"
                            name="payment"
                            value={formData.payment}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter Payment"
                          />
                        </div>
                        <div className="col-md-6 col-12">
                          <label className="my-2">Discount Type</label>
                          <select
                            value={formData.discountType}
                            onChange={handleChange}
                            name='discountType'
                            className="form-select" id="status">
                            <option value=''>Select</option>
                            <option value='Self'>Self</option>
                            <option value='Ref'>Ref</option>
                          </select>

                        </div>
                        <div className="col-md-6 col-12">
                          <label className="my-2">Discount</label>
                          <input
                            type="text"
                            name="discount"
                            value={formData.discount}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter Discount"
                          />
                        </div>
                        <div className="col-md-6 col-12">
                          <label className="my-2">Tests</label>
                          <Select
                            isMulti
                            name="tests"
                            value={testOptions.filter(option => formData.tests.includes(option.value))} // Keep selected values
                            onChange={handleTestChange} // Handle change
                            options={testOptions} // Provide options from `test`
                            className="basic-multi-select"
                            classNamePrefix="select"
                          />

                        </div>
                        <div className="col-md-6 col-12">
                          <label className="my-2">Total Amount</label>
                          <input
                            type="text"
                            name="totalamount"
                            value={formData.totalamount}
                            onChange={handleChange}
                            disabled
                            className="form-control"
                            placeholder="Enter Total Amount"
                          />
                        </div>
                        <div className="col-md-6 col-12">
                          <label className="my-2">Received Amount</label>
                          <input
                            type="text"
                            name="recivedamount"
                            value={formData.recivedamount}
                            onChange={handleChangeReceived}
                            className="form-control"
                            placeholder="Enter Received Amount"
                          />
                        </div>
                        <div className="col-md-6 col-12">
                          <label className="my-2">Due Amount</label>
                          <input
                            type="text"
                            name="dueamount"
                            value={formData.dueamount}
                            onChange={handleChange}
                            disabled
                            className="form-control"
                            placeholder="Enter Due Amount"
                          />
                        </div>
                        <div className="col-md-6 col-12">
                          <label className="my-2">Sample Date</label>
                          <input
                            type="date"
                            name="sampledate"
                            value={formData.sampledate}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>

                        <hr className='my-5' />

                        <div className='accountDetails'>


                          <div className='row'>
                            <div className='d-flex justify-content-between align-items-center col-md-6 ms-auto'>
                              <p><strong>Total Amount:</strong></p>
                              <p>{formData.totalamount}</p>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='d-flex justify-content-between align-items-center col-md-6 ms-auto'>
                              <p><strong>Recived Amount:</strong></p>
                              <p>{formData.recivedamount || 0}</p>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='d-flex justify-content-between align-items-center col-md-6 ms-auto'>
                              <p><strong>Due Amount:</strong></p>
                              <p>{formData.dueamount || 0}</p>
                            </div>
                          </div>

                        </div>



                        <button type="submit" className="btn mt-4 btn-primary me-2">
                          {selectedLabId ? 'Update' : 'Submit'}
                        </button>
                        {selectedLabId && (
                          <button
                            type="button"
                            className="btn btn-danger me-2"
                            onClick={handleDelete}
                          >
                            Delete
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-light"
                          onClick={() => {
                            setFormData({
                              labReg: '',
                              patientName: '',
                              careofstatus: '',
                              careofName: '',
                              address: '',
                              city: '',
                              mobile: '',
                              email: '',
                              category: '',
                              agetype: '',
                              age: '',
                              aadharnumber: '',
                              reffby: '',
                              remarks: '',
                              payment: '',
                              discountType: '',
                              discount: '',
                              totalamount: '',
                              recivedamount: '',
                              dueamount: '',
                              sampledate: '',
                              tests: [],
                            });
                            setSelectedLabId(null);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
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

export default labentrys;
