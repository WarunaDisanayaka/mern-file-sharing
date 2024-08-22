import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "d611f0b4600977",
    pass: "f9eb85d1d05421",
  },
});

export const sendMail = (to, subject, text) => {
  const mailOptions = {
    from: "warunapradeep407@gmail.com",
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};
