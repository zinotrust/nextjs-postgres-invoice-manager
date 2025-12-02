"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { addEmailToMailAPI, sendEmail, updateMailAPIEmail, verifyEmail } from "./emailActions";

export async function createInvoice(formData) {
  const { purpose, amount, customerEmail, invoiceLink, status, dueDate } =
    formData;
  try {
    // const verify = await verifyEmail(formData.customerEmail);
    // if (verify.error) {
    //   return { success: false, error: verify.error };
    // }
    // if (!verify?.data?.valid) {
    //   return { success: false, error: verify.data.message };
    // }

    const invoice = await prisma.invoice.create({
      data: {
        purpose: purpose,
        amount: parseFloat(amount),
        customerEmail: customerEmail,
        invoiceLink: invoiceLink || null,
        status: status || "PENDING",
        dueDate: new Date(dueDate),
      },
    });

    // send Email
    await sendEmail({
      from: "InvoiceMgr <noreply@mail.mailapi.dev>",
      to: customerEmail,
      subject: `InvoiceMgr - ${purpose}`,
      template_id: "invoice",
      template_data: {
        purpose: purpose,
        amount: amount,
        invoiceLink: invoiceLink,
        dueDate: dueDate,
        status: status,
      },
    });

    // add email to mailapi
    await addEmailToMailAPI({
      email: customerEmail,
      customFields: {
        purpose,
        amount,
        invoiceLink,
        dueDate,
        status,
      },
    });

    revalidatePath("/invoices");
    return { success: true, data: invoice };
  } catch (error) {
    console.log("create invoice error", error);
    return { success: false, error: error.message };
  }
}

export async function getInvoices(status = null) {
  try {
    const where = status ? { status } : {};
    const invoices = await prisma.invoice.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: invoices };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getInvoice(id) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: id },
    });
    if (!invoice) {
      return { success: false, error: "Invoice not found" };
    }
    return { success: true, data: invoice };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateInvoice(id, formData) {
  try {
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        purpose: formData.purpose,
        amount: parseFloat(formData.amount),
        customerEmail: formData.customerEmail,
        invoiceLink: formData.invoiceLink || null,
        status: formData.status,
        dueDate: new Date(formData.dueDate),
      },
    });
    revalidatePath("/invoices");
    revalidatePath(`/invoices/${id}`);
    return { success: true, data: invoice };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteInvoice(id) {
  try {
    await prisma.invoice.delete({
      where: { id },
    });
    revalidatePath("/invoices");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function markAsPaid(id) {
  try {
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
    });

    // update email
    await updateMailAPIEmail({
      email: invoice.customerEmail,
      customFields: {
        status: "PAID",
      },
    })

    revalidatePath("/invoices");
    revalidatePath(`/invoices/${id}`);
    return { success: true, data: invoice };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function markAsPending(id) {
  try {
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        status: "PENDING",
        paidAt: null,
      },
    });

    // update email
    await updateMailAPIEmail({
      email: invoice.customerEmail,
      customFields: {
        status: "PENDING",
      },
    })
    revalidatePath("/invoices");
    revalidatePath(`/invoices/${id}`);
    return { success: true, data: invoice };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
