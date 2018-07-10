const express = require('express'),
  fileUpload = require('express-fileupload'),
  router = express.Router(),
  fs = require('fs'),
  _ = require('lodash'),
  { Data, Version } = require('../models/model'),
  mongoose = require('mongoose')

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Welcome to Express' })
})

router.get('/all', (req, res) => {
  Data.find()
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      throw err
    })
})

// default options
router.use('/upload', fileUpload())

router.post('/upload', function(req, res) {
  if (!req.files) return res.status(400).send('No files were uploaded.')

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile

  const version = new Version({
    name: req.body.version,
    project: req.body.projectId
  })

  version.save((err, result) => {
    if (err) throw err
  })

  sampleFile.mv(`./temp/filename.json`, err => {
    if (err) throw err

    let file = fs.readFileSync('./temp/filename.json', 'utf-8')
    let relavanceData = JSON.parse(file)

    // Getting Just the Result Array in a variable
    let originalRelavanceResult = relavanceData.results.googleSearch

    let relavanceResults = _.uniqBy(originalRelavanceResult, 'originUrl')

    Data.find({ project: req.body.projectId })
      .count()
      .then(count => {
        console.log(count)
        if (count > 0) {
          performAdditionWithCondition(req, res, relavanceResults)
        } else {
          performBulkUpload(req, res, relavanceResults)
        }
      })
  })
})

const performBulkUpload = async (req, res, relavanceResults) => {
  let allData = []
  for (var i = 0; i < relavanceResults.length; i++) {
    let data = {
      title: relavanceResults[i].title,
      abstract: relavanceResults[i].abstract,
      originUrl: relavanceResults[i].originUrl,
      classifierScore: relavanceResults[i].classifierScore,
      similarityScore: relavanceResults[i].similarityScore,
      body: relavanceResults[i].body,
      source: relavanceResults[i].source,
      project: new mongoose.Types.ObjectId(req.body.projectId),
      version: [req.body.version],
      relavance: '',
      remark: ''
    }
    allData.push(data)
  }

  await Data.collection.insertMany(allData, (err, docs) => {
    if (err) throw err
    console.log(docs.ops.length)
    res
      .json({ message: 'All Data Added to Database', docsCount: docs.length })
      .status(200)
  })
}

const performAdditionWithCondition = async (req, res, relavanceResults) => {
  console.log(relavanceResults.length)
  for (var i = 0; i < relavanceResults.length; i++) {
    let originUrl = relavanceResults[i].originUrl
    await Data.findOne({
      originUrl: relavanceResults[i].originUrl,
      project: new mongoose.Types.ObjectId(req.body.projectId)
    })
      .count()
      .then(count => {
        console.log(count)
        if (count > 0) {
          // Here the data is already present so just add the version
          Data.updateMany(
            { originUrl: originUrl },
            { $push: { version: [req.body.version] } },
            (err, result) => {
              if (err) throw err
            }
          )
        } else {
          // Here the data is to be added as a new entry
          const data = new Data({
            title: relavanceResults[i].title,
            abstract: relavanceResults[i].abstract,
            originUrl: relavanceResults[i].originUrl,
            classifierScore: relavanceResults[i].classifierScore,
            similarityScore: relavanceResults[i].similarityScore,
            body: relavanceResults[i].body,
            source: relavanceResults[i].source,
            project: req.body.projectId,
            version: req.body.version,
            relavance: ''
          })
          data.save((err, result) => {
            if (err) throw err
          })
        }
      })
  }
  res.json({ message: 'Opeartion Done' }).status(200)
}

module.exports = router
