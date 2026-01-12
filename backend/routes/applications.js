const express = require('express');
const Application = require('../models/Application');
const auth = require('../middleware/auth');
const multer = require('multer');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Apply for job
router.post('/', auth, upload.single('resume'), async (req, res) => {
  const { jobId, coverLetter, name, phone, location, githubUrl, email, linkedinUrl } = req.body;
  const resume = req.file ? req.file.path : null;

  try {
    // Validate required fields
    if (!jobId) {
      return res.status(400).json({ msg: 'Job ID is required' });
    }

    // Check if job exists
    const Job = require('../models/Job');
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    const application = new Application({
      job: jobId,
      applicant: req.user.id,
      coverLetter,
      resume,
      name,
      phone,
      location,
      githubUrl,
      email,
      linkedinUrl
    });

    await application.save();
    res.json(application);
  } catch (err) {
    console.error('Error creating application:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get applications for user
router.get('/user', auth, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id }).populate('job');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all applications (admin)
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

  try {
    const applications = await Application.find().populate('job').populate('applicant', 'name email phone location githubUrl linkedinUrl');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update application status (admin)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

  const { status } = req.body;
  try {
    const application = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(application);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;