import React from 'react';
import SideNav from './components/SideNav';
import { Toaster } from 'react-hot-toast';
import Provider from './Provider';
export default function AdminLayout({ children }) {
    return (
        <div>
            <Toaster position="bottom-right" />
            <div className="w-24 fixed">
                <SideNav/>
            </div>
            <div className="ml-24">
                <Provider> 
                {children}
                </Provider>
            </div>
        </div>
    );
}