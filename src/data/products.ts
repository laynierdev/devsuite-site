// Typed product data. Everything the site says about a product lives here:
// names, copy, capabilities, links and the real screenshots shown in the
// showcase. Screenshots are copies of the originals in each product
// repository (see scripts/optimize-assets.mjs).
import type { StaticImageData } from "next/image";

import mrHome from "../../public/products/mobileroad/home.webp";
import mrTimeline from "../../public/products/mobileroad/timeline.webp";
import mrFeature from "../../public/products/mobileroad/feature-modal.webp";
import mrAudit from "../../public/products/mobileroad/ai-audit.webp";

import arFlowPoster from "../../public/products/architecter/flow-poster.webp";
import arProposal from "../../public/products/architecter/proposal-review.webp";
import arCompare from "../../public/products/architecter/compare.webp";
import arDecisions from "../../public/products/architecter/decisions.webp";

import cxWorkspace from "../../public/products/codebasexplorer/workspace-ai.webp";
import cxArchitecture from "../../public/products/codebasexplorer/architecture.webp";
import cxFlows from "../../public/products/codebasexplorer/flows.webp";
import cxImpact from "../../public/products/codebasexplorer/impact.webp";

export type ProductId = "mobileroad" | "architecter" | "codebasexplorer";
export type Accent = "teal" | "blue" | "violet";

export interface ProductView {
  id: string;
  /** Short tab label. */
  label: string;
  /** One-sentence caption shown under the preview. */
  caption: string;
  /** Screenshot (also used as the poster when a video is present). */
  image: StaticImageData;
  alt: string;
  /** Optional looping, silent screen recording. */
  video?: string;
}

export interface Product {
  id: ProductId;
  index: string;
  name: string;
  /** One-word role in the journey: Plan / Design / Explore. */
  role: string;
  category: string;
  headline: string;
  description: string;
  /** One sentence used in the journey sequence. */
  journey: string;
  capabilities: string[];
  /** Precise fine print that keeps the claims accurate. */
  notes: string[];
  accent: Accent;
  demoUrl: string;
  /** Only set for repositories verified to be public. */
  repoUrl?: string;
  /** Aspect ratio of the preview frame (width / height). */
  frameAspect: number;
  views: ProductView[];
}

export const products: Product[] = [
  {
    id: "mobileroad",
    index: "01",
    name: "MobileRoad",
    role: "Plan",
    category: "Plan & Manage",
    headline: "From app idea to production.",
    description:
      "An AI-assisted roadmap and project tracker that guides non-technical people through the process of building, testing, publishing, and maintaining a mobile application.",
    journey: "MobileRoad helps organize the journey from idea to production.",
    capabilities: [
      "Turn an idea or requirements document into an editable analysis",
      "Generate a structured roadmap covering nine lifecycle phases",
      "Organize features, milestones, checkpoints, risks and dependencies",
      "Track project progress through a visual timeline",
      "Get contextual advice, audits and scope-change analysis",
      "Export and restore project backups",
    ],
    notes: [
      "Progress, status and checkpoints are computed by the application, never decided by the AI.",
    ],
    accent: "teal",
    demoUrl: "https://mobile-road.vercel.app/",
    frameAspect: 1600 / 1040,
    views: [
      {
        id: "dashboard",
        label: "Dashboard",
        caption: "KPI cards, overall progress and milestones, all computed from the project data.",
        image: mrHome,
        alt: "MobileRoad roadmap dashboard with KPI cards per status, a segmented overall progress bar, milestone cards and the start of the monthly timeline",
      },
      {
        id: "timeline",
        label: "Timeline",
        caption: "A monthly timeline with feature groups, milestone markers and a today line.",
        image: mrTimeline,
        alt: "MobileRoad feature timeline grouped by area, with milestone markers from kickoff to production and a marker for today",
      },
      {
        id: "feature",
        label: "Feature",
        caption: "Status, checkpoints with acceptance criteria, dates and dependencies for one feature.",
        image: mrFeature,
        alt: "MobileRoad feature detail dialog showing risk, schedule, checkpoints and dependencies",
      },
      {
        id: "audit",
        label: "AI audit",
        caption: "An audit lists findings by severity, why each matters and a suggested action.",
        image: mrAudit,
        alt: "MobileRoad AI audit listing findings with severity, the reason each one matters and a suggested action",
      },
    ],
  },
  {
    id: "architecter",
    index: "02",
    name: "Architecter",
    role: "Design",
    category: "Design & Architect",
    headline: "From requirements to architecture.",
    description:
      "An AI-assisted system design studio that transforms requirements into structured, visual, and defensible software architecture.",
    journey: "Architecter helps reason about the system before and during implementation.",
    capabilities: [
      "Analyze and review functional and non-functional requirements",
      "Tell apart what you provided, assumptions, recommendations and open questions",
      "Generate architecture proposals that you review and approve",
      "Explore interactive architecture diagrams",
      "Simulate real system flows through animated connections",
      "Compare architectural alternatives with weighted criteria",
      "Manage decision records (ADRs), risks and quality attributes",
      "Export documentation and diagrams",
    ],
    notes: [
      "Every AI result is a proposal. Nothing changes in a project until you approve it.",
    ],
    accent: "blue",
    demoUrl: "https://architecter-rho.vercel.app/",
    repoUrl: "https://github.com/laynierdev/architecter",
    frameAspect: 820 / 358,
    views: [
      {
        id: "flow",
        label: "Flow simulation",
        caption: "A pulse of light follows every connection of a scenario, with a caption for each step.",
        image: arFlowPoster,
        video: "/products/architecter/flow-animation.mp4",
        alt: "Architecter simulating the Place an order flow: a pulse travels along each connection of the architecture diagram while a caption explains the current step",
      },
      {
        id: "proposal",
        label: "Proposal review",
        caption: "Architecture proposals arrive as a list of changes that you accept one by one.",
        image: arProposal,
        alt: "Architecter proposal review listing suggested architecture changes, each with a reason and an origin tag, ready to be approved or unticked",
      },
      {
        id: "compare",
        label: "Compare",
        caption: "Alternatives ranked by the criteria you weight, with stated assumptions.",
        image: arCompare,
        alt: "Architecter comparison of architectural alternatives with weighted criteria and a ranking",
      },
      {
        id: "decisions",
        label: "Decisions",
        caption: "Architecture Decision Records with a real lifecycle.",
        image: arDecisions,
        alt: "Architecter list of Architecture Decision Records with their status",
      },
    ],
  },
  {
    id: "codebasexplorer",
    index: "03",
    name: "CodebaseXplorer",
    role: "Explore",
    category: "Explore & Understand",
    headline: "Understand any codebase. Navigate with confidence.",
    description:
      "An AI-assisted codebase exploration tool that helps developers understand unfamiliar repositories through deterministic analysis, visual exploration, and evidence-grounded answers.",
    journey: "CodebaseXplorer helps understand existing code and reason about changes.",
    capabilities: [
      "Import a repository from a ZIP archive or a local folder",
      "Analyze files, symbols, dependencies, modules and API endpoints",
      "Explore architecture graphs and circular dependencies",
      "Follow execution flows through the source code",
      "Analyze the potential impact of a change",
      "Search files, symbols, text and meaning",
      "Ask questions and get answers with verified source references",
    ],
    notes: [
      "Deep static analysis covers TypeScript and JavaScript. Other supported languages are indexed as text, searchable and highlighted.",
      "Imported code is never executed. It stays in your browser unless you ask the AI, and then only a bounded, relevant context is sent.",
    ],
    accent: "violet",
    demoUrl: "https://codebasexplorer.vercel.app/",
    repoUrl: "https://github.com/laynierdev/codebasexplorer",
    frameAspect: 800 / 478,
    views: [
      {
        id: "workspace",
        label: "Workspace",
        caption: "File tree, highlighted source and an answer that cites the exact lines it relies on.",
        image: cxWorkspace,
        alt: "CodebaseXplorer workspace with a file tree, highlighted source code and an AI answer whose facts cite exact files and line ranges",
      },
      {
        id: "architecture",
        label: "Architecture",
        caption: "An architecture graph derived from the imports in the code.",
        image: cxArchitecture,
        alt: "CodebaseXplorer architecture graph of modules and their dependencies",
      },
      {
        id: "flows",
        label: "Flows",
        caption: "Execution flows traced from an endpoint, every step linked to source.",
        image: cxFlows,
        alt: "CodebaseXplorer execution flow traced step by step from an API endpoint through the project's functions",
      },
      {
        id: "impact",
        label: "Impact",
        caption: "Confirmed dependents, tests and endpoints, kept apart from inferred risks.",
        image: cxImpact,
        alt: "CodebaseXplorer impact analysis listing direct and transitive dependents of a file",
      },
    ],
  },
];

export interface Principle {
  index: string;
  title: string;
  body: string;
}

export const principles: Principle[] = [
  {
    index: "01",
    title: "Grounded intelligence",
    body: "AI outputs are validated against application data and structured models wherever applicable.",
  },
  {
    index: "02",
    title: "Human decisions",
    body: "AI proposes and explains. You review and approve important changes.",
  },
  {
    index: "03",
    title: "Engineering discipline",
    body: "Deterministic application logic remains responsible for important facts, validation and state transitions.",
  },
];
