var express = require('express');
const fileUpload = require('express-fileupload');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// default options
router.use('/upload', fileUpload());

router.post('/upload', function (req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(`./temp/filename.json`, function (err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
})
module.exports = router;
