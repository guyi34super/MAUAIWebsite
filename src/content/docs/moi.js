export const moiNav = {
  product: 'MOI AI',
  slug: 'moi',
  tagline: 'Mauritius Own LLM — under development',
  description:
    'MO Intelligence\'s from-scratch decoder-only transformer language model, built in Mauritius and currently training at the 100M-parameter scale.',
  pages: [
    { slug: '', title: 'Overview', navTitle: 'Overview' },
    { slug: 'architecture', title: 'Architecture', navTitle: 'Architecture' },
    { slug: 'training', title: 'Training', navTitle: 'Training' },
    { slug: 'scaling', title: 'Scaling', navTitle: 'Scaling' },
    { slug: 'roadmap', title: 'Roadmap', navTitle: 'Roadmap' },
  ],
};

export function getMoiPagePath(slug) {
  return slug ? `/docs/moi/${slug}` : '/docs/moi';
}

export function getMoiPageBySlug(slug) {
  return moiNav.pages.find((p) => p.slug === slug);
}

export function getMoiPrevNext(slug) {
  const idx = moiNav.pages.findIndex((p) => p.slug === slug);
  return {
    prev: idx > 0 ? moiNav.pages[idx - 1] : null,
    next: idx < moiNav.pages.length - 1 ? moiNav.pages[idx + 1] : null,
  };
}

export const overviewContent = {
  intro: [
    'MOI AI is Mauritius\'s own large language model — a from-scratch, decoder-only transformer built entirely by MO Intelligence. It is designed, trained, and scaled in-house to serve Mauritian and African businesses with locally developed AI capabilities.',
    'MOI is currently under active development at the 100M-parameter rung (R0). The same codebase scales from a laptop-friendly research model to production-scale systems — only the configuration changes.',
  ],
  whyMauritius: {
    title: 'Why a Mauritian LLM',
    body: 'Building our own foundation model gives MO Intelligence full control over training data, multilingual support, and deployment for Mauritius and Africa. MOI is not a wrapper around external APIs — it is sovereign AI infrastructure developed on Mauritian soil.',
  },
  toc: [
    { id: 'introduction', title: 'Introduction' },
    { id: 'why-mauritius', title: 'Why a Mauritian LLM' },
  ],
};

export const architectureContent = {
  intro:
    'MOI is a dense decoder-only transformer with a modern component stack. Every layer is implemented from first principles in the MO Intelligence research codebase.',
  components: {
    headers: ['Component', 'Choice', 'Why'],
    rows: [
      ['Normalization', 'RMSNorm, pre-norm', 'Cheaper than LayerNorm, stable deep training'],
      ['Positions', 'RoPE (rotary)', 'Extrapolates to long context windows'],
      ['Attention', 'GQA (grouped-query)', '~7× smaller KV-cache vs MHA, negligible quality loss'],
      ['Feed-forward', 'SwiGLU', 'Gated FFN, efficient at scale'],
      ['Embeddings', 'Tied embed ↔ LM head', 'Saves parameters across the model'],
      ['Objective', 'Next-token cross-entropy', 'Standard autoregressive language modelling'],
    ],
  },
  r0: {
    title: 'R0 — 100M parameters',
    specs: [
      { label: 'Parameters', value: '~100M' },
      { label: 'd_model', value: '768' },
      { label: 'Layers', value: '12' },
      { label: 'Q / KV heads', value: '12 / 4' },
      { label: 'Context', value: '1K tokens' },
      { label: 'Config', value: 'configs/r0_100m.yaml' },
    ],
  },
  toc: [
    { id: 'stack', title: 'Component stack' },
    { id: 'r0-spec', title: 'R0 — 100M' },
  ],
};

