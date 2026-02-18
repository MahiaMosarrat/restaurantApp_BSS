import { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, InputNumber, message, Select, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrder } from '../features/orders/ordersSlice';
import { fetchFoods } from '../features/foods/foodsSlice';


const EditOrderModal = ({ isOpen, order, onClose }: any) => {
    const dispatch = useDispatch();
    const { foods } = useSelector((state: any) => state.foods.foodsListData);
    const [selectedFoodId, setSelectedFoodId] = useState<number | null>(null);
    const [currentItems, setCurrentItems] = useState<any[]>([]);

    const FOOD_IMAGE_URL = 'https://bssrms.runasp.net/images/food/';

    useEffect(() => {
        if (isOpen) {

            dispatch(fetchFoods({ page: 1, pageSize: 1000 }) as any);
            setCurrentItems(order.orderItems || []);
        }
    }, [isOpen, order, dispatch]);

    const handleQuantityChange = (id: number, qty: number) => {
        setCurrentItems(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: qty, totalPrice: qty * item.unitPrice } : item
        ));
    };

    const handleRemoveItem = (id: number) => {
        setCurrentItems(prev => prev.filter(item => item.id !== id));
    };

    const handleAddFood = () => {
        const foodToAdd = foods.find((f: any) => f.id === selectedFoodId);
        if (!foodToAdd) return;

        const newItem = {
            id: Date.now(),
            quantity: 1,
            unitPrice: foodToAdd.price,
            totalPrice: foodToAdd.price,
            food: foodToAdd
        };
        setCurrentItems([...currentItems, newItem]);
        setSelectedFoodId(null);
    };

    const handleUpdate = async () => {
        const totalAmount = currentItems.reduce((sum, i) => sum + i.totalPrice, 0);

        const payload = {
            id: order.id,
            orderNumber: order.orderNumber,
            amount: totalAmount,
            items: currentItems.map(item => ({
                id: item.id > 1000000000 ? 0 : item.id,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
                foodId: item.food?.id || item.foodId,
                foodPackageId: 0

            })),
            tableId: order.table?.tableId || order.tableId,
            phoneNumber: order.phoneNumber
        };

        try {

            await dispatch(updateOrder({ id: order.id, payload }) as any).unwrap();
            message.success("Order Updated Successfully");


            dispatch(fetchOrders({ page: 1, perPage: 10 }) as any);

            onClose();
        } catch (err) {
            message.error("Update failed");
        }
    };
    return (
        <Modal
            title={<span><EditOutlined /> Edit Order - {order.orderNumber}</span>}
            open={isOpen}
            onCancel={onClose}
            width={750}
            maskStyle={{ backdropFilter: 'blur(6px)', backgroundColor: 'rgba(0, 40, 80, 0.3)' }}
            footer={[
                <Button key="cancel" onClick={onClose}>Cancel</Button>,
                <Button key="submit" type="primary" onClick={handleUpdate} style={{ backgroundColor: '#66bb6a', borderColor: '#66bb6a' }}>
                    Update Order
                </Button>
            ]}
        >
            <Form layout="vertical">
                <div className="row">
                    <div className="col-6"><Form.Item label="Order Number"><Input value={order.orderNumber} disabled /></Form.Item></div>
                    <div className="col-6"><Form.Item label="Table Number"><Input value={order.table?.tableNumber} disabled /></Form.Item></div>
                </div>

                <Form.Item label="Add Food Item">
                    <Space.Compact style={{ width: '100%' }}>
                        <Select
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Select a food item to add"
                            optionFilterProp="label"
                            value={selectedFoodId}
                            onChange={setSelectedFoodId}
                        >
                            {foods.map((f: any) => (
                                <Select.Option key={f.id} value={f.id} label={f.name}>
                                    <div className="d-flex align-items-center gap-2">
                                        <img src={`${FOOD_IMAGE_URL}${f.image}`} style={{ width: 30, height: 25, borderRadius: 4 }} alt="" />
                                        <span>{f.name} - {f.price}৳</span>
                                    </div>
                                </Select.Option>
                            ))}
                        </Select>
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddFood} style={{ backgroundColor: '#66bb6a' }}>Add</Button>
                    </Space.Compact>
                </Form.Item>

                <div className="order-items-list mt-4">
                    {currentItems.map((item) => (
                        <div key={item.id} className="d-flex align-items-center justify-content-between p-3 border rounded mb-2 bg-white">
                            <div className="d-flex gap-3 align-items-center">
                                <img src={`${FOOD_IMAGE_URL}${item.food.image}`} style={{ width: 50, height: 40, borderRadius: 4 }} alt="" />
                                <div>
                                    <div className="fw-bold">{item.food.name}</div>
                                    <div className="text-muted small">Unit: {item.unitPrice} ৳</div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center gap-4">
                                <InputNumber min={1} value={item.quantity} onChange={(val) => handleQuantityChange(item.id, val || 1)} />
                                <div className="fw-bold" style={{ minWidth: '80px' }}>{item.totalPrice} ৳</div>
                                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleRemoveItem(item.id)} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-3 text-end">
                    <h5 className="fw-bold">Total Amount: <span className="text-success">{currentItems.reduce((sum, i) => sum + i.totalPrice, 0)} ৳</span></h5>
                </div>
            </Form>
        </Modal>
    );
};

export default EditOrderModal;