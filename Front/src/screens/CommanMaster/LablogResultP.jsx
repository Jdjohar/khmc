import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Topbar from '../component/TopNavBar';
import jsPDF from 'jspdf';
import JsBarcode from 'jsbarcode';

const LablogResultP = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the ID from the URL

    const [testDetail, setTestDetail] = useState([]);
    const [PatienttestDetail, setPatientTestDetail] = useState([]);
    const [labTests, setLabTests] = useState([]); // To store test IDs from lab entry
    const [loading, setLoading] = useState(true); // For loading state
    const [error, setError] = useState(null); // For error state
    const [updatedResults, setUpdatedResults] = useState({}); // To store updated results for each test
    const [prescriptionPdfUrl, setPrescriptionPdfUrl] = useState('');

    // Fetch lab entry and then fetch the test details
    useEffect(() => {
        const fetchResultEntryP = async () => {
            try {
                console.log("Fetching test result data...");
                const testEntryResponse = await fetch(`https://khmc-xdlm.onrender.com/api/testResultP/${id}`);

                if (!testEntryResponse.ok) {
                    console.error("Failed to fetch test result data, status:", testEntryResponse.status);
                    setError("Error fetching test result data.");
                    setLoading(false);
                    return;
                }

                const TestEntryData = await testEntryResponse.json();
                console.log("TestEntryData received:", TestEntryData);

                // Check if result data exists
                if (TestEntryData && TestEntryData.length > 0 && TestEntryData[0].result) {
                    console.log(TestEntryData, "Test result data found, setting test details.");
                    setTestDetail(TestEntryData[0].result);
                    setPrescriptionPdfUrl(TestEntryData[0].documents[0].url);

                    setLoading(false);
                } else {
                    console.log("No test result data found, fetching lab entry details.");
                    fetchLabEntriesAndTestDetails(); // Fetch lab entries if no test result data is found
                }
            } catch (error) {
                console.error("Error fetching test result data:", error);
                setError("Failed to fetch test result data.");
                setLoading(false);
            }
        };

        const fetchLabEntriesAndTestDetails = async () => {
            try {
                console.log("Fetching lab entry details...");
                const labEntryResponse = await fetch(`https://khmc-xdlm.onrender.com/api/labentry/${id}`);

                if (!labEntryResponse.ok) {
                    console.error("Failed to fetch lab entry details, status:", labEntryResponse.status);
                    setError("Error fetching lab entry details.");
                    setLoading(false);
                    return;
                }

                const labEntryData = await labEntryResponse.json();
                console.log("Lab entry data received:", labEntryData);
                setPatientTestDetail(labEntryData);

                const testIds = labEntryData.tests;
                setLabTests(testIds);

                // Fetch test names and details
                console.log("Fetching test names and details...");
                const testDetailsResponse = await fetch(`https://khmc-xdlm.onrender.com/api/testName`);

                if (!testDetailsResponse.ok) {
                    console.error("Failed to fetch test names, status:", testDetailsResponse.status);
                    setError("Error fetching test names.");
                    setLoading(false);
                    return;
                }

                const testDetailsData = await testDetailsResponse.json();
                console.log("Test names and details received:", testDetailsData);

                const filteredTestDetails = testDetailsData.filter(test => testIds.includes(test._id));
                setTestDetail(filteredTestDetails);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching lab entry or test details:", error);
                setError("Failed to fetch lab entry or test details.");
                setLoading(false);
            }
        };

        fetchResultEntryP(); // Initiate the fetch process

    }, [id]);



    // Handle input change for test results
    const handleInputChange = (testId, detailId, newValue) => {
        setUpdatedResults((prevState) => ({
            ...prevState,
            [testId]: {
                ...(prevState[testId] || {}),
                [detailId]: newValue
            }
        }));
    };

    const isValueOutOfRange = (value, normalRange) => {
        if (value === "" || normalRange.start === undefined || normalRange.end === undefined) return false; // Ensure safe comparison
        const numericValue = parseFloat(value);
        return numericValue < normalRange.start || numericValue > normalRange.end;
    };


    const uploadPdfToCloudinary = async (pdfBlob, fileName) => {
        const formData = new FormData();
        formData.append('file', pdfBlob, fileName); // PDF as Blob
        formData.append('upload_preset', 'employeeApp'); // Add your unsigned Cloudinary upload preset

        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/dxwge5g8f/auto/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload PDF');
            }

            const data = await response.json();
            return data.secure_url; // URL of uploaded PDF
        } catch (error) {
            console.error('Error uploading PDF to Cloudinary:', error);
            throw error;
        }
    };

    const generatePrescriptionPdf = (value) => {
        const doc = new jsPDF();

        // Add 60px space from the top
        const topMargin = 60;
        const bottomMargin = 20; // Bottom margin to leave space at the bottom
        const pageHeight = doc.internal.pageSize.height;
        const maxY = pageHeight - bottomMargin; // Maximum Y position to keep content within bounds
        const textWidth = doc.internal.pageSize.width - 20; // Maximum text width
        const lineHeight = 4; // Reduced line height for closer spacing

        // Set font size to 10
        doc.setFontSize(10);

        // Left side (Patient Details)
        const leftStart = 10; // Starting X point for left text
        const labelWidth = 40; // Define a constant width for the labels
        let currentY = topMargin;

        // Labels and values for left side
        doc.text('Patient Name:', leftStart, currentY);
        doc.text(`${value.patientName}`, leftStart + labelWidth, currentY); // Value aligned
        currentY += lineHeight;

        doc.text('Age/Gender:', leftStart, currentY);
        doc.text(`${value.age}/${value.category}`, leftStart + labelWidth, currentY); // Value aligned
        currentY += lineHeight;

        doc.text('Consultant Dr:', leftStart, currentY);
        doc.text(`${value.reffby || 'no'}`, leftStart + labelWidth, currentY); // Value aligned
        currentY += lineHeight;

        doc.text('Transaction Id:', leftStart, currentY);
        doc.text(`${value.labReg}`, leftStart + labelWidth, currentY); // Value aligned
        currentY += 10; // Extra space before the right side

        // Right side (OPD Details)
        const rightStart = 120; // Starting X point for right text
        currentY = topMargin; // Reset Y position for the right side

        // Labels and values for right side
        doc.text('Collection Date:', rightStart, currentY);
        doc.text(`${value.sampledate}`, rightStart + labelWidth, currentY); // Value aligned
        currentY += lineHeight;

        doc.text('Reporting Date:', rightStart, currentY);
        doc.text(`${value.reportDate || 'No'}`, rightStart + labelWidth, currentY); // Value aligned
        currentY += lineHeight;

        doc.text('Contact No:', rightStart, currentY);
        doc.text(`${value.mobile}`, rightStart + labelWidth, currentY); // Value aligned
        currentY += lineHeight;

        doc.text('S No:', rightStart, currentY);
        doc.text(`${value.sno}`, rightStart + labelWidth, currentY); // Value aligned
        currentY += 4; // Space before barcode and content

        // Generate barcode for UHID
        const barcodeCanvas = document.createElement('canvas');
        JsBarcode(barcodeCanvas, value.labReg, {
            format: 'CODE128',
            displayValue: true,
        });

        // Add barcode to PDF, aligned to the right
        const barcodeDataUrl = barcodeCanvas.toDataURL('image/png');
        doc.addImage(barcodeDataUrl, 'PNG', rightStart + labelWidth, currentY, 30, 10); // Width 30, Height 10
        // Adjust based on the height of the barcode

        // Horizontal line after finishing both sides
        const finalY = currentY + 10; // Adjust based on the height of the text and barcode
        doc.line(leftStart, finalY, 200, finalY); // Draw a single horizontal line from (10, finalY) to (200, finalY)
        currentY += 15;

        // Generate a table for the test details
        doc.text('Test Details:', leftStart, currentY);
        currentY += lineHeight;

        // Add table header
        doc.text('Investigation', leftStart, currentY);
        doc.text('Result', leftStart + 80, currentY);
        doc.text('Unit', leftStart + 120, currentY);
        doc.text('Normal Range', leftStart + 160, currentY);
        currentY += lineHeight + 5;

        testDetail.forEach(test => {
            // Print the TestName first
            doc.text(test.TestName || "N/A", leftStart, currentY);
            currentY += lineHeight + 2; // Add some space after TestName

            // Check if testDetails exists and is an array, then print details
            if (Array.isArray(test.testDetails) && test.testDetails.length > 0) {
                test.testDetails.forEach(detail => {
                    // Check if the result is out of the normal range
                    const resultValue = updatedResults[test._id]?.[detail._id] || detail.Result || "";
                    const normalRange = detail.NormalRange || { start: null, end: null }; // Ensure safe access
                    const outOfRange = isValueOutOfRange(resultValue, normalRange); // Check if the value is out of range

                    // Print each detail row with columns for Investigation, Result, Unit, and NormalRange
                    doc.text(detail.Investigation || "N/A", leftStart, currentY);

                    // Set text color for resultValue based on range check
                    if (outOfRange) {
                        doc.setTextColor(255, 0, 0); // Set text color to red for out of range
                    } else {
                        doc.setTextColor(0, 0, 0); // Set text color to black
                    }

                    // Print the result value
                    doc.text(resultValue, leftStart + 80, currentY);

                    // Reset text color back to black for other texts
                    doc.setTextColor(0, 0, 0);

                    // Print Unit and Normal Range
                    doc.text(detail.Unit || "N/A", leftStart + 120, currentY);
                    doc.text(`${detail.NormalRange.start || "N/A"} - ${detail.NormalRange.end || "N/A"}`, leftStart + 160, currentY);
                    currentY += lineHeight;
                });
            } else {
                // If no test details are available, print a placeholder
                doc.text("No details available", leftStart, currentY);
                currentY += lineHeight;
            }

            currentY += 5; // Add space after each test block for better readability
        });



        // Return Blob for Cloudinary upload
        return doc.output('blob');
    };


    const handleSubmit = async () => {
        const result = testDetail.map(test => {
            return {
                TestName: test.TestName || "N/A",
                testDetails: Array.isArray(test.testDetails) ? test.testDetails.map(detail => ({
                    Investigation: detail.Investigation || "N/A",
                    Result: updatedResults[test._id]?.[detail._id] || detail.Result || "",
                    Unit: detail.Unit || "N/A",
                    NormalRange: { start: detail.NormalRange.start, end: detail.NormalRange.end } || "N/A",
                })) : [],
                id: test._id,
            };
        });

        const jsonOutput = {
            TestlablogId: id,
            result: result,
            documents: [],
        };

        console.log(JSON.stringify(jsonOutput, null, 2)); // For demonstration, logs the output

        // Generate the PDF
        const pdfBlob = generatePrescriptionPdf(PatienttestDetail);

        try {
            // Upload PDF to Cloudinary
            const pdfUrl = await uploadPdfToCloudinary(pdfBlob, `prescription_${id}.pdf`);
            setPrescriptionPdfUrl(pdfUrl);

            jsonOutput.documents.push({
                url: pdfUrl,
                documentType: 'pathologyTestReport',
                uploadedAt: new Date(),
            });

            console.log('Final JSON Output:', JSON.stringify(jsonOutput, null, 2)); // Final output after PDF upload

            // First, submit the form data with a POST request
            const response = await fetch('https://khmc-xdlm.onrender.com/api/testResultP', { // Corrected the URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonOutput, null, 2)
            });

            if (response.ok) {
                const newTest = await response.json();
                alert('Result submitted successfully!');
                console.log("After submission:", newTest);

                // Now, send the PUT request to update the result field after successful POST
                const updateResult = await fetch(`https://khmc-xdlm.onrender.com/api/UpdateResultlabEntry/${id}`, { // Corrected the URL
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ result: true }) // Update 'result' to true
                });

                if (updateResult.ok) {
                    alert('Result Value updated successfully!');
                    console.log('Result updated successfully.');

                    // Optionally redirect or refresh
                    // navigate('/master/testlist') 
                } else {
                    alert('Failed to update lab entry result.');
                    console.error('Error updating result:', await updateResult.text());
                }
            } else {
                alert('Failed to submit comment data');
                console.error('Error submitting form data:', await response.text());
            }

        } catch (error) {
            console.error("Error during PDF upload:", error);
        }
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
                                Pathology Result Report
                            </h3>
                        </div>

                        <div className="row">
                            <div className="card">
                                <div className="card-body">
                                    {loading ? (
                                        <p>Loading...</p>
                                    ) : error ? (
                                        <p>{error}</p>
                                    ) : (
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Sno</th>
                                                    <th>Test Name</th>
                                                    <th>Investigation</th>
                                                    <th>Result</th>
                                                    <th>Unit</th>
                                                    <th>Normal Value</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {console.log(testDetail, "testDetail")
                                                }
                                                {Array.isArray(testDetail) && testDetail.length > 0 ? (
                                                    testDetail.map((test, index) => (
                                                        <React.Fragment key={test._id}> {/* Using React.Fragment with key to avoid error */}
                                                            <tr>
                                                                <td>{index + 1}</td>
                                                                <td>{test.TestName || "N/A"}</td>
                                                                <td colSpan="4"></td>
                                                            </tr>
                                                            {Array.isArray(test.testDetails) && test.testDetails.length > 0 ? (
                                                                test.testDetails.map((detail, detailIndex) => {
                                                                    const resultValue = updatedResults[test._id]?.[detail._id] || detail.Result || "";
                                                                    const normalRange = detail.NormalRange || { start: null, end: null }; // Ensure safe access
                                                                    const outOfRange = isValueOutOfRange(resultValue, normalRange); // Check if the value is out of range

                                                                    return (
                                                                        <tr key={detail._id}>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td>{detail.Investigation || "N/A"}</td>
                                                                            <td>
                                                                                {/* Input field for updating the result */}
                                                                                <input
                                                                                    type="text"
                                                                                    value={resultValue}
                                                                                    onChange={(e) => handleInputChange(test._id, detail._id, e.target.value)}
                                                                                    style={{ color: outOfRange ? 'red' : 'black' }} // Change text color based on range check
                                                                                />
                                                                            </td>
                                                                            <td>{detail.Unit || "N/A"}</td>
                                                                            <td>
                                                                                {detail.NormalRange.start || "N/A"} - {detail.NormalRange.end || "N/A"}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan="6">No test details available</td>
                                                                </tr>
                                                            )}
                                                        </React.Fragment>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="6">No tests available</td>
                                                    </tr>
                                                )}

                                            </tbody>
                                        </table>
                                    )}

                                    {/* Submit button to save the updated results */}


                                    {prescriptionPdfUrl
                                        ?
                                        ''
                                        :
                                        <button onClick={handleSubmit} className="btn btn-primary mt-4">
                                        Update Results
                                    </button>
                                    }


                                    
                                    {prescriptionPdfUrl && <a className="btn btn-primary mt-4" href={prescriptionPdfUrl} target="_blank" rel="noopener noreferrer">Print Result</a>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LablogResultP;
