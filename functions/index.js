// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

// Initialize Firebase Admin
admin.initializeApp();

// Create email transporter using environment variables
const createTransporter = () => {
  // Get the configuration from Firebase environment variables
  const emailConfig = functions.config().email;

  // Verify required config exists
  if (!emailConfig || !emailConfig.user || !emailConfig.password) {
    console.error(
        "Email configuration missing. " +
        "Please set email.user and email.password",
    );
    throw new Error("Email configuration missing");
  }

  return nodemailer.createTransporter({
    service: "gmail",
    auth: {
      user: emailConfig.user,
      pass: emailConfig.password,
    },
  });
};

// Cloud function that triggers when a new registration is added
exports.sendRegistrationEmail = functions.database
    .ref("/registrations/{pushId}")
    .onCreate(async (snapshot, context) => {
      const registration = snapshot.val();

      // Only send email for swimmer registrations with completed waivers
      if (registration.type !== "swimmer" || !registration.waiver_agreed) {
        console.log(
            "Skipping email: Not a swimmer registration with completed waiver",
        );
        return null;
      }

      try {
        // Get email configuration
        const emailConfig = functions.config().email;

        // Create the transporter
        const transporter = createTransporter();

        // Create email content
        const mailOptions = {
          from: `Swim Across Columbia <${emailConfig.user}>`,
          to: emailConfig.recipient,
          subject: "New Swimmer Registration",
          html: `
          <h2>New Swimmer Registration</h2>
          <table style="border-collapse: collapse; width: 100%;">
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">
                <strong>Name:</strong>
              </td>
              <td style="border: 1px solid #ddd; padding: 8px;">
                ${registration.name}
              </td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">
                <strong>Email:</strong>
              </td>
              <td style="border: 1px solid #ddd; padding: 8px;">
                ${registration.email}
              </td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">
                <strong>Phone:</strong>
              </td>
              <td style="border: 1px solid #ddd; padding: 8px;">
                ${registration.phone}
              </td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">
                <strong>Registration Date:</strong>
              </td>
              <td style="border: 1px solid #ddd; padding: 8px;">
                ${new Date(registration.timestamp).toLocaleString()}
              </td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">
                <strong>Waiver Signed:</strong>
              </td>
              <td style="border: 1px solid #ddd; padding: 8px;">
                Yes
              </td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">
                <strong>Waiver Initials:</strong>
              </td>
              <td style="border: 1px solid #ddd; padding: 8px;">
                ${registration.waiver_initials}
              </td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">
                <strong>Random Escort Needed:</strong>
              </td>
              <td style="border: 1px solid #ddd; padding: 8px;">
                ${registration.random_escort === "yes" ? "Yes" : "No"}
              </td>
            </tr>
            ${registration.escort_name ? `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">
                <strong>Escort Name:</strong>
              </td>
              <td style="border: 1px solid #ddd; padding: 8px;">
                ${registration.escort_name}
              </td>
            </tr>
            ` : ""}
          </table>
          <br>
          <p>Please log in to the 
            <a href="https://console.firebase.google.com">Firebase Console</a>
            to view all registration details.
          </p>
        `,
          text: `
          New Swimmer Registration
          
          Name: ${registration.name}
          Email: ${registration.email}
          Phone: ${registration.phone}
          Registration Date: ${
  new Date(registration.timestamp).toLocaleString()
}
          Waiver Signed: Yes
          Waiver Initials: ${registration.waiver_initials}
          Random Escort Needed: ${
  registration.random_escort === "yes" ? "Yes" : "No"
}
          ${registration.escort_name ?
    `Escort Name: ${registration.escort_name}` : ""}
        `,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log(
            "Email notification sent successfully for new swimmer registration",
        );

        return null;
      } catch (error) {
        console.error("Error sending email:", error);
        // Don't throw the error to prevent the cloud function from retrying
        return null;
      }
    });
