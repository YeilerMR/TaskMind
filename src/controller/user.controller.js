import { user_Register, delete_User,update_User } from '../logic/user/user.logic.js';
import User from '../model/user.model.js';
import { encryptData, compareData } from '../Lib/encryptData.js'
import { validateUpdateUser } from '../logic/validateField.logic.js';

// import { format } from 'date-fns-tz';


export const registerUsers = async (req, res) => {
  try {
    user_Register(req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const updateUser = async (req, res) => {
  try {
    update_User(req,res);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



export const deleteUser = async (req, res) => {
  try {
   delete_User(req,res);  
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};