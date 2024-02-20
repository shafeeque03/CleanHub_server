const User = require('../model/userModel')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const Waste = require('../model/wasteModel')
const Point = require('../model/pointModel')
const Giftcard = require('../model/giftcardModel')

const securePassword = async (password) => {
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      return passwordHash;
    } catch (error) {
      console.log(error.message);
    }
  };

const insertUser = async(req,res)=>{
    const {name,email,password,location, number} = req.body
    const Exist = await User.findOne({email:email})
    const userCount = await User.find().countDocuments()
    if(Exist){
        return res.status(400).json({message:"User already exist"})
    }else{
        const spassword = await securePassword(password);
        const ch = userCount+101
        const chi = "CH"+ch
        const newUser = new User({
            name,
            email,
            location,
            password:spassword,
            number:number,
            CH_id:chi,


        })

        const userData = await newUser.save()
        const newPoint = new Point({
            userId:userData._id
        })
        await newPoint.save()
        res.status(201).json({
            userData: userData,message:"Registration Success"
          })
    }
}

const verifyLogin = async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const user = await User.findOne({ email: email });
      if(!user) {
        return res.status(401).json({message:"User not registered"})
      }
      if(user.is_verified){
        if(user.is_blocked == false){
          const correctPassword = await bcrypt.compare(password, user.password)
          if(correctPassword) {
            const token = jwt.sign(
              {name: user.name, email:user.email, id:user._id,role: "user"},
              process.env.SECRET_KEY,
              {
                expiresIn: "1h",
              }
            );
            res.status(200).json({ user, token, message: `Welome ${user.name}` });
          }else{
            return res.status(403).json({ message: "Incorrect password" });
          }
        }else{
          return res.status(403).json({ message: "User is blocked" });
        }
      }else{
        return res.status(401).json({ message: "Email is not verified" });
      }
      
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const callMrCleaner = async(req,res)=>{
    try {
        const {userId} = req.body
        const user = await User.findById({_id:userId})
        if(user.isRequested){
            return res.status(403).json({message:"Already requested"})
        }else{
            await User.findByIdAndUpdate({_id:userId},{$set:{isRequested:true}})
            const newWaste = new Waste({
                date: new Date(),
                userId,
                chid:user.CH_id,
                userName:user.name
            })
            const wasteData = newWaste.save()
            res.status(200).json({message:"Request Successfull"})
        }
        
    } catch (error) {
        console.log(error.message);
    }
  }

  const myPickups = async(req,res)=>{
    try {
        const {userId} = req.body
        const myPickups = await Waste.find({userId})
        const point = await Point.findOne({userId})

        res.status(200).json({myPickups,point})
    } catch (error) {
        console.log(error.message)
    }
  }
  
  const myPointss = async(req,res)=>{
    try {
        const {userId} = req.params
        const point = await Point.findOne({userId})
        const pickCount = await Waste.find({userId}).countDocuments()
        res.status(200).json({point,pickCount})
    } catch (error) {
        console.log(error.message)
    }
  }

  const getGiftCards = async(req,res)=>{
    try {
        const {userId} = req.params
        const cards = await Giftcard.find({userId})
        res.status(200).json({cards})
    } catch (error) {
        console.log(error.message)
    }
  }

  const unlockCard = async(req,res)=>{
    try {
        const {cardId, userId} = req.body
        const card = await Giftcard.findById({_id:cardId})
        const updatedCard = await Giftcard.findByIdAndUpdate({_id:cardId},{$set:{isUnlocked:true}})
        console.log(userId,"popommm")
        const updatedPoint = await Point.findOneAndUpdate({userId:userId},{$inc:{point:-card.point_need}})
        res.status(200).json({message:"Giftcard Unlocked", updatedPoint})
    } catch (error) {
        console.log(error.message)
    }
  }

module.exports = {
    insertUser,
    verifyLogin,
    callMrCleaner,
    myPickups,
    myPointss,
    getGiftCards,
    unlockCard
    
}