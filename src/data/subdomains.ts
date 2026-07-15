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
      {
        label: "Zero-trust architecture; network segmentation & micro-segmentation design",
        description: "Have you designed trust boundaries between user, workload, and admin paths instead of relying on a flat internal network? Think of producing segmentation diagrams, firewall matrices, or micro-segmentation policies for data centers or Kubernetes namespaces and validating them with allowed-flow testing.",
      },
      {
        label: "IAM architecture: OAuth2/OIDC, SAML, federation, privileged access design",
        description: "Have you implemented OAuth2/OIDC or SAML flows, mapped federation between identity providers, and documented privileged access patterns for humans and service accounts? This includes choosing token types, session lifetimes, step-up MFA, break-glass access, and reviewing role or claim design in systems like Entra ID, Okta, or Keycloak.",
      },
      {
        label: "PKI, certificate lifecycle, key management (KMS/HSM), crypto selection",
        description: "Have you stood up or operated certificate issuance, renewal, and revocation workflows using an internal CA, ACM, cert-manager, KMS, or HSM-backed keys? This also covers choosing algorithms and key sizes, separating signing vs. encryption keys, and planning rotations before expirations or incidents.",
      },
      {
        label: "Cloud architecture: landing zones, account/subscription strategy, hybrid & multi-cloud",
        description: "Have you defined landing zones with account or subscription boundaries, shared services, guardrails, and network patterns for AWS, Azure, or GCP? Examples include designing IAM boundaries, centralized logging, transit connectivity, and policies for hybrid or multi-cloud connectivity.",
      },
      {
        label: "API and service-to-service security design (gateways, mTLS, service mesh)",
        description: "Have you specified how APIs authenticate callers, authorize scopes, and protect east-west traffic with mTLS, service meshes, or gateway policies? Concrete work includes writing auth patterns for REST or gRPC services, rate-limit rules, JWT validation requirements, and secret distribution for service identities.",
      },
      {
        label: "Threat modeling at design time (STRIDE, attack trees, abuse cases)",
        description: "Have you run STRIDE or abuse-case sessions with engineers and turned the output into architecture changes or backlog items? Useful artifacts include data-flow diagrams, attack trees, misuse stories, and tracked mitigations for high-risk trust boundaries.",
      },
      {
        label: "Reference architectures & frameworks (SABSA, TOGAF, CSA, well-architected)",
        description: "Have you used SABSA, TOGAF, CSA guidance, or cloud well-architected frameworks to create reusable security patterns teams can adopt? This often means publishing reference diagrams, baseline control sets, and exception criteria for common workloads like web apps, data platforms, or identity services.",
      },
      {
        label: "Resilience & availability design: HA, DR, failure domains",
        description: "Have you designed for component failure by setting HA patterns, recovery targets, and disaster recovery runbooks? Examples include multi-AZ deployment plans, backup and restore validation, failover testing, and documenting how systems behave when a region, dependency, or identity provider goes down.",
      },
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
      {
        label: "Secure coding: OWASP Top 10, input validation, authz logic, memory safety",
        description: "Have you found and fixed OWASP Top 10 issues in real code, such as broken authz checks, injection bugs, insecure deserialization, or unsafe memory handling? Practical evidence includes pull requests, secure coding guidelines, unit tests for abuse cases, or using languages and tooling that reduce memory safety risk.",
      },
      {
        label: "Secrets management in code & pipelines (vaults, rotation, no-hardcoding)",
        description: "Have you removed hardcoded secrets from repos and moved them into Vault, AWS Secrets Manager, Azure Key Vault, or Kubernetes secrets with rotation? This includes wiring CI/CD to fetch short-lived credentials, scanning for leaked tokens, and documenting emergency revocation steps.",
      },
      {
        label: "CI/CD pipeline security: signed commits/artifacts, build integrity (SLSA)",
        description: "Have you hardened a build pipeline so source, dependencies, and artifacts are trustworthy end to end? Examples include branch protection, signed commits or images, provenance attestations, artifact integrity checks, and mapping controls to SLSA levels.",
      },
      {
        label: "Infrastructure-as-Code security (Terraform/CloudFormation scanning, drift)",
        description: "Have you reviewed Terraform or CloudFormation changes for overly broad IAM, exposed storage, or risky network paths before deployment? Hands-on work includes running tfsec, Checkov, or cloud-native scanners, comparing desired state to actual drift, and blocking noncompliant plans in CI.",
      },
      {
        label: "Container & Kubernetes hardening (images, admission control, runtime policy)",
        description: "Have you built hardened images, enforced admission rules, and tuned runtime policies for clusters? Examples include image scanning, non-root containers, Pod Security admission, network policies, signed images, and Falco, Kyverno, or Gatekeeper enforcement.",
      },
      {
        label: "SDLC security integration: requirements → design → build → release gates",
        description: "Have you inserted security checks at each SDLC stage instead of waiting for a final review? Think threat-model inputs in design, security requirements in tickets, automated scans in build, release approvals, and go or no-go criteria tied to risk.",
      },
      {
        label: "OT/ICS engineering: Purdue model, PLC/SCADA, safety-vs-security trade-offs ← rate separately in free text if needed",
        description: "Have you worked with PLC, SCADA, or historian environments where uptime and safety constraints change the security approach? Practical examples include mapping Purdue levels, handling jump hosts and vendor remote access, and documenting when a security control is deferred because it could disrupt a process.",
      },
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
      {
        label: "SAST / DAST / IAST / SCA tooling: selection, tuning, triage of findings",
        description: "Have you selected and tuned SAST, DAST, IAST, or SCA tools so engineers see fewer false positives and higher-value findings? This includes configuring severity thresholds, triaging results, writing suppressions with justification, and tracking remediation in backlog systems.",
      },
      {
        label: "Manual code review for security; secure design review",
        description: "Have you reviewed pull requests or design docs specifically for auth, trust boundaries, secrets handling, and unsafe data flows? A strong signal is when your review comments led to concrete fixes, additional tests, or a safer architecture before release.",
      },
      {
        label: "Penetration test scoping, methodology (PTES/OWASP), interpreting results",
        description: "Have you written or reviewed rules of engagement, test scope, success criteria, and evidence expectations for an internal or third-party pentest? This also includes interpreting PTES or OWASP findings, separating exploitable issues from noise, and turning the report into prioritized remediation.",
      },
      {
        label: "Fuzzing and negative testing",
        description: "Have you created malformed inputs, protocol edge cases, or harnesses to break parsers, APIs, or libraries? Examples include using AFL, libFuzzer, or similar tooling, collecting crashes, reproducing them, and verifying fixes with regression cases.",
      },
      {
        label: "Security test planning: acceptance criteria, traceability to requirements",
        description: "Have you mapped security requirements to explicit test cases and acceptance criteria before release? Deliverables might include a traceability matrix, negative test plan, and sign-off evidence showing each control requirement was verified.",
      },
      {
        label: "Verification evidence for audits / certification (e.g., Common Criteria awareness)",
        description: "Have you assembled the evidence package an auditor or certification assessor would ask for, such as test results, configuration snapshots, design reviews, and approval records? Common Criteria awareness here means knowing how to make verification repeatable and defensible, not just verbally asserting that controls exist.",
      },
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
      {
        label: "Eliciting & writing security requirements; translating compliance to controls",
        description: "Have you taken a regulation, contract clause, or internal policy and rewritten it as actionable security requirements for engineers or vendors? Examples include turning MFA or logging obligations into testable statements with owners, systems in scope, and acceptance criteria.",
      },
      {
        label: "Requirements traceability & baselines (SP 800-160 style engineering processes)",
        description: "Have you maintained links from security requirements to designs, controls, tests, and deployed evidence in a system of record? This could look like a traceability matrix, baseline documents, and change-control records aligned to SP 800-160-style engineering discipline.",
      },
      {
        label: "Evaluating emerging tech for adoption (build/buy, security due diligence)",
        description: "Have you compared new products or platforms using security questionnaires, architecture reviews, and proof-of-concept testing before adoption? Practical work includes build-vs-buy analysis, reviewing SOC 2 reports or pentest results, and documenting residual risks and integration requirements.",
      },
      {
        label: "Prototyping & proof-of-concept security research",
        description: "Have you built a small proof of concept to validate a control or research question before funding a full rollout? Examples include a lab for passwordless auth, a demo detection pipeline, or a sandboxed attack simulation to see whether telemetry and controls actually work.",
      },
      {
        label: "Vulnerability research fundamentals (understanding, not necessarily performing)",
        description: "Can you read a CVE, advisory, or exploit write-up and understand the vulnerable assumptions, affected versions, and likely detection or mitigation paths? This is about being able to reproduce understanding from proof-of-concept code, patch diffs, or protocol behavior without needing to be a full-time exploit developer.",
      },
    ],
  },

  /* ---------------------------- Implementation & Operation (IO) ---------------------------- */
  {
    id: "IO-A",
    domainId: "IO",
    title: "Network Operations",
    workRoles: [{ code: "IO-WRL-004", name: "Network Operations" }],
    topics: [
      {
        label: "TCP/IP stack, subnetting, VLANs, NAT in depth",
        description: "Have you troubleshot routing or connectivity by reading packet flows, subnet math, NAT behavior, and port or protocol usage rather than guessing? Concrete work includes fixing overlapping CIDRs, ACL issues, asymmetric paths, or service exposure problems in real environments.",
      },
      {
        label: "Routing & switching: OSPF, BGP, spanning tree",
        description: "Have you configured or analyzed OSPF neighbors, BGP advertisements, route redistribution, or spanning tree behavior during outages or design changes? Practical evidence includes change plans, route-policy reviews, failover testing, or root-cause analysis for loops and black holes.",
      },
      {
        label: "DNS, DHCP, NTP operation and security",
        description: "Have you run or secured DNS, DHCP, or NTP services, including zone management, lease behavior, and time-sync dependencies? Examples include fixing split-horizon DNS issues, hardening recursive resolvers, protecting DHCP scope changes, or investigating outages caused by clock drift.",
      },
      {
        label: "Firewalls, proxies, VPN (IPsec/SSL), TLS termination, load balancers",
        description: "Have you managed rules on firewalls, proxies, VPNs, TLS terminators, or load balancers and validated the resulting traffic behavior? This includes writing change requests, testing IPsec or SSL VPN connectivity, reviewing certificate chains, and proving least-privilege paths with packet captures.",
      },
      {
        label: "Wireless & NAC (802.1X)",
        description: "Have you configured 802.1X, RADIUS-backed network access control, or guest and BYOD segmentation for wireless or wired access? Real work includes certificate distribution, supplicant troubleshooting, rogue AP handling, and policies for quarantining noncompliant devices.",
      },
      {
        label: "Network monitoring: NetFlow, packet capture & analysis (Wireshark), SNMP",
        description: "Have you used NetFlow, SNMP, and packet captures to baseline traffic, investigate anomalies, or validate control coverage? Examples include building dashboards, capturing PCAPs in Wireshark, decoding suspicious sessions, and correlating device health with security events.",
      },
      {
        label: "SD-WAN / SDN and cloud networking (VPC/VNet, peering, private endpoints)",
        description: "Have you designed or operated cloud networking constructs such as VPC or VNet peering, private endpoints, transit hubs, or SD-WAN overlays? Hands-on signals include route design, segmentation policies, cloud firewall placement, and troubleshooting hybrid connectivity to on-prem systems.",
      },
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
      {
        label: "Windows administration: Active Directory, GPO, Kerberos, Entra ID",
        description: "Have you administered Active Directory or Entra ID beyond simple user creation, such as OU design, GPO troubleshooting, Kerberos issues, or privileged group reviews? Practical work includes enforcing baseline policies, reviewing delegated admin rights, and diagnosing authentication failures.",
      },
      {
        label: "Linux administration: services, permissions, systemd, shell",
        description: "Have you managed Linux hosts through services, permissions, systemd units, and shell automation in a way that supports security and reliability? Examples include hardening SSH, troubleshooting daemon startup, tuning sudo access, and scripting repeatable admin tasks.",
      },
      {
        label: "Hardening baselines (CIS Benchmarks, STIGs) and patch management",
        description: "Have you applied CIS Benchmarks or STIGs, evaluated what is safe to enforce, and tracked patching against maintenance windows? Real artifacts include gold images, exception records, patch dashboards, and post-patch validation for business-critical systems.",
      },
      {
        label: "Virtualization & storage administration",
        description: "Have you operated hypervisors, VM templates, snapshots, SAN or NAS storage, or cloud block and object storage with security in mind? This includes provisioning, access control, capacity planning, and understanding how backup, encryption, and isolation work in the platform.",
      },
      {
        label: "Database administration: SQL/NoSQL, access control, encryption at rest, backups",
        description: "Have you configured database authentication, roles, encryption at rest, backups, and maintenance for SQL or NoSQL systems? Useful examples are least-privilege schema access, key management for transparent encryption, audit logging, and restore testing.",
      },
      {
        label: "Backup / restore / recovery operations",
        description: "Have you executed restores, not just scheduled backups, and verified recovery point and recovery time expectations? Hands-on work includes immutable backup settings, offsite replication, periodic restore drills, and documenting failed recovery lessons.",
      },
      {
        label: "Identity lifecycle operations (joiner-mover-leaver, provisioning)",
        description: "Have you automated or governed joiner-mover-leaver processes so access changes happen correctly and on time? This includes provisioning from HR data, role mapping, deprovisioning validation, and exception handling for contractors, shared accounts, or service identities.",
      },
    ],
  },
  {
    id: "IO-C",
    domainId: "IO",
    title: "Systems Security Analysis",
    workRoles: [{ code: "IO-WRL-006", name: "Systems Security Analysis" }],
    topics: [
      {
        label: "Security configuration review & hardening validation",
        description: "Have you inspected live systems against hardening standards and proven whether settings actually match policy? Examples include checking registry keys, Linux configs, cloud control states, and remediating drift with configuration management.",
      },
      {
        label: "EDR/AV platform operation and policy tuning",
        description: "Have you deployed EDR or AV agents, tuned prevention and detection policies, and investigated exclusions that weaken coverage? Practical work includes handling false positives, rollout rings, tamper-protection issues, and validating that telemetry reaches the console.",
      },
      {
        label: "Log architecture: what to collect, retention, forwarding, SIEM onboarding",
        description: "Have you decided which events to collect from endpoints, identity systems, apps, and cloud services and how long to retain them? This includes forwarding design, parser onboarding into a SIEM, cost and performance trade-offs, and proving that critical use cases have the data they need.",
      },
      {
        label: "Certificate & key operational management (renewals, incidents)",
        description: "Have you kept certificates and keys healthy in production by tracking expirations, failed renewals, and compromise response steps? Examples include cert-manager or ACME operations, private key custody, emergency rotation, and incident handling when trust chains break.",
      },
      {
        label: "Integrating security requirements into day-2 operations & change management",
        description: "Have you embedded security review into normal change management, CAB meetings, or service-owner operations rather than treating it as a separate event? Signs include change templates with security checks, operational runbooks, and documented acceptance of day-2 risk.",
      },
      {
        label: "Operational metrics & compliance reporting from live systems",
        description: "Have you produced compliance or security health reports directly from live systems instead of manual spreadsheets? Examples include dashboards for patch age, MFA coverage, agent health, log ingestion, and control exceptions tied to accountable owners.",
      },
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
      {
        label: "SQL for investigation & reporting",
        description: "Have you written SQL to pull suspicious activity, trend failures, or reconcile assets across multiple tables during an investigation? Practical examples include joining auth logs with asset inventories, exporting evidence, and validating that query results answer the case question.",
      },
      {
        label: "Scripting for automation: Python, PowerShell, Bash",
        description: "Have you automated repetitive security or admin work with Python, PowerShell, or Bash instead of performing it manually? Examples include enrichment scripts, bulk remediation, API integrations, parsing log files, and safe error handling for production tasks.",
      },
      {
        label: "Security data pipelines & dashboards (KQL/SPL, Grafana/PowerBI style)",
        description: "Have you built or maintained dashboards and queries in KQL, SPL, Grafana, or Power BI that analysts actually use? This includes extracting data from APIs or queues, shaping schemas, and visualizing detection coverage, response SLAs, or asset exposure.",
      },
      {
        label: "Data quality, normalization, enrichment of security telemetry",
        description: "Have you cleaned and normalized noisy telemetry so hostnames, usernames, timestamps, and IP fields can be trusted across tools? Hands-on work includes parser fixes, enrichment with CMDB or threat intel, deduplication, and measuring how bad data affects investigations.",
      },
      {
        label: "Structured troubleshooting & escalation practice",
        description: "Have you worked through incidents or support cases with a repeatable hypothesis, evidence collection, and escalation pattern? Strong evidence includes ticket notes, reproduction steps, rollback plans, and knowing when to hand off with the right context instead of just saying it does not work.",
      },
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
      {
        label: "SIEM operation & detection engineering (rule writing, tuning, coverage mapping)",
        description: "Have you written, tuned, and retired SIEM detections based on real telemetry instead of leaving vendor defaults untouched? Practical work includes SPL or KQL rule logic, false-positive reduction, ATT&CK coverage mapping, test events, and documenting dependencies on specific log sources.",
      },
      {
        label: "Alert triage workflow; MITRE ATT&CK-based analysis",
        description: "Have you taken an alert from initial queue to a defendable disposition using MITRE ATT&CK, asset context, and supporting evidence? This usually means pivoting across logs, endpoint data, identity activity, and case notes before deciding benign, suspicious, or incident.",
      },
      {
        label: "IDS/IPS, email security, web filtering operation",
        description: "Have you operated preventative controls such as IDS or IPS, secure email gateways, and web filters by tuning policies and handling exceptions? Examples include block or allow decisions, signature updates, quarantine review, and measuring whether the control actually stops the targeted behavior.",
      },
      {
        label: "Threat hunting methodology (hypothesis-driven, data-driven)",
        description: "Have you run hunts from a hypothesis like stolen tokens are being abused or from anomalous data patterns, then documented what you proved or disproved? Hands-on work includes query development, scoping affected systems, collecting follow-up evidence, and converting results into detections.",
      },
      {
        label: "SOAR & automation of response playbooks",
        description: "Have you automated parts of triage or response with SOAR playbooks, scripts, or case-management integrations? Examples include enrichment on alert open, automated host isolation with approval gates, ticket creation, and guardrails for failures or false triggers.",
      },
      {
        label: "Defense infrastructure upkeep: sensors, agents, telemetry health",
        description: "Have you kept sensors, agents, connectors, and telemetry pipelines healthy so detections remain trustworthy? Practical work includes monitoring data gaps, version drift, stale agents, certificate failures, and validating coverage after network or platform changes.",
      },
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
      {
        label: "IR lifecycle (NIST SP 800-61): detection → containment → eradication → recovery",
        description: "Have you executed or closely supported incidents through the full NIST SP 800-61 cycle rather than only watching from the side? Evidence includes incident tickets, decision logs, containment actions, eradication tasks, recovery validation, and a documented lessons-learned review.",
      },
      {
        label: "Containment strategy decisions (isolate vs. observe, business trade-offs)",
        description: "Have you weighed the cost of isolating a host or disabling an account against the value of observing attacker behavior a bit longer? This includes making time-sensitive calls with business owners, documenting rationale, and planning compensating controls when immediate containment is too disruptive.",
      },
      {
        label: "Playbooks, severity classification, escalation & comms during incidents",
        description: "Have you authored or run incident playbooks with clear severity levels, escalation paths, and communication templates? Concrete artifacts include who-to-call lists, Slack or Teams bridges, legal or PR notifications, and criteria for moving from ticket to formal incident.",
      },
      {
        label: "Disk & memory forensics; forensic acquisition and chain of custody",
        description: "Have you acquired disk or memory images in a way that preserves evidence and chain of custody? Practical work includes using approved tooling, write blockers, hashes, evidence logs, secure storage, and knowing when live acquisition is worth the risk.",
      },
      {
        label: "Malware triage (static/dynamic basics, sandboxing)",
        description: "Have you done first-pass malware analysis with hashes, strings, sandbox results, and behavior observations to decide how urgent or widespread it is? Examples include detonating samples in a safe sandbox, checking persistence mechanisms, and extracting IOCs for containment.",
      },
      {
        label: "Timeline analysis & root-cause reconstruction; post-incident review",
        description: "Have you reconstructed what happened by lining up logs, process execution, network activity, and user actions into a coherent sequence? Strong evidence includes a case timeline, root-cause statement, scope assessment, and specific control improvements from the review.",
      },
      {
        label: "Tabletop exercises & IR program maturity",
        description: "Have you planned or facilitated tabletop exercises that test people, decisions, and communications rather than just reading the playbook? Deliverables often include scenario injects, observer notes, action items, and maturity improvements tracked to closure.",
      },
    ],
  },
  {
    id: "PD-C",
    domainId: "PD",
    title: "Vulnerability Analysis & Management",
    workRoles: [{ code: "PD-WRL-007", name: "Vulnerability Analysis" }],
    topics: [
      {
        label: "Scanning platforms (Nessus/Qualys/cloud-native), authenticated vs. not",
        description: "Have you run authenticated and unauthenticated scans with tools like Nessus, Qualys, or cloud-native services and understood why the results differ? This includes scanner placement, credentials, coverage gaps, rate limiting, and validating findings on target systems.",
      },
      {
        label: "Prioritization: CVSS, EPSS, KEV, asset criticality, reachability",
        description: "Have you ranked remediation using CVSS, EPSS, CISA KEV, asset criticality, and network reachability instead of patching by raw count? Practical work includes exception handling, exposure scoring, and creating patch queues that reflect actual business risk.",
      },
      {
        label: "Vulnerability-to-patch workflow, SLAs, exception handling",
        description: "Have you taken a finding from discovery through owner assignment, patching, validation, and closure within an SLA? This also includes documenting deferrals, compensating controls, and tracking exceptions so aged risk does not disappear in spreadsheets.",
      },
      {
        label: "Cloud misconfiguration assessment (CSPM) & attack surface management",
        description: "Have you used CSPM or attack-surface tools to find exposed storage, over-privileged identities, public ingress, or risky trust paths in cloud environments? Hands-on work includes validating whether a finding is reachable, fixing it in IaC, and confirming the control persists after redeploy.",
      },
      {
        label: "Interpreting pentest/red-team output into remediation programs",
        description: "Have you translated red-team or pentest findings into concrete remediation work rather than just filing the report away? Examples include grouping root causes, assigning owners, creating engineering tickets, and validating that compensating detections exist until fixes land.",
      },
      {
        label: "Reporting & metrics (MTTR, exposure windows, risk-based views)",
        description: "Have you built metrics that show exposure and remediation speed in a way leaders can act on? Useful outputs include MTTR by severity, exception aging, internet-facing exposure windows, and risk-based dashboards segmented by business unit or platform.",
      },
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
      {
        label: "CTI lifecycle: collection, processing, analysis, dissemination",
        description: "Have you collected intelligence from feeds, reports, internal incidents, or analyst notes, then processed it into something defenders can use? Practical work includes source validation, tagging, deduplication, analysis, and distributing finished intel to detection, incident response, or leadership audiences.",
      },
      {
        label: "IOC vs. TTP analysis; pivoting & enrichment; intel platforms (MISP/TIP)",
        description: "Have you pivoted from a hash, IP, or domain into related infrastructure and then up to the adversary behaviors behind it using MISP or a TIP? This includes enrichment, confidence scoring, and knowing when brittle IOC matching should be replaced by broader TTP-based detection.",
      },
      {
        label: "Threat actor profiling & campaign tracking; attribution caution",
        description: "Have you tracked campaigns over time, compared reporting from multiple sources, and resisted overclaiming attribution when evidence is weak? Useful outputs include actor summaries, campaign timelines, targeting patterns, and explicit caveats on confidence.",
      },
      {
        label: "Intel requirements & stakeholder-driven reporting",
        description: "Have you gathered the questions stakeholders actually need answered and tailored reports to those decisions? Examples include weekly executive intel briefs, tactical detection updates for SOC teams, and collection plans tied to a region, sector, or threat family.",
      },
      {
        label: "Insider threat indicators, UEBA, program & privacy considerations",
        description: "Have you worked with HR, legal, privacy, and security teams to define what user behavior is monitored and how alerts are handled? Hands-on signals include UEBA tuning, investigation guardrails, access to sensitive datasets, and balancing detection value against employee privacy obligations.",
      },
    ],
  },

  /* ---------------------------- Investigation (IN) ---------------------------- */
  {
    id: "IN-A",
    domainId: "IN",
    title: "Cybercrime Investigation",
    workRoles: [{ code: "IN-WRL-001", name: "Cybercrime Investigation" }],
    topics: [
      {
        label: "Investigative process & case management",
        description: "Have you managed cases from intake to closure with a clear scope, evidence record, timeline, and next actions? This includes maintaining case notes, issue trackers, evidence indexes, and decision logs that would hold up under review.",
      },
      {
        label: "Legal constraints: authority, jurisdiction, admissibility, privacy limits",
        description: "Do you understand when a collection or search is allowed, which jurisdictions or privacy regimes apply, and what can make evidence inadmissible? Practical work includes consulting counsel, checking policy authority, documenting consent or scope limits, and avoiding collection beyond what the case permits.",
      },
      {
        label: "Working with law enforcement & legal counsel",
        description: "Have you prepared evidence, summaries, or timelines for outside counsel or law enforcement without contaminating the case? This includes knowing escalation thresholds, preservation duties, disclosure channels, and how to translate technical findings into legally useful statements.",
      },
      {
        label: "Fraud / BEC / account-takeover investigations",
        description: "Have you investigated business email compromise, fraudulent payment changes, account takeover, or similar abuse from first alert through recovery steps? Examples include mailbox rule review, sign-in analysis, payment trace coordination, and evidence packages for finance, HR, or law enforcement.",
      },
      {
        label: "OSINT techniques and their legal/ethical boundaries",
        description: "Have you used passive DNS, breach data, social media, WHOIS, company records, or search operators while respecting legal and ethical boundaries? Strong practice includes documenting sources, separating verified facts from assumptions, and knowing when collection methods would cross a line.",
      },
      {
        label: "Interview & evidence-gathering discipline",
        description: "Have you interviewed users, admins, or witnesses in a way that preserves facts and avoids leading the answer? Practical signals include prepared question lists, contemporaneous notes, corroboration with technical evidence, and clear handoffs of what was observed versus inferred.",
      },
    ],
  },
  {
    id: "IN-B",
    domainId: "IN",
    title: "Digital Evidence Analysis",
    workRoles: [{ code: "IN-WRL-002", name: "Digital Evidence Analysis" }],
    topics: [
      {
        label: "Forensic imaging & verification (write blockers, hashing)",
        description: "Have you created verified forensic images using write blockers and hashing so the original media is preserved? This includes recording chain of custody, validating hash matches, and choosing the right acquisition method for the device and case.",
      },
      {
        label: "File system internals & artifact analysis (registry, logs, browser, cloud artifacts)",
        description: "Have you analyzed artifacts such as registry hives, event logs, browser history, shellbags, cloud sync traces, or deleted-file metadata to answer case questions? Hands-on work includes building timelines from these artifacts and explaining what they do and do not prove.",
      },
      {
        label: "Mobile device forensics awareness",
        description: "Have you worked around the realities of iOS and Android evidence collection, backups, app data, and device lock states, even if you are not a deep specialist? This includes knowing when to preserve a device, when logical extraction is insufficient, and when to bring in a specialist tool or examiner.",
      },
      {
        label: "Network forensics: PCAP reconstruction, flow analysis",
        description: "Have you reconstructed sessions or exfiltration paths from PCAPs, Zeek logs, or flow data? Examples include carving files, following TCP streams, identifying beaconing, and correlating network evidence with endpoint timelines.",
      },
      {
        label: "eDiscovery & legal hold processes",
        description: "Have you supported legal hold, preservation, collection, and handoff processes for litigation or internal investigations? Practical work includes scoping custodians and data sources, preserving metadata, coordinating with counsel, and tracking what was collected and why.",
      },
      {
        label: "Expert reporting: writing findings for legal/HR proceedings",
        description: "Have you written reports that HR, legal, or external reviewers can understand and rely on? Good evidence includes clear methodology, factual findings, limitations, exhibits, and language that distinguishes observation from opinion.",
      },
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
      {
        label: "Security strategy development & alignment to business objectives",
        description: "Have you translated business plans like cloud migration, M&A, or product launch into a written security strategy with priorities, sequencing, and trade-offs? Examples include presenting a roadmap to leadership, tying initiatives to business risk, and explaining what is deferred if budget or headcount is limited.",
      },
      {
        label: "Policy / standard / procedure hierarchy: authoring & lifecycle",
        description: "Have you authored or maintained policies, standards, and procedures with version control, review cycles, exception handling, and owner sign-off? Practical artifacts include policy hierarchies, control mappings, document review records, and retirement or update workflows when technology changes.",
      },
      {
        label: "Board & executive reporting; security metrics/KPIs that matter",
        description: "Have you built metrics or briefing decks that help executives understand risk, progress, and decisions instead of drowning them in operational detail? Useful outputs include KPIs on control adoption, incident trends, material risks, budget asks, and clearly stated actions needed from leadership.",
      },
      {
        label: "Budgeting, resourcing, and building a security roadmap",
        description: "Have you built a security roadmap with initiatives, dependencies, staffing plans, and rough-order-of-magnitude costs? This includes vendor evaluations, build-vs-buy arguments, sequencing across quarters, and defending the spend in planning cycles.",
      },
      {
        label: "Security culture & organizational influence",
        description: "Have you influenced teams that do not report to you by changing incentives, messaging, or processes around security? Examples include partnering with engineering leads, embedding champions, resolving recurring friction, and showing teams how secure behavior helps them ship and operate better.",
      },
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
      {
        label: "Risk frameworks: NIST RMF / CSF, ISO 27001/27005, FAIR basics",
        description: "Have you used NIST RMF or CSF, ISO 27001 or 27005, or FAIR concepts to structure assessments and communicate risk consistently? Practical work includes control selection, risk statements, likelihood and impact reasoning, and mapping current state to target maturity.",
      },
      {
        label: "Risk registers, risk acceptance, exceptions with named owners",
        description: "Have you maintained a risk register with clear statements, owners, due dates, treatment plans, and documented acceptances or exceptions? A strong signal is when risks are reviewed with the accountable business owner rather than parked in a security-only spreadsheet.",
      },
      {
        label: "Control assessment & internal audit; evidence management",
        description: "Have you tested whether controls operate as designed and collected evidence that an auditor or internal reviewer can verify? Examples include sample-based walkthroughs, screenshots, exported configs, interview notes, evidence repositories, and remediation tracking for failed controls.",
      },
      {
        label: "Regulatory landscape: GDPR/CCPA, HIPAA, PCI DSS, SOX, DORA/NIS2 awareness",
        description: "Can you recognize when GDPR, CCPA, HIPAA, PCI DSS, SOX, DORA, or NIS2 changes the control or reporting expectation for a system? This is practical awareness: knowing when to pull in specialists, map obligations to controls, and preserve evidence for the applicable regime.",
      },
      {
        label: "SOC 2 / ISO certification processes; systems authorization (ATO) concepts",
        description: "Have you supported a SOC 2 or ISO audit, or worked with ATO-style authorization concepts, by assembling policies, evidence, and remediation plans? Examples include control narratives, owner interviews, scoping decisions, readiness checks, and handling auditor questions without scrambling.",
      },
      {
        label: "Privacy program operations (DPIAs, data mapping, breach notification duties)",
        description: "Have you performed DPIAs, mapped personal data flows, or coordinated breach-notification analysis with legal and privacy teams? Practical work includes identifying data owners, retention points, cross-border transfers, and the facts needed to decide whether notice obligations are triggered.",
      },
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
      {
        label: "Security program design & maturity models (e.g., CMMI-style, NIST CSF tiers)",
        description: "Have you assessed or designed a security program using maturity models such as NIST CSF tiers or CMMI-style thinking? This includes baselining current capabilities, defining target state, sequencing improvements, and measuring whether changes actually stick.",
      },
      {
        label: "Project management of security initiatives (scope, stakeholders, delivery)",
        description: "Have you run security projects with scope, milestones, stakeholders, risks, and delivery tracking rather than just technical tasks? Real artifacts include project plans, RAID logs, steering updates, dependency management, and cutover or rollout checklists.",
      },
      {
        label: "Third-party / vendor risk management (TPRM), contracts & SLA security terms",
        description: "Have you reviewed vendors through questionnaires, architecture discussions, contracts, and SLA language to make sure security expectations are enforceable? Examples include right-to-audit clauses, breach-notification timelines, data handling terms, and follow-up on gaps before signature.",
      },
      {
        label: "C-SCRM: supplier assessment, SBOM policy, hardware/software provenance",
        description: "Have you evaluated suppliers, component provenance, or SBOM requirements for software or hardware that enters your environment? Hands-on work includes supplier risk scoring, provenance questions, secure update expectations, and policies for handling unsupported or opaque components.",
      },
      {
        label: "M&A security due diligence awareness",
        description: "Have you contributed to due diligence for an acquisition or divestiture by assessing identity, network exposure, tooling gaps, or inherited obligations? Practical outputs include a rapid-risk memo, integration blockers, Day 1 minimum controls, and post-close remediation priorities.",
      },
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
      {
        label: "Security awareness program design & phishing simulation programs",
        description: "Have you designed awareness content and phishing simulations based on actual user risk rather than generic annual training? Examples include campaign planning, landing pages, follow-up training, exception handling, and measuring repeat clickers or report rates over time.",
      },
      {
        label: "Technical training curriculum development & delivery",
        description: "Have you built and delivered technical training with labs, demos, exercises, or assessments for engineers or analysts? Practical artifacts include learning objectives, slide decks, hands-on environments, quizzes, and revisions based on learner feedback.",
      },
      {
        label: "Workforce planning with skills frameworks (including NICE itself)",
        description: "Have you used NICE or another skills framework to map team roles, identify gaps, and plan hiring or development? This includes building competency matrices, career ladders, cross-training plans, and role-based expectations for the current organization.",
      },
      {
        label: "Role design, hiring input, team development & mentoring",
        description: "Have you helped define job descriptions, interview loops, onboarding plans, and growth paths for security team members? Strong evidence includes structured mentoring, performance feedback, succession planning, and coaching people toward broader ownership.",
      },
    ],
  },
];

export function getSubdomainsByDomain(domainId: string): Subdomain[] {
  return SUBDOMAINS.filter((s) => s.domainId === domainId);
}
