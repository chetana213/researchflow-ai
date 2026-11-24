/**
 * ResearchFlow AI - Demo Data Store
 * Provides rich presentation data for UI dashboards, library explorations,
 * and report previews while backend storage and agent RAG are staged.
 */

export const DEMO_PAPERS = [
  {
    id: 'paper-1',
    documentId: 'doc_101',
    title: 'Attention Is All You Need',
    authors: 'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, et al.',
    category: 'Deep Learning',
    year: 2017,
    citations: '112,450',
    readTime: '18 min',
    abstract:
      'We propose the Transformer, a model architecture eschewing recurrence and instead relying entirely on an attention mechanism to draw global dependencies between input and output.',
    tags: ['Transformers', 'Self-Attention', 'NLP Architecture'],
    featured: true,
  },
  {
    id: 'paper-2',
    documentId: 'doc_102',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    authors: 'Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova',
    category: 'NLP',
    year: 2018,
    citations: '95,120',
    readTime: '22 min',
    abstract:
      'BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers.',
    tags: ['Masked LM', 'Pre-training', 'Transfer Learning'],
    featured: true,
  },
  {
    id: 'paper-3',
    documentId: 'doc_103',
    title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
    authors: 'Patrick Lewis, Ethan Perez, Aleksandara Piktus, Fabio Petroni, et al.',
    category: 'RAG & Agents',
    year: 2020,
    citations: '24,800',
    readTime: '25 min',
    abstract:
      'We explore general-purpose fine-tuning recipes for Retrieval-Augmented Generation (RAG) — models which combine pre-trained parametric and non-parametric memory for language generation.',
    tags: ['RAG', 'Vector Search', 'Dense Retrieval'],
    featured: true,
  },
  {
    id: 'paper-4',
    documentId: 'doc_104',
    title: 'Language Models are Few-Shot Learners',
    authors: 'Tom B. Brown, Benjamin Mann, Nick Ryder, Melanie Subbiah, et al.',
    category: 'LLMs',
    year: 2020,
    citations: '48,300',
    readTime: '35 min',
    abstract:
      'We demonstrate that scaling language models greatly improves task-agnostic, few-shot performance, sometimes becoming competitive with prior state-of-the-art fine-tuning approaches.',
    tags: ['GPT-3', 'Few-Shot Learning', 'In-Context Prompting'],
    featured: false,
  },
  {
    id: 'paper-5',
    documentId: 'doc_105',
    title: 'Chain-of-Thought Prompting Elicits Reasoning in Large Language Models',
    authors: 'Jason Wei, Xuezhi Wang, Dale Schuurmans, Maarten Bosma, et al.',
    category: 'Reasoning',
    year: 2022,
    citations: '18,650',
    readTime: '15 min',
    abstract:
      'We explore how generating a chain of thought — a series of intermediate reasoning steps — significantly improves the ability of large language models to perform complex reasoning.',
    tags: ['Chain-of-Thought', 'Multi-step Reasoning', 'Prompt Engineering'],
    featured: false,
  },
  {
    id: 'paper-6',
    documentId: 'doc_106',
    title: 'Constitutional AI: Harmlessness from AI Feedback',
    authors: 'Yuntao Bai, Saurav Kadavath, Sandipan Kundu, Amanda Askell, et al.',
    category: 'AI Safety',
    year: 2022,
    citations: '12,900',
    readTime: '20 min',
    abstract:
      'We train a harmless AI assistant through self-improvement without human feedback labels for harms, using only a short set of natural language principles or constitution.',
    tags: ['RLAIF', 'Alignment', 'Red Teaming'],
    featured: false,
  },
];

