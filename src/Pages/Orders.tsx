import { Dropdown, Pagination, Space } from "antd";
import OrderCard from "../Components/OrderCard";
import { DownOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { fetchOrders } from "../features/orders/ordersSlice";
import { useDispatch, useSelector } from "react-redux";
import { setPage, setPageSize } from "../features/orders/ordersSlice";
import './Orders.css'


const OrderManagement = () => {
    const dispatch = useDispatch();
    const { orders, page, pageSize, total, isLoading } = useSelector((state: any) => state.orders.orderListData);
    const [selectedStatus, setSelectedStatus] = useState('All');

    useEffect(() => {
        dispatch(fetchOrders({
            page,
            perPage: pageSize,
        }) as any);
    }, [dispatch, page, pageSize]);

    const menuItems = [
       { label: 'All', key: 'All' },
        { label: 'Pending', key: 'Pending' },
        { label: 'Confirmed', key: 'Confirmed' },
        { label: 'Preparing', key: 'Preparing' },
        { label: 'Prepared To Serve', key: 'PreparedToServe' }, 
        { label: 'Served', key: 'Served' },
        { label: 'Paid', key: 'Paid' },
        { label: 'Cancelled', key: 'Cancelled' },
    ];

    const handleMenuClick = ({ key }: { key: string }) => {
        setSelectedStatus(key);
    };

    const filteredOrders = selectedStatus === 'All' 
        ? orders 
        : orders.filter((order: any) => order.orderStatus === selectedStatus);

    const onPaginationChange = (currentPage: number, size: number) => {
        dispatch(setPage(currentPage));

        if (size !== pageSize) {
            dispatch(setPageSize(size));
        }
    };

    return (
        <div className=" bg-light min-vh-100">

            <div className="order-wrapper">


                <div className="order-header px-4">
                    <Dropdown
                        menu={{ items: menuItems, onClick: handleMenuClick, selectable: true, selectedKeys: [selectedStatus] }}
                        trigger={['hover']}
                        placement="bottomRight"
                    >
                        <div className="filter-orders-trigger">
                            <Space>
                                {selectedStatus === 'All' ? 'Filter Orders' : `Status: ${selectedStatus}`}
                                <DownOutlined style={{ fontSize: '12px' }} />
                            </Space>
                        </div>
                    </Dropdown>
                </div>




                <div className="order-content-scroll no-scrollbar-hide">
                    {isLoading ? (
                        <div className="text-center p-5 fw-bold">Loading orders...</div>
                    ) : (
                        /* Use a custom grid class instead of Bootstrap's row */
                       <div className="orders-grid-container">
                            {filteredOrders && filteredOrders.length > 0 ? (
                                filteredOrders.map((order: any) => (
                                    <OrderCard key={order.id} order={order} />
                                ))
                            ) : (
                                <div className="no-orders-message">No {selectedStatus} orders found on this page.</div>
                            )}
                        </div>
                    )}
                </div>


                <div className="order-footer-container px-4 py-3">
                    <div className="order-footer-box">
                        <Pagination
                            current={page}
                            pageSize={pageSize}
                            total={total}
                            onChange={onPaginationChange}
                            showSizeChanger={true}
                            pageSizeOptions={['10', '20', '30', '40', '50']}
                            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total}`}
                            className='custom-ant-pagination'
                            size="small"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderManagement;