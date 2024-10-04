import React from 'react'
import { Link } from 'react-router-dom'

const SideNavbar = () => {
  return (
    <>
    <div className="row p-0 m-0 proBanner" id="proBanner">
       
      </div>
     <nav className="sidebar sidebar-offcanvas" id="sidebar" role="navigation">
          <ul className="nav">
            <li className="nav-item nav-profile">
              <a href="#" className="nav-link" onClick={(e) => e.preventDefault()}>
                <div className="nav-profile-image">
                  <span className="login-status online"></span>
                </div>
                <div className="nav-profile-text d-flex flex-column">
                  <span className="font-weight-bold mb-2">David Grey. H</span>
                  <span className="text-secondary text-small">Project Manager</span>
                </div>
                <i className="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
              </a>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/">
                <span className="menu-title">Dashboard</span>
                <i className="mdi mdi-home menu-icon"></i>
              </Link>
            </li>
           
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="collapse" href="#ui-basic" aria-expanded="false" aria-controls="ui-basic">
                <span className="menu-title">Transactions</span>
                <i className="menu-arrow"></i>
                <i className="mdi mdi-crosshairs-gps menu-icon"></i>
              </a>
              <div className="collapse" id="ui-basic">
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
                    <Link className="nav-link" to="/master/patient">Patient Registration</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/master/patientlist">Patient List</Link>
                  </li>
                </ul>
              </div>
            </li>

            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="collapse" href="#auth" aria-expanded="false" aria-controls="auth">
                <span className="menu-title">Common Master</span>
                <i className="menu-arrow"></i>
                <i className="mdi mdi-lock menu-icon"></i>
              </a>
              <div className="collapse" id="auth">
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
                    <Link className="nav-link" to="/master/state">State</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/master/religions">Religions</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/master/prefixname">Prefix Name</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/master/bankname">Bank Name</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/master/department">Department</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/master/category">Category</Link>
                  </li>
                </ul>
              </div>
            </li>

            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="collapse" href="#ward" aria-expanded="false" aria-controls="ward">
                <span className="menu-title">Ward/Bed</span>
                <i className="menu-arrow"></i>
                <i className="mdi mdi-lock menu-icon"></i>
              </a>
              <div className="collapse" id="ward">
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
                    <Link className="nav-link" to="/master/ward">Ward</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/master/bed">Bed</Link>
                  </li>
                </ul>
              </div>
            </li>

            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="collapse" href="#doctor" aria-expanded="false" aria-controls="doctor">
                <span className="menu-title">Doctor</span>
                <i className="menu-arrow"></i>
                <i className="mdi mdi-lock menu-icon"></i>
              </a>
              <div className="collapse" id="doctor">
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
                    <Link className="nav-link" to="/master/doctor">Doctor</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/master/doctorlist">List</Link>
                  </li>
                </ul>
              </div>
            </li>

            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="collapse" href="#patientsection" aria-expanded="false" aria-controls="patientsection">
                <span className="menu-title">Patient</span>
                <i className="menu-arrow"></i>
                <i className="mdi mdi-lock menu-icon"></i>
              </a>
              <div className="collapse" id="patientsection">
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
                    <Link className="nav-link" to="/master/pgender">Gender</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/master/ppatcomplaint">Pat. Complaint</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/master/preffby">Reff by</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/master/pdisease">Disease</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/master/pexamination">Examination</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/master/pdose">Dose Comment</Link>
                  </li>
                </ul>
              </div>
            </li>

          </ul>
        </nav>
    </>
  )
}
export default SideNavbar
