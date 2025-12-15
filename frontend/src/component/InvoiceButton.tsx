import React from "react";

interface Item {
  name: string;
  quantity: number;
  price: number;
}

interface OrderData {
  customerName: string;
  orderId: string;
  total: number;
  items: Item[];
}

interface Props {
  id: number;
}

const InvoiceButton: React.FC<Props> = ({ id }) => {
  const handleDownloadInvoice = async () => {
    try {
      const res = await fetch(`http://localhost:3000/admin/api/orders/${id}`,
          {
            headers:{
              'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
            }
          });
      const data = await res.json();

      if (!data || !Array.isArray(data.orderItems)) {
        console.error("Data order invalid:", data);
        return;
      }

      const customerName =
        data.user?.fullName || data.guest_name || "Customer";

      const orderForPdf: OrderData = {
        customerName,
        orderId: "ORD-" + id,
        total: data.order_total || 0,
        items: data.orderItems.map((item: any) => ({
          name: item.productItem?.product?.name || "Unknown product",
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price),
        })),
      };

      const response = await fetch(
        "http://localhost:3000/api/invoice/generate-invoice",
        {
          method: "POST",
          headers: { "Content-Type": "application/json",

            'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify({ orderData: orderForPdf }),
        }
      );

      if (!response.ok) throw new Error("Could not create invoice");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      console.error("Error create bill:", error);
      
    }
  };

  return <button onClick={handleDownloadInvoice}>Print Bill</button>;
};

export default InvoiceButton;