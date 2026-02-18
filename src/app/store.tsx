import { configureStore } from "@reduxjs/toolkit";
import foodsReducer from '../features/foods/foodsSlice';
import employeesReducer from '../features/employees/employeesSlice';
import tablesReducer from '../features/tables/tablesSlice';
import cartReducer from '../features/cart/cartSlice';
import ordersReducer from '../features/orders/ordersSlice';

const store = configureStore({
    reducer: {
        foods: foodsReducer,
        employees: employeesReducer,
        tables: tablesReducer,
        cart: cartReducer,
        orders: ordersReducer,
    },
    // middleware: () => new Tuple(tableAssigniesImageLoadderMiddleware)
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;