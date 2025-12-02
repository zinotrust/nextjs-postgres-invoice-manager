import Link from "next/link";
import { getInvoices } from "@/actions/invoiceActions";
import InvoiceList from "@/components/invoice/InvoiceList";
import { Button } from "@/components/ui/button";

export default async function InvoicesPage() {
  const result = await getInvoices();
  const invoices = result.success ? result.data : [];


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-2 border-b border-gray-200 pb-2">
        <h4>{invoices.length} Invoices</h4>
        <Link href="/invoices/new" className="btn btn-primary">
        <Button>Create Invoice</Button>
        </Link>
      </div>
      <InvoiceList initialInvoices={invoices} />
    </div>
  );
}