export const trainingContent = {
  intro:
    'MOI training is config-driven and device-agnostic. The stack auto-selects CUDA → MPS → CPU and supports everything from a seconds-long smoke test to multi-day R0 runs on Apple Silicon.',
  install: {
    title: 'Install',
    commands: [
      'pip install -r requirements.txt',
      'pip install -e .',
    ],
  },
  smokeTest: {
    title: 'Smoke test (CPU, seconds)',
    description: 'Proves the full stack runs: trains a tiny BPE tokenizer, builds a ~1M-param MOI, trains ~40 steps, saves a safetensors checkpoint, reloads, and generates text.',
    commands: ['python scripts/smoke_test.py'],
  },
  r0Training: {
    title: 'Train R0 on TinyStories (M1 Pro 16GB)',
    description: 'Training keeps the best weights under checkpoints/r0/best by lowest val_loss. Metrics log to checkpoints/r0/metrics.jsonl.',
    steps: [
      { command: 'bash scripts/train_m1.sh', label: 'One-shot (auto-selects MPS)' },
      { command: 'python scripts/train_tokenizer.py --files data_sample.txt --vocab-size 32000', label: '1. Train tokenizer' },
      { command: 'python scripts/prepare_data.py --hf roneneldan/TinyStories --tokenizer tokenizer.json --out data/train --single-file --val-out data/val.bin', label: '2. Tokenize dataset' },
      { command: 'python scripts/train.py --config configs/r0_100m.yaml --data data/train.bin', label: '3. Train (best → checkpoints/r0/best)' },
      { command: 'python scripts/generate.py --ckpt checkpoints/r0/best --tokenizer tokenizer.json --prompt "Once upon a time"', label: '4. Generate' },
    ],
  },
  cpuMini: {
    title: 'CPU mini verification',
    description: 'Short CPU-feasible run to validate the stack without a GPU. Caps TinyStories with --max-docs.',
    commands: [
      'python scripts/train_tokenizer.py --files data_sample.txt --vocab-size 32000',
      'python scripts/prepare_data.py --hf roneneldan/TinyStories --tokenizer tokenizer.json --out data/train --single-file --val-out data/val.bin --max-docs 2000',
      'python scripts/train.py --config configs/r0_cpu_mini.yaml',
      'python scripts/generate.py --ckpt checkpoints/r0_cpu_mini/best --tokenizer tokenizer.json --prompt "Once upon a time"',
    ],
  },
  sft: {
    title: 'Post-training: supervised fine-tuning',
    description: 'Supervised fine-tune on ChatML instruction data. SFT masks everything except assistant tokens.',
    commands: [
      'python scripts/sft.py --ckpt checkpoints/r0/final --tokenizer tokenizer.json --data data/sft.jsonl --out sft_out',
    ],
  },
  toc: [
    { id: 'install', title: 'Install' },
    { id: 'smoke-test', title: 'Smoke test' },
    { id: 'r0-training', title: 'R0 training' },
    { id: 'cpu-mini', title: 'CPU mini' },
    { id: 'sft', title: 'SFT' },
  ],
};

export const scalingContent = {
  intro:
    'MOI uses a fixed scaling ladder. Shape rules are locked in now — every future size is just a config swap.',
  ladder: {
    headers: ['Rung', 'Params', 'd_model', 'Layers', 'Q/KV heads', 'Context', 'Config'],
    rows: [
      ['R0', '100M', '768', '12', '12 / 4', '1K', 'configs/r0_100m.yaml'],
      ['R1', '1.5B', '2048', '24', '16 / 4', '4K', 'configs/r1_1.5b.yaml'],
      ['R2', '7B', '4096', '32', '32 / 8', '8K', 'configs/r2_7b.yaml'],
      ['R3', '20B', '6144', '44', '48 / 8', '32K', 'configs/r3_20b.yaml'],
      ['R4', '50B', '8192', '64', '64 / 8', '32K→128K', 'configs/r4_50b.yaml'],
    ],
  },
  shapeRules: [
    'head_dim = 128 at scale',
    'd_ffn ≈ 8/3 · d_model (multiple of 256)',
    'GQA with 4–8 KV heads',
    'Depth and width grow together',
  ],
  lockedDecisions: [
    'Tokenizer + special tokens (ChatML + reserved tool-use/FIM IDs) — moi/tokenizer.py',
    'Checkpoint format: safetensors with standard weight names — moi/checkpoint.py',
    'Config-driven everything: one YAML per rung, no hard-coded shapes',
    'Reproducibility metadata (seed, git commit, tokenizer hash, data manifest) in every checkpoint',
    'Deterministic, resumable data loader — moi/data.py, moi/checkpoint.py',
  ],
  trainingSafety: [
    'Device-agnostic (CUDA → MPS → CPU)',
    'Autocast (bf16 CUDA / fp16 MPS)',
    'Gradient-norm logging and loss-spike skipping',
    'FSDP2 per-block hooks (no-op on single device)',
    'Bit-exact resume from checkpoint',
  ],
  repoLayout: [
    'moi/ — core package (config, model, data, schedule, checkpoint, tokenizer, chat, train, sft, generate)',
    'configs/ — one YAML per rung (smoke, R0–R4)',
    'scripts/ — train_tokenizer, prepare_data, train, generate, sft, smoke_test',
    'tests/ — pytest: shapes, RoPE, GQA, checkpoint roundtrip, loader determinism',
  ],
  toc: [
    { id: 'ladder', title: 'Scaling ladder' },
    { id: 'shape-rules', title: 'Shape rules' },
    { id: 'locked-decisions', title: 'Locked-in decisions' },
    { id: 'training-safety', title: 'Training safety' },
    { id: 'repo-layout', title: 'Repository layout' },
  ],
};

