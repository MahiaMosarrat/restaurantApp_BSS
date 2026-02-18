import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AxiosResponse } from "axios";
import axios from "axios";
import { getHeaders } from "../foods/foodsSlice";
import { message } from "antd";

export interface AssignedEmp {
    employeeTableId: number;
    employeeId: string;
    name: string;
}

export interface ITable {
    id: number;
    tableNumber: string;
    numberOfSeats: number;
    isOccupied: boolean;
    image: string;
    base64: string;
    employees: AssignedEmp[];
}

export interface ITableStore {
    tableListData: {
        isLoading: boolean;
        error: string | null;
        tables: ITable[];
        page: number;
        pageSize: number;
        total: number;
    };

    createTableData: {
        isLoading: boolean;
        error: string | null;
        imagePreview: boolean;
    };

    updateTableData: {
        isLoading: boolean;
        error: string | null;
    };

    deleteTableData: {
        isDeleting: boolean;
        error: string | null;
    };
}

const initialState: ITableStore = {
    tableListData: {
        isLoading: false,
        error: null,
        tables: [],
        page: 1,
        pageSize: 10,
        total: 0,
    },
    createTableData: {
        isLoading: false,
        error: null,
        imagePreview: false,
    },
    updateTableData: {
        isLoading: false,
        error: null,
    },
    deleteTableData: {
        isDeleting: false,
        error: null,
    }
};


export const fetchTables = createAsyncThunk('tables/fetchTables', async ({ page, pageSize }: { page: number; pageSize: number }) => {
    const response: AxiosResponse<{ data: ITable[]; total: number }> = await axios.get(
        `https://bssrms.runasp.net/api/Table/datatable?Page=${page}&Per_Page=${pageSize}`, getHeaders()
    );
    return response.data;
}
);

export const createTables = createAsyncThunk('tables/createTables', async (formData: any) => {
    const response: AxiosResponse<ITable> = await axios.post(
        `https://bssrms.runasp.net/api/Table/create`, formData, getHeaders()
    );
    return response.data;
}
);

export const updateTables = createAsyncThunk('tables/updateTables', async (formData: any) => {
    const response: AxiosResponse<ITable> = await axios.put(
        `https://bssrms.runasp.net/api/Table/update/${formData.id}`, formData, getHeaders()
    );
    console.log("SERVER RESPONSE DATA:", response.data);
    return response.data;
}
);

export const deleteTables = createAsyncThunk('tables/deleteTables', async (selectedTableId: number) => {
    await axios.delete(`https://bssrms.runasp.net/api/Table/delete/${selectedTableId}`, getHeaders()
    );
    return selectedTableId;
}
);

const tablesSlice = createSlice({
    name: 'tables',
    initialState,
    reducers: {
        setPage(state, action: PayloadAction<number>) {
            state.tableListData.page = action.payload;
        },

        setPageSize(state, action: PayloadAction<number>) {
            state.tableListData.pageSize = action.payload;
            state.tableListData.page = 1;
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchTables.pending, (state) => {
                state.tableListData.isLoading = true;
                state.tableListData.error = null;
            })
            .addCase(fetchTables.fulfilled, (state, action) => {
                state.tableListData.isLoading = false;
                state.tableListData.tables = action.payload.data;
                tablesSlice.caseReducers
                state.tableListData.total = action.payload.total;
            })
            .addCase(fetchTables.rejected, (state, action) => {
                state.tableListData.isLoading = false;
                state.tableListData.error = action.error?.message ?? "Failed to fetch";
            })
            .addCase(createTables.pending, (state) => {
                state.createTableData.isLoading = true;
                state.createTableData.error = null;
            })
            .addCase(createTables.fulfilled, (state, action) => {
                state.createTableData.isLoading = false;
                state.createTableData.imagePreview = true;
                state.tableListData.tables.unshift(action.payload);
                state.tableListData.total++;
                  message.success("Table created successfully");
            })
            .addCase(createTables.rejected, (state, action) => {
                state.createTableData.isLoading = false;
                state.createTableData.error = action.error?.message ?? "Failed to create";
             message.error("Failed to create table");
            })
            .addCase(updateTables.pending, (state) => {
                state.updateTableData.isLoading = true;
                state.updateTableData.error = null;
            })
            .addCase(updateTables.fulfilled, (state, action) => {
                state.updateTableData.isLoading = false;
                const updatedTable = action.payload;
                const index = state.tableListData.tables.findIndex(
                    (table) => table.id === updatedTable.id
                );

                if (index !== -1) {
                    state.tableListData.tables[index] = updatedTable;
                }
                message.success("Table updated successfully");
            })
            .addCase(updateTables.rejected, (state, action) => {
                state.updateTableData.isLoading = false;
                state.updateTableData.error = action.error?.message ?? "Failed to update";
             message.error("Failed to update table");
            })
            .addCase(deleteTables.pending, (state) => {
                state.deleteTableData.isDeleting = true;
                state.deleteTableData.error = null;
            })
            .addCase(deleteTables.fulfilled, (state, action) => {
                state.deleteTableData.isDeleting = false;
                state.tableListData.tables = state.tableListData.tables.filter((t) => t.id !== action.payload);
                state.tableListData.total--;
                message.success("Table deleted successfully");
            })
            .addCase(deleteTables.rejected, (state, action) => {
                state.deleteTableData.isDeleting = false;
                state.deleteTableData.error = action.error?.message ?? "Failed to update";
              message.error("Failed to delete table");
            })
    },
});

export const { setPage, setPageSize } = tablesSlice.actions;
export default tablesSlice.reducer;
