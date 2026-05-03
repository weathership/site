"""Behave hooks for the weathership site BDD suite.

Two responsibilities:

* Resolve `WEATHERSHIP_URL` (the target the suite hits) and stash it on
  the context so step impls can use it without re-reading os.environ.
* Resolve project root so steps can read brand/* files when comparing
  documented assets to served assets.

Deliberately minimal — no tier tagging, no GPU probe, no auto-start of
external services. The suite runs against a URL; whoever invokes it is
responsible for making that URL respond.
"""

from __future__ import annotations

import os
from pathlib import Path

DEFAULT_URL = "http://localhost:8787"


def before_all(context):
    context.url = os.environ.get("WEATHERSHIP_URL", DEFAULT_URL).rstrip("/")
    context.project_root = Path(__file__).resolve().parent.parent
    context.brand_root = context.project_root / "brand"


def before_scenario(context, scenario):
    # Per-scenario httpx client lives in a step's request fixture; we
    # don't construct it here so each scenario can customize headers.
    context._cleanups: list = []


def after_scenario(context, scenario):
    while getattr(context, "_cleanups", []):
        try:
            context._cleanups.pop()()
        except Exception:
            # Best-effort cleanup; failures here shouldn't mask scenario
            # outcomes. The behave reporter has already recorded the
            # scenario's pass/fail before this hook runs.
            pass
