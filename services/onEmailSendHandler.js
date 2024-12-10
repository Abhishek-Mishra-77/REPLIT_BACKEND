import nodemailer from 'nodemailer';



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.AUTHEMAIL,
    pass: process.env.AUTHPASSWORD
  }
});

async function sendOTPToEmail(email, otp) {
  const mailOptions = {
    from: process.env.AUTHEMAIL,
    to: email,
    subject: "Your OTP Code",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your OTP Code</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f9; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden; border: 1px solid #e0e0e0;">
          <div style="background: #1C2333; color: #ffffff; text-align: center; padding: 20px;">
            <h1 style="margin: 0; font-size: 24px;">Your OTP Code</h1>
          </div>
          <div style="padding: 20px; text-align: center; color: #333333;">
            <h2 style="margin: 20px 0; font-size: 22px; color: #1C2333;">Hello ${email}</h2>
            <p style="margin: 10px 0; line-height: 1.5;">Thank you for using our service! Your OTP code is:</p>
            <div style="display: inline-block; padding: 10px 20px; font-size: 18px; background: #1C2333; color: #ffffff; border-radius: 4px; margin-top: 20px; text-decoration: none;">
              ${otp}
            </div>
            <p style="margin: 20px 0; line-height: 1.5;">This code is valid for 10 minutes. Please do not share it with anyone.</p>
          </div>
          <div style="background: #1C2333; color: #ffffff; text-align: center; padding: 10px; font-size: 14px;">
            <p style="margin: 0;">Developed by Abhishek Mishra</p>
            <p style="margin: 5px 0;">
              <a href="https://www.linkedin.com/in/abhishekmishra77/" style="color: #58a6ff; text-decoration: none;">LinkedIn</a> | 
              <a href="https://linktr.ee/abhishekmishra07" style="color: #58a6ff; text-decoration: none;">Portfolio</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}: ${otp}`);
    return otp;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
}

export default sendOTPToEmail;
