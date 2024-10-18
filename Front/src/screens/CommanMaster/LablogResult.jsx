import React, { useState, useEffect } from 'react';
import { CKEditor, CKEditorContext } from '@ckeditor/ckeditor5-react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClassicEditor, Context, Bold, Essentials, Italic, Underline, Heading, Alignment, List, Paragraph, ContextWatchdog, Mention, Undo } from 'ckeditor5';
import jsPDF from 'jspdf';
import JsBarcode from 'jsbarcode';
import Topbar from '../component/TopNavBar';
import { Link } from 'react-router-dom';


const LablogResult = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        TestlablogId: '',
        result: '', // Use result to match your form submission field name
    });

    const [testDetail, settestDetail] = useState([]);
    const [testResults, settestResults] = useState([]);
    const [testComments, settestComments] = useState(''); // State to hold CKEditor content
    const [testId, settestId] = useState('');
    const [loading, setLoading] = useState(true); // For loading state

    // Fetch data from the API when the component is mounted
    useEffect(() => {
        const fetchLabEntries = async () => {
            try {
                const response = await fetch(`https://khmc-xdlm.onrender.com/api/labentry/${id}`);
                const data = await response.json();
                console.log(data, "data");

                settestDetail([data]); // Set the response data in the LabEntries state
                settestId(data.tests[0]); // Assuming the test ID is at data.tests[0]
                setLoading(false); // Stop the loading state

            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false); // Stop the loading even in case of error
            }
        };
        const fetchLabresults = async () => {
            try {
                const response = await fetch(`https://khmc-xdlm.onrender.com/api/testResult/${id}`);
                const data = await response.json();
                console.log(data, "Results");

                settestResults([data[0]]); // Set the response data in the LabEntries state
                settestComments(data[0]?.result || "No test results available.");
                setLoading(false); // Stop the loading state

            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false); // Stop the loading even in case of error
            }
        };
        fetchLabresults()
        fetchLabEntries(); // Call the function
    }, [id]); // Dependency array includes id

    // Fetch test comments
    const fetchTestComments = async () => {
        try {
            const response = await fetch(`https://khmc-xdlm.onrender.com/api/testComment/${testId}`);
            const data = await response.json();
            console.log(data, "testComment");

            const fetchedComments = data[0]?.Comments || '';
            settestComments(fetchedComments); // Set the comment fetched from API

            setFormData({

                TestlablogId: id,
                result: fetchedComments, // Update Comment field in formData
            });
            setLoading(false); // Stop the loading state
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false); // Stop the loading even in case of error
        }
    };

    // Update CKEditor content
    const handleChange1 = (event, editor) => {
        const data = editor.getData();
        console.log("CKEditor Data:", data); // Debugging CKEditor data
        setFormData({
            ...formData,
            result: data // Update Comment field in formData with CKEditor content
        });
    };

    // Function to upload PDF to Cloudinary
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

    // Function to generate the prescription PDF
    //   const generatePrescriptionPdf = (testDetail, result) => {
    //     const doc = new jsPDF();

    //     // Add 60px space from the top
    //     const topMargin = 60;
    //     const bottomMargin = 20; // Bottom margin to leave space at the bottom
    //     const pageHeight = doc.internal.pageSize.height;
    //     const maxY = pageHeight - bottomMargin; // Maximum Y position to keep content within bounds
    //     const textWidth = doc.internal.pageSize.width - 20; // Maximum text width
    //     const lineHeight = 5; // Reduced line height for closer spacing

    //     // Set font size to 10
    //     doc.setFontSize(10);

    //     // Left side (Patient Details)
    //     const leftStart = 10; // Starting X point for left text
    //     const labelWidth = 40; // Define a constant width for the labels
    //     let currentY = topMargin;

    //     // Labels and values for left side
    //     doc.text('Patient Name:', leftStart, currentY);
    //     doc.text(`${testDetail.patientName}`, leftStart + labelWidth, currentY); // Value aligned
    //     currentY += lineHeight;

    //     doc.text('Age/Gender:', leftStart, currentY);
    //     doc.text(`${testDetail.age}/${testDetail.category}`, leftStart + labelWidth, currentY); // Value aligned
    //     currentY += lineHeight;

    //     doc.text('Consultant Dr:', leftStart, currentY);
    //     doc.text(`${testDetail.reffby || 'no'}`, leftStart + labelWidth, currentY); // Value aligned
    //     currentY += lineHeight;

    //     doc.text('Transaction Id:', leftStart, currentY);
    //     doc.text(`${testDetail.labReg}`, leftStart + labelWidth, currentY); // Value aligned
    //     currentY += 10; // Extra space before the right side

    //     // Right side (OPD Details)
    //     const rightStart = 120; // Starting X point for right text
    //     currentY = topMargin; // Reset Y position for the right side

    //     // Labels and values for right side
    //     doc.text('Collection Date:', rightStart, currentY);
    //     doc.text(`${testDetail.sampledate}`, rightStart + labelWidth, currentY); // Value aligned
    //     currentY += lineHeight;

    //     doc.text('Reporting Date:', rightStart, currentY);
    //     doc.text(`${testDetail.reportDate || 'No'}`, rightStart + labelWidth, currentY); // Value aligned
    //     currentY += lineHeight;

    //     doc.text('Contact No:', rightStart, currentY);
    //     doc.text(`${testDetail.mobile}`, rightStart + labelWidth, currentY); // Value aligned
    //     currentY += lineHeight;

    //     doc.text('S No:', rightStart, currentY);
    //     doc.text(`${testDetail.sno}`, rightStart + labelWidth, currentY); // Value aligned
    //     currentY += 4; // Space before barcode and content

    //     // Generate barcode for UHID
    //     const barcodeCanvas = document.createElement('canvas');
    //     JsBarcode(barcodeCanvas, testDetail.labReg, {
    //         format: 'CODE128',
    //         displayValue: true,
    //     });

    //     // Add barcode to PDF, aligned to the right
    //     const barcodeDataUrl = barcodeCanvas.toDataURL('image/png');
    //     doc.addImage(barcodeDataUrl, 'PNG', rightStart + labelWidth, currentY, 30, 10); // Width 30, Height 10


    //     // Horizontal line after finishing both sides
    //     const finalY = currentY + 10; // Adjust based on the height of the text and barcode
    //     doc.line(leftStart, finalY, 200, finalY); // Draw a single horizontal line from (10, finalY) to (200, finalY)
    //     currentY += 15; // Adjust based on the height of the barcode
    //     // Function to handle style and alignment
    //     const applyStyle = (node) => {
    //         let fontStyle = 'normal';
    //         let fontWeight = 'normal';

    //         if (node.tagName === 'STRONG' || node.style.fontWeight === 'bold') {
    //             fontWeight = 'bold';
    //         }
    //         if (node.tagName === 'EM' || node.style.fontStyle === 'italic') {
    //             fontStyle = 'italic';
    //         }

    //         // Set the font style in jsPDF
    //         doc.setFont(fontWeight, fontStyle); // Use setFont to set weight and style
    //     };

    //     // Function to check if new page is needed
    //     const checkAndAddPage = () => {
    //         if (currentY > maxY) {
    //             doc.addPage(); // Add a new page
    //             currentY = topMargin; // Reset Y position for new page
    //         }
    //     };

    //     // Parsing and rendering CKEditor HTML content
    //     const parseAndRenderHtml = (htmlContent) => {
    //         const parser = new DOMParser();
    //         const docElement = parser.parseFromString(htmlContent, 'text/html');
    //         const body = docElement.body;

    //         // Function to recursively process child nodes
    //         const processNode = (node) => {
    //             if (node.nodeType === Node.ELEMENT_NODE) {
    //                 const align = node.style.textAlign; // Get the text alignment directly from the style

    //                 // Default position for the text
    //                 let xPos = 10; // Default left alignment position

    //                 if (align === 'center') {
    //                     xPos = doc.internal.pageSize.width / 2; // Center align position
    //                 } else if (align === 'right') {
    //                     xPos = doc.internal.pageSize.width - 10; // Right align position
    //                 }

    //                 // Handle different tag types
    //                 if (node.tagName === 'P' || node.tagName === 'H1' || node.tagName === 'H2' || node.tagName === 'H3') {
    //                     applyStyle(node);
    //                     // Wrap text if too long
    //                     const wrappedText = doc.splitTextToSize(node.innerText.trim(), textWidth);
    //                     wrappedText.forEach(line => {
    //                         checkAndAddPage(); // Check if a new page is needed
    //                         doc.text(line, xPos, currentY, { align }); // Use the calculated x position
    //                         currentY += lineHeight; // Move to next line after paragraph
    //                     });
    //                 } else if (node.tagName === 'LI') {
    //                     const bullet = node.parentElement.tagName === 'OL' ? `${node.parentElement.children.length}. ` : '• ';

    //                     // Wrap text if too long
    //                     const wrappedText = doc.splitTextToSize(`${bullet}${node.innerText.trim()}`, textWidth);
    //                     wrappedText.forEach(line => {
    //                         checkAndAddPage(); // Check if a new page is needed
    //                         doc.text(line, xPos + 10, currentY); // Indent list items
    //                         currentY += lineHeight; // Move down for next list item
    //                     });
    //                 } else if (node.tagName === 'UL' || node.tagName === 'OL') {
    //                     // Handle unordered or ordered list
    //                     node.childNodes.forEach(processNode); // Process each <li>
    //                 }
    //             }
    //         };

    //         // Recursively process all child nodes of the body
    //         Array.from(body.childNodes).forEach(processNode);
    //     };

    //     // Call the parsing and rendering function for the result
    //     parseAndRenderHtml(result);

    //     // Return Blob for Cloudinary upload
    //     return doc.output('blob');
    // };
    const generatePrescriptionPdf = (testDetail, result) => {
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
        doc.text(`${testDetail.patientName}`, leftStart + labelWidth, currentY); // Value aligned
        currentY += lineHeight;

        doc.text('Age/Gender:', leftStart, currentY);
        doc.text(`${testDetail.age}/${testDetail.category}`, leftStart + labelWidth, currentY); // Value aligned
        currentY += lineHeight;

        doc.text('Consultant Dr:', leftStart, currentY);
        doc.text(`${testDetail.reffby || 'no'}`, leftStart + labelWidth, currentY); // Value aligned
        currentY += lineHeight;

        doc.text('Transaction Id:', leftStart, currentY);
        doc.text(`${testDetail.labReg}`, leftStart + labelWidth, currentY); // Value aligned
        currentY += 10; // Extra space before the right side

        // Right side (OPD Details)
        const rightStart = 120; // Starting X point for right text
        currentY = topMargin; // Reset Y position for the right side

        // Labels and values for right side
        doc.text('Collection Date:', rightStart, currentY);
        doc.text(`${testDetail.sampledate}`, rightStart + labelWidth, currentY); // Value aligned
        currentY += lineHeight;

        doc.text('Reporting Date:', rightStart, currentY);
        doc.text(`${testDetail.reportDate || 'No'}`, rightStart + labelWidth, currentY); // Value aligned
        currentY += lineHeight;

        doc.text('Contact No:', rightStart, currentY);
        doc.text(`${testDetail.mobile}`, rightStart + labelWidth, currentY); // Value aligned
        currentY += lineHeight;

        doc.text('S No:', rightStart, currentY);
        doc.text(`${testDetail.sno}`, rightStart + labelWidth, currentY); // Value aligned
        currentY += 4; // Space before barcode and content

        // Generate barcode for UHID
        const barcodeCanvas = document.createElement('canvas');
        JsBarcode(barcodeCanvas, testDetail.labReg, {
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
        // Function to handle text rendering with styles
        const renderStyledText = (text, x, y, alignment) => {
            const lines = doc.splitTextToSize(text, textWidth); // Wrap long text
            lines.forEach(line => {
                if (alignment === 'center') {
                    doc.text(line, x + textWidth / 2, y, { align: 'center' });
                } else if (alignment === 'right') {
                    doc.text(line, x + textWidth - 10, y, { align: 'right' });
                } else {
                    doc.text(line, x, y); // Left alignment
                }
                y += lineHeight; // Increment y for the next line
            });
            return y; // Return the new y position
        };

        // Function to check if new page is needed
        const checkAndAddPage = () => {
            if (currentY > maxY) {
                doc.addPage(); // Add a new page
                currentY = topMargin; // Reset Y position for new page
            }
        };

        // Parsing and rendering CKEditor HTML content
        const parseAndRenderHtml = (htmlContent) => {
            const parser = new DOMParser();
            const docElement = parser.parseFromString(htmlContent, 'text/html');
            const body = docElement.body;

            // Function to recursively process child nodes
            const processNode = (node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const align = node.style.textAlign; // Get the text alignment directly from the style
                    let textAlign = 'left'; // Default to left

                    if (align === 'center') {
                        textAlign = 'center';
                    } else if (align === 'right') {
                        textAlign = 'right';
                    }

                    // Handle different tag types
                    if (node.tagName === 'P' || node.tagName === 'H1' || node.tagName === 'H2' || node.tagName === 'H3') {
                        // Extract text with style
                        let innerText = '';
                        const childNodes = Array.from(node.childNodes);
                        childNodes.forEach(child => {
                            if (child.nodeType === Node.TEXT_NODE) {
                                currentY += 4;
                                innerText += child.textContent; // Regular text
                            } else if (child.nodeType === Node.ELEMENT_NODE) {
                                if (child.tagName === 'STRONG') {
                                    doc.setFont('helvetica', 'bold'); // Set font to bold
                                    currentY += 4;
                                    innerText += child.textContent; // Bold text
                                    doc.setFont('helvetica', 'normal'); // Reset to normal
                                } else {
                                    currentY += 4;
                                    innerText += child.textContent; // Normal text
                                }
                            }
                        });

                        checkAndAddPage(); // Check if a new page is needed
                        currentY = renderStyledText(innerText, 10, currentY, textAlign); // Render the paragraph
                    } else if (node.tagName === 'LI') {
                        const bullet = node.parentElement.tagName === 'OL' ? `${node.parentElement.children.length}. ` : '• ';
                        const listText = bullet + node.innerText.trim();

                        checkAndAddPage(); // Check if a new page is needed
                        currentY = renderStyledText(listText, 10, currentY, textAlign); // Render the list item
                    } else if (node.tagName === 'UL' || node.tagName === 'OL') {
                        node.childNodes.forEach(processNode); // Process each <li>
                    }
                }
            };

            // Recursively process all child nodes of the body
            Array.from(body.childNodes).forEach(processNode);
        };

        // Call the parsing and rendering function for the result
        parseAndRenderHtml(result);

        // Return Blob for Cloudinary upload
        return doc.output('blob');
    };





    const handleSubmit = async (e) => {
        e.preventDefault();

        // Debugging form data before submission
        console.log("Submitting form data:", formData);
        console.log("Submitting form data:", testDetail[0]);

        try {
            const prescriptionPdfBlob = generatePrescriptionPdf(testDetail[0], formData.result);

            // Upload PDFs to Cloudinary
            const prescriptionPdfUrl = await uploadPdfToCloudinary(prescriptionPdfBlob, 'prescription.pdf');

            // Create documents array with URLs and document types
            const documents = [
                {
                    url: prescriptionPdfUrl,
                    documentType: 'testreport',
                    uploadedAt: new Date(),
                }
            ];
            // First, submit the form data with a POST request
            const response = await fetch('https://khmc-xdlm.onrender.com/api/testResult', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    TestlablogId: id, // Assuming 'id' is the correct identifier
                    documents
                })
            });

            if (response.ok) {
                const newTest = await response.json();
                alert('Comment submitted successfully!');
                console.log("After submission:", newTest);

                // Now, send the PUT request to update the result field after successful POST
                const updateResult = await fetch(`https://khmc-xdlm.onrender.com/api/UpdateResultlabEntry/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ result: true }) // Update 'result' to true
                });

                // Check if the result update was successful
                if (updateResult.ok) {
                    alert('Result Value updated successfully!');
                    console.log('Result updated successfully.');

                    // Clear the form after both requests are successful
                    setFormData({
                        TestlablogId: '',
                        result: '',
                    });

                    // Optionally redirect or refresh
                    // navigate('/master/testlist') 
                } else {
                    alert('Failed to update lab entry result.');
                    console.error('Error updating result:', await updateResult.text());
                }
            } else {
                // Handle POST request failure
                alert('Failed to submit comment data');
                console.error('Error submitting form data:', await response.text());
            }
        } catch (error) {
            // Handle network or unexpected errors
            console.error('Error submitting test data:', error);
            alert('An error occurred while submitting the data.');
        }
    };


    return (
        <>
            <Topbar />

            <div className="container-fluid p-0 page-body-wrapper">
                {/* <SideNavbar /> */}
                <div className="main-panel">
                    <div className="content-wrapper">
                        <div className="page-header">
                            <h3 className="page-title">
                                <span className="page-title-icon bg-gradient-primary text-white me-2">
                                    <i className="mdi mdi-home"></i>
                                </span>
                                Result Report
                            </h3>
                        </div>

                        <div className="row">
                            <div className="card">
                                <div className="card-body">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Sno</th>
                                                <th>Test</th>
                                                <th>Normal Value</th>
                                                <th>Result</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {testDetail.map((labtest, index) => (
                                                <tr key={labtest._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{labtest.tests}</td>
                                                    <td>Normal Value</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-danger text-dark"
                                                            onClick={fetchTestComments}  // Trigger fetching comments
                                                        >
                                                            Show Comment
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <form onSubmit={handleSubmit}>
                                        <div className='row'>
                                            <div className="col-12">

                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    name="Comments"
                                                    data={testComments} // Set the fetched comments here
                                                    config={{
                                                        plugins: [
                                                            Essentials, Bold, Italic, Underline, Heading, Alignment, List, Paragraph, Undo
                                                        ],
                                                        toolbar: [
                                                            'heading', '|', 'bold', 'italic', 'underline', '|', 'alignment', '|', 'bulletedList', 'numberedList', '|', 'undo', 'redo'
                                                        ]
                                                    }}
                                                    onChange={handleChange1} // Update state on change
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary mt-3">Submit</button>
                                        {testResults.length > 0 && testResults[0]?.documents?.find(doc => doc.documentType === 'testreport')?.url ? (
                                            <a
                                                href={testResults[0].documents.find(doc => doc.documentType === 'testreport')?.url}
                                                className="btn btn-gradient-primary mt-3 mx-2"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Print
                                            </a>
                                        ) : null}

                                    </form>
                                </div>
                            </div>
                        </div>

                     
                    </div>
                </div>
            </div>
        </>
    );
};

export default LablogResult;
