import { Badge, Drawer, Input, Button, Image, message, InputNumber, Grid } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchTables } from '../features/tables/tablesSlice';
import { CloseOutlined, DeleteOutlined, SearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { fetchFoods } from "../features/foods/foodsSlice";
import './NewOrder.css';
import { addToCart, clearCart, removeItem, updateQuantity } from "../features/cart/cartSlice";
import type { AppDispatch } from "../app/store";
import { createOrder } from "../features/orders/ordersSlice";

const NewOrder = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { foodsListData } = useSelector((state: any) => state.foods);
    const { items: cartItems } = useSelector((state: any) => state.cart);
    const { tableListData } = useSelector((state: any) => state.tables);
    const [customerPhone, setCustomerPhone] = useState('');

    const [selectedTable, setSelectedTable] = useState<any>(null);
    const [cartVisible, setCartVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    const filteredFoods = foodsListData.foods?.filter((food: any) =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const uniqueItemCount = cartItems.length;

    const subTotal = cartItems.reduce((acc: number, item: any) => acc + (item.discountPrice * item.quantity), 0);

    const handleConfirmOrder = async () => {
        if (!selectedTable) return message.error("Select a table");
        if (cartItems.length === 0) return message.error("Cart is empty");

        const orderPayload = {

            tableId: Number(selectedTable.id),


            orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,


            amount: Number(subTotal),


            phoneNumber: customerPhone || "",


            items: cartItems.map((item: any) => ({
                foodId: Number(item.id),
                foodPackageId: 0,
                quantity: Number(item.quantity),
                unitPrice: Number(item.discountPrice),
                totalPrice: Number(item.discountPrice * item.quantity)
            })),
        };

        console.log("Sending Payload:", orderPayload);
        try {
            await dispatch(createOrder(orderPayload)).unwrap();
            message.success("Order Placed Successfully!");
            dispatch(clearCart());
            setCustomerPhone('');
            setCartVisible(false);
        } catch (err: any) {

            console.error("Order Error:", err);
            message.error(err?.message || "Check console for validation errors");
        }
    };

    useEffect(() => {
        dispatch(fetchTables({ page: 1, pageSize: 50 }) as any);
        dispatch(fetchFoods({ page: 1, pageSize: 100 }) as any);
    }, [dispatch]);

    return (
        <div className="table-page-container">
            <div className="table-page-wrapper flex h-full w-full overflow-hidden shadow-lg">

                {/* LEFT SIDEBAR*/}
                <div className="table-sidebar-container flex flex-col h-full overflow-hidden border-r border-green-100 bg-[#f6faf7] flex-grow overflow-y-auto no-scrollbar">
                    <div className="sticky-header border-b border-green-100 ">
                        <h2 className="text-gray-700">SELECT A TABLE ({tableListData.total || 0})</h2>
                    </div>
                    {/* Only this div scrolls */}
                    <div className="table-card-wraper flex-grow overflow-y-auto no-scrollbar shadow-md">
                        {tableListData.tables?.map((table: any) => (
                            <div
                                key={table.id}
                                onClick={() => setSelectedTable(table)}
                                className={`table-card ${selectedTable?.id === table.id ? 'active' : ''}`}
                            >
                                <div className="table-image-wrapper">
                                    <img
                                        src={table.image ? `https://bssrms.runasp.net/images/table/${table.image}` : undefined}
                                        alt={table.tableNumber}
                                        className="table-image"
                                    />
                                </div>
                                <p className="table-info-text text-center">{table.tableNumber} ({table.numberOfSeats || 0} Seats)</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT CONTENT*/}
                <div className="content-container flex flex-col flex-grow overflow-hidden ">
                    {!selectedTable ? (
                        <div className="placeholder-wrapper">
                            <img src="/select_table.svg" alt="Select table" className="placeholder-img w-52 mb-4" />
                            <h3 className="placeholder-text text-2xl font-semibold text-gray-500 border-b-2 border-red-400">
                                Select A Table First!
                            </h3>
                        </div>
                    ) : (
                        <>


                            <div className="sticky-header-foodlist flex-shrink-0 border-b border-green-100 px-6">
                                <h2 className="foodlist-header-text ps-4">ADD FOOD TO CART ({foodsListData.total || 0})</h2>
                                <div className="search-wrapper w-1/3 pe-4">
                                    <Input
                                        placeholder="Search Food..."
                                        suffix={
                                            <div className="search-icon-btn">
                                                <SearchOutlined />
                                            </div>
                                        }
                                        className="custom-search-bar"
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Food List Scroll Area */}
                            <div className="flex-grow overflow-y-auto no-scrollbar px-4 bg-gray-50/30">
                                {filteredFoods?.map((food: any) => (
                                    /* Ensure this structure inside the filteredFoods.map in NewOrder.tsx */
                                    <div key={food.id} className="food-card flex bg-white rounded-xl shadow-sm">
                                        <div className="food-img-wrapper flex-shrink-0" style={{ height: '200px', width: '200px' }}>
                                            <Image
                                                src={food.image ? `https://bssrms.runasp.net/images/food/${food.image}` : undefined}
                                                alt={food.name}
                                                className="food-image-large"
                                                preview={false}
                                            />
                                        </div>

                                        {/* Contains Name, Desc, and Price with a defined gap */}
                                        <div className="food-info-container">
                                            <div className="food-text-top">
                                                <h3 className="food-name-title">{food.name}</h3>
                                                <p className="food-desc-text">{food.description || food.name}</p>
                                            </div>

                                            <div className="food-price-block">
                                                {food.price !== food.discountPrice && (
                                                    <span className="food-old-price">Price - {food.price}৳</span>
                                                )}
                                                <span className="food-new-price">Price - {food.discountPrice}৳!</span>
                                            </div>
                                        </div>

                                        {/* Locked to bottom-right exactly as marked in your request */}
                                        <div className="food-action-right">
                                            <button className="add-to-cart-button" onClick={() => dispatch(addToCart(food))}>
                                                Add To Cart
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    <div className="cart-floating-wrapper">
                        <Badge count={uniqueItemCount} showZero color="#ff4d4f">
                            <button className="cart-btn" onClick={() => setCartVisible(true)}>
                                <ShoppingCartOutlined />
                            </button>
                        </Badge>
                    </div>
                </div>
            </div>

            <Drawer
                title={
                    <div className="cart-header-custom">
                        <span style={{ color: '#0d8d3c' }}><ShoppingCartOutlined /> Order Cart</span>
                    </div>
                }
                closeIcon={<CloseOutlined style={{ color: '#065322', fontSize: '22px' }} />}
                onClose={() => setCartVisible(false)}
                open={cartVisible}
                width={screens.xs ? "82%" : 450}
                footer={null}
                className="custom-cart-drawer"
            >
                <div className="drawer-inner-container">
                    {cartItems.length === 0 ? (

                        <div className="empty-cart-centered">
                            <h2>The Cart Is Empty!</h2>
                        </div>
                    ) : (
                        <>
                            <div className="cart-items-list no-scrollbar">
                                {cartItems.map((item: any) => (
                                    <div key={item.id} className="cart-item-row">
                                        <div className="cart-item-left">
                                            <Image
                                                src={`https://bssrms.runasp.net/images/food/${item.image}`}
                                                width={100}
                                                className="rounded-full item-image-shadow"
                                            />
                                            <div className="cart-item-info">
                                                <div className="item-name">{item.name}</div>
                                                <div className="qty-wrapper">
                                                    <span>Qty.</span>
                                                    <InputNumber
                                                        min={1}
                                                        value={item.quantity}
                                                        onChange={(val) => {
                                                            const delta = (val || 1) - item.quantity;
                                                            dispatch(updateQuantity({ id: item.id, delta }));
                                                        }}
                                                        className="qty-input"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="cart-item-right">
                                            <Button
                                                type="default"
                                                icon={<DeleteOutlined />}
                                                onClick={() => dispatch(removeItem(item.id))}
                                                className="delete-icon-btn"
                                            />
                                            <div className="item-price">
                                                Price: {item.discountPrice * item.quantity} ৳
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer Section (Image 2) */}
                            <div className="cart-footer-section">
                                <div className="subtotal-row">
                                    <span>Sub-Total</span>
                                    <span>{subTotal} ৳</span>
                                </div>
                                <div className="phone-input-container">
                                    <label>Phone Number (Optional)</label>
                                    <Input
                                        placeholder="Enter customer phone number"
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value)}
                                    />
                                </div>
                                <Button
                                    type="primary"
                                    block
                                    className="confirm-order-btn"
                                    onClick={handleConfirmOrder}
                                >
                                    Confirm Order
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </Drawer>
        </div>
    );
}

export default NewOrder;