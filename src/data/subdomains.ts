import { Subdomain } from "@/types/nice";

/**
 * The full sub-domain breakdown across all 5 NICE v2.2.0 Work Role
 * Categories. Each sub-domain maps to one or more official NICE work roles
 * and lists the concrete topics a user rates themselves against as a whole
 * (Stage 1 self-attestation), matching the granularity of the source
 * worksheet rather than the broad parent domain.
 */
export const SUBDOMAINS: Subdomain[] = [
  /* ---------------------------- Design & Development (DD) ---------------------------- */
  {
    id: "DD-A",
    domainId: "DD",
    title: "Security & Enterprise Architecture",
    workRoles: [
      { code: "DD-WRL-001", name: "Cybersecurity Architecture" },
      { code: "DD-WRL-002", name: "Enterprise Architecture" },
    ],
    topics: [
      "Zero-trust architecture; network segmentation & micro-segmentation design",
      "IAM architecture: OAuth2/OIDC, SAML, federation, privileged access design",
      "PKI, certificate lifecycle, key management (KMS/HSM), crypto selection",
      "Cloud architecture: landing zones, account/subscription strategy, hybrid & multi-cloud",
      "API and service-to-service security design (gateways, mTLS, service mesh)",
      "Threat modeling at design time (STRIDE, attack trees, abuse cases)",
      "Reference architectures & frameworks (SABSA, TOGAF, CSA, well-architected)",
      "Resilience & availability design: HA, DR, failure domains",
    ],
  },
  {
    id: "DD-B",
    domainId: "DD",
    title: "Secure Build (Software, Systems & OT)",
    workRoles: [
      { code: "DD-WRL-003", name: "Secure Software Development" },
      { code: "DD-WRL-004", name: "Secure Systems Development" },
      { code: "DD-WRL-009", name: "OT Cybersecurity Engineering" },
    ],
    topics: [
      "Secure coding: OWASP Top 10, input validation, authz logic, memory safety",
      "Secrets management in code & pipelines (vaults, rotation, no-hardcoding)",
      "CI/CD pipeline security: signed commits/artifacts, build integrity (SLSA)",
      "Infrastructure-as-Code security (Terraform/CloudFormation scanning, drift)",
      "Container & Kubernetes hardening (images, admission control, runtime policy)",
      "SDLC security integration: requirements → design → build → release gates",
      "OT/ICS engineering: Purdue model, PLC/SCADA, safety-vs-security trade-offs ← rate separately in free text if needed",
    ],
  },
  {
    id: "DD-C",
    domainId: "DD",
    title: "Assess & Verify",
    workRoles: [
      { code: "DD-WRL-005", name: "Software Security Assessment" },
      { code: "DD-WRL-007", name: "Systems Testing & Evaluation" },
    ],
    topics: [
      "SAST / DAST / IAST / SCA tooling: selection, tuning, triage of findings",
      "Manual code review for security; secure design review",
      "Penetration test scoping, methodology (PTES/OWASP), interpreting results",
      "Fuzzing and negative testing",
      "Security test planning: acceptance criteria, traceability to requirements",
      "Verification evidence for audits / certification (e.g., Common Criteria awareness)",
    ],
  },
  {
    id: "DD-D",
    domainId: "DD",
    title: "Requirements & Technology R&D",
    workRoles: [
      { code: "DD-WRL-006", name: "Systems Requirements Planning" },
      { code: "DD-WRL-008", name: "Technology R&D" },
    ],
    topics: [
      "Eliciting & writing security requirements; translating compliance to controls",
      "Requirements traceability & baselines (SP 800-160 style engineering processes)",
      "Evaluating emerging tech for adoption (build/buy, security due diligence)",
      "Prototyping & proof-of-concept security research",
      "Vulnerability research fundamentals (understanding, not necessarily performing)",
    ],
  },

  /* ---------------------------- Implementation & Operation (IO) ---------------------------- */
  {
    id: "IO-A",
    domainId: "IO",
    title: "Network Operations",
    workRoles: [{ code: "IO-WRL-004", name: "Network Operations" }],
    topics: [
      "TCP/IP stack, subnetting, VLANs, NAT in depth",
      "Routing & switching: OSPF, BGP, spanning tree",
      "DNS, DHCP, NTP operation and security",
      "Firewalls, proxies, VPN (IPsec/SSL), TLS termination, load balancers",
      "Wireless & NAC (802.1X)",
      "Network monitoring: NetFlow, packet capture & analysis (Wireshark), SNMP",
      "SD-WAN / SDN and cloud networking (VPC/VNet, peering, private endpoints)",
    ],
  },
  {
    id: "IO-B",
    domainId: "IO",
    title: "Systems & Database Administration",
    workRoles: [
      { code: "IO-WRL-005", name: "Systems Administration" },
      { code: "IO-WRL-002", name: "Database Administration" },
      { code: "IO-WRL-003", name: "Knowledge Management" },
    ],
    topics: [
      "Windows administration: Active Directory, GPO, Kerberos, Entra ID",
      "Linux administration: services, permissions, systemd, shell",
      "Hardening baselines (CIS Benchmarks, STIGs) and patch management",
      "Virtualization & storage administration",
      "Database administration: SQL/NoSQL, access control, encryption at rest, backups",
      "Backup / restore / recovery operations",
      "Identity lifecycle operations (joiner-mover-leaver, provisioning)",
    ],
  },
  {
    id: "IO-C",
    domainId: "IO",
    title: "Systems Security Analysis",
    workRoles: [{ code: "IO-WRL-006", name: "Systems Security Analysis" }],
    topics: [
      "Security configuration review & hardening validation",
      "EDR/AV platform operation and policy tuning",
      "Log architecture: what to collect, retention, forwarding, SIEM onboarding",
      "Certificate & key operational management (renewals, incidents)",
      "Integrating security requirements into day-2 operations & change management",
      "Operational metrics & compliance reporting from live systems",
    ],
  },
  {
    id: "IO-D",
    domainId: "IO",
    title: "Data Analysis & Technical Support",
    workRoles: [
      { code: "IO-WRL-001", name: "Data Analysis" },
      { code: "IO-WRL-007", name: "Technical Support" },
    ],
    topics: [
      "SQL for investigation & reporting",
      "Scripting for automation: Python, PowerShell, Bash",
      "Security data pipelines & dashboards (KQL/SPL, Grafana/PowerBI style)",
      "Data quality, normalization, enrichment of security telemetry",
      "Structured troubleshooting & escalation practice",
    ],
  },

  /* ---------------------------- Protection & Defense (PD) ---------------------------- */
  {
    id: "PD-A",
    domainId: "PD",
    title: "Defensive Operations / SOC",
    workRoles: [
      { code: "PD-WRL-001", name: "Defensive Cybersecurity" },
      { code: "PD-WRL-004", name: "Infrastructure Support" },
    ],
    topics: [
      "SIEM operation & detection engineering (rule writing, tuning, coverage mapping)",
      "Alert triage workflow; MITRE ATT&CK-based analysis",
      "IDS/IPS, email security, web filtering operation",
      "Threat hunting methodology (hypothesis-driven, data-driven)",
      "SOAR & automation of response playbooks",
      "Defense infrastructure upkeep: sensors, agents, telemetry health",
    ],
  },
  {
    id: "PD-B",
    domainId: "PD",
    title: "Incident Response & Digital Forensics",
    workRoles: [
      { code: "PD-WRL-003", name: "Incident Response" },
      { code: "PD-WRL-002", name: "Digital Forensics" },
    ],
    topics: [
      "IR lifecycle (NIST SP 800-61): detection → containment → eradication → recovery",
      "Containment strategy decisions (isolate vs. observe, business trade-offs)",
      "Playbooks, severity classification, escalation & comms during incidents",
      "Disk & memory forensics; forensic acquisition and chain of custody",
      "Malware triage (static/dynamic basics, sandboxing)",
      "Timeline analysis & root-cause reconstruction; post-incident review",
      "Tabletop exercises & IR program maturity",
    ],
  },
  {
    id: "PD-C",
    domainId: "PD",
    title: "Vulnerability Analysis & Management",
    workRoles: [{ code: "PD-WRL-007", name: "Vulnerability Analysis" }],
    topics: [
      "Scanning platforms (Nessus/Qualys/cloud-native), authenticated vs. not",
      "Prioritization: CVSS, EPSS, KEV, asset criticality, reachability",
      "Vulnerability-to-patch workflow, SLAs, exception handling",
      "Cloud misconfiguration assessment (CSPM) & attack surface management",
      "Interpreting pentest/red-team output into remediation programs",
      "Reporting & metrics (MTTR, exposure windows, risk-based views)",
    ],
  },
  {
    id: "PD-D",
    domainId: "PD",
    title: "Threat & Insider Threat Analysis",
    workRoles: [
      { code: "PD-WRL-006", name: "Threat Analysis" },
      { code: "PD-WRL-005", name: "Insider Threat Analysis" },
    ],
    topics: [
      "CTI lifecycle: collection, processing, analysis, dissemination",
      "IOC vs. TTP analysis; pivoting & enrichment; intel platforms (MISP/TIP)",
      "Threat actor profiling & campaign tracking; attribution caution",
      "Intel requirements & stakeholder-driven reporting",
      "Insider threat indicators, UEBA, program & privacy considerations",
    ],
  },

  /* ---------------------------- Investigation (IN) ---------------------------- */
  {
    id: "IN-A",
    domainId: "IN",
    title: "Cybercrime Investigation",
    workRoles: [{ code: "IN-WRL-001", name: "Cybercrime Investigation" }],
    topics: [
      "Investigative process & case management",
      "Legal constraints: authority, jurisdiction, admissibility, privacy limits",
      "Working with law enforcement & legal counsel",
      "Fraud / BEC / account-takeover investigations",
      "OSINT techniques and their legal/ethical boundaries",
      "Interview & evidence-gathering discipline",
    ],
  },
  {
    id: "IN-B",
    domainId: "IN",
    title: "Digital Evidence Analysis",
    workRoles: [{ code: "IN-WRL-002", name: "Digital Evidence Analysis" }],
    topics: [
      "Forensic imaging & verification (write blockers, hashing)",
      "File system internals & artifact analysis (registry, logs, browser, cloud artifacts)",
      "Mobile device forensics awareness",
      "Network forensics: PCAP reconstruction, flow analysis",
      "eDiscovery & legal hold processes",
      "Expert reporting: writing findings for legal/HR proceedings",
    ],
  },

  /* ---------------------------- Oversight & Governance (OG) ---------------------------- */
  {
    id: "OG-A",
    domainId: "OG",
    title: "Strategy, Policy & Leadership",
    workRoles: [
      { code: "OG-WRL-*", name: "Cybersecurity Policy & Planning" },
      { code: "OG-WRL-*", name: "Executive Cybersecurity Leadership" },
    ],
    topics: [
      "Security strategy development & alignment to business objectives",
      "Policy / standard / procedure hierarchy: authoring & lifecycle",
      "Board & executive reporting; security metrics/KPIs that matter",
      "Budgeting, resourcing, and building a security roadmap",
      "Security culture & organizational influence",
    ],
  },
  {
    id: "OG-B",
    domainId: "OG",
    title: "Risk Management & Compliance",
    workRoles: [
      { code: "OG-WRL-*", name: "Risk Management" },
      { code: "OG-WRL-*", name: "Security Control Assessment" },
      { code: "OG-WRL-*", name: "Systems Authorization" },
      { code: "OG-WRL-*", name: "Privacy Compliance" },
      { code: "OG-WRL-*", name: "Legal Advice" },
    ],
    topics: [
      "Risk frameworks: NIST RMF / CSF, ISO 27001/27005, FAIR basics",
      "Risk registers, risk acceptance, exceptions with named owners",
      "Control assessment & internal audit; evidence management",
      "Regulatory landscape: GDPR/CCPA, HIPAA, PCI DSS, SOX, DORA/NIS2 awareness",
      "SOC 2 / ISO certification processes; systems authorization (ATO) concepts",
      "Privacy program operations (DPIAs, data mapping, breach notification duties)",
    ],
  },
  {
    id: "OG-C",
    domainId: "OG",
    title: "Program, Project & Supply Chain Management",
    workRoles: [
      { code: "OG-WRL-*", name: "Program Management" },
      { code: "OG-WRL-*", name: "Project Management" },
      { code: "OG-WRL-*", name: "Product Support Management" },
      { code: "OG-WRL-*", name: "Cybersecurity Supply Chain Risk Management" },
    ],
    topics: [
      "Security program design & maturity models (e.g., CMMI-style, NIST CSF tiers)",
      "Project management of security initiatives (scope, stakeholders, delivery)",
      "Third-party / vendor risk management (TPRM), contracts & SLA security terms",
      "C-SCRM: supplier assessment, SBOM policy, hardware/software provenance",
      "M&A security due diligence awareness",
    ],
  },
  {
    id: "OG-D",
    domainId: "OG",
    title: "Workforce, Training & Awareness",
    workRoles: [
      { code: "OG-WRL-*", name: "Workforce Management" },
      { code: "OG-WRL-*", name: "Curriculum Development" },
      { code: "OG-WRL-*", name: "Instruction" },
    ],
    topics: [
      "Security awareness program design & phishing simulation programs",
      "Technical training curriculum development & delivery",
      "Workforce planning with skills frameworks (including NICE itself)",
      "Role design, hiring input, team development & mentoring",
    ],
  },
];

export function getSubdomainsByDomain(domainId: string): Subdomain[] {
  return SUBDOMAINS.filter((s) => s.domainId === domainId);
}
