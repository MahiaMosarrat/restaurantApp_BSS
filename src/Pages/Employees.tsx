import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { ColumnsType } from 'antd/es/table';
import {
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  StarFilled
} from '@ant-design/icons';
import { Spin, Button, Table, Tooltip } from 'antd';

import {
  fetchEmployees,
  deleteEmployee,
  setPage,
  setPageSize
} from '../features/employees/employeesSlice';
import type { IEmployee } from '../features/employees/employeesSlice';
import EmployeeModal from '../Components/EmployeeModal';
import DeleteModal from '../Components/DeleteModal';
import './Employee.css';

const Employees: React.FC = () => {
  const dispatch = useDispatch();
  const { page, pageSize, total, employees, isLoading } = useSelector((state: any) => state.employees.employeeListData);

  const [employeeModalOpen, setEmployeeModalOpen] = React.useState(false);
  const [editingEmployee, setEditingEmployee] = React.useState<IEmployee | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = React.useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchEmployees({ page, pageSize }) as any);
  }, [page, pageSize, dispatch]);

  const onPaginationChange = (currentPage: number, size: number) => {
    dispatch(setPage(currentPage));
    if (size !== pageSize) {
      dispatch(setPageSize(size));
    }
  };

  const handleEditClick = (employee: IEmployee) => {
    setEditingEmployee(employee);
    setEmployeeModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedEmployeeId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmployeeId) return;
    dispatch(deleteEmployee(selectedEmployeeId) as any);
    setDeleteModalOpen(false);
  };

  const columns: ColumnsType<IEmployee> = [
    {
      title: '',
      key: 'avatar',
      width: 120,
      className: 'column-avatar',
      render: (_, record) => {
        const avatarUrl = record.user?.image
          ? `https://bssrms.runasp.net/images/user/${record.user.image}`
          : `https://ui-avatars.com/api/?name=${record.user?.firstName}&background=random`;
        return (
          <div className="avatar-container-cell">
            <img src={avatarUrl} className="table-employee-img" alt="avatar" />
          </div>
        );
      },
    },
    {
      title: () => <Tooltip title=" Name"><span>Name</span></Tooltip>,
      key: 'name',
      ellipsis: true,
      width: 'auto',
      render: (_, record) => (
        <div className="employee-name-cell">
          <span className="employee-name-text">
            {record.user?.firstName} {record.user?.lastName}
          </span>
          <StarFilled className="employee-name-star" />
        </div>
      ),
    },
    { title: () => <Tooltip title="Email"><span>Email</span></Tooltip>, ellipsis: true, width: 'auto', render: (_, record) => record.user?.email },
    { title: () => <Tooltip title="Designation "><span>Designation </span></Tooltip>, width: 'auto', ellipsis: true, dataIndex: 'designation' },
    { title: () => <Tooltip title="Join Date"><span>Join Date</span></Tooltip>, width: 'auto', ellipsis: true, dataIndex: 'joinDate', render: (date) => date?.split('T')[0] },
    { title: () => <Tooltip title="Phone"><span>Phone</span></Tooltip>, width: 'auto', ellipsis: true, render: (_, record) => record.user?.phoneNumber },
    {
      title: (
        <Tooltip title="Add New Employee">
          <Button
            icon={<UserAddOutlined />}
            onClick={() => { setEditingEmployee(null); setEmployeeModalOpen(true); }}
            className="add-employee-btn"
          >
            Add Employee
          </Button>
        </Tooltip>
      ),
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <div className="employee-action-container">
          <Tooltip title="Edit Employee">
            <button onClick={() => handleEditClick(record)} className="employee-action-btn edit">
              <EditOutlined />
            </button>
          </Tooltip>

          <Tooltip title="Delete Employee">
            <button onClick={() => handleDeleteClick(record.id)} className="employee-action-btn delete">
              <DeleteOutlined />
            </button>
          </Tooltip>

        </div>
      ),
    },
  ];

  return (
    <div className="employees-main-wrapper">
      <div className="employees-container-card">
        <Table
          columns={columns}
          dataSource={employees}
          rowKey="id"
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
                {range[0]}-{range[1]} of {total}
              </span>
            ),
            className: "custom-ant-pagination",
          }}
          tableLayout="fixed"
          scroll={{ x: '768px', y: 'calc(100vh - 350px)' }}
        />
      </div>

      <EmployeeModal
        isOpen={employeeModalOpen}
        initialData={editingEmployee}
        onClose={() => setEmployeeModalOpen(false)}
        onSuccess={() => {
          if (page === 1) {
            dispatch(fetchEmployees({ page: 1, pageSize }) as any);
          } else {
            dispatch(setPage(1));
          }
        }}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="employee"
      />
    </div>
  );
};

export default Employees;