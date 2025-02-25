import nodemailer from "nodemailer";

/**
 * Generates a verification code between 100000 and 999999.
 *
 * @return {string} The generated verification code as a string.
 */
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

/**
 * Sends a verification code to the provided phone number using Twilio API.
 *
 * @param {string} phoneNumber - The phone number to send the verification code to.
 * @param {string} verificationCode - The verification code to be sent.
 * @return {Promise<void>} A promise representing the completion of the message sending operation.
 */

export const sendVerificationCode = async (email, verificationCode) => {
  console.log("Sending verification code to:", email);

  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // e.g., smtp.gmail.com for Gmail
    port: 587, // or 465 for SSL
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // your email address
      pass: process.env.EMAIL_PASS, // your email password
    },
  });

  // Define email options
  const mailOptions = {
    from: process.env.EMAIL_USER, // sender address
    to: email, // recipient address
    subject: "Your Laundrify Verification Code",
    text: `Your verification code is: ${verificationCode}`,
  };

  console.log("Sending email with options:", mailOptions);

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

/**
 * Saves the verification code for a given phone number with expiry time and returns the updated user.
 *
 * @param {string} phoneNumber - The phone number for which the verification code is saved.
 * @param {string} verificationCode - The verification code to be saved.
 * @return {Promise<object>} A promise that resolves to the updated user object.
 */
