import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getHeaders, type IFood } from "../foods/foodsSlice";
import type { AxiosResponse } from "axios";
import axios from "axios";

export interface status {

}

export interface IOrderItem {
    id: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    food: IFood;
}

export interface IOrder {
    id: number;
    orderNumber: string;
    amount: number;
    orderStatus: string;
    orderTime: string;
    table: {
        tableId: number;
        tableNumber: string;
    };
    orderedBy: any;
    orderTakenBy: any;
    orderItems: IOrderItem[];
}

export interface IOrderStore {
    orderListData: {
        isLoading: boolean;
        error: string | null;
        orders: IOrder[];
        page: number;
        pageSize: number;
        total: number;
    };
    createOrderData: {
        isLoading: boolean;
        error: string | null;
    };
    updateOrderData: {
        isLoading: boolean;
        error: string | null;
    };
    deleteOrderData: {
        isDeleting: boolean;
        error: string | null;
    };
}

const initialState: IOrderStore = {
    orderListData: {
        isLoading: false,
        error: null,
        orders: [],
        page: 1,
        pageSize: 10,
        total: 0,
    },
    createOrderData: { isLoading: false, error: null },
    updateOrderData: { isLoading: false, error: null },
    deleteOrderData: { isDeleting: false, error: null },
};


export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async ({ page, perPage, status }: any) => {
        let url = `https://bssrms.runasp.net/api/Order/datatable?Page=${page}&Per_Page=${perPage}`;

        if (status && status !== 'All') {
            url += `&Search=${status}`;
        }

        const response: AxiosResponse<any> = await axios.get(url, getHeaders()

        );
        return response.data;
    }
);

export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (orderPayload: any) => {
        const response: AxiosResponse<IOrder> = await axios.post(
            `https://bssrms.runasp.net/api/Order/create`,
            orderPayload,
            getHeaders()
        );
        return response.data;
    }
);

export const updateOrder = createAsyncThunk(
    'orders/updateOrder',
    async ({ id, payload }: { id: number; payload: any }) => {
        const response: AxiosResponse<IOrder> = await axios.put(
            `https://bssrms.runasp.net/api/Order/update/${id}`,
            payload,
            getHeaders()
        );
        return response.data;
    }
);

export const updateOrderStatus = createAsyncThunk(
    'orders/updateOrderStatus',
    async ({ id, status }: { id: number; status: string }) => {
        const response: AxiosResponse<IOrder> = await axios.put(
            `https://bssrms.runasp.net/api/Order/update-status/${id}`,
            { status },
            getHeaders()
        );
        return response.data;
    }
);

export const deleteOrder = createAsyncThunk(
    'orders/deleteOrder',
    async (orderId: number) => {
        await axios.delete(`https://bssrms.runasp.net/api/Order/delete/${orderId}`, getHeaders());
        return orderId;
    }
);

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setPage(state, action: PayloadAction<number>) {
            state.orderListData.page = action.payload;
        },
        setPageSize(state, action: PayloadAction<number>) {
            state.orderListData.pageSize = action.payload;
            state.orderListData.page = 1;
        },
    },

    extraReducers: (builder) => {
        builder
            // Fetch Orders
            .addCase(fetchOrders.pending, (state) => {
                state.orderListData.isLoading = true;
                state.orderListData.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.orderListData.isLoading = false;
                state.orderListData.orders = action.payload.data;
                state.orderListData.total = action.payload.total;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.orderListData.isLoading = false;
                state.orderListData.error = action.error?.message ?? null;
            })

            // Create Order
            .addCase(createOrder.pending, (state) => {
                state.createOrderData.error = null;
                state.createOrderData.isLoading = true;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.createOrderData.isLoading = false;
                state.orderListData.orders.unshift(action.payload);
                state.orderListData.total++;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.createOrderData.isLoading = false;
                state.createOrderData.error = action.error?.message ?? null;
            })
            // Delete Order
            .addCase(deleteOrder.pending, (state: IOrderStore) => {
                state.deleteOrderData.error = '';
                state.deleteOrderData.isDeleting = true;
            })
            .addCase(deleteOrder.fulfilled, (state: IOrderStore, action) => {
                state.deleteOrderData.isDeleting = false;
                state.orderListData.orders = state.orderListData.orders.filter(o => o.id !== action.payload);
                state.orderListData.total--;
            })
            .addCase(deleteOrder.rejected, (state: IOrderStore, action) => {
                state.deleteOrderData.isDeleting = false;
                state.deleteOrderData.error = action.error?.message ?? null;
            })
            .addCase(updateOrder.pending, (state) => {
                state.updateOrderData.isLoading = true;
                state.updateOrderData.error = null;
            })
            .addCase(updateOrder.fulfilled, (state, action: PayloadAction<IOrder>)  => {
                state.updateOrderData.isLoading = false;
                const index = state.orderListData.orders.findIndex(o=> o.id === action.payload.id);
                if (index !== -1) {
                    state.orderListData.orders[index] = action.payload;
                }

            })
            .addCase(updateOrder.rejected, (state, action) => {
                state.updateOrderData.isLoading = false;
                state.updateOrderData.error = action.error.message ?? 'Update failed';
            })
            ;
    },
});

export const { setPage, setPageSize } = ordersSlice.actions;
export default ordersSlice.reducer;
