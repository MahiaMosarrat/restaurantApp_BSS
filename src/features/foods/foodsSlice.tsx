import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios, { type AxiosResponse } from "axios";
import { getAuthInfo } from "../../state-context/auth-context";
import { message } from "antd";

type DiscountType = "None" | "Flat" | "Percentage";

export interface IFood {
    description: string;
    discount: number;
    discountPrice: number;
    discountType: DiscountType;
    id: number;
    name: string;
    image: string;
    base64: string;
    price: number;
}

export interface IFoodsStore {
    foodsListData: {
        isLoading: boolean;
        page: number;
        pageSize: number;
        foods: IFood[];
        error: string | null;
        total: number;
    };
    createFoodData: {
        isLoading: boolean;
        error: string | null;
        formData: {
            name: string;
            description: string;
            price: number;
            discountType: string;
            discount: number;
            image: string;
            base64: string;
        };
        imagePreview: boolean;
        showFullImage: boolean;
    };

    updateFood: {
        isLoading: boolean;
        error: string | null;
        formData: {
            id: number;
            name: string;
            description: string;
            price: number;
            discountType: string;
            discount: number;
            image: string;
            base64: string;
        };
        imagePreview: boolean;
        showFullImage: boolean;
    };

    deleteFood: {
        isDeleting: boolean,
        error: string | null
    }

}

const initialState: IFoodsStore = {
    foodsListData: {
        isLoading: false,
        page: 1,
        pageSize: 10,
        foods: [],
        error: null,
        total: 0,
    },

    createFoodData: {
        isLoading: false,
        error: null,
        formData: {
            name: '', description: '', price: 0, discountType: 'None', discount: 0, image: '',
            base64: ''
        },
        imagePreview: false,
        showFullImage: false,
    },

    updateFood: {
        isLoading: false,
        error: null,
        formData: {
            id: 0, name: '', description: '', price: 0, discountType: 'None', discount: 0, image: '',
            base64: ''
        },
        imagePreview: false,
        showFullImage: false,
    },

    deleteFood: {
        isDeleting: false,
        error: null,
    }

};

export const fetchFoods = createAsyncThunk('foods/fetchFoods', async ({ page, pageSize }: { page: number, pageSize: number }) => {
    const response: AxiosResponse<{
        data: IFood[],
        total: number
    }> = await axios.get(
        `https://bssrms.runasp.net/api/Food/datatable?Page=${page}&Per_Page=${pageSize}`,
        getHeaders()
    );
    return response.data;
});

// export const fetchFoodImage = createAsyncThunk('foods/fetchFoodImage', async (image: string) => {
//     const response: AxiosResponse<IFood> = await axios.get(`https://bssrms.runasp.net/api/images/food/${image}`, getHeaders());
//     return response.data;
// });

export const createFood = createAsyncThunk('foods/createFood', async (formData: any) => {
    const response: AxiosResponse<IFood> = await axios.post(
        `https://bssrms.runasp.net/api/Food/create`, formData,
        getHeaders()
    );
    return response.data;
});

export const deleteFood = createAsyncThunk('foods/deleteFood', async (selectedFoodId: number) => {
    await axios.delete(`https://bssrms.runasp.net/api/Food/delete/${selectedFoodId}`, getHeaders());
    return selectedFoodId;
});

export const updateFood = createAsyncThunk('foods/updateFood', async (formdata: any) => {
    const response = await axios.put(`https://bssrms.runasp.net/api/Food/update/${formdata.id}`, formdata, getHeaders());
    return response.data;
});

const foodsSlice = createSlice({
    name: 'foodsSlice',
    initialState: initialState,
    reducers: {
        setPage(state, action: PayloadAction<number>) {
            state.foodsListData.page = action.payload;
        },
        setPageSize(state, action: PayloadAction<number>) {
            state.foodsListData.pageSize = action.payload;
            state.foodsListData.page = 1;
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFoods.pending, (state: IFoodsStore) => {
                state.foodsListData.error = "";
                state.foodsListData.isLoading = true;
            })
            .addCase(fetchFoods.fulfilled, (state: IFoodsStore, action) => {
                state.foodsListData.isLoading = false;
                state.foodsListData.foods = action.payload.data;
                state.foodsListData.total = action.payload.total;
            })
            .addCase(fetchFoods.rejected, (state: IFoodsStore, action) => {
                state.foodsListData.isLoading = false;
                state.foodsListData.error = action.error?.message ?? null;
            })

            // .addCase(fetchFoodImage.fulfilled, (state: IFoodsStore, action) => {
            //     state.foodsListData.foods = action.payload.image;
            // })

            .addCase(createFood.pending, (state: IFoodsStore) => {
                state.createFoodData.error = null;
                state.createFoodData.isLoading = true;
            })
            .addCase(createFood.fulfilled, (state: IFoodsStore, action) => {
                state.createFoodData.isLoading = false;
                state.createFoodData.formData = action.payload;
                state.foodsListData.foods.unshift(action.payload)
                state.foodsListData.total++;
                state.createFoodData.imagePreview = true;

                message.success("Food created successfully");
            })
            .addCase(createFood.rejected, (state: IFoodsStore, action) => {
                state.createFoodData.isLoading = false;
                state.createFoodData.error = action.error?.message ?? null;
                message.error("Failed to create food");
            })

            .addCase(deleteFood.pending, (state: IFoodsStore) => {
                state.deleteFood.error = '';
                state.deleteFood.isDeleting = true;
            })
            .addCase(deleteFood.fulfilled, (state: IFoodsStore, action) => {
                state.deleteFood.isDeleting = false;
                state.foodsListData.foods = state.foodsListData.foods.filter(f => f.id !== action.payload);
                state.foodsListData.total--;
                
            })
            .addCase(deleteFood.rejected, (state: IFoodsStore, action) => {
                state.deleteFood.isDeleting = false;
                state.deleteFood.error = action.error?.message ?? null;
               
            })

            .addCase(updateFood.pending, (state: IFoodsStore) => {
                state.updateFood.error = null;
                state.updateFood.isLoading = true;
            })
            .addCase(updateFood.fulfilled, (state: IFoodsStore, action) => {
                state.updateFood.isLoading = false;

                const index = state.foodsListData.foods.findIndex(f => f.id === action.payload.id);
                if (index > -1) {
                    state.foodsListData.foods[index] = action.payload;
                }
                state.updateFood.imagePreview = true;
                message.success("Food updated successfully");
            })
            .addCase(updateFood.rejected, (state: IFoodsStore, action) => {
                state.updateFood.isLoading = false;
                state.updateFood.error = action.error?.message ?? null;
                message.error("Failed to update food");
            });
    },
});

export default foodsSlice.reducer;
export const { setPage, setPageSize } = foodsSlice.actions;

export function getHeaders() {
    return {
        headers: {
            'Authorization': `Bearer ${getAuthInfo()?.token ?? ""}`
        }
    };
}
