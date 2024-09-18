import React from 'react';
import Topbar from '../../component/TopNavBar';
import SideNavbar from '../../component/SideNavbar';

const Disease = () => {
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
                  <i className="mdi mdi-virus"></i>
                </span>
                Disease
              </h3>
              <nav aria-label="breadcrumb">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item active" aria-current="page">
                    <span></span>Disease <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
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
                        
                        {/* Dose Comment EN */}
                        <div className="col-6 form-group">
                          <label htmlFor="doseCommentEn">Dose Comment EN</label>
                          <input type="text" className="form-control" id="doseCommentEn" placeholder="Enter Dose Comment in English" />
                        </div>

                        {/* Dose Comment Hindi */}
                        <div className="col-6 form-group">
                          <label htmlFor="doseCommentHindi">Dose Comment Hindi</label>
                          <input type="text" className="form-control" id="doseCommentHindi" placeholder="Enter Dose Comment in Hindi" />
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

export default Disease;
