import {
  customers,
  transactions,
} from "../data/mockData";

function Reports() {
  const downloadCustomers = () => {
    const headers = [
      "Customer ID",
      "Name",
      "Segment",
      "Total Spending",
      "Purchases",
      "Patron Index",
      "Status",
    ];

    const rows = customers.map(
      (customer) => [
        customer.id,
        customer.name,
        customer.segment,
        customer.totalSpending,
        customer.totalPurchases,
        customer.patronIndex,
        customer.status,
      ],
    );

    downloadCSV(
      "patron-index-customers.csv",
      headers,
      rows,
    );
  };

  const downloadTransactions = () => {
    const headers = [
      "Transaction ID",
      "Customer",
      "Product",
      "Amount",
      "Date",
      "Payment",
    ];

    const rows = transactions.map(
      (transaction) => [
        transaction.id,
        transaction.customerName,
        transaction.product,
        transaction.amount,
        transaction.date,
        transaction.paymentMethod,
      ],
    );

    downloadCSV(
      "patron-index-transactions.csv",
      headers,
      rows,
    );
  };

  const downloadCSV = (
    filename,
    headers,
    rows,
  ) => {
    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map(
            (value) =>
              `"${String(value).replaceAll(
                '"',
                '""',
              )}"`,
          )
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = filename;

    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Reports</h2>
          <p>
            Export useful business and customer
            reports.
          </p>
        </div>
      </div>

      <div className="reports-grid">
        <section className="card report-card">
          <div className="report-icon">
            ◉
          </div>

          <h3>Customer Report</h3>

          <p>
            Export customer segments, spending,
            Patron Index scores and status.
          </p>

          <button
            className="primary-button"
            onClick={downloadCustomers}
          >
            Download CSV
          </button>
        </section>

        <section className="card report-card">
          <div className="report-icon">
            ↔
          </div>

          <h3>Transaction Report</h3>

          <p>
            Export recent customer purchase and
            transaction data.
          </p>

          <button
            className="primary-button"
            onClick={downloadTransactions}
          >
            Download CSV
          </button>
        </section>
      </div>
    </div>
  );
}

export default Reports;