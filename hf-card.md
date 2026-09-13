---
license: cc-by-4.0
language:
  - en
pretty_name: ModelFit Local LLM Hardware Compatibility Dataset
size_categories:
  - n<1K
task_categories:
  - other
tags:
  - local-llm
  - ollama
  - llama-cpp
  - quantization
  - gguf
  - vram
  - unified-memory
  - apple-silicon
  - nvidia
  - hardware-compatibility
configs:
  - config_name: default
    data_files:
      - split: train
        path: models.csv
---

# ModelFit — Local LLM Hardware Compatibility Dataset

An open dataset of **which local AI models (Ollama) fit which hardware** — by
parameter size, quantization, minimum RAM, and estimated memory load — across
Apple Silicon Macs, iPhones, and NVIDIA GPUs.

Maintained by **[ModelFit](https://modelfit.io/)**. Browse it as an interactive
table at **[modelfit.io/data](https://modelfit.io/data/)**; the canonical
machine-readable source is
**[modelfit.io/api/dataset](https://modelfit.io/api/dataset/)**.

- **141 models** across 24 families (106 with a registry-verified local build, 35 cloud-only APIs tracked for comparison)
- **License:** CC BY 4.0 — reuse freely, including commercially, with attribution
- **Updated:** see the `updated` field in `models.json` (regenerated from the live endpoint)

```python
from datasets import load_dataset

ds = load_dataset("modelfit/modelfit-hardware-dataset", split="train")
# which models fit 16 GB of unified memory?
ds.filter(lambda r: r["runsLocally"] and r["minRamGb"] <= 16).to_pandas()
```

## Files

| File | What it is |
|------|------------|
| [`models.csv`](models.csv) | Flat one-row-per-model table (the loadable split) |
| [`models.json`](models.json) | Full export with metadata, methodology, and counts |
| `generate.mjs` | Regenerates both files from the live endpoint |
| `CITATION.cff` | Machine-readable citation |

## Columns

- `model` — display name (e.g. `Qwen3.5 9B Instruct`)
- `family` — model family (Qwen, Llama, Gemma, DeepSeek, …)
- `params` — parameter count, in billions (`null` when the vendor does not disclose it, e.g. closed API models)
- `quantization` — e.g. `Q4_K_M`
- `minRamGb` — minimum unified memory / VRAM to load it
- `estimatedLoadGb` — approximate memory footprint at this quantization
- `kvKbPerToken` — exact fp16 KV-cache cost in KB per token for hybrid linear-attention models (Qwen3.5/3.6, Qwen3-Next), computed from the published HF config (full-attention layers × kv_heads × head_dim × 2 × 2 bytes; only full-attention layers cache KV). `null` for standard GQA models, whose KV is estimated by size class. Example: Qwen3.6 35B-A3B is 20 KB/token, so a full 262k-token fp16 cache is ~5 GB
- `runsLocally` — `true` when a registry-verified Ollama build fits at least one consumer RAM tier tracked here (up to 256GB)
- `openWeights` — `true` when the weights are publicly downloadable. Can be `true` while `runsLocally` is `false`: open-weight giants like NVIDIA Nemotron 3 Ultra (550B, ~190GB at 2-bit) or Kimi K2 exceed every consumer tier
- `ggufDiy` — `true` when the weights are open and a ~Q4 GGUF (0.6 GB per billion parameters) fits a 256GB-class machine via llama.cpp, but no Ollama build exists (e.g. DeepSeek V4 Flash 284B, Xiaomi MiMo-V2-Flash 309B) — runnable DIY, not scored for local fit
- `runtimes` — apps the model runs in (`ollama`, `llama.cpp`, `lm-studio`; pipe-separated in the CSV, empty for cloud rows)
- `bestFor` — primary workloads
- `ollamaCommand` — exact `ollama run …` command (local models)

## Methodology

A model **fits** a device when its `estimatedLoadGb` is within the memory
budget: **~70%** of unified memory on machines up to 32GB, scaling linearly to
**~85%** at 128GB and above (high-RAM Macs can wire more memory to the GPU via
`iogpu.wired_limit_mb`; the rest goes to the OS, context, and KV-cache). At
`Q4_K_M`, a model needs roughly **0.6 GB per billion parameters**. Memory-load
and tokens/sec figures are **estimates, not measured benchmarks**. Local model
tags are verified against the Ollama registry. Full estimate policy:
[modelfit.io/about](https://modelfit.io/about/).

## Intended use and limitations

- Built to answer "does this model run on this machine?" for consumer hardware (Apple Silicon, iPhone, NVIDIA consumer GPUs).
- LLM inference speed, real-world context limits, and quality are **not** in this dataset.
- Consumer tiers only: no datacenter SKUs or multi-GPU rigs are scored here.

## Updating

```bash
node generate.mjs   # pulls the latest from https://modelfit.io/api/dataset/
```

## License & attribution

Released under **[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)**.
You may share and adapt the data, including commercially, **with attribution**:

> Data: [ModelFit Local LLM Hardware Compatibility Dataset](https://modelfit.io/data/) (modelfit.io), CC BY 4.0.

## Cite

```
ModelFit — Local LLM Hardware Compatibility Dataset.
https://modelfit.io/data/
```

---

Built and maintained by [ModelFit](https://modelfit.io/) — find the best local
AI model for your Mac, iPhone, or GPU. Mirrors:
[GitHub](https://github.com/modelfit/modelfit-hardware-dataset) ·
[Hugging Face](https://huggingface.co/datasets/modelfit/modelfit-hardware-dataset).
