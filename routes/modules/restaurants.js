const express = require('express')
const Restaurant = require('../../models/restaurant')
const sortData = require('../../config/sortData.json')

const router = express.Router()

//search route
router.get('/search', (req, res) => {
  const keyword = req.query.keyword.toLowerCase().trim()
  const currentOption = req.query.sortOption
  const sortMongoose = {
    nameEnAsc: { name_en: 'asc' },
    nameEnDesc: { name_en: 'desc' },
    category: { category: 'asc' },
    location: { location: 'asc' },    
    rating: {rating: 'desc'}
  }
  Restaurant.find()
    .lean()
    .sort(sortMongoose[currentOption])
    .then((restaurants) => {
      
      if (keyword) {
        restaurants = restaurants.filter((restaurant) => restaurant.name.toLowerCase().includes(keyword) || restaurant.category.includes(keyword)
        )                
      }
      if (restaurants.length === 0) {                
        return res.render('error', {keyword})
      } 
       res.render('index', {restaurants, keyword, sortData, currentOption})       
    })
    .catch((error) => console.error(error))
})

//create route
router.get('/new', (req, res) =>{
  return res.render('new')
})
router.post('/', (req, res) => {
  const{name, name_en, category, image, location, phone, google_map, rating, description} = req.body
  return Restaurant.create({name, name_en, category, image, location, phone, google_map, rating, description})
  .then(() => res.redirect('/'))
  .catch(error => console.error(error))  
})

//detail route
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
  .lean()
  .then((restaurant) => res.render('detail', {restaurant}))
  .catch(error => console.error(error))
})

// edit route
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
  .lean()
  .then((restaurant) => res.render('edit', {restaurant}))
  .catch(error => console.error(error))
})

router.put('/:id',(req, res) => {
  const id = req.params.id
  const newrestaurant = req.body
  return Restaurant.findById(id)
  .then((restaurant) => {
    restaurant.name = newrestaurant.name
    restaurant.name_en = newrestaurant.name_en
    restaurant.category = newrestaurant.category
    restaurant.image = newrestaurant.image
    restaurant.location = newrestaurant.location
    restaurant.phone = newrestaurant.phone
    restaurant.google_map = newrestaurant.google_map
    restaurant.rating = newrestaurant.rating
    restaurant.description = newrestaurant.description
    return restaurant.save()
  })
  .then(() => res.redirect(`/restaurants/${id}`))
  .catch(error => console.error(error))
})

//delete route
router.delete('/:id', (req, res) =>{
  const id = req.params.id
  return Restaurant.findById(id)
  .then(restaurant => restaurant.remove())
  .then(() => res.redirect('/'))
  .catch(error => console.error(error))
})

module.exports = router