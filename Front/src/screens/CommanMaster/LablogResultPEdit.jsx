import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Topbar from '../component/TopNavBar';
import jsPDF from 'jspdf';
import JsBarcode from 'jsbarcode';
// import { strict as assert } from "assert";
import { stripHtml } from "string-strip-html";

const LablogResultPEdit = () => {
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
    const [fetchDatavalue, setfetchDatavalue] = useState(false)
    const [groupedTestDetails, setGroupedTestDetails] = useState({});
    const [TestEntries, setTestEntries] = useState([]);
    const [categories, setCategories] = useState([]);
    const [allTest, setAllTest] = useState([]);
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
                    setLoading(false);  // Stop loading state
                    return;  // Return early if fetching test results failed
                }

                const TestEntryData = await testEntryResponse.json();
                console.log("TestEntryData received:", TestEntryData);
                setTestEntries(TestEntryData)

                // If no test result data is found, automatically fetch lab entries and test details
                if (!TestEntryData || TestEntryData.length === 0) {
                    console.log("No test result data found, fetching lab entry details.");
                    setLoading(false);  // Stop loading state
                    return;  // Exit early, no further processing needed
                }

                // Process the test result data if found
                const groupedData = TestEntryData[0].result.reduce((acc, test) => {
                    const { Catid } = test;
                    if (!acc[Catid]) acc[Catid] = [];
                    acc[Catid].push(test);
                    return acc;
                }, {});


                // Fetch the test names and rates from the API
                const testNames = await fetchTestNameRates();

                // Process the groupedData and enrich it with Rate information
                const enrichedGroupedData = { ...groupedData };

                // Iterate over groupedData and add Rate to each test
                Object.keys(enrichedGroupedData).forEach((catId) => {
                    enrichedGroupedData[catId].forEach((test) => {
                        // Find the matching test name from the fetched data
                        const matchingTest = testNames.find((t) => t.TestName === test.TestName);
                        if (matchingTest) {
                            // Add the Rate field to the test
                            test.Rate = matchingTest.Rate || null;
                        }
                    });
                });

                // Set the updated grouped data with the Rate added
                setGroupedTestDetails(enrichedGroupedData);

                // setGroupedTestDetails(groupedData);
                setfetchDatavalue(true)
                console.log("Grouped test details by Catid:", groupedData);

                const { result, documents } = TestEntryData[0];

                setTestDetail(result);

                // Handle documents if they exist
                if (documents?.length > 0) {
                    const prescriptionUrl = documents.find(doc => doc.documentType === "pathologyTestReport")?.url;
                    const billUrl = documents.find(doc => doc.documentType === "billReceipt")?.url;
                    setPrescriptionPdfUrl(prescriptionUrl || "");
                    setBillPdfUrl(billUrl || "");
                }

                setLoading(false);  // Stop loading state after processing the result

            } catch (error) {
                console.error("Error fetching test result data:", error);
                setError("Failed to fetch test result data.");
                setLoading(false);  // Stop loading state in case of error
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

                const testDetailsResponse = await fetch(`https://khmc-xdlm.onrender.com/api/testName`);
                if (!testDetailsResponse.ok) {
                    console.error("Failed to fetch test names, status:", testDetailsResponse.status);
                    setError("Error fetching test names.");
                    setLoading(false);
                    return;
                }

                const testDetailsData = await testDetailsResponse.json();
                console.log(testDetailsData);

                setAllTest(testDetailsData)

                setPatientTestDetail(labEntryData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching lab entry or test details:", error);
                setError("Failed to fetch lab entry or test details.");
                setLoading(false);
            }
        };

        billnogen();
        fetchCategory();
        fetchLabEntriesAndTestDetails();
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
    const handleInputChange = (testId, detailId, value) => {
        console.log("testId:", testId, "detailId:", detailId, "value:", value);

        setUpdatedResults((prevState) => {
            console.log("prevState:", prevState);

            // Deep clone the state to avoid mutating the original state
            const newState = { ...prevState };

            // If the test doesn't already exist, initialize it
            if (!newState[testId]) {
                newState[testId] = {};
            }

            // If the detail for this test doesn't exist, initialize it
            if (!newState[testId][detailId]) {
                newState[testId][detailId] = {};
            }

            // Update the result value for the specific test and detail
            newState[testId][detailId].Result = value;
            console.log(newState, "newState");


            return newState;
        });
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

        const checkPageOverflow = () => {
            if (currentY > maxY) {
                doc.addPage();
                currentY = topMargin;
            }
        };

        // Left side (Patient Details)
        doc.text('Patient Name:', leftStart, currentY);
        doc.text(String(value.patientName || "N/A"), leftStart + labelWidth, currentY);
        currentY += lineHeight;

        doc.text('Age/Gender:', leftStart, currentY);
        doc.text(`${String(value.age || "N/A")}/${String(value.category || "N/A")}`, leftStart + labelWidth, currentY);
        currentY += lineHeight;

        doc.text('Consultant Dr:', leftStart, currentY);
        doc.text(String(value.reffby || 'N/A'), leftStart + labelWidth, currentY);
        currentY += lineHeight;

        doc.text('Transaction Id:', leftStart, currentY);
        doc.text(String(value.labReg || 'N/A'), leftStart + labelWidth, currentY);
        currentY += 10;

        // Right side (OPD Details)
        const rightStart = 120;
        currentY = topMargin;

        doc.text('Collection Date:', rightStart, currentY);
        doc.text(String(value.sampledate || 'N/A'), rightStart + labelWidth, currentY);
        currentY += lineHeight;

        doc.text('Reporting Date:', rightStart, currentY);
        doc.text(String(value.reportDate || 'N/A'), rightStart + labelWidth, currentY);
        currentY += lineHeight;

        doc.text('Contact No:', rightStart, currentY);
        doc.text(String(value.mobile || 'N/A'), rightStart + labelWidth, currentY);
        currentY += lineHeight;

        doc.text('S No:', rightStart, currentY);
        doc.text(String(value.sno || 'N/A'), rightStart + labelWidth, currentY);
        currentY += 4;

        // Barcode
        const barcodeCanvas = document.createElement('canvas');
        JsBarcode(barcodeCanvas, String(value.labReg || ""), {
            format: 'CODE128',
            displayValue: true,
        });

        const barcodeDataUrl = barcodeCanvas.toDataURL('image/png');
        doc.addImage(barcodeDataUrl, 'PNG', rightStart + labelWidth, currentY, 30, 10);
        const finalY = currentY + 10;
        doc.line(leftStart, finalY, 200, finalY);
        currentY += 15;

        doc.text('Test Details:', leftStart, currentY);
        currentY += lineHeight;

        Object.entries(groupedTestDetails).forEach(([catId, tests]) => {
            const categoryName = categoryMap[catId]?.categoryname || "Category Missing!";
            const description = categoryMap[catId]?.description || "";

            doc.setFontSize(12);
            doc.text(categoryName, leftStart, currentY);
            doc.setFontSize(10);
            currentY += lineHeight;
            doc.text(stripHtml(description).result || "", leftStart, currentY);

            currentY += lineHeight + 2;

            // Table header for test details
            doc.text('Investigation', leftStart, currentY);
            doc.text('Result', leftStart + 80, currentY);
            doc.text('Unit', leftStart + 120, currentY);
            doc.text('Normal Range', leftStart + 160, currentY);
            currentY += lineHeight + 5;

            tests.forEach(test => {
                doc.text(String(test.TestName || ""), leftStart, currentY);
                currentY += lineHeight + 2;

                checkPageOverflow();

                if (Array.isArray(test.testDetails)) {
                    test.testDetails.forEach(detail => {
                        const resultValue = updatedResults[test._id]?.[detail._id]?.Result || detail.Result || "";
                        const normalRange = detail.NormalRange || { start: "", end: "" };
                        const outOfRange = isValueOutOfRange(resultValue, normalRange);

                        doc.text(String(detail.Investigation || ""), leftStart, currentY);

                        doc.setTextColor(outOfRange ? 255 : 0, 0, 0);
                        doc.text(String(resultValue), leftStart + 80, currentY);
                        doc.setTextColor(0, 0, 0);

                        doc.text(String(detail.Unit || ""), leftStart + 120, currentY);
                        doc.text(`${normalRange.start || ""} - ${normalRange.end || ""}`, leftStart + 160, currentY);
                        currentY += lineHeight;

                        if (detail.TestComment) {
                            doc.setFontSize(8);
                            const wrappedTestComment = doc.splitTextToSize(stripHtml(detail.TestComment).result, 40);
                            doc.text(wrappedTestComment, leftStart + 160, currentY);
                            doc.setFontSize(10);
                            currentY += lineHeight * wrappedTestComment.length + 2;
                        }

                        checkPageOverflow();

                        if (test.Comment) {
                            doc.setFontSize(8);
                            const wrappedComment = doc.splitTextToSize(stripHtml(test.Comment).result, textWidth);
                            doc.text(wrappedComment, leftStart, currentY);
                            doc.setFontSize(10);
                            currentY += lineHeight * wrappedComment.length + 5;
                        }

                        checkPageOverflow();
                    });
                } else {
                    doc.text("No details available", leftStart, currentY);
                    currentY += lineHeight;
                }
                currentY += 5;

                checkPageOverflow();
            });

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

    function numberToWords(num) {
        const belowTwenty = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
            "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen",
            "eighteen", "nineteen"];
        const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
        const thousands = ["", "thousand"];

        if (num === 0) return "zero";

        const convert = (n) => {
            if (n < 20) return belowTwenty[n];
            else if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + belowTwenty[n % 10] : "");
            else if (n < 1000) return belowTwenty[Math.floor(n / 100)] + " hundred" + (n % 100 !== 0 ? " " + convert(n % 100) : "");
            else return belowTwenty[Math.floor(n / 1000)] + " thousand" + (n % 1000 !== 0 ? " " + convert(n % 1000) : "");
        };

        return convert(num).trim();
    }

    const generateLabTestBillPdf = (patientData, tests) => {
        console.log(tests, "tests generateLabPDF");

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const centerX = pageWidth / 2;

        // Header
        doc.setFontSize(14).setFont('bold');
        doc.text('KAISHVI PATHOLOGY', centerX, 20, { align: 'center' });
        doc.setFontSize(10).setFont('normal');
        doc.text('Nehru Nagar, Ward No.:1, Pharenda Road, Maharajganj (U.P.)', centerX, 28, { align: 'center' });
        doc.text('E-mail: info@kaishvihospital.com   www.kaishvihospital.com', centerX, 34, { align: 'center' });
        doc.text('Mob.No: 8948150069', centerX, 40, { align: 'center' });

        // Barcode placeholder
        doc.text('100037915', pageWidth - 40, 40, { align: 'right' });

        // Patient Info Section
        const leftColumnX = 10; // Start of left column
        const rightColumnX = centerX + 10; // Start of right column
        let currentY = 50;
        const rowHeight = 6; // Row height

        // Patient Info Data
        const patientInfo = [
            { label: "Patient Name:", value: patientData.patientName },
            { label: "Age/Sex:", value: `${patientData.age || ''}/${patientData.category || ''}` },
            { label: "Ref. By:", value: patientData.reffby || '' },
            { label: "UHID:", value: patientData.uhid || '-' },
            { label: "Registration No.:", value: patientData.labReg || '' },
            { label: "Transaction Id:", value: patientData.sno || '' },
            { label: "Collection Date:", value: patientData.sampledate || '' },
            { label: "Reporting Date:", value: patientData.reportDate || '-' }
        ];

        // Split data into two columns, with equal parts
        const midIndex = Math.ceil(patientInfo.length / 2);
        const leftColumnData = patientInfo.slice(0, midIndex);
        const rightColumnData = patientInfo.slice(midIndex);

        // Print left column details
        leftColumnData.forEach((info, index) => {
            const rowY = currentY + (index * rowHeight);
            doc.text(info.label, leftColumnX, rowY);
            doc.text(String(info.value), leftColumnX + 40, rowY);
        });

        // Print right column details, continuing from the same level as the left column ends
        rightColumnData.forEach((info, index) => {
            const rowY = currentY + (index * rowHeight);
            doc.text(info.label, rightColumnX, rowY);
            doc.text(String(info.value), rightColumnX + 40, rowY);
        });

        currentY += leftColumnData.length * rowHeight + 2;

        // Table Header
        doc.setFillColor(200, 200, 200);
        doc.rect(10, currentY, pageWidth - 20, 7, 'F');
        doc.setFont('bold');
        doc.text('SL', 12, currentY + 5);
        doc.text('Investigation', 30, currentY + 5);
        doc.text('Charges', 160, currentY + 5, { align: 'right' });
        currentY += 10;

        // Lab Test Rows
        doc.setFont('normal');
        let totalAmount = 0;
        tests.forEach((test, index) => {
            const amount = test.Rate;
            doc.text(String(index + 1), 12, currentY);
            doc.text(String(test.TestName), 30, currentY);
            doc.text(String(amount.toFixed(2)), 160, currentY, { align: 'right' });
            totalAmount += amount;
            currentY += 7;
        });

        // Total Amount Section
        currentY += 5;
        doc.setFont('bold');
        doc.text('Total Amount :', 140, currentY, { align: 'right' });
        doc.text(String(totalAmount.toFixed(2)), 160, currentY, { align: 'right' });

        // Received Amount Section
        currentY += 7;
        doc.text('Received :', 140, currentY, { align: 'right' });
        doc.text(String(totalAmount.toFixed(2)), 160, currentY, { align: 'right' });

        // Footer with thanks message
        currentY += 15;
        doc.setFontSize(10).setFont('normal');
        doc.text(`Received with thanks a sum of : ${numberToWords(totalAmount.toLocaleString('en-IN'))} Only`, leftColumnX, currentY);

        // Footer Created & Printed By
        currentY += 10;
        doc.text('Created By : lab, Printed By : Jashandeep', leftColumnX, currentY);
        doc.text('Authorised Signatory', pageWidth - 40, currentY, { align: 'right' });

        return doc.output('blob'); // Return as blob for Cloudinary or other usage
    };

    const fetchTestNameRates = async () => {
        try {
            const response = await fetch("https://khmc-xdlm.onrender.com/api/testName");
            if (!response.ok) {
                console.error("Failed to fetch test names and rates:", response.status);
                return [];
            }
            const testNames = await response.json();
            return testNames;
        } catch (error) {
            console.error("Error fetching test names:", error);
            return [];
        }
    };


    const handleSubmit = async () => {
        // Generate update JSON structure
        const updatePayload = handleUpdateResults();

        try {
            // Send PUT request to update test results on the server
            const response = await fetch(`https://khmc-xdlm.onrender.com/api/testResultP/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatePayload)
            });

            if (response.ok) {
                const updatedTestResult = await response.json();
                alert('Results updated successfully!');
                console.log('Updated Test Result:', updatedTestResult);
            } else {
                alert('Failed to update results.');
            }
        } catch (error) {
            console.error("Error submitting updated results:", error);
            alert('Error while submitting update.');
        }
    };
    const handlePublishReport = async () => {
        console.log(PatienttestDetail, "PatienttestDetail");

        // Generate update JSON structure
        const updatePayload = handleUpdateResults();
        // Generate the Test Report PDF
        const prescriptionPdfBlob = generatePrescriptionPdf(PatienttestDetail);
        const billPdfBlob = generateLabTestBillPdf(PatienttestDetail, testDetail);
        const doc = []


        try {

            const prescriptionPdfUrl = await uploadPdfToCloudinary(prescriptionPdfBlob, `prescription_${id}.pdf`);
            // setPrescriptionPdfUrl(prescriptionPdfUrl);

            doc.push({
                url: prescriptionPdfUrl,
                documentType: 'pathologyTestReport',
                uploadedAt: new Date(),
            });

            console.log("Prescription PDF uploaded:", prescriptionPdfUrl);

            // Upload Bill PDF to Cloudinary
            const billPdfUrl = await uploadPdfToCloudinary(billPdfBlob, `bill_${id}.pdf`);
            setBillPdfUrl(billPdfUrl);

            doc.push({
                url: billPdfUrl,
                documentType: 'billReceipt',
                uploadedAt: new Date(),
            });
            console.log("billPdfUrl PDF uploaded:", billPdfUrl);

            // console.log(updatePayload, "New updatePayload");


            // Send PUT request to update test results on the server
            const response = await fetch(`https://khmc-xdlm.onrender.com/api/testResultP/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatePayload)
            });

            if (response.ok) {
                const updatedTestResult = await response.json();
                alert('Results updated successfully!');
                
                createLabTestBill(PatienttestDetail, testDetail)
                console.log('Updated Test Result:', updatedTestResult);
                console.log('doc Result:', doc);

                // Now, send the PUT request to update the result field after successful POST
                const updateResult = await fetch(`https://khmc-xdlm.onrender.com/api/UpdateResultlabEntry/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ result: true, documents: doc })
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
                alert('Failed to update results.');
            }
        } catch (error) {
            console.error("Error submitting updated results:", error);
            alert('Error while submitting update.');
        }
    };


    // Function to generate the required JSON format for updates
    const handleUpdateResults = () => {
        // Extract updated test details
        const resultUpdates = Object.values(groupedTestDetails).flatMap(categoryTests =>
            categoryTests.map(test => ({
                _id: test._id,
                TestName: test.TestName,
                Rate: test.Rate,
                Catid: test.Catid,
                testDetails: test.testDetails.map(detail => ({
                    _id: detail._id,
                    Investigation: detail.Investigation,
                    Result: { Result: updatedResults[test._id]?.[detail._id]?.Result || detail.Result.Result },
                    Unit: detail.Unit,
                    NormalRange: {
                        start: detail.NormalRange.start,
                        end: detail.NormalRange.end
                    }
                }))
            }))
        );

        // Extract updated document details
        // const documents = TestEntries[0].documents.map(document => ({
        //     _id: document._id,
        //     url: document.url,
        //     documentType: document.documentType
        // }));

        // console.log(documents,"documents 12");
        

        // Create final JSON structure
        const updatePayload = {
            resultUpdates,
            
        };

        console.log("Update Payload:", JSON.stringify(updatePayload, null, 2));

        return updatePayload;
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
                                </span> {console.log(allTest, "allTest")
                                }
                                Edit Pathology Result Report {console.log(updatedResults, "sd updatedResults")
                                }
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
                                                {console.log(groupedTestDetails, "groupedTestDetails")}
                                                {Object.entries(groupedTestDetails).map(([catId, tests]) => (
                                                    <React.Fragment key={catId}>
                                                        {console.log(tests, "tests tests")}
                                                        <tr>
                                                            <td colSpan="6">
                                                                <p className='py-2'><strong>Category:{catId} {categoryMap[catId]?.categoryname || "Unknown Category"}</strong></p>


                                                                <div className='information-content' dangerouslySetInnerHTML={{ __html: categoryMap[catId]?.description || "" }} />
                                                                {/* <div>{categoryMap[catId]?.description || "No description available"}</div> */}
                                                            </td>
                                                        </tr>
                                                        {tests.map((test, index) => (
                                                            <React.Fragment key={test._id}>
                                                                <tr>
                                                                    <td>{index + 1}</td>
                                                                    <td>{test.TestName || ""}{test.Rate}</td>
                                                                    <td colSpan="4"></td>
                                                                </tr>
                                                                {Array.isArray(test.testDetails) && test.testDetails.length > 0 ? (
                                                                    test.testDetails.map((detail, detailIndex) => {
                                                                        const resultValue = updatedResults[test._id]?.[detail._id]?.Result || detail.Result || "";
                                                                        // const resultValue = updatedResults[test._id]?.[detail._id] || detail.Result || "";
                                                                        const normalRange = detail.NormalRange || { start: null, end: null };
                                                                        const outOfRange = isValueOutOfRange(resultValue, normalRange);
                                                                        console.log(resultValue, "resultValue hjjh");

                                                                        return (
                                                                            <>
                                                                                <tr key={detail._id}>
                                                                                    <td></td>
                                                                                    <td></td>
                                                                                    <td>{detail.Investigation || ""}{detail._id}</td>
                                                                                    <td> {console.log(resultValue, "sdfddf dfdf")}
                                                                                        <input
                                                                                            type="text"
                                                                                            value={resultValue.Result}
                                                                                            onChange={(e) => handleInputChange(test._id, detail._id, e.target.value)}
                                                                                            style={{ color: outOfRange ? 'red' : 'black' }}
                                                                                        />
                                                                                    </td>
                                                                                    <td>{detail.Unit || ""} </td>
                                                                                    <td>
                                                                                        {normalRange.start || ""} - {normalRange.end || ""}
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
                                    <button onClick={handlePublishReport} className="btn btn-primary mt-4">Publish Report </button>
                                    {/* {prescriptionPdfUrl ? '' : 
                                    } */}
                                    {/* {billPdfUrl && <a className="btn btn-primary mt-4" href={billPdfUrl} target="_blank" rel="noopener noreferrer">Print Bill Result</a>}
                                    {prescriptionPdfUrl && <a className="btn btn-primary mt-4" href={prescriptionPdfUrl} target="_blank" rel="noopener noreferrer">Print Result</a>} */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default LablogResultPEdit;