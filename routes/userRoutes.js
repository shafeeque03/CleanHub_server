const express = require('express')
const userRoute = express();
const userController = require('../controller/userController')

userRoute.post('/signup',userController.insertUser)
userRoute.post('/login',userController.verifyLogin)
userRoute.post('/pickupRequest',userController.callMrCleaner)
userRoute.post('/myPickups',userController.myPickups)
userRoute.get('/myPoint/:userId',userController.myPointss)
userRoute.get('/giftcards/:userId',userController.getGiftCards)
userRoute.post('/unlockCard',userController.unlockCard)


module.exports = userRoute