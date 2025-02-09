import React from 'react';
import SideNav from './components/SideNav';
export default function AdminLayout({ children }) {
    return (
        <div>
            <div className="w-24 fixed">
                <SideNav/>
            </div>
            <div className="ml-24">
                {children}
            </div>

        </div>
    );
}