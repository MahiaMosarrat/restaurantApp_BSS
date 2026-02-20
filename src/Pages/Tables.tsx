import { Avatar, Button, Dropdown, message, Modal, Spin, Table, Tooltip } from 'antd';
import './Tables.css'
import { useEffect, useState } from 'react';
import TableModal from '../Components/TableModal';
import DeleteModal from '../Components/DeleteModal';
import { deleteTables, fetchTables, type AssignedEmp, type ITableStore } from '../features/tables/tablesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setPage, setPageSize } from '../features/tables/tablesSlice';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, EditOutlined, PlusOutlined, QuestionOutlined, UserOutlined } from '@ant-design/icons';
import AssignEmployeeModal from '../Components/AssignEmployeeModal';
import { fetchEmployees } from '../features/employees/employeesSlice';
import axios from 'axios';
import type { ITable } from '../features/tables/tablesSlice';
import { getHeaders } from '../features/foods/foodsSlice';

const Tables = () => {

    const dispatch = useDispatch();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [tableModalOpen, setTableModalOpen] = useState(false);
    const [editingTable, setEditingTable] = useState<ITable | null>(null);
    const [selectedTableId, setSelectedTableId] = useState<number | null>(null);

    const { employees: allEmployees } = useSelector((state: any) => state.employees.employeeListData);
    const { tableListData }: { tableListData: ITableStore["tableListData"] } = useSelector((state: any) => state.tables);


    const { page, pageSize, total, tables, isLoading } = tableListData;

    const Image_Url = 'https://bssrms.runasp.net/images/table/';
    const USER_Image_Url = 'https://bssrms.runasp.net/images/user/';

    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState<ITable | null>(null);

    const [removeModalOpen, setRemoveModalOpen] = useState(false);
    const [empToRemove, setEmpToRemove] = useState<{ empTableId: number; name: string; tableName: string } | null>(null);

    const [visibleDropdownId, setVisibleDropdownId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchTables({ page, pageSize }) as any);
    }, [dispatch, page, pageSize]);

    useEffect(() => {
        dispatch(fetchEmployees({ page, pageSize }) as any);
    }, [page, pageSize, dispatch]);

    const handleConfirmDelete = async () => {
        if (!selectedTableId) return;
        dispatch(deleteTables(selectedTableId) as any);
        setDeleteModalOpen(false);
    };

    const handleEditClick = (table: ITable) => {
        setEditingTable(table);
        setTableModalOpen(true);
    };

    const handleAddClick = () => {
        setEditingTable(null);
        setTableModalOpen(true);
    };

    const handleAssignClick = (table: ITable) => {
        setSelectedTable(table);
        setAssignModalOpen(true);
    };

    const handleConfirmRemove = async () => {
        if (!empToRemove) return;

        try {
            await axios.delete(
                `https://bssrms.runasp.net/api/EmployeeTable/delete/${empToRemove.empTableId}`,
                getHeaders()
            );

            setRemoveModalOpen(false);
            setEmpToRemove(null);

            dispatch(fetchTables({ page, pageSize }) as any);
        } catch (error) {
            message.error('Error Processing The Request. Please Try Again...');
        }
    };

    const triggerRemoveConfirm = (empTableId: number, name: string, tableName: string) => {
        setEmpToRemove({ empTableId, name, tableName });
        setRemoveModalOpen(true);
        setVisibleDropdownId(null);
    };

    const onPaginationChange = (currentPage: number, size: number) => {
        dispatch(setPage(currentPage));
        if (size !== pageSize) {
            dispatch(setPageSize(size));
        }
    };

    const columns: ColumnsType<ITable> = [
        {
            dataIndex: 'image',
            key: 'image',
            width: 120,
            render: (imageName) =>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <img
                        src={imageName ? `${Image_Url}${imageName}` : 'https://placehold.co/50'}
                        alt='table'
                        className='table-main-img-large'
                    />
                </div>
            ,
        },
        {
            title: () => <Tooltip title=" Table Number"><span>Table Number</span></Tooltip>,
            dataIndex: 'tableNumber',
            key: 'tableNumber',
            width: '160',
            ellipsis: true,
            render: (tableNumber) => (
                <div className="table-name-cell">
                    <span className="table-name-text">
                        {tableNumber}
                    </span>
                </div>
            ),

        },
        {
            title: () => <Tooltip title="Total Seats"><span>Total Seats</span></Tooltip>, ellipsis: true,
            dataIndex: 'numberOfSeats',
            key: 'numberOfSeats',
            width: '130',
            render: (numberOfSeats) => (
                <span>{numberOfSeats}</span>
            )
        },
        {
            title: () => <Tooltip title="Booking Status"><span>Booking Status</span></Tooltip>, ellipsis: true,
            dataIndex: 'isOccupied',
            key: 'isOccupied',
            width: '180',
            render: (isOccupied: boolean) => (
                <span className={`status-badge ${isOccupied ? 'occupied' : 'available'}`}>
                    {isOccupied ? 'Occupied' : 'Available'}
                </span>
            )
        },
        {
            title: () => <Tooltip title="Assigned Employees "><span>Assigned Employees</span></Tooltip>, ellipsis: true,
            dataIndex: "employees",
            key: "employees",
            width: 'auto',
            render: (employees: AssignedEmp[] = [], record) => (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Avatar.Group maxCount={4} size={45}>

                        {employees.map((emp: AssignedEmp) => {

                            const fullDetails = allEmployees.find((e: any) => e.id === emp.employeeId);
                            const imagePath = fullDetails?.user?.image;

                            return (
                                <Tooltip title={emp.name} key={emp.employeeTableId}>
                                    <Dropdown
                                        trigger={["click"]}
                                        open={visibleDropdownId === emp.employeeTableId}
                                        onOpenChange={(flag) => {
                                            setVisibleDropdownId(flag ? emp.employeeTableId : null);
                                        }}
                                        dropdownRender={() => (
                                            <div className="emp-remove-card">
                                                <div className="emp-remove-body">
                                                    <Avatar
                                                        size={40}
                                                        src={imagePath ? `${USER_Image_Url}${imagePath}` : undefined}
                                                        icon={<UserOutlined />}
                                                    />
                                                    <div>{emp.name}</div>
                                                </div>
                                                <button className="emp-remove-btn" onClick={() => triggerRemoveConfirm(emp.employeeTableId, emp.name, record.tableNumber)}>
                                                    Remove
                                                </button>
                                            </div>
                                        )}
                                    >
                                        <Avatar
                                            style={{ cursor: "pointer" }}
                                            src={imagePath ? `${USER_Image_Url}${imagePath}` : undefined}
                                            icon={<UserOutlined />}
                                        />
                                    </Dropdown>
                                </Tooltip>
                            );
                        })}
                    </Avatar.Group>

                    <button
                        className="assign-plus-icon"
                        onClick={() => handleAssignClick(record)}
                    >
                        +
                    </button>
                </div>
            )
        },

        {
            title: () => (
                <Tooltip title="Add New Table">
                    <Button className="add-table-btn" icon={<PlusOutlined />} onClick={handleAddClick}>
                        Add New Table
                    </Button>
                </Tooltip>

            ),
            key: 'actions',
            width: '180',
            render: (_, record) => (
                <div className='table-action-container'>
                    <Tooltip title="Edit Table">
                        <button onClick={() => handleEditClick(record)} className='table-action-btn'><EditOutlined /></button>
                    </Tooltip>

                    <Tooltip title="Delete Table">
                        <button onClick={() => { setSelectedTableId(record.id); setDeleteModalOpen(true); }} className='table-action-btn'><DeleteOutlined /></button>
                    </Tooltip>

                </div>
            )
        }
    ];


    return (
        <div className='tables-container'>
            <div className='table-wrapper'>
                <Table
                    columns={columns}
                    dataSource={tables}
                    rowKey="id"
                    rowClassName="custom-table-row"
                    loading={{ spinning: isLoading, indicator: <Spin size="small" /> }}
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        total: total,
                        position: ['bottomCenter'],
                        onChange: onPaginationChange,
                        showSizeChanger: true,
                        responsive: true,
                        pageSizeOptions: ['10', '20', '30', '40', '50'],
                        showTotal: (total, range) => (
                            <span className="pagination-total-text">
                                {range[0]}-{range[1]} of {total} items
                            </span>
                        ),
                        className: "custom-ant-pagination",
                    }}
                    tableLayout="fixed"
                    scroll={{ x: '768px', y: 'calc(100vh - 350px)' }}
                />
            </div>

            <TableModal
                isOpen={tableModalOpen}
                initialData={editingTable}
                onClose={() => setTableModalOpen(false)}
                onSuccess={() => dispatch(fetchTables({ page, pageSize }) as any)}
            />

            <AssignEmployeeModal
                isOpen={assignModalOpen}
                table={
                    tables.find(t => t.id === selectedTable?.id) ?? null
                }
                onClose={() => {
                    setAssignModalOpen(false);
                    setSelectedTable(null);
                }}
            />

            <Modal
                open={removeModalOpen}
                onCancel={() => {
                    setRemoveModalOpen(false);
                    setEmpToRemove(null);
                }}
                footer={null}
                centered
                closable={true}
                width={450}
                bodyStyle={{ padding: '10px 20px' }}
            >
                <div style={{ fontSize: '16px', fontWeight: "400", padding: '16px 0' }}>
                    <QuestionOutlined style={{
                        border: '2px solid #faad14',
                        borderRadius: '50%', color: '#faad14', fontSize: '12px', fontWeight: 'bold', textAlign: 'center', marginRight: '5px', padding: '5px'
                    }} />
                    Remove "{empToRemove?.name}" from {empToRemove?.tableName}?
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                    <Button
                        onClick={() => setRemoveModalOpen(false)}
                        style={{
                            height: '45px',
                            padding: '0 25px',
                            borderRadius: '8px',
                            backgroundColor: '#e8e8e8',
                            border: 'none',
                            fontSize: '16px'
                        }}
                    >
                        Cancel Operation
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleConfirmRemove}
                        style={{
                            height: '45px',
                            padding: '0 25px',
                            borderRadius: '8px',
                            backgroundColor: '#66bb6a',
                            borderColor: '#66bb6a',
                            fontSize: '16px'
                        }}
                    >
                        Confirm Remove
                    </Button>
                </div>
            </Modal>

            <DeleteModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title='table'
            />
        </div>
    );
};

export default Tables;