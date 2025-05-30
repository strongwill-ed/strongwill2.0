import { MailService } from '@sendgrid/mail';
import { storage } from './storage';

const mailService = new MailService();

// Initialize SendGrid if API key is available
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface EmailData {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
}

export class EmailService {
  private fromEmail = 'noreply@strongwillsports.com';

  async sendEmail(emailData: EmailData): Promise<boolean> {
    if (!process.env.SENDGRID_API_KEY) {
      console.log('SendGrid API key not configured. Email would be sent:', emailData.subject);
      return true; // Return success for development
    }

    try {
      await mailService.send(emailData);
      return true;
    } catch (error) {
      console.error('SendGrid email error:', error);
      return false;
    }
  }

  async getEmailTemplate(type: string): Promise<EmailTemplate | null> {
    const setting = await storage.getAdminSetting(`email_template_${type}`);
    if (!setting) return null;
    
    try {
      return JSON.parse(setting.value);
    } catch {
      return null;
    }
  }

  async saveEmailTemplate(type: string, template: EmailTemplate): Promise<void> {
    await storage.updateAdminSetting(`email_template_${type}`, JSON.stringify(template));
  }

  // Order confirmation email
  async sendOrderConfirmation(orderData: {
    customerEmail: string;
    customerName: string;
    orderId: number;
    totalAmount: string;
    items: Array<{ name: string; quantity: number; price: string }>;
  }): Promise<boolean> {
    const template = await this.getEmailTemplate('order_confirmation') || {
      subject: 'Order Confirmation - Strongwill Sports',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #000;">Order Confirmation</h1>
          <p>Dear {{customerName}},</p>
          <p>Thank you for your order! Your order #{{orderId}} has been confirmed.</p>
          <h3>Order Details:</h3>
          <div style="background: #f5f5f5; padding: 15px; margin: 10px 0;">
            {{itemsList}}
          </div>
          <p><strong>Total: ${{totalAmount}}</strong></p>
          <p>We'll send you tracking information once your order ships.</p>
          <p>Best regards,<br>Strongwill Sports Team</p>
        </div>
      `,
      text: `Order Confirmation - Dear {{customerName}}, Thank you for your order! Your order #{{orderId}} has been confirmed. Total: ${{totalAmount}}. We'll send tracking information once your order ships. Best regards, Strongwill Sports Team`
    };

    const itemsList = orderData.items.map(item => 
      `<div>${item.name} (Qty: ${item.quantity}) - $${item.price}</div>`
    ).join('');

    const html = template.html
      .replace(/{{customerName}}/g, orderData.customerName)
      .replace(/{{orderId}}/g, orderData.orderId.toString())
      .replace(/{{totalAmount}}/g, orderData.totalAmount)
      .replace(/{{itemsList}}/g, itemsList);

    const text = template.text
      .replace(/{{customerName}}/g, orderData.customerName)
      .replace(/{{orderId}}/g, orderData.orderId.toString())
      .replace(/{{totalAmount}}/g, orderData.totalAmount);

    return this.sendEmail({
      to: orderData.customerEmail,
      from: this.fromEmail,
      subject: template.subject,
      html,
      text
    });
  }

