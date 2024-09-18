import React from 'react';
import Topbar from '../../component/TopNavBar';
import SideNavbar from '../../component/SideNavbar';

const Ward = () => {
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
                Ward
              </h3>
              <nav aria-label="breadcrumb">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item active" aria-current="page">
                    <span></span>Ward <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="row">
              <div className="col-4 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Ward List</h4>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Ward Name</th>
                          <th>Floor Number</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Ward 1</td>
                          <td>1</td>
                          <td>Edit/Delete</td>
                        </tr>
                        <tr>
                          <td>Ward 2</td>
                          <td>2</td>
                          <td>Edit/Delete</td>
                        </tr>
                        <tr>
                          <td>Ward 3</td>
                          <td>3</td>
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
                        <div className="col-6 mt-3">
                          <label htmlFor="wardname">Ward Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="wardname"
                            placeholder="Enter Ward Name"
                          />
                        </div>

                        <div className="col-6 mt-3">
                          <label htmlFor="floornumber">Floor Number</label>
                          <input
                            type="text"
                            className="form-control"
                            id="floornumber"
                            placeholder="Enter Floor Number"
                          />
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

export default Ward;
