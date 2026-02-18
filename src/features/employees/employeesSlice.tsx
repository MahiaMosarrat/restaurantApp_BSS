
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios, { type AxiosResponse } from "axios";
import { getHeaders } from "../foods/foodsSlice";
import { message } from "antd";


export interface IUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    phoneNumber: string;
    dob: string;
    nid: string;
    genderId: number;
    image: string;
    fullName?: string;
}

export interface IEmployee {
    id: string;
    designation: string;
    joinDate: string;
    fatherName: string;
    motherName: string;
    spouseName: string;
    user: IUser;
}

export interface IEmployeeStore {
    employeeListData: {
        isLoading: boolean;
        error: string | null;
        employees: IEmployee[];
        page: number;
        pageSize: number;
        total: number;
    };
    createEmployeeData: {
        isLoading: boolean;
        error: string | null;
        imagePreview: boolean;
    };
    updateEmployee: {
        isLoading: boolean;
        error: string | null;
    };
    deleteEmployee: {
        isDeleting: boolean;
        error: string | null;
    };
}


const initialState: IEmployeeStore = {
    employeeListData: {
        isLoading: false,
        error: null,
        employees: [],
        page: 1,
        pageSize: 10,
        total: 0,
    },
    createEmployeeData: {
        isLoading: false,
        error: null,
        imagePreview: false,
    },
    updateEmployee: {
        isLoading: false,
        error: null,
    },
    deleteEmployee: {
        isDeleting: false,
        error: null,
    }
};


export const fetchEmployees = createAsyncThunk(
    'employees/fetchEmployees',
    async ({ page, pageSize }: { page: number; pageSize: number }) => {

        const response: AxiosResponse<{ data: IEmployee[]; total: number }> = await axios.get(
            `https://bssrms.runasp.net/api/Employee/datatable?Page=${page}&Per_Page=${pageSize}`,
            getHeaders()
        );
        return response.data;
    }
);

export const createEmployee = createAsyncThunk(
    'employees/createEmployee',
    async (formData: any) => {
        const response: AxiosResponse<IEmployee> = await axios.post(
            `https://bssrms.runasp.net/api/Employee/create`,
            formData,
            getHeaders()
        );
        return response.data;
    }
);

export const updateEmployee = createAsyncThunk(
    'employees/updateEmployee',
    async (formData: any) => {
        const response: AxiosResponse<IEmployee> = await axios.put(
            `https://bssrms.runasp.net/api/Employee/update/${formData.id}`,
            formData,
            getHeaders()
        );
        return response.data;
    }
);

export const deleteEmployee = createAsyncThunk(
    'employees/deleteEmployee',
    async (selectedEmployeeId: string) => {
        await axios.delete(
            `https://bssrms.runasp.net/api/Employee/delete/${selectedEmployeeId}`,
            getHeaders()
        );
        return selectedEmployeeId;
    }
);


const employeesSlice = createSlice({
    name: 'employees',
    initialState,
    reducers: {
        setPage(state, action: PayloadAction<number>) {
            state.employeeListData.page = action.payload;
        },
        setPageSize(state, action: PayloadAction<number>) {
            state.employeeListData.pageSize = action.payload;
            state.employeeListData.page = 1;
        },
    },
    extraReducers: (builder) => {
        builder

            .addCase(fetchEmployees.pending, (state) => {
                state.employeeListData.isLoading = true;
                state.employeeListData.error = null;
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.employeeListData.isLoading = false;
                state.employeeListData.employees = action.payload.data;
                state.employeeListData.total = action.payload.total;
            })
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.employeeListData.isLoading = false;
                state.employeeListData.error = action.error?.message ?? "Failed to fetch";
            })


            .addCase(createEmployee.pending, (state) => {
                state.createEmployeeData.isLoading = true;
                state.createEmployeeData.error = null;
            })
            .addCase(createEmployee.fulfilled, (state, action) => {
                state.createEmployeeData.isLoading = false;
                state.createEmployeeData.imagePreview = true;
                if (action.payload && action.payload.user) {
                    state.employeeListData.employees = [action.payload, ...state.employeeListData.employees];
                    state.employeeListData.total += 1;
                }
                 message.success("Employee created successfully");
            })
            .addCase(createEmployee.rejected, (state, action) => {
                state.createEmployeeData.isLoading = false;
                state.createEmployeeData.error = action.error?.message ?? "Failed to create";
                message.error("Failed to create employee");
            })


            .addCase(updateEmployee.pending, (state) => {
                state.updateEmployee.isLoading = true;
                state.updateEmployee.error = null;
            })
            .addCase(updateEmployee.fulfilled, (state, action) => {
                state.updateEmployee.isLoading = false;
                const index = state.employeeListData.employees.findIndex(emp => emp.id === action.payload.id);
                if (index !== -1) {
                    state.employeeListData.employees[index] = action.payload;
                }
                 message.success("Employee updated successfully");
            })
            .addCase(updateEmployee.rejected, (state, action) => {
                state.updateEmployee.isLoading = false;
                state.updateEmployee.error = action.error?.message ?? "Failed to update";
                 message.error("Failed to update employee");
            })


            .addCase(deleteEmployee.pending, (state) => {
                state.deleteEmployee.isDeleting = true;
                state.deleteEmployee.error = null;
            })
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.deleteEmployee.isDeleting = false;

                state.employeeListData.employees = state.employeeListData.employees.filter(
                    (e) => e.id !== action.payload
                );
                state.employeeListData.total--;
                 message.success("Employee deleted successfully");
            })
            .addCase(deleteEmployee.rejected, (state, action) => {
                state.deleteEmployee.isDeleting = false;
                state.deleteEmployee.error = action.error?.message ?? "Failed to delete";
                  message.error("Failed to delete employee");
            });
    },
});

export const { setPage, setPageSize } = employeesSlice.actions;
export default employeesSlice.reducer;