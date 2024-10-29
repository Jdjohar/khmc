const express = require('express');
const router = express.Router();
const momentTimezone = require('moment-timezone');
const moment = require('moment');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const jwrsecret = "MYNameisJashandeepSInghjoharmukts"
const bcrypt = require("bcryptjs");
const Patient = require('../models/Patient')
const State = require('../models/State')
const Religion = require('../models/Religion')
const Prefix = require('../models/Prefix')
const Examination = require('../models/Examination')
const Pcom = require('../models/pcomp')
const Disease = require('../models/Disease')
const Department = require('../models/Department')
const Dosecomment = require('../models/Dosecomment')
const Category = require('../models/Category')
const Bank = require('../models/Bank')
const Lab = require('../models/Labs')
const Labentry = require('../models/Lablogs')
const TestName = require('../models/TestName')
const TestComment = require('../models/TestComments')
const TestResult = require('../models/TestResults')
const TestResultP = require('../models/TestResultsP')
const Doctor = require('../models/Doctor')
const Reffby = require('../models/Reffby')
const Ward = require('../models/Ward')
const Bed = require('../models/Bed')
const Bill = require('../models/Receipts')
const LabTestBill = require('../models/LabTestBills')
const Plog = require('../models/Plog')
const crypto = require('crypto');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');




// Configure multer for file handling
const upload = multer({ storage: multer.memoryStorage() }); // Using memory storage




