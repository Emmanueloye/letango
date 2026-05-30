import nodemailer from 'nodemailer';
import { BrevoClient } from '@getbrevo/brevo';
import { convert } from 'html-to-text';
import ejs from 'ejs';
import path from 'path';
import fs from 'fs/promises';
// import '../../src/view/verficationEmail'
// import '../view/verficationEmail'

/**
 * Email consists of various private and public methods dedicated for sending various email templates.
 */
class Email {
  private brevo: BrevoClient;

  constructor() {
    this.brevo = new BrevoClient({
      apiKey: this.getRequiredEnv('BREVO_API_KEY'),
    });
  }

  private getRequiredEnv(name: string) {
    const value = process.env[name];
    if (!value) {
      throw new Error(`Missing required email environment variable: ${name}`);
    }
    return value;
  }

  private async getTemplatePath(template: string) {
    const possiblePaths = [
      path.resolve(__dirname, `../view/${template}.ejs`),
      path.resolve(process.cwd(), `src/view/${template}.ejs`),
      path.resolve(process.cwd(), `build/view/${template}.ejs`),
    ];

    for (const templatePath of possiblePaths) {
      try {
        await fs.access(templatePath);
        return templatePath;
      } catch (error) {}
    }
    throw new Error(
      `Email template "${template}" not found. Checked: ${possiblePaths.join(', ')}`,
    );
  }

  /**
   * emailtransporter is a private method that creates email transporter depending if it is in production or development mode.
   * @returns nodemailer email transporter for sending email
   */
  private emailTransporter() {
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
    const filePath = await this.getTemplatePath(template);

    try {
      const html = (await ejs.renderFile(filePath, { ...data })) as string;

      if (process.env.NODE_ENV === 'development') {
        await this.emailTransporter().sendMail({
          from: this.getRequiredEnv('EMAIL_SENDER_DEV'),
          to: data.email,
          subject,
          html,
          text: convert(html as string),
        });
        return;
      }

      // Send email using Brevo in production
      await this.brevo.transactionalEmails.sendTransacEmail({
        sender: {
          email: this.getRequiredEnv('EMAIL_SENDER_PROD'),
          name: process.env.EMAIL_SENDER_NAME || 'Letango',
        },
        to: [
          {
            email: data.email,
          },
        ],
        subject,
        htmlContent: html,
        textContent: convert(html as string),
      });
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
