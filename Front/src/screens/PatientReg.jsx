import React, { useEffect, useState } from 'react';
import SideNavbar from '../component/SideNavbar';
import Topbar from '../component/TopNavBar';
import jsPDF from 'jspdf';
import JsBarcode from 'jsbarcode';
import { useNavigate } from 'react-router-dom';
import logo from '../../public/lgo.webp'

// Modal component to show the popup
const Modal = ({ isOpen, onClose, patients }) => {
    const [loading, setLoading] = useState(false);
    const fetchLatestOpdNo = async () => {
        try {
            // Make an API call to fetch the patient numbers
            const response = await fetch('https://khmc-xdlm.onrender.com/api/patientslogsNumber');

            // Check if the request was successful
            if (!response.ok) {
                throw new Error('Failed to fetch patient numbers');
            }

            // Parse the response as JSON
            const data = await response.json();

            // Check if data is not empty
            if (data.length === 0) {
                throw new Error('No patient data available');
            }

            // Extract the latest opdno (from the last entry in the list)
            // Extract the latest opdno and add 1 to it
            const latestOpdno = parseInt(data[data.length - 1].opdno) + 1;
            console.log('New OPD No:', latestOpdno);



            // Return the latest opdno
            return latestOpdno;
        } catch (error) {
            console.error('Error fetching the latest OPD number:', error.message);
            return null; // Return null in case of an error
        }
    };
    // Function to handle patient selection and update opdno
    const handlePatientSelection = async (patient) => {
        setLoading(true); // Show loading indicator
        try {
            const newOpdno = await fetchLatestOpdNo(); // Fetch the latest opdno and add 1
            if (newOpdno) {
                const updatedPatient = {
                    ...patient,
                    opdno: newOpdno, // Update the patient's opdno with the new value
                };
                onClose(updatedPatient); // Pass the updated patient to the parent
            }
        } catch (error) {
            console.error('Failed to update patient OPD number:', error);
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    if (!isOpen) return null; // Don't render if the modal is not open

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Select a Patient</h3>
                {console.log(patients, "Patients List")}

                {loading ? (
                    <p>Loading...</p> // Show a loading message while fetching data
                ) : (
                    <ul>
                        {patients.map((patient, index) => (
                            <li key={index}>
                                <button onClick={() => handlePatientSelection(patient)}>
                                    {patient.patientName}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                <button className="close-button" onClick={() => onClose(null)}>Close</button>
            </div>
        </div>
    );
};


const PatientReg = () => {
    const [patientType, setPatientType] = useState(''); // State to track the selected patient type
    const [error, setError] = useState('')
    const [Loading, setLoading] = useState('')
    const [FetchBtnLoading, setFetchBtnLoading] = useState('')
    const [btnLoading, setbtnLoading] = useState('')
    const [Gender, setGender] = useState('')
    const [BillNumber, setBillNumber] = useState('')
    const [Department, setDepartment] = useState([])
    const [Doctor, setDoctor] = useState([])
    const [Reffby, setReffby] = useState([])
    const [Religion, setReligion] = useState([])
    const [dataFetched, setDataFetched] = useState(false)
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patients, setPatients] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState([]);
    const [findFormData, setfindFormData] = useState({ uhid: '', mobile: '' });


    const [formData, setFormData] = useState({
        uhid: '',
        sno: '',
        uhidprefix: 'KHMC/',
        mobile: '',
        date: '',
        opdno: 'KHMC/',
        email: '',
        status: '',
        patientName: '',
        gStatus: '',
        guardianName: '',
        guardianNumber: '',
        address: '',
        city: '',
        gender: '',
        religion: '',
        age: '',
        agetype: '',
        refBy: '',
        type: '',
        department: '',
        refTo: '',
        identStatus: '',
        identity: '',
        items: [
            { particular: 'Consultaion Fee on : 26/08/2024', quantity: 1, rate: 150, amount: 150 }
        ],
        visitType: '',
        paymentType: '',
        discountType: '',
        discount: '',
        remarks: '',
        total: 150,
        received: 150,
        refund: 0,
    });
    const [OldformData, setoldFormData] = useState({
        uhid: '',
        sno: '',
        uhidprefix: 'KHMC/',
        mobile: '',
        date: '',
        opdno: 'KHMC/',
        email: '',
        status: '',
        patientName: '',
        gStatus: '',
        guardianName: '',
        guardianNumber: '',
        address: '',
        city: '',
        gender: '',
        religion: '',
        age: '',
        agetype: '',
        refBy: '',
        type: '',
        department: '',
        refTo: '',
        identStatus: '',
        identity: '',
        items: [
            { particular: 'Consultaion Fee on : 26/08/2024', quantity: 1, rate: 150, amount: 150 }
        ],
        visitType: '',
        paymentType: '',
        discountType: '',
        discount: '',
        remarks: '',
        total: '',
        recived: '',
        refund: '',
    });

    const billnogen = async () => {
        try {
            // Fetch existing bills to determine the latest billNo
            const billsResponse = await fetch('https://khmc-xdlm.onrender.com/api/bills');
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


    const navigate = useNavigate();
    const fetchSequenceNumbers = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://khmc-xdlm.onrender.com/api/patientsNumber');
            if (response.ok) {
                const data = await response.json();
                let nextUhid = 11001; // Default UHID
                let nextOpdno = 22001; // Default OPD No
                let sno = ''; // Default Serial Number

                // Get today's date
                const today = new Date();
                const todayString = today.toLocaleDateString('en-GB').replace(/\//g, '-'); // Format as dd-mm-yyyy
                let lastDate = todayString; // To keep track of the last date

                if (data.length > 0) {
                    const latestPatient = data[data.length - 1];
                    nextUhid = parseInt(latestPatient.uhid) + 1;
                    nextOpdno = parseInt(latestPatient.opdno) + 1;

                    // Check if the last entry is from today
                    const lastEntryDate = latestPatient.sno.split(' - ')[0]; // Extract the date part
                    if (lastEntryDate === todayString) {
                        // Increment the serial number based on the last entry
                        const lastSerialNumber = parseInt(latestPatient.sno.split(' - ')[1]);
                        sno = `${todayString} - ${String(lastSerialNumber + 1).padStart(3, '0')}`;
                    } else {
                        // Reset for a new day
                        sno = `${todayString} - 001`;
                    }
                } else {
                    // If there are no entries, start with default values
                    sno = `${todayString} - 001`;
                }

                // Update form data based on patient type
                if (patientType === 'new') {
                    const fetchOPDnumber = await fetchLatestOpdNo()
                    setFormData((prevData) => ({
                        ...prevData, // Spread the previous data
                        uhid: `${nextUhid}`,  // Update UHID
                        opdno: fetchOPDnumber, // Update OPD No
                        sno: sno  // Update Serial Number
                    }));

                } else if (patientType === 'old') {
                    // setoldFormData((prevData) => ({
                    //     ...prevData, // Spread the previous data
                    //     uhid: `${nextUhid}`,  // Update UHID
                    //     opdno: `${nextOpdno}`, // Update OPD No
                    //     sno: sno  // Update Serial Number
                    // }));

                }
                setLoading(false);
            } else {
                throw new Error('Failed to fetch sequence numbers');
            }
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };


    const fetchLatestOpdNo = async () => {
        try {
            // Make an API call to fetch the patient numbers
            const response = await fetch('https://khmc-xdlm.onrender.com/api/patientslogsNumber');

            // Check if the request was successful
            if (!response.ok) {
                throw new Error('Failed to fetch patient numbers');
            }

            // Parse the response as JSON
            const data = await response.json();

            // Check if data is not empty
            if (data.length === 0) {
                throw new Error('No patient data available');
            }

            // Extract the latest opdno (from the last entry in the list)
            // Extract the latest opdno and add 1 to it
            const latestOpdno = parseInt(data[data.length - 1].opdno) + 1;
            console.log('New OPD No:', latestOpdno);



            // Return the latest opdno
            return latestOpdno;
        } catch (error) {
            console.error('Error fetching the latest OPD number:', error.message);
            return null; // Return null in case of an error
        }
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
    const generatePrescriptionPdf = (formData) => {
        const doc = new jsPDF();

        // Add 60px space from the top
        const topMargin = 60;

        // Set font size to 10
        doc.setFontSize(10);

        // Left side (Patient Details)
        const leftStart = 10; // Starting X point for left text
        const labelWidth = 40; // Define a constant width for the labels
        let currentY = topMargin;

        // Labels and values for left side
        doc.text('Patient Name:', leftStart, currentY);
        doc.text(`${formData.patientName}`, leftStart + labelWidth, currentY); // Value aligned
        currentY += 5;

        doc.text('Age/Gender:', leftStart, currentY);
        doc.text(`${formData.age}/${formData.gender}`, leftStart + labelWidth, currentY); // Value aligned
        currentY += 5;

        doc.text('Consultant Dr:', leftStart, currentY);
        doc.text(`${formData.refTo}`, leftStart + labelWidth, currentY); // Value aligned
        currentY += 5;

        doc.text('Address:', leftStart, currentY);
        doc.text(`${formData.address}`, leftStart + labelWidth, currentY); // Value aligned

        // Right side (OPD Details)
        const rightStart = 120; // Starting X point for right text
        currentY = topMargin; // Reset Y position for the right side

        // Labels and values for right side
        doc.text('Opd No:', rightStart, currentY);
        doc.text(`${formData.opdno}`, rightStart + labelWidth, currentY); // Value aligned
        currentY += 5;

        doc.text('UHID No:', rightStart, currentY);
        doc.text(`${formData.uhid}`, rightStart + labelWidth, currentY); // Value aligned
        currentY += 5;

        doc.text('Contact No:', rightStart, currentY);
        doc.text(`${formData.mobile}`, rightStart + labelWidth, currentY); // Value aligned
        currentY += 5; // Add some space before barcode

        doc.text('S No:', rightStart, currentY);
        doc.text(`${formData.sno}`, rightStart + labelWidth, currentY); // Value aligned
        currentY += 1; // Add some space before barcode

        // Generate barcode for UHID
        const barcodeCanvas = document.createElement('canvas');
        JsBarcode(barcodeCanvas, formData.uhid, {
            format: 'CODE128',
            displayValue: true,
        });

        // Add barcode to PDF, aligned to the right
        const barcodeDataUrl = barcodeCanvas.toDataURL('image/png');
        // const barcodeX = doc.internal.pageSize.width - 10 - 30; // Right-aligned
        doc.addImage(barcodeDataUrl, 'PNG', rightStart + labelWidth, currentY, 30, 10); // Width 30, Height 10

        // Horizontal line after finishing both sides
        const finalY = currentY + 10; // Adjust based on the height of the text and barcode
        doc.line(leftStart, finalY, 200, finalY); // Draw a single horizontal line from (10, finalY) to (200, finalY)

        // Return Blob for Cloudinary upload
        return doc.output('blob');
    };

    // Handle the change for both formData and selectedDoctor
    const handleDoctorChange = (e) => {
        const selectedDoctorName = e.target.value;
        console.log(Doctor, selectedDoctorName);



        // Find the selected doctor object based on the selected name
        const selectedDoctorObj = Doctor.find(doctor => doctor.doctorname === selectedDoctorName);
        patientType === 'new'
            ?
            setFormData(prevState => ({
                ...prevState,
                refTo: selectedDoctorName
            }))
            :
            setoldFormData(prevState => ({
                ...prevState,
                refTo: selectedDoctorName
            }))
        // Update the formData state for refTo
        // setFormData(prevState => ({
        //     ...prevState,
        //     refTo: selectedDoctorName
        // }));


        // Update the selectedDoctor state with the selected doctor object
        setSelectedDoctor(selectedDoctorObj || {});
    };


    // Utility function to convert numbers into words (for the total amount)
    const numberToWords = (num) => {
        const a = [
            '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
            'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
        ];
        const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

        const inWords = (num) => {
            if (num < 20) return a[num];
            if (num < 100) return b[Math.floor(num / 10)] + (num % 10 ? ' ' + a[num % 10] : '');
            if (num < 1000) return a[Math.floor(num / 100)] + ' hundred' + (num % 100 ? ' ' + inWords(num % 100) : '');
            if (num < 1000000) return inWords(Math.floor(num / 1000)) + ' thousand' + (num % 1000 ? ' ' + inWords(num % 1000) : '');
            return 'Amount too large';
        };
        return inWords(num) + ' only';
    };

    const generateReceiptPdf = () => {
        console.log(patientType, "patientType");

        // Select form data based on patient type
        const selectedFormData = patientType === 'new' ? formData : OldformData;

        console.log(typeof selectedFormData.emergencyfee, "selectedFormData");
        const applyFee = selectedFormData.visitType == 'Emergency' ? selectedDoctor.emergencyfee.toString() : selectedDoctor.consfee.toString()

        const doc = new jsPDF();

        const pageWidth = doc.internal.pageSize.getWidth();
        const centerX = pageWidth / 2;

        // Set general font size
        doc.setFontSize(12);

        // Add logo
        const logoUrl = { logo };
        const logoWidth = 30;
        const logoHeight = 30;
        // doc.addImage(logoUrl, 'JPEG', 10, 10, logoWidth, logoHeight);

        // Clinic Name and Address - Center Aligned with Border
        doc.setFontSize(14);
        doc.setFont('bold');
        doc.text('KAISHVI HEALTH & MATERNITY CENTRE', centerX, 20, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont('normal');
        doc.text('Nehru Nagar, Ward No.:1, Pharenda Road, Maharajganj (U.P.)', centerX, 28, { align: 'center' });
        doc.text('E-mail: info@kaishvihospital.com   www.kaishvihospital.com', centerX, 35, { align: 'center' });
        doc.text('Mob.No: 8948150069', centerX, 42, { align: 'center' });

        // Header Border
        doc.rect(10, 10, pageWidth - 20, 40); // Creates a border around the header content

        // Bill Title
        doc.setFontSize(16);
        doc.setFont('bold');
        doc.text('BILL', centerX, 60, { align: 'center' });

        // Patient Details Section - Left Aligned with Borders
        doc.setFontSize(12);
        const leftMargin = 10;
        let currentY = 70;

        // Patient Details
        doc.text(`Patient Name: ${selectedFormData.patientName}`, leftMargin, currentY);
        doc.text(`Bill No: ${BillNumber}`, leftMargin + 120, currentY); // Right-aligned text
        currentY += 7;
        doc.text(`Age/Gender: ${selectedFormData.age}/${selectedFormData.gender}`, leftMargin, currentY);
        doc.text(`Bill Date: ${new Date().toLocaleDateString('en-GB')}`, leftMargin + 120, currentY); // Format: dd/mm/yyyy
        currentY += 7;
        doc.text(`Consultant Dr.: ${selectedDoctor.doctorname}`, leftMargin, currentY);
        doc.text(`UHID: ${selectedFormData.uhid}`, leftMargin + 120, currentY); // Right-aligned text
        currentY += 7;
        doc.text(`Address: ${selectedFormData.address}`, leftMargin, currentY);
        currentY += 7;
        doc.text(`Ref. by: ${selectedFormData.refBy}`, leftMargin, currentY);
        doc.text(`CARE TYPE: ${selectedFormData.careType || ''}  `, leftMargin + 120, currentY); // Right-aligned text
        currentY += 10;

        // Table Heading with background color and border
        doc.setFillColor(200, 200, 200); // Light grey background color for table heading
        doc.rect(leftMargin, currentY, pageWidth - 20, 7, 'F'); // Background fill for heading

        // Table Header Text
        doc.setFont('bold');
        doc.text('S/No', leftMargin + 2, currentY + 5);
        doc.text('Particular', leftMargin + 20, currentY + 5);
        doc.text('Quantity', leftMargin + 80, currentY + 5);
        doc.text('Rate', leftMargin + 120, currentY + 5);
        doc.text('Amount', leftMargin + 160, currentY + 5);
        currentY += 7;

        doc.rect(leftMargin, currentY, pageWidth - 20, 7); // Border around each row
        doc.setFont('normal');
        doc.text(`1`, leftMargin + 2, currentY + 5);
        doc.text(`Consultaion Fee`, leftMargin + 20, currentY + 5);
        doc.text(`1`, leftMargin + 80, currentY + 5);
        doc.text(applyFee, leftMargin + 120, currentY + 5);
        // doc.text(applyFee, leftMargin + 120, currentY + 5);
        doc.text(applyFee, leftMargin + 160, currentY + 5);
        currentY += 7;



        // Total, Received, Refund
        currentY += 10;
        doc.setFont('bold');
        doc.text(`Total: ${applyFee}`, leftMargin + 120, currentY);
        currentY += 7;
        doc.text(`Received: ${applyFee - selectedFormData.discount.toString()}`, leftMargin + 120, currentY);
        currentY += 7;
        doc.text(`Refund: 0`, leftMargin + 120, currentY);
        currentY += 10;

        // Amount in Words
        const totalInWords = numberToWords(formData.total);
        doc.setFont('normal');
        doc.text(`Amount Payable in words: ${totalInWords}`, leftMargin, currentY);
        currentY += 15;

        // Signature Section - Right Aligned with Margin before it
        currentY += 10; // Add margin before the signature
        doc.setFont('bold');
        doc.text('Authorised Sign.', leftMargin + 150, currentY);

        // Return the PDF as a Blob (for Cloudinary upload or download)
        return doc.output('blob');
    };
    // Updated createBill function to accept patientId as a parameter
    const createBill = async (patientId) => {
        setLoading(true);

        try {

            // Select form data based on patient type
            const selectedFormData = patientType === 'new' ? formData : OldformData;

            const billDetails = {
                billNo: BillNumber, // Generate the new billNo
                patientId: patientId, // Inject the patientId here
                patientName: selectedFormData.patientName,
                mobile: selectedFormData.mobile,
                email: selectedFormData.email,
                total: selectedDoctor.consfee,
                received: selectedFormData.discount === '0' ? '0' : selectedDoctor.consfee - selectedFormData.discount,
                refund: selectedDoctor.refund,
                discount: selectedFormData.discount,
                paymentType: selectedFormData.paymentType,
                visitType: selectedFormData.visitType,
            };

            // Send the request to create the bill
            const response = await fetch('https://khmc-xdlm.onrender.com/api/bills', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(billDetails)
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to create bill: ${errorMessage}`);
            }

            const data = await response.json();
            console.log('Bill created successfully:', data);
            alert('Bill created successfully!');

        } catch (error) {
            console.error('Error creating bill:', error);
            alert('Error creating bill: ' + error.message);
        } finally {
            setLoading(false); // Stop loading state
        }
    };



    const generateTokenPdf = (formData) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Set font size
        doc.setFontSize(12);

        // Define margins and positions
        const margin = 20;
        const startY = 40; // Start position for the content

        // Draw border around the content area
        doc.rect(margin, startY - margin, pageWidth - margin * 2, 70); // Border

        // Centered Text and Barcode
        const centerX = pageWidth / 2;

        // Add token information centered
        doc.text(`Red No: ${formData.opdno}`, centerX, startY, { align: 'center' });

        // Generate barcode for UHID
        const barcodeCanvas = document.createElement('canvas');
        JsBarcode(barcodeCanvas, formData.uhid, {
            format: 'CODE128',
            displayValue: false,
        });

        // Add barcode to PDF, centered
        const barcodeDataUrl = barcodeCanvas.toDataURL('image/png');
        const barcodeWidth = 30;  // Reduced width
        const barcodeHeight = 10;   // Reduced height
        const barcodeX = centerX - barcodeWidth / 2; // Center the barcode
        doc.addImage(barcodeDataUrl, 'PNG', barcodeX, startY + 5, barcodeWidth, barcodeHeight);

        // Add patient details centered
        doc.text(`Patient Name: ${formData.patientName}`, centerX, startY + 20, { align: 'center' });
        doc.text(`Age: ${formData.age}`, centerX, startY + 25, { align: 'center' });
        doc.text(`Consultant Dr: ${formData.refTo}`, centerX, startY + 30, { align: 'center' });

        return doc.output('blob'); // Return Blob for Cloudinary upload
    };


    useEffect(() => {


        const fetchData = async () => {
            try {
                // Run all API requests in parallel
                const [genderResponse, religionResponse, departmentResponse, doctorResponse, reffbyResponse] = await Promise.all([
                    fetch("https://khmc-xdlm.onrender.com/api/category"),
                    fetch("https://khmc-xdlm.onrender.com/api/religion"),
                    fetch("https://khmc-xdlm.onrender.com/api/department"),
                    fetch("https://khmc-xdlm.onrender.com/api/doctor"),
                    fetch("https://khmc-xdlm.onrender.com/api/reffby"),
                ]);

                // Parse the JSON responses
                const [genderData, religionData, departmentData, doctorData, reffbyData] = await Promise.all([
                    genderResponse.json(),
                    religionResponse.json(),
                    departmentResponse.json(),
                    doctorResponse.json(),
                    reffbyResponse.json()
                ]);

                // Log the type of each response to verify it's an array
                console.log("Gender Data:", genderData);
                console.log("Religion Data:", religionData);
                console.log("Department Data:", departmentData);
                console.log("Doctor Data:", doctorData);
                console.log("Reff Data:", reffbyData);

                // Set the state with the fetched data
                setGender(genderData);
                setReligion(religionData);
                setDepartment(departmentData);
                setReffby(reffbyData);
                setDoctor(doctorData);

                // Stop the loading state when all data is fetched
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false); // Stop the loading even in case of error
            }
        };

        fetchData();
        fetchSequenceNumbers();
        billnogen()


    }, [patientType]);
    // Handler for changing patient type
    const handlePatientTypeChange = (e) => {
        setPatientType(e.target.value);
        console.log(e.target.value);

    };



    // Function to handle API call when UHID or mobile is entered
    const fetchPatientData = async () => {
        console.log("Fetched Data:");
        if (!findFormData.uhid && !findFormData.mobile) {
            alert('Please enter either UHID or Mobile Number.')
            setError('Please enter either UHID or Mobile Number.');
            return;
        }
        setFetchBtnLoading(true);
        try {

            console.log(findFormData, "Data Old", findFormData.uhid, findFormData.mobile);

            // Make a POST request with the form data (UHID or Mobile)
            const response = await fetch('https://khmc-xdlm.onrender.com/api/patientsearch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(findFormData),
            });

            const data = await response.json();
            console.log("Fetched Data:", data);
            if (response.ok && data.length > 0) {
                if (data.length > 1) {
                    setPatients(data); // Store all the patients if more than one is returned
                    setIsModalOpen(true); // Open the modal for selection
                    setFetchBtnLoading(false);
                } else {
                    console.log(await fetchLatestOpdNo(), "Elese Part Check")
                    const fetchOPDnumber = await fetchLatestOpdNo()
                    setoldFormData(() => ({
                        ...data[0],
                        opdno: fetchOPDnumber
                    })); // Automatically fill the form with the first patient's data
                    // setoldFormData(data[0]); // Automatically fill the form with the first patient's data
                    setDataFetched(true);
                    setFetchBtnLoading(false);
                }
            } else {
                setError('No patients found.');
            }
        } catch (error) {
            setError('Failed to fetch patient data.');
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = (selectedPatient) => {
        if (selectedPatient) {
            setoldFormData(selectedPatient); // Populate oldFormData with the selected patient's data
            setDataFetched(true); // Indicate that data has been fetched and populated
        }
        setIsModalOpen(false); // Close the modal
    };
    const oldhandleChange = (e) => {
        const { name, value } = e.target;

        setoldFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const findhandleChange = (e) => {
        const { name, value } = e.target;

        setfindFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const oldEntriesSubmit = async (e) => {
        e.preventDefault();
        setbtnLoading(true);

        const selectedFormData = patientType === 'new' ? formData : OldformData;

        try {
            // Generate PDFs
            const prescriptionPdfBlob = generatePrescriptionPdf(selectedFormData);
            const tokenPdfBlob = generateTokenPdf(selectedFormData);
            const receiptPdfBlob = generateReceiptPdf(selectedFormData);

            // Upload PDFs to Cloudinary
            const prescriptionPdfUrl = await uploadPdfToCloudinary(prescriptionPdfBlob, 'prescription.pdf');
            const tokenPdfUrl = await uploadPdfToCloudinary(tokenPdfBlob, 'token.pdf');
            const receiptPdfUrl = await uploadPdfToCloudinary(receiptPdfBlob, 'receipt.pdf');

            console.log(OldformData, "selectedFormData");

            // Create documents array with URLs and document types
            const documents = [
                {
                    url: prescriptionPdfUrl,
                    documentType: 'prescription',
                    uploadedAt: new Date(),
                },
                {
                    url: tokenPdfUrl,
                    documentType: 'token',
                    uploadedAt: new Date(),
                },
                {
                    url: receiptPdfUrl,
                    documentType: 'receipt',
                    uploadedAt: new Date(),
                },
            ];

            console.log(selectedFormData, "From old Entries");

            // Create a copy of selectedFormData and remove the _id key
            const { _id, ...formDataWithoutId } = selectedFormData;

            // Submit form data with Cloudinary URLs
            const response = await fetch('https://khmc-xdlm.onrender.com/api/patientlogs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formDataWithoutId, // Send the formData without _id
                    documents,
                    patientId: _id // Pass _id separately if needed
                }),
            });

            if (response.ok) {
                const patientData = await response.json();
                console.log("patientData", patientData);
                createBill(patientData.data._id);
                alert('Patient data submitted in Ledger successfully!');
            } else {
                alert('Failed to submit patient data');
            }
        } catch (error) {
            console.error('Error submitting patient data:', error);
        } finally {
            setbtnLoading(false);
        }
    }
    // Handle form submission
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setbtnLoading(true);

    //     // Select form data based on patient type
    //     const selectedFormData = patientType === 'new' ? formData : OldformData;

    //     try {
    //         // Generate PDFs
    //         const prescriptionPdfBlob = generatePrescriptionPdf(selectedFormData);
    //         const tokenPdfBlob = generateTokenPdf(selectedFormData);
    //         const receiptPdfBlob = generateReceiptPdf(selectedFormData);

    //         // Upload PDFs to Cloudinary
    //         const prescriptionPdfUrl = await uploadPdfToCloudinary(prescriptionPdfBlob, 'prescription.pdf');
    //         const tokenPdfUrl = await uploadPdfToCloudinary(tokenPdfBlob, 'token.pdf');
    //         const receiptPdfUrl = await uploadPdfToCloudinary(receiptPdfBlob, 'token.pdf');

    //         console.log(selectedFormData, "selectedFormData");
    //         // Create documents array with URLs and document types
    //         const documents = [
    //             {
    //                 url: prescriptionPdfUrl,
    //                 documentType: 'prescription',
    //                 uploadedAt: new Date(),
    //             },
    //             {
    //                 url: tokenPdfUrl,
    //                 documentType: 'token',
    //                 uploadedAt: new Date(),
    //             },
    //             {
    //                 url: receiptPdfUrl,
    //                 documentType: 'receipt',
    //                 uploadedAt: new Date(),
    //             },
    //         ];



    //         // Submit form data with Cloudinary URLs
    //         const response = await fetch('https://khmc-xdlm.onrender.com/api/patients', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 ...selectedFormData,
    //                 documents,
    //             }),
    //         });

    //         if (response.ok) {
    //             const patientData = await response.json();
    //             console.log("patientData", patientData);
    //             createBill(patientData.data._id)
    //             // await createBill(patientId);
    //             alert('Patient data submitted successfully!');
    //             // navigate("/master/patientlist");
    //         } else {
    //             alert('Failed to submit patient data');
    //         }
    //     } catch (error) {
    //         console.error('Error submitting patient data:', error);
    //     }
    //     finally {
    //         setbtnLoading(false)
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setbtnLoading(true);
    
        // Select form data based on patient type
        const selectedFormData = patientType === 'new' ? formData : OldformData;
    
        try {
            // Generate PDFs
            const prescriptionPdfBlob = generatePrescriptionPdf(selectedFormData);
            const receiptPdfBlob = generateReceiptPdf(selectedFormData);
    
            // Convert the Blob to Object URLs for prescription and receipt
            const prescriptionPdfUrl = URL.createObjectURL(prescriptionPdfBlob);
            const receiptPdfUrl = URL.createObjectURL(receiptPdfBlob);
    
            // Open the PDFs in a new tab for printing
            const prescriptionWindow = window.open(prescriptionPdfUrl);
            const receiptWindow = window.open(receiptPdfUrl);
    
            // You can upload to Cloudinary or your server if needed (omitted for brevity)
            const documents = [
                {
                    url: prescriptionPdfUrl, // URL for Cloudinary or your server
                    documentType: 'prescription',
                    uploadedAt: new Date(),
                },
                {
                    url: receiptPdfUrl,
                    documentType: 'receipt',
                    uploadedAt: new Date(),
                },
            ];
    
            // Submit form data to patients API (same as your original code)
            const response = await fetch('https://khmc-xdlm.onrender.com/api/patients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...selectedFormData,
                    documents,
                }),
            });
    
            if (response.ok) {
                const patientData = await response.json();
                console.log("patientData", patientData);
                createBill(patientData.data._id);
                const { _id, ...formDataWithoutId } = patientData.data;
                console.log("formDataWithoutId:", _id, formDataWithoutId);
    
                // Log entry in patient logs after patient creation
                await fetch('https://khmc-xdlm.onrender.com/api/patientlogs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        patientId: _id,
                        ...formDataWithoutId,
                    }),
                });
                  // Wait for the windows to load, then trigger the print dialog
            prescriptionWindow.onload = () => {
                prescriptionWindow.print(); // Automatically opens the print dialog
            };
    
            receiptWindow.onload = () => {
                receiptWindow.print(); // Automatically opens the print dialog
            };
    
                // Redirect to the patient list page after successful submission
                navigate('/master/patientlist');
            } else {
                alert('Failed to submit patient data');
            }
        } catch (error) {
            console.error('Error submitting patient data:', error);
        } finally {
            setbtnLoading(false);
        }
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
                                Patient Registration {formData.sno}
                            </h3>
                            <nav aria-label="breadcrumb">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item active" aria-current="page">
                                        <span></span>Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
                                    </li>
                                </ul>
                            </nav>
                        </div>

                        <div className="row">
                            <div className="col-12 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="forms-sample" onSubmit={handleSubmit}>
                                            <div className="form-group row">
                                            <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                    <label htmlFor="patientType">Patient Type</label>
                                                    <select
                                                        className="form-control"
                                                        id="patientType"
                                                        value={patientType}
                                                        onChange={handlePatientTypeChange}
                                                    >
                                                        <option value="">Select Patient Type</option>
                                                        <option value="new">New Patient</option>
                                                        <option value="old">Old Patient</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {patientType === 'old' && (
                                                <>

                                                    <div className="form-group row">
                                                        {dataFetched
                                                            ?
                                                            <>
                                                                {/* <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                                    <label htmlFor="uhid">UHID f</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="uhid"
                                                                        name="uhid"

                                                                        value={OldformData.uhid}
                                                                        onChange={oldhandleChange}
                                                                        placeholder="Enter UHID"
                                                                    />
                                                                </div>
                                                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                                    <label htmlFor="mobilenumber">Mobile Number</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="mobilenumber"
                                                                        name="mobile"

                                                                        value={OldformData.mobile}
                                                                        onChange={oldhandleChange}
                                                                        placeholder="Enter Mobile Number"
                                                                    />
                                                                </div> */}
                                                            </>

                                                            :

                                                            <>

                                                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                                    <label htmlFor="uhid">UHID w</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="uhid"
                                                                        name="uhid"
                                                                        onChange={findhandleChange}
                                                                        placeholder="Enter UHID"
                                                                    />
                                                                </div>
                                                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                                    <label htmlFor="mobilenumber">Mobile Number</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="mobilenumber"
                                                                        name="mobile"
                                                                        onChange={findhandleChange}
                                                                        placeholder="Enter Mobile Number"
                                                                    />
                                                                </div>
                                                            </>

                                                        }




                                                        {dataFetched && (
                                                            <>
                                                                {console.log(OldformData, "OldformData")}


                                                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                                    <label htmlFor="uhid">UHID O</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="uhid"
                                                                        name="uhid"
                                                                        value={OldformData.uhid}
                                                                        onChange={oldhandleChange}
                                                                        placeholder="Enter UHID"
                                                                    />
                                                                </div>
                                                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                                    <label htmlFor="mobilenumber">Mobile Number </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="mobilenumber"
                                                                        name="mobile"
                                                                        value={OldformData.mobile}
                                                                        onChange={oldhandleChange}
                                                                        placeholder="Enter Mobile Number"
                                                                    />
                                                                </div>

                                                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                                    <label htmlFor="date">Date</label>
                                                                    <input
                                                                        type="date"
                                                                        value={OldformData.date}
                                                                        name="date"
                                                                        onChange={oldhandleChange}
                                                                        className="form-control"
                                                                        id="date"
                                                                    />
                                                                </div>
                                                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                                    <label htmlFor="opdno">OPD No</label>
                                                                    <div className="input-group">
                                                                        <div className="input-group-prepend"></div>
                                                                        <input
                                                                            type="text"
                                                                            name="uhidprefix"
                                                                            disabled
                                                                            value={OldformData.uhidprefix}
                                                                            onChange={oldhandleChange}
                                                                            className="form-control"
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            value={OldformData.opdno}
                                                                            name="opdno"
                                                                            onChange={handleChange}
                                                                            aria-label="Text input with dropdown button"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                                    <label for="exampleInputName1">Email</label>
                                                                    <input
                                                                        type="email"
                                                                        className="form-control"
                                                                        value={OldformData.email}
                                                                        onChange={oldhandleChange}
                                                                        name='email'
                                                                        id="email"
                                                                        placeholder="Enter email" />

                                                                </div>
                                                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                                    <div className="mb-3 d-flex">
                                                                        <div className="me-2" style={{ width: '30%' }}>
                                                                            <label htmlFor="status" className="form-label">Status</label>
                                                                            <select
                                                                                className="form-select"
                                                                                value={OldformData.status}
                                                                                onChange={oldhandleChange}
                                                                                name='status'
                                                                                id="status">
                                                                                <option >Select</option>
                                                                                <option value="Mr">Mr.</option>
                                                                                <option value="Mrs">Mrs.</option>
                                                                                <option value="Ms">Ms.</option>
                                                                                <option value="Dr">Dr.</option>
                                                                                <option value="Prof">Prof.</option>
                                                                            </select>
                                                                        </div>
                                                                        <div style={{ flexGrow: 1 }}>
                                                                            <label htmlFor="patientName" className="form-label">Patient Name</label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                id="patientName"
                                                                                name='patientName'
                                                                                value={OldformData.patientName}
                                                                                onChange={oldhandleChange}
                                                                                placeholder="Enter patient name" />
                                                                        </div>
                                                                    </div>

                                                                </div>


                                                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                                    <div className="mb-3 d-flex">
                                                                        <div className="me-2" style={{ width: '30%' }}>
                                                                            <label htmlFor="status" className="form-label">Status</label>
                                                                            <select
                                                                                className="form-select"
                                                                                value={OldformData.gStatus}
                                                                                name='gStatus'
                                                                                onChange={oldhandleChange}
                                                                                id="status">
                                                                                <option value=''>Select</option>
                                                                                <option value='self'>Self</option>
                                                                                <option value='C/O'>C/O</option>
                                                                                <option value='D/O'>D/O </option>
                                                                                <option value='S/O'>S/O </option>
                                                                                <option value='W/O'>W/O </option>
                                                                                <option value='H/O'>H/O </option>
                                                                            </select>
                                                                        </div>
                                                                        <div style={{ flexGrow: 1 }}>
                                                                            <label htmlFor="GuardianName" className="form-label">Guardian Name</label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                id="GuardianName"
                                                                                name='guardianName'
                                                                                value={OldformData.guardianName}
                                                                                onChange={oldhandleChange}
                                                                                placeholder="Enter Guardian Name" />
                                                                        </div>
                                                                    </div>

                                                                </div>

                                                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                                    <label for="GuardianNumber">Guardian Number</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="GuardianNumber"
                                                                        value={OldformData.guardianNumber}
                                                                        name='guardianNumber'
                                                                        onChange={oldhandleChange}
                                                                        placeholder="Enter Guardian Number" />
                                                                </div>
                                                                <div className="col-12 mt-3">
                                                                    <label for="address">Address</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="address"
                                                                        name='address'
                                                                        value={OldformData.address}
                                                                        onChange={oldhandleChange}
                                                                        placeholder="Enter full address" />
                                                                </div>
                                                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                                    <label for="city">City</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="city"
                                                                        name='city'
                                                                        value={OldformData.city}
                                                                        onChange={oldhandleChange}
                                                                        placeholder="Enter city name" />
                                                                </div>
                                                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                                    <label for="exampleInputName1">Gender</label>

                                                                    <select
                                                                        value={OldformData.gender}
                                                                        onChange={oldhandleChange}
                                                                        name='gender'
                                                                        className='form-control'
                                                                    >
                                                                        <option value=''>Select Gender</option>
                                                                        {/* Dynamically create option elements from Gender array */}
                                                                        {Gender.map((item) => (
                                                                            <option key={item._id} value={item.type}>
                                                                                {item.categoryname}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                                    <label for="exampleInputName1">Religion</label>
                                                                    <select
                                                                        value={OldformData.religion}
                                                                        onChange={oldhandleChange}
                                                                        name='religion'
                                                                        className='form-control'>
                                                                        <option value=''>Select Religion</option>
                                                                        {Religion.map((item) => (
                                                                            <option key={item._id} value={item.type}>
                                                                                {item.religionname}
                                                                            </option>
                                                                        ))}




                                                                    </select>
                                                                </div>
                                                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                                    <div className="mb-3 d-flex">
                                                                        <div className="me-2" style={{ width: '30%' }}>
                                                                            <label htmlFor="status" className="form-label">Age</label>
                                                                            <select
                                                                                className="form-select"
                                                                                value={OldformData.agetype}
                                                                                name='agetype'
                                                                                onChange={oldhandleChange}
                                                                                id="status">
                                                                                <option value=''>Select</option>
                                                                                <option value='year'>Year</option>
                                                                                <option value='month'>Month</option>
                                                                                <option value='day'>Day </option>
                                                                            </select>
                                                                        </div>
                                                                        <div style={{ flexGrow: 1 }}>
                                                                            <label htmlFor="age" className="form-label"></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                value={OldformData.age}
                                                                                name='age'
                                                                                onChange={oldhandleChange}
                                                                                id="age" placeholder="Enter Age" />
                                                                        </div>
                                                                    </div>

                                                                </div>

                                                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                                    <label for="exampleInputName1">Ref By</label>
                                                                    <select
                                                                        value={OldformData.refBy}
                                                                        onChange={oldhandleChange}
                                                                        name='refBy'
                                                                        className='form-control'>
                                                                        <option value=''>Select Reff</option>
                                                                        {Reffby.map((item) => (
                                                                            <option key={item._id} value={item.doctorName}>
                                                                                {item.doctorName}
                                                                            </option>
                                                                        ))}

                                                                    </select>
                                                                </div>

                                                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                                    <label for="exampleInputName1">Type</label>
                                                                    <select
                                                                        value={OldformData.type}
                                                                        onChange={oldhandleChange}
                                                                        name='type'
                                                                        className='form-control'>
                                                                        <option value=''>Select Type</option>
                                                                        <option value='Indoor'>Indoor</option>
                                                                        <option value='Outdoor'>Outdoor</option>
                                                                        <option value='Tele Medicine'>Tele Medicine</option>
                                                                    </select>
                                                                </div>
                                                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                                    <label for="exampleInputName1">Department</label>
                                                                    <select
                                                                        value={OldformData.department}
                                                                        onChange={oldhandleChange}
                                                                        name='department'
                                                                        className='form-control'>
                                                                        <option value=''>Select Type</option>
                                                                        {Department.map((item) => (
                                                                            <option key={item._id} value={item.type}>
                                                                                {item.departmentname}
                                                                            </option>
                                                                        ))}

                                                                    </select>
                                                                </div>
                                                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                                    {console.log(selectedDoctor)}

                                                                    <label for="exampleInputName1">Reff To</label>
                                                                    <select
                                                                        value={OldformData.refTo}
                                                                        name='refTo'
                                                                        onChange={handleDoctorChange}
                                                                        className='form-control'>
                                                                        <option value=''>Select Type</option>
                                                                        {Doctor.map((item) => (
                                                                            <option key={item._id} value={item.doctorname}>
                                                                                {item.doctorname}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                                    <div className="mb-3 d-flex">
                                                                        <div className="me-2" style={{ width: '30%' }}>
                                                                            <label htmlFor="status" className="form-label">Status</label>
                                                                            <select
                                                                                value={OldformData.identStatus}
                                                                                onChange={oldhandleChange}
                                                                                name='identStatus'
                                                                                className="form-select"
                                                                                id="status">
                                                                                <option value=''>Select</option>
                                                                                <option value='Aadhar No'>Aadhar No</option>
                                                                                <option value='DL NO'>DL NO</option>
                                                                                <option value='VOTER ID'>VOTER ID</option>
                                                                                <option value='PAN CARD'>PAN CARD </option>
                                                                                <option value='RASHAN CARD'>RASHAN CARD </option>
                                                                                <option value='OTHER'>OTHER </option>
                                                                            </select>
                                                                        </div>
                                                                        <div style={{ flexGrow: 1 }}>
                                                                            <label htmlFor="identity" className="form-label">Identity</label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                id="Identity"
                                                                                name='identity'
                                                                                value={OldformData.identity}
                                                                                onChange={oldhandleChange}
                                                                                placeholder="Enter Identity" />
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                                    <label for="exampleInputName1">Visit Type</label>
                                                                    <select value={OldformData.visitType}
                                                                        name='visitType'
                                                                        onChange={oldhandleChange}
                                                                        className='form-control'>
                                                                        <option value=''>Select Type</option>
                                                                        <option value='Regular'>Regular</option>
                                                                        <option value='Emergency'>Emergency</option>
                                                                        <option value='Police Case'>Police Case</option>
                                                                        <option value='Reffer'>Reffer</option>
                                                                        <option value='LFP'>LFP</option>
                                                                    </select>
                                                                </div>
                                                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                                    <label for="exampleInputName1">Payment Type</label>
                                                                    <select
                                                                        value={OldformData.paymentType}
                                                                        onChange={oldhandleChange}
                                                                        name='paymentType'
                                                                        className='form-control'>
                                                                        <option value=''>Select Type</option>
                                                                        <option value='cash'>Cash</option>
                                                                        <option value='UPI'>UPI</option>
                                                                        <option value='Credit-Debit-card'>Credit Debit Card</option>
                                                                        <option value='Other'>Other</option>
                                                                    </select>
                                                                </div>

                                                                <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                                    <div className="mb-3 d-flex">
                                                                        <div className="me-2" style={{ width: '30%' }}>
                                                                            <label htmlFor="status" className="form-label">Type </label>
                                                                            <select
                                                                                value={OldformData.discountType}
                                                                                onChange={oldhandleChange}
                                                                                name='discountType'
                                                                                className="form-select" id="status">
                                                                                <option value=''>Select</option>
                                                                                <option value='Self'>Self</option>
                                                                                <option value='Ref'>Ref</option>
                                                                            </select>
                                                                        </div>
                                                                        <div style={{ flexGrow: 1 }}>
                                                                            <label htmlFor="identity" className="form-label">Discount</label>
                                                                            <input
                                                                                type="text"
                                                                                name='discount'
                                                                                value={OldformData.discount}
                                                                                onChange={oldhandleChange}
                                                                                className="form-control"
                                                                                id="Discount"
                                                                                placeholder="Enter Discount" />
                                                                        </div>
                                                                    </div>

                                                                </div>

                                                                <div className="col-12 mt-3">
                                                                    <label for="city">Remarks</label>
                                                                    <textarea
                                                                        onChange={oldhandleChange}
                                                                        name='remarks'
                                                                        value={OldformData.remarks}
                                                                        className="form-control"
                                                                        id="city" ></textarea>
                                                                </div>

                                                            </>
                                                        )}


                                                    </div>
                                                    <div className="form-group row">
                                                        <div className="col-4 mt-4">
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary mt-4"
                                                                onClick={fetchPatientData}
                                                                disabled={FetchBtnLoading}
                                                            >
                                                                {FetchBtnLoading ? 'Fetching...' : 'Fetch Data'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-gradient-primary me-2"
                                                        onClick={oldEntriesSubmit}
                                                        disabled={btnLoading}
                                                    >

                                                        {btnLoading ? 'Submiting...' : 'Submit'}
                                                    </button>
                                                    <button className="btn btn-light">Cancel</button>
                                                </>
                                            )}
                                            {patientType === 'new' && (
                                                <>
                                                    {/* Full form content goes here */}
                                                    <div className="form-group row">

                                                        <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                            <label htmlFor="mobilenumber">Mobile Number <span className='text-danger'>*</span></label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name='mobile'
                                                                // value={formData.mobile || '2525'}
                                                                value={formData['mobile']}
                                                                onChange={handleChange}
                                                                id="mobilenumber"
                                                                placeholder="Enter Mobile Number" />
                                                        </div>
                                                        <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                            <label htmlFor="date">Date</label>
                                                            <input
                                                                type="date"
                                                                value={formData.date}
                                                                name="date"
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                id="date" />
                                                        </div>

                                                        <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                            <label for="exampleInputName1">UHID</label>
                                                            <div className="input-group">
                                                                <div className="input-group-prepend">

                                                                </div>

                                                                <input type="text" disabled value="KHMC/" className="form-control" />
                                                                <input type="text"
                                                                    value={formData.uhid}
                                                                    name="uhid"
                                                                    onChange={handleChange}
                                                                    className="form-control" />
                                                            </div>

                                                        </div>
                                                        <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                            <label for="exampleInputName1">OPD No</label>
                                                            <div className="input-group">
                                                                <div className="input-group-prepend">

                                                                </div>

                                                                <input type="text"

                                                                    name="uhidprefix"
                                                                    disabled
                                                                    value={formData.uhidprefix}
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                />
                                                                <input type="text"
                                                                    className="form-control"
                                                                    value={formData.opdno}
                                                                    name='opdno'
                                                                    onChange={handleChange}
                                                                    aria-label="Text input with dropdown button" />
                                                            </div>

                                                        </div>

                                                        <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                            <label for="exampleInputName1">Email</label>
                                                            <input
                                                                type="email"
                                                                className="form-control"
                                                                value={formData.email}
                                                                onChange={handleChange}
                                                                name='email'
                                                                id="email"
                                                                placeholder="Enter email" />

                                                        </div>
                                                        <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                            <div className="mb-3 d-flex">
                                                                <div className="me-2" style={{ width: '30%' }}>
                                                                    <label htmlFor="status" className="form-label">Status</label>
                                                                    <select
                                                                        className="form-select"
                                                                        value={formData.status}
                                                                        onChange={handleChange}
                                                                        name='status'
                                                                        id="status">
                                                                        <option >Select</option>
                                                                        <option value="Mr">Mr.</option>
                                                                        <option value="Mrs">Mrs.</option>
                                                                        <option value="Ms">Ms.</option>
                                                                        <option value="Dr">Dr.</option>
                                                                        <option value="Prof">Prof.</option>
                                                                    </select>
                                                                </div>
                                                                <div style={{ flexGrow: 1 }}>
                                                                    <label htmlFor="patientName" className="form-label">Patient Name <span className='text-danger'>*</span></label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="patientName"
                                                                        name='patientName'
                                                                        value={formData.patientName}
                                                                        onChange={handleChange}
                                                                        placeholder="Enter patient name" />
                                                                </div>
                                                            </div>

                                                        </div>


                                                        <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                            <div className="mb-3 d-flex">
                                                                <div className="me-2" style={{ width: '30%' }}>
                                                                    <label htmlFor="status" className="form-label">Status <span className='text-danger'>*</span></label>
                                                                    <select
                                                                        className="form-select"
                                                                        value={formData.gStatus}
                                                                        name='gStatus'
                                                                        onChange={handleChange}
                                                                        id="status">
                                                                        <option value=''>Select</option>
                                                                        <option value='self'>Self</option>
                                                                        <option value='C/O'>C/O</option>
                                                                        <option value='D/O'>D/O </option>
                                                                        <option value='S/O'>S/O </option>
                                                                        <option value='W/O'>W/O </option>
                                                                        <option value='H/O'>H/O </option>
                                                                    </select>
                                                                </div>
                                                                <div style={{ flexGrow: 1 }}>
                                                                    <label htmlFor="GuardianName" className="form-label">Guardian Name <span className='text-danger'>*</span></label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="GuardianName"
                                                                        name='guardianName'
                                                                        value={formData.guardianName}
                                                                        onChange={handleChange}
                                                                        placeholder="Enter Guardian Name" />
                                                                </div>
                                                            </div>

                                                        </div>

                                                        <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                            <label for="GuardianNumber">Guardian Number</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="GuardianNumber"
                                                                value={formData.guardianNumber}
                                                                name='guardianNumber'
                                                                onChange={handleChange}
                                                                placeholder="Enter Guardian Number" />
                                                        </div>
                                                        <div className="col-12 mt-3">
                                                            <label for="address">Address <span className='text-danger'>*</span></label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="address"
                                                                name='address'
                                                                value={formData.address}
                                                                onChange={handleChange}
                                                                placeholder="Enter full address" />
                                                        </div>
                                                        <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                            <label for="city">City</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="city"
                                                                name='city'
                                                                value={formData.city}
                                                                onChange={handleChange}
                                                                placeholder="Enter city name" />
                                                        </div>
                                                        <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                            <label for="exampleInputName1">Gender <span className='text-danger'>*</span></label>

                                                            <select
                                                                value={formData.gender}
                                                                onChange={handleChange}
                                                                name='gender'
                                                                className='form-control'
                                                            >
                                                                <option value=''>Select Gender</option>
                                                                {/* Dynamically create option elements from Gender array */}
                                                                {Gender.map((item) => (
                                                                    <option key={item._id} value={item.type}>
                                                                        {item.categoryname}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                            <label for="exampleInputName1">Religion</label>
                                                            <select
                                                                value={formData.religion}
                                                                onChange={handleChange}
                                                                name='religion'
                                                                className='form-control'>
                                                                <option value=''>Select Religion</option>
                                                                {Religion.map((item) => (
                                                                    <option key={item._id} value={item.type}>
                                                                        {item.religionname}
                                                                    </option>
                                                                ))}




                                                            </select>
                                                        </div>
                                                        <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                            <div className="mb-3 d-flex">
                                                                <div className="me-2" style={{ width: '30%' }}>
                                                                    <label htmlFor="status" className="form-label">Age <span className='text-danger'>*</span></label>
                                                                    <select
                                                                        className="form-select"
                                                                        value={formData.agetype}
                                                                        name='agetype'
                                                                        onChange={handleChange}
                                                                        id="status">
                                                                        <option value=''>Select</option>
                                                                        <option value='year'>Year</option>
                                                                        <option value='month'>Month</option>
                                                                        <option value='day'>Day </option>
                                                                    </select>
                                                                </div>
                                                                <div style={{ flexGrow: 1 }}>
                                                                    <label htmlFor="age" className="form-label"></label>
                                                                    <input type="text"
                                                                        className="form-control"
                                                                        value={formData.age}
                                                                        name='age'
                                                                        onChange={handleChange}
                                                                        id="age" placeholder="Enter Age" />
                                                                </div>
                                                            </div>

                                                        </div>

                                                        <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                            <label for="exampleInputName1">Ref By <span className='text-danger'>*</span></label>
                                                            <select
                                                                value={formData.refBy}
                                                                onChange={handleChange}
                                                                name='refBy'
                                                                className='form-control'>
                                                                <option value=''>Select Reff</option>
                                                                {Reffby.map((item) => (
                                                                    <option key={item._id} value={item.doctorName}>
                                                                        {item.doctorName}
                                                                    </option>
                                                                ))}

                                                            </select>
                                                        </div>

                                                        <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                            <label for="exampleInputName1">Type <span className='text-danger'>*</span></label>
                                                            <select
                                                                value={formData.type}
                                                                onChange={handleChange}
                                                                name='type'
                                                                className='form-control'>
                                                                <option value=''>Select Type</option>
                                                                <option value='Indoor'>Indoor</option>
                                                                <option value='Outdoor'>Outdoor</option>
                                                                <option value='Tele Medicine'>Tele Medicine</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                            <label for="exampleInputName1">Department</label>
                                                            <select
                                                                value={formData.department}
                                                                onChange={handleChange}
                                                                name='department'
                                                                className='form-control'>
                                                                <option value=''>Select Type</option>
                                                                {Department.map((item) => (
                                                                    <option key={item._id} value={item.type}>
                                                                        {item.departmentname}
                                                                    </option>
                                                                ))}

                                                            </select>
                                                        </div>
                                                        <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                            <label for="exampleInputName1">Reff To <span className='text-danger'>*</span></label>
                                                            <select
                                                                value={formData.refTo}
                                                                name='refTo'
                                                                onChange={handleDoctorChange}
                                                                className='form-control'>
                                                                <option value=''>Select Type</option>
                                                                {Doctor.map((item) => (
                                                                    <option key={item._id} value={item.doctorname}>
                                                                        {item.doctorname}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        {console.log(selectedDoctor, "selectedDoctor")}
                                                        <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                            <div className="mb-3 d-flex">
                                                                <div className="me-2" style={{ width: '30%' }}>
                                                                    <label htmlFor="status" className="form-label">Status</label>
                                                                    <select
                                                                        value={formData.identStatus}
                                                                        onChange={handleChange}
                                                                        name='identStatus'
                                                                        className="form-select"
                                                                        id="status">
                                                                        <option value=''>Select</option>
                                                                        <option value='Aadhar No'>Aadhar No</option>
                                                                        <option value='DL NO'>DL NO</option>
                                                                        <option value='VOTER ID'>VOTER ID</option>
                                                                        <option value='PAN CARD'>PAN CARD </option>
                                                                        <option value='RASHAN CARD'>RASHAN CARD </option>
                                                                        <option value='OTHER'>OTHER </option>
                                                                    </select>
                                                                </div>
                                                                <div style={{ flexGrow: 1 }}>
                                                                    <label htmlFor="identity" className="form-label">Identity</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="identity"
                                                                        name='identity'
                                                                        value={formData.identity}
                                                                        onChange={handleChange}
                                                                        placeholder="Enter Identity Name" />
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                            <label for="exampleInputName1">Visit Type</label>
                                                            <select value={formData.visitType}
                                                                name='visitType'
                                                                onChange={handleChange}
                                                                className='form-control'>
                                                                <option value=''>Select Type</option>
                                                                <option value='Regular'>Regular</option>
                                                                <option value='Emergency'>Emergency</option>
                                                                <option value='Police Case'>Police Case</option>
                                                                <option value='Reffer'>Reffer</option>
                                                                <option value='LFP'>LFP</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                            <label for="exampleInputName1">Payment Type</label>
                                                            <select
                                                                value={formData.paymentType}
                                                                onChange={handleChange}
                                                                name='paymentType'
                                                                className='form-control'>
                                                                <option value=''>Select Type</option>
                                                                <option value='cash'>Cash</option>
                                                                <option value='online'>Online</option>
                                                                <option value='UPI'>UPI</option>
                                                                <option value='Credit-Debit-card'>Credit Debit Card</option>
                                                                <option value='Other'>Other</option>
                                                            </select>
                                                        </div>

                                                        <div className="col-lg-3 col-md-6 col-sm-12 mt-3">
                                                            <div className="mb-3 d-flex">
                                                                <div className="me-2" style={{ width: '30%' }}>
                                                                    <label htmlFor="status" className="form-label">Discount Type </label>
                                                                    <select
                                                                        value={formData.discountType}
                                                                        onChange={handleChange}
                                                                        name='discountType'
                                                                        className="form-select" id="status">
                                                                        <option value=''>Select</option>
                                                                        <option value='Self'>Self</option>
                                                                        <option value='Ref'>Ref</option>
                                                                    </select>
                                                                </div>
                                                                <div style={{ flexGrow: 1 }}>
                                                                    <label htmlFor="identity" className="form-label">Discount</label>
                                                                    <input
                                                                        type="text"
                                                                        name='discount'
                                                                        value={formData.discount}
                                                                        onChange={handleChange}
                                                                        className="form-control"
                                                                        id="Discount"
                                                                        placeholder="Enter Discount" />
                                                                </div>
                                                            </div>

                                                        </div>

                                                        <div className="col-12 mt-3">
                                                            <label for="city">Remarks</label>
                                                            <textarea
                                                                onChange={handleChange}
                                                                name='remarks'
                                                                value={formData.remarks}
                                                                className="form-control"
                                                                id="city" ></textarea>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-gradient-primary me-2"
                                                        disabled={btnLoading}
                                                    >

                                                        {btnLoading ? 'Submiting...' : 'Submit'}
                                                    </button>
                                                    <button className="btn btn-light">Cancel</button>
                                                </>
                                            )}


                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Render the modal when multiple patients are found */}
                <Modal isOpen={isModalOpen} onClose={handleModalClose} patients={patients} />
            </div>
        </>
    );
};

export default PatientReg;