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
const Department = require('../models/Department')
const Category = require('../models/Category')
const Bank = require('../models/Bank')
const Doctor = require('../models/Doctor')
const Reffby = require('../models/Reffby')
const Ward = require('../models/Ward')
const Bed = require('../models/Bed')
const Bill = require('../models/Receipts')
const Ledger = require('../models/ledger')
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
        const patients = await Patient.find();
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
router.post('/ledger', async (req, res) => {
    try {
        const newPatient = new Ledger(req.body);
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
router.get('/ledger', async (req, res) => {
    try {
        const patients = await Ledger.find();
        res.status(200).json(patients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ a single patient by ID (GET)
router.get('/ledger/:id', async (req, res) => {
    try {
        const patient = await Ledger.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a patient by ID (PUT)
router.put('/ledger/:id', async (req, res) => {
    try {
        const updatedPatient = await Ledger.findByIdAndUpdate(req.params.id, req.body, {
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
router.delete('/ledger/:id', async (req, res) => {
    try {
        const deletedPatient = await Ledger.findByIdAndDelete(req.params.id);
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


module.exports = router;
