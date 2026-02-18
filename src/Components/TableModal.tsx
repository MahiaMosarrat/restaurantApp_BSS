import { CloseOutlined, DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Tooltip, Spin } from "antd";
import type React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createTables, fetchTables, updateTables } from "../features/tables/tablesSlice";
import ReactDOM from "react-dom";
import './TableModal.css';

interface TableModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any;
}

const TableModal: React.FC<TableModalProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState<any>({ tableNumber: "", numberOfSeats: 0, image: "", base64: "" });
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showFullImage, setShowFullImage] = useState(false);

    const Image_Url = 'https://bssrms.runasp.net/images/table/';


    useEffect(() => {
        if (isOpen) {
            dispatch(fetchTables({ page: 1, pageSize: 100 }) as any);
        }
    }, [isOpen, dispatch]);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({ ...initialData });
                setImagePreview(initialData.image ? `${Image_Url}${initialData.image}` : null);
            } else {
                setFormData({ tableNumber: '', numberOfSeats: 0, image: "", base64: "" });
                setImagePreview(null);
            }
            setErrors({});
        }
    }, [initialData, isOpen]);

    const validate = (name: string, value: any) => {
        let error = "";
        if (['tableNumber', 'numberOfSeats'].includes(name) && (!value || value.toString().trim() === "" || value === 0)) {
            error = "This field is required!";
        }
        setErrors((prev: any) => ({ ...prev, [name]: error }));
    };

    const handleInputChange = (name: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
        validate(name, value);
    };

    const isFormValid = () => {
        return formData.tableNumber !== "" && formData.numberOfSeats > 0 && Object.values(errors).every(err => err === "");
    };

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
            if (!initialData?.id) await dispatch(createTables(formData) as any);
            else await dispatch(updateTables({ ...formData, id: initialData.id }) as any);
            onSuccess();
            onClose();
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="tm-overlay" onClick={onClose}>
            <div className="tm-container" onClick={(e) => e.stopPropagation()}>
                <div className="tm-header">
                    <div className="tm-header-title">
                        {initialData ? <EditOutlined className="title-icon" /> : <PlusCircleOutlined className="title-icon" />}
                        {initialData ? 'Edit Table' : 'Add New Table'}
                    </div>
                    <CloseOutlined className="tm-close-btn" onClick={onClose} />
                </div>

                <div className="tm-body">
                    <div className="tm-top-grid">
                        <div className="tm-left-inputs">
                            <div className="tm-field-group">
                                <label className="tm-label">
                                    <span className="tm-required">*</span> Table Number
                                </label>
                                <input
                                    className={`tm-input ${errors.tableNumber ? 'input-error' : ''}`}
                                    value={formData.tableNumber}
                                    onChange={e => handleInputChange("tableNumber", e.target.value)}
                                    placeholder="Table Number"
                                />
                                {errors.tableNumber && <div className="error-text">{errors.tableNumber}</div>}
                            </div>

                            <div className="tm-field-group">
                                <label className="tm-label">
                                    <span className="tm-required">*</span> Number of Seats
                                </label>
                                <input
                                    type="number"
                                    className={`tm-input ${errors.numberOfSeats ? 'input-error' : ''}`}
                                    placeholder="Number of Seats in the table"
                                    value={formData.numberOfSeats || ''}
                                    onChange={e => handleInputChange("numberOfSeats", e.target.value)}
                                />
                                {errors.numberOfSeats && <div className="error-text">{errors.numberOfSeats}</div>}
                            </div>
                        </div>

                        <div className="tm-dashed-zone">
                            {!imagePreview ? (
                                <label className="tm-upload-dashed-box">

                                    <div className="upload-inner-container">
                                        <div className="upload-plus-large">+</div>
                                        <div className="upload-instruction-text">Upload Table Image</div>
                                    </div>
                                    <input type="file" hidden onChange={handleFileUpload} />
                                </label>
                            ) : (
                                <div className="tm-preview-card">
                                    <img src={imagePreview} alt="Table" />
                                    <div className="tm-mask-overlay">
                                        <Tooltip title="Preview"><EyeOutlined onClick={() => setShowFullImage(true)} /></Tooltip>
                                        <Tooltip title="Delete"><DeleteOutlined onClick={() => { setImagePreview(null); setFormData({ ...formData, image: "", base64: "" }); }} /></Tooltip>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="tm-footer">
                    <button className="tm-btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="tm-btn-submit" onClick={handleSubmit} disabled={!isFormValid() || loading}>
                        {loading ? <Spin size="small" /> : (initialData ? 'Update Table' : 'Add New Table')}
                    </button>
                </div>
            </div>

            {showFullImage && (
                <div className="tm-full-view" onClick={() => setShowFullImage(false)}>
                    <img src={imagePreview!} className="tm-large-preview-img" alt="Full View" />
                </div>
            )}
        </div>,
        document.body
    );
}

export default TableModal;