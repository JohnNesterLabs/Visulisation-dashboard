"use client";

import React, { useState } from 'react';
import Sidebar from '../Sidebar';
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
    RefreshCw,
    TrendingUp,
    TrendingDown,
    ExternalLink,
    Download,
    LogOut
} from 'lucide-react';
import { categoryData, chartAreaHeight, chartConfig, chartHeight, mostVisitedDomains, riskyCategories, riskyWebsites } from '@/app/utils';

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState('Analytics');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [severityData, setSeverityData] = useState({
        total: 9200,
        critical: 75,
        high: 20,
        informational: 5
    });

    const [hoveredBar, setHoveredBar] = useState(null);
    const [tooltipData, setTooltipData] = useState(null);

    const DonutChart = ({ data }) => {
        const { total, critical, high, informational } = data;
        const criticalAngle = (critical / 100) * 360;
        const highAngle = (high / 100) * 360;
        const informationalAngle = (informational / 100) * 360;

        return (
            <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="8"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#7c3aed"
                            strokeWidth="8"
                            strokeDasharray={`${criticalAngle * 0.7} ${360 - criticalAngle * 0.7}`}
                            strokeDashoffset="0"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#c4b5fd"
                            strokeWidth="8"
                            strokeDasharray={`${highAngle * 0.7} ${360 - highAngle * 0.7}`}
                            strokeDashoffset={`-${criticalAngle * 0.7}`}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900">
                            {(total / 1000).toFixed(1)}K
                        </span>
                    </div>
                </div>
                <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        <span className="text-gray-600">Critical</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                        <span className="text-gray-600">High</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <span className="text-gray-600">Informational</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#ECE9F8]">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">Analytics</span>
                            <span className="text-gray-400">›</span>
                            <h1 className="text-xl font-semibold text-gray-900">Site Visit Analytics</h1>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>Last updated 05:08</span>
                            <RefreshCw className="w-4 h-4" />
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-auto p-4">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {/* Detections */}
                        <div
                            className="bg-white rounded-[16px] p-6 border border-gray-200 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => {
                                if (typeof window !== 'undefined') {
                                    window.location.href = '/detection';
                                }
                            }}
                        >
                            <div>
                                <div className="flex items-center justify-start">
                                    <h3 className="text-5xl font-medium text-gray-900 mr-[8px]">4600</h3>
                                    <TrendingUp className="w-5 h-5 text-red-500" />
                                </div>
                                <p className="text-[20px] font-semibold text-gray-900 mb-2">Detections</p>
                            </div>
                            <div>
                                <div className="flex flex-col items-start space-x-2 text-sm">
                                    <span className="text-gray-600">5%</span>
                                    <div className="text-gray-600">Increase compared to last week</div>
                                </div>
                                <button className="text-purple-600 text-sm mt-2 hover:underline">View activity →</button>
                            </div>
                        </div>

                        {/* Unique Domains */}
                        <div className="bg-white rounded-[16px] p-6 border border-gray-200 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-start">
                                    <h3 className="text-5xl font-medium  text-gray-900 mr-[8px]">15</h3>
                                    <TrendingDown className="w-5 h-5 text-purple-500" />
                                </div>
                                <p className="text-[20px] font-semibold text-gray-900 mb-2">Unique Domains Visited</p>
                            </div>
                            <div>
                                <div className="flex flex-col items-start space-x-2 text-sm">
                                    <span className="text-gray-600">12%</span>
                                    <div className='text-gray-600'>Decrease compared to last week</div>
                                </div>
                                <button className="text-purple-600 text-sm mt-2 hover:underline">View activity →</button>
                            </div>
                        </div>

                        {/* Known Malicious Site Visits */}
                        <div className="bg-white rounded-[16px] p-6 border border-gray-200 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-start">
                                    <h3 className="text-5xl font-medium text-gray-900 mr-[8px]">25</h3>
                                    <TrendingDown className="w-5 h-5 text-purple-500" />
                                </div>
                                <p className="text-[20px] font-semibold text-gray-900 mb-2">Known Malicious Site Visits</p>
                            </div>
                            <div>
                                <div className="flex flex-col items-start space-x-2 text-sm">
                                    <span className="text-gray-600">3%</span>
                                    <div className='text-gray-600'>Decrease compared to last week</div>
                                </div>
                                <button className="text-purple-600 text-sm mt-2 hover:underline">View activity →</button>
                            </div>
                        </div>

                        {/* Users at Risk */}
                        <div className="bg-white rounded-[16px] p-6 border border-gray-200 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-start">
                                    <h3 className="text-5xl font-medium text-gray-900 mr-[8px]">1000</h3>
                                    <TrendingUp className="w-5 h-5 text-red-500" />
                                </div>
                                <p className="text-[20px] font-semibold text-gray-900 mb-2">Users at Risk</p>
                            </div>
                            <div>
                                <div className="flex flex-col items-start space-x-2 text-sm">
                                    <span className="text-gray-600">3%</span>
                                    <div className='text-gray-600'>Increase compared to last week</div>
                                </div>
                                <button className="text-purple-600 text-sm mt-2 hover:underline">View activity  →</button>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="flex grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                        {/* Detections by Severity */}
                        <div className="bg-white w-[24%]  rounded-[16px] p-6 border border-gray-200">
                            <h3 className="text-[20px] font-semibold text-gray-900 mb-6">Detections by Severity</h3>
                            <DonutChart data={severityData} />
                        </div>


                        {/* Right column - Top Site Categories (full height) */}
                        <div className="bg-white rounded-[16px] w-[50%] p-6 border border-gray-200 h-fit relative">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Site Categories</h3>

                            {/* Chart Container - Dynamic Height */}
                            <div
                                className="relative"
                                style={{
                                    height: chartHeight,
                                    paddingLeft: `${chartConfig.paddingLeft}px`,
                                    paddingRight: `${chartConfig.paddingRight}px`,
                                    paddingBottom: `${chartConfig.paddingBottom}px`
                                }}
                            >
                                {/* Y-axis labels */}
                                <div
                                    className="absolute left-0 top-0 flex flex-col justify-between text-xs text-gray-500"
                                    style={{
                                        bottom: `${chartConfig.paddingBottom}px`,
                                        width: `${chartConfig.paddingLeft - 8}px`
                                    }}
                                >
                                    <span className="leading-none">100k</span>
                                    <span className="leading-none">50k</span>
                                    <span className="leading-none">20k</span>
                                    <span className="leading-none">10k</span>
                                    <span className="leading-none">0</span>
                                </div>

                                {/* Grid lines aligned with Y-axis labels */}
                                <div
                                    className="absolute top-0 flex flex-col justify-between"
                                    style={{
                                        left: `${chartConfig.paddingLeft}px`,
                                        right: `${chartConfig.paddingRight}px`,
                                        bottom: `${chartConfig.paddingBottom}px`
                                    }}
                                >
                                    <div className="border-t border-gray-200 w-full"></div>
                                    <div className="border-t border-gray-200 w-full"></div>
                                    <div className="border-t border-gray-200 w-full"></div>
                                    <div className="border-t border-gray-200 w-full"></div>
                                    <div className="border-t border-gray-300 w-full"></div> {/* Bottom line (0) slightly darker */}
                                </div>

                                {/* Chart area - bars start from the very bottom */}
                                <div
                                    className="absolute top-0 flex items-end justify-between"
                                    style={{
                                        left: `${chartConfig.paddingLeft}px`,
                                        right: `${chartConfig.paddingRight}px`,
                                        bottom: `${chartConfig.paddingBottom}px`,
                                        height: `${chartAreaHeight}px`
                                    }}
                                >
                                    {categoryData.map((category, index) => {
                                        const barHeightPercentage = (category.value / chartConfig.maxValue) * 100;
                                        return (
                                            <div key={index} className="flex items-end h-full">
                                                <div
                                                    className="transition-all duration-300 cursor-pointer relative"
                                                    style={{
                                                        width: `${chartConfig.barWidth}px`,
                                                        height: `${barHeightPercentage}%`,
                                                        backgroundColor: category.color,
                                                        minHeight: category.value > 0 ? '1px' : '0px'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        // setHoveredBar(index);
                                                        setTooltipData({
                                                            name: category.name,
                                                            value: category.value,
                                                            x: e.currentTarget.getBoundingClientRect().left,
                                                            y: e.currentTarget.getBoundingClientRect().top
                                                        });
                                                    }}
                                                    onMouseLeave={() => {
                                                        setHoveredBar(null);
                                                        setTooltipData(null);
                                                    }}
                                                >
                                                    {/* Hover effect - Light overlay instead of opacity change */}
                                                    {hoveredBar === index && (
                                                        <div className="absolute inset-0 bg-white bg-opacity-30 pointer-events-none"></div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* X-axis labels positioned at the bottom */}
                                <div
                                    className="absolute bottom-0 flex justify-between"
                                    style={{
                                        left: `${chartConfig.paddingLeft}px`,
                                        right: `${chartConfig.paddingRight}px`
                                    }}
                                >
                                    {categoryData.map((category, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-center"
                                            style={{ width: `${chartConfig.barWidth}px` }}
                                        >
                                            <span className="text-xs text-gray-500 text-center">
                                                {category.shortName}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tooltip */}
                            {tooltipData && (
                                <div
                                    className="fixed z-50 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm pointer-events-none"
                                    style={{
                                        left: `${tooltipData.x - 60}px`,
                                        top: `${tooltipData.y - 60}px`,
                                    }}
                                >
                                    <div className="font-medium">{tooltipData.name}</div>
                                    <div className="text-gray-300">{tooltipData.value}k visits</div>
                                </div>
                            )}
                        </div>

                        {/* Risky Websites of all Sites */}
                        <div className="bg-white w-[24%]  rounded-[16px] p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Risky Websites of all Sites</h3>
                            <div className="space-y-4">
                                {riskyCategories.map((category, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-3 h-3 rounded ${category.color}`}></div>
                                            <span className="text-sm text-gray-900">{category.name}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium text-gray-900">{category.percentage}%</span>
                                            <span className="text-xs text-gray-500">{category.count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Tables Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Risky Websites */}
                        <div className="bg-white rounded-[16px] border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="text-[20px] font-semibold text-gray-900">Risky Websites</h3>
                                        <span className="bg-[#D8B4FE] text-black text-xs px-2 py-1 rounded-full">34 Total</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <ExternalLink className="w-4 h-4 text-[#642CFD]" />
                                        <Download className="w-4 h-4 text-[#642CFD]" />
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b border-[#CCBAFF]">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-[14px] font-medium text-black tracking-wider">Domain</th>
                                            <th className="px-6 py-3 text-left text-[14px] font-medium text-black tracking-wider">Visits</th>
                                            <th className="px-6 py-3 text-left text-[14px] font-medium text-black tracking-wider">Users</th>
                                            <th className="px-6 py-3 text-left text-[14px] font-medium text-black tracking-wider">Tags</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {riskyWebsites.map((website, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-3">
                                                        <img src={website.image} alt="" className='w-[32px] h-[32px]' />
                                                        {/* <span className="text-lg">{website.icon}</span> */}
                                                        <span className="text-sm text-gray-900">{website.domain}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{website.visits}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{website.users}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{website.tag}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Most Visited Domains */}
                        <div className="bg-white rounded-[16px] border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="text-lg font-semibold text-gray-900">Most Visited Domains</h3>
                                        <span className="bg-[#D8B4FE] text-black text-xs px-2 py-1 rounded-full">34 Total</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <ExternalLink className="w-4 h-4 text-[#642CFD]" />
                                        <Download className="w-4 h-4 text-[#642CFD]" />
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b border-[#CCBAFF]">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-[14px] font-medium text-black tracking-wider">Domain</th>
                                            <th className="px-6 py-3 text-left text-[14px] font-medium text-black tracking-wider">Visits</th>
                                            <th className="px-6 py-3 text-left text-[14px] font-medium text-black tracking-wider">Users</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {mostVisitedDomains.map((domain, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-3">
                                                        <img src={domain.image} alt="" className='w-[32px] h-[32px]' />
                                                        {/* <span className="text-lg">{domain.icon}</span> */}
                                                        <span className="text-sm text-gray-900">{domain.domain}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{domain.visits}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{domain.users}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
