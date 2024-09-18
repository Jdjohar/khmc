import React, { useEffect, useState, usebank } from 'react'
import Topbar from '../../component/TopNavBar'
import SideNavbar from '../../component/SideNavbar'

const BankName = () => {

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    bankname: ''
  });
  const [banks, setBank] = useState([]);
  const [selectedBankId, setselectedBankId] = useState(null);

  // Fetch data from the API when the component is mounted
  useEffect(() => {
    const fetchbank = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/bank");
        const data = await response.json();
        

        setBank(data); // Set the response data in the bank
        setLoading(false); // Stop the loading bank
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Stop the loading even in case of error
      }
    };

    fetchbank(); // Call the function
  }, []); // Empty dependency array to run only once

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      // Update checkbox options
      if (checked) {
        setFormData((prevData) => ({
          ...prevData,
          checkboxOptions: [...prevData.checkboxOptions, value],
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          checkboxOptions: prevData.checkboxOptions.filter((option) => option !== value),
        }));
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  // Handle form submission (add new bank or update an existing bank)
  const handleSubmit = async (e) => {
    // e.preventDefault();

    if (selectedBankId) {

      console.log("selectedBankId:", selectedBankId);

      // If a bank is selected, update the bank
      try {
        const response = await fetch(`http://localhost:3001/api/bank/${selectedBankId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const updatedbank = await response.json();
          alert('Bank updated successfully!');

          // Update the bank in the bank array
          setBank((prevbank) =>
            prevbank.map((bank) =>
              bank.id === selectedBankId ? updatedbank : bank
            )
          );

          // Reset the form and the selected bank ID
          setFormData({
            bankname: '',
          });
          setselectedBankId(null);
        } else {
          alert('Failed to update bank');
        }
      } catch (error) {
        console.error('Error updating bank:', error);
      }
    } else {
      // If no bank is selected, add a new bank
      try {
        const response = await fetch('http://localhost:3001/api/bank', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const newbank = await response.json();
          alert('bank data submitted successfully!');
          console.log(newbank);

          // Update the bank array with the newly added bank
          setBank((prevbank) => [...prevbank, newbank]);

          // Clear the form
          setFormData({
            bankname: '',
          });
        } else {
          alert('Failed to submit bank data');
        }
      } catch (error) {
        console.error('Error submitting bank data:', error);
      }
    }
  };

  // Handle deleting a bank
  const handleDelete = async () => {
    if (selectedBankId) {
      try {
        const response = await fetch(`http://localhost:3001/api/bank/${selectedBankId}`, {
          method: 'DELETE', // Use DELETE for deleting the bank
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          alert('Bank deleted successfully!');

          // Remove the bank from the bank array
          setBank((prevbank) =>
            prevbank.filter((bank) => bank.id !== selectedBankId)
          );

          // Clear the form and reset selectedBankId
          setFormData({
            bankname: '',
          });
          setselectedBankId(null); // Reset the selected bank ID
        } else {
          alert('Failed to delete bank');
        }
      } catch (error) {
        console.error('Error deleting bank:', error);
      }
    }
  };


  // Handle click on the table row (populate form with the selected bank data)
  const handleRowClick = (bank) => {
    console.log("bank", bank);
    setFormData({
      bankname: bank.bankname,
    });
    setselectedBankId(bank._id); // Set the selected bank ID for editing
  };


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
                Bank Name
              </h3>
              <nav aria-label="breadcrumb">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item active" aria-current="page">
                    <span></span>Bank Name <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="row">
              <div className="col-4 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 class="card-title">Bank List</h4>
                    <table class="table">
                      <thead>
                        <tr>
                          <th>Bank Name</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {banks.map((bank) => (
                          <tr key={bank.id} onClick={() => handleRowClick(bank)} style={{ cursor: 'pointer' }}>
                            <td>{bank.bankname}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-8 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <form className="forms-sample" onSubmit={handleSubmit}>
                      <div className="form-group row">
                        <div className="col-6 mt-3">
                          <label htmlFor="bankname">Bank Name</label>
                          <input
                            type="text"
                            name='bankname'
                            value={formData['bankname']}
                            onChange={handleChange}
                            className="form-control"
                            id="bankname"
                            placeholder="Enter Bank Name" />
                        </div>

                      </div>
                      <button type="submit" className="btn btn-gradient-primary me-2">
                        {selectedBankId ? 'Update' : 'Submit'}
                      </button>
                      {selectedBankId && (
                        <button
                          type="button"
                          className="btn btn-danger me-2"
                          onClick={handleDelete}
                        >
                          Delete
                        </button>
                      )}
                      <button className="btn btn-light" type="button" onClick={() => {
                        setFormData({
                          bankname: '',
                        });
                        setselectedBankId(null);
                      }}>
                        Cancel
                      </button>
                    </form>
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

export default BankName