import React from 'react';
import Topbar from '../../component/TopNavBar';
import SideNavbar from '../../component/SideNavbar';

const Gender = () => {
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
                Category
              </h3>
              <nav aria-label="breadcrumb">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item active" aria-current="page">
                    <span></span>Category <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="row">
              <div className="col-4 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Category List</h4>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Category Name</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Sample Category 1</td>
                          <td>Edit/Delete</td>
                        </tr>
                        <tr>
                          <td>Sample Category 2</td>
                          <td>Edit/Delete</td>
                        </tr>
                        <tr>
                          <td>Sample Category 3</td>
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
                          <label htmlFor="categoryname">Category Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="categoryname"
                            placeholder="Enter Category Name"
                          />
                        </div>

                        <div className="col-6 mt-3">
                          <label htmlFor="agelessthan">Age Less than</label>
                          <input
                            type="text"
                            className="form-control"
                            id="agelessthan"
                            placeholder="Enter Age"
                          />
                        </div>

                        <div className="col-6 mt-3">
                          <label htmlFor="type">Type</label>
                          <input
                            type="text"
                            className="form-control"
                            id="type"
                            placeholder="Enter Type"
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

export default Gender;
