import React from 'react'
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
const Topbar = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark p-0 bg-primary">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/">
            KHMC
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#main_nav"
            aria-controls="main_nav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="main_nav">
            <ul className="navbar-nav">
              <li className="nav-item active">
                <Link className="nav-link text-white" to="/">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item dropdown" id="myDropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Master
                </Link>
                <ul className="dropdown-menu">

                  <li>
                    <Link className="dropdown-item" to="#">
                      Comman Master &raquo;
                    </Link>
                    <ul className="submenu dropdown-menu">
                      <li>
                        <Link className="dropdown-item" to="/master/state">
                          State
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/master/religions">
                          Religions
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/master/prefixname">
                          Prefix Name
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/master/bankname">
                          Bank Name
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/master/department">
                          Department
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/master/category">
                          Category
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/master/lab">
                          Lab
                        </Link>
                      </li>


                    </ul>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Ward/Bed &raquo;
                    </Link>
                    <ul className="submenu dropdown-menu">
                      <li>
                        <Link className="dropdown-item" to="/master/ward">
                          Ward
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/master/bed">
                          Bed
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Doctor &raquo;
                    </Link>
                    <ul className="submenu dropdown-menu">
                      <li>
                        <Link className="dropdown-item" to="/master/doctor">
                          Add Doctor
                        </Link>
                      </li>



                    </ul>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Patient &raquo;
                    </Link>
                    <ul className="submenu dropdown-menu">
                      <li>
                        <Link className="dropdown-item" to="/master/pgender">
                          Gender
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/master/ppatcomplaint">
                          Pat. Complaint
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/master/preffby">
                          Reffered By
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/master/pdisease">
                          Disease
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/master/pexamination">
                          Examination
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/master/pdose">
                          Dose Comment
                        </Link>
                      </li>


                    </ul>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Incentive &raquo;
                    </Link>
                    <ul className="submenu dropdown-menu">
                      <li>
                        <Link className="dropdown-item" to="/master/incentiveType">
                          Incentive Type
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/master/incentiveList">
                        Incentive List
                        </Link>
                      </li>
                     
                    </ul>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Investigation &raquo;
                    </Link>
                    <ul className="submenu dropdown-menu">
                      <li>
                        <Link className="dropdown-item" to="/master/testname">
                          New Test
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/master/testlist">
                          Test List
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/master/testCat">
                          Test Category
                        </Link>
                      </li>
                    </ul>
                  </li>
                 
                </ul>
              </li>
              <li className="nav-item dropdown" id="myDropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Transactions
                </Link>
                <ul className="dropdown-menu">
                  
                  <li>
                    <Link className="dropdown-item" to="#">
                    Patients &raquo;
                    </Link>
                    <ul className="submenu dropdown-menu">
                      <li>
                        <Link className="dropdown-item" to="/master/patient">
                        Patient Registration
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/master/patientlist">
                        Patient List
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Investigation &raquo;
                    </Link>
                    <ul className="submenu dropdown-menu">
                      <li>
                        <Link className="dropdown-item" to="/master/labLogsP">
                          Test Request (P)
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/master/labentry">
                          Test Request (R)
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/master/labloglistp">
                          Result Entry (P)
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/master/labloglist">
                          Result Entry (R)
                        </Link>
                      </li>
                    </ul>
                  </li>

                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Topbar;