import React from 'react'
import SideNavbar from '../component/SideNavbar'
import Topbar from '../component/TopNavBar'
import circle from "../../public/circle.svg"

const Dashboard = () => {
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
                </span> Dashboard
              </h3>
              <nav aria-label="breadcrumb">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item active" aria-current="page">
                    <span></span>Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="row">
              <div className="col-md-4 stretch-card grid-margin">
                <div className="card bg-gradient-danger card-img-holder text-white">
                  <div className="card-body">
                    <img src={circle} className="card-img-absolute" alt="circle-image" />
                    <h4 className="font-weight-normal mb-3">Today Appointment <i className="mdi mdi-bookmark-outline mdi-24px float-end"></i></h4>
                    <h2 className="mb-5">24</h2>
                    <h6 className="card-text"></h6>
                  </div>
                </div>
              </div>
              <div className="col-md-4 stretch-card grid-margin">
                <div className="card bg-gradient-info card-img-holder text-white">
                  <div className="card-body">
                    <img src={circle} className="card-img-absolute" alt="circle-image" />
                    <h4 className="font-weight-normal mb-3">Today Registration <i className="mdi mdi-bookmark-outline mdi-24px float-end"></i>
                    </h4>
                    <h2 className="mb-5">14</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-4 stretch-card grid-margin">
                <div className="card bg-gradient-success card-img-holder text-white">
                  <div className="card-body">
                    <img src={circle} className="card-img-absolute" alt="circle-image" />
                    <h4 className="font-weight-normal mb-3">Today Re-Visit <i className="mdi mdi-diamond mdi-24px float-end"></i>
                    </h4>
                    <h2 className="mb-5">10</h2>
                    
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

export default Dashboard