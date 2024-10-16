import React, { useState, useEffect } from 'react';
import Topbar from '../component/TopNavBar';
import SideNavbar from '../component/SideNavbar';
import { useNavigate } from 'react-router-dom';

const Examination = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    examinationName: '',
    order: '',
    useIn: '',
    rate: '',
    gst: '',
    inclusiveTax: '',
    hsnCode: '',
    dataCount: '',
    lowerValue: '',
    higherValue: '',
    normalText: '',
    repeat: '',
    showData: '',
    for: '',
    unit: '',
    askAddValue: '',
    showAddedData: '',
    resultType: '',
    askAddValueType: '',
    checkboxOptions: [],

  });
  const [examinations, setExaminations] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Fetch data from the API when the component is mounted
  useEffect(() => {
    const fetchExaminations = async () => {
      try {
        const response = await fetch("https://khmc-xdlm.onrender.com/api/examination");
        const data = await response.json();
        console.log(data);
        setExaminations(data); // Set the response data in the State
        setLoading(false); // Stop the loading state
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Stop the loading even in case of error
      }
    };

    fetchExaminations(); // Call the function
  }, []); // Empty dependency array to run only once

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(name, "checked");
    if (type === 'checkbox') {


      // Update checkbox options
      if (checked) {
        setFormData((prevData) => ({
          ...prevData,
          checkboxOptions: [...prevData.checkboxOptions, value],
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          checkboxOptions: prevData.checkboxOptions.filter(
            (option) => option !== value
          ),
        }));
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle form submission (add new Examination or update an existing state)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedExamId) {
      // If an Examination is selected, update the state
      try {
        const response = await fetch(`https://khmc-xdlm.onrender.com/api/examination/${selectedExamId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const updatedExam = await response.json();
          alert('Examination updated successfully!');

          // Update the Examination in the states array
          setExaminations((prevStates) =>
            prevStates.map((exam) =>
              exam.id === selectedExamId ? updatedExam : exam
            )
          );

          // Reset the form and the selected Examination ID
          setFormData({
            examinationName: '',
            order: '',
            useIn: '',
            rate: '',
            gst: '',
            inclusiveTax: '',
            hsnCode: '',
            dataCount: '',
            lowerValue: '',
            higherValue: '',
            normalText: '',
            repeat: '',
            showData: '',
            for: '',
            unit: '',
            askAddValue: '',
            showAddedData: '',
            resultType: '',
            askAddValueType: '',
            checkboxOptions: [],
          });
          setSelectedExamId(null);
          window.location.reload();
        } else {
          const errorData = await response.json();
          alert(`Failed to submit Examination data: ${errorData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error updating state:', error);
      }
    } else {
      // If no Examination is selected, add a new state
      try {
        const response = await fetch('https://khmc-xdlm.onrender.com/api/examination', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const newExam = await response.json();
          alert('Examination data submitted successfully!');

          // Update the states array with the newly added state
          setExaminations((prevStates) => [...prevStates, newExam]);

          // Clear the form
          setFormData({
            examinationName: '',
            order: '',
            useIn: '',
            rate: '',
            gst: '',
            inclusiveTax: '',
            hsnCode: '',
            dataCount: '',
            lowerValue: '',
            higherValue: '',
            normalText: '',
            repeat: '',
            showData: '',
            for: '',
            unit: '',
            askAddValue: '',
            showAddedData: '',
            resultType: '',
            askAddValueType: '',
            checkboxOptions: [],
          });
          window.location.reload();
        } else {
          const errorData = await response.json();
          alert(`Failed to update Examination: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error submitting Examination data:', error);
      }
    }
  };

  // Handle deleting an examination
  const handleDelete = async () => {
    if (selectedExamId) {
      try {
        const response = await fetch(`https://khmc-xdlm.onrender.com/api/examination/${selectedExamId}`, {
          method: 'DELETE', // Use DELETE for deleting the examination
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          alert('Examination deleted successfully!');

          // Remove the Examination from the states array
          setExaminations((prevStates) =>
            prevStates.filter((exam) => exam.id !== selectedExamId)
          );

          // Clear the form and reset selectedExamId
          setFormData({
            examinationName: '',
            order: '',
            useIn: '',
            rate: '',
            gst: '',
            inclusiveTax: '',
            hsnCode: '',
            dataCount: '',
            lowerValue: '',
            higherValue: '',
            normalText: '',
            repeat: '',
            showData: '',
            for: '',
            unit: '',
            askAddValue: '',
            showAddedData: '',
            resultType: '',
            askAddValueType: '',
            checkboxOptions: [],
          });
          window.location.reload();
          setSelectedExamId(null); // Reset the selected Examination ID
        } else {
          alert('Failed to delete examination');
        }
      } catch (error) {
        console.error('Error deleting examination:', error);
      }
    }
  };

  // Handle click on the table row (populate form with the selected Examination data)
  const handleRowClick = (exam) => {
    console.log("exam", exam);
    setFormData({
      examinationName: exam.examinationName,
      order: exam.order,
      useIn: exam.useIn,
      rate: exam.rate,
      gst: exam.gst,
      inclusiveTax: exam.inclusiveTax,
      hsnCode: exam.hsnCode,
      dataCount: exam.dataCount,
      lowerValue: exam.lowerValue,
      higherValue: exam.higherValue,
      normalText: exam.normalText,
      repeat: exam.repeat,
      showData: exam.showData,
      for: exam.for,
      unit: exam.unit,
      askAddValue: exam.askAddValue,
      showAddedData: exam.showAddedData,
      resultType: exam.resultType,
      askAddValueType: exam.askAddValueType,
      checkboxOptions: exam.checkboxOptions || [],

    });
    setSelectedExamId(exam._id); // Set the selected Examination ID for editing
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
                  <i className="mdi mdi-clipboard-text"></i>
                </span>
                Examination
              </h3>
              <nav aria-label="breadcrumb">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item active" aria-current="page">
                    <span></span>Examination <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="row">
              <div className="col-4 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">

                    <table className="table">
                      <thead>
                        <tr>
                          <th>Examination Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {examinations.map((exam) => (
                          <tr key={exam.id} onClick={() => handleRowClick(exam)} style={{ cursor: 'pointer' }}>
                            <td>{exam.examinationName}</td>
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
                          <label htmlFor="examinationName">Examination Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="examinationName"
                            name='examinationName'
                            value={formData['examinationName']}
                            onChange={handleChange}
                            placeholder="Enter Examination Name" />
                        </div>
                        <div className="col-6 mt-3">
                          <label htmlFor="order">Order</label>
                          <input
                            type="text"
                            name='order'
                            value={formData['order']}
                            onChange={handleChange}
                            className="form-control"
                            id="order"
                            placeholder="0" />
                        </div>
                        <div className="col-6 mt-3">
                          <label htmlFor="useIn">Use In</label>
                          <select
                            className="form-control"
                            id="useIn"
                            name='useIn'
                            value={formData['useIn']}
                            onChange={handleChange}
                          >
                            <option value="">Select Use Type</option>
                            <option value="pathology">Pathology</option>
                            <option value="hospital">Hospital</option>
                          </select>
                        </div>
                        <div className="col-6 mt-3">
                          <label htmlFor="rate">Rate</label>
                          <input
                            type="number"
                            className="form-control"
                            id="rate"
                            name='rate'
                            value={formData['rate']}
                            onChange={handleChange}
                            placeholder="Rate" />
                        </div>
                        <div className="col-6 mt-3">
                          <label htmlFor="gst">GST (%)</label>
                          <input
                            type="number"
                            className="form-control"
                            id="gst"
                            name='gst'
                            value={formData['gst']}
                            onChange={handleChange}
                            placeholder="GST" />
                        </div>
                        <div className="col-6 mt-3">
                          <label htmlFor="inclusiveTax">Inclusive Tax</label>
                          <input
                            type="text"
                            className="form-control"
                            id="inclusiveTax"
                            name='inclusiveTax'
                            value={formData['inclusiveTax']}
                            onChange={handleChange}
                            placeholder="Inclusive Tax" />
                        </div>
                        <div className="col-6 mt-3">
                          <label htmlFor="hsnCode">HSN Code</label>
                          <input
                            type="text"
                            className="form-control"
                            id="hsnCode"
                            name='hsnCode'
                            value={formData['hsnCode']}
                            onChange={handleChange}
                            placeholder="HSN Code" />
                        </div>
                        <div className="col-6 mt-3">
                          <label htmlFor="dataCount">Data Count</label>
                          <input
                            type="number"
                            className="form-control"
                            id="dataCount"
                            name='dataCount'
                            value={formData['dataCount']}
                            onChange={handleChange}
                            placeholder="Data Count" />
                        </div>
                        <div className="col-6 mt-3">
                          <label htmlFor="lowerValue">Lower Value</label>
                          <input
                            type="number"
                            className="form-control"
                            id="lowerValue"
                            name='lowerValue'
                            value={formData['lowerValue']}
                            onChange={handleChange}
                            placeholder="Lower Value" />
                        </div>
                        <div className="col-6 mt-3">
                          <label htmlFor="higherValue">Higher Value</label>
                          <input
                            type="number"
                            className="form-control"
                            id="higherValue"
                            name='higherValue'
                            value={formData['higherValue']}
                            onChange={handleChange}
                            placeholder="Higher Value" />
                        </div>
                        <div className="col-6 mt-3">
                          <label htmlFor="normalText">Normal Text</label>
                          <input
                            type="text"
                            className="form-control"
                            id="normalText"
                            name='normalText'
                            value={formData['normalText']}
                            onChange={handleChange}
                            placeholder="Normal Text" />
                        </div>
                        <div className="col-6 mt-3">
                          <label htmlFor="repeat">Repeat</label>
                          {/* <input
                            type="text"
                            className="form-control"
                            id="repeat"
                            name='repeat'
                            value={formData['repeat']}
                            onChange={handleChange}
                            placeholder="Repeat" /> */}

                          <select className="form-control" onChange={handleChange} value={formData['repeat']} id="repeat">
                            <option value="No">- No -</option><option value="Hourly">Hourly</option><option value="Every 2 Hour">Every 2 Hour</option><option value="Every 3 Hour">Every 3 Hour</option><option value="Every 4 Hour">Every 4 Hour</option><option value="Every 6 Hour">Every 6 Hour</option><option value="Every 8 Hour">Every 8 Hour</option><option value="Every 12 Hour">Every 12 Hour</option><option value="Every Day">Every Day</option><option value="On 1 Day Gap">On 1 Day Gap</option><option value="On 2 Day Gap">On 2 Day Gap</option></select>
                        </div>
                        <div className="col-6 mt-3">
                          <label htmlFor="showData">Show Data</label>
                          <select className="form-control" id="showData"
                            name='showData'
                            value={formData['showData']}
                            onChange={handleChange}>
                            <option value="">Select Option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>

                          {/* <input
                            type="text"
                            className="form-control"
                            id="showData"
                            name='showData'
                            value={formData['showData']}
                            onChange={handleChange}
                            placeholder="Show Data" /> */}
                        </div>
                        <div className="col-6 mt-3">
                          <label htmlFor="for">For</label>
                          <select
                            className="form-control"
                            id="for"
                            name='for'
                            value={formData['for']}
                            onChange={handleChange}

                          ><option value="NA">-NA-</option><option value="1 Days">1 Days</option><option value="2 to 10">2 to 10</option><option value="15">15</option><option value="21">21</option><option value="31">31</option><option value="45">45</option><option value="60 Days / 2 Months">60 Days / 2 Months</option><option value="90 Days / 3 Months">90 Days / 3 Months</option><option value="120 Days / 4 Months">120 Days / 4 Months</option><option value="180 Days / 6 Months">180 Days / 6 Months</option><option value="270 Days / 9 Months">270 Days / 9 Months</option></select>
                          {/* <input
                            type="text"
                            className="form-control"
                            id="for"
                            name='for'
                            value={formData['for']}
                            onChange={handleChange}
                            placeholder="For" /> */}
                        </div>
                        <div className="col-6 mt-3">
                          <label htmlFor="unit">Unit</label>
                          <input
                            type="text"
                            className="form-control"
                            id="unit"
                            name='unit'
                            value={formData['unit']}
                            onChange={handleChange}
                            placeholder="Unit" />
                        </div>
                        <div className="col-6 mt-3">
                          <label htmlFor="askAddValue">Ask Add Value</label>

                          <select className="form-control"
                            id="askAddValue"
                            name='askAddValue'
                            value={formData['askAddValue']}
                            onChange={handleChange}>
                            <option value="">Select Option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                          {/* <input
                            type="text"
                            className="form-control"
                            id="askAddValue"
                            name='askAddValue'
                            value={formData['askAddValue']}
                            onChange={handleChange}
                            placeholder="Ask Add Value" /> */}
                        </div>
                        <div className="col-6 mt-3">
                          <label htmlFor="showAddedData">Show Added Data</label>
                          <select className="form-control"
                            id="showAddedData"
                            name='showAddedData'
                            value={formData['showAddedData']}
                            onChange={handleChange}
                          >
                            <option value="">Select Option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>

                          {/* <input
                            type="text"
                            className="form-control"
                            id="showAddedData"
                            name='showAddedData'
                            value={formData['showAddedData']}
                            onChange={handleChange}
                            placeholder="Show Added Data" /> */}
                        </div>
                        <div className="col-6 mt-3">
                          <label htmlFor="resultType">Result Type</label>
                          <select className="form-control"
                            id="resultType"
                            name='resultType'
                            value={formData['resultType']}
                            onChange={handleChange}
                          >
                            <option value="">Select Option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>

                          {/* <input
                            type="text"
                            className="form-control"
                            id="resultType"
                            name='resultType'
                            value={formData['resultType']}
                            onChange={handleChange}
                            placeholder="Result Type" /> */}
                        </div>
                        <div className="col-6 mt-3">
                          <label htmlFor="askAddValueType">Ask Add Value Type</label>
                          <select
                            className="form-control"
                            id="askAddValueType"
                            name='askAddValueType'
                            value={formData['askAddValueType']}
                            onChange={handleChange}

                          >
                            <option value="Text">Text</option><option value="Number">Number</option><option value="Float">Float</option><option value="Date">Date</option></select>

                          {/* <input
                            type="text"
                            className="form-control"
                            id="askAddValueType"
                            name='askAddValueType'
                            value={formData['askAddValueType']}
                            onChange={handleChange}
                            placeholder="Ask Add Value Type" /> */}
                        </div>
                        <div className="col-12 form-group">
                          <label>Additional Options</label>
                          <div className="form-check">
                            <input
                              name="checkboxOptions"
                              className="form-check-input"
                              type="checkbox"
                              value="warnIfAbnormal" // Set the value here
                              onChange={handleChange}
                              checked={formData.checkboxOptions.includes('warnIfAbnormal')}
                              id="warnIfAbnormal"
                            />
                            <label className="form-check-label" htmlFor="warnIfAbnormal">Warn if Abnormal</label>
                          </div>

                          <div className="form-check">
                            <input
                              name="checkboxOptions"
                              className="form-check-input"
                              type="checkbox"
                              value="alertToTakeAction" // Set the value here
                              onChange={handleChange}
                              checked={formData.checkboxOptions.includes('alertToTakeAction')}
                              id="alertToTakeAction"
                            />
                            <label className="form-check-label" htmlFor="alertToTakeAction">Alert to take action</label>
                          </div>

                          <div className="form-check">
                            <input
                              name="checkboxOptions"
                              className="form-check-input"
                              type="checkbox"
                              value="askInDialysis" // Set the value here
                              onChange={handleChange}
                              checked={formData.checkboxOptions.includes('askInDialysis')}
                              id="askInDialysis"
                            />
                            <label className="form-check-label" htmlFor="askInDialysis">Ask in Dialysis</label>
                          </div>

                          <div className="form-check">
                            <input
                              name="checkboxOptions"
                              className="form-check-input"
                              type="checkbox"
                              value="askInGyne" // Set the value here
                              onChange={handleChange}
                              checked={formData.checkboxOptions.includes('askInGyne')}
                              id="askInGyne"
                            />
                            <label className="form-check-label" htmlFor="askInGyne">Ask in Gyne</label>
                          </div>

                          <div className="form-check">
                            <input
                              name="checkboxOptions"
                              className="form-check-input"
                              type="checkbox"
                              value="height" // Set the value here
                              onChange={handleChange}
                              checked={formData.checkboxOptions.includes('height')}
                              id="height"
                            />
                            <label className="form-check-label" htmlFor="height">Height</label>
                          </div>

                          <div className="form-check">
                            <input
                              name="checkboxOptions"
                              className="form-check-input"
                              type="checkbox"
                              value="weight" // Set the value here
                              onChange={handleChange}
                              checked={formData.checkboxOptions.includes('weight')}
                              id="weight"
                            />
                            <label className="form-check-label" htmlFor="weight">Weight</label>
                          </div>

                          <div className="form-check">
                            <input
                              name="checkboxOptions"
                              className="form-check-input"
                              type="checkbox"
                              value="bmi" // Set the value here
                              onChange={handleChange}
                              checked={formData.checkboxOptions.includes('bmi')}
                              id="bmi"
                            />
                            <label className="form-check-label" htmlFor="bmi">BMI</label>
                          </div>

                          <div className="form-check">
                            <input
                              name="checkboxOptions"
                              className="form-check-input"
                              type="checkbox"
                              value="eye" // Set the value here
                              onChange={handleChange}
                              checked={formData.checkboxOptions.includes('eye')}
                              id="eye"
                            />
                            <label className="form-check-label" htmlFor="eye">EYE</label>
                          </div>
                        </div>



                      </div>



                      <button type="submit" className="btn btn-gradient-primary me-2">
                        {selectedExamId ? 'Update' : 'Submit'}
                      </button>
                      {selectedExamId && (
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
                          examinationName: '',
                          order: '',
                          useIn: '',
                          rate: '',
                          gst: '',
                          inclusiveTax: '',
                          hsnCode: '',
                          dataCount: '',
                          lowerValue: '',
                          higherValue: '',
                          normalText: '',
                          repeat: '',
                          showData: '',
                          for: '',
                          unit: '',
                          askAddValue: '',
                          showAddedData: '',
                          resultType: '',
                          askAddValueType: '',
                          checkboxOptions: []
                        });
                        setSelectedExamId(null);
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
  )
}

export default Examination;
