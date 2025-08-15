export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface PasswordResetEmailData {
  email: string;
  resetToken: string;
  resetUrl: string;
}

export interface WelcomeEmailData {
  email: string;
  name: string;
  clubName: string;
  setupUrl: string;
}

/**
 * Email Service - Handles email operations
 */
export class EmailService {
  /**
   * Send a generic email
   */
  static async sendEmail(data: EmailData): Promise<void> {
    try {
      // For now, we'll just log the email
      // In production, this would integrate with a real email service like SendGrid, AWS SES, etc.
      console.log('Email would be sent:', {
        to: data.to,
        subject: data.subject,
        html: data.html,
        text: data.text,
      });

      // TODO: Implement actual email sending
      // Example with SendGrid:
      // const sgMail = require('@sendgrid/mail');
      // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      // await sgMail.send({
      //   to: data.to,
      //   from: process.env.FROM_EMAIL,
      //   subject: data.subject,
      //   html: data.html,
      //   text: data.text,
      // });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(data: PasswordResetEmailData): Promise<void> {
    const html = `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset for your account.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${data.resetUrl}">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
    `;

    const text = `
      Password Reset Request
      
      You requested a password reset for your account.
      Click the link below to reset your password:
      ${data.resetUrl}
      
      If you didn't request this, please ignore this email.
      This link will expire in 1 hour.
    `;

    await this.sendEmail({
      to: data.email,
      subject: 'Password Reset Request',
      html,
      text,
    });
  }

  /**
   * Send welcome email to new admin
   */
  static async sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
    const html = `
      <h2>Welcome to ${data.clubName}!</h2>
      <p>Hi ${data.name},</p>
      <p>Welcome to your new sports club management platform!</p>
      <p>Your club has been successfully set up and you can now access your dashboard.</p>
      <p>Click the link below to get started:</p>
      <a href="${data.setupUrl}">Access Your Dashboard</a>
      <p>If you have any questions, please don't hesitate to contact our support team.</p>
      <p>Best regards,<br>The One4Team Team</p>
    `;

    const text = `
      Welcome to ${data.clubName}!
      
      Hi ${data.name},
      
      Welcome to your new sports club management platform!
      Your club has been successfully set up and you can now access your dashboard.
      
      Click the link below to get started:
      ${data.setupUrl}
      
      If you have any questions, please don't hesitate to contact our support team.
      
      Best regards,
      The One4Team Team
    `;

    await this.sendEmail({
      to: data.email,
      subject: `Welcome to ${data.clubName} - Your Club is Ready!`,
      html,
      text,
    });
  }

  /**
   * Send subscription confirmation email
   */
  static async sendSubscriptionConfirmationEmail(email: string, clubName: string, planName: string): Promise<void> {
    const html = `
      <h2>Subscription Confirmed</h2>
      <p>Your subscription to ${planName} for ${clubName} has been successfully activated!</p>
      <p>You now have access to all the features included in your plan.</p>
      <p>If you have any questions about your subscription, please contact our support team.</p>
      <p>Best regards,<br>The One4Team Team</p>
    `;

    const text = `
      Subscription Confirmed
      
      Your subscription to ${planName} for ${clubName} has been successfully activated!
      You now have access to all the features included in your plan.
      
      If you have any questions about your subscription, please contact our support team.
      
      Best regards,
      The One4Team Team
    `;

    await this.sendEmail({
      to: email,
      subject: 'Subscription Confirmed',
      html,
      text,
    });
  }

  /**
   * Send payment failed email
   */
  static async sendPaymentFailedEmail(email: string, clubName: string): Promise<void> {
    const html = `
      <h2>Payment Failed</h2>
      <p>We were unable to process your payment for ${clubName}.</p>
      <p>Please update your payment method to continue using our services.</p>
      <p>You can update your payment information in your billing dashboard.</p>
      <p>If you need assistance, please contact our support team.</p>
      <p>Best regards,<br>The One4Team Team</p>
    `;

    const text = `
      Payment Failed
      
      We were unable to process your payment for ${clubName}.
      Please update your payment method to continue using our services.
      
      You can update your payment information in your billing dashboard.
      If you need assistance, please contact our support team.
      
      Best regards,
      The One4Team Team
    `;

    await this.sendEmail({
      to: email,
      subject: 'Payment Failed - Action Required',
      html,
      text,
    });
  }
} 