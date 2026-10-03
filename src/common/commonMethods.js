import _dbhelper from "../db/db-runner.js";
import bcrypt from 'bcrypt';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs/promises';
import nodemailer from 'nodemailer';

export default
{
  encPass: async (password) =>
  {
    const hash = await bcrypt.hash(password,10);
    return hash;
  },

  cmpPass: async (hash, newPass) =>{
    const result = await bcrypt.compare(newPass, hash);
    return result;
  },

  saveErrorLog: (_fileName, _funName, _errorMsg, _reqJson) =>
  {
    let myreqJSON = JSON.stringify(_reqJson.body);
    // console.log(_reqJson.body);
    if (_errorMsg > 1000)
    {
      //let text = "Hello world!";
      _errorMsg = _errorMsg.substring(0, 999);
    }
    if (myreqJSON > 5000)
    {
      myreqJSON = myreqJSON.substring(0, 4999);
    }
    var _query = `INSERT INTO api_error_log_detail(file_name,method_name,error_message,request_json)
    VALUES('${_fileName}','${_funName}',"${_errorMsg}",'${myreqJSON}')`;
    _dbhelper.InsertQueryErrorLog(_query);
    return _query;
  },

  uploadFileTemp: async (file, pathD) =>
  {
    try
    {
      if (file == undefined || file == null)
      {
        throw new Error('No file provided');
      }
      const extensionName = path.extname(file.name);
      const sampleFile = crypto.randomBytes(16).toString("hex") + extensionName;

      // Construct the upload path
      const uploadPath = path.join('./src/public', 'uploads', pathD, sampleFile);
      const fullUploadPath = path.join(process.cwd(), uploadPath);

      // Ensure the directory exists
      await fs.mkdir(path.dirname(fullUploadPath), { recursive: true });

      // Move the file
      await fs.writeFile(fullUploadPath, file.data);

      // Return the path relative to the project root
      return path.join('public', 'uploads', pathD, sampleFile);
    } 
    catch (err)
    {
      console.error("Error saving to local storage:", err);
      throw err;
    }
  },

  uploadFile: async (file, pathD)=> {
      try 
      {
        let sampleFile;
        let uploadPath;

        if (file == undefined || file == null)
        {
          return null;
        }
        const extensionName = path.extname(file.name);
        sampleFile = crypto.randomBytes(16).toString('hex') + extensionName;
        uploadPath = './public/upload/' + pathD + '/' + sampleFile;
        await file.mv(uploadPath);
        return "/upload/"+pathD+'/'+sampleFile;
      } 
      catch (err) 
      {
        console.log(err.message);
      }
  },

  sendEmail : async (mailOptions) => 
  {
    return new Promise((resolve, reject) => 
    {
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_HOST_USER,
          pass: process.env.EMAIL_HOST_PASSWORD,
        },
      });

      const options = {
        from: `"Sigmaplex Technologies" <${process.env.EMAIL_HOST_USER || 'sigmaplextech@gmail.com'}>`,
        to: mailOptions.to,
        subject: mailOptions.subject,
        html: mailOptions.html,
      };
      transporter.sendMail(options, (err, info) => {
        if (err) {
          console.error("❌ Email sending failed:", err.message);
          return reject(err);
        }
        console.log(`✅ Email sent successfully to ${mailOptions.to}`);
        resolve(info);
      });
    });
  },

  mailTemplate: (mailOptions) =>
  {
    const { name, email, message, subject, company } = mailOptions;
    return {
      to: email, // List of recipients
      subject: "New Client Inquiry - Portfolio Contact Form",
      html:`<html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Client Inquiry - Portfolio Contact Form</title>
      <style>
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }
      
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    line-height: 1.6;
                    background-color: #f1f5f9;
                    color: #334155;
                    padding: 20px;
                }
                
                .email-container {
                    max-width: 700px;
                    margin: 0 auto;
                    background: #ffffff;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                }
                
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    position: relative;
                    overflow: hidden;
                }
                
                .header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                    pointer-events: none;
                }
                
                .header-content {
                    position: relative;
                    z-index: 1;
                }
                
                .notification-badge {
                    display: inline-flex;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.2);
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 500;
                    margin-bottom: 15px;
                }
                
                .notification-badge::before {
                    content: "🔔";
                    margin-right: 8px;
                }
                
                .header h1 {
                    font-size: 28px;
                    font-weight: 700;
                    margin-bottom: 8px;
                }
                
                .header p {
                    font-size: 16px;
                    opacity: 0.9;
                }
                
                .timestamp {
                    background: rgba(255, 255, 255, 0.15);
                    padding: 6px 12px;
                    border-radius: 6px;
                    font-size: 13px;
                    margin-top: 10px;
                    display: inline-block;
                }
                
                .content {
                    padding: 0;
                }
                
                .priority-section {
                    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                    padding: 25px 30px;
                    border-left: 5px solid #f59e0b;
                }
                
                .priority-title {
                    display: flex;
                    align-items: center;
                    font-size: 18px;
                    font-weight: 600;
                    color: #92400e;
                    margin-bottom: 10px;
                }
                
                .priority-title::before {
                    content: "⚡";
                    margin-right: 10px;
                    font-size: 20px;
                }
                
                .priority-text {
                    color: #b45309;
                    font-size: 15px;
                }
                
                .client-info {
                    padding: 30px;
                }
                
                .section-title {
                    font-size: 20px;
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #e2e8f0;
                }
                
                .client-icon {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 15px;
                    color: white;
                    font-weight: bold;
                    font-size: 16px;
                }
                
                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 30px;
                }
                
                .info-card {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 20px;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                
                .info-card:hover {
                    border-color: #667eea;
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
                }
                
                .info-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 4px;
                    height: 100%;
                    background: linear-gradient(to bottom, #667eea, #764ba2);
                }
                
                .info-label {
                    font-size: 12px;
                    font-weight: 600;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 8px;
                }
                
                .info-value {
                    font-size: 16px;
                    font-weight: 500;
                    color: #1e293b;
                    word-break: break-word;
                }
                
                .project-details-section {
                    background: #f8fafc;
                    padding: 30px;
                    margin: 0;
                }
                
                .project-details-card {
                    background: white;
                    border-radius: 12px;
                    padding: 25px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
                }
                
                .project-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1e293b;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                }
                
                .project-title::before {
                    content: "📋";
                    margin-right: 10px;
                }
                
                .project-type {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 500;
                    margin-bottom: 20px;
                    display: inline-block;
                }
                
                .project-description {
                    background: #f1f5f9;
                    border-radius: 8px;
                    padding: 20px;
                    border-left: 4px solid #667eea;
                    white-space: pre-wrap;
                    font-size: 15px;
                    line-height: 1.7;
                    color: #475569;
                    min-height: 120px;
                }
                
                .action-buttons {
                    padding: 30px;
                    background: #f8fafc;
                    border-top: 1px solid #e2e8f0;
                    display: flex;
                    gap: 15px;
                    flex-wrap: wrap;
                }
                
                .btn {
                    padding: 12px 24px;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 14px;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .btn-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                }
                
                .btn-secondary {
                    background: white;
                    color: #667eea;
                    border: 2px solid #667eea;
                }
                
                .btn-secondary:hover {
                    background: #667eea;
                    color: white;
                }
                
                .footer {
                    background: #1e293b;
                    color: #94a3b8;
                    padding: 25px 30px;
                    text-align: center;
                }
                
                .footer p {
                    font-size: 14px;
                    margin-bottom: 5px;
                }
                
                .footer-highlight {
                    color: #667eea;
                    font-weight: 600;
                }
                
                /* Responsive Design */
                @media only screen and (max-width: 768px) {
                    .email-container {
                        margin: 10px;
                        border-radius: 12px;
                    }
                    
                    .info-grid {
                        grid-template-columns: 1fr;
                        gap: 15px;
                    }
                    
                    .header {
                        padding: 25px 20px;
                    }
                    
                    .client-info {
                        padding: 25px 20px;
                    }
                    
                    .project-details-section {
                        padding: 25px 20px;
                    }
                    
                    .action-buttons {
                        padding: 25px 20px;
                        flex-direction: column;
                    }
                    
                    .btn {
                        justify-content: center;
                    }
                }
                
                @media only screen and (max-width: 480px) {
                    body {
                        padding: 10px;
                    }
                    
                    .header h1 {
                        font-size: 24px;
                    }
                    
                    .section-title {
                        font-size: 18px;
                    }
                    
                    .client-icon {
                        width: 35px;
                        height: 35px;
                        font-size: 14px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <!-- Header -->
                <div class="header">
                    <div class="header-content">
                        <div class="notification-badge">New Portfolio Inquiry</div>
                        <h1>Client Contact Form Submission</h1>
                        <p>A potential client has reached out through your portfolio website</p>
                        <div class="timestamp">Received: ${new Date().toLocaleString()}</div>
                    </div>
                </div>
                
                <!-- Priority Alert -->
                <div class="priority-section">
                    <div class="priority-title">Action Required</div>
                    <div class="priority-text">New client inquiry awaiting your response. Consider reaching out within 24 hours for best results.</div>
                </div>
                
                <!-- Client Information -->
                <div class="client-info">
                    <div class="section-title">
                        Client Information
                    </div>
                    
                    <div class="info-grid">
                        <div class="info-card">
                            <div class="info-label">Full Name</div>
                            <div class="info-value">${name || 'Not Provided'}</div>
                        </div>
                        
                        <div class="info-card">
                            <div class="info-label">Email Address</div>
                            <div class="info-value">${email || 'Not Provided'}</div>
                        </div>
                        
                        <div class="info-card">
                            <div class="info-label">Company/Organization</div>
                            <div class="info-value">${company || 'Not Provided'}</div>
                        </div>
                        
                        <div class="info-card">
                            <div class="info-label">Inquiry Source</div>
                            <div class="info-value">Portfolio Contact Form</div>
                        </div>
                    </div>
                </div>
                
                <!-- Project Details -->
                <div class="project-details-section">
                    <div class="project-details-card">
                        <div class="project-title">Project Requirements</div>
                        
                        <div class="project-type">${subject || 'General Inquiry'}</div>
                        
                        <div class="project-description">${message || 'No additional details provided.'}</div>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="action-buttons">
                    <a href="mailto:${email}" class="btn btn-primary">
                        📧 Reply to Client
                    </a>
                </div>

                <!-- Footer -->
                <div class="footer">
                    <p>This inquiry was submitted through your <span class="footer-highlight">Portfolio Contact Form</span></p>
                    <p>Response time goal: <span class="footer-highlight">Within 24 hours</span></p>
                    <p>Portfolio Website: <span class="footer-highlight">yourportfolio.com</span></p>
                </div>
            </div>
        </body>
        </html>`
    }
  }
}
