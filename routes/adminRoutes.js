const express = require('express')
const adminRoute = express();
const adminController = require("../controller/adminController")

adminRoute.post('/login',adminController.adminLogin)
adminRoute.get('/getPickups',adminController.allPickups)
adminRoute.post('/updatePickup',adminController.updateWeight)
adminRoute.post('/addGiftCard',adminController.addGiftCardd)
adminRoute.post('/allGiftcards',adminController.allGiftCards)
adminRoute.get('/users',adminController.usersList)
adminRoute.patch('/blockUser',adminController.userBlock)


module.exports = adminRoute