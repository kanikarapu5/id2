const router = require('express').Router();
const auth = require('../middleware/auth');
const Student = require('../models/Student');
const User = require('../models/User');
const archiver = require('archiver');
const { createObjectCsvWriter } = require('csv-writer');
const fs = require('fs');
const path = require('path');

// @route   GET api/export
// @desc    Export student data for a partner or admin
// @access  Private (Admin, Partner)
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    let students;
    if (user.role === 'Admin') {
      // Admin can download data for all institutions
      // For now, let's just get all students. We can add filtering by institution later.
      students = await Student.find();
    } else if (user.role === 'Partner') {
      // Partner can only download data for students associated with them
      students = await Student.find({ partner: req.user.id });
    } else {
      return res.status(403).json({ msg: 'User is not authorized to export data' });
    }

    if (students.length === 0) {
      return res.status(404).json({ msg: 'No students found to export' });
    }

    // Group students by class
    const studentsByClass = students.reduce((acc, student) => {
      const className = student.class.replace(/[^a-zA-Z0-9]/g, '_'); // Sanitize class name for folder
      if (!acc[className]) {
        acc[className] = [];
      }
      acc[className].push(student);
      return acc;
    }, {});

    // Create a temporary directory for the export
    const exportDir = path.join(__dirname, '..', 'temp', `export-${Date.now()}`);
    fs.mkdirSync(exportDir, { recursive: true });

    // Create a zip archive
    const zipFilePath = path.join(__dirname, '..', 'temp', `export-${user.name}-${Date.now()}.zip`);
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });

    output.on('close', function() {
      res.download(zipFilePath, (err) => {
        if (err) {
          console.error(err);
        }
        // Clean up the temporary files and directories
        fs.unlinkSync(zipFilePath);
        fs.rmdirSync(exportDir, { recursive: true });
      });
    });

    archive.on('error', function(err) {
      throw err;
    });

    archive.pipe(output);

    // Process each class
    for (const className in studentsByClass) {
      const classStudents = studentsByClass[className];
      const classDir = path.join(exportDir, className);
      fs.mkdirSync(classDir, { recursive: true });

      const photosDir = path.join(classDir, 'Photos');
      fs.mkdirSync(photosDir, { recursive: true });

      // Create CSV for the class
      const csvPath = path.join(classDir, `${className}.csv`);
      const csvWriter = createObjectCsvWriter({
        path: csvPath,
        header: [
          { id: 'id', title: 'ID' },
          { id: 'studentName', title: 'Student Name' },
          { id: 'fatherName', title: 'Father Name' },
          { id: 'class', title: 'Class' },
          { id: 'village', title: 'Village' },
          { id: 'mobileNumber', title: 'Mobile Number' },
          { id: 'photo', title: 'Photo Filename' },
        ]
      });

      const records = classStudents.map((student, index) => {
        const photoFilename = `S${index + 1}.jpg`;
        const oldPhotoPath = path.join(__dirname, '..', student.photo);
        const newPhotoPath = path.join(photosDir, photoFilename);

        // Copy and rename photo
        if (fs.existsSync(oldPhotoPath)) {
          fs.copyFileSync(oldPhotoPath, newPhotoPath);
        }

        return {
          id: `S${index + 1}`,
          studentName: student.studentName,
          fatherName: student.fatherName,
          class: student.class,
          village: student.village,
          mobileNumber: student.mobileNumber,
          photo: photoFilename,
        };
      });

      await csvWriter.writeRecords(records);
    }

    // Add the directory with all the class folders to the archive
    archive.directory(exportDir, false);

    // Finalize the archive
    await archive.finalize();

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
