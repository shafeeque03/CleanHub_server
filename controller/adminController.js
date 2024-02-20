const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Waste = require('../model/wasteModel')
const User = require('../model/userModel')
const Point = require('../model/pointModel')
const GiftCard = require('../model/giftcardModel')
const UniqueGiftcard = require('../model/uniqueGiftcardModel')
dotenv.config();

const adminLogin = async (req, res) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const userName = "Admin";
    try {
      const { email, password } = req.body;
      // console.log(email, password, "email and passowrd vrooo")
      if (adminEmail === email) {
        if (adminPassword === password) {
          // console.log("something fishy password")
          const token = jwt.sign(
            {
              name: userName,
              email: adminEmail,
              role: "admin",
            },
            process.env.ADMIN_SECRET,
            {
              expiresIn: "1h",
            }
          );
          res
            .status(200)
            .json({ userName, token, message: `Welome ${userName}` });
        } else {
          res.status(403).json({ message: "Incorrect Password" });
        }
      } else {
        res.status(401).json({ message: "Incorrect email" });
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ status: "Internal Server Error" });
    }
  };

  const allPickups = async(req,res)=>{
    try {
        const pickups = await Waste.find()
        res.status(200).json({pickups})
    } catch (error) {
        console.log(error.message)
    }
  }

  const updateWeight = async(req,res)=>{
    try {
        const {pid,weight} = req.body
        const totalPoints = weight*50
        const newWaste = await Waste.findByIdAndUpdate({_id:pid},{$set:{weight:weight,point:totalPoints,status:"Success"}})
        const pointUpdate = await Point.findOneAndUpdate(
            { userId: newWaste.userId },
            { $inc: { point:totalPoints } }
          );
          const userUpdate = await User.findByIdAndUpdate({_id:newWaste.userId},{$set:{isRequested:false}})
          
          
        res.status(200).json({newWaste, message:"Success"})
    } catch (error) {
        console.log(error.message)
    }
  }

  function generateRandomCode() {
    // Generate a random string of alphanumeric characters
    const length = 8;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
  
    return code;
  }

  const addGiftCardd = async (req, res) => {
    try {
      const { value } = req.body;
      const users = await User.find();
      const alreadyExist = await GiftCard.findOne({
        name: { $regex: new RegExp(value.cardName, 'i') },
      });
      if(alreadyExist){
        return res.status(403).json({ message: "Card Already Exist" });
      }else{
        const uniqueCard = new UniqueGiftcard({
            name: value.cardName,
            point_need: value.pointRequired
        })

        await uniqueCard.save()
          for (const user of users) {
          const secretCode = generateRandomCode();
            const card = new GiftCard({
              name: value.cardName,
              point_need: value.pointRequired,
              code: secretCode,
              userId: user._id,
            });
      
            await card.save();
          }
      }
  
      res.status(200).json({ message: "Gift cards added successfully for all users" });
  
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  const allGiftCards = async(req,res)=>{
    try {
      const allCards = await UniqueGiftcard.find()
      return res.status(200).json({allCards})
    } catch (error) {
      console.log(error.message)
    }
  }

  const usersList = async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json({ users });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ status: "Internal Server Error" });
    }
  };
  
  const userBlock = async (req, res) => {
    try {
      const { userId, status } = req.body;
      await User.findByIdAndUpdate(userId, { $set: { is_blocked: !status } });
      res.status(200).json({ message: "updated" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ status: "Internal Server Error" });
    }
  };

  module.exports = {
    adminLogin,
    allPickups,
    updateWeight,
    addGiftCardd,
    allGiftCards,
    usersList,
    userBlock
  }