"use client";

import React, { useState } from 'react';
import {
    Search,
    Shield,
    BarChart3,
    AlertTriangle,
    FileText,
    Database,
    Settings,
    Users,
    Wrench,
    GitBranch,
    ChevronDown,
    LogOut
} from 'lucide-react';

const sidebarItems = [
    { name: 'Detections', icon: Shield, active: false },
    { name: 'Analytics', icon: BarChart3, active: true },
    { name: 'Exception requests', icon: AlertTriangle, active: false },
    { name: 'Threat Hunting', icon: Search, active: false },
    { name: 'Policy', icon: FileText, active: false, hasSubmenu: true },
    { name: 'Data Library', icon: Database, active: false, hasSubmenu: true },
    { name: 'Manage', icon: Users, active: false, hasSubmenu: true },
    { name: 'Admin Log', icon: FileText, active: false, hasSubmenu: true },
    { name: 'Tools', icon: Wrench, active: false, hasSubmenu: true },
    { name: 'Integrations', icon: GitBranch, active: false, hasSubmenu: true }
];

const Sidebar = ({ sidebarOpen, setSidebarOpen, activeSection, setActiveSection }) => {
    return (
        <div className={`transition-all duration-300 relative ${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 flex flex-col`}>
            {/* Logo */}
            <div className="p-4 border-b border-gray-200 flex items-center">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                        <img src="/logo sqrx.png" alt="logo" />
                    </div>
                    {sidebarOpen && (
                        <span className="text-[19px] font-semibold text-gray-900">SquareX</span>
                    )}
                </div>
            </div>

            {/* Sidebar Toggle Button - Vertically Centered */}
            <button
                className="absolute z-20 top-1/2 -right-3 transform -translate-y-1/2 bg-white border border-gray-200 shadow p-1 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100 focus:outline-none"
                style={{ width: '28px', height: '28px' }}
                onClick={() => setSidebarOpen((prev) => !prev)}
                aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    {sidebarOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    )}
                </svg>
            </button>

            {/* Search */}
            {sidebarOpen && (
                <div className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7D7D7D] w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-[#7D7D7D]"
                        />
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 px-2 space-y-1">
                {sidebarItems.map((item, index) => (
                    <div key={index}>
                        <button
                            className={`w-full flex items-center ${sidebarOpen ? 'justify-between px-3' : 'justify-center px-0'} py-2 text-sm font-medium rounded-lg transition-colors ${item.active
                                ? 'bg-purple-50 text-purple-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            onClick={() => setActiveSection(item.name)}
                            title={sidebarOpen ? undefined : item.name}
                        >
                            <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center w-full'}`}>
                                <item.icon className="w-5 h-5" />
                                {sidebarOpen && <span>{item.name}</span>}
                            </div>
                            {sidebarOpen && item.hasSubmenu && <ChevronDown className="w-4 h-4" />}
                        </button>
                    </div>
                ))}
            </nav>

            {/* User Profile, Settings, and Log out */}
            {sidebarOpen ? (
                <>
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                                <img src="/admin.png" alt="admin" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900">Alex Morgan</div>
                                <span className="bg-[#D8B4FE] text-black text-[10px] px-2 py-1 rounded-full">Admin</span>
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                    <div className="px-4 pb-4 space-y-1">
                        <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900">
                            <Settings className="w-5 h-5" />
                            <span>Settings</span>
                            <ChevronDown className="w-4 h-4 ml-auto" />
                        </button>
                        <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900">
                            <LogOut className="w-5 h-5" />
                            <span>Log out</span>
                        </button>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center gap-4 mt-auto mb-4">
                    {/* Profile icon */}
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-pink-500 border-2 border-white shadow">
                        <img src="/admin.png" alt="admin" className="w-8 h-8 rounded-full" />
                    </button>
                    {/* Settings icon */}
                    <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600">
                        <Settings className="w-5 h-5" />
                    </button>
                    {/* Log out icon */}
                    <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
