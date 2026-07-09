import { format } from "date-fns";

export function generateFafCsv(invoices: any[], expenses: any[], organization: any) {
  // UAE FTA Audit File (FAF) standard format
  const rows = [];
  
  // Header Info
  rows.push(["Company Name", organization.name]);
  rows.push(["TRN", organization.trn || ""]);
  rows.push(["Creation Date", format(new Date(), "yyyy-MM-dd HH:mm:ss")]);
  rows.push([]);

  // Sales Data (Output VAT)
  rows.push(["--- Supply Data ---"]);
  rows.push(["InvoiceNo", "InvoiceDate", "CustomerName", "CustomerTRN", "LineDescription", "Amount", "VATAmount", "Total"]);
  
  invoices.forEach(inv => {
    inv.lineItems.forEach((line: any) => {
      rows.push([
        inv.number,
        format(new Date(inv.issueDate), "yyyy-MM-dd"),
        inv.customer.name,
        inv.customer.trn || "N/A",
        line.description,
        line.total.toFixed(2),
        line.vatAmount.toFixed(2),
        (line.total + line.vatAmount).toFixed(2)
      ]);
    });
  });

  rows.push([]);
  
  // Purchase Data (Input VAT)
  rows.push(["--- Purchase Data ---"]);
  rows.push(["SupplierName", "SupplierTRN", "Date", "Description", "Amount", "VATAmount", "Total"]);
  
  expenses.forEach(exp => {
    rows.push([
      exp.vendor?.name || "Unknown",
      exp.vendor?.trn || "N/A",
      format(new Date(exp.date), "yyyy-MM-dd"),
      exp.notes || exp.category,
      exp.amount.toFixed(2),
      exp.vatAmount.toFixed(2),
      (exp.amount + exp.vatAmount).toFixed(2)
    ]);
  });

  return rows.map(r => r.join(",")).join("\n");
}
