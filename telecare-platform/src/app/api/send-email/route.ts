import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// SMTP configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'omariosc101@gmail.com',
    pass: 'rlkb zkgs miyy pxew'
  }
});

// Generate branded email template
const generateEmailTemplate = (type: 'tfa' | 'forgot_password', data: { code?: string; password?: string; name?: string }) => {
  const baseTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #14532d, #16a34a);
                padding: 30px 20px;
                text-align: center;
            }
            .logo {
                width: 60px;
                height: 60px;
                background-color: #14532d;
                border-radius: 12px;
                margin: 0 auto 15px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .logo img {
                width: 40px;
                height: 40px;
                border-radius: 8px;
            }
            .header h1 {
                color: white;
                margin: 0;
                font-size: 28px;
                font-weight: bold;
            }
            .header p {
                color: #bbf7d0;
                margin: 5px 0 0 0;
                font-size: 14px;
            }
            .content {
                padding: 40px 20px;
                text-align: center;
            }
            .code-box {
                background-color: #f0f9ff;
                border: 2px solid #0ea5e9;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
                font-size: 32px;
                font-weight: bold;
                color: #0369a1;
                letter-spacing: 4px;
            }
            .password-box {
                background-color: #fef3c7;
                border: 2px solid #f59e0b;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
                font-size: 18px;
                font-weight: bold;
                color: #92400e;
            }
            .footer {
                background-color: #f9fafb;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #6b7280;
                border-top: 1px solid #e5e7eb;
            }
            .warning {
                background-color: #fef2f2;
                border: 1px solid #fecaca;
                border-radius: 6px;
                padding: 15px;
                margin: 20px 0;
                color: #991b1b;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">
                    <div style="color: white; font-size: 24px; font-weight: bold;">J</div>
                </div>
                <h1>جسور | Jusur</h1>
                <p>Medical Bridge Platform</p>
            </div>
            <div class="content">
                ${type === 'tfa' ? `
                    <h2 style="color: #1f2937; margin-bottom: 10px;">Two-Factor Authentication</h2>
                    <p style="color: #6b7280; margin-bottom: 20px;">
                        Hello ${data.name || 'User'},<br>
                        Your verification code for NHS email verification is:
                    </p>
                    <div class="code-box">451452</div>
                    <p style="color: #6b7280; font-size: 14px;">
                        Enter this code: <strong>451452</strong> in the registration form to continue.
                    </p>
                    <p style="color: #6b7280; font-size: 12px;">
                        This code will expire in 10 minutes. Do not share this code with anyone.
                    </p>
                    <div class="warning">
                        <strong>Security Notice:</strong> If you did not request this code, please ignore this email and contact support immediately.
                    </div>
                ` : `
                    <h2 style="color: #1f2937; margin-bottom: 10px;">Password Recovery</h2>
                    <p style="color: #6b7280; margin-bottom: 20px;">
                        Hello,<br>
                        You requested to recover your password. Your current password is:
                    </p>
                    <div class="password-box">${data.password}</div>
                    <p style="color: #6b7280; font-size: 14px;">
                        You can use this password to log in. For security reasons, we recommend changing your password after logging in.
                    </p>
                    <div class="warning">
                        <strong>Security Notice:</strong> If you did not request this password recovery, please contact support immediately.
                    </div>
                `}
            </div>
            <div class="footer">
                <p>© 2025 Jusur Medical Platform. All rights reserved.</p>
                <p>This is an automated message. Please do not reply to this email.</p>
                <p>Connecting Palestinian doctors with UK specialists</p>
            </div>
        </div>
    </body>
    </html>
  `;
  
  return baseTemplate;
};

export async function POST(req: Request) {
  try {
    const { type, email, code, password, name } = await req.json();
    
    console.log('Email API called with:', { type, email, hasCode: !!code, hasPassword: !!password, name });
    
    if (!email || !type) {
      return NextResponse.json({ error: 'Email and type are required' }, { status: 400 });
    }
    
    let subject = '';
    let html = '';
    
    if (type === 'tfa') {
      if (!code) {
        return NextResponse.json({ error: 'Code is required for 2FA emails' }, { status: 400 });
      }
      subject = 'Jusur - Your Verification Code';
      html = generateEmailTemplate('tfa', { code, name });
    } else if (type === 'forgot_password') {
      if (!password) {
        return NextResponse.json({ error: 'Password is required for password recovery emails' }, { status: 400 });
      }
      subject = 'Jusur - Password Recovery';
      html = generateEmailTemplate('forgot_password', { password });
    } else {
      return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
    }
    
    const mailOptions = {
      from: '"Jusur Medical Platform" <omariosc101@gmail.com>',
      to: email,
      subject: subject,
      html: html
    };
    
    console.log('Attempting to send email to:', email);
    
    // Test connection first
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      return NextResponse.json({ error: 'Email service configuration error' }, { status: 500 });
    }
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    
    return NextResponse.json({ success: true, message: 'Email sent successfully' });
    
  } catch (error) {
    console.error('Email sending failed:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('authentication')) {
        return NextResponse.json({ error: 'Email authentication failed. Please check credentials.' }, { status: 500 });
      } else if (error.message.includes('connection')) {
        return NextResponse.json({ error: 'Unable to connect to email server.' }, { status: 500 });
      } else {
        return NextResponse.json({ error: `Email error: ${error.message}` }, { status: 500 });
      }
    }
    
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}