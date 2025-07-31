"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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
    // Animation trigger state for chart/progress refresh
    const [animateKey, setAnimateKey] = React.useState(0);
    const [activeSection, setActiveSection] = useState('Analytics');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    // Final data for charts and progress bars
    const finalSeverityData = {
        total: 9200,
        critical: 3200,
        high: 4500,
        informational: 1500
    };
    const finalValues = {
        freeHosted1: { percent: 40, count: 18 },
        typosquatting: { percent: 8, count: 5 },
        newDomain: { percent: 60, count: 30 },
        freeHosted2: { percent: 20, count: 9 }
    };
    // Animated values for progress bars, donut, bar chart, and numbers
    const [animated, setAnimated] = useState({
        progress: {
            freeHosted1: { percent: 1, count: 1 },
            typosquatting: { percent: 1, count: 1 },
            newDomain: { percent: 1, count: 1 },
            freeHosted2: { percent: 1, count: 1 }
        },
        donut: { ...finalSeverityData },
        bar: categoryData.map(d => ({ ...d, value: 0 })),
        numbers: {
            detections: 0,
            uniqueDomains: 0,
            maliciousSites: 0,
            usersAtRisk: 0
        }
    });

    type SeverityData = {
        total: number;
        critical: number;
        high: number;
        informational: number;
    };
    type TooltipData = {
        name: string;
        value: number;
        x: number;
        y: number;
    } | null;
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);
    const [tooltipData, setTooltipData] = useState<TooltipData>(null);
    interface DonutChartProps {
        data: SeverityData;
    }

    // Synchronized animation for all dashboard elements
    useEffect(() => {
        const duration = 1500;
        const steps = 50;
        const stepDelay = duration / steps;
        let currentStep = 0;
        const startAnimated = {
            progress: {
                freeHosted1: { percent: 1, count: 1 },
                typosquatting: { percent: 1, count: 1 },
                newDomain: { percent: 1, count: 1 },
                freeHosted2: { percent: 1, count: 1 }
            },
            donut: { total: 0, critical: 0, high: 0, informational: 0 },
            bar: categoryData.map(d => ({ ...d, value: 0 })),
            numbers: {
                detections: 0,
                uniqueDomains: 0,
                maliciousSites: 0,
                usersAtRisk: 0
            }
        };
        const endAnimated = {
            progress: finalValues,
            donut: finalSeverityData,
            bar: categoryData,
            numbers: {
                detections: 4600,
                uniqueDomains: 15,
                maliciousSites: 25,
                usersAtRisk: 1000
            }
        };
        setAnimated(startAnimated);
        const interval = setInterval(() => {
            currentStep++;
            const progress = Math.min(currentStep / steps, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setAnimated({
                progress: {
                    freeHosted1: {
                        percent: Math.round(1 + (finalValues.freeHosted1.percent - 1) * easeOut),
                        count: Math.round(1 + (finalValues.freeHosted1.count - 1) * easeOut)
                    },
                    typosquatting: {
                        percent: Math.round(1 + (finalValues.typosquatting.percent - 1) * easeOut),
                        count: Math.round(1 + (finalValues.typosquatting.count - 1) * easeOut)
                    },
                    newDomain: {
                        percent: Math.round(1 + (finalValues.newDomain.percent - 1) * easeOut),
                        count: Math.round(1 + (finalValues.newDomain.count - 1) * easeOut)
                    },
                    freeHosted2: {
                        percent: Math.round(1 + (finalValues.freeHosted2.percent - 1) * easeOut),
                        count: Math.round(1 + (finalValues.freeHosted2.count - 1) * easeOut)
                    }
                },
                donut: {
                    total: Math.round(finalSeverityData.total * easeOut),
                    critical: Math.round(finalSeverityData.critical * easeOut),
                    high: Math.round(finalSeverityData.high * easeOut),
                    informational: Math.round(finalSeverityData.informational * easeOut)
                },
                bar: categoryData.map((d, i) => ({ ...d, value: Math.round(d.value * easeOut) })),
                numbers: {
                    detections: Math.round(4600 * easeOut),
                    uniqueDomains: Math.round(15 * easeOut),
                    maliciousSites: Math.round(25 * easeOut),
                    usersAtRisk: Math.round(1000 * easeOut)
                }
            });
            if (progress >= 1) clearInterval(interval);
        }, stepDelay);
        return () => clearInterval(interval);
    }, [animateKey]);
    // AnimatedNumber now just formats the value passed from parent
    const AnimatedNumber: React.FC<{ value: number; precision?: number }> = ({ value, precision = 0 }) => {
        const formatWithCurrency = (num: number) => {
            const absNum = Math.abs(num);
            const formatted = absNum.toLocaleString('en-US', { minimumFractionDigits: precision, maximumFractionDigits: precision });
            if (num < 0) {
                return `-${formatted}`;
            }
            return `${formatted}`;
        };
        const fullValue = formatWithCurrency(Number(value));
        return (
            <span
                className="block truncate"
                style={{ maxWidth: '100%', wordBreak: 'break-all', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                title={fullValue}
            >
                {formatWithCurrency(value)}
            </span>
        );
    };

    // AnimatedDonutChart is now a pure presentational component
    // Helper to create SVG arc path for donut segment
    function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
        const start = polarToCartesian(cx, cy, r, endAngle);
        const end = polarToCartesian(cx, cy, r, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        return [
            "M", start.x, start.y,
            "A", r, r, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");
    }
    function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
        const rad = (angle - 90) * Math.PI / 180.0;
        return {
            x: cx + (r * Math.cos(rad)),
            y: cy + (r * Math.sin(rad))
        };
    }
    const sampleData = {
        total: 9200,
        critical: 3200,
        high: 4500,
        informational: 1500
    };

    const AnimatedDonutChart: React.FC<DonutChartProps> = ({ data }) => {
        const { total, critical, high, informational } = data;
        const [hovered, setHovered] = React.useState<{
            label: string;
            value: number;
            color: string;
            percent: number;
        } | null>(null);

        const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

        // Calculate percentages
        const criticalPercent = total > 0 ? (critical / total) * 100 : 0;
        const highPercent = total > 0 ? (high / total) * 100 : 0;
        const informationalPercent = total > 0 ? (informational / total) * 100 : 0;

        // SVG circle properties
        const radius = 40;
        const strokeWidth = 18;
        const circumference = 2 * Math.PI * radius;

        // Calculate stroke lengths for each segment
        const criticalLength = (criticalPercent / 100) * circumference;
        const highLength = (highPercent / 100) * circumference;
        const informationalLength = (informationalPercent / 100) * circumference;

        // Calculate remaining space after each segment
        const criticalGap = circumference - criticalLength;
        const highGap = circumference - highLength;
        const informationalGap = circumference - informationalLength;

        // Calculate stroke offsets - start at top (25% of circumference)
        const criticalOffset = circumference * 0.25; // Start at top
        const highOffset = criticalOffset - criticalLength; // Start where critical ends
        const informationalOffset = highOffset - highLength; // Start where high ends

        // Define segments with proper angles for hover detection
        const segments = [
            {
                label: 'Critical',
                value: critical,
                percent: criticalPercent,
                color: '#8253A2',
                strokeDasharray: `${criticalLength} ${criticalGap}`,
                strokeDashoffset: criticalOffset,
                startAngle: 0,
                endAngle: criticalPercent * 3.6 // Convert percentage to degrees
            },
            {
                label: 'High',
                value: high,
                percent: highPercent,
                color: '#D8B4FE',
                strokeDasharray: `${highLength} ${highGap}`,
                strokeDashoffset: highOffset,
                startAngle: criticalPercent * 3.6,
                endAngle: (criticalPercent + highPercent) * 3.6
            },
            {
                label: 'Informational',
                value: informational,
                percent: informationalPercent,
                color: '#F3E8FF',
                strokeDasharray: `${informationalLength} ${informationalGap}`,
                strokeDashoffset: informationalOffset,
                startAngle: (criticalPercent + highPercent) * 3.6,
                endAngle: (criticalPercent + highPercent + informationalPercent) * 3.6
            }
        ].filter(segment => segment.value > 0); // Only show segments with values

        // Helper function to create proper arc path for hover areas
        const createArcPath = (centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number, innerRadius: number) => {
            // Convert angles to radians and adjust for SVG coordinate system
            const startAngleRad = (startAngle - 90) * Math.PI / 180;
            const endAngleRad = (endAngle - 90) * Math.PI / 180;

            // Calculate outer arc points
            const x1 = centerX + radius * Math.cos(startAngleRad);
            const y1 = centerY + radius * Math.sin(startAngleRad);
            const x2 = centerX + radius * Math.cos(endAngleRad);
            const y2 = centerY + radius * Math.sin(endAngleRad);

            // Calculate inner arc points
            const x3 = centerX + innerRadius * Math.cos(endAngleRad);
            const y3 = centerY + innerRadius * Math.sin(endAngleRad);
            const x4 = centerX + innerRadius * Math.cos(startAngleRad);
            const y4 = centerY + innerRadius * Math.sin(startAngleRad);

            // Determine if we need a large arc
            const largeArcFlag = endAngle - startAngle > 180 ? "1" : "0";

            return [
                "M", x1, y1, // Move to start of outer arc
                "A", radius, radius, 0, largeArcFlag, 1, x2, y2, // Outer arc
                "L", x3, y3, // Line to start of inner arc
                "A", innerRadius, innerRadius, 0, largeArcFlag, 0, x4, y4, // Inner arc (reverse direction)
                "Z" // Close path
            ].join(" ");
        };

        const handleMouseMove = (e: React.MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        const handleSegmentHover = (segment: typeof segments[0]) => {
            setHovered({
                label: segment.label,
                value: segment.value,
                color: segment.color,
                percent: segment.percent
            });
        };

        return (
            <div className="flex flex-col items-center">
                <div className="relative w-40 h-40 mb-6" onMouseMove={handleMouseMove}>
                    <svg
                        viewBox="0 0 100 100"
                        className="w-full h-full transform -rotate-90"
                    >
                        {/* Background circle - only show if there are gaps */}
                        <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="none"
                            stroke="#F3E8FF"
                            strokeWidth={strokeWidth}
                            opacity="0.3"
                        />

                        {/* Render each segment */}
                        {segments.map((segment, index) => (
                            <g key={`segment-${segment.label}`}>
                                {/* Visible segment */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r={radius}
                                    fill="none"
                                    stroke={segment.color}
                                    strokeWidth={strokeWidth}
                                    strokeLinecap="round"
                                    strokeDasharray={segment.strokeDasharray}
                                    strokeDashoffset={segment.strokeDashoffset}
                                    style={{
                                        transition: 'all 0.2s ease'
                                    }}
                                />

                                {/* Hover overlay - shows on top when hovered */}
                                {hovered?.label === segment.label && (
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r={radius}
                                        fill="none"
                                        stroke="rgba(59, 130, 246, 0.6)"
                                        strokeWidth={strokeWidth}
                                        strokeLinecap="round"
                                        strokeDasharray={segment.strokeDasharray}
                                        strokeDashoffset={segment.strokeDashoffset}
                                        style={{
                                            transition: 'all 0.2s ease'
                                        }}
                                    />
                                )}

                                {/* Invisible hover area */}
                                <path
                                    d={createArcPath(50, 50, radius + strokeWidth / 2 + 2, segment.startAngle, segment.endAngle, radius - strokeWidth / 2 - 2)}
                                    fill="transparent"
                                    stroke="transparent"
                                    className="cursor-pointer"
                                    onMouseEnter={() => handleSegmentHover(segment)}
                                    onMouseLeave={() => setHovered(null)}
                                />
                            </g>
                        ))}
                    </svg>

                    {/* Center text */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-3xl font-bold text-gray-900">
                            <AnimatedNumber value={total / 1000} precision={1} />
                        </span>
                        <span className="text-3xl text-gray-900 font-bold">K</span>
                    </div>
                </div>

                {/* Tooltip */}
                {hovered && (
                    <div
                        className="fixed z-50 px-3 py-2 rounded-lg shadow-lg text-xs text-white pointer-events-none bg-gray-800 border border-gray-600"
                        style={{
                            left: mousePos.x + 10,
                            top: mousePos.y - 60,
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <div className="font-semibold">{hovered.label}</div>
                        <div>Value: <span className="font-bold">{hovered.value.toLocaleString()}</span></div>
                        <div>Percentage: <span className="font-bold">{hovered.percent.toFixed(1)}%</span></div>
                    </div>
                )}

                {/* Legend */}
                <div className="flex gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#8253A2] rounded-full"></div>
                        <span className="text-gray-700">Critical</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#D8B4FE] rounded-full"></div>
                        <span className="text-gray-700">High</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#F3E8FF] rounded-full"></div>
                        <span className="text-gray-700">Informational</span>
                    </div>
                </div>
            </div>
        );
    };

    // AnimatedBarChart is now a pure presentational component
    const AnimatedBarChart: React.FC<{ data: typeof categoryData }> = ({ data }) => {
        return (
            <>{data.map((category, index) => {
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
                            {hoveredBar === index && (
                                <div className="absolute inset-0 bg-white bg-opacity-30 pointer-events-none"></div>
                            )}
                        </div>
                    </div>
                );
            })}</>
        );
    };

    interface ProgressBarProps {
        label: string;
        animatedValue: { percent: number; count: number };
    }
    const ProgressBar: React.FC<ProgressBarProps> = ({ label, animatedValue }) => (
        <div className="mb-3">
            <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                    <div className="rounded-md h-[30px] overflow-hidden relative">
                        <div
                            className="bg-[#E9D8FD] h-full rounded-md transition-all duration-100 ease-out"
                            style={{ width: `${Math.min(animatedValue.percent, 100)}%` }}
                        >
                        </div>
                        <div className="absolute inset-0 flex items-center justify-between px-[8px] py-[4px]">
                            <span className="text-gray-800 font-medium text-sm">
                                {label}
                            </span>
                            <span className="text-gray-800 text-sm">
                                {animatedValue.percent}%
                            </span>
                        </div>
                    </div>
                </div>
                <div className="text-[#642CFD] font-bold text-[14px] w-12 text-center">
                    {animatedValue.count}
                </div>
            </div>
        </div>
    );

    // Animation trigger state
    // (removed stray comment)

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
                            <button
                                className="ml-2 p-1 rounded hover:bg-gray-200 transition-colors cursor-pointer"
                                onClick={() => setAnimateKey(k => k + 1)}
                                title="Refresh Data"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
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
                                    <h3 className="text-5xl font-medium text-gray-900 mr-[8px]"><AnimatedNumber value={animated.numbers.detections} /></h3>
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
                                    <h3 className="text-5xl font-medium  text-gray-900 mr-[8px]"><AnimatedNumber value={animated.numbers.uniqueDomains} /></h3>
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
                                    <h3 className="text-5xl font-medium text-gray-900 mr-[8px]"><AnimatedNumber value={animated.numbers.maliciousSites} /></h3>
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
                                    <h3 className="text-5xl font-medium text-gray-900 mr-[8px]"><AnimatedNumber value={animated.numbers.usersAtRisk} /></h3>
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
                            <AnimatedDonutChart data={animated.donut} />
                        </div>


                        {/* Right column - Top Site Categories (full height) */}
                        <div className="bg-white rounded-[16px] w-[50%] p-6 border border-gray-200 h-fit relative">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Site Categories</h3>
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
                                        bottom: `${chartConfig.paddingBottom}px`,
                                        height: `${chartAreaHeight}px`
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
                                    <AnimatedBarChart data={animated.bar} />
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
                        <div className="bg-white w-[24%] rounded-[16px] p-6 border border-gray-200">
                            <div className="max-w-4xl mx-auto bg-white">
                                <h1 className="text-[20px] font-bold text-gray-800 mb-4">
                                    Risky Websites of all Sites
                                </h1>

                                <div className="space-y-1">
                                    <ProgressBar
                                        label="Free Hosted"
                                        animatedValue={animated.progress.freeHosted1}
                                    />
                                    <ProgressBar
                                        label="Typosquatting"
                                        animatedValue={animated.progress.typosquatting}
                                    />
                                    <ProgressBar
                                        label="New Domain"
                                        animatedValue={animated.progress.newDomain}
                                    />
                                    <ProgressBar
                                        label="Free Hosted"
                                        animatedValue={animated.progress.freeHosted2}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Tables Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Risky Websites */}
                        <div className="bg-white rounded-[16px]">
                            <div className="px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="text-[20px] font-semibold text-gray-900">Risky Websites</h3>
                                        <span className="bg-[#D8B4FE] text-black text-xs px-2 py-1 rounded-full">34 Total</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Image src="/sharing.png" alt="" width={16} height={16} className='w-4 h-4' />
                                        <Image src="/downloading.png" alt="" width={16} height={16} className='w-4 h-4' />
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
                                                        <Image src={website.image} alt="" width={32} height={32} className='w-[32px] h-[32px]' />
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
                                        <Image src="/sharing.png" alt="" width={16} height={16} className='w-4 h-4' />
                                        <Image src="/downloading.png" alt="" width={16} height={16} className='w-4 h-4' />
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
                                                        <Image src={domain.image} alt="" width={32} height={32} className='w-[32px] h-[32px]' />
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
