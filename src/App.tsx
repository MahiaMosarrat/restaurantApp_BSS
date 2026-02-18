import './App.css'
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from './auth/AuthProvider';
import { ProtectedRoute } from './auth/ProtectedRoute';
import Foods from './Pages/Foods';
import NewOrder from './Pages/NewOrder';
import Orders from './Pages/Orders';
import Tables from './Pages/Tables';
import Employees from './Pages/Employees';
import Home from './Pages/Home';
import Dashboard from './Pages/Dashboard';

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>

          <Routes>
            <Route index element={<Home />} />
            <Route path="dashboard" element={
              <ProtectedRoute>
                {/* <Navigation /> */}
                <Dashboard />
              </ProtectedRoute>} >
              <Route index element={<Employees />} /> 
              <Route path="employees" element={<Employees />} />
              
              <Route path='foods' element={<Foods />} />
              <Route path='new-order' element={<NewOrder />} />
              <Route path='orders' element={<Orders />} />
              <Route path='tables' element={<Tables />} />
            </Route>
            <Route path="*" element={<div> Not found </div>} />
          </Routes>
        </AuthProvider>

      </BrowserRouter >
    </>
  )
}

export default App

export const routes = {
  index: "/",
  signIn: "/",
  // employees: "/dashboard/employees",
}