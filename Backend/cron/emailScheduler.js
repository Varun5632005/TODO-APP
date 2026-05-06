import cron from 'node-cron';
import nodemailer from 'nodemailer';
import { UserModel } from '../models/UserModel.js';
import 'dotenv/config';
import https from 'https';
import http from 'http';

// Setup nodemailer transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Run every minute
const startEmailScheduler = () => {
  cron.schedule('* * * * *', async () => {
    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('Skipping email scheduler: EMAIL_USER or EMAIL_PASS not configured in .env');
        return;
      }

      const now = new Date();
      console.log(`[${now.toISOString()}] Checking for tasks due soon...`);
      
      const sixtyMinutesFromNow = new Date(now.getTime() + 60 * 60000);

      // Find users with tasks that are pending, haven't been notified, and due in the next 60 mins
      const users = await UserModel.find({
        "todos": {
          $elemMatch: {
            status: "pending",
            notificationSent: { $ne: true },
            dueDate: {
              $gt: now,
              $lte: sixtyMinutesFromNow
            }
          }
        }
      });

      for (let user of users) {
        let tasksUpdated = false;

        for (let todo of user.todos) {
          if (
            todo.status === "pending" && 
            todo.notificationSent !== true && 
            todo.dueDate && 
            todo.dueDate > now && 
            todo.dueDate <= sixtyMinutesFromNow
          ) {
            
            // Calculate exact minutes left
            const minutesLeft = Math.round((todo.dueDate - now) / 60000);

            // Send email
            const mailOptions = {
              from: `"TaskMaster" <${process.env.EMAIL_USER}>`,
              to: user.email,
              subject: `Reminder: Task "${todo.taskName}" starts in ${minutesLeft} minutes!`,
              html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                  <h2 style="color: #6366f1;">TaskMaster Reminder ⏰</h2>
                  <p>Hi ${user.name},</p>
                  <p>This is a friendly reminder that your task is starting soon.</p>
                  <div style="background: #f8fafc; padding: 15px; border-left: 4px solid #6366f1; margin: 20px 0;">
                    <h3 style="margin: 0 0 10px 0;">${todo.taskName}</h3>
                    <p style="margin: 0;"><strong>Description:</strong> ${todo.description}</p>
                    <p style="margin: 10px 0 0 0;"><strong>Due:</strong> ${todo.dueDate.toLocaleString()}</p>
                  </div>
                  <p>Log in to TaskMaster to mark it as completed!</p>
                </div>
              `
            };

            await transporter.sendMail(mailOptions);
            console.log(`Email sent to ${user.email} for task ${todo.taskName}`);

            // Mark as sent
            todo.notificationSent = true;
            tasksUpdated = true;
          }
        }

        // Save the user document if we modified any tasks
        if (tasksUpdated) {
          await user.save();
        }
      }
    } catch (error) {
      console.error('Error in email scheduler:', error);
    }
  });
  console.log('Email scheduler started.');

  // ── Keep-alive ping (Render free tier) ──────────────────────────────────────
  // Render exposes RENDER_EXTERNAL_URL automatically on every service.
  // We ping our own /ping endpoint every 10 minutes so the dyno never idles.
  const selfUrl = process.env.RENDER_EXTERNAL_URL;
  if (selfUrl) {
    cron.schedule('*/10 * * * *', () => {
      const pingUrl = `${selfUrl}/ping`;
      const client = pingUrl.startsWith('https') ? https : http;
      client.get(pingUrl, (res) => {
        console.log(`[keep-alive] pinged ${pingUrl} → ${res.statusCode}`);
      }).on('error', (err) => {
        console.error('[keep-alive] ping failed:', err.message);
      });
    });
    console.log(`Keep-alive scheduler started → will ping ${selfUrl}/ping every 10 min.`);
  } else {
    console.log('Keep-alive skipped: RENDER_EXTERNAL_URL not set (local dev).');
  }
  // ────────────────────────────────────────────────────────────────────────────
};

export default startEmailScheduler;