export const roadmapContent = {
  intro:
    'MOI development follows a staged scaling ladder. Each rung validates the stack before committing to the next order of magnitude.',
  stages: [
    {
      id: 'r0',
      title: 'R0 — 100M (now)',
      description: 'Train the 100M rung on TinyStories on Apple Silicon. Validate loss convergence, generation quality, and the full train → checkpoint → generate loop.',
    },
    {
      id: 'r1',
      title: 'R1 — 1.5B',
      description: 'Same codebase with FSDP on multi-GPU hardware. Target 30–100B tokens of training data.',
    },
    {
      id: 'r2',
      title: 'R2 — 7B',
      description: 'Production-scale proof model. 0.5–2T tokens, full evaluation harness, SFT and preference optimisation.',
    },
    {
      id: 'r3-r4',
      title: 'R3 / R4 — 20B / 50B',
      description: 'Large-scale deployment. 3D parallelism, 1–10T tokens, comprehensive safety programme.',
    },
  ],
  references: [
    { title: 'Attention Is All You Need', authors: 'Vaswani et al., 2017' },
    { title: 'Training Compute-Optimal Large Language Models (Chinchilla)', authors: 'Hoffmann et al., 2022' },
  ],
  toc: [
    { id: 'stages', title: 'Development stages' },
    { id: 'references', title: 'References' },
  ],
};

export const moiDocsSeo = {
  overview: {
    title: 'MOI AI Overview — MO Intelligence R&D Docs',
    description:
      'MOI AI is Mauritius\'s own large language model, built from scratch by MO Intelligence. Currently under development at the 100M-parameter scale.',
    url: 'https://moi-ai.dev/docs/moi',
  },
  architecture: {
    title: 'MOI AI Architecture — MO Intelligence R&D Docs',
    description:
      'MOI architecture: RMSNorm, RoPE, GQA attention, SwiGLU feed-forward, tied embeddings. R0 100M parameter configuration.',
    url: 'https://moi-ai.dev/docs/moi/architecture',
  },
  training: {
    title: 'MOI AI Training — MO Intelligence R&D Docs',
    description:
      'Train MOI from scratch: smoke test, R0 TinyStories training on Apple Silicon, CPU mini runs, and supervised fine-tuning.',
    url: 'https://moi-ai.dev/docs/moi/training',
  },
  scaling: {
    title: 'MOI AI Scaling — MO Intelligence R&D Docs',
    description:
      'MOI scaling ladder from 100M (R0) to 50B (R4). Shape rules, locked-in decisions, and training safety features.',
    url: 'https://moi-ai.dev/docs/moi/scaling',
  },
  roadmap: {
    title: 'MOI AI Roadmap — MO Intelligence R&D Docs',
    description:
      'MOI development roadmap: R0 research on M1 through R4 production-scale deployment.',
    url: 'https://moi-ai.dev/docs/moi/roadmap',
  },
};
