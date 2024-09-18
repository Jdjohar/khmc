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
            <div class="row">
              <div class="col-md-4 stretch-card grid-margin">
                <div class="card bg-gradient-danger card-img-holder text-white">
                  <div class="card-body">
                    <img src={circle} class="card-img-absolute" alt="circle-image" />
                    <h4 class="font-weight-normal mb-3">Today Appointment <i class="mdi mdi-bookmark-outline mdi-24px float-end"></i></h4>
                    <h2 class="mb-5">24</h2>
                    <h6 class="card-text"></h6>
                  </div>
                </div>
              </div>
              <div class="col-md-4 stretch-card grid-margin">
                <div class="card bg-gradient-info card-img-holder text-white">
                  <div class="card-body">
                    <img src={circle} class="card-img-absolute" alt="circle-image" />
                    <h4 class="font-weight-normal mb-3">Today Registration <i class="mdi mdi-bookmark-outline mdi-24px float-end"></i>
                    </h4>
                    <h2 class="mb-5">14</h2>
                  </div>
                </div>
              </div>
              <div class="col-md-4 stretch-card grid-margin">
                <div class="card bg-gradient-success card-img-holder text-white">
                  <div class="card-body">
                    <img src={circle} class="card-img-absolute" alt="circle-image" />
                    <h4 class="font-weight-normal mb-3">Today Re-Visit <i class="mdi mdi-diamond mdi-24px float-end"></i>
                    </h4>
                    <h2 class="mb-5">10</h2>
                    
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