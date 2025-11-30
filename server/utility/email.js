import Brevo from '@getbrevo/brevo';

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const apiInstance = new Brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.sender = {
      email: process.env.BREVO_SENDER_EMAIL,
      name: process.env.BREVO_SENDER_NAME
    };
    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("📨 Email sent:", response);
    return true;

  } catch (err) {
    console.error("❌ Brevo Email Error:", err);
    return false;
  }
};
