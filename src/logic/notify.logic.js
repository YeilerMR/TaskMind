import EvaluationType from "../model/evaluation.model.js";
import User from "../model/user.model.js";
import { Op } from "sequelize";
import admin from "../config/firebase.js";

export const notifyUpcomingEvaluations = async () => {
    const now = new Date();
    const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const nowStr = formatDateToSQL(now);
    const next24hStr = formatDateToSQL(next24h);

    const evaluations = await EvaluationType.findAll({
        where: {
            DATE_EVALUATION: {
                [Op.between]: [nowStr, next24hStr],
            },
        },
        include: [User],  // Sequelize usará el model name "user" aquí
    });

    console.log(`Evaluaciones encontradas: ${evaluations.length}`);

    for (const evaluation of evaluations) {
        // ✅ Usa la propiedad correcta: "user" (minúscula) porque tu modelo User
        const user = evaluation.user;

        console.log("Evaluación:", evaluation.DSC_NAME);
        console.log("Usuario relacionado:", user ? user.DSC_EMAIL : "No hay usuario relacionado");
        console.log("Token FCM:", user?.FCM_TOKEN);

        if (!user?.FCM_TOKEN) {
            console.log("No hay token FCM para este usuario, se omite.");
            continue;
        }

        const email = user.DSC_EMAIL;

        try {
            console.log("Enviando notificación a", email);
            await admin.messaging().send({
                token: user.FCM_TOKEN,
                notification: {
                    title: "Evaluación próxima",
                    body: `Tenés una evaluación de ${evaluation.DSC_NAME} muy pronto.`,
                },
                android: {
                    priority: "high",
                    notification: {
                        channelId: "event_reminder_channel",
                    },
                },
            });
            console.log("Notificación enviada a", email);
        } catch (error) {
            console.error(`Error al enviar a ${email}:`, error.message);
        }
    }
};

function formatDateToSQL(date) {
    return date.toISOString().slice(0, 19).replace("T", " ");
}