export const DEMO_STATS = [
  {
    id: 'stat-docs',
    label: 'Documents in Library',
    value: '18',
    change: '+4 this week',
    isPositive: true,
    sublabel: 'Across 6 categories',
  },
  {
    id: 'stat-queries',
    label: 'Research Queries',
    value: '64',
    change: '+18% vs last week',
    isPositive: true,
    sublabel: 'Average response: 180ms',
  },
  {
    id: 'stat-reports',
    label: 'Synthesized Reports',
    value: '5',
    change: '2 pending review',
    isPositive: true,
    sublabel: 'Comprehensive summaries',
  },
  {
    id: 'stat-coverage',
    label: 'Knowledge Index',
    value: '96.4%',
    change: '+3.2%',
    isPositive: true,
    sublabel: 'Vector embeddings mapped',
  },
];

export const DEMO_ACTIVITIES = [
  {
    id: 'act-1',
    type: 'query',
    title: 'Analyzed attention head dynamics in Transformer architecture',
    document: 'doc_101',
    time: '25 minutes ago',
  },
  {
    id: 'act-2',
    type: 'upload',
    title: 'Indexed Retrieval-Augmented Generation for Knowledge-Intensive NLP',
    document: 'doc_103',
    time: '2 hours ago',
  },
  {
    id: 'act-3',
    type: 'report',
    title: 'Synthesized Q4 Survey on Dense Retrieval & Vector Databases',
    document: 'Multi-paper synthesis',
    time: 'Yesterday',
  },
  {
    id: 'act-4',
    type: 'query',
    title: 'Queried BERT bidirectional masking objectives across benchmarks',
    document: 'doc_102',
    time: '2 days ago',
  },
];

export const DEMO_REPORTS = [
  {
    id: 'rep-1',
    title: 'Architectural Comparative Survey: Dense vs Sparse Retrieval in RAG Systems',
    date: 'Nov 22, 2026',
    status: 'Ready',
    pages: 14,
    tags: ['Dense Retrieval', 'VectorDB', 'BM25', 'Latency'],
    summary:
      'A thorough comparative evaluation of bi-encoder dense embeddings against hybrid sparse retrieval methods across academic benchmarks, measuring MRR@10 and inference latency.',
    sections: [
      'Executive Summary & Key Takeaways',
      'Parametric vs Non-Parametric Memory Latencies',
      'Benchmark Performance across MMLU & HotpotQA',
      'Recommended Production Pipeline Topology',
    ],
  },
  {
    id: 'rep-2',
    title: 'Long-Context Window Scaling vs Semantic Chunking Optimization',
    date: 'Nov 19, 2026',
    status: 'Ready',
    pages: 9,
    tags: ['Chunking', 'Context Window', 'Needle-in-a-Haystack'],
    summary:
      'Analysis of loss in middle phenomena when scaling context windows to 128k+ tokens versus hierarchically indexed semantic chunking with metadata re-ranking.',
    sections: [
      'Problem Statement: Retrieval Quality in Long Contexts',
      'Chunk Size Sensitivity Analysis (256 vs 512 vs 1024)',
      'Cost and Latency Trade-offs in Commercial LLMs',
    ],
  },
  {
    id: 'rep-3',
    title: 'Multi-Agent Reflexion Frameworks for Automated Literature Review',
    date: 'Nov 24, 2026',
    status: 'Processing',
    pages: 11,
    tags: ['LangGraph', 'Multi-Agent', 'Self-Correction'],
    summary:
      'Investigates graph-orchestrated researcher and critic agents iteratively refining document citations and synthesizing balanced literature perspectives.',
    sections: [
      'Agentic Collaboration Architectures',
      'Hallucination Mitigation through Citation Anchoring',
      'Next Steps & Evaluation Protocols',
    ],
  },
  {
    id: 'rep-4',
    title: 'Constitutional Safety & Red-Teaming for In-Domain Research Assistants',
    date: 'Nov 15, 2026',
    status: 'Draft',
    pages: 6,
    tags: ['Safety', 'Alignment', 'Red Teaming'],
    summary:
      'Preliminary evaluation of constitutional guardrails preventing prompt injection and exfiltration of proprietary academic corpora.',
    sections: [
      'Threat Modeling for Research Platforms',
      'Evaluation on Adversarial Academic Prompts',
    ],
  },
];
