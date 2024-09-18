import React from 'react';
import Topbar from '../../component/TopNavBar';
import SideNavbar from '../../component/SideNavbar';

const Bed = () => {
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
                  <i className="mdi mdi-home"></i>
                </span>
                Bed
              </h3>
              <nav aria-label="breadcrumb">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item active" aria-current="page">
                    <span></span>Bed <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="row">
              <div className="col-4 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Bed List</h4>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Ward</th>
                          <th>Bed Name</th>
                          <th>Rate</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Ward 1</td>
                          <td>Bed 1</td>
                          <td>1000</td>
                          <td>Edit/Delete</td>
                        </tr>
                        <tr>
                          <td>Ward 2</td>
                          <td>Bed 2</td>
                          <td>1200</td>
                          <td>Edit/Delete</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="col-8 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <form className="forms-sample">
                      <div className="form-group row">
                        {/* Select Ward */}
                        <div className="col-6 mt-3">
                          <label htmlFor="selectward">Select Ward *</label>
                          <select className="form-control" id="selectward">
                            <option value="ward1">Ward 1</option>
                            <option value="ward2">Ward 2</option>
                          </select>
                        </div>

                        {/* Select Department */}
                        <div className="col-6 mt-3">
                          <label htmlFor="selectdepartment">Department</label>
                          <select className="form-control" id="selectdepartment">
                            <option value="department1">Department 1</option>
                            <option value="department2">Department 2</option>
                          </select>
                        </div>

                        {/* Bed Name */}
                        <div className="col-6 mt-3">
                          <label htmlFor="bedname">Bed Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="bedname"
                            placeholder="Enter Bed Name"
                          />
                        </div>

                        {/* Rate */}
                        <div className="col-6 mt-3">
                          <label htmlFor="rate">Rate</label>
                          <input
                            type="text"
                            className="form-control"
                            id="rate"
                            placeholder="Enter Rate"
                          />
                        </div>

                        {/* GST */}
                        <div className="col-6 mt-3">
                          <label htmlFor="gst">GST</label>
                          <input
                            type="number"
                            className="form-control"
                            id="gst"
                            placeholder="Enter GST"
                          />
                        </div>

                        {/* HSN Code */}
                        <div className="col-6 mt-3">
                          <label htmlFor="hsncode">HSN Code</label>
                          <input
                            type="text"
                            className="form-control"
                            id="hsncode"
                            placeholder="Enter HSN Code"
                          />
                        </div>

                        {/* Slot Start */}
                        <div className="col-6 mt-3">
                          <label htmlFor="slotstart">Slot Start</label>
                          <input
                            type="text"
                            className="form-control"
                            id="slotstart"
                            placeholder="Enter Slot Start"
                          />
                        </div>

                        {/* Slot Count */}
                        <div className="col-6 mt-3">
                          <label htmlFor="slotcount">Slot Count</label>
                          <input
                            type="text"
                            className="form-control"
                            id="slotcount"
                            placeholder="Enter Slot Count"
                          />
                        </div>

                        {/* Checkboxes */}
                        <div className="col-12 mt-3">
                          <label>Options</label>
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="inclusivetax"
                            />
                            <label className="form-check-label" htmlFor="inclusivetax">
                              Inclusive Tax
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="otroom"
                            />
                            <label className="form-check-label" htmlFor="otroom">
                              OT Room
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="default"
                            />
                            <label className="form-check-label" htmlFor="default">
                              Default
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="alwaysavailable"
                            />
                            <label className="form-check-label" htmlFor="alwaysavailable">
                              Always Available
                            </label>
                          </div>
                        </div>
                      </div>

                      <button type="submit" className="btn btn-gradient-primary me-2">
                        Submit
                      </button>
                      <button className="btn btn-light">Cancel</button>
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

export default Bed;
