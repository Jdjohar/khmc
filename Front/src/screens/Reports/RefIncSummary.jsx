import React, { useState, useEffect } from 'react';
import Topbar from '../component/TopNavBar';
import Select from 'react-select';

const RefIncSummary = () => {
    const [reffByOptions, setReffByOptions] = useState([]);
    const [selectedReffBy, setSelectedReffBy] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reports, setReports] = useState([]);
    const [testNames, setTestNames] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch Reffby data for the dropdown
    useEffect(() => {

        const fetchData = async () => {
            try {
              

                const testNamesResponse = await fetch("https://khmc-xdlm.onrender.com/api/testName");
                const testNamesData = await testNamesResponse.json();

                // Set the data in states
             
                setTestNames(testNamesData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };
        const fetchReffByData = async () => {
            try {
                const response = await fetch("https://khmc-xdlm.onrender.com/api/reffby");
                const data = await response.json();
                const options = [
                    { value: 'all', label: 'All' }, // Adding "All" option
                    ...data.map(ref => ({
                        value: ref._id,
                        label: ref.doctorName || "Unknown Referrer"
                    })),
                ];
                setReffByOptions(options);
            } catch (error) {
                console.error("Error fetching Reffby data:", error);
            }
        };

        fetchReffByData();
        fetchData()
    }, []);

    // Fetch report data
    const fetchReports = async () => {
        setLoading(true);
        try {
            const reffById = selectedReffBy?.value === 'all' ? '' : selectedReffBy?.value;
            const response = await fetch(`https://khmc-xdlm.onrender.com/api/incentiveReport?startDate=${startDate}&endDate=${endDate}&reffById=${reffById}`);
            const data = await response.json();
            console.log(data);
            
            setReports(data); // Directly set data since you confirmed it has reports
        } catch (error) {
            console.error("Error fetching reports:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (startDate && endDate) {
            fetchReports();
        } else {
            alert("Please select both start and end dates");
        }
    };

    
    const getTestName = (id) => {
        const test = testNames.find((test) => test._id === id);
        return test ? test.TestName : "Unknown Test";
    };

    const getReffByName = (id) => {
        console.log(reffByOptions,id,"ds");
        
        const ref = reffByOptions.find((ref) => ref.value === id);
        return ref ? ref.label: "Unknown Referrer";
    };
    // Handle updating the incentive amount and status
    const handleUpdateIncentive = async (reportId, newIncAmount, newIncStatus) => {
        const updatedReports = reports.map(report => {
            if (report._id === reportId) {
                return { ...report, incAmount: newIncAmount, incStatus: newIncStatus };
            }
            return report;
        });
        setReports(updatedReports);

        try {
            await fetch(`https://khmc-xdlm.onrender.com/api/incentiveReport/${reportId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ incStatus: newIncStatus, incAmount: newIncAmount })
            });
        } catch (error) {
            console.error("Error updating report:", error);
        }
    };

    // Calculate totals dynamically
    const calculateTotals = () => {
        const totalAmount = reports.reduce((acc, report) => acc + parseFloat(report.amount || 0), 0);
        const totalIncentiveAmount = reports.reduce((acc, report) => acc + parseFloat(report.incAmount || 0), 0);
        return { totalAmount, totalIncentiveAmount };
    };

    const { totalAmount: calculatedTotalAmount, totalIncentiveAmount: calculatedTotalIncentiveAmount } = calculateTotals();

    return (
        <>
            <Topbar />
            <div className="container-fluid p-0 page-body-wrapper">
                <div className="main-panel">
                    <div className="content-wrapper">
                        <div className="page-header">
                            <h3 className="page-title">
                                <span className="page-title-icon bg-gradient-primary text-white me-2">
                                    <i className="mdi mdi-home"></i>
                                </span>
                                Referral Incentive Summary
                            </h3>
                        </div>

                        <div className="row">
                            <div className="col-12 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">Filter by Date and Referred By</h4>
                                        <form onSubmit={handleSubmit}>
                                            <div className="d-flex flex-wrap align-items-center mb-4 gap-3">
                                                <div className="form-group" style={{ flex: '1 1 auto' }}>
                                                    <label htmlFor="startDate">Start Date</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        id="startDate"
                                                        value={startDate}
                                                        onChange={(e) => setStartDate(e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <div className="form-group" style={{ flex: '1 1 auto' }}>
                                                    <label htmlFor="endDate">End Date</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        id="endDate"
                                                        value={endDate}
                                                        onChange={(e) => setEndDate(e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <div className="form-group" style={{ flex: '2 1 auto' }}>
                                                    <label htmlFor="reffBy">Referred By</label>
                                                    <Select
                                                        options={reffByOptions}
                                                        value={selectedReffBy}
                                                        onChange={(selectedOption) => setSelectedReffBy(selectedOption)}
                                                        placeholder="Select Referrer"
                                                        isClearable
                                                    />
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-start">
                                                <button type="submit" className="btn btn-gradient-primary me-2">Submit</button>
                                                <button
                                                    type="button"
                                                    className="btn btn-light"
                                                    onClick={() => {
                                                        setSelectedReffBy(null);
                                                        setStartDate('');
                                                        setEndDate('');
                                                        setReports([]); // Clear reports when canceled
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>

                                        {loading ? (
                                            <p>Loading reports...</p>
                                        ) : (
                                            <>
                                                <h4 className="mt-4">Report Summary</h4>
                                                <table className="table mt-3">
                                                    <thead>
                                                        <tr>
                                                            <th>Date</th>
                                                            <th>Reg.No</th>
                                                            <th>Patient Name</th>
                                                            <th>Amount</th>
                                                            <th>Discount</th>
                                                            <th>Receive Amount</th>
                                                            <th>Inc</th>
                                                            <th>Due</th>
                                                            <th>Ref.By</th>
                                                            <th>Inc.Amt</th>
                                                            <th>Doctor</th>
                                                            <th>Service/Test</th>
                                                            <th>Action</th>
                                                            <th>Update</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {reports.map(report => (
                                                            <tr key={report._id}>
                                                                <td>{report.date}</td>
                                                                <td>{report.regno}</td>
                                                                <td>{report.patientName}</td>
                                                                <td>{report.amount}</td>
                                                                <td>{report.discount}</td>
                                                                <td>{report.receiveAmount || '0'}</td>
                                                                <td>{report.incAmount || 'No Data'}</td>
                                                                <td>{report.due || '0'}</td>
                                                                <td>{getReffByName(report.Reffby || 'No Data')}</td>
                                                               
                                                                <td>
                                                                    <input
                                                                        type="number"
                                                                        value={report.incAmount}
                                                                        onChange={(e) => handleUpdateIncentive(report._id, e.target.value, report.incStatus)}
                                                                    />
                                                                </td>
                                                                <td>{report.Reffto || 'No Data'}</td>
                                                                <td>{getTestName(report.testid || 'No Data')}</td>
                                                                <td>
                                                                    <select
                                                                        value={report.incStatus ? 'Paid' : 'Unpaid'}
                                                                        onChange={(e) => handleUpdateIncentive(report._id, report.incAmount, e.target.value === 'Paid')}
                                                                    >
                                                                        <option value="Unpaid">Unpaid</option>
                                                                        <option value="Paid">Paid</option>
                                                                    </select>
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-gradient-primary"
                                                                        onClick={() => handleUpdateIncentive(report._id, report.incAmount, report.incStatus)}
                                                                    >
                                                                        Update
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <th></th>
                                                            <th></th>
                                                            <th>Total</th>
                                                            <th>{calculatedTotalAmount}</th>
                                                            <th></th>
                                                            <th>{calculatedTotalIncentiveAmount}</th>
                                                            <th colSpan="2"></th>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </>
                                        )}
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

export default RefIncSummary;
