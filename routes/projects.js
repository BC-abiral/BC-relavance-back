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

router.get('/:id/versions/:vid', (req, res) => {
  Data.find({ project: req.params.id, version: { $in: [req.params.vid] } })
    .exec()
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      throw err
    })
})

module.exports = router
