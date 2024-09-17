import nodemailer from "nodemailer";
// import { Resend } from "resend";

// don't have a domain to use resend
// const resend = new Resend(process.env.RESEND_API_KEY);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASS,
  },
});

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await transporter.sendMail({
    from: "Acme <mazen.mezoo20189@gmail.com>",
    to: email,
    subject: "2FA code",
    html: `<p>your 2FA code: ${token}</p>`,
  });

  // await resend.emails.send({
  //   from: "Acme <onboarding@resend.dev>",
  //   to: email,
  //   subject: "2FA code",
  //   html: `<p>your 2FA code: ${token}</p>`,
  // });
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const resetPasswordLink = `${domain}/new-password?token=${token}`;

  await transporter.sendMail({
    from: "Acme <mazen.mezoo20189@gmail.com>",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href=${resetPasswordLink}>here</a> to reset password.</p>`,
  });

  // await resend.emails.send({
  //   from: "Acme <onboarding@resend.dev>",
  //   to: email,
  //   subject: "Reset your password",
  //   html: `<p>Click <a href=${resetPasswordLink}>here</a> to reset password.</p>`,
  // });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/new-verification?token=${token}`;

  await transporter.sendMail({
    from: "Acme <mazen.mezoo20189@gmail.com>",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href=${confirmLink}>here</a> to confirm email.</p>`,
  });

  // await resend.emails.send({
  //   from: "Acme <onboarding@resend.dev>",
  //   to: email,
  //   subject: "Confirm your email",
  //   html: `<p>Click <a href=${confirmLink}>here</a> to confirm email.</p>`,
  // });
};
