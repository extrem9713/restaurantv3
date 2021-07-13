const express = require('express')
const Restaurant = require('../../models/restaurant')
const sortData = require('../../config/sortData.json')

const router = express.Router()

//index route
router.get('/', (req, res) => {
  Restaurant.find()
  .lean()
  .sort({_id: 'asc'})
  .then(restaurants => res.render('index', {restaurants, sortData}))
  .catch(error => console.error(error))
})

module.exports = router