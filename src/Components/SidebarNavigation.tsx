

// import { IdcardOutlined, TableOutlined, PieChartOutlined, PlusSquareOutlined, OrderedListOutlined, PoweroffOutlined } from '@ant-design/icons';
// import { NavLink } from 'react-router';
// import { useAuth } from '../state-context/auth-context';

// interface SidebarProps {
//   isExpanded: boolean;
//   onPageChange: (label: string) => void;
// }

// const SidebarNavigation: React.FC<SidebarProps> = ({ isExpanded, onPageChange }) => {
//   const { auth, onLogout } = useAuth();

//   const menuItems = [
//     { path: 'employees', label: 'Employees', icon: <IdcardOutlined /> },
//     { path: 'tables', label: 'Tables', icon: <TableOutlined /> },
//     { path: 'foods', label: 'Foods', icon: <PieChartOutlined /> },
//     { path: 'new-order', label: 'New Order', icon: <PlusSquareOutlined /> },
//     { path: 'orders', label: 'Orders', icon: <OrderedListOutlined /> },
//   ];

//   const logoTextShadow = `#2e7d32 2px 0px 0px, #2e7d32 1.75px .95px 0px, #2e7d32 1.08px 1.68px 0px, #2e7d32 .14px 1.99px 0px, #2e7d32 -.83px 1.81px 0px, #2e7d32 -1.6px 1.19px 0px, #2e7d32 -1.97px .28px 0px, #2e7d32 -1.87px -.7px 0px, #2e7d32 -1.3px -1.51px 0px, #2e7d32 -.42px -1.95px 0px, #2e7d32 .56px -1.91px 0px, #2e7d32 1.41px -1.41px 0px, #2e7d32 1.92px -.55px 0px`;

//   return (
//     <aside 
//       className="flex flex-col h-full transition-all duration-300 ease-in-out shadow-xl z-50 overflow-hidden"
//       style={{ 
//         width: isExpanded ? '260px' : '80px', 
//         backgroundColor: '#388e3c' 
//       }}
//     >
//       {/* Brand Header: Logo and Title */}
//       <div className="flex flex-col items-center justify-center pt-4 mb-4" style={{ height: '100px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
//         <img src="/chef_green.png" alt="Logo" style={{ height: '48px', width: 'auto' }} />
//         {isExpanded && (
//           <span className="text-[14px] font-bold text-white mt-2 whitespace-nowrap" style={{ textShadow: logoTextShadow, letterSpacing: '1px' }}>
//             BSS RESTAURANT
//           </span>
//         )}
//       </div>

//       <nav className="flex-1 w-full mt-2">
//         <ul className="p-0 m-0 list-none">
//           {menuItems.map((item) => (
//             <li key={item.path} className="mb-2 w-full flex justify-end">
//               <NavLink
//                 to={item.path}
//                 onClick={() => onPageChange(item.label + " Management")}
//                 className="transition-all duration-300 no-underline"
//                 style={({ isActive }) => ({
//                   height: '52px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   // The Pill active state design
//                   width: isExpanded ? 'calc(100% - 12px)' : (isActive ? 'calc(100% - 12px)' : '100%'),
//                   justifyContent: isExpanded ? 'flex-start' : 'center',
//                   paddingLeft: isExpanded ? '24px' : '0',
//                   backgroundColor: isActive ? '#e8f5e9' : 'transparent',
//                   color: isActive ? '#388e3c' : '#fff',
//                   borderRadius: isExpanded || isActive ? '26px 0 0 26px' : '0',
//                 })}
//               >
//                 <span className="flex items-center justify-center" style={{ fontSize: '20px' }}>
//                   {item.icon}
//                 </span>
//                 {isExpanded && (
//                   <span className="ml-4 font-semibold whitespace-nowrap">
//                     {item.label}
//                   </span>
//                 )}
//               </NavLink>
//             </li>
//           ))}
//         </ul>
//       </nav>

//       {/* Logout Button: Bottom Aligned */}
//       <div className="pb-8 px-4 w-full flex justify-center">
//         {auth && (
//           <button 
//             onClick={() => onLogout()}
//             className="flex items-center justify-center border-none shadow-md cursor-pointer transition-all duration-300"
//             style={{ 
//               backgroundColor: '#e8f5e9', 
//               height: '52px', 
//               width: isExpanded ? '100%' : '52px', 
//               borderRadius: '10px', 
//               color: '#333', 
//               fontWeight: 600 
//             }}
//           >
//             <PoweroffOutlined style={{ fontSize: '20px' }} />
//             {isExpanded && <span className="ml-3">Logout</span>}
//           </button>
//         )}
//       </div>
//     </aside>
//   );
// };

// export default SidebarNavigation;