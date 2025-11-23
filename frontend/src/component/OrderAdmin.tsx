import React, { useEffect, useState } from 'react';
import '../style/OrderAdmin.css';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../component/ConfirmDialog';
import Notification from '../component/Notification';
import InvoiceButton from "./InvoiceButton";

type Order = {
  id: number;
  user: {
    id: number;
    fullName?: string;
    username?: string;
    phone?: string;
    email?: string;
  } | null;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  order_total: number;
  orderStatus: {
    id: number;
    status: string;
  } | null;
  orderDate: string;
};

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
  

  const navigate = useNavigate();
  const limit = 10;
  const totalPages = Math.ceil(totalCount / limit);

  // State cho Notification (toast)
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // State cho ConfirmDialog (modal xác nhận)


  const loadOrders = () => {
    const query = `http://localhost:3001/admin/api/orders?page=${page}&limit=${limit}&search=${encodeURIComponent(searchTerm)}`;
    fetch(query,{
            headers:{
              'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
            }
          })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setOrders(data.data);
          setTotalCount(data.totalCount || 0);
        } else {
          console.warn(" Dữ liệu trả về không đúng định dạng:", data);
          setOrders([]);
        }
      })
      .catch((err) => {
        console.error(' Lỗi khi tải đơn hàng:', err);
        setOrders([]);
      });
  };

  useEffect(() => {
    loadOrders();
  }, [page]);

  const handleDelete = (id: number) => {
    if (window.confirm('Xác nhận xoá đơn hàng này?')) {
      fetch(`http://localhost:3001/admin/api/orders/${id}`, { method: 'DELETE' })
        .then((res) => {
          if (res.ok) loadOrders();
        })
        .catch((err) => console.error(' Lỗi khi xoá đơn hàng:', err));
            setOrderToDelete(id);
            setShowConfirm(true);
    }
  };

  const handleConfirmDelete = () => {
    if (orderToDelete === null) {
      setShowConfirm(false);
      return;
    }

    fetch(`http://localhost:3001/api/orders/${orderToDelete}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (sessionStorage.getItem('token') || '')
      },
    })
      .then(res => {
        if (res.ok) {
          setOrders(prev => prev.filter(o => o.id !== orderToDelete));
          setNotification({ message: 'Order deleted successfully!', type: 'success' });
        } else {
          setNotification({ message: `Delete failed: ${res.statusText}`, type: 'error' });
        }
      })
      .catch(err => {
        console.error('Error deleting order:', err);
        setNotification({ message: `Error deleting: ${err.message}`, type: 'error' });
      })
      .finally(() => {
        setShowConfirm(false);
        setOrderToDelete(null);
      });
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setOrderToDelete(null);
  };

  const goToDetail = (id: number) => {
    navigate(`/admin/orders/${id}`);
  };

  const updateOrderStatus = (orderId: number, newStatus: string) => {
    fetch(`http://localhost:3001/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (sessionStorage.getItem('token') || '')
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(async res => {
        if (!res.ok) {
          let msg = `Server responded with ${res.status}`;
          try {
            const errJson = await res.json();
            if (errJson?.message) msg += `: ${errJson.message}`;
          } catch {}
          throw new Error(msg);
        }
        return res.json();
      })
      .then((resp) => {
        const updated = resp.order;
        if (!updated || !updated.orderStatus) {
          setNotification({ message: 'Unexpected server response.', type: 'error' });
          return;
        }
        setOrders(prev =>
          prev.map(o =>
            o.id === orderId
              ? { ...o, orderStatus: updated.orderStatus }
              : o
          )
        );
        setNotification({ message: 'Status updated successfully!', type: 'success' });
      })
      .catch(err => {
        setNotification({ message: `Cannot update status: ${err.message}`, type: 'error' });
      });
  };

  return (
    <div className="order-container">
      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* ConfirmDialog */}
      <ConfirmDialog
        visible={showConfirm}
        message="Are you sure you want to delete this order?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Tìm kiếm */}
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Tìm theo tên, email hoặc ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button" onClick={() => { setPage(1); loadOrders(); }}>
          Tìm
        </button>
      </div>

      {/* Bảng đơn hàng */}
      <table className="order-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Customer</th>
            <th>Total</th>
            {/*<th>Trạng thái</th>*/}
            <th>Order Status</th>
            <th>Order Date</th>

            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <tr key={order.id}>
                <td>{(page - 1) * limit + index + 1}</td>
                <td>
                  {order.user?.fullName || order.guest_name || 'Khách vãng lai'}
                  {order.guest_email && (
                    <>
                      <br /><small>{order.guest_email}</small>
                    </>
                  )}
                </td>
                <td>{(order.order_total ?? 0).toLocaleString()}₫</td>

                {/*<td>{order.orderStatus?.status || 'Đang xử lý'}</td>*/}

                {/*<td>{order.orderDate ? new Date(order.orderDate).toLocaleString('vi-VN') : ''}</td>*/}

                <td>
                  <select
                      value={order.orderStatus?.status ?? ''}
                      onChange={e => updateOrderStatus(order.id, e.target.value)}
                  >
                    <option value="Preparing">Preparing</option>
                    <option value="Shipping">Shipping</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td>{new Date(order.orderDate).toLocaleString('vi-VN')}</td>
                <td>
                  <button
                      className="order-button btn-detail"
                      onClick={() => goToDetail(order.id)}
                  >
                    Detail
                  </button>
                  <button
                      className="order-button btn-delete"
                      onClick={() => handleDelete(order.id)}
                  >
                    Delete
                  </button>
                  <InvoiceButton id={order.id} />
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={6}>Không có đơn hàng nào.</td></tr>
          )}
        </tbody>
      </table>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
            <button key={pageNumber}
              style={{
                margin: 4, padding: '8px 12px',
                backgroundColor: pageNumber === page ? '#333' : '#eee',
                color: pageNumber === page ? '#fff' : '#000',
                border: 'none', borderRadius: 4, cursor: 'pointer',
              }}
              onClick={() => setPage(pageNumber)}>{pageNumber}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderManagement;