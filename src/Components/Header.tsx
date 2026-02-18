
// import { UserOutlined, LogoutOutlined, MenuUnfoldOutlined, ProfileOutlined } from '@ant-design/icons';

// interface HeaderProps {
//   activeTitle: string;
//   onToggleSidebar: () => void;
// }

// const Header: React.FC<HeaderProps> = ({ activeTitle, onToggleSidebar }) => {
//   return (
//     <header className='bg-white h-[80px] px-6 flex items-center shadow-sm border-b border-gray-100'>
//       <div className="flex justify-between items-center w-full">

//         <div className="flex flex-row items-center gap-4">
//           <button
//             onClick={onToggleSidebar}
//             className="text-[22px] text-gray-500 hover:text-[#388e3c] transition-colors cursor-pointer bg-transparent border-none flex items-center"
//           >
//             <MenuUnfoldOutlined />
//           </button>

//           <div className="text-xl font-bold text-gray-800 truncate">
//             {activeTitle}
//           </div>
//         </div>

//         <div className="flex items-center gap-4">
//           {/* CHANGED: Used Tailwind 'hidden md:flex' to ensure visibility on desktop */}
//           <div className="hidden md:flex flex-col items-end justify-center">
//             <div className="text-sm text-gray-500">admin@mail.com</div>
//             <div className="text-[16px] font-bold text-gray-800">Admin User</div>
//           </div>

//           <div className="flex items-center justify-center rounded-full text-white shadow-md relative group cursor-pointer" style={{ backgroundColor: 'rgb(102, 187, 106)', width: '56px', height: '56px', fontSize: '28px' }}>
//             <UserOutlined />

//             {/* Dropdown (kept from your original code) */}
//             <div className="absolute top-full right-0 pt-2 hidden group-hover:block w-[180px] z-50">
//               <div className="bg-white rounded-xl shadow-2xl border border-gray-100 py-2">
//                 <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-green-50 transition-colors border-none bg-transparent cursor-pointer font-semibold">
//                   <ProfileOutlined /> <span>Profile</span>
//                 </button>
//                 <button className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 transition-colors border-none bg-transparent cursor-pointer font-semibold">
//                   <LogoutOutlined /> <span>Logout</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }

// export default Header;


//---------------

// const Header: React.FC = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   return (
//     <div className="d-flex justify-content-between align-items-center w-100 ps-0 pe-3 pe-md-4">

//       <div className="d-flex flex-row">
//         <div className="d-flex align-items-center">
//           <Button
//             type="text"
//             icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
//             onClick={() => setCollapsed(!collapsed)}
//             style={{
//               fontSize: '16px',
//               width: 64,
//               height: 64,
//             }}
//           />
//         </div>
//         <div className="header-title ps-3 pe-2 ps-md-0 truncate">
//           <p>Employee Management</p>
//         </div>

//       </div>

//       <div className="d-flex w-auto justify-content-end gap-2">
//         <div className="d-none d-md-flex flex-col gap-1 justify-end">
//           <div className="text-sm text-end text-gray-700">admin@mail.com</div>
//           <div className="text-xl font-semibold text-end text-gray-700">Admin User</div>

//         </div>

//         <div className="flex items-center justify-center rounded-full text-white shadow-md relative group cursor-pointer" style={{ backgroundColor: 'rgb(102, 187, 106)', width: '56px', height: '56px', fontSize: '28px' }}>
//           <UserOutlined />

//           {/* Dropdown (kept from your original code) */}
//           <div className="absolute top-full right-0 pt-2 hidden group-hover:block w-[180px] z-50">
//             <div className="bg-white rounded-xl shadow-2xl border border-gray-100 py-2">
//               <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-green-50 transition-colors border-none bg-transparent cursor-pointer font-semibold">
//                 <ProfileOutlined /> <span>Profile</span>
//               </button>
//               <button className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 transition-colors border-none bg-transparent cursor-pointer font-semibold">
//                 <LogoutOutlined /> <span>Logout</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// }


// export default Header;