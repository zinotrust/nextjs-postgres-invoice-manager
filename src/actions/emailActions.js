"use server";
import { MailApiDev } from "mailapidev";

const mailapi = new MailApiDev(process.env.MAILAPI_KEY);

// send email
export const sendEmail = async (emailData) => {
  try {
    const { data, error } = await mailapi.emails.send(emailData);

    if (error) {
      console.error("MailAPI error:", error);
      return { success: false, error: error.message, code: error.code };
    }

    console.log("MailAPI success:", data);
    return { success: true, data: data };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to send email",
    };
  }
};

// verify email
export async function verifyEmail(email) {
  try {
    const { data, error } = await mailapi.emails.verify({
      email: email,
    });

    if (error) {
      console.error("Error Code:", error.code);
      return { success: false, error: error.message, code: error.code };
    }

    console.log("Validators:", data);
    if (data) {
      return { success: true, data: data };
    }
  } catch {
    return {
      success: false,
      error: error.message || "Failed to send email",
    };
  }
}

// add email
export async function addEmailToMailAPI(emailData) {
  try {
    const { data, error } = await mailapi.emails.add(emailData);

    if (error) {
      console.error("Error Code:", error.code);
      return { success: false, error: error.message, code: error.code };
    }

    if (data) {
      return { success: true, data: data };
    }
  } catch {
    return {
      success: false,
      error: error.message || "Failed to send email",
    };
  }
}

// update email
export async function updateMailAPIEmail(emailData) {
  try {
    const { data, error } = await mailapi.emails.update(emailData);

    if (error) {
      console.error("Error Code:", error.code);
      return { success: false, error: error.message, code: error.code };
    }

    if (data) {
      return { success: true, data: data };
    }
  } catch {
    return {
      success: false,
      error: error.message || "Failed to send email",
    };
  }
}
