
// import './login.css'
// import React, { useState, useEffect } from 'react';

// const LoginSlider: React.FC = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
  
//   const slides = [
//     { id: 1, title: "Welcome Back to BSS Restaurant Dashboard!", description: "Effortlessly manage your restaurant's heartbeat — from employees to every table's orders. Let's make service seamless and delicious together!", image: "/login_illustration_2.svg" },
//     { id: 2, title: "Your Restaurant, Perfectly Managed.", description: "Enter your credentials to access a world of insights that empower your team and delight your guests.", image: "/login_illustration_3.svg" },
//     { id: 3, title: "Simplify. Serve. Succeed.", description: "Your all-in-one dashboard to streamline operations, delight customers, and empower your team.", image: "/login_illustration_4.svg" }
//   ];

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
//     }, 5000);
//     return () => clearInterval(timer);
//   }, [slides.length]);

//   return (
//     <div className=" d-flex flex-column align-items-center justify-content-center h-100" style={{ width: '540px', backgroundColor: '#E8F5E9', borderRadius: '10px', boxShadow: '0 12px 15px -2px #0c0c0c80' }}>
      
//       {/* Container must have overflow hidden */}
//       <div className="flex-grow-1 w-100 overflow-hidden mt-4 position-relative">
//         {/* Track width must be slides.length * 100% */}
//         <div 
//           className="d-flex h-100 transition-all duration-700 ease-in-out"
//           style={{ 
//             transform: `translateX(-${currentSlide * (100 / slides.length)}%)`, 
//             width: `${slides.length * 100}%` 
//           }}
//         >
//           {slides.map((slide) => (
//             <div key={slide.id} className="d-flex flex-column align-items-center justify-content-center text-center px-5" style={{ width: `${100 / slides.length}%` }}>
//               <img src={slide.image} alt="illustration" className="img-fluid mb-4" style={{ maxHeight: '260px', objectFit: 'contain' }} />
//               <h1 className="fw-bold mb-3" style={{ color: '#212121', fontSize: '1.875rem', lineHeight: '2.25rem.2' }}>{slide.title}</h1>
//               <p className="text-muted" style={{ fontSize: '15px', lineHeight: '1.5', padding: '0 20px' }}>{slide.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* PILL NAVIGATION: Line style as requested */}
//       <div className="d-flex gap-2 mb-5 justify-content-center">
//         {slides.map((_, idx) => (
//           <div 
//             key={idx}
//             onClick={() => setCurrentSlide(idx)}
//             className="cursor-pointer transition-all duration-300"
//             style={{ 
//               width: '35px', 
//               height: '3px', 
//               backgroundColor: currentSlide === idx ? '#424242' : 'transparent',
//               border: '1px solid #424242',
//               borderRadius: '0px' // Square edges
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LoginSlider;
import React from 'react';
import { Carousel } from 'antd';
import './login.css';

const LoginSlider: React.FC = () => {
  const slides = [
    { 
      id: 1, 
      title: "Welcome Back to BSS Restaurant Dashboard!", 
      description: "Effortlessly manage your restaurant's heartbeat — from employees to every table's orders. Let's make service seamless and delicious together!", 
      image: "/login_illustration_2.svg" 
    },
    { 
      id: 2, 
      title: "Your Restaurant, Perfectly Managed.", 
      description: "Enter your credentials to access a world of insights that empower your team and delight your guests.", 
      image: "/login_illustration_3.svg" 
    },
    { 
      id: 3, 
      title: "Simplify. Serve. Succeed.", 
      description: "Your all-in-one dashboard to streamline operations, delight customers, and empower your team.", 
      image: "/login_illustration_4.svg" 
    }
  ];

  return (
    <div className="h-100">
      <Carousel 
        autoplay 
        autoplaySpeed={5000} 
        draggable 
        pauseOnHover={false}
        effect="scrollx"
      >
        {slides.map((slide) => (
          <div key={slide.id}>
            <div className="d-flex flex-column align-items-center justify-content-center text-center px-3" style={{ height: '520px' }}>
              <div style={{ height: '200px', display: 'flex', alignItems: 'center' }}>
                <img 
                  src={slide.image} 
                  alt="illustration" 
                  style={{ maxHeight: '200px', width: 'auto', objectFit: 'contain' }} 
                />
              </div>
              <h1 className="slider-heading">{slide.title}</h1>
              <p className="slider-description">{slide.description}</p>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default LoginSlider;