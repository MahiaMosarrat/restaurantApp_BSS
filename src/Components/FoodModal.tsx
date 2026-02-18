import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CloseOutlined, UploadOutlined, EyeOutlined, DeleteOutlined, PlusCircleOutlined, EditOutlined } from '@ant-design/icons';
import { message, Tooltip } from 'antd';
import { useDispatch } from 'react-redux';
import { createFood, updateFood } from '../features/foods/foodsSlice';
import './FoodModal.css';

interface FoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

const FoodModal: React.FC<FoodModalProps> = ({ isOpen, onClose, onSuccess, initialData }) => {

  const [formData, setFormData] = useState<any>({ name: '', description: '', price: '', discountType: 'None', discount: '', image: "", base64: "" });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showFullImage, setShowFullImage] = useState(false);

  const Image_Url = 'https://bssrms.runasp.net/images/food/';
  const dispatch = useDispatch();

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        ...initialData,
        // Ensure numerical fields aren't empty strings
        discount: initialData.discount ?? 0,
        price: initialData.price ?? 0
      });
      setImagePreview(initialData.image ? `${Image_Url}${initialData.image}` : null);
    } else if (isOpen) {
      setFormData({
        name: '',
        description: '',
        price: '',
        discountType: 'None',
        discount: 0, // Set to 0 instead of ''
        image: "",
        base64: ""
      });
      setImagePreview(null);
    }
    setErrors({});
  }, [initialData, isOpen]);

  // CHANGE: Added validation logic
  const validate = (name: string, value: any) => {
    let error = "";
    if (['name', 'description', 'price'].includes(name) && (!value || value.toString().trim() === "")) {
      error = "This field is required!";
    }
    setErrors((prev: any) => ({ ...prev, [name]: error }));
  };

const handleInputChange = (name: string, value: any) => {
    // Convert to number for specific fields to ensure calculation works
    const finalValue = (name === 'price' || name === 'discount') ? (value === "" ? "" : Number(value)) : value;
    
    setFormData((prev: any) => ({ ...prev, [name]: finalValue }));
    validate(name, value);
};

  // CHANGE: Boolean check for button disabling
  const isFormValid = () => {
    const required = ['name', 'description', 'price'];
    const allFilled = required.every(k => formData[k] !== null && formData[k] !== '');
    const noErrors = Object.values(errors).every(err => err === "");
    return allFilled && noErrors;
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
        // Construct a FLAT object matching the Swagger Schema in Image 17
        const payload = {
            id: initialData?.id || 0,
            name: formData.name,
            description: formData.description,
            price: Number(formData.price) || 0,
            discountType: formData.discountType,
            discount: Number(formData.discount) || 0,
            image: formData.image || "",
            base64: formData.base64 || ""
        };

        console.log("Final Payload being sent:", payload);

        if (!initialData?.id) {
            // Send payload directly - NO { dto: payload } wrapper
            await dispatch(createFood(payload) as any);
        } else {
            await dispatch(updateFood(payload) as any);
        }
        
        onSuccess();
        onClose();
    } catch (error) {
        console.error("Submission failed:", error);
        message.error("Failed to save food item.");
    } finally {
        setLoading(false);
    }
};

  const discountedPrice = formData.discountType === 'Flat'
    ? (Number(formData.price) || 0) - (Number(formData.discount) || 0)
    : formData.discountType === 'Percentage'
      ? (Number(formData.price) || 0) - ((Number(formData.price) || 0) * (Number(formData.discount) || 0)) / 100
      : (Number(formData.price) || 0);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fm-overlay">
      <div className="fm-container">
        <div className="fm-header">
          <div className="fm-header-title">
            {initialData ? <EditOutlined className="title-icon" /> : <PlusCircleOutlined className="title-icon" />}
            {initialData ? 'Update Food Item' : 'Add New Food Item'}
          </div>
          <CloseOutlined className="fm-close-btn" onClick={onClose} />
        </div>

        <div className="fm-body">
          <div className="fm-top-grid">
            <div className="fm-left-inputs">
              <div className="fm-field">
                <label className="fm-label"><span className="fm-required">*</span> Food Name</label>

                <input className={`fm-input ${errors.name ? 'input-error' : ''}`} value={formData.name} onChange={e => handleInputChange("name", e.target.value)} placeholder="Food Name" />
                {errors.name && <div className="error-text">{errors.name}</div>}
              </div>
              <div className="fm-field">
                <label className="fm-label"><span className="fm-required">*</span> Description</label>
                <textarea className={`fm-textarea ${errors.description ? 'input-error' : ''}`} value={formData.description} onChange={e => handleInputChange("description", e.target.value)} placeholder="Description" />
                {errors.description && <div className="error-text">{errors.description}</div>}
              </div>
            </div>

            <div className="fm-dashed-zone">
              {!imagePreview ? (
                <label className="fm-upload-dashed-box">
                  <UploadOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
                  <div> Upload Food Image</div>
                  <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
                </label>
              ) : (
                <div className="fm-preview-card">
                  <img src={imagePreview} alt="Food" />
                  <div className="fm-mask-overlay">
                    <Tooltip title="Preview"><EyeOutlined onClick={() => setShowFullImage(true)} /></Tooltip>
                    <Tooltip title="Delete"><DeleteOutlined onClick={() => { setImagePreview(null); setFormData({ ...formData, image: "", base64: "" }); }} /></Tooltip>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="fm-bottom-pricing">
            <div className="fm-field">
              <label className="fm-label"><span className="fm-required">*</span> Price</label>
              <input type="number" className={`fm-input ${errors.price ? 'input-error' : ''}`} value={formData.price} onChange={e => handleInputChange("price", e.target.value)} />
              {errors.price && <div className="error-text">{errors.price}</div>}
            </div>
            <div className="fm-field">
              <label className="fm-label">Select Discount Type</label>
              <select className="fm-select" value={formData.discountType} onChange={e => setFormData({ ...formData, discountType: e.target.value })}>
                <option value="None">None</option>
                <option value="Flat">Flat</option>
                <option value="Percentage">Percentage</option>
              </select>
            </div>
            <div className="fm-field">
              <label className="fm-label">Discount In</label>
              <input type="number" className="fm-input" value={formData.discount} onChange={e => setFormData({ ...formData, discount: e.target.value })} placeholder="0" disabled={formData.discountType === 'None'} />
            </div>
            <div className="fm-field">
              <label className="fm-label">Discounted Price</label>
              <input type="number" className="fm-input fm-disabled" value={discountedPrice} disabled />
            </div>
          </div>
        </div>

        <div className="fm-footer">
          <button className="fm-btn-cancel" onClick={onClose}>Cancel</button>

          <button
            className="fm-btn-submit"
            onClick={handleSubmit}
            disabled={loading || !isFormValid()}
            style={{ opacity: !isFormValid() ? 0.6 : 1, cursor: !isFormValid() ? 'not-allowed' : 'pointer' }}
          >
            {initialData ? 'Update Food Item' : 'Add New Food Item'}
          </button>
        </div>
      </div>

      {showFullImage && (
        <div className="fm-full-view" onClick={() => setShowFullImage(false)}>
          <img src={imagePreview!} className="fm-large-preview-img" alt="Full View" />
        </div>
      )}
    </div>,
    document.body
  );
};

export default FoodModal;