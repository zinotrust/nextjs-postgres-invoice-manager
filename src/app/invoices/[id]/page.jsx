// src/app/invoices/[id]/page.jsx
import { notFound } from 'next/navigation'
import { getInvoice } from '@/actions/invoiceActions'
import InvoiceDetail from '@/components/invoice/InvoiceDetail'

export default async function InvoiceDetailPage({ params }) {
  const { id } = await params
  const result = await getInvoice(id)

  if (!result.success) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <InvoiceDetail invoice={result.data} />
    </div>
  )
}
