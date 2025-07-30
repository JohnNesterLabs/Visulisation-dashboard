import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  User, 
  Globe, 
  Shield, 
  ChevronLeft, 
  ChevronRight, 
  Settings,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Lock,
  Maximize2,
  Eye,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Search,
  FileText
} from 'lucide-react';

// TypeScript types for node and connection
interface AttackNode {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  icon: React.ElementType;
  status: string;
}

interface AttackConnection {
  from: string;
  to: string;
  action: string;
  style: string;
}

const AttackGraph = () => {
  const [selectedTab, setSelectedTab] = useState('Attack Graph');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<AttackNode | null>(null);
  const [showDetails, setShowDetails] = useState(true);
    const [showAttackOverview, setShowAttackOverview] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
    policyResults: true,
    websites: true,
    users: true
  });
  const graphRef = useRef(null);

  const tabs = ['Attack Graph', 'Details', 'Recommended Actions', 'Related Attacks', 'Sqrx AI'];

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (graphRef.current && (e.target === graphRef.current || (e.target as HTMLElement).closest('.attack-graph-container'))) {
      setIsPanning(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  // handleMouseMove and handleMouseUp with useCallback to fix lint
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isPanning, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  const handleReset = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };
  
const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const nodes: AttackNode[] = [
    {
      id: 'user',
      type: 'user',
      label: 'anant@organization.com',
      x: 150,
      y: 300,
      icon: User,
      status: 'initial'
    },
    {
      id: 'asana',
      type: 'service',
      label: 'app.asana.com',
      x: 400,
      y: 350,
      icon: Globe,
      status: 'compromised'
    },
    {
      id: 'reddit',
      type: 'service',
      label: 'reddit.com',
      x: 650,
      y: 450,
      icon: Globe,
      status: 'accessed'
    },
    {
      id: 'policy',
      type: 'policy',
      label: 'Policy: Site Visit',
      x: 850,
      y: 520,
      icon: Shield,
      status: 'allowed'
    }
  ];

  const connections: AttackConnection[] = [
    { from: 'user', to: 'asana', action: 'Typed', style: 'solid' },
    { from: 'asana', to: 'reddit', action: 'Click', style: 'solid' },
    { from: 'reddit', to: 'policy', action: '', style: 'dotted' }
  ];

  // NodeComponent with proper props typing
  interface NodeComponentProps {
    node: AttackNode;
    isSelected: boolean;
    onClick: (node: AttackNode) => void;
  }
  const NodeComponent: React.FC<NodeComponentProps> = ({ node, isSelected, onClick }) => {
    const Icon = node.icon;
    const getNodeColor = () => {
      switch (node.status) {
        case 'initial': return 'bg-blue-100 border-blue-300';
        case 'compromised': return 'bg-red-100 border-red-300';
        case 'accessed': return 'bg-orange-100 border-orange-300';
        case 'allowed': return 'bg-green-100 border-green-300';
        default: return 'bg-gray-100 border-gray-300';
      }
    };

    const getIconColor = () => {
      switch (node.status) {
        case 'initial': return 'text-blue-600';
        case 'compromised': return 'text-red-600';
        case 'accessed': return 'text-orange-600';
        case 'allowed': return 'text-green-600';
        default: return 'text-gray-600';
      }
    };

    return (
      <div
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
          isSelected ? 'scale-110' : 'hover:scale-105'
        }`}
        style={{ left: node.x, top: node.y }}
        onClick={() => onClick(node)}
      >
        <div className={`w-16 h-16 rounded-full border-2 ${getNodeColor()} flex items-center justify-center shadow-lg ${
          isSelected ? 'ring-4 ring-blue-300' : ''
        }`}>
          <Icon className={`w-8 h-8 ${getIconColor()}`} />
        </div>
        <div className="mt-2 bg-white px-3 py-1 rounded-full shadow-md border text-sm font-medium text-gray-700 whitespace-nowrap">
          {node.label}
        </div>
      </div>
    );
  };

  // ConnectionLine with proper props typing
  interface ConnectionLineProps {
    connection: AttackConnection;
  }
  const ConnectionLine: React.FC<ConnectionLineProps> = ({ connection }) => {
    const fromNode = nodes.find(n => n.id === connection.from);
    const toNode = nodes.find(n => n.id === connection.to);
    
    if (!fromNode || !toNode) return null;

    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const angle = Math.atan2(dy, dx);
    // const length = Math.sqrt(dx * dx + dy * dy) - 64; // Removed unused variable

    const startX = fromNode.x + Math.cos(angle) * 32;
    const startY = fromNode.y + Math.sin(angle) * 32;
    const endX = toNode.x - Math.cos(angle) * 32;
    const endY = toNode.y - Math.sin(angle) * 32;

    return (
      <g>
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="#8B5CF6"
          strokeWidth="3"
          strokeDasharray={connection.style === 'dotted' ? '8 4' : 'none'}
          markerEnd="url(#arrowhead)"
        />
        {connection.action && (
          <text
            x={(startX + endX) / 2}
            y={(startY + endY) / 2 - 10}
            textAnchor="middle"
            className="fill-purple-600 text-sm font-medium"
            style={{ fontSize: '12px' }}
          >
            {connection.action}
          </text>
        )}
      </g>
    );
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
                <img src="/setting.png" alt="setting" className='w-6 h-6' />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[500px]">
        {/* Graph Area */}
        <div className="flex-1 relative bg-white">
          {/* Controls */}
          <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
            <button 
              onClick={handleZoomIn}
              className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button 
              onClick={handleZoomOut}
              className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button 
              onClick={handleReset}
              className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
              <Lock className="w-4 h-4" />
            </button>
            <button className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Graph Container */}
          <div 
            ref={graphRef}
            className="w-full h-full overflow-hidden cursor-grab attack-graph-container"
            onMouseDown={handleMouseDown}
            style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
          >
            <div
              className="relative w-full h-full"
              style={{
                transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                transformOrigin: 'center center'
              }}
            >
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ overflow: 'visible' }}
              >
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill="#8B5CF6" />
                  </marker>
                </defs>
                {connections.map((connection, index) => (
                  <ConnectionLine key={index} connection={connection} />
                ))}
              </svg>

              {nodes.map((node) => (
                <NodeComponent
                  key={node.id}
                  node={node}
                  isSelected={selectedNode?.id === node.id}
                  onClick={setSelectedNode}
                />
              ))}
            </div>
          </div>

          {/* Status Badge */}
          <div className="absolute bottom-6 right-6 bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium border border-green-200">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Allowed at 9th July 2025 03:58:31 PM
          </div>
        </div>

        {/* Details Panel */}
        {showDetails && selectedNode && (
          <div className="w-80 bg-white border-l border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Node Details</h3>
              <button 
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Type</label>
                <p className="text-sm text-gray-900 capitalize">{selectedNode.type}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Label</label>
                <p className="text-sm text-gray-900">{selectedNode.label}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <p className="text-sm text-gray-900 capitalize">{selectedNode.status}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Position</label>
                <p className="text-sm text-gray-900">X: {selectedNode.x}, Y: {selectedNode.y}</p>
              </div>
              
              {selectedNode.status === 'allowed' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    This action was allowed by the security policy at 9th July 2025 03:58:31 PM
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
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