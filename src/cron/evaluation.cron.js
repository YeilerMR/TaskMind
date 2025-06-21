import cron from "node-cron";
import { notifyUpcomingEvaluations } from "../logic/notify.logic.js";

cron.schedule("0 * * * *", () => {
  console.log("Ejecutando notificaciones cada minuto...");
  notifyUpcomingEvaluations();
});

// ─────────────────────────────────────────────────────────
// CRON SCHEDULER FOR EVALUATION NOTIFICATIONS
// - For testing purposes: "*/1 * * * *"   → every minute
// - For production use:   "0 * * * *"     → every hour at minute 0
// ─────────────────────────────────────────────────────────