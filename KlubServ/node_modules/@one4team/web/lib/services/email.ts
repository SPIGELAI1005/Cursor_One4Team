import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface WelcomeEmailParams {
  to: string;
  name: string;
  clubName: string;
  verificationUrl?: string;
}

export interface VerificationEmailParams {
  to: string;
  name: string;
  verificationUrl: string;
}

export interface PasswordResetEmailParams {
  to: string;
  name: string;
  resetUrl: string;
}

export class EmailService {
  /**
   * Send welcome email to new club admin
   */
  static async sendWelcomeEmail(params: WelcomeEmailParams) {
    try {
      const { data, error } = await resend.emails.send({
        from: 'One4Team <noreply@one4team.com>',
        to: [params.to],
        subject: `Welcome to One4Team, ${params.name}!`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to One4Team</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="margin: 0; font-size: 28px;">Welcome to One4Team!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Your sports club management platform</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <h2 style="margin: 0 0 15px 0; color: #1757FF;">Welcome aboard!</h2>
              <p style="margin: 0 0 15px 0;">
                Welcome to One4Team! We're excited to help you manage ${params.clubName} more effectively.
              </p>
              <p style="margin: 0 0 20px 0;">
                With One4Team, you'll have everything you need to run your sports club efficiently:
              </p>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Member management and communication</li>
                <li>Payment processing and billing</li>
                <li>Event scheduling and management</li>
                <li>Performance tracking and analytics</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background-color: #1757FF; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Get Started
              </a>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
              <p style="margin: 0 0 10px 0;">Best regards,</p>
              <p style="margin: 0; font-weight: bold;">The One4Team Team</p>
              <p style="margin: 10px 0 0 0;">© 2024 One4Team. All rights reserved.</p>
            </div>
          </body>
          </html>
        `,
      });

      if (error) {
        console.error('Resend error:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error };
    }
  }

  /**
   * Send email verification
   */
  static async sendVerificationEmail(params: VerificationEmailParams) {
    try {
      const { data, error } = await resend.emails.send({
        from: 'One4Team <noreply@one4team.com>',
        to: [params.to],
        subject: 'Verify your email address - One4Team',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email - One4Team</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="margin: 0; font-size: 28px;">Verify Your Email</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Complete your One4Team account setup</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <h2 style="margin: 0 0 15px 0; color: #1757FF;">Almost there!</h2>
              <p style="margin: 0 0 15px 0;">
                Thanks for signing up for One4Team! To complete your account setup, please verify your email address by clicking the button below.
              </p>
              <p style="margin: 0 0 20px 0;">
                This verification step helps us ensure the security of your account and allows you to access all One4Team features.
              </p>
            </div>
            
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${params.verificationUrl}" style="display: inline-block; background-color: #1757FF; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Verify Email Address
              </a>
            </div>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin-bottom: 30px;">
              <p style="margin: 0; font-size: 14px; color: #856404;">
                <strong>Security Note:</strong> This link will expire in 24 hours. If you didn't create a One4Team account, you can safely ignore this email.
              </p>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
              <p style="margin: 0 0 10px 0;">Best regards,</p>
              <p style="margin: 0; font-weight: bold;">The One4Team Team</p>
              <p style="margin: 10px 0 0 0;">© 2024 One4Team. All rights reserved.</p>
            </div>
          </body>
          </html>
        `,
      });

      if (error) {
        console.error('Resend error:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error };
    }
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(params: PasswordResetEmailParams) {
    try {
      const { data, error } = await resend.emails.send({
        from: 'One4Team <noreply@one4team.com>',
        to: [params.to],
        subject: 'Reset your password - One4Team',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password - One4Team</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="margin: 0; font-size: 28px;">Reset Your Password</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Secure your One4Team account</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <h2 style="margin: 0 0 15px 0; color: #1757FF;">Password Reset Request</h2>
              <p style="margin: 0 0 15px 0;">
                We received a request to reset your password for your One4Team account. Click the button below to create a new password.
              </p>
              <p style="margin: 0 0 20px 0;">
                If you didn't request this password reset, you can safely ignore this email. Your current password will remain unchanged.
              </p>
            </div>
            
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${params.resetUrl}" style="display: inline-block; background-color: #1757FF; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin-bottom: 30px;">
              <p style="margin: 0; font-size: 14px; color: #856404;">
                <strong>Security Note:</strong> This link will expire in 1 hour for your security. If you need to reset your password after this time, please request a new reset link.
              </p>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
              <p style="margin: 0 0 10px 0;">Best regards,</p>
              <p style="margin: 0; font-weight: bold;">The One4Team Team</p>
              <p style="margin: 10px 0 0 0;">© 2024 One4Team. All rights reserved.</p>
            </div>
          </body>
          </html>
        `,
      });

      if (error) {
        console.error('Resend error:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error };
    }
  }
} 