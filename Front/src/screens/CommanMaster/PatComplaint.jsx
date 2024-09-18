import React from 'react';
import Topbar from '../../component/TopNavBar';
import SideNavbar from '../../component/SideNavbar';

const PatComplaint = () => {
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
                  <i className="mdi mdi-alert"></i>
                </span>
                Complaints
              </h3>
              <nav aria-label="breadcrumb">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item active" aria-current="page">
                    <span></span>Complaints <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
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
                        
                        {/* Complaints Name */}
                        <div className="col-6 form-group">
                          <label htmlFor="complaintsName">Complaints Name</label>
                          <input type="text" className="form-control" id="complaintsName" placeholder="Enter Complaints Name" />
                        </div>

                        {/* Order */}
                        <div className="col-6 form-group">
                          <label htmlFor="order">Order</label>
                          <input type="text" className="form-control" id="order" placeholder="Enter Order" />
                        </div>

                        {/* Group */}
                        <div className="col-6 form-group">
                          <label htmlFor="group">Group</label>
                          <select className="form-control" id="group">
                            <option value="ALL">ALL</option>
                          </select>
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

export default PatComplaint;
