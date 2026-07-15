import { Domain } from "@/types/nice";

/**
 * The 5 core NICE Framework v2.2.0 Work Role Categories (Domains).
 * Colors are Tailwind-compatible hex values used consistently across
 * charts, badges, and progress bars.
 */
export const DOMAINS: Domain[] = [
  {
    id: "OG",
    name: "Oversight and Governance",
    shortName: "Oversight & Governance",
    description:
      "Leadership, management, direction, and development of cybersecurity policy, strategy, legal/regulatory compliance, and workforce oversight.",
    color: "#6366f1", // indigo-500
  },
  {
    id: "DD",
    name: "Design and Development",
    shortName: "Design & Development",
    description:
      "Conceptualizing, designing, and building secure information technology systems and software.",
    color: "#0ea5e9", // sky-500
  },
  {
    id: "IO",
    name: "Implementation and Operation",
    shortName: "Implementation & Operation",
    description:
      "Provisioning, operating, maintaining, and supporting IT systems to ensure secure and effective performance.",
    color: "#22c55e", // green-500
  },
  {
    id: "PD",
    name: "Protection and Defense",
    shortName: "Protection & Defense",
    description:
      "Identification, analysis, and mitigation of threats to internal systems and networks.",
    color: "#f59e0b", // amber-500
  },
  {
    id: "IN",
    name: "Investigation",
    shortName: "Investigation",
    description:
      "Investigation of cybersecurity events or crimes related to IT systems, networks, and digital evidence.",
    color: "#ef4444", // red-500
  },
];
