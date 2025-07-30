"use client"

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { ChevronDown, Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import { initialDetections, policyOptions } from './detectionUtils';
import Sidebar from '../components/Sidebar';

type Detection = {
  id: number;
  severity: string;
  event: string;
  user: string;
  timestamp: string;
  policy: string;
  effect: string;
};

type Filters = {
  severity: string;
  effect: string;
  policyType: string;
  user: string;
  policy: string;
  realTime: boolean;
};

const SecurityDetections: React.FC = () => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'severity', direction: 'asc' });
  const [filters, setFilters] = useState<Filters>({
    severity: '',
    effect: '',
    policyType: '',
    user: '',
    policy: '',
    realTime: true,
  });
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [showMore, setShowMore] = useState(false);
  const [activeSection, setActiveSection] = useState('Analytics');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Dropdown state
  const [openDropdown, setOpenDropdown] = useState('');

  const [detections] = useState<Detection[]>(initialDetections);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-[#E85139]';
      case 'high':
        return 'bg-[#FB8C00]';
      case 'medium':
        return 'bg-[#FBC02D]';
      case 'informational':
        return 'bg-[#4A98E7]';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

    const getEffectIcon = (effect: string) => {
        switch (effect.toLowerCase()) {
            case 'allow':
                return <Image src="/Circle-Check.png" className='w-[20px] h-[20px]' alt="check" width={20} height={20} />;
            case 'block':
                return <Image src="/stop-sign.png" className='w-[20px] h-[20px]' alt="check" width={20} height={20} />;
            case 'warn':
                return <AlertCircle className="w-[20px] h-[20px] text-yellow-600" />;
            default:
                return <AlertCircle className="w-[20px] h-[20px] text-gray-600" />;
        }
    };

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

  const sortedDetections = useMemo(() => {
    const sortableDetections = [...detections];
    const key = sortConfig.key as keyof Detection;
    if (key) {
      sortableDetections.sort((a, b) => {
        if (a[key] < b[key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableDetections;
  }, [detections, sortConfig]);

  const filteredDetections = useMemo(() => {
    return sortedDetections.filter((detection) => {
      return (Object.keys(filters) as (keyof Filters)[]).every((key) => {
        if (!filters[key] || key === 'realTime') return true;
        return (
          typeof detection[key as keyof Detection] === 'string' &&
          (detection[key as keyof Detection] as string).toLowerCase().includes((filters[key] as string).toLowerCase())
        );
      });
    });
  }, [sortedDetections, filters]);

  const displayedDetections = showMore ? filteredDetections : filteredDetections.slice(0, 7);

  const handleRowSelect = (id: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

    const handleFilterChange = (filterType: string, value: string) => {
        setFilters(prev => ({ ...prev, [filterType]: value }));
    };

    const getSortIcon = (columnKey: string) => {
        if (sortConfig.key !== columnKey) {
            return <Image src="/down.png" alt="down" className='w-[16px] h-[16px]' width={16} height={16} />;
        }
        return sortConfig.direction === 'asc'
            ? <Image src="/up.png" alt="up" className='w-[16px] h-[16px]' width={16} height={16} />
            : <Image src="/down.png" alt="down" className='w-[16px] h-[16px]' width={16} height={16} />;
    };

    // (Removed duplicate openDropdown and policyOptions declaration)

    return (
        <>
            <div className="flex h-screen bg-[#ECE9F8]">
                {/* Sidebar */}
                <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header className="bg-white border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">Analytics</span>
                                <span className="text-gray-400">›</span>
                                <h1 className="text-xl font-semibold text-gray-900">Detections</h1>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <span>Last updated 05:08</span>
                                <RefreshCw className="w-4 h-4" />
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="flex-1 overflow-auto p-4 m-[16px] bg-white rounded-[16px]">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <h1 className="text-2xl font-semibold text-black">Detections</h1>
                                <span className="bg-[#D8B4FE] text-black px-3 py-1 rounded-full text-sm font-medium">
                                    5578 Total
                                </span>
                                <div className="flex items-center gap-2">
                                    {/* Custom green toggle switch */}
                                    <button
                                        type="button"
                                        aria-pressed={filters.realTime}
                                        onClick={() => setFilters(f => ({ ...f, realTime: !f.realTime }))}
                                        className={`relative w-10 h-6 rounded-full transition-colors duration-200 focus:outline-none ${filters.realTime ? 'bg-green-400' : 'bg-gray-300'}`}
                                        style={{ minWidth: 40 }}
                                    >
                                        <span
                                            className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${filters.realTime ? 'translate-x-4' : ''}`}
                                            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.10)' }}
                                        />
                                    </button>
                                    <span className="text-sm text-black flex items-center gap-1">
                                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#222" strokeWidth="2" fill="none" /><text x="12" y="16" textAnchor="middle" fontSize="14" fill="#222" fontFamily="Arial">i</text></svg>
                                        Real Time Detections
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-[#F8F6FF] px-3 py-2 rounded-[16px]">
                                    <Calendar className="w-4 h-4 text-black" />
                                    <span className="text-sm text-black">May 29 - 06 June</span>
                                </div>
                                <div className="flex items-center gap-2 bg-[#F8F6FF] px-3 py-2 rounded-[16px]">
                                    <Image src="/columns.png" alt="column" width={20} height={20} className='w-[20px] h-[20px]' />
                                    <span className="text-sm text-black">Column</span>
                                </div>
                            </div>
                        </div>

                        {/* Filters - Custom pill dropdowns */}
                        <div className="flex items-center gap-4 mb-6">
                            {/* Severity */}
                            <div className="relative">
                                <button
                                    type="button"
                                    className={`flex items-center justify-between gap-2 p-[8px] rounded-full bg-[#F6F2FF] text-[#0A1440] font-medium text-[14px] focus:outline-none min-w-[120px] border border-transparent ${filters.severity ? 'ring-2 ring-[#7c3aed]/30' : ''}`}
                                    onClick={() => setOpenDropdown(openDropdown === 'severity' ? '' : 'severity')}
                                >
                                    {filters.severity || 'Severity'}
                                    {filters.severity && (
                                        <span
                                            className="ml-2 cursor-pointer hover:bg-[#E0D7FF] rounded-full p-1 flex items-center justify-center"
                                            onClick={e => {
                                                e.stopPropagation();
                                                handleFilterChange('severity', '');
                                            }}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M6 6l8 8M6 14L14 6" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" /></svg>
                                        </span>
                                    )}
                                    <span className="ml-1">
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="#0A1440" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </span>
                                </button>
                                {openDropdown === 'severity' && (
                                    <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-lg z-10 py-1">
                                        {['Critical', 'High', 'Medium', 'Informational'].map(option => (
                                            <button key={option} className="block w-full text-left px-4 py-2 hover:bg-[#F6F2FF] text-[#0A1440]" onClick={() => { handleFilterChange('severity', option); setOpenDropdown(''); }}>{option}</button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* Effect */}
                            <div className="relative">
                                <button
                                    type="button"
                                    className={`flex items-center justify-between gap-2 p-[8px] rounded-full bg-[#F6F2FF] text-[#0A1440] font-medium text-[14px] focus:outline-none min-w-[120px] border border-transparent ${filters.effect ? 'ring-2 ring-[#7c3aed]/30' : ''}`}
                                    onClick={() => setOpenDropdown(openDropdown === 'effect' ? '' : 'effect')}
                                >
                                    {filters.effect || 'Effect'}
                                    {filters.effect && (
                                        <span
                                            className="ml-2 cursor-pointer hover:bg-[#E0D7FF] rounded-full p-1 flex items-center justify-center"
                                            onClick={e => {
                                                e.stopPropagation();
                                                handleFilterChange('effect', '');
                                            }}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M6 6l8 8M6 14L14 6" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" /></svg>
                                        </span>
                                    )}
                                    <span className="ml-1">
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="#0A1440" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </span>
                                </button>
                                {openDropdown === 'effect' && (
                                    <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-lg z-10 py-1">
                                        {['Allow', 'Block', 'Warn'].map(option => (
                                            <button key={option} className="block w-full text-left px-4 py-2 hover:bg-[#F6F2FF] text-[#0A1440]" onClick={() => { handleFilterChange('effect', option); setOpenDropdown(''); }}>{option}</button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* Policy Type */}
                            <div className="relative">
                                <button
                                    type="button"
                                    className={`flex items-center justify-between gap-2 p-[8px] rounded-full bg-[#F6F2FF] text-[#0A1440] font-medium text-[14px] focus:outline-none border border-transparent ${filters.policyType ? 'ring-2 ring-[#7c3aed]/30' : ''}`}
                                    onClick={() => setOpenDropdown(openDropdown === 'policyType' ? '' : 'policyType')}
                                >
                                    {filters.policyType || 'Policy Type'}
                                    {filters.policyType && (
                                        <span
                                            className="ml-2 cursor-pointer hover:bg-[#E0D7FF] rounded-full p-1 flex items-center justify-center"
                                            onClick={e => {
                                                e.stopPropagation();
                                                handleFilterChange('policyType', '');
                                            }}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M6 6l8 8M6 14L14 6" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" /></svg>
                                        </span>
                                    )}
                                    <span className="ml-1">
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="#0A1440" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </span>
                                </button>
                                {openDropdown === 'policyType' && (
                                    <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-lg z-10 py-1">
                                        {['Monitor', 'Block'].map(option => (
                                            <button key={option} className="block w-full text-left px-4 py-2 hover:bg-[#F6F2FF] text-[#0A1440]" onClick={() => { handleFilterChange('policyType', option); setOpenDropdown(''); }}>{option}</button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* User */}
                            <div className="relative">
                                <button
                                    type="button"
                                    className={`flex items-center justify-between gap-2 p-[8px] rounded-full bg-[#F6F2FF] text-[#0A1440] font-medium text-[14px] focus:outline-none min-w-[120px] border border-transparent ${filters.user ? 'ring-2 ring-[#7c3aed]/30' : ''}`}
                                    onClick={() => setOpenDropdown(openDropdown === 'user' ? '' : 'user')}
                                >
                                    {filters.user || 'User'}
                                    {filters.user && (
                                        <span
                                            className="ml-2 cursor-pointer hover:bg-[#E0D7FF] rounded-full p-1 flex items-center justify-center"
                                            onClick={e => {
                                                e.stopPropagation();
                                                handleFilterChange('user', '');
                                            }}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M6 6l8 8M6 14L14 6" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" /></svg>
                                        </span>
                                    )}
                                    <span className="ml-1">
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="#0A1440" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </span>
                                </button>
                                {openDropdown === 'user' && (
                                    <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-lg z-10 py-1 max-h-48 overflow-y-auto">
                                        {['Anant', 'Emma', 'Ishan', 'Sarah', 'John', 'Admin', 'Mike', 'Lisa', 'Tom', 'Alex', 'Jenny', 'David', 'Kate', 'Root', 'Peter', 'Maria', 'Chris', 'External', 'Anna'].map(option => (
                                            <button key={option} className="block w-full text-left px-4 py-2 hover:bg-[#F6F2FF] text-[#0A1440]" onClick={() => { handleFilterChange('user', option); setOpenDropdown(''); }}>{option}</button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* Policy */}
                            <div className="relative">
                                <button
                                    type="button"
                                    className={`flex items-center justify-between gap-2 p-[8px] rounded-full bg-[#F6F2FF] text-[#0A1440] min-w-[140px] font-medium text-[14px] focus:outline-none border border-transparent ${filters.policy ? 'ring-2 ring-[#7c3aed]/30' : ''}`}
                                    onClick={() => setOpenDropdown(openDropdown === 'policy' ? '' : 'policy')}
                                >
                                    {filters.policy ? policyOptions.find(p => p.value === filters.policy)?.label : 'Policy'}
                                    {filters.policy && (
                                        <span
                                            className="ml-2 cursor-pointer hover:bg-[#E0D7FF] rounded-full p-1 flex items-center justify-center"
                                            onClick={e => {
                                                e.stopPropagation();
                                                handleFilterChange('policy', '');
                                            }}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M6 6l8 8M6 14L14 6" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" /></svg>
                                        </span>
                                    )}
                                    <span className="ml-1">
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="#0A1440" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </span>
                                </button>
                                {openDropdown === 'policy' && (
                                    <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-lg z-10 py-1 max-h-48 overflow-y-auto">
                                        {policyOptions.map(option => (
                                            <button key={option.value} className="block w-full text-left px-4 py-2 hover:bg-[#F6F2FF] text-[#0A1440]" onClick={() => { handleFilterChange('policy', option.value); setOpenDropdown(''); }}>{option.label}</button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>


                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#CCBAFF]">
                                        <th
                                            className="text-left py-3 px-4 text-sm font-medium text-black cursor-pointer hover:bg-gray-50"
                                            onClick={() => handleSort('severity')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Severity
                                                {getSortIcon('severity')}
                                            </div>
                                        </th>
                                        <th
                                            className="text-left py-3 px-4 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                                            onClick={() => handleSort('event')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Event
                                                {getSortIcon('event')}
                                            </div>
                                        </th>
                                        <th
                                            className="text-left py-3 px-4 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                                            onClick={() => handleSort('user')}
                                        >
                                            <div className="flex items-center gap-2">
                                                User
                                                {getSortIcon('user')}
                                            </div>
                                        </th>
                                        <th
                                            className="text-left py-3 px-4 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                                            onClick={() => handleSort('timestamp')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Timestamp
                                                {getSortIcon('timestamp')}
                                            </div>
                                        </th>
                                        <th
                                            className="text-left py-3 px-4 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                                            onClick={() => handleSort('policy')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Policy
                                                {getSortIcon('policy')}
                                            </div>
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Effect</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedDetections.map((detection, idx) => {
                                        const isSelected = selectedRows.has(detection.id);
                                        return (
                                            <tr
                                                key={detection.id}
                                                className={`
                                            transition-colors
                                            ${isSelected ? 'bg-[#F6F2FF] rounded-[12px]' : ''}
                                            hover:bg-[#F6F2FF] hover:rounded-[16px]
                                            ${idx === 0 ? 'first:rounded-t-[12px]' : ''}
                                            ${idx === displayedDetections.length - 1 ? 'last:rounded-b-[12px]' : ''}
                                          `}
                                                style={{ overflow: 'hidden' }}
                                            >
                                                <td className="py-4 px-4">
                                                    <span className={`inline-flex items-center px-[12px] py-[6px] rounded-full text-[14px] font-medium border border-[#EFE0FF]`}>
                                                        <div className={`${getSeverityColor(detection.severity)} w-[8px] h-[8px] rounded-[2px] mr-[8px]`}></div>
                                                        {detection.severity}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-gray-900 max-w-md">
                                                    <div className="truncate w-[180px]">{detection.event}</div>
                                                </td>
                                                <td className="py-4 px-4 w-[120px]">
                                                    <div className="flex items-center gap-2 w-[120px]">
                                                        <span className="text-sm text-gray-900">{detection.user}</span>
                                                        <span className="text-purple-600"><Image src="/link.png" alt="link" width={16} height={16} className='w-[16px] h-[16px]' /></span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-gray-600 whitespace-pre-line w-[120px]">
                                                    <div className="w-[120px]">
                                                        {detection.timestamp}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-gray-900">
                                                    {detection.policy}
                                                </td>
                                                <td className="py-4 px-4 w-[150px]">
                                                    <div className="flex items-center w-[90px] gap-2 rounded-[24px] border border-[#CCBAFF] px-[12px] py-[6px]">
                                                        {getEffectIcon(detection.effect)}
                                                        <span className="text-sm text-gray-900">{detection.effect}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            className="w-[20px]"
                                                            onClick={() => handleRowSelect(detection.id)}
                                                        >
                                                            <Image src="/menu.png" alt="menu" width={20} height={20} className="w-[20px] h-[20px] text-gray-500" />
                                                            {/* <MoreHorizontal className="w-4 h-4 text-gray-500" /> */}
                                                        </button>
                                                        <button className="w-[20px]">
                                                            <Image src="/download.png" alt="download" width={20} height={20} className="w-[20px] h-[20px] text-gray-500" />
                                                        </button>
                                                        <button className="w-[20px]">
                                                            <Image src="/share.png" alt="share" width={20} height={20} className="w-[20px] h-[20px] text-gray-500" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* View More Button */}
                        {!showMore && filteredDetections.length > 7 && (
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={() => setShowMore(true)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    View More
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* Selected Items Actions */}
                        {selectedRows.size > 0 && (
                            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-600">
                                        {selectedRows.size} item{selectedRows.size > 1 ? 's' : ''} selected
                                    </span>
                                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                                        Export
                                    </button>
                                    <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => setSelectedRows(new Set())}
                                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SecurityDetections;
