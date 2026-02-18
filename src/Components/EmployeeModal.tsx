

import React, { useEffect, useState } from 'react';
import { Modal, Spin, DatePicker, Select, Tooltip } from 'antd';
import { CloseOutlined, DeleteOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { createEmployee, updateEmployee } from '../features/employees/employeesSlice';
import './EmployeeModal.css';
import { Form } from 'react-bootstrap';

interface EmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
    const [formData, setFormData] = useState<any>({
        firstName: '', middleName: '', lastName: '', designation: '',
        joinDate: '', email: '', phoneNumber: '', fatherName: '',
        motherName: '', spouseName: '', dob: '', nid: '',
        genderId: null, image: "", base64: ""
    });
    const [errors, setErrors] = useState<any>({});

    const IMAGE_BASE_URL = 'https://bssrms.runasp.net/images/';
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showFullImage, setShowFullImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (initialData && isOpen) {

            setFormData({
                id: initialData.id,
                designation: initialData.designation,
                joinDate: initialData.joinDate,
                fatherName: initialData.fatherName,
                motherName: initialData.motherName,
                spouseName: initialData.spouseName,
                firstName: initialData.user?.firstName || '',
                middleName: initialData.user?.middleName || '',
                lastName: initialData.user?.lastName || '',
                email: initialData.user?.email || '',
                phoneNumber: initialData.user?.phoneNumber || '',
                dob: initialData.user?.dob || '',
                nid: initialData.user?.nid || '',
                genderId: initialData.user?.genderId,
            });
            if (initialData.user?.image) {
                // Check if the image already has the user/ prefix or is a full URL
                const imageName = initialData.user.image;
                const fullImageUrl = imageName.startsWith('http')
                    ? imageName
                    : `${IMAGE_BASE_URL}user/${imageName}`; // Added 'user/' based on standard API paths

                setImagePreview(fullImageUrl);
            } else {
                setImagePreview(null);
            }
        } else if (isOpen) {
            setFormData({
                firstName: '', middleName: '', lastName: '', designation: '',
                joinDate: '', email: '', phoneNumber: '', fatherName: '',
                motherName: '', spouseName: '', dob: '', nid: '',
                genderId: null, image: "", base64: ""
            });
            setImagePreview(null);
        }
    }, [initialData, isOpen]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => setFormData({ ...formData, image: file.name, base64: reader.result as string });
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // CONSTRUCT FLAT PAYLOAD (Matches Swagger Schema)
            const payload = {
                designation: formData.designation,
                joinDate: formData.joinDate,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                firstName: formData.firstName,
                middleName: formData.middleName || "",
                lastName: formData.lastName,
                fatherName: formData.fatherName,
                motherName: formData.motherName,
                spouseName: formData.spouseName,
                dob: formData.dob,
                nid: formData.nid,
                genderId: Number(formData.genderId), // Must be a number
                image: formData.image || "",
                base64: formData.base64 || ""
            };

            if (!initialData?.id) {
                // Create
                await dispatch(createEmployee(payload) as any);
            } else {
                // Update - If your API needs the ID in the body as well:
                await dispatch(updateEmployee({ ...payload, id: initialData.id }) as any);
            }

            onSuccess(); // This triggers the refresh in Employees.tsx
            onClose();
        } catch (err) {
            console.error("API Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (name: string, value: any) => {
        if (name === 'phoneNumber') {
            const cleaned = value.replace(/\D/g, ''); 
            if (cleaned.length > 11) return; 
            value = cleaned;
        }

        setFormData((prev: any) => ({ ...prev, [name]: value }));

        let error = "";
        const requiredFields = ['firstName', 'lastName', 'spouseName', 'fatherName', 'motherName', 'designation', 'email', 'phoneNumber', 'genderId', 'dob', 'joinDate', 'nid'];

        if (requiredFields.includes(name) && (!value || value.toString().trim() === "")) {
            error = "This field is required!"; //
        } else if (name === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
            error = "Enter a valid email address!"; //
        }else if (name === 'phoneNumber') {
        if (!/^\d+$/.test(value)) {
            error = "Enter a valid phone number!";
        } else if (value.length !== 11) {
            error = "Phone number must be exactly 11 digits!";
        }
    }

        setErrors((prev: any) => ({ ...prev, [name]: error }));
    };

    const isFormValid = () => {
        const requiredFields = ['firstName', 'lastName', 'spouseName', 'fatherName', 'motherName', 'designation', 'email', 'phoneNumber', 'genderId', 'dob', 'joinDate', 'nid'];

        const allFilled = requiredFields.every(k => formData[k] !== null && formData[k] !== '');

        const noErrors = Object.values(errors).every(err => err === "" || err === null);

        return allFilled && noErrors;
    };

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={window.innerWidth > 796 ? "80vw" : "100vw"}
            centered
            className="employee-final-modal"
            title={<div className="modal-header-container"><UserOutlined /> {initialData ? 'Update Employee' : 'Add New Employee'}</div>}
            closeIcon={<CloseOutlined />}
        >
            <div className="modal-form-wrapper">
                <div className="form-grid-top">
                    <div className="inputs-column">
                        <Form.Group className="form-group-item">
                            <Form.Label><span className="req">*</span> First Name</Form.Label>
                            <Form.Control
                                isInvalid={!!errors.firstName} // Turns red if error exists
                                value={formData.firstName}
                                onChange={e => handleInputChange("firstName", e.target.value)}
                                placeholder="First Name"
                            />
                            <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="form-group-item">
                            <Form.Label>Middle Name</Form.Label>
                            <Form.Control
                                value={formData.middleName}
                                onChange={e => setFormData({ ...formData, middleName: e.target.value })}
                                placeholder="Middle Name"
                            />
                        </Form.Group>

                        <Form.Group className="form-group-item">
                            <Form.Label><span className="req">*</span> Last Name</Form.Label>
                            <Form.Control
                                isInvalid={!!errors.lastName}
                                value={formData.lastName}
                                onChange={e => handleInputChange("lastName", e.target.value)}
                                placeholder="Last Name"
                            />
                            <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                        </Form.Group>
                    </div>

                    <div className="image-column-large">
                        <div className="upload-zone-wrapper">
                            {!imagePreview ? (
                                <label className="upload-placeholder-dashed">
                                    <div className="upload-inner-content">
                                        <div className="upload-icon-plus">+</div>
                                        <div className="upload-instruction">Upload Employee Image</div>
                                    </div>
                                    <input type="file" hidden onChange={handleFileUpload} />
                                </label>
                            ) : (
                                <div className="upload-placeholder-dashed">
                                    <div className="employee-preview-card">
                                        <img src={imagePreview} alt="Employee" className="img-card-fit" />
                                        <div className="employee-mask-overlay">
                                            <Tooltip title="Preview"><EyeOutlined onClick={() => setShowFullImage(true)} /></Tooltip>
                                            <Tooltip title="Delete"><DeleteOutlined onClick={() => { setImagePreview(null); setFormData({ ...formData, image: '', base64: '' }); }} /></Tooltip>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="form-row-grid grid-3">
                    <Form.Group className="form-group-item">
                        <Form.Label><span className="req">*</span> Spouse Name</Form.Label>
                        <Form.Control isInvalid={!!errors.spouseName} value={formData.spouseName} onChange={e => handleInputChange("spouseName", e.target.value)} placeholder="Spouse Name" />
                        <Form.Control.Feedback type="invalid">{errors.spouseName}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="form-group-item">
                        <Form.Label><span className="req">*</span> Father's Name</Form.Label>
                        <Form.Control isInvalid={!!errors.fatherName} value={formData.fatherName} onChange={e => handleInputChange("fatherName", e.target.value)} placeholder="Father's Name" />
                        <Form.Control.Feedback type="invalid">{errors.fatherName}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="form-group-item">
                        <Form.Label><span className="req">*</span> Mother's Name</Form.Label>
                        <Form.Control isInvalid={!!errors.motherName} value={formData.motherName} onChange={e => handleInputChange("motherName", e.target.value)} placeholder="Mother's Name" />
                        <Form.Control.Feedback type="invalid">{errors.motherName}</Form.Control.Feedback>
                    </Form.Group>
                </div>

                <div className="form-row-grid grid-3">
                    <Form.Group className="form-group-item">
                        <Form.Label><span className="req">*</span> Designation</Form.Label>
                        <Form.Control isInvalid={!!errors.designation} value={formData.designation} onChange={e => handleInputChange("designation", e.target.value)} placeholder="Designation" />
                        <Form.Control.Feedback type="invalid">{errors.designation}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="form-group-item">
                        <Form.Label><span className="req">*</span> Email Address</Form.Label>
                        <Form.Control isInvalid={!!errors.email} value={formData.email} onChange={e => handleInputChange("email", e.target.value)} placeholder="Email Address" />
                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="form-group-item">
                        <Form.Label><span className="req">*</span> Phone Number</Form.Label>
                        <Form.Control isInvalid={!!errors.phoneNumber} value={formData.phoneNumber} onChange={e => handleInputChange("phoneNumber", e.target.value)} placeholder="Phone Number" maxLength={11}/>
                        <Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>
                    </Form.Group>
                </div>

                <div className="form-row-grid grid-4">
                    <div className="form-group-item">
                        <label><span className="req">*</span> Gender</label>
                        <Select
                            status={errors.genderId ? "error" : ""}
                            placeholder="Select Gender"
                            value={formData.genderId}
                            onChange={v => handleInputChange("genderId", v)}
                            className="full-width-control"
                        >
                            <Select.Option value={1}>Male</Select.Option>
                            <Select.Option value={2}>Female</Select.Option>
                            <Select.Option value={3}>Other</Select.Option>
                        </Select>
                        {errors.genderId && <div className="error-text">{errors.genderId}</div>}
                    </div>
                    <div className="form-group-item">
                        <label><span className="req">*</span> Date of Birth</label>
                        <DatePicker
                            status={errors.dob ? "error" : ""}
                            value={formData.dob ? dayjs(formData.dob) : null}
                            onChange={d => handleInputChange("dob", d?.toISOString())}
                            className="full-width-control"
                        />
                        {errors.dob && <div className="error-text">{errors.dob}</div>}
                    </div>
                    <div className="form-group-item">
                        <label><span className="req">*</span> Date of Join</label>
                        <DatePicker
                            status={errors.joinDate ? "error" : ""}
                            value={formData.joinDate ? dayjs(formData.joinDate) : null}
                            onChange={d => handleInputChange("joinDate", d?.toISOString())}
                            className="full-width-control"
                        />
                        {errors.joinDate && <div className="error-text">{errors.joinDate}</div>}
                    </div>
                    <Form.Group className="form-group-item">
                        <Form.Label><span className="req">*</span> NID Card Number</Form.Label>
                        <Form.Control isInvalid={!!errors.nid} value={formData.nid} onChange={e => handleInputChange("nid", e.target.value)} placeholder="NID Number" />
                        <Form.Control.Feedback type="invalid">{errors.nid}</Form.Control.Feedback>
                    </Form.Group>
                </div>

                <div className="modal-footer-action-bar">
                    <button className="btn-secondary" onClick={onClose}>Cancel</button>

                    <button
                        className="btn-primary-green"
                        onClick={handleSubmit}
                        disabled={loading || !isFormValid()}
                        style={{ opacity: !isFormValid() ? 0.6 : 1, cursor: !isFormValid() ? 'not-allowed' : 'pointer' }}
                    >
                        {loading ? <Spin size="small" /> : (initialData ? 'Update Employee' : 'Add New Employee')}
                    </button>
                </div>
            </div>

            {showFullImage && (
                <div className="fm-full-view" onClick={() => setShowFullImage(false)}>
                    <img src={imagePreview!} className="fm-large-preview-img" alt="Full View" />
                </div>
            )}

        </Modal>
    );
};

export default EmployeeModal;