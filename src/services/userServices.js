import User from "../model/user.model.js";


export const userServices = {
  async createUser(data) {
    try {
      const user = await User.create({
        DSC_FIRST_NAME: data.DSC_FIRST_NAME,
        DSC_LAST_NAME_ONE: data.DSC_LAST_NAME_ONE,
        DSC_IDENTIFICATION: data.DSC_IDENTIFICATION,
        DSC_EMAIL: data.DSC_EMAIL,
        DSC_PASSWORD: data.DSC_PASSWORD,
        DATE_CREATED: data.DATE_CREATED,
        STATUS: 1,
        DSC_CAREER: data.DSC_CAREER || "N/E",
      });

      return user;
    } catch (error) {
      console.error('Error en createUser:', error);

      if (error.name === 'SequelizeUniqueConstraintError') return 1;
      if (error.name === 'SequelizeValidationError') return 2;

      return 0;
    }
  },
  async delectUser(user){
   try{
    user.STATUS = 0;
    const userStatus=await user.save();
    return userStatus;
   }catch(error){
    console.error('Error en deleteUser:', error);
    return null;
   }
  },
  async updateUser(data){
    try{
    const user =  await user.update({
      DSC_FIRST_NAME: data.DSC_FIRST_NAME,
      DSC_LAST_NAME_ONE: data.DSC_LAST_NAME_ONE,
      DSC_PASSWORD: data.DSC_PASSWORD, 
      DSC_CAREER: data.DSC_CAREER || "N/E",
    });
    return user;
  }catch(error){
    console.error('Error en updateUser:', error);
    return null;
  }
  }
};

