import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Eye,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Search,
  FileText
} from 'lucide-react';
import SkillChart from '../SkillChart/SkillChart';
import Image from 'next/image';

const AttackGraph = () => {
  const [selectedTab, setSelectedTab] = useState('Attack Graph');
  const [showAttackOverview, setShowAttackOverview] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    policyResults: true,
    websites: true,
    users: true
  });

  const tabs = ['Attack Graph', 'Details', 'Recommended Actions', 'Related Attacks', 'Sqrx AI'];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className=" bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Suspicious File Download from Unknown Source
            </h1>
          </div>
          <div className="flex items-center space-x-3 font-bold text-[18px] text-black">
            <span className='mr-[12px]'><strong className='text-[#642CFD]'>2</strong> of 5578</span>
            <button className="p-1 hover:bg-gray-100 rounded-[6px] w-[40px] h-[40px] border border-[#CBD5E1] flex items-center justify-center cursor-pointer mr-[12px]">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded-[6px] w-[40px] h-[40px] border border-[#CBD5E1] flex items-center justify-center cursor-pointer">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-[16px] text-black cursor-pointer transition-colors ${
                  selectedTab === tab
                    ? 'border-black text-black'
                    : 'border-transparent text-black hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Time Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            08.07.25<br />03:10:40 pm
          </div>
          
          <div className="flex-1 mx-8 relative">
            <div className="h-2 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 rounded-full">
              <div className="absolute top-0 left-1/4 w-1 h-2 bg-blue-500 rounded-full"></div>
              <div className="absolute top-0 left-2/4 w-1 h-2 bg-purple-500 rounded-full"></div>
              <div className="absolute top-0 left-3/4 w-1 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-1 hover:bg-gray-100 rounded">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-sm text-gray-600 text-center">
              08.07.25<br />05:32:50:11 pm
            </div>
            <button className="p-1 hover:bg-gray-100 rounded">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button 
             onClick={() => setShowAttackOverview(!showAttackOverview)}
            className="p-3 hover:bg-gray-100 rounded-[16px] border border-[#DDE1E6] cursor-pointer">
                <Image src="/setting.png" alt="setting" width={24} height={24} className='w-6 h-6' />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[500px]">
        {/* Graph Area */}
           <SkillChart/>
      </div>

        {/* Attack Overview Popup */}
      {showAttackOverview && (
        <div className="absolute top-16 right-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-80 max-h-[70vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Attack Overview</h2>
              <button 
                onClick={() => setShowAttackOverview(false)}
                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                <ArrowRight className="w-3 h-3 text-gray-600" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-9 pr-3 py-2 bg-gray-100 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm"
                />
              </div>

              {/* Event Description */}
              <div className="mb-4">
                <h3 className="text-[14px] font-medium text-[#A2A9B0] mb-2">Event</h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  User <span className="text-[#8959A9] underline cursor-pointer">anant@organization.com</span> visited 
                  the site <span className="text-[#8959A9] underline cursor-pointer">www.reddit.com</span> via a link 
                  from <span className="text-[#8959A9] underline cursor-pointer">app.asana.com</span>, and the action 
                  was allowed by SquareX policy{' '}
                  <span className="text-[#8959A9] underline cursor-pointer">
                    Monitor_sitevisit_newssites_policy
                  </span>
                </p>
              </div>

              {/* Severity */}
              <div className="mb-4">
                <h3 className="text-[14px] font-medium text-[#A2A9B0] mb-2">Severity</h3>
                <div className="inline-flex items-center px-[12px] py-[6px] rounded-[24px] bg-white text-black text-[14px] font-medium border border-[#EFE0FF]">
                  <div className="w-[8px] h-[8px] rounded-[2px] bg-[#4A98E7] mr-1.5"></div>
                  Informational
                </div>
              </div>

              {/* Nodes Section */}
              <div className="space-y-3">
                <h3 className="text-[14px] font-medium text-[#A2A9B0]">Nodes</h3>

                {/* Policy Results */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection('policyResults')}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 text-left cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-900 text-sm">Policy Results</span>
                      <div className="w-5 h-5 rounded-full bg-[#D8B4FE] text-black text-xs font-medium flex items-center justify-center">
                        1
                      </div>
                      <Eye className="w-3 h-3 text-gray-400" />
                    </div>
                    <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${
                      expandedSections.policyResults ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {expandedSections.policyResults && (
                    <div className="border-t border-gray-200">
                      <div className="flex items-center justify-between p-3 pl-9 hover:bg-gray-50">
                        <span className="text-gray-700 text-sm">1. Allow</span>
                        <Eye className="w-3 h-3 text-gray-400" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Websites */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection('websites')}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 text-left cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-900 text-sm">Websites</span>
                      <div className="w-5 h-5 rounded-full bg-[#D8B4FE] text-black text-xs font-medium flex items-center justify-center">
                        2
                      </div>
                      <Eye className="w-3 h-3 text-gray-400" />
                    </div>
                    <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${
                      expandedSections.websites ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {expandedSections.websites && (
                    <div className="border-t border-gray-200">
                      <div className="flex items-center justify-between p-3 pl-9 hover:bg-gray-50">
                        <span className="text-gray-700 text-sm">1. www.reddit.com</span>
                        <Eye className="w-3 h-3 text-gray-400" />
                      </div>
                      <div className="flex items-center justify-between p-3 pl-9 hover:bg-gray-50 border-t border-gray-100">
                        <span className="text-gray-700 text-sm">2. app.asana.com</span>
                        <Eye className="w-3 h-3 text-gray-400" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Users */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection('users')}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 text-left cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-900 text-sm">Users</span>
                      <div className="w-5 h-5 rounded-full bg-[#D8B4FE] text-xs text-black font-medium flex items-center justify-center">
                        1
                      </div>
                      <Eye className="w-3 h-3 text-gray-400" />
                    </div>
                    <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${
                      expandedSections.users ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {expandedSections.users && (
                    <div className="border-t border-gray-200">
                      <div className="flex items-center justify-between p-3 pl-9 hover:bg-gray-50">
                        <span className="text-gray-700 text-sm">1. anant@organization.com</span>
                        <Eye className="w-3 h-3 text-gray-400" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Less Button */}
      <div className="bg-white border-t border-gray-200 px-6 py-3">
        <button className="flex items-center justify-center w-full text-gray-500 hover:text-gray-700 text-sm">
          <span>View Less</span>
          <ChevronUp className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default AttackGraph;