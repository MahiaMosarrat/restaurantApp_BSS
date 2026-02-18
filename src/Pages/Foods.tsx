import { useEffect, useState } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Tooltip, Spin, Button, Table, message } from 'antd';
import type { IFood } from "../features/foods/foodsSlice";
import { setPage, setPageSize } from '../features/foods/foodsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFood, fetchFoods, type IFoodsStore } from '../features/foods/foodsSlice';
import FoodModal from '../Components/FoodModal';
import DeleteModal from '../Components/DeleteModal';
import './Foods.css'
import type { ColumnsType } from 'antd/es/table';



const Foods = () => {
    const { foodsListData }: { foodsListData: IFoodsStore["foodsListData"] } = useSelector((state: any) => state.foods);
    const dispatch = useDispatch();

    const Image_Url = 'https://bssrms.runasp.net/images/food/';

    const { page, pageSize, total, foods, isLoading } = foodsListData;

    const [foodModalOpen, setFoodModalOpen] = useState(false);
    const [editingFood, setEditingFood] = useState<IFood | null>(null);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedFoodId, setSelectedFoodId] = useState<number | null>(null);

    // const [scrollX, setScrollX] = useState<string | number>('100%');

    // useEffect(() => {
    //     const handleResize = () => {
    //         if (window.innerWidth <= 824) {
    //             setScrollX(1200);
    //         } else {
    //             setScrollX('100%');
    //         }
    //     };

    //     handleResize();
    //     window.addEventListener('resize', handleResize);
    //     return () => window.removeEventListener('resize', handleResize);
    // }, []);

    useEffect(() => {
        dispatch(fetchFoods({ page, pageSize }) as any);
    }, [page, pageSize, dispatch]);

    const handleEditClick = (food: IFood) => {
        setEditingFood(food);
        setFoodModalOpen(true);
    };

    const handleAddClick = () => {
        setEditingFood(null);
        setFoodModalOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setSelectedFoodId(id);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedFoodId === null) return;

        try {
            await dispatch(deleteFood(selectedFoodId) as any);
            message.success("Food deleted successfully");
            dispatch(fetchFoods({ page, pageSize }) as any);
        } catch (err) {
            message.error("Delete failed");
        } finally {
            setDeleteModalOpen(false);
        }
    };

    const onPaginationChange = (currentPage: number, size: number) => {
        dispatch(setPage(currentPage));
        if (size !== pageSize) {
            dispatch(setPageSize(size));
        }
    }

    const columns: ColumnsType<IFood> = [
        {

            dataIndex: 'image',
            key: 'image',
            width: window.innerWidth < 576 ? 80 : 120,
            render: (imageName) => <div style={{ display: 'flex', justifyContent: 'center' }}><img src={imageName ? `${Image_Url}${imageName}` : 'https://placehold.co/50'} alt="food" className="table-food-img" /></div>,

        },
        {
            title: () => <Tooltip title="Food Name"><span>Name</span></Tooltip>,
            dataIndex: 'name',
            key: 'name',
            width: window.innerWidth < 576 ? 140 : 200,
            render: (text) =><div className="food-name-cell">
                <span className="food-name-text">
                    {text}
                </span>
            </div>
        },
        {
            title: () => <Tooltip title="Price"><span>Price</span></Tooltip>,
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: () => <Tooltip title="Discount Type"><span>Discount Type</span></Tooltip>,
            dataIndex: 'discountType',
            key: 'discountType',
        },
        {
            title: () => <Tooltip title="Discount Value"><span>Discount</span></Tooltip>,
            dataIndex: 'discount',
            key: 'discount',
        },
        {
            title: () => <Tooltip title="Final Price"><span>Discounted Price</span></Tooltip>,
            dataIndex: 'discountPrice',
            key: 'discountPrice',
        },
        {
            title: (
                <Tooltip title="Add New Food Item">
                    <Button
                        icon={<PlusOutlined />}
                        onClick={handleAddClick}
                        className="add-food-btn"
                    >
                        Add Food Item
                    </Button>
                </Tooltip>
            ),
            key: 'actions',
            width: 180,
            render: (_, record) => (
                <div className="action-btn-container">
                    <Tooltip title="Edit Food">
                        <button onClick={() => handleEditClick(record)} className="action-btn">
                            <EditOutlined />
                        </button>
                    </Tooltip>
                    <Tooltip title="Delete Food">
                        <button onClick={() => handleDeleteClick(record.id)} className="action-btn">
                            <DeleteOutlined />
                        </button>
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <div className="foods-main-wrapper">
            <div className="foods-container-card">
                <Table
                    columns={columns}
                    dataSource={foods}
                    rowKey="id"
                    loading={{ spinning: isLoading, indicator: <Spin size="small" /> }}
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        total: total,
                        position: ['bottomCenter'],
                        onChange: onPaginationChange,
                        showSizeChanger: true,
                        responsive: false,
                        pageSizeOptions: ['10', '20', '30', '40', '50'],
                        showTotal: (total, range) => (
                            <span className="pagination-total-text">
                                {range[0]}-{range[1]} of {total} 
                            </span>
                        ),
                        className: "custom-ant-pagination",

                    }}
                    tableLayout='fixed'
                   scroll={{ x: 1000, y: window.innerWidth < 768 ? undefined : 'calc(100vh - 350px)' }}
                    
                />
            </div>

            <FoodModal
                isOpen={foodModalOpen}
                initialData={editingFood}
                onClose={() => setFoodModalOpen(false)}
                onSuccess={() => dispatch(fetchFoods({ page, pageSize }) as any)}
            />
            <DeleteModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleConfirmDelete} title="food item" />
        </div>
    );


};

export default Foods;