  // Newsletter subscription confirmation
  async sendNewsletterConfirmation(email: string): Promise<boolean> {
    const template = await this.getEmailTemplate('newsletter_confirmation') || {
      subject: 'Welcome to Strongwill Sports Newsletter!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #000;">Welcome to Strongwill Sports!</h1>
          <p>Thank you for subscribing to our newsletter!</p>
          <p>You'll receive updates about:</p>
          <ul>
            <li>New product launches</li>
            <li>Exclusive discounts and offers</li>
            <li>Sports team features</li>
            <li>Design tool updates</li>
          </ul>
          <p>As a welcome gift, enjoy <strong>free shipping on your first order</strong> with code: WELCOME2024</p>
          <p>Best regards,<br>Strongwill Sports Team</p>
        </div>
      `,
      text: `Welcome to Strongwill Sports! Thank you for subscribing to our newsletter. You'll receive updates about new products, exclusive offers, and more. Welcome gift: free shipping on your first order with code WELCOME2024. Best regards, Strongwill Sports Team`
    };

    return this.sendEmail({
      to: email,
      from: this.fromEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }

  // Group order creation notification
  async sendGroupOrderCreated(data: {
    organizer: { email: string; name: string };
    groupOrder: { id: number; name: string; deadline: string; minQuantity: number };
  }): Promise<boolean> {
    const template = await this.getEmailTemplate('group_order_created') || {
      subject: 'Group Order Created - Strongwill Sports',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #000;">Group Order Created Successfully!</h1>
          <p>Dear {{organizerName}},</p>
          <p>Your group order "{{groupOrderName}}" has been created successfully!</p>
          <h3>Group Order Details:</h3>
          <div style="background: #f5f5f5; padding: 15px; margin: 10px 0;">
            <p><strong>Order ID:</strong> #{{groupOrderId}}</p>
            <p><strong>Minimum Quantity:</strong> {{minQuantity}} items</p>
            <p><strong>Deadline:</strong> {{deadline}}</p>
          </div>
          <p>Share your group order link with team members so they can join and place their orders.</p>
          <p>Best regards,<br>Strongwill Sports Team</p>
        </div>
      `,
      text: `Group Order Created - Dear {{organizerName}}, Your group order "{{groupOrderName}}" has been created successfully! Order ID: #{{groupOrderId}}, Minimum Quantity: {{minQuantity}}, Deadline: {{deadline}}. Share your group order link with team members. Best regards, Strongwill Sports Team`
    };

    const html = template.html
      .replace(/{{organizerName}}/g, data.organizer.name)
      .replace(/{{groupOrderName}}/g, data.groupOrder.name)
      .replace(/{{groupOrderId}}/g, data.groupOrder.id.toString())
      .replace(/{{minQuantity}}/g, data.groupOrder.minQuantity.toString())
      .replace(/{{deadline}}/g, data.groupOrder.deadline);

    const text = template.text
      .replace(/{{organizerName}}/g, data.organizer.name)
      .replace(/{{groupOrderName}}/g, data.groupOrder.name)
      .replace(/{{groupOrderId}}/g, data.groupOrder.id.toString())
      .replace(/{{minQuantity}}/g, data.groupOrder.minQuantity.toString())
      .replace(/{{deadline}}/g, data.groupOrder.deadline);

    return this.sendEmail({
      to: data.organizer.email,
      from: this.fromEmail,
      subject: template.subject,
      html,
      text
    });
  }

  // Group order invitation
  async sendGroupOrderInvitation(data: {
    inviteeEmail: string;
    organizer: { name: string };
    groupOrder: { id: number; name: string; deadline: string };
    inviteLink: string;
  }): Promise<boolean> {
    const template = await this.getEmailTemplate('group_order_invitation') || {
      subject: 'You\'re Invited to Join a Group Order!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #000;">You're Invited!</h1>
          <p>{{organizerName}} has invited you to join their group order for custom sports apparel.</p>
          <h3>Group Order: {{groupOrderName}}</h3>
          <div style="background: #f5f5f5; padding: 15px; margin: 10px 0;">
            <p><strong>Order ID:</strong> #{{groupOrderId}}</p>
            <p><strong>Deadline:</strong> {{deadline}}</p>
          </div>
          <div style="text-align: center; margin: 20px 0;">
            <a href="{{inviteLink}}" style="background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Join Group Order</a>
          </div>
          <p>Don't miss out on this opportunity to get custom team apparel!</p>
          <p>Best regards,<br>Strongwill Sports Team</p>
        </div>
      `,
      text: `You're invited to join a group order! {{organizerName}} has invited you to join their group order "{{groupOrderName}}" (ID: #{{groupOrderId}}). Deadline: {{deadline}}. Join here: {{inviteLink}}. Best regards, Strongwill Sports Team`
    };

    const html = template.html
      .replace(/{{organizerName}}/g, data.organizer.name)
      .replace(/{{groupOrderName}}/g, data.groupOrder.name)
      .replace(/{{groupOrderId}}/g, data.groupOrder.id.toString())
      .replace(/{{deadline}}/g, data.groupOrder.deadline)
      .replace(/{{inviteLink}}/g, data.inviteLink);

    const text = template.text
      .replace(/{{organizerName}}/g, data.organizer.name)
      .replace(/{{groupOrderName}}/g, data.groupOrder.name)
      .replace(/{{groupOrderId}}/g, data.groupOrder.id.toString())
      .replace(/{{deadline}}/g, data.groupOrder.deadline)
      .replace(/{{inviteLink}}/g, data.inviteLink);

    return this.sendEmail({
      to: data.inviteeEmail,
      from: this.fromEmail,
      subject: template.subject,
      html,
      text
    });
  }

  // Sponsorship inquiry notification
  async sendSponsorshipInquiry(data: {
    sponsorEmail: string;
    sponsorName: string;
    seeker: { name: string; sport: string; location: string };
    message: string;
  }): Promise<boolean> {
    const template = await this.getEmailTemplate('sponsorship_inquiry') || {
      subject: 'New Sponsorship Inquiry - Strongwill Sports',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #000;">New Sponsorship Inquiry</h1>
          <p>Dear {{sponsorName}},</p>
          <p>You have received a new sponsorship inquiry through Strongwill Sports!</p>
          <h3>Seeker Details:</h3>
          <div style="background: #f5f5f5; padding: 15px; margin: 10px 0;">
            <p><strong>Team/Individual:</strong> {{seekerName}}</p>
            <p><strong>Sport:</strong> {{sport}}</p>
            <p><strong>Location:</strong> {{location}}</p>
          </div>
          <h3>Message:</h3>
          <div style="background: #f9f9f9; padding: 15px; margin: 10px 0; border-left: 4px solid #000;">
            {{message}}
          </div>
          <p>Log in to your Strongwill Sports account to respond to this inquiry.</p>
          <p>Best regards,<br>Strongwill Sports Team</p>
        </div>
      `,
      text: `New Sponsorship Inquiry - Dear {{sponsorName}}, You have received a new sponsorship inquiry. Seeker: {{seekerName}}, Sport: {{sport}}, Location: {{location}}. Message: {{message}}. Log in to respond. Best regards, Strongwill Sports Team`
    };

    const html = template.html
      .replace(/{{sponsorName}}/g, data.sponsorName)
      .replace(/{{seekerName}}/g, data.seeker.name)
      .replace(/{{sport}}/g, data.seeker.sport)
      .replace(/{{location}}/g, data.seeker.location)
      .replace(/{{message}}/g, data.message);

    const text = template.text
      .replace(/{{sponsorName}}/g, data.sponsorName)
      .replace(/{{seekerName}}/g, data.seeker.name)
      .replace(/{{sport}}/g, data.seeker.sport)
      .replace(/{{location}}/g, data.seeker.location)
      .replace(/{{message}}/g, data.message);

    return this.sendEmail({
      to: data.sponsorEmail,
      from: this.fromEmail,
      subject: template.subject,
      html,
      text
    });
  }

  // Sponsorship agreement notification
  async sendSponsorshipAgreement(data: {
    seekerEmail: string;
    seekerName: string;
    sponsor: { name: string };
    agreement: { amount: string; terms: string };
  }): Promise<boolean> {
    const template = await this.getEmailTemplate('sponsorship_agreement') || {
      subject: 'Sponsorship Agreement Received!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #000;">Congratulations! Sponsorship Agreement Received</h1>
          <p>Dear {{seekerName}},</p>
          <p>Great news! {{sponsorName}} has agreed to sponsor you through Strongwill Sports!</p>
          <h3>Agreement Details:</h3>
          <div style="background: #f5f5f5; padding: 15px; margin: 10px 0;">
            <p><strong>Sponsor:</strong> {{sponsorName}}</p>
            <p><strong>Sponsorship Amount:</strong> ${{amount}}</p>
          </div>
          <h3>Terms:</h3>
          <div style="background: #f9f9f9; padding: 15px; margin: 10px 0; border-left: 4px solid #000;">
            {{terms}}
          </div>
          <p>Log in to your account to review and accept the sponsorship agreement.</p>
          <p>Best regards,<br>Strongwill Sports Team</p>
        </div>
      `,
      text: `Congratulations! Sponsorship Agreement Received - Dear {{seekerName}}, {{sponsorName}} has agreed to sponsor you! Amount: ${{amount}}. Terms: {{terms}}. Log in to review and accept. Best regards, Strongwill Sports Team`
    };

    const html = template.html
      .replace(/{{seekerName}}/g, data.seekerName)
      .replace(/{{sponsorName}}/g, data.sponsor.name)
      .replace(/{{amount}}/g, data.agreement.amount)
      .replace(/{{terms}}/g, data.agreement.terms);

    const text = template.text
      .replace(/{{seekerName}}/g, data.seekerName)
      .replace(/{{sponsorName}}/g, data.sponsor.name)
      .replace(/{{amount}}/g, data.agreement.amount)
      .replace(/{{terms}}/g, data.agreement.terms);

    return this.sendEmail({
      to: data.seekerEmail,
      from: this.fromEmail,
      subject: template.subject,
      html,
      text
    });
  }

  async sendDesignShare(data: {
    to: string;
    designId: string;
    designLink: string;
  }): Promise<boolean> {
    const template = await this.getEmailTemplate('design_share') || {
      subject: 'Custom Design Shared With You',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #000;">Custom Design Shared</h1>
          <p>Hello!</p>
          <p>Someone has shared a custom apparel design with you from Strongwill Sports.</p>
          <div style="background: #f5f5f5; padding: 15px; margin: 10px 0;">
            <p><strong>Design ID:</strong> {{designId}}</p>
            <p><strong>View Design:</strong> <a href="{{designLink}}" style="color: #000; text-decoration: underline;">Click here to view the design</a></p>
          </div>
          <p>You can view, modify, and order this custom design using the link above.</p>
          <p>Best regards,<br>Strongwill Sports Team</p>
        </div>
      `,
      text: `Custom Design Shared - Hello! Someone has shared a custom apparel design with you from Strongwill Sports. Design ID: {{designId}}. View Design: {{designLink}}. You can view, modify, and order this custom design using the link above. Best regards, Strongwill Sports Team`
    };

    const html = template.html
      .replace(/{{designId}}/g, data.designId)
      .replace(/{{designLink}}/g, data.designLink);

    const text = template.text
      .replace(/{{designId}}/g, data.designId)
      .replace(/{{designLink}}/g, data.designLink);

    return this.sendEmail({
      to: data.to,
      from: this.fromEmail,
      subject: template.subject,
      html,
      text
    });
  }
}

export const emailService = new EmailService();