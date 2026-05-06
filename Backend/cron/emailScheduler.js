import cron from 'node-cron';
import nodemailer from 'nodemailer';
import { UserModel } from '../models/UserModel.js';
import 'dotenv/config';
import https from 'https';
import http from 'http';

// Setup nodemailer transport with SendGrid (Production Level)
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey', // This is always the string 'apikey' for SendGrid
    pass: process.env.SENDGRID_API_KEY
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

            // Use SendGrid Web API (HTTPS bypasses Render's SMTP port blocking)
            const sendGridData = {
              personalizations: [{ to: [{ email: user.email }] }],
              from: { email: process.env.EMAIL_USER, name: "TaskMaster" },
              subject: `Reminder: Task "${todo.taskName}" starts in ${minutesLeft} minutes!`,
              content: [{
                type: "text/html", 
                value: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                  <h2 style="color: #6366f1;">TaskMaster Reminder ⏰</h2>
                  <p>Hello <strong>${user.name}</strong>,</p>
                  <p>This is a reminder that your task is starting very soon!</p>
                  <div style="background-color: #f3f4f6; padding: 15px; border-left: 4px solid #6366f1; margin: 20px 0;">
                    <h3 style="margin: 0 0 10px 0; color: #1f2937;">📌 ${todo.taskName}</h3>
                    <p style="margin: 0; color: #4b5563;"><strong>Due:</strong> ${new Date(todo.dueDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                    <p style="margin: 10px 0 0 0; color: #d97706; font-weight: bold;">Starts in exactly ${minutesLeft} minutes!</p>
                  </div>
                  <p>Log in to your TaskMaster dashboard to complete it.</p>
                  <a href="${process.env.RENDER_EXTERNAL_URL || 'http://localhost:5173'}" style="display: inline-block; padding: 10px 20px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Open TaskMaster</a>
                </div>
              `}]
            };

            const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(sendGridData)
            });

            if (!response.ok) {
               const errText = await response.text();
               console.error(`SendGrid failed: ${errText}`);
               continue; // skip marking as sent if failed
            }

            console.log(`[${new Date().toISOString()}] Reminder email sent to ${user.email} for task "${todo.taskName}"`);

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
