import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Topbar from '../component/TopNavBar';
import SideNavbar from '../component/SideNavbar';
import { useNavigate, useParams } from 'react-router-dom';

const LablogsP = () => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({

    labReg: '',
    uhid: '',
    sno: '',
    labId: '',
    patientName: '',
    testType: 'Pathology',
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
    reffto: '',
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
  const { patientid } = useParams();
  const [labs, setLabs] = useState([]);
  const [tests, setTest] = useState([]);
  const [LabReg, setLabReg] = useState('');
  const [LabEntry, setLabentry] = useState([]);
  const [Gender, setGender] = useState([]);
  const [Reffby, setReffby] = useState([])
  const [sno, setSno] = useState('');
  const [selectedLabId, setSelectedLabId] = useState(null);
  const [selectedReffby, setSelectedReffby] = useState([]);
  const [selectedTestbyUser, setSelectedTestbyUser] = useState([]);
  const [incentiveTypeData, setIncentiveTypeData] = useState([]);

  const navigate = useNavigate();

  // Create `testOptions` by mapping over `test` state


  const testOptions = tests
    .filter(t => t.Department === "pathology") // Filter tests by department
    .map(t => ({
      value: t._id, // Use unique ID as value
      label: t.TestName // Use TestName as label
    }));

  // Helper to format date as YYYY-MM-DD (to compare only by day)
  const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };
  // Fetch lab logs from the API when the component is mounted
  useEffect(() => {

    const fetchPatientDetails = async () => {
      if (patientid) {
        console.log('Patient ID:', patientid);
        try {
          const response = await fetch(`https://khmc-xdlm.onrender.com/api/patients/${patientid}`);
          const data = await response.json();
          console.log(data, "Patient Data");


          // Update the form data with patient details
          setFormData((prevFormData) => ({
            ...prevFormData,  // Retain previous form data
            // Overwrite with fetched patient data
            patientName: data.patientName,
            uhid: data.uhid,
            address: data.address,
            city: data.city,
            mobile: data.mobile,
            email: data.email,
            agetype: data.agetype,
            age: data.age,
            aadharnumber: data.aadharnumber,
            careofstatus: data.gStatus,
            careofName: data.guardianName,
            category: data.gender,
            reffby: data.refBy,
            reffto: data.refTo || '-',
            tests: [], // Ensure 'tests' is set to an empty array (or based on your need)
          }));

          const fetchAutoDoctor = await fetch('https://khmc-xdlm.onrender.com/api/reffby');
          const reffdata = await fetchAutoDoctor.json();
          console.log(reffdata, "reffdata Data");
          // Find the selected doctor object based on the selected name
          const selectedReffbyObj = reffdata.find(doctor => doctor.doctorName === data.refBy);

          console.log(selectedReffbyObj, "selectedReffbyObj from USe Effect");

          if (selectedReffbyObj && selectedReffbyObj._id) {
            console.log(selectedReffbyObj, "sdsd sd Next");
            // Update the selectedReffby state with the selected doctor object
            setSelectedReffby(selectedReffbyObj || {});

            try {
              const response = await fetch(`https://khmc-xdlm.onrender.com/api/incentiveType/${selectedReffbyObj.incentiveType}`);
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              const data = await response.json();
              console.log(data, "data ====== from use effect");

              // Store the retrieved data in setIncentiveTypeData
              setIncentiveTypeData(data);
            } catch (error) {
              console.error('Error fetching incentive type data:', error);
            }
          }



          // If the selected doctor object exists, fetch the incentive type data

          setLoading(false); // Stop the loading state
        } catch (error) {
          console.error("Error fetching patient data:", error);
          setLoading(false); // Stop the loading in case of an error
        }
      } else {
        console.log('No Patient ID provided');
      }
    };

    const fetchData = async () => {
      try {
        // Fire all API requests simultaneously
        const [
          snoResponse,
          labResponse,
          testResponse,
          labRegResponse,
          labEntryResponse,
          genderResponse,
          reffbyResponse
        ] = await Promise.all([
          fetch("https://khmc-xdlm.onrender.com/api/labentrynumber"),
          fetch("https://khmc-xdlm.onrender.com/api/lab"),
          fetch("https://khmc-xdlm.onrender.com/api/testName"),
          fetch("https://khmc-xdlm.onrender.com/api/next-labreg"),
          fetch("https://khmc-xdlm.onrender.com/api/labentry"),
          fetch("https://khmc-xdlm.onrender.com/api/category"),
          fetch("https://khmc-xdlm.onrender.com/api/reffby"),
        ]);

        // Convert all responses to JSON
        const [
          snoData,
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

        // Update the form state and other states
        setSno(snoData.sno);
        setLabs(labData);
        setTest(testData);
        setLabReg(labRegData);

        const testEntries = labEntryData.filter(entry => entry.testType === "Pathology");
        setLabentry(testEntries);
        setGender(genderData);
        setReffby(reffbyData);
        console.log(reffbyData, "reffbyData");

        // Update form data with labReg while retaining the rest
        setFormData((prevFormData) => ({
          ...prevFormData,
          labReg: labRegData.nextLabReg,  // Update lab registration field
        }));

        console.log(labRegData, "Lab Registration Data");
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Stop loading if there is an error
      }
    };

    // Call the async functions
    fetchPatientDetails(); // Fetch patient details if patientid is available
    fetchData(); // Fetch other lab-related data

  }, [patientid]); // Add patientid as a dependency to re-fetch if it changes



  // Handle input changes for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleReffbyChange = async (e) => {
    const selectedReffbyName = e.target.value;
    console.log(Reffby, selectedReffbyName, "sdfd dsfdsfds");

    // Find the selected doctor object based on the selected name
    const selectedReffbyObj = Reffby.find(doctor => doctor.doctorName === selectedReffbyName);

    console.log(selectedReffbyObj, "selectedReffbyObj");

    // Update the form data
    setFormData(prevState => ({
      ...prevState,
      reffby: selectedReffbyName
    }));

    // Update the selectedReffby state with the selected doctor object
    setSelectedReffby(selectedReffbyObj || {});

    // If the selected doctor object exists, fetch the incentive type data
    if (selectedReffbyObj && selectedReffbyObj._id) {
      console.log(selectedReffbyObj, "sdsd sd Next");

      try {
        const response = await fetch(`https://khmc-xdlm.onrender.com/api/incentiveType/${selectedReffbyObj.incentiveType}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data, "data ======");

        // Store the retrieved data in setIncentiveTypeData
        setIncentiveTypeData(data);
      } catch (error) {
        console.error('Error fetching incentive type data:', error);
      }
    }
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

    console.log(incentiveTypeData, "from Test Select ");

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
    setSelectedTestbyUser(selectedTests)

  };

  // Handle changes in the select dropdown
  const createFilteredOutput = (selectedTestbyUser, formData, incentiveTypeData, selectedReffbyId) => {
    console.log("Creating Filtered Output");
    console.log("Selected Tests by User:", selectedTestbyUser);
    console.log("Form Data Inside createFilteredOutput:", formData);
    console.log("Incentive Type Data:", incentiveTypeData);
    console.log("Selected Reffby ID:", selectedReffbyId);

    // Ensure incentiveTypeData and typeTests exist
    if (!incentiveTypeData || !Array.isArray(incentiveTypeData.typeTests)) {
      console.error("incentiveTypeData or incentiveTypeData.typeTests is undefined or not an array");
      return [];  // Return an empty array if the data is missing
    }

    const today = new Date();
    const todayDateOnly = today.toISOString().split('T')[0];

    return selectedTestbyUser.map(testId => {
      // Find the matching test object in incentiveTypeData.typeTests
      const matchingTest = incentiveTypeData.typeTests.find(test => test.TestId === testId);

      if (matchingTest) {
        return {
          TesttypeId: incentiveTypeData._id,
          patientName: formData.patientName,
          date: todayDateOnly,
          regno: formData.labReg,
          // receiveAmt:formData.receivedAmount,
          // due:formData.dueamount,
          // discount: formData.discount,
          incStatus: false,
          Reffby: selectedReffbyId,
          Reffto: formData.reffto,
          testid: testId,
          amount: matchingTest.TestPrice,
          incAmount: matchingTest.TestIncentiveValue,
        };
      }

      // If no match is found, return null
      return null;
    }).filter(result => result !== null); // Remove any null entries
  };

  const handleButtonClick = () => {
    console.log("Button Clicked");
    console.log("Selected Tests by User:", selectedTestbyUser);
    console.log("Form Data:", formData);
    console.log("Incentive Type Data:", incentiveTypeData);
    console.log("Selected Reffby ID:", selectedReffby._id);


    const result = createFilteredOutput(selectedTestbyUser, formData, incentiveTypeData, selectedReffby._id);

    if (result && result.length) {
      result.forEach(entry => {
        console.log("Filtered Output Entry:", entry);
      });
    } else {
      console.log("No valid entries generated.");
    }
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
          const newLabEntry = await response.json(); // Get the new lab entry object containing _id
          alert('Lab log submitted successfully!');

          // Validate necessary data
          if (!selectedTestbyUser) {
            console.error("Missing required data: selectedTestbyUser");
          }
          if (!formData) {
            console.error("Missing required data: formData");
          }
          if (!incentiveTypeData) {
            console.error("Missing required data: incentiveTypeData");
          }
          if (!selectedReffby || !selectedReffby._id) {
            console.error("Missing required data: selectedReffby._id");
          }

          if (!selectedTestbyUser || !formData || !incentiveTypeData || !selectedReffby || !selectedReffby._id) {
            return;
          }

          // Run createFilteredOutput after successful lab log submission
          const filteredResults = createFilteredOutput(selectedTestbyUser, formData, incentiveTypeData, selectedReffby._id);

          if (filteredResults && filteredResults.length) {
            filteredResults.forEach(entry => {
              console.log("Filtered Output Entry:", entry);
            });
          } else {
            console.log("No valid entries generated.");
          }
          console.log(newLabEntry, "newLabEntry 2");

          // Submit each filtered entry to the incentiveReport API with the new lab entry's _id
          for (const entry of filteredResults) {
            try {
              const incentiveResponse = await fetch('https://khmc-xdlm.onrender.com/api/incentiveReport', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  ...entry,
                  labEntryId: newLabEntry.data._id || '-',  // Correctly attach the new lab entry's _id
                }),
              });

              if (!incentiveResponse.ok) {
                console.error(`Failed to submit incentive report for testId: ${entry.testid}`);
              }
            } catch (error) {
              console.error('Error submitting incentive report:', error);
            }
          }

          // Reset the form data after submission
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
            reffto: '',
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
          // window.location.reload();
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
                Lab Logs {patientid}
              </h3>
            </div>

            {console.log(selectedTestbyUser, "selectedTestbyUser 123")}
            {console.log(incentiveTypeData, "incentiveTypeData 123")}
            {console.log(selectedReffby, "selectedReffby 123")}

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
                            <td>{lab._id}</td>
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
                    <h2 className='pb-2'> Patient Entry Pathology </h2>

                    {/*<button onClick={handleButtonClick}>Click Me</button>*/}
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">Lab SNo. {sno || 'Sno no found'}

                      </div>
                      <div className="form-group row">

                        {console.log(formData, "formData Print Check")}
                        <div className="col-md-3 col-12">
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
                        <div className="col-md-3 col-12">
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

                        <div className="col-md-3 col-12">
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
                        <div className="col-md-3 col-12">
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
                        <div className="col-md-3 col-12">
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
                        <div className="col-md-3 col-12">
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
                        <div className="col-md-3 col-12">
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
                        <div className="col-md-3 col-12">
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
                        <div className="col-md-3 col-12">
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
                        <div className="col-md-3 col-12">
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



                        <div className="col-md-3 col-12">
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
                        <div className="col-md-3 col-12">
                          <label className="my-2">Referred By</label>
                          <select
                            value={formData.reffby}
                            onChange={handleReffbyChange}
                            name='reffby'
                            required
                            className='form-control'>
                            <option value=''>Select Reff</option>
                            {Reffby.map((item) => (
                              <option key={item._id} value={item.doctorName}>
                                {item.doctorName}
                              </option>
                            ))}

                          </select>

                        </div>
                        <div className="col-md-3 col-12">
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
                        <div className="col-md-3 col-12">
                          <label className="my-2">Payment Mode</label>
                          <select
                            value={formData.payment}
                            onChange={handleChange}
                            name='payment'
                            className="form-select" id="payment">
                            <option value=''>Select</option>
                            <option value='cash'>Cash</option>
                            <option value='bank'>Bank</option>
                            <option value='upi'>UPI</option>
                          </select>

                        </div>
                        <div className="col-md-3 col-12">
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
                        <div className="col-md-3 col-12">
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
                        <div className="col-md-3 col-12">
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
                        <div className="col-md-3 col-12">
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
                        <div className="col-md-3 col-12">
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
                        <div className="col-md-3 col-12">
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
                        <div className="col-md-3 col-12">
                          <label className="my-2">Sample Date</label>
                          <input
                            type="date"
                            name="sampledate"
                            value={formData.sampledate}
                            onChange={handleChange}
                            className="form-control"
                            required
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
                              reffto: '',
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

export default LablogsP;
