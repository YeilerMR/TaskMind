import admin from "./src/config/firebase.js";

const testToken = "cFO917QcRR-BebfRKeYSTS:APA91bFiXr52TJsYf4I8ZvCd2unT1b5M2dJ6OhKd4yN19D4Gm19p5jRg26hBlWMrOoqcEe34CbRXead6GPSnaOSJp_TV0cmUSE6bqn1qPUwhQTt-4IWYjEI";

async function sendTest() {
    try {
        const message = {
            token: testToken,
            notification: {
                title: "Test Notificación",
                body: "Esta es una prueba desde backend",
            },
        };
        const response = await admin.messaging().send(message);
        console.log("Mensaje enviado con éxito:", response);
    } catch (error) {
        console.error("Error enviando mensaje:", error);
    }
}

sendTest();
