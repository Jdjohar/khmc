import React from 'react';
import Topbar from '../../component/TopNavBar';
import SideNavbar from '../../component/SideNavbar';

const Examination = () => {
  return (
    <>
      <Topbar />
      <div className="container-fluid page-body-wrapper">
        <SideNavbar />
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
              <div className="col-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <form className="forms-sample">
                      <div className="row">
                        
                        {/* Examination Name */}
                        <div className="col-6 form-group">
                          <label htmlFor="examinationName">Examination Name</label>
                          <input type="text" className="form-control" id="examinationName" placeholder="Enter Examination Name" />
                        </div>

                        {/* Use In */}
                        <div className="col-6 form-group">
                          <label htmlFor="useIn">Use In</label>
                          <select className="form-control" id="useIn">
                            <option value="Both">Both</option>
                            <option value="Indoor Only">Indoor Only</option>
                            <option value="Outdoor Only">Outdoor Only</option>
                            <option value="Direct Patient">Direct Patient</option>
                          </select>
                        </div>

                        {/* Rate */}
                        <div className="col-6 form-group">
                          <label htmlFor="rate">Rate</label>
                          <input type="text" className="form-control" id="rate" placeholder="Enter Rate" />
                        </div>

                        {/* Order */}
                        <div className="col-6 form-group">
                          <label htmlFor="order">Order</label>
                          <input type="text" className="form-control" id="order" placeholder="Enter Order" />
                        </div>

                        {/* GST % */}
                        <div className="col-6 form-group">
                          <label htmlFor="gst">GST %</label>
                          <input type="text" className="form-control" id="gst" placeholder="Enter GST %" />
                        </div>

                        {/* Inclusive Tax */}
                        <div className="col-6 form-group">
                          <label htmlFor="inclusiveTax">Inclusive Tax</label>
                          <select className="form-control" id="inclusiveTax">
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>

                        {/* HSN Code */}
                        <div className="col-6 form-group">
                          <label htmlFor="hsnCode">HSN Code</label>
                          <input type="text" className="form-control" id="hsnCode" placeholder="Enter HSN Code" />
                        </div>

                        {/* Data Count */}
                        <div className="col-6 form-group">
                          <label htmlFor="dataCount">Data Count</label>
                          <input type="text" className="form-control" id="dataCount" placeholder="Enter Data Count" />
                        </div>

                        {/* Lower Value */}
                        <div className="col-6 form-group">
                          <label htmlFor="lowerValue">Lower Value</label>
                          <input type="text" className="form-control" id="lowerValue" placeholder="Enter Lower Value" />
                        </div>

                        {/* Higher Value */}
                        <div className="col-6 form-group">
                          <label htmlFor="higherValue">Higher Value</label>
                          <input type="text" className="form-control" id="higherValue" placeholder="Enter Higher Value" />
                        </div>

                        {/* Normal Text */}
                        <div className="col-6 form-group">
                          <label htmlFor="normalText">Normal Text</label>
                          <input type="text" className="form-control" id="normalText" placeholder="Enter Normal Text" />
                        </div>

                        {/* Repeat */}
                        <div className="col-6 form-group">
                          <label htmlFor="repeat">Repeat</label>
                          <select className="form-control" id="repeat">
                            <option value="No">- No -</option>
                            <option value="Hourly">Hourly</option>
                            <option value="Every 2 Hour">Every 2 Hour</option>
                            <option value="Every 3 Hour">Every 3 Hour</option>
                            <option value="Every 4 Hour">Every 4 Hour</option>
                            <option value="Every 6 Hour">Every 6 Hour</option>
                            <option value="Every 8 Hour">Every 8 Hour</option>
                            <option value="Every 12 Hour">Every 12 Hour</option>
                            <option value="Every Day">Every Day</option>
                            <option value="On 1 Day Gap">On 1 Day Gap</option>
                            <option value="On 2 Day Gap">On 2 Day Gap</option>
                          </select>
                        </div>

                        {/* Show Data */}
                        <div className="col-6 form-group">
                          <label htmlFor="showData">Show Data</label>
                          <select className="form-control" id="showData">
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>

                        {/* For */}
                        <div className="col-6 form-group">
                          <label htmlFor="for">For</label>
                          <select className="form-control" id="for">
                            <option value="NA">-NA-</option>
                            <option value="1 Days">1 Days</option>
                            <option value="2 to 10">2 to 10</option>
                            <option value="15">15</option>
                            <option value="21">21</option>
                            <option value="31">31</option>
                            <option value="45">45</option>
                            <option value="60 Days / 2 Months">60 Days / 2 Months</option>
                            <option value="90 Days / 3 Months">90 Days / 3 Months</option>
                            <option value="120 Days / 4 Months">120 Days / 4 Months</option>
                            <option value="180 Days / 6 Months">180 Days / 6 Months</option>
                            <option value="270 Days / 9 Months">270 Days / 9 Months</option>
                          </select>
                        </div>

                        {/* Unit */}
                        <div className="col-6 form-group">
                          <label htmlFor="unit">Unit</label>
                          <input type="text" className="form-control" id="unit" placeholder="Enter Unit" />
                        </div>

                        {/* Ask Add Value */}
                        <div className="col-6 form-group">
                          <label htmlFor="askAddValue">Ask Add Value</label>
                          <select className="form-control" id="askAddValue">
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>

                        {/* Show Added Data */}
                        <div className="col-6 form-group">
                          <label htmlFor="showAddedData">Show Added Data</label>
                          <select className="form-control" id="showAddedData">
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>

                        {/* Result Type */}
                        <div className="col-6 form-group">
                          <label htmlFor="resultType">Result Type</label>
                          <select className="form-control" id="resultType">
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>

                        {/* Ask Add Value Type */}
                        <div className="col-6 form-group">
                          <label htmlFor="askAddValueType">Ask Add Value Type</label>
                          <select className="form-control" id="askAddValueType">
                            <option value="Text">Text</option>
                            <option value="Number">Number</option>
                            <option value="Float">Float</option>
                            <option value="Date">Date</option>
                          </select>
                        </div>

                        {/* Checkbox Options */}
                        <div className="col-12 form-group">
                          <label>Additional Options</label>
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="warnIfAbnormal" />
                            <label className="form-check-label" htmlFor="warnIfAbnormal">Warn if Abnormal</label>
                          </div>
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="alertToTakeAction" />
                            <label className="form-check-label" htmlFor="alertToTakeAction">Alert to take action</label>
                          </div>
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="askInDialysis" />
                            <label className="form-check-label" htmlFor="askInDialysis">Ask in Dialysis</label>
                          </div>
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="askInGyne" />
                            <label className="form-check-label" htmlFor="askInGyne">Ask in Gyne</label>
                          </div>
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="height" />
                            <label className="form-check-label" htmlFor="height">Height</label>
                          </div>
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="weight" />
                            <label className="form-check-label" htmlFor="weight">Weight</label>
                          </div>
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="bmi" />
                            <label className="form-check-label" htmlFor="bmi">BMI</label>
                          </div>
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="eye" />
                            <label className="form-check-label" htmlFor="eye">EYE</label>
                          </div>
                        </div>

                      </div>

                      <button type="submit" className="btn btn-gradient-primary me-2">Submit</button>
                      <button type="reset" className="btn btn-light">Cancel</button>
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

export default Examination;
