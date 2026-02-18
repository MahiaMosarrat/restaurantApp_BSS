
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Modal, Select, Space, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchTables } from "../features/tables/tablesSlice";
import { getHeaders } from "../features/foods/foodsSlice";
import { fetchEmployees } from "../features/employees/employeesSlice";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  table: {
    id: number;
    tableNumber: string;
    numberOfSeats: number;
    image: string;
  } | null;
}

interface AvailableEmployee {
  id: string;         
  employeeId?: string; 
  name?: string;
  user?: {
    fullName: string;
    image?: string;
  };
}

const AssignEmployeeModal: React.FC<Props> = ({ isOpen, onClose, table }) => {
const dispatch = useDispatch();
const { employees: allEmployees } = useSelector((state: any) => state.employees.employeeListData);
  const { page, pageSize } = useSelector(
    (state: any) => state.tables.tableListData
  );

  const [availableEmployees, setAvailableEmployees] = useState<AvailableEmployee[]>([]);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const USER_IMAGE_URL = "https://bssrms.runasp.net/images/user/";
  const TABLE_IMAGE_URL = "https://bssrms.runasp.net/images/table/";

  useEffect(() => {
    dispatch(fetchEmployees({ page: 1, pageSize: 1000 }) as any);
  }, [dispatch]);

  useEffect(() => {
    if (!isOpen || !table?.id) return;

    axios
      .get(
        `https://bssrms.runasp.net/api/Employee/non-assigned-employees/${table.id}`,
        getHeaders()
      )
      .then(res => {
        setAvailableEmployees(res.data ?? []);
        setSelectedEmployeeIds([]);
      })
      .catch(() => {
        setAvailableEmployees([]);
      });
  }, [isOpen, table?.id]);


  useEffect(() => {
    if (!isOpen || !table?.id) return;

    setLoading(true);
    axios
      .get(
        `https://bssrms.runasp.net/api/Employee/non-assigned-employees/${table.id}`,
        getHeaders()
      )
      .then((res) => {
        setAvailableEmployees(res.data ?? []);
        setSelectedEmployeeIds([]);
      })
      .catch(() => setAvailableEmployees([]))
      .finally(() => setLoading(false));
  }, [isOpen, table?.id]);

  const handleAssign = async () => {
    if (!table || selectedEmployeeIds.length === 0) return;

    setLoading(true);

    // Send a direct array as expected by the System.Collections.Generic.List backend type
    const payload = selectedEmployeeIds.map(id => ({
      employeeId: id, 
      tableId: table.id,
    }));

    try {
      await axios.post(
        "https://bssrms.runasp.net/api/EmployeeTable/create-range",
        payload, // Send the array directly, NO '{ dtos: ... }' wrapper
        getHeaders()
      );

      message.success("Employees assigned successfully");
      dispatch(fetchTables({ page, pageSize }) as any);
      onClose();
    } catch (error) {
      message.error("Failed to assign employees. Please check employee selection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <span style={{ fontWeight: 600 }}>
          <UserOutlined /> Assign Employee
        </span>
      }
      open={isOpen}
      onCancel={onClose}
      width={550}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleAssign}
          style={{ backgroundColor: "#66bb6a", borderColor: "#66bb6a" }}
        >
          Assign Employee
        </Button>,
      ]}
    >
      <p>
        <strong>Table Number:</strong> {table?.tableNumber}
      </p>
      <p>
        <strong>Number of Seats:</strong> {table?.numberOfSeats}
      </p>
      <div style={{ marginBottom: 16, textAlign: 'center' }}>
        <img
          src={`${TABLE_IMAGE_URL}${table?.image}`}
          alt="table"
          style={{ width: 100, borderRadius: 8 }}
        />
      </div>

      <Select
        mode="multiple"
        style={{ width: "100%" }}
        placeholder="Select employees"
        value={selectedEmployeeIds}
        onChange={setSelectedEmployeeIds}
        optionLabelProp="label"
        filterOption={(input, option) =>
          String(option?.label ?? "")
            .toLowerCase()
            .includes(input.toLowerCase())
        }
      >

        {availableEmployees.map((emp) => {
          const actualId = emp.id || emp.employeeId;

          const fullEmpInfo = allEmployees.find((e:any) => e.id === actualId);

          // const displayName = emp.user?.fullName || emp.name || "Unknown";
          const displayName = emp.name || fullEmpInfo?.user?.fullName || "Unknown";
          const imagePath = fullEmpInfo?.user?.image;


          return (
            <Select.Option
              key={actualId}
              value={actualId} 
              label={displayName}
            >
              <Space>
                <Avatar
                  size="small"
                  src = {imagePath ? `${USER_IMAGE_URL}${imagePath}` : undefined}
                  // src={emp.user?.image ? `${USER_IMAGE_URL}${emp.user.image}` : undefined}
                  icon={<UserOutlined />}
                />
                {displayName}
              </Space>
            </Select.Option>
          );
        })}
      </Select>
    </Modal>
  );
};

export default AssignEmployeeModal;

