import nodemailer from 'nodemailer';
import { convert } from 'html-to-text';
import ejs from 'ejs';
import path from 'path';
// import '../../src/view/verficationEmail'
// import '../view/verficationEmail'

/**
 * Email consists of various private and public methods dedicated for sending various email templates.
 */
class Email {
  constructor() {}
  /**
   * emailtransporter is a private method that creates email transporter depending if it is in production or development mode.
   * @returns nodemailer email transporter for sending email
   */
  private emailTransporter() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        host: process.env.BREVO_HOST,
        port: Number(process.env.BREVO_PORT),
        auth: {
          user: process.env.BREVO_USER,
          pass: process.env.BREVO_PASS,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: Number(process.env.MAILTRAP_PORT),
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });
  }
  /**
   * This method is responsible for sending email. It picks up the specified template from the view folder and inject in info in data variable in the template.
   * @param template: string: Name of the email template to be sent
   * @param subject: string: Subject of the email to be sent.
   * @param data: object: key value pairs for the data that will be used in the email template specified.
   */
  private async send(template: string, subject: string, data: any) {
    // At build time, view will not be in build/dist folder, so the path is pointed to the view folder to pick up templates.

    // `../../src/view/${template}.ejs
    const filePath =
      process.env.NODE_ENV === 'production'
        ? path.resolve(__dirname, `../../src/view/${template}.ejs`)
        : path.resolve(__dirname, `../view/${template}.ejs`);

    ejs.renderFile(filePath, { ...data }, (err, result) => {
      if (err) {
        console.log(err);

        throw err;
      } else {
        const mailOptions = {
          from:
            process.env.NODE_ENV === 'production'
              ? process.env.EMAIL_SENDER_PROD
              : process.env.EMAIL_SENDER_DEV,
          to: data.email,
          subject,
          html: result,
          text: convert(result),
        };

        // Send the email.
        return this.emailTransporter().sendMail(mailOptions);
      }
    });
  }
  /**
   * Send email verification link to user.
   * @param data : Object: key: value - information to inject in the template including the receiver email address.
   */
  async sendVerificationEmail(data: any) {
    await this.send('verificationEmail', 'Verify your email address', data);
  }
  async sendPasswordResetLink(data: any) {
    await this.send(
      'resetPassword',
      'Password Reset Link - Expires in 15 minutes.',
      data,
    );
  }
}

export default new Email();
