import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Topbar from '../component/TopNavBar';
import jsPDF from 'jspdf';
import JsBarcode from 'jsbarcode';
// import { strict as assert } from "assert";
import { stripHtml } from "string-strip-html";

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
    const [billPdfUrl, setBillPdfUrl] = useState('');
    const [BillNumber, setBillNumber] = useState('')
    const [groupedTestDetails, setGroupedTestDetails] = useState({});
    const [categories, setCategories] = useState([]);


    // Fetch lab entry and then fetch the test details
    useEffect(() => {
        const billnogen = async () => {
            try {
                // Fetch existing bills to determine the latest billNo
                const billsResponse = await fetch('https://khmc-xdlm.onrender.com/api/labtestbills');
                if (!billsResponse.ok) {
                    throw new Error('Failed to fetch existing bills');
                }

                const billsData = await billsResponse.json();
                console.log(billsData, "billsData");


                // Find the latest billNo
                let latestBillNo = 50; // Default starting number
                if (billsData.length > 0) {
                    // Filter and convert billNo to integers, ignoring invalid values
                    const billNumbers = billsData
                        .map(bill => parseInt(bill.billNo, 10)) // Convert to integer
                        .filter(billNo => !isNaN(billNo)); // Keep only valid numbers

                    if (billNumbers.length > 0) {
                        latestBillNo = Math.max(...billNumbers); // Get the maximum valid bill number
                    }
                }
                console.log(latestBillNo, "latestBillNo");

                const nextBillNo = latestBillNo + 1; // Next bill number
                setBillNumber(nextBillNo)

            } catch (error) {

            }

        }
        const fetchCategory = async () => {

            try {
                console.log("Fetching test result data...");
                const categoriesResponse = await fetch(`https://khmc-xdlm.onrender.com/api/testCat/`);

                if (!categoriesResponse.ok) {
                    console.error("Failed to fetch categories, status:", categoriesResponse.status);
                    setError("Error fetching categories.");
                    setLoading(false);
                    return;
                }
                const categoriesData = await categoriesResponse.json();
                setCategories(categoriesData);
                console.log("Categories received:", categoriesData);

                
            } catch (error) {
                console.error("Error fetching test result data:", error);
                setError("Failed to fetch test result data.");
                setLoading(false);
            }
        };
        const fetchResultEntryP = async () => {
            console.log(id, "FetchResult");

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
                    setBillPdfUrl(TestEntryData[0].documents[1].url);

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
                console.log(filteredTestDetails, "filteredTestDetails");
                // Step 1: Group filtered test details by Catid
                const groupedData = filteredTestDetails.reduce((acc, test) => {
                    const { Catid } = test;
                    if (!acc[Catid]) acc[Catid] = []; // Initialize array if Catid group doesn't exist
                    acc[Catid].push(test);
                    return acc;
                }, {});

                // Step 2: Set the grouped data in state
                setGroupedTestDetails(groupedData);
                console.log("Grouped test details by Catid:", groupedData);
               

                setLoading(false);
            } catch (error) {
                console.error("Error fetching lab entry or test details:", error);
                setError("Failed to fetch lab entry or test details.");
                setLoading(false);
            }
        };
        
        billnogen();
        fetchCategory();
        fetchResultEntryP(); // Initiate the fetch process
    }, [id]);

    const categoryMap = categories.reduce((acc, category) => {
        acc[category._id] = {
            categoryname: category.categoryname,
            description: category.description
        };
        return acc;
    }, {});
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
        const topMargin = 60;
        const bottomMargin = 20;
        const pageHeight = doc.internal.pageSize.height;
        const maxY = pageHeight - bottomMargin;
        const textWidth = doc.internal.pageSize.width - 20;
        const lineHeight = 4;
    
        doc.setFontSize(10);
    
        const leftStart = 10;
        const labelWidth = 40;
        let currentY = topMargin;
    
        // Function to check if new page is needed
        const checkPageOverflow = () => {
            if (currentY > maxY) {
                doc.addPage();
                currentY = topMargin;
            }
        };
    
        // Left side (Patient Details)
        doc.text('Patient Name:', leftStart, currentY);
        doc.text(`${value.patientName}`, leftStart + labelWidth, currentY);
        currentY += lineHeight;
    
        doc.text('Age/Gender:', leftStart, currentY);
        doc.text(`${value.age}/${value.category}`, leftStart + labelWidth, currentY);
        currentY += lineHeight;
    
        doc.text('Consultant Dr:', leftStart, currentY);
        doc.text(`${value.reffby || 'no'}`, leftStart + labelWidth, currentY);
        currentY += lineHeight;
    
        doc.text('Transaction Id:', leftStart, currentY);
        doc.text(`${value.labReg}`, leftStart + labelWidth, currentY);
        currentY += 10;
    
        // Right side (OPD Details)
        const rightStart = 120;
        currentY = topMargin;
    
        doc.text('Collection Date:', rightStart, currentY);
        doc.text(`${value.sampledate}`, rightStart + labelWidth, currentY);
        currentY += lineHeight;
    
        doc.text('Reporting Date:', rightStart, currentY);
        doc.text(`${value.reportDate || 'No'}`, rightStart + labelWidth, currentY);
        currentY += lineHeight;
    
        doc.text('Contact No:', rightStart, currentY);
        doc.text(`${value.mobile}`, rightStart + labelWidth, currentY);
        currentY += lineHeight;
    
        doc.text('S No:', rightStart, currentY);
        doc.text(`${value.sno}`, rightStart + labelWidth, currentY);
        currentY += 4;
    
        // Generate barcode for UHID
        const barcodeCanvas = document.createElement('canvas');
        JsBarcode(barcodeCanvas, value.labReg, {
            format: 'CODE128',
            displayValue: true,
        });
    
        const barcodeDataUrl = barcodeCanvas.toDataURL('image/png');
        doc.addImage(barcodeDataUrl, 'PNG', rightStart + labelWidth, currentY, 30, 10);
        const finalY = currentY + 10;
        doc.line(leftStart, finalY, 200, finalY);
        currentY += 15;
    
        // Generate a table for the grouped test details
        doc.text('Test Details:', leftStart, currentY);
        currentY += lineHeight;
    
        // Loop through each category and render test details grouped by category
        Object.entries(groupedTestDetails).forEach(([catId, tests]) => {
            const categoryName = categoryMap[catId]?.categoryname || "Category Missing!";
            const description = categoryMap[catId]?.description || "";
            
            // Render Category Name as a heading
            doc.setFontSize(12);
            doc.text(categoryName, leftStart, currentY);
            doc.setFontSize(10);
            currentY += lineHeight;
            doc.text(stripHtml(description).result, leftStart, currentY);
            
            currentY += lineHeight + 2;
    
            // Render table header for test details
            doc.text('Investigation', leftStart, currentY);
            doc.text('Result', leftStart + 80, currentY);
            doc.text('Unit', leftStart + 120, currentY);
            doc.text('Normal Range', leftStart + 160, currentY);
            currentY += lineHeight + 5;
    
            tests.forEach(test => {
                // Print the TestName as a subheader
                doc.text(test.TestName || "N/A", leftStart, currentY);
                currentY += lineHeight + 2;
    
                // Check for page overflow
                checkPageOverflow();
    
                // Check if testDetails exists and is an array
                if (Array.isArray(test.testDetails) && test.testDetails.length > 0) {
                    test.testDetails.forEach(detail => {
                        const resultValue = updatedResults[test._id]?.[detail._id] || detail.Result || "";
                        const normalRange = detail.NormalRange || { start: null, end: null };
                        const outOfRange = isValueOutOfRange(resultValue, normalRange);
    
                        // Set text color for result based on range
                        doc.text(detail.Investigation || "N/A", leftStart, currentY);
                        if (outOfRange) {
                            doc.setTextColor(255, 0, 0);
                        } else {
                            doc.setTextColor(0, 0, 0);
                        }
                        doc.text(resultValue, leftStart + 80, currentY);
                        doc.setTextColor(0, 0, 0);
    
                        // Print Unit and Normal Range
                        doc.text(detail.Unit || "N/A", leftStart + 120, currentY);
                        doc.text(`${normalRange.start || "N/A"} - ${normalRange.end || "N/A"}`, leftStart + 160, currentY);
                        currentY += lineHeight;
    
                        // Print TestComment below Normal Range
                        if (detail.TestComment) {
                            doc.setFontSize(8); // Adjust font size if needed for the comment
                            const wrappedTestComment = doc.splitTextToSize(stripHtml(detail.TestComment).result, 40);
                            doc.text(wrappedTestComment, leftStart + 160, currentY);
                            doc.setFontSize(10); // Reset to default font size
                            currentY += lineHeight * wrappedTestComment.length + 2;
                        }
    
                        // Check for page overflow after TestComment
                        checkPageOverflow();
    
                        // Print Comment below the test block, if available
                        if (test.Comment) {
                            doc.setFontSize(8); // Adjust font size if needed for the comment
                            const wrappedComment = doc.splitTextToSize(stripHtml(test.Comment).result, textWidth);
                            doc.text(wrappedComment, leftStart, currentY);
                            doc.setFontSize(10); // Reset to default font size
                            currentY += lineHeight * wrappedComment.length + 5; // Adjust spacing after Comment
                        }
    
                        // Check for page overflow after each detail and comment
                        checkPageOverflow();
                    });
                } else {
                    doc.text("No details available", leftStart, currentY);
                    currentY += lineHeight;
                }
                currentY += 5; // Space after each test block for readability
    
                // Check for page overflow after each test
                checkPageOverflow();
            });
    
            // Add space after each category block
            currentY += 10;
            checkPageOverflow();
        });
    
        return doc.output('blob');
    };
    
    
    
    const createLabTestBill = async (patientData, tests) => {
        console.log(patientData, "jsdkjdffd dfklldfn fdf");
        console.log(tests, "jsdksdf");

        setLoading(true);

        try {

            // Prepare bill details
            const total = tests.reduce((sum, test) => sum + test.Rate, 0);
            const billDetails = {
                patientId: patientData._id,
                billNo: BillNumber,
                patientName: patientData.patientName,
                mobile: patientData.mobile,
                email: patientData.email || '',
                total: total,
                received: patientData.received || total, // Received amount if available, otherwise total
                refund: patientData.refund || 0,
                discount: patientData.discount || 0,
                paymentType: patientData.payment || 0,
                tests: patientData.tests,
                date: new Date(),

            };

            // Send bill to labtestbills API
            const response = await fetch('https://khmc-xdlm.onrender.com/api/labtestbills', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(billDetails)
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to create bill: ${errorMessage}`);
            }

            console.log('Bill created and uploaded to Cloudinary successfully!');
        } catch (error) {
            console.error('Error creating lab test bill:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    const generateLabTestBillPdf = (patientData, tests) => {
        console.log(tests, "tests");
        console.log(patientData, "patientData");

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const centerX = pageWidth / 2;

        // Header
        doc.setFontSize(14).setFont('bold');
        doc.text('KAISHVI HEALTH & MATERNITY CENTRE', centerX, 20, { align: 'center' });
        doc.setFontSize(10).setFont('normal');
        doc.text('Nehru Nagar, Ward No.:1, Pharenda Road, Maharajganj (U.P.)', centerX, 28, { align: 'center' });

        // Patient Info
        let currentY = 50;
        doc.text(`Patient Name: ${patientData.patientName}`, 10, currentY);
        doc.text(`Bill No: ${BillNumber}`, 150, currentY); // Adjust alignment for right
        currentY += 10;
        doc.text(`Age/Gender: ${patientData.age}/${patientData.gender}`, 10, currentY);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, currentY);
        currentY += 20;

        // Table Header
        doc.setFillColor(200, 200, 200);
        doc.rect(10, currentY, pageWidth - 20, 7, 'F');
        doc.setFont('bold');
        doc.text('S/No', 12, currentY + 5);
        doc.text('Test Name', 30, currentY + 5);
        doc.text('Rate', 100, currentY + 5);
        doc.text('Amount', 150, currentY + 5);
        currentY += 10;

        // Lab Test Rows
        doc.setFont('normal');
        let totalAmount = 0;
        tests.forEach((test, index) => {
            const amount = test.Rate;
            doc.text(`${index + 1}`, 12, currentY);
            doc.text(test.TestName, 30, currentY);
            doc.text(`${test.Rate}`, 100, currentY);
            doc.text(`${amount}`, 150, currentY);
            totalAmount += amount;
            currentY += 10;
        });

        // Total
        doc.setFont('bold');
        doc.text(`Total: ${totalAmount}`, 150, currentY);
        return doc.output('blob'); // Return as blob for Cloudinary
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

        console.log("JSON output for test result:", JSON.stringify(jsonOutput, null, 2));

        // Generate the Test Report PDF
        const prescriptionPdfBlob = generatePrescriptionPdf(PatienttestDetail);
        const billPdfBlob = generateLabTestBillPdf(PatienttestDetail, testDetail);

        try {
            // Upload Test Report PDF to Cloudinary
            const prescriptionPdfUrl = await uploadPdfToCloudinary(prescriptionPdfBlob, `prescription_${id}.pdf`);
            setPrescriptionPdfUrl(prescriptionPdfUrl);

            jsonOutput.documents.push({
                url: prescriptionPdfUrl,
                documentType: 'pathologyTestReport',
                uploadedAt: new Date(),
            });

            console.log("Prescription PDF uploaded:", prescriptionPdfUrl);

            // Upload Bill PDF to Cloudinary
            const billPdfUrl = await uploadPdfToCloudinary(billPdfBlob, `bill_${id}.pdf`);
            setBillPdfUrl(billPdfUrl);

            jsonOutput.documents.push({
                url: billPdfUrl,
                documentType: 'billReceipt',
                uploadedAt: new Date(),
            });

            console.log("Bill PDF uploaded:", billPdfUrl);

            // Submit the test result data with a POST request
            const response = await fetch('https://khmc-xdlm.onrender.com/api/testResultP', {
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
                const updateResult = await fetch(`https://khmc-xdlm.onrender.com/api/UpdateResultlabEntry/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ result: true, documents: jsonOutput.documents })
                });

                if (updateResult.ok) {
                    alert('Result Value updated successfully!');
                    createLabTestBill(PatienttestDetail, testDetail)
                    console.log('Result updated successfully.');
                } else {
                    alert('Failed to update lab entry result.');
                    console.error('Error updating result:', await updateResult.text());
                }
            } else {
                alert('Failed to submit test result data');
                console.error('Error submitting form data:', await response.text());
            }
        } catch (error) {
            console.error("Error during PDF upload:", error);
        }
    };

    // const handleSubmit = async () => {
    //     const result = testDetail.map(test => {
    //         return {
    //             TestName: test.TestName || "N/A",
    //             testDetails: Array.isArray(test.testDetails) ? test.testDetails.map(detail => ({
    //                 Investigation: detail.Investigation || "N/A",
    //                 Result: updatedResults[test._id]?.[detail._id] || detail.Result || "",
    //                 Unit: detail.Unit || "N/A",
    //                 NormalRange: { start: detail.NormalRange.start, end: detail.NormalRange.end } || "N/A",
    //             })) : [],
    //             id: test._id,
    //         };
    //     });

    //     const jsonOutput = {
    //         TestlablogId: id,
    //         result: result,
    //         documents: [],
    //     };

    //     console.log(JSON.stringify(jsonOutput, null, 2)); // For demonstration, logs the output

    //     // Generate the PDF
    //     const pdfBlob = generatePrescriptionPdf(PatienttestDetail);

    //     try {
    //         // Upload PDF to Cloudinary
    //         const pdfUrl = await uploadPdfToCloudinary(pdfBlob, `prescription_${id}.pdf`);
    //         setPrescriptionPdfUrl(pdfUrl);

    //         jsonOutput.documents.push({
    //             url: pdfUrl,
    //             documentType: 'pathologyTestReport',
    //             uploadedAt: new Date(),
    //         });

    //         console.log('Final JSON Output:', JSON.stringify(jsonOutput, null, 2)); // Final output after PDF upload

    //         // First, submit the form data with a POST request
    //         const response = await fetch('https://khmc-xdlm.onrender.com/api/testResultP', { // Corrected the URL
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(jsonOutput, null, 2)
    //         });

    //         if (response.ok) {
    //             const newTest = await response.json();
    //             alert('Result submitted successfully!');
    //             console.log("After submission:", newTest);

    //             // Now, send the PUT request to update the result field after successful POST
    //             const updateResult = await fetch(`https://khmc-xdlm.onrender.com/api/UpdateResultlabEntry/${id}`, { // Corrected the URL
    //                 method: 'PUT',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({ result: true }) // Update 'result' to true
    //             });

    //             if (updateResult.ok) {
    //                 alert('Result Value updated successfully!');
    //                 console.log('Result updated successfully.');
    //             } else {
    //                 alert('Failed to update lab entry result.');
    //                 console.error('Error updating result:', await updateResult.text());
    //             }
    //         } else {
    //             alert('Failed to submit comment data');
    //             console.error('Error submitting form data:', await response.text());
    //         }
    //     } catch (error) {
    //         console.error("Error during PDF upload:", error);
    //     }
    // };
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
    {console.log(testDetail, "testDetail")}
    {Object.entries(groupedTestDetails).map(([catId, tests]) => (
        <React.Fragment key={catId}>
            {console.log(tests,"tests tests")}
            <tr>
                <td colSpan="6">
                    <p className='py-2'><strong>Category: {categoryMap[catId]?.categoryname || "Unknown Category"}</strong></p>
                   
                    
                    <div className='information-content' dangerouslySetInnerHTML={{ __html: categoryMap[catId]?.description || "" }} />
                    {/* <div>{categoryMap[catId]?.description || "No description available"}</div> */}
                </td>
            </tr>
            {tests.map((test, index) => (
                <React.Fragment key={test._id}>
                    <tr>
                        <td>{index + 1}</td>
                        <td>{test.TestName || "N/A"}</td>
                        <td colSpan="4"></td>
                    </tr>
                    {Array.isArray(test.testDetails) && test.testDetails.length > 0 ? (
                        test.testDetails.map((detail, detailIndex) => {
                            const resultValue = updatedResults[test._id]?.[detail._id] || detail.Result || "";
                            const normalRange = detail.NormalRange || { start: null, end: null };
                            const outOfRange = isValueOutOfRange(resultValue, normalRange);

                            return (
                                <>
                                <tr key={detail._id}>
                                    <td></td>
                                    <td></td>
                                    <td>{detail.Investigation || "N/A"}</td>
                                    <td>
                                        <input
                                            type="text"
                                            value={resultValue}
                                            onChange={(e) => handleInputChange(test._id, detail._id, e.target.value)}
                                            style={{ color: outOfRange ? 'red' : 'black' }}
                                        />
                                    </td>
                                    <td>{detail.Unit || "N/A"}</td>
                                    <td>
                                        {normalRange.start || "N/A"} - {normalRange.end || "N/A"}
                                        <div className='information-content' dangerouslySetInnerHTML={{ __html: detail.TestComment || "" }} />
                                    </td>
                                </tr>
                                <tr>
                                <div className='information-content w-100' dangerouslySetInnerHTML={{ __html: test.Comment || "" }} />
                                </tr>
                                
                                </>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="6">No test details available</td>
                        </tr>
                    )}
                </React.Fragment>
            ))}
        </React.Fragment>
    ))}
</tbody>

                                        </table>
                                    )}
                                    <button onClick={handleSubmit} className="btn btn-primary mt-4"> Update Results </button>
                                    {prescriptionPdfUrl ? '' : <button onClick={handleSubmit} className="btn btn-primary mt-4"> Update Results </button>
                                    }
                                    {billPdfUrl && <a className="btn btn-primary mt-4" href={billPdfUrl} target="_blank" rel="noopener noreferrer">Print Bill Result</a>}
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