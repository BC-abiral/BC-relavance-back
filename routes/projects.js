const router = require('express').Router(),
  { Data, Project, Version } = require('../models/model')

/**
 * Get all Projects Info
 */
router.get('/', (req, res) => {
  Project.find()
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      throw err
    })
})

/**
 * Get Single Project Information
 */
router.get('/:id', (req, res) => {
  Project.findById(req.params.id)
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      throw err
    })
})

/**
 * Add Project
 */
router.post('/', (req, res) => {
  console.log(req.body)
  const project = new Project({
    name: req.body.name
  })

  project
    .save()
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      throw err
    })
})

/**
 * Get All Versions of the Project
 */
router.get('/:id/versions', (req, res) => {
  Version.find({ project: req.params.id })
    .select('name score')
    .exec()
    .then(result => {
      res.send(result).status(200)
    })
    .catch(err => {
      throw err
    })
})

/**
 * Get All the Versions Information Provided Project_Id
 */
router.get('/:id/versions/:vid', (req, res) => {
  Data.find({
    project: req.params.id,
    version: { $in: [req.params.vid] }
  })
    .exec()
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      throw err
    })
})

/**
 * Calculate the score
 */
router.get('/:id/versions/:vid/calculate', (req, res) => {
  var total_score = 0
  var total_link = 0
  Data.find({ project: req.params.id, version: { $in: [req.params.vid] } })
    .exec()
    .then(result => {
      result.forEach(value => {
        if (value.relavance === '')
          res.status(400).send('Please fill all the score')
        else total_score = total_score + parseInt(value.relavance)
      })
      total_link = result.length

      Version.findOneAndUpdate(
        { project: req.params.id, name: req.params.vid },
        {
          $set: {
            score: parseFloat(total_score / total_link).toFixed(2)
          }
        }
      ).exec().then(result => {
        console.log(result)
        res.send({
          total_score,
          total_link,
          score: parseFloat(total_score / total_link).toFixed(2)
        })

      })
    })
})

/**
 * Comparision between Two Different Versions
 */
router.post('/:id/compare', (req, res) => {
  const dataA = req.body.a
  const dataB = req.body.b
  // Here we need to get all the data which is unique to dataA
  Data.find({
    project: req.params.id,
    version: { $in: [dataA] }
  })
    .where({ version: { $nin: [dataB] } })
    .exec()
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      throw err
    })
})

module.exports = router
