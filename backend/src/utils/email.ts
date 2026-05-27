import nodemailer from 'nodemailer';
import { convert } from 'html-to-text';
import ejs from 'ejs';
import path from 'path';
import fs from 'fs';
// import '../../src/view/verficationEmail'
// import '../view/verficationEmail'

/**
 * Email consists of various private and public methods dedicated for sending various email templates.
 */
class Email {
  constructor() {}

  private getRequiredEnv(name: string) {
    const value = process.env[name];
    if (!value) {
      throw new Error(`Missing required email environment variable: ${name}`);
    }
    return value;
  }

  private getTemplatePath(template: string) {
    const possiblePaths = [
      path.resolve(__dirname, `../view/${template}.ejs`),
      path.resolve(process.cwd(), `src/view/${template}.ejs`),
      path.resolve(process.cwd(), `build/view/${template}.ejs`),
    ];

    const filePath = possiblePaths.find((templatePath) =>
      fs.existsSync(templatePath),
    );

    if (!filePath) {
      throw new Error(
        `Email template "${template}" not found. Checked: ${possiblePaths.join(
          ', ',
        )}`,
      );
    }

    return filePath;
  }
  /**
   * emailtransporter is a private method that creates email transporter depending if it is in production or development mode.
   * @returns nodemailer email transporter for sending email
   */
  private emailTransporter() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        host: this.getRequiredEnv('BREVO_HOST'),
        port: Number(this.getRequiredEnv('BREVO_PORT')),
        auth: {
          user: this.getRequiredEnv('BREVO_USER'),
          pass: this.getRequiredEnv('BREVO_PASS'),
        },
      });
    }

    return nodemailer.createTransport({
      host: this.getRequiredEnv('MAILTRAP_HOST'),
      port: Number(this.getRequiredEnv('MAILTRAP_PORT')),
      auth: {
        user: this.getRequiredEnv('MAILTRAP_USER'),
        pass: this.getRequiredEnv('MAILTRAP_PASS'),
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
    const filePath = this.getTemplatePath(template);

    try {
      const html = (await ejs.renderFile(filePath, { ...data })) as string;

      console.log('filepath: ', filePath);
      const mailOptions = {
        from:
          process.env.NODE_ENV === 'production'
            ? this.getRequiredEnv('EMAIL_SENDER_PROD')
            : this.getRequiredEnv('EMAIL_SENDER_DEV'),
        to: data.email,
        subject,
        html,
        text: convert(html as string),
      };

      await this.emailTransporter().sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
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