// CREATE a new patient (POST)
router.post('/patients', async (req, res) => {
    try {
        const newPatient = new Patient(req.body);
        const savedPatient = await newPatient.save();
        res.status(201).json({ 
            success: true,
            data:savedPatient
         });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ all patients (GET)
router.get('/patients', async (req, res) => {
    try {
        const patients = await Patient.find().sort({ createdAt: -1 });
        res.status(200).json(patients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Route to get patient by either UHID or mobile number
router.post('/patientsearch', async (req, res) => {
    console.log("start");

    // Extract UHID and mobile from the request body (since this is a POST request)
    const { uhid, mobile } = req.body;
    console.log("UHID:", uhid, "Mobile:", mobile);

    try {
        // Create a query object to find by either UHID or Mobile number
        let query = {};
        
        if (uhid) {
            query.uhid = uhid;
        } else if (mobile) {
            query.mobile = mobile;
        } else {
            return res.status(400).json({ error: 'Please provide UHID or Mobile number for search' });
        }

        console.log("Query:", query);

        // Fetch the patient from MongoDB using findOne (assuming UHID or mobile is unique)
        const patient = await Patient.find(query);

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Return the patient details as JSON
        res.json(patient);
    } catch (error) {
        console.error('Error fetching patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});





router.get('/patientsNumber', async (req, res) => {
    try {
        // Find patients and project only UHID and OPD No
        const patients = await Patient.find({}, 'uhid opdno sno'); // Projection with 'uhid opdno'
        
        res.status(200).json(patients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ a single patient by ID (GET)
router.get('/patients/:id', async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a patient by ID (PUT)
router.put('/patients/:id', async (req, res) => {
    try {
        const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Ensure the data is valid
        });
        if (!updatedPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json(updatedPatient);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a patient by ID (DELETE)
router.delete('/patients/:id', async (req, res) => {
    try {
        const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
        if (!deletedPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json({ message: 'Patient deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// CREATE a new patient (POST)
router.post('/patientlogs', async (req, res) => {
    try {
        const newPatient = new Plog(req.body);
        const savedPatient = await newPatient.save();
        res.status(201).json({ 
            success: true,
            data:savedPatient
         });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//patients
router.get('/patientslogsNumber', async (req, res) => {
    try {
        // Find patients and project only UHID and OPD No
        const patientslog = await Plog.find({}, 'opdno sno'); // Projection with 'uhid opdno'
        
        res.status(200).json(patientslog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ all patients (GET)
router.get('/patientlogs', async (req, res) => {
    try {
        const patients = await Plog.find();
        res.status(200).json(patients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ a single patient by ID (GET)
router.get('/patientlogs/:id', async (req, res) => {
    try {
        const patient = await Plog.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a patient by ID (PUT)
router.put('/patientlogs/:id', async (req, res) => {
    try {
        const updatedPatient = await Plog.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Ensure the data is valid
        });
        if (!updatedPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json(updatedPatient);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a patient by ID (DELETE)
router.delete('/patientlogs/:id', async (req, res) => {
    try {
        const deletedPatient = await Plog.findByIdAndDelete(req.params.id);
        if (!deletedPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json({ message: 'Patient deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// CREATE a new state (POST)
router.post('/state', async (req, res) => {
    try {
        const newstate = new State(req.body);
        const savedstate = await newstate.save();
        res.status(201).json({ 
            success: true,
            data:savedstate
         });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ all state (GET)
router.get('/state', async (req, res) => {
    try {
        const state = await State.find();
        res.status(200).json(state);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// READ a single state by ID (GET)
router.get('/state/:id', async (req, res) => {
    try {
        const state = await State.findById(req.params.id);
        if (!state) {
            return res.status(404).json({ message: 'state not found' });
        }
        res.status(200).json(state);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a state by ID (PUT)
router.put('/state/:id', async (req, res) => {
    try {
        const updatedstate = await State.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Ensure the data is valid
        });
        if (!updatedstate) {
            return res.status(404).json({ message: 'state not found' });
        }
        res.status(200).json(updatedstate);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a state by ID (DELETE)
router.delete('/state/:id', async (req, res) => {
    try {
        const deletedstate = await State.findByIdAndDelete(req.params.id);
        if (!deletedstate) {
            return res.status(404).json({ message: 'state not found' });
        }
        res.status(200).json({ message: 'state deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// CREATE a new religion (POST)
router.post('/religion', async (req, res) => {
    try {
        const newreligion = new Religion(req.body);
        const savedreligion = await newreligion.save();
        res.status(201).json({ 
            success: true,
            data:savedreligion
         });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ all religion (GET)
router.get('/religion', async (req, res) => {
    try {
        const state = await Religion.find();
        res.status(200).json(state);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// READ a single religion by ID (GET)
router.get('/religion/:id', async (req, res) => {
    try {
        const state = await Religion.findById(req.params.id);
        if (!state) {
            return res.status(404).json({ message: 'religion not found' });
        }
        res.status(200).json(state);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a state by ID (PUT)
router.put('/state/:id', async (req, res) => {
    try {
        const updatedreligion = await Religion.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Ensure the data is valid
        });
        if (!updatedreligion) {
            return res.status(404).json({ message: 'religion not found' });
        }
        res.status(200).json(updatedreligion);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a religion by ID (DELETE)
router.delete('/religion/:id', async (req, res) => {
    try {
        const deletedreligion = await Religion.findByIdAndDelete(req.params.id);
        if (!deletedreligion) {
            return res.status(404).json({ message: 'religion not found' });
        }
        res.status(200).json({ message: 'religion deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// CREATE a new religion (POST)
router.post('/prefix', async (req, res) => {
    try {
        const newprefix = new Prefix(req.body);
        const savedprefix = await newprefix.save();
        res.status(201).json({ 
            success: true,
            data:savedprefix
         });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ all religion (GET)
router.get('/prefix', async (req, res) => {
    try {
        const prefix = await Prefix.find();
        res.status(200).json(prefix);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// READ a single religion by ID (GET)
router.get('/prefix/:id', async (req, res) => {
    try {
        const prefix = await Prefix.findById(req.params.id);
        if (!prefix) {
            return res.status(404).json({ message: 'prefix not found' });
        }
        res.status(200).json(prefix);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a state by ID (PUT)
router.put('/prefix/:id', async (req, res) => {
    try {
        const updatedprefix = await Prefix.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Ensure the data is valid
        });
        if (!updatedprefix) {
            return res.status(404).json({ message: 'religion not found' });
        }
        res.status(200).json(updatedprefix);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a religion by ID (DELETE)
router.delete('/prefix/:id', async (req, res) => {
    try {
        const deletedprefix = await Prefix.findByIdAndDelete(req.params.id);
        if (!deletedprefix) {
            return res.status(404).json({ message: 'prefix not found' });
        }
        res.status(200).json({ message: 'prefix deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE a new religion (POST)
router.post('/examination', async (req, res) => {
    try {
        const newexamination = new Examination(req.body);
        const savedexamination = await newexamination.save();
        res.status(201).json({ 
            success: true,
            data:savedexamination
         });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ all religion (GET)
router.get('/examination', async (req, res) => {
    try {
        const examination = await Examination.find();
        res.status(200).json(examination);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// READ a single religion by ID (GET)
router.get('/examination/:id', async (req, res) => {
    try {
        const examination = await Examination.findById(req.params.id);
        if (!examination) {
            return res.status(404).json({ message: 'examination not found' });
        }
        res.status(200).json(examination);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a state by ID (PUT)
router.put('/examination/:id', async (req, res) => {
    try {
        const updatedexamination = await Examination.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Ensure the data is valid
        });
        if (!updatedexamination) {
            return res.status(404).json({ message: 'religion not found' });
        }
        res.status(200).json(updatedexamination);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a religion by ID (DELETE)
router.delete('/examination/:id', async (req, res) => {
    try {
        const deletedexamination = await Examination.findByIdAndDelete(req.params.id);
        if (!deletedexamination) {
            return res.status(404).json({ message: 'examination not found' });
        }
        res.status(200).json({ message: 'examination deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// CREATE a new religion (POST)
router.post('/disease', async (req, res) => {
    try {
        const newdisease = new Disease(req.body);
        const saveddisease = await newdisease.save();
        res.status(201).json({ 
            success: true,
            data:saveddisease
         });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ all religion (GET)
router.get('/disease', async (req, res) => {
    try {
        const disease = await Disease.find();
        res.status(200).json(disease);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// READ a single religion by ID (GET)
router.get('/disease/:id', async (req, res) => {
    try {
        const disease = await Disease.findById(req.params.id);
        if (!disease) {
            return res.status(404).json({ message: 'disease not found' });
        }
        res.status(200).json(disease);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a state by ID (PUT)
router.put('/disease/:id', async (req, res) => {
    try {
        const updateddisease = await Disease.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Ensure the data is valid
        });
        if (!updateddisease) {
            return res.status(404).json({ message: 'religion not found' });
        }
        res.status(200).json(updateddisease);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a religion by ID (DELETE)
router.delete('/disease/:id', async (req, res) => {
    try {
        const deleteddisease = await Disease.findByIdAndDelete(req.params.id);
        if (!deleteddisease) {
            return res.status(404).json({ message: 'disease not found' });
        }
        res.status(200).json({ message: 'disease deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});





// CREATE a new religion (POST)
router.post('/dosecomment', async (req, res) => {
    try {
        const newdosecomment = new Dosecomment(req.body);
        const saveddosecomment = await newdosecomment.save();
        res.status(201).json({ 
            success: true,
            data:saveddosecomment
         });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ all religion (GET)
router.get('/dosecomment', async (req, res) => {
    try {
        const dosecomment = await Dosecomment.find();
        res.status(200).json(dosecomment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// READ a single religion by ID (GET)
router.get('/dosecomment/:id', async (req, res) => {
    try {
        const dosecomment = await Dosecomment.findById(req.params.id);
        if (!dosecomment) {
            return res.status(404).json({ message: 'dosecomment not found' });
        }
        res.status(200).json(dosecomment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a state by ID (PUT)
router.put('/dosecomment/:id', async (req, res) => {
    try {
        const updateddosecomment = await Dosecomment.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Ensure the data is valid
        });
        if (!updateddosecomment) {
            return res.status(404).json({ message: 'religion not found' });
        }
        res.status(200).json(updateddosecomment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a religion by ID (DELETE)
router.delete('/dosecomment/:id', async (req, res) => {
    try {
        const deleteddosecomment = await Dosecomment.findByIdAndDelete(req.params.id);
        if (!deleteddosecomment) {
            return res.status(404).json({ message: 'dosecomment not found' });
        }
        res.status(200).json({ message: 'dosecomment deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// CREATE a new religion (POST)
router.post('/complaints', async (req, res) => {
    try {
        const newpcom = new Pcom(req.body);
        const savedpcom = await newpcom.save();
        res.status(201).json({ 
            success: true,
            data:savedpcom
         });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ all religion (GET)
router.get('/complaints', async (req, res) => {
    try {
        const pcom = await Pcom.find();
        res.status(200).json(pcom);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// READ a single religion by ID (GET)
router.get('/complaints/:id', async (req, res) => {
    try {
        const pcom = await Pcom.findById(req.params.id);
        if (!pcom) {
            return res.status(404).json({ message: 'pcom not found' });
        }
        res.status(200).json(pcom);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a state by ID (PUT)
router.put('/complaints/:id', async (req, res) => {
    try {
        const updatedpcom = await Pcom.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Ensure the data is valid
        });
        if (!updatedpcom) {
            return res.status(404).json({ message: 'religion not found' });
        }
        res.status(200).json(updatedpcom);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a religion by ID (DELETE)
router.delete('/complaints/:id', async (req, res) => {
    try {
        const deletedpcom = await Pcom.findByIdAndDelete(req.params.id);
        if (!deletedpcom) {
            return res.status(404).json({ message: 'pcom not found' });
        }
        res.status(200).json({ message: 'pcom deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// CREATE a new religion (POST)
router.post('/bank', async (req, res) => {
    try {
        const newBank = new Bank(req.body);
        const savedBank = await newBank.save();
        res.status(201).json({ 
            success: true,
            data:savedBank
         });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ all religion (GET)
router.get('/bank', async (req, res) => {
    try {
        const Bankdata = await Bank.find();
        res.status(200).json(Bankdata);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// READ a single religion by ID (GET)
router.get('/bank/:id', async (req, res) => {
    try {
        const Bank = await Bank.findById(req.params.id);
        if (!Bank) {
            return res.status(404).json({ message: 'Bank not found' });
        }
        res.status(200).json(Bank);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a state by ID (PUT)
router.put('/bank/:id', async (req, res) => {
    try {
        const updatedBank = await Bank.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Ensure the data is valid
        });
        if (!updatedBank) {
            return res.status(404).json({ message: 'Bank not found' });
        }
        res.status(200).json(updatedBank);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a religion by ID (DELETE)
router.delete('/bank/:id', async (req, res) => {
    try {
        const deletedBank = await Bank.findByIdAndDelete(req.params.id);
        if (!deletedBank) {
            return res.status(404).json({ message: 'Bank not found' });
        }
        res.status(200).json({ message: 'Bank deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// CREATE a new religion (POST)
router.post('/lab', async (req, res) => {
    try {
        const newlab = new Lab(req.body);
        const savedlab = await newlab.save();
        res.status(201).json({ 
            success: true,
            data:savedlab
         });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ all religion (GET)
router.get('/lab', async (req, res) => {
    try {
        const labdata = await Lab.find();
        res.status(200).json(labdata);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// READ a single religion by ID (GET)
router.get('/lab/:id', async (req, res) => {
    try {
        const lab = await Lab.findById(req.params.id);
        if (!lab) {
            return res.status(404).json({ message: 'lab not found' });
        }
        res.status(200).json(lab);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a state by ID (PUT)
router.put('/lab/:id', async (req, res) => {
    try {
        const updatedlab = await Lab.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Ensure the data is valid
        });
        if (!updatedlab) {
            return res.status(404).json({ message: 'lab not found' });
        }
        res.status(200).json(updatedlab);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a religion by ID (DELETE)
router.delete('/lab/:id', async (req, res) => {
    try {
        const deletedlab = await Lab.findByIdAndDelete(req.params.id);
        if (!deletedlab) {
            return res.status(404).json({ message: 'lab not found' });
        }
        res.status(200).json({ message: 'lab deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE a new religion (POST)
router.post('/testName', async (req, res) => {
    try {
        const newtestName = new TestName(req.body);
        const savedtestName = await newtestName.save();
        res.status(201).json({ 
            success: true,
            data:savedtestName
         });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ all religion (GET)
router.get('/testName', async (req, res) => {
    try {
        const testNamedata = await TestName.find();
        res.status(200).json(testNamedata);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// READ a single religion by ID (GET)
router.get('/testName/:id', async (req, res) => {
    try {
        const testName = await TestName.findById(req.params.id);
        if (!testName) {
            return res.status(404).json({ message: 'testName not found' });
        }
        res.status(200).json(testName);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a state by ID (PUT)
router.put('/testName/:id', async (req, res) => {
    try {
        const updatedtestName = await TestName.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Ensure the data is valid
        });
        if (!updatedtestName) {
            return res.status(404).json({ message: 'TestName not found' });
        }
        res.status(200).json(updatedtestName);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a religion by ID (DELETE)
router.delete('/testName/:id', async (req, res) => {
    try {
        const deletedtestName = await TestName.findByIdAndDelete(req.params.id);
        if (!deletedtestName) {
            return res.status(404).json({ message: 'TestName not found' });
        }
        res.status(200).json({ message: 'TestName deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// CREATE a new religion (POST)
router.post('/testComment', async (req, res) => {
    try {
        const newtestComment = new TestComment(req.body);
        const savedtestComment = await newtestComment.save();
        res.status(201).json({ 
            success: true,
            data:savedtestComment
         });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ all religion (GET)
router.get('/testComment', async (req, res) => {
    try {
        const testCommentdata = await TestComment.find();
        res.status(200).json(testCommentdata);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// READ a single religion by ID (GET)
router.get('/testComment/:id', async (req, res) => {
    try {
        const testComment = await TestComment.find({ TestId: req.params.id });
        if (!testComment) {
            return res.status(404).json({ message: 'testComment not found' });
        }
        res.status(200).json(testComment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a state by ID (PUT)
router.put('/testComment/:id', async (req, res) => {
    try {
        const updatedtestComment = await TestComment.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Ensure the data is valid
        });
        if (!updatedtestComment) {
            return res.status(404).json({ message: 'testComment not found' });
        }
        res.status(200).json(updatedtestComment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a religion by ID (DELETE)
router.delete('/testComment/:id', async (req, res) => {
    try {
        const deletedtestComment = await TestComment.findByIdAndDelete(req.params.id);
        if (!deletedtestComment) {
            return res.status(404).json({ message: 'testComment not found' });
        }
        res.status(200).json({ message: 'testComment deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE a new religion (POST)
router.post('/testResult', async (req, res) => {
    try {
        const newtestResult = new TestResult(req.body);
        const savedtestResult = await newtestResult.save();
        res.status(201).json({ 
            success: true,
            data:savedtestResult
         });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ all religion (GET)
router.get('/testResult', async (req, res) => {
    try {
        const testResultdata = await TestResult.find().sort({ createdAt: -1 });
        res.status(200).json(testResultdata);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// READ a single religion by ID (GET)
router.get('/testResult/:id', async (req, res) => {
    try {
        const testResult = await TestResult.find({ TestlablogId: req.params.id });
        if (!testResult) {
            return res.status(404).json({ message: 'testResult not found' });
        }
        res.status(200).json(testResult);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a state by ID (PUT)
router.put('/testResult/:id', async (req, res) => {
    try {
        const updatedtestResult = await TestResult.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Ensure the data is valid
        });
        if (!updatedtestResult) {
            return res.status(404).json({ message: 'testResult not found' });
        }
        res.status(200).json(updatedtestResult);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a religion by ID (DELETE)
router.delete('/testResult/:id', async (req, res) => {
    try {
        const deletedtestResult = await TestResult.findByIdAndDelete(req.params.id);
        if (!deletedtestResult) {
            return res.status(404).json({ message: 'testResult not found' });
        }
        res.status(200).json({ message: 'testResult deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE a new religion (POST)
router.post('/testResultP', async (req, res) => {
    try {
        const newtestResult = new TestResultP(req.body);
        const savedtestResult = await newtestResult.save();
        res.status(201).json({ 
            success: true,
            data:savedtestResult
         });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ all religion (GET)
router.get('/testResultP', async (req, res) => {
    try {
        const testResultdata = await TestResultP.find().sort({ createdAt: -1 });
        res.status(200).json(testResultdata);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// READ a single religion by ID (GET)
router.get('/testResultP/:id', async (req, res) => {
    try {
        const testResult = await TestResultP.find({ TestlablogId: req.params.id });
        if (!testResult) {
            return res.status(404).json({ message: 'test Result not found' });
        }
        res.status(200).json(testResult);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a state by ID (PUT)
router.put('/testResultP/:id', async (req, res) => {
    try {
        const updatedtestResult = await TestResultP.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Ensure the data is valid
        });
        if (!updatedtestResult) {
            return res.status(404).json({ message: 'testResult not found' });
        }
        res.status(200).json(updatedtestResult);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a religion by ID (DELETE)
router.delete('/testResultP/:id', async (req, res) => {
    try {
        const deletedtestResult = await TestResultP.findByIdAndDelete(req.params.id);
        if (!deletedtestResult) {
            return res.status(404).json({ message: 'testResult not found' });
        }
        res.status(200).json({ message: 'testResult deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE a new religion (POST)
router.post('/labentry', async (req, res) => {

    const {testType} = req.body
    
    try {
        // Get the current date (without time) to compare only the date part
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to midnight for date comparison

        // Find lab entries created today
        const todayEntries = await Labentry.find({
            date: {
                $gte: today, // Greater than or equal to today's date (midnight)
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) // Less than tomorrow's date (midnight)
            }
        });

        // Calculate the next serial number for today
        const nextSerialNumber = todayEntries.length + 1;

        // Create a new lab entry
        const newlabentry = new Labentry({
            ...req.body,
            serialNumber: nextSerialNumber // Assign the serial number
        });

        // Save the new lab entry
        const savedlabentry = await newlabentry.save();

        // Respond with success
        res.status(201).json({
            success: true,
            data: savedlabentry
        });
    } catch (err) {
        // Respond with error
        res.status(400).json({ error: err.message });
    }
});

// Function to get the next serial number for the day
async function getNextSerialNumber() {
    const today = new Date();
    const dateString = today.toLocaleDateString('en-GB'); // Format: DD-MM-YYYY
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const count = await Labentry.countDocuments({
        createdAt: { $gte: startOfDay, $lt: endOfDay },
    });

    // Generate the next serial number
    const serialNumber = count + 1;
    return `${dateString} - ${String(serialNumber).padStart(3, '0')}`;
}

// Endpoint to get the next serial number
router.get('/labentrynumber', async (req, res) => {
    try {
        const sno = await getNextSerialNumber();
        res.json({ sno });
    } catch (error) {
        console.error('Error generating serial number:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Function to get the next labReg number
async function getNextLabRegNumber() {
    // Find the document with the highest labReg value
    const lastEntry = await Labentry.findOne().sort({ labReg: -1 });

    if (!lastEntry || !lastEntry.labReg) {
        // If no labReg is present, start from 30001
        return 30001;
    }
    // console.log(lastEntry,"lastEntry");
    

    // Increment the last labReg by 1
    return lastEntry.labReg + 1;
}

// Endpoint to get the next labReg number
router.get('/next-labreg', async (req, res) => {
    try {
        const nextLabReg = await getNextLabRegNumber();
        console.log(nextLabReg,"nextLabReg");
        
        res.json({ nextLabReg });
    } catch (error) {
        console.error('Error generating next labReg number:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// READ all religion (GET)
router.get('/labentry', async (req, res) => {
    try {
        const labentrydata = await Labentry.find();
        res.status(200).json(labentrydata);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// READ a single religion by ID (GET)
router.get('/labentry/:id', async (req, res) => {
    try {
        const labentry = await Labentry.findById(req.params.id);
        if (!labentry) {
            return res.status(404).json({ message: 'labentry not found' });
        }
        res.status(200).json(labentry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a state by ID (PUT)
router.put('/labentry/:id', async (req, res) => {
    try {
        const updatedlabentry = await Labentry.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Ensure the data is valid
        });
        if (!updatedlabentry) {
            return res.status(404).json({ message: 'labentry not found' });
        }
        res.status(200).json(updatedlabentry);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//update only result field
router.put('/UpdateResultlabEntry/:id', async (req, res) => {
    try {
        // Extract 'result' and 'documents' fields from the request body
        const { result, documents } = req.body;

        // Check if result is provided in the request
        if (result === undefined) {
            return res.status(400).json({ message: 'Result field is required' });
        }

        // Prepare the update object
        const updateData = { result };

        // If documents are provided, include them in the update object
        if (documents) {
            updateData.documents = documents;
        }

        // Update the document in the database
        const updatedlabentry = await Labentry.findByIdAndUpdate(
            req.params.id,
            updateData, // Update result and documents fields
            {
                new: true, // Return the updated document
                runValidators: true // Ensure the data is valid
            }
        );

        // Check if the lab entry was found and updated
        if (!updatedlabentry) {
            return res.status(404).json({ message: 'Lab entry not found' });
        }

        // Respond with the updated lab entry
        res.status(200).json(updatedlabentry);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
//update only result field
router.put('/UpdateResultlabEntryp/:id', async (req, res) => {
    try {
        // Only extract the 'result' field from the request body
        const { result } = req.body;

        // Check if result is provided in the request
        if (result === undefined) {
            return res.status(400).json({ message: 'Result field is required' });
        }

        // Update only the 'result' field
        const updatedlabentry = await Labentry.findByIdAndUpdate(
            req.params.id,
            { result }, // Update only the result field
            {
                new: true, // Return the updated document
                runValidators: true // Ensure the data is valid
            }
        );

        if (!updatedlabentry) {
            return res.status(404).json({ message: 'Labentry not found' });
        }

        res.status(200).json(updatedlabentry);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a religion by ID (DELETE)
router.delete('/labentry/:id', async (req, res) => {
    try {
        const deletedlabentry = await Labentry.findByIdAndDelete(req.params.id);
        if (!deletedlabentry) {
            return res.status(404).json({ message: 'labentry not found' });
        }
        res.status(200).json({ success: true, message: 'labentry deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// CREATE a new department (POST)
router.post('/department', async (req, res) => {
    try {
        const newdepartment = new Department(req.body);
        const saveddepartment = await newdepartment.save();
        res.status(201).json({ 
            success: true,
            data:saveddepartment
         });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ all religion (GET)
router.get('/department', async (req, res) => {
    try {
        const departmentdata = await Department.find();
        res.status(200).json(departmentdata);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// READ a single religion by ID (GET)
router.get('/department/:id', async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({ message: 'department not found' });
        }
        res.status(200).json(department);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a state by ID (PUT)
router.put('/department/:id', async (req, res) => {
    try {
        const updateddepartment = await Department.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Ensure the data is valid
        });
        if (!updateddepartment) {
            return res.status(404).json({ message: 'department not found' });
        }
        res.status(200).json(updateddepartment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a religion by ID (DELETE)
router.delete('/department/:id', async (req, res) => {
    try {
        const deleteddepartment = await Department.findByIdAndDelete(req.params.id);
        if (!deleteddepartment) {
            return res.status(404).json({ message: 'department not found' });
        }
        res.status(200).json({ message: 'department deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




// CREATE a new category (POST)
router.post('/category', async (req, res) => {
    try {
        const newcategory = new Category(req.body);
        const savedcategory = await newcategory.save();
        res.status(201).json({ 
            success: true,
            data:savedcategory
         });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ all religion (GET)
router.get('/category', async (req, res) => {
    try {
        const categorydata = await Category.find();
        res.status(200).json(categorydata);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// READ a single religion by ID (GET)
router.get('/category/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'category not found' });
        }
        res.status(200).json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a state by ID (PUT)
router.put('/category/:id', async (req, res) => {
    try {
        const updatedcategory = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Ensure the data is valid
        });
        if (!updatedcategory) {
            return res.status(404).json({ message: 'category not found' });
        }
        res.status(200).json(updatedcategory);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a religion by ID (DELETE)
router.delete('/category/:id', async (req, res) => {
    try {
        const deletedcategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedcategory) {
            return res.status(404).json({ message: 'category not found' });
        }
        res.status(200).json({ message: 'category deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




// CREATE a new doctor (POST)
router.post('/doctor', async (req, res) => {
    try {
        const newdoctor = new Doctor(req.body);
        const saveddoctor = await newdoctor.save();
        res.status(201).json({ 
            success: true,
            data:saveddoctor
         });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ all religion (GET)
router.get('/doctor', async (req, res) => {
    try {
        const doctordata = await Doctor.find();
        res.status(200).json(doctordata);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// READ a single religion by ID (GET)
router.get('/doctor/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'doctor not found' });
        }
        res.status(200).json(doctor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a state by ID (PUT)
router.put('/doctor/:id', async (req, res) => {
    try {
        const updateddoctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Ensure the data is valid
        });
        if (!updateddoctor) {
            return res.status(404).json({ message: 'doctor not found' });
        }
        res.status(200).json(updateddoctor);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a religion by ID (DELETE)
router.delete('/doctor/:id', async (req, res) => {
    try {
        const deleteddoctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!deleteddoctor) {
            return res.status(404).json({ message: 'doctor not found' });
        }
        res.status(200).json({ message: 'doctor deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE a new Reffby (POST)
router.post('/reffby', async (req, res) => {
    try {
        const newReffby = new Reffby(req.body);
        const savedReffby = await newReffby.save();
        res.status(201).json({ 
            success: true,
            data: savedReffby
         });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ all Reffby (GET)
router.get('/reffby', async (req, res) => {
    try {
        const reffbyData = await Reffby.find();
        res.status(200).json(reffbyData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ a single Reffby by ID (GET)
router.get('/reffby/:id', async (req, res) => {
    try {
        const reffby = await Reffby.findById(req.params.id);
        if (!reffby) {
            return res.status(404).json({ message: 'Reffby not found' });
        }
        res.status(200).json(reffby);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a Reffby by ID (PUT)
router.put('/reffby/:id', async (req, res) => {
    try {
        const updatedReffby = await Reffby.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Ensure the data is valid
        });
        if (!updatedReffby) {
            return res.status(404).json({ message: 'Reffby not found' });
        }
        res.status(200).json(updatedReffby);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a Reffby by ID (DELETE)
router.delete('/reffby/:id', async (req, res) => {
    try {
        const deletedReffby = await Reffby.findByIdAndDelete(req.params.id);
        if (!deletedReffby) {
            return res.status(404).json({ message: 'Reffby not found' });
        }
        res.status(200).json({ message: 'Reffby deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// READ all wards (GET)
router.get('/wards', async (req, res) => {
    try {
        const wards = await Ward.find();
        res.status(200).json(wards);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE a new ward (POST)
router.post('/wards', async (req, res) => {
    const ward = new Ward({
        wardname: req.body.wardname,
        floorno: req.body.floorno
    });

    try {
        const savedWard = await ward.save();
        res.status(201).json(savedWard);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ a specific ward by ID (GET)
router.get('/wards/:id', async (req, res) => {
    try {
        const ward = await Ward.findById(req.params.id);
        if (!ward) return res.status(404).json({ error: 'Ward not found' });
        res.status(200).json(ward);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a ward by ID (PUT)
router.put('/wards/:id', async (req, res) => {
    try {
        const updatedWard = await Ward.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedWard) return res.status(404).json({ error: 'Ward not found' });
        res.status(200).json(updatedWard);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a ward by ID (DELETE)
router.delete('/wards/:id', async (req, res) => {
    try {
        const deletedWard = await Ward.findByIdAndDelete(req.params.id);
        if (!deletedWard) return res.status(404).json({ error: 'Ward not found' });
        res.status(204).send(); // No content to send back
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post('/beds', async (req, res) => {
    const { ward, department, bedname, rate, gst, hsncode, slotStart, slotCount, inclusiveTax, otRoom, default: isDefault, alwaysAvailable } = req.body;

    // Check if the Ward exists
    const foundWard = await Ward.findById(ward);
    if (!foundWard) {
        return res.status(400).json({ error: 'Ward not found' });
    }

    const bed = new Bed({
        ward,
        department,
        bedname,
        rate,
        gst,
        hsncode,
        slotStart,
        slotCount,
        options: {
            inclusiveTax,
            otRoom,
            default: isDefault,
            alwaysAvailable
        }
    });

    try {
        const savedBed = await bed.save();
        res.status(201).json(savedBed);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// READ all beds (GET)
router.get('/beds', async (req, res) => {
    try {
        const beds = await Bed.find();
        res.status(200).json(beds);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// READ a specific bed by ID (GET)
router.get('/beds/:id', async (req, res) => {
    try {
        const bed = await Bed.findById(req.params.id);
        if (!bed) return res.status(404).json({ error: 'Bed not found' });
        res.status(200).json(bed);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a bed by ID (PUT)
router.put('/beds/:id', async (req, res) => {
    try {
        const updatedBed = await Bed.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBed) return res.status(404).json({ error: 'Bed not found' });
        res.status(200).json(updatedBed);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a bed by ID (DELETE)
router.delete('/beds/:id', async (req, res) => {
    try {
        const deletedBed = await Bed.findByIdAndDelete(req.params.id);
        if (!deletedBed) return res.status(404).json({ error: 'Bed not found' });
        res.status(204).send(); // No content to send back
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new bill (receipt)
router.post('/bills', async (req, res) => {
    try {
        const newBill = new Bill(req.body);  // Create a new instance of Bill with request data
        const savedBill = await newBill.save();  // Save the bill to the database
        res.status(201).json(savedBill);  // Send back the saved bill
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all bills
router.get('/bills', async (req, res) => {
    try {
        const bills = await Bill.find();  // Fetch all bills, populate patient details
        res.status(200).json(bills);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single bill by ID
router.get('/bills/:id', async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id).populate('patientId');
        if (!bill) {
            return res.status(404).json({ error: 'Bill not found' });
        }
        res.status(200).json(bill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a bill by ID
router.put('/bills/:id', async (req, res) => {
    try {
        const updatedBill = await Bill.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBill) {
            return res.status(404).json({ error: 'Bill not found' });
        }
        res.status(200).json(updatedBill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a bill by ID
router.delete('/bills/:id', async (req, res) => {
    try {
        const deletedBill = await Bill.findByIdAndDelete(req.params.id);
        if (!deletedBill) {
            return res.status(404).json({ error: 'Bill not found' });
        }
        res.status(200).json({ message: 'Bill deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new TestLabbill (receipt)
router.post('/labtestbills', async (req, res) => {
    try {
        const newBill = new LabTestBill(req.body);  // Create a new instance of Bill with request data
        const savedBill = await newBill.save();  // Save the bill to the database
        res.status(201).json(savedBill);  // Send back the saved bill
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all bills
router.get('/labtestbills', async (req, res) => {
    try {
        const bills = await LabTestBill.find();  // Fetch all bills, populate patient details
        res.status(200).json(bills);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single bill by ID
router.get('/labtestbills/:id', async (req, res) => {
    try {
        const bill = await LabTestBill.findById(req.params.id).populate('patientId');
        if (!bill) {
            return res.status(404).json({ error: 'Bill not found' });
        }
        res.status(200).json(bill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a bill by ID
router.put('/labtestbills/:id', async (req, res) => {
    try {
        const updatedBill = await LabTestBill.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBill) {
            return res.status(404).json({ error: 'Bill not found' });
        }
        res.status(200).json(updatedBill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a bill by ID
router.delete('/labtestbills/:id', async (req, res) => {
    try {
        const deletedBill = await LabTestBill.findByIdAndDelete(req.params.id);
        if (!deletedBill) {
            return res.status(404).json({ error: 'Bill not found' });
        }
        res.status(200).json({ message: 'Bill deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
