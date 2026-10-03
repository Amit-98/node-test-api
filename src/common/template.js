/**
 * Common Email Templates Collection
 */

export default {
  /**
   * 1. ADMIN INQUIRY NOTIFICATION TEMPLATE
   * Jab user form submit kare, Admin ko ye alert mail jayega
   */
  adminContactNotification: (data) => {
    const { name, email, mobile, company, subject, message } = data;
    const formattedDate = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    return {
      to: process.env.ADMIN_EMAIL || 'sigmaplextech@gmail.com',
      subject: `🚨 New Inquiry: ${subject || 'Contact Us Form'} - from ${name || 'User'}`,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f7fa; margin: 0; padding: 20px; color: #2d3748; }
          .card { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }
          .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: #ffffff; padding: 25px 30px; }
          .header h2 { margin: 0 0 6px 0; font-size: 22px; }
          .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
          .content { padding: 30px; }
          .info-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
          .info-table td { padding: 10px 14px; font-size: 14px; border-bottom: 1px solid #edf2f7; }
          .info-table td.label { font-weight: 600; color: #64748b; width: 30%; background: #f8fafc; }
          .info-table td.value { color: #1e293b; font-weight: 500; }
          .msg-box { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 15px 20px; border-radius: 6px; font-size: 14px; line-height: 1.6; }
          .btn-container { text-align: center; margin: 25px 0 10px; }
          .reply-btn { background: #2563eb; color: #ffffff !important; padding: 12px 26px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block; }
          .footer { background: #0f172a; color: #94a3b8; text-align: center; padding: 16px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <span class="badge">Sigmaplex Admin Alert</span>
            <h2>New Contact Inquiry Received</h2>
            <small>Received on ${formattedDate}</small>
          </div>
          <div class="content">
            <table class="info-table">
              <tr><td class="label">Full Name</td><td class="value">${name || 'N/A'}</td></tr>
              <tr><td class="label">Email</td><td class="value"><a href="mailto:${email}">${email || 'N/A'}</a></td></tr>
              <tr><td class="label">Mobile</td><td class="value">${mobile || 'N/A'}</td></tr>
              <tr><td class="label">Company</td><td class="value">${company || 'N/A'}</td></tr>
              <tr><td class="label">Subject</td><td class="value">${subject || 'N/A'}</td></tr>
            </table>

            <h4 style="margin: 0 0 10px 0; color: #334155;">User Message:</h4>
            <div class="msg-box">
              ${(message || 'No message provided.').replace(/\n/g, '<br/>')}
            </div>

            <div class="btn-container">
              <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || 'Inquiry at Sigmaplex')}" class="reply-btn">✉️ Direct Reply to User</a>
            </div>
          </div>
          <div class="footer">
            Sigmaplex Technologies • Automated Inquiry Management
          </div>
        </div>
      </body>
      </html>
      `
    };
  },

  /**
   * 2. USER AUTO-REPLY TEMPLATE
   * User ko confirmation aur thank you ka stylish mail jayega
   */
  userAutoReply: (data) => {
    const { name, email, subject, message } = data;

    return {
      to: email,
      subject: `Thank you for contacting Sigmaplex Technologies! We received your message`,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #334155; }
          .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); }
          .header { background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%); color: #ffffff; padding: 35px 30px; text-align: center; }
          .header h1 { margin: 0 0 8px 0; font-size: 24px; font-weight: 700; }
          .header p { margin: 0; opacity: 0.9; font-size: 15px; }
          .content { padding: 30px 30px 25px; line-height: 1.7; font-size: 15px; }
          .highlight-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px 20px; margin: 20px 0; }
          .summary-title { font-weight: 600; font-size: 13px; text-transform: uppercase; color: #64748b; margin-bottom: 8px; letter-spacing: 0.5px; }
          .summary-text { font-size: 14px; color: #1e293b; font-style: italic; }
          .timeline-box { background: #eff6ff; border-radius: 8px; padding: 15px; text-align: center; color: #1d4ed8; font-weight: 600; font-size: 14px; margin-top: 20px; }
          .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #64748b; }
          .footer { background: #0f172a; color: #94a3b8; text-align: center; padding: 20px; font-size: 12px; line-height: 1.5; }
          .footer a { color: #38bdf8; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>Thank You for Reaching Out!</h1>
            <p>We have successfully received your inquiry</p>
          </div>
          <div class="content">
            <p>Dear <strong>${name || 'Valued Client'}</strong>,</p>
            <p>Thank you for getting in touch with <strong>Sigmaplex Technologies</strong>. We appreciate your interest in our solutions.</p>

            <div class="highlight-card">
              <div class="summary-title">Summary of your message</div>
              <p style="margin: 0 0 6px 0;"><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
              <div class="summary-text">"${(message || 'No additional details.').substring(0, 300)}"</div>
            </div>

            <div class="timeline-box">
              ⏱️ Our team is reviewing your message and will get back to you within <strong>24 business hours</strong>.
            </div>

            <div class="signature">
              Warm regards,<br/>
              <strong>The Sigmaplex Team</strong><br/>
              <span style="font-size: 13px;">Sigmaplex Technologies</span>
            </div>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Sigmaplex Technologies. All rights reserved.<br/>
            Need immediate assistance? Reach us directly at <a href="mailto:sigmaplextech@gmail.com">sigmaplextech@gmail.com</a>
          </div>
        </div>
      </body>
      </html>
      `
    };
  }
};
