import React, { useState, useEffect } from 'react';
import Topbar from '../component/TopNavBar';
import Select from 'react-select';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const RefIncSummary = () => {
    const [reffByOptions, setReffByOptions] = useState([]);
    const [selectedReffBy, setSelectedReffBy] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reports, setReports] = useState([]);
    const [testNames, setTestNames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editedPaidAmount, setEditedPaidAmount] = useState({});

    // Fetch Reffby data for the dropdown
    useEffect(() => {
        const fetchData = async () => {
            try {
                const testNamesResponse = await fetch("https://khmc-xdlm.onrender.com/api/testName");
                const testNamesData = await testNamesResponse.json();
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
        fetchData();
    }, []);

    // Fetch report data
    const fetchReports = async () => {
        setLoading(true);
        try {
            const reffById = selectedReffBy?.value === 'all' ? '' : selectedReffBy?.value;
            const response = await fetch(`https://khmc-xdlm.onrender.com/api/incentiveReportDateFilter?startDate=${startDate}&endDate=${endDate}&reffById=${reffById}`);
            const data = await response.json();
            setReports(data);
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
        const ref = reffByOptions.find((ref) => ref.value === id);
        return ref ? ref.label : "Unknown Referrer";
    };

    // Handle updating the paid amount and status
    const handleUpdatePaidAmount = async (reportId, newPaidAmount, newIncStatus) => {
        const updatedReports = reports.map(report => {
            if (report._id === reportId) {
                return { ...report, paidAmount: newPaidAmount, incStatus: newIncStatus };
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
                body: JSON.stringify({ paidAmount: newPaidAmount, incStatus: newIncStatus })
            });
        } catch (error) {
            console.error("Error updating report:", error);
        }
    };

    const handleStatusChange = (reportId, selectedStatus) => {
        const updatedReports = reports.map(report => {
            if (report._id === reportId) {
                return { ...report, incStatus: selectedStatus === 'Paid' };
            }
            return report;
        });
        setReports(updatedReports);
    };

    const handleUpdateButtonClick = (report) => {
        const newPaidAmount = editedPaidAmount[report._id] || report.paidAmount;
        const newIncStatus = report.incStatus;
        if (newIncStatus) {
            handleUpdatePaidAmount(report._id, newPaidAmount, newIncStatus);
        } else {
            alert("Please select 'Paid' status before updating the incentive amount.");
        }
    };

    const handleUpdatePaidAmountChange = (reportId, value) => {
        setEditedPaidAmount({
            ...editedPaidAmount,
            [reportId]: value,
        });
    };

    // Calculate totals dynamically
    const calculateTotals = () => {
        // Ensure reports is an array before using reduce
        const reportArray = Array.isArray(reports) ? reports : [];
        
        const totalAmount = reportArray.reduce((acc, report) => acc + parseFloat(report.amount || 0), 0);
        const totalPaidAmount = reportArray.reduce((acc, report) => acc + parseFloat(report.paidAmount || 0), 0);
        
        return { totalAmount, totalPaidAmount };
    };

    const { totalAmount: calculatedTotalAmount, totalPaidAmount: calculatedTotalPaidAmount } = calculateTotals();

    // PDF Generation function
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("Referral Incentive Summary Report", 14, 10);
        doc.setFontSize(12);
        doc.text(`Date Range: ${startDate} - ${endDate}`, 14, 18);

        const tableRows = [];
        reports.forEach(report => {
            const rowData = [
                report.date,
                report.regno,
                report.patientName,
                report.amount,
                report.discount,
                report.receiveAmount || '0',
                report.paidAmount || 'No Data', // Changed to paidAmount
                report.due || '0',
                getReffByName(report.Reffby || 'No Data'),
                getTestName(report.testid || 'No Data')
            ];
            tableRows.push(rowData);
        });

        doc.autoTable({
            head: [['Date', 'Reg.No', 'Patient Name', 'Amount', 'Discount', 'Receive Amount', 'Paid Amount', 'Due', 'Ref.By', 'Test Name']],
            body: tableRows,
            startY: 25,
        });

        doc.autoTable({
            head: [['', '', 'Total Amount', calculatedTotalAmount, '', 'Total Paid Amount', calculatedTotalPaidAmount, '', '', '']],
            startY: doc.autoTable.previous.finalY + 10,
        });

        doc.save("Referral_Incentive_Summary_Report.pdf");
    };

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
                                                <button type="submit" className="btn btn-gradient-primary me-2">Search</button>
                                                <button
                                                    className="btn btn-gradient-info"
                                                    onClick={generatePDF}
                                                >
                                                    Export to PDF
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">Incentive Summary</h4>
                                        <div className="table-responsive">
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Reg.No</th>
                                                        <th>Patient Name</th>
                                                        <th>Amount</th>
                                                        <th>Discount</th>
                                                        <th>Receive Amount</th>
                                                        <th>Inc</th> {/* Changed to Paid Amount */}
                                                        {/* <th>Paid Amount</th> Changed to Paid Amount */}
                                                        <th>Due</th>
                                                        <th>Ref. By</th>
                                                        <th>Test Name</th>
                                                        <th>Inc Amount</th>
                                                        <th>Incentive Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {console.log(reports,"reports")}
                                                    
                                                    {reports.map(report => (
                                                        <tr key={report._id}>
                                                            <td>{report.date}</td>
                                                            <td>{report.regno}</td>
                                                            <td>{report.patientName}</td>
                                                            <td>{report.amount}</td>
                                                            <td>{report.discount}</td>
                                                            <td>{report.amount || '0'}</td>
                                                            <td>{report.incAmount || 'No Data'}
                                                                {
                                                                    (report.paidAmount === 0 || report.paidAmount === "" || !report.paidAmount) ? (
                                                                        '' // Show nothing if paidAmount is 0 or empty
                                                                    ) : (
                                                                        <span style={{ color: 'red' }}>
                                                                            -{report.paidAmount}
                                                                        </span>
                                                                    )
                                                                }

                                                            </td>

                                                            <td>{report.due || '0'}</td>
                                                            <td>{getReffByName(report.Reffby || 'No Data')}</td>
                                                            <td>{getTestName(report.testid || 'No Data')}</td>

                                                            {/* Paid Amount Input */}
                                                            <td>
                                                                <input
                                                                    type="number"
                                                                    value={editedPaidAmount[report._id] || report.paidAmount || ''}
                                                                    onChange={(e) => handleUpdatePaidAmountChange(report._id, e.target.value)}
                                                                />
                                                            </td>

                                                            {/* Select for Incentive Status */}
                                                            <td>
                                                                <select
                                                                    value={report.incStatus ? 'Paid' : 'Unpaid'}
                                                                    onChange={(e) => handleStatusChange(report._id, e.target.value)}
                                                                >
                                                                    <option value="Unpaid">Unpaid</option>
                                                                    <option value="Paid">Paid</option>
                                                                </select>
                                                            </td>

                                                            <td>
                                                                <button
                                                                    className="btn btn-gradient-primary"
                                                                    onClick={() => handleUpdateButtonClick(report)}
                                                                >
                                                                    Update
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
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
