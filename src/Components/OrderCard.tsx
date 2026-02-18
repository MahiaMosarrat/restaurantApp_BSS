
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteOrder, fetchOrders, updateOrderStatus } from '../features/orders/ordersSlice';
import { SyncOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Dropdown, Modal, message } from 'antd';
import EditOrderModal from './EditOrderModal';
import './OrderCard.css'

const OrderCard = ({ order }: { order: any }) => {
    const dispatch = useDispatch();
    const [editModalOpen, setEditModalOpen] = useState(false);
    const FOOD_IMAGE_URL = 'https://bssrms.runasp.net/images/food/';

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await dispatch(deleteOrder(order.id) as any).unwrap();
            message.success("Order deleted successfully");
            setIsDeleteModalOpen(false);
        } catch (error) {
            message.error("Failed to delete order");
        } finally {
            setIsDeleting(false);
        }
    };

    const getStatusStyle = (status: string): React.CSSProperties => {
        switch (status) {
            case 'Paid': return { color: '#28a745', fontWeight: 'bold' };
            case 'Pending': return { color: '#fd7e14', fontWeight: 'bold' };
            case 'PreparedToServe':
            case 'P.T.S': return { color: '#17a2b8', fontWeight: 'bold' };
            default: return { color: '#6c757d', fontWeight: 'bold' };
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        try {
            await dispatch(updateOrderStatus({ id: order.id, status: newStatus }) as any).unwrap();
            message.success(`Status updated to ${newStatus}`);

            dispatch(fetchOrders({ page: 1, perPage: 10 }) as any);
        } catch (err) {
            message.error("Status update failed");
        }
    };

    const statusMenuProps = {
        items: [
            { key: 'Pending', label: 'Pending' },
            { key: 'Confirmed', label: 'Confirmed' },
            { key: 'Preparing', label: 'Preparing' },
            { key: 'PreparedToServe', label: 'Prepared To Serve' },
            { key: 'Served', label: 'Served' },
            { key: 'Paid', label: 'Paid' },
            { label: 'Cancelled', key: 'Cancelled' },
        ],
        onClick: ({ key }: { key: string }) => handleStatusChange(key),
    };

    return (
        <div className="order-card-container bg-white shadow-sm border-0">
            <div className="d-flex justify-content-between align-items-center px-3 py-3">
                <div style={{ minWidth: 0 }}> {/* minWidth: 0 is crucial for text-overflow to work in flex */}
                    <div className="text-xl" title={order.orderNumber}>{order.orderNumber}</div>
                    <div className="text-muted small">
                        {new Date(order.orderTime).toLocaleString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric',
                            hour: '2-digit', minute: '2-digit', hour12: true
                        })}
                    </div>
                </div>

                {/* Action Buttons at the right end */}
                <div className="d-flex gap-2">
                    <Dropdown menu={statusMenuProps} trigger={['hover']}>
                        <Button size="large" type="text" className="action-btn" icon={<SyncOutlined />} />
                    </Dropdown>
                    <Button size="large" type="text" className="action-btn" icon={<EditOutlined />} onClick={() => setEditModalOpen(true)} />
                    <Button
                        size="large" type="text" danger
                        className="action-btn"
                        icon={<DeleteOutlined />}
                        onClick={() => setIsDeleteModalOpen(true)}
                    />
                </div>
            </div>

            <hr className="m-0 opacity-25" />

            {/* This body now scrolls internally if items exceed height */}
            <div className="order-card-body custom-scrollbar-hide">
                {order.orderItems?.map((item: any) => (
                    <div key={item.id} className="d-flex justify-content-between align-items-center">
                        <div className="d-flex gap-4 align-items-center">
                            <img
                                src={item.food.image ? `${FOOD_IMAGE_URL}${item.food.image}` : 'https://placehold.co/60x50'}
                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }}
                                alt={item.food.name}
                            />
                            <div>
                                <div className="fw-bold small">{item.food.name}</div>
                                <div className="text-muted" style={{ fontSize: '18px' }}>{item.unitPrice} ৳</div>
                            </div>
                        </div>
                        <div className="text-muted" style={{ fontSize: '16px' }}>QTY. {item.quantity}</div>
                    </div>
                ))}
            </div>

            <div className="p-3 bg-white mt-auto border-top">
                <div className="d-flex justify-content-between align-items-end">
                    <div>
                        <div className="small text-muted">Total Quantity: <b>{order.orderItems?.reduce((sum: number, i: any) => sum + i.quantity, 0)}</b></div>
                        <div className="h5 mb-0 fw-bold">
                            Total Amount (৳): <span className="text-primary underline">{order.amount}৳</span>
                        </div>
                    </div>
                    <div className="text-end">
                        <div className="small" style={getStatusStyle(order.orderStatus)}>{order.orderStatus}</div>
                        <div className="h4 mb-0 fw-bold text-secondary">
                            {order.table?.tableNumber || "N/A"}
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                open={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                footer={null}
                centered
                closable={true}
                width={480}
                className="delete-order-modal"
            >
                <div className="modal-inner-content">
                    <div className="modal-header-inline">
                        <QuestionCircleOutlined className="warning-icon" />
                        <span className="modal-title">Are you sure you want to delete this order?</span>
                    </div>
                    
                    <p className="modal-subtitle">This action cannot be undone.</p>

                    {/* Action Buttons */}
                    <div className="modal-button-container">
                        <Button 
                            className="btn-cancel-custom" 
                            onClick={() => setIsDeleteModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            className="btn-delete-custom" 
                            loading={isDeleting}
                            onClick={handleDelete}
                        >
                            Yes, Delete
                        </Button>
                    </div>
                </div>
            </Modal>

            <EditOrderModal
                isOpen={editModalOpen}
                order={order}
                onClose={() => setEditModalOpen(false)}
            />
        </div>
    );
};

export default OrderCard;