// detectionUtils.ts

export const policyOptions = [
  { value: 'Monitor_password_policy', label: 'Monitor Password Policy' },
  { value: 'block_brand_impersonating_login_form', label: 'Block Brand Impersonating' },
  { value: 'data_loss_prevention_policy', label: 'Data Loss Prevention' },
  { value: 'after_hours_access_policy', label: 'After Hours Access' },
  { value: 'brute_force_protection_policy', label: 'Brute Force Protection' },
  { value: 'secure_network_access_policy', label: 'Secure Network Access' },
  { value: 'data_access_monitoring_policy', label: 'Data Access Monitoring' },
  { value: 'mobile_device_access_policy', label: 'Mobile Device Access' },
  { value: 'privilege_escalation_detection_policy', label: 'Privilege Escalation Detection' },
  { value: 'personal_data_export_policy', label: 'Personal Data Export' },
  { value: 'geolocation_monitoring_policy', label: 'Geolocation Monitoring' },
  { value: 'external_sharing_policy', label: 'External Sharing' },
  { value: 'system_integrity_monitoring_policy', label: 'System Integrity Monitoring' },
  { value: 'source_code_security_policy', label: 'Source Code Security' },
  { value: 'document_access_logging_policy', label: 'Document Access Logging' },
  { value: 'software_installation_policy', label: 'Software Installation' },
  { value: 'web_application_firewall_policy', label: 'Web Application Firewall' },
  { value: 'sensitive_data_access_policy', label: 'Sensitive Data Access' },
];

export const initialDetections = [
    {
      id: 1,
      severity: 'Informational',
      event: 'User anant@org.com attempted to access www.reddit.com via Chrome browser',
      user: 'Anant',
      timestamp: '8th June 2025\n12:28:41 PM',
      policy: 'Monitor_password_policy',
      effect: 'Allow'
    },
    {
      id: 2,
      severity: 'Informational',
      event: 'User anant@org.c attempted to access www.reddit.com via Chrome browser',
      user: 'Anant',
      timestamp: '8th July 2025\n12:28:41 PM',
      policy: 'monitor_sitevisit_new_sites_policy',
      effect: 'Allow'
    },
    {
      id: 3,
      severity: 'Critical',
      event: 'User ishan@cauro.com attempted to access www.reddit.com via Chrome browser',
      user: 'Emma',
      timestamp: '3rd June 2025\n12:28:41 PM',
      policy: 'block_brand_impersonating_login_form',
      effect: 'Block'
    },
    {
      id: 4,
      severity: 'Critical',
      event: 'User ishan@website.com attempted to access www.reddit.com via Chrome browser',
      user: 'Ishan',
      timestamp: '3rd June 2025\n12:28:41 PM',
      policy: 'block_brand_impersonating_login_form',
      effect: 'Block'
    },
    {
      id: 5,
      severity: 'High',
      event: 'User sarah@company.com uploaded sensitive file to personal cloud storage',
      user: 'Sarah',
      timestamp: '5th June 2025\n09:15:22 AM',
      policy: 'data_loss_prevention_policy',
      effect: 'Warn'
    },
    {
      id: 6,
      severity: 'Medium',
      event: 'User john@corp.com accessed restricted database after hours',
      user: 'John',
      timestamp: '4th June 2025\n11:45:18 PM',
      policy: 'after_hours_access_policy',
      effect: 'Allow'
    },
    {
      id: 7,
      severity: 'Critical',
      event: 'Multiple failed login attempts detected for admin@system.com',
      user: 'Admin',
      timestamp: '2nd June 2025\n02:33:55 AM',
      policy: 'brute_force_protection_policy',
      effect: 'Block'
    },
    {
      id: 8,
      severity: 'High',
      event: 'User mike@dev.com attempted to access production server from unsecured network',
      user: 'Mike',
      timestamp: '6th June 2025\n03:22:10 PM',
      policy: 'secure_network_access_policy',
      effect: 'Block'
    },
    {
      id: 9,
      severity: 'Informational',
      event: 'User lisa@marketing.com downloaded customer database backup',
      user: 'Lisa',
      timestamp: '7th June 2025\n10:30:45 AM',
      policy: 'data_access_monitoring_policy',
      effect: 'Allow'
    },
    {
      id: 10,
      severity: 'Medium',
      event: 'User tom@finance.com accessed payroll system from mobile device',
      user: 'Tom',
      timestamp: '5th June 2025\n08:20:33 AM',
      policy: 'mobile_device_access_policy',
      effect: 'Warn'
    },
    {
      id: 11,
      severity: 'Critical',
      event: 'User alex@contractor.com attempted privilege escalation on critical system',
      user: 'Alex',
      timestamp: '1st June 2025\n04:15:27 PM',
      policy: 'privilege_escalation_detection_policy',
      effect: 'Block'
    },
    {
      id: 12,
      severity: 'High',
      event: 'User jenny@hr.com exported employee personal data without approval',
      user: 'Jenny',
      timestamp: '3rd June 2025\n01:45:12 PM',
      policy: 'personal_data_export_policy',
      effect: 'Block'
    },
    {
      id: 13,
      severity: 'Informational',
      event: 'User david@sales.com accessed CRM system from new location',
      user: 'David',
      timestamp: '6th June 2025\n09:12:08 AM',
      policy: 'geolocation_monitoring_policy',
      effect: 'Allow'
    },
    {
      id: 14,
      severity: 'Medium',
      event: 'User kate@support.com shared customer tickets via external email',
      user: 'Kate',
      timestamp: '4th June 2025\n02:55:41 PM',
      policy: 'external_sharing_policy',
      effect: 'Warn'
    },
    {
      id: 15,
      severity: 'Critical',
      event: 'User root@server.com detected unusual system modifications',
      user: 'Root',
      timestamp: '2nd June 2025\n11:20:15 PM',
      policy: 'system_integrity_monitoring_policy',
      effect: 'Block'
    },
    {
      id: 16,
      severity: 'High',
      event: 'User peter@dev.com committed code with hardcoded credentials',
      user: 'Peter',
      timestamp: '7th June 2025\n04:33:28 PM',
      policy: 'source_code_security_policy',
      effect: 'Block'
    },
    {
      id: 17,
      severity: 'Informational',
      event: 'User maria@legal.com accessed confidential legal documents',
      user: 'Maria',
      timestamp: '5th June 2025\n11:18:52 AM',
      policy: 'document_access_logging_policy',
      effect: 'Allow'
    },
    {
      id: 18,
      severity: 'Medium',
      event: 'User chris@ops.com installed unauthorized software on workstation',
      user: 'Chris',
      timestamp: '3rd June 2025\n03:40:17 PM',
      policy: 'software_installation_policy',
      effect: 'Warn'
    },
    {
      id: 19,
      severity: 'Critical',
      event: 'User hacker@external.com attempted SQL injection on web application',
      user: 'External',
      timestamp: '1st June 2025\n06:25:44 AM',
      policy: 'web_application_firewall_policy',
      effect: 'Block'
    },
    {
      id: 20,
      severity: 'High',
      event: 'User anna@finance.com accessed financial reports outside business hours',
      user: 'Anna',
      timestamp: '6th June 2025\n10:45:33 PM',
      policy: 'sensitive_data_access_policy',
      effect: 'Warn'
    }
  ];