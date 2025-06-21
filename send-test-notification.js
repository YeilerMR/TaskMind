import admin from "./src/config/firebase.js";

const testToken = "eVDPMcNCSaijKpZd6dTMfJ:APA91bHggo_aoGk6Mam17RafXfZpa8hpWhTkq3ldSz2OHSU2n9-XREnOQijAEMwF2S9HMmfG8JSVndu6jqPnRisaR64OpaX1NI8O79PhXINBjJMpcYXQPOs";

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
