const router = require('express').Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const Student = require('../models/Student');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'backend/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// @route   POST api/students
// @desc    Create a student
// @access  Private (Institution)
router.post('/', [auth, upload.single('photo')], async (req, res) => {
  try {
    const { studentName, fatherName, class: studentClass, village, mobileNumber, partner } = req.body;
    const photo = req.file.path;
    const institution = req.user.id;

    const newStudent = new Student({
      studentName,
      fatherName,
      class: studentClass,
      village,
      mobileNumber,
      photo,
      institution,
      partner,
    });

    const student = await newStudent.save();
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/students
// @desc    Get all students for an institution
// @access  Private (Institution)
router.get('/', auth, async (req, res) => {
  try {
    const students = await Student.find({ institution: req.user.id });
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/students/:id
// @desc    Get a student by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/students/:id
// @desc    Update a student
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    // Check user
    if (student.institution.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    student = await Student.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/students/:id
// @desc    Delete a student
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    // Check user
    if (student.institution.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // TODO: Also delete the photo from the uploads folder

    await Student.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Student removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
