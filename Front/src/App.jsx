import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import Dashboard from './screens/Dashboard'
import PatientReg from './screens/PatientReg'
import PatientList from './screens/PatientList'
import PatientEdit from './screens/PatientEdit'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"; 
import {
  State,  
  Religions,  
  PrefixName,  
  Department,  
  Category,  
  BankName, 
  Ward, 
  Bed,
  DoctorList,
  Doctor,
  DoseComment,
  Examination,
  Disease,
  Reffby,
  PatComplaint,
  Gender

} from './screens/CommanMaster/index'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
    <Routes>
    <Route exact path='/' element={<Dashboard />}/>
    <Route exact path='/master/patient' element={<PatientReg />}/>
    <Route exact path='/master/patientlist' element={<PatientList />}/>
    <Route exact path='/master/patientEdit/:id' element={<PatientEdit />}/>
    <Route exact path='/master/state' element={<State />}/>
    <Route exact path='/master/religions' element={<Religions />}/>
    <Route exact path='/master/prefixname' element={<PrefixName />}/>
    <Route exact path='/master/department' element={<Department />}/>
    <Route exact path='/master/category' element={<Category />}/>
    <Route exact path='/master/bankname' element={<BankName />}/>
    <Route exact path='/master/ward' element={<Ward />}/>
    <Route exact path='/master/bed' element={<Bed />}/>
    <Route exact path='/master/doctorlist' element={<DoctorList />}/>
    <Route exact path='/master/doctor' element={<Doctor />}/>
    <Route exact path='/master/pdose' element={<DoseComment />}/>
    <Route exact path='/master/pexamination' element={<Examination />}/>
    <Route exact path='/master/pdisease' element={<Disease />}/>
    <Route exact path='/master/preffby' element={<Reffby />}/>
    <Route exact path='/master/ppatcomplaint' element={<PatComplaint />}/>
    <Route exact path='/master/pgender' element={<Gender />}/>
    </Routes>

    </Router>

    </>
  )
}

export default App
