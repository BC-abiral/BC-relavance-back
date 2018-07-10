const router = require('express').Router(),
  { Data } = require('../models/model')

/**
 * Update Relavance
 */
router.post('/:id', (req, res) => {
  Data.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        relavance: req.body.relavance
      }
    },
    { new: true }
  )
    .exec()
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      throw err
    })
})

/**
 * Update Remarks
 */
router.post('/:id/remark', (req, res) => {
  Data.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        remark: req.body.remark
      }
    },
    { new: true }
  )
    .exec()
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      throw err
    })
})

module.exports = router
