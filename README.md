# ModelFit — Local LLM Hardware Compatibility Dataset

An open dataset of **which local AI models (Ollama) fit which hardware** — by
parameter size, quantization, minimum RAM, and estimated memory load — across
Apple Silicon Macs, iPhones, and NVIDIA GPUs.

Maintained by **[ModelFit](https://modelfit.io/)**. Browse it as an interactive
table at **<https://modelfit.io/data/>**; the canonical machine-readable source
is **<https://modelfit.io/api/dataset/>**.

## Files

| File | What it is |
|------|------------|
| [`models.json`](models.json) | Full export with metadata, methodology, and counts |
| [`models.csv`](models.csv) | Flat one-row-per-model table |
| [`generate.mjs`](generate.mjs) | Regenerates both files from the live endpoint |

## Columns

- `model` — display name (e.g. `Qwen3.5 9B Instruct`)
- `family` — model family (Qwen, Llama, Gemma, DeepSeek, …)
- `params` — parameter count, in billions
- `quantization` — e.g. `Q4_K_M`
- `minRamGb` — minimum unified memory / VRAM to load it
- `estimatedLoadGb` — approximate memory footprint at this quantization
- `runsLocally` — `true` for local (Ollama) models, `false` for cloud-only APIs
- `bestFor` — primary workloads
- `ollamaCommand` — exact `ollama run …` command (local models)

## Methodology

A model **fits** a device when its `estimatedLoadGb` is within **~70%** of the
device's unified memory (the rest goes to the OS, context, and KV-cache). At
`Q4_K_M`, a model needs roughly **0.6 GB per billion parameters**. Memory-load
and tokens/sec figures are **estimates, not measured benchmarks**. Local model
tags are verified against the Ollama registry.

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
AI model for your Mac, iPhone, or GPU.
