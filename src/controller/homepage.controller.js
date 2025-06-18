import { initHomePage } from "../logic/homepage/homepage.logic.js";



export const homepageLanding = async (req, res) => {
    try {
      initHomePage(req,res);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
   };