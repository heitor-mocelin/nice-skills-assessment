import { Domain } from "@/types/nice";

/**
 * The 5 core NICE Framework v2.2.0 Work Role Categories (Domains).
 * Colors are the mid-shade of each domain's color scale (see
 * src/lib/domainColors.ts), which also derives lighter/darker per
 * sub-domain shades from the same hue family:
 *   OG = purple, DD = blue, IO = green, PD = yellow/amber, IN = red.
 */
export const DOMAINS: Domain[] = [
  {
    id: "OG",
    name: "Oversight and Governance",
    shortName: "Oversight & Governance",
    description:
      "Leadership, management, direction, and development of cybersecurity policy, strategy, legal/regulatory compliance, and workforce oversight.",
    color: "#8b5cf6", // violet-500 (purple)
  },
  {
    id: "DD",
    name: "Design and Development",
    shortName: "Design & Development",
    description:
      "Conceptualizing, designing, and building secure information technology systems and software.",
    color: "#3b82f6", // blue-500
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
