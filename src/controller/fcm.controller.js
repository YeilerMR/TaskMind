import User from "../model/user.model.js";

export const registerFcmToken = async (req, res) => {
    console.log("Hola");
    const { userId, fcmToken } = req.body;
    console.log("desde fcm controller ", req.body);
    const user = await User.findOne({ where: { DSC_IDENTIFICATION: userId } });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    user.FCM_TOKEN = fcmToken;
    await user.save();

    return res.status(200).json({ message: "Token guardado correctamente" });
};