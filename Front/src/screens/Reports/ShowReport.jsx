// ShowReport.jsx

import React from 'react';
import { useLocation } from 'react-router-dom';


const ShowReport = () => {
    const location = useLocation();
    const reports = location.state?.reports || []; // Get reports from the state, or default to empty array
    console.log(reports, "sdsd dsdf"); // Log to check if data is being received

    if (!reports.length) {
        return <p>No reports available</p>; // Handle case when there are no reports
    }

    // Calculate totals dynamically
    const calculateTotals = () => {
        const totalAmount = reports.reduce((acc, report) => acc + parseFloat(report.amount || 0), 0);
        const totalIncentiveAmount = reports.reduce((acc, report) => acc + parseFloat(report.incAmount || 0), 0);
        return { totalAmount, totalIncentiveAmount };
    };

    const { totalAmount, totalIncentiveAmount } = calculateTotals();

    return (
        <div>
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
                            <td>{report.receiveAmt || '0'}</td>
                            <td>{report.incAmount || 'No Data'}</td>
                            <td>{report.due || '0'}</td>
                            <td>{getReffByName(report.Reffby || 'No Data')}</td>
                            <td>{report.incAmount}</td>
                            <td>{report.Reffto || 'No Data'}</td>
                            <td>{getTestName(report.testid || 'No Data')}</td>
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
                        <th colSpan="1">Total</th>
                        <th>{totalAmount}</th>
                        <th>{totalIncentiveAmount}</th>
                        <th colSpan="2"></th>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default ShowReport;
