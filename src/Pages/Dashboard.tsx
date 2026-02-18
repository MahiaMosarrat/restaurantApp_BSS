

import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';
import { Layout, Avatar, Button, Dropdown, Modal } from 'antd';
import {
  IdcardOutlined, PieChartOutlined, PlusSquareOutlined,
  OrderedListOutlined, PoweroffOutlined, UserOutlined, MenuUnfoldOutlined,
  MenuFoldOutlined, LogoutOutlined,
  GroupOutlined
} from '@ant-design/icons';
import { useAuth } from '../state-context/auth-context';
import './Dashboard.css';

const { Header, Sider, Content, Footer } = Layout;

export default function Dashboard() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const [collapsed, setCollapsed] = useState(true);
  const [headerTitle, setHeaderTitle] = useState('Employee Management');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const { onLogout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: 'employees', label: 'Employees', icon: <IdcardOutlined /> },
    { path: 'tables', label: 'Tables', icon: <GroupOutlined /> },
    { path: 'foods', label: 'Foods', icon: <PieChartOutlined /> },
    { path: 'new-order', label: 'New Order', icon: <PlusSquareOutlined /> },
    { path: 'orders', label: 'Orders', icon: <OrderedListOutlined /> },
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 767);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const currentItem = menuItems.find(item => location.pathname.includes(item.path));
    if (currentItem) setHeaderTitle(`${currentItem.label} Management`);
  }, [location.pathname]);

  const dropItems = [
    {
      key: '1',
      label: 'Profile',
      icon: <UserOutlined style={{ color: '#66BB6A' }} />,
      onClick: () => setIsProfileModalOpen(true),
    },
    {
      key: '2',
      label: 'Logout',
      icon: <LogoutOutlined style={{ color: '#ff7043' }} />,
      onClick: onLogout,
    },
  ];

  return (
    <Layout className="vh-100">
      {/* SIDEBAR - Preserved exactly from your original */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={250}
        collapsedWidth={80}
        onMouseEnter={() => !isMobile && setCollapsed(false)}
        onMouseLeave={() => !isMobile && setCollapsed(true)}
        className={`sidebar-container ${isMobile ? 'mobile-hidden' : ''}`}
      >
        <div className="sidebar-flex-wrapper">
          <div className="top-section">
            <div className={`logo-container ${collapsed ? 'collapsed' : ''}`}>
              <img src="/chef_green.png" alt="logo" className="logo-img" />
              {!collapsed && <span className="logo-text">BSS RESTAURANT</span>}
            </div>
            <nav className="custom-menu">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!collapsed && <span className="nav-label">{item.label}</span>}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="bottom-section">
            <button onClick={onLogout} className={`logout-btn ${collapsed ? 'collapsed' : ''}`}>
              <PoweroffOutlined style={{ fontSize: '16px' }} />
              {!collapsed && <span className="logout-text" style={{ fontWeight: '800', color: '#444242' }}>Logout</span>}
            </button>
          </div>
        </div>
      </Sider>

      {/* RIGHT SIDE LAYOUT */}
      <Layout className="content-layout">
        <Header className="custom-header">
          <div className="header-content">
            <div className="header-left">
              {!isMobile && (
                <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                  className="toggle-btn"
                />
              )}
              <h2 className="header-title">{headerTitle}</h2>
            </div>

            <Dropdown menu={{ items: dropItems }} placement="bottomRight" arrow>
              <div className="user-profile-trigger">
                {!isMobile && (
                  <div className="user-info">
                    <p className="user-email">admin@mail.com</p>
                    <h3 className="user-name">Admin User</h3>
                  </div>
                )}
                <Avatar size={isMobile ? 50 : 60} icon={<UserOutlined />} className="user-avatar" />
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="main-content">
          <Outlet />
        </Content>

        <Footer className="mobile-footer">
          <nav className="mobile-bottom-nav">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="mobile-nav-icon">{item.icon}</span>
              </NavLink>
            ))}
          </nav>
        </Footer>
      </Layout>

      {/* Modal remains same */}
      {/* User Profile Modal */}
      <Modal
        title={
          <div className="modal-header-title">
            <UserOutlined /> User Profile
          </div>
        }
        open={isProfileModalOpen}
        onCancel={() => setIsProfileModalOpen(false)}
        footer={[
          <div className="modal-footer-container" key="footer">
            <Button
              key="close"
              type="primary"
              className="btn-close-modal"
              onClick={() => setIsProfileModalOpen(false)}
            >
              Close
            </Button>
          </div>
        ]}
        centered
        className="profile-modal-custom"
        width={700}
      >
        <div className="modal-body-wrapper">
          {/* The internal container with border-radius and shadow */}
          <div className="profile-inner-card-container">
            <div className="profile-avatar-box">
              <Avatar
                size={isMobile ? 120 : 140} // Decreased size as requested
                icon={<UserOutlined />}
                className="modal-large-avatar"
              />
            </div>

            <div className="profile-details-content">
              <div className="detail-item">
                <label>Full Name</label>
                <h3>Admin User</h3>
              </div>
              <div className="detail-item">
                <label>Email</label>
                <h3>admin@mail.com</h3>
              </div>
              <div className="detail-item">
                <label>Phone Number</label>
                <h3>01234567899</h3>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}