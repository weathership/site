"""HTTP step impls for the weathership site BDD suite.

Uses httpx because it has reasonable defaults and a sync API. The
client is constructed per-scenario via context.url (set in
environment.before_all).
"""

from __future__ import annotations

from pathlib import Path

import httpx
from behave import then, when


@when('I GET "{path}"')
def step_get(context, path: str) -> None:
    url = context.url + path
    context.response = httpx.get(url, follow_redirects=True, timeout=10.0)


@then("the response status is {status:d}")
def step_status(context, status: int) -> None:
    assert context.response.status_code == status, (
        f"expected {status}, got {context.response.status_code} "
        f"for {context.response.request.url}"
    )


@then('the response body contains "{needle}"')
def step_body_contains(context, needle: str) -> None:
    body = context.response.text
    assert needle in body, (
        f"expected response body to contain {needle!r}; "
        f"got {len(body)} bytes from {context.response.request.url}"
    )


@then('the response body equals "{expected}"')
def step_body_equals(context, expected: str) -> None:
    # Behave un-escapes \n etc. in feature files when the step text
    # uses double quotes, but be defensive about the common case.
    expected = expected.replace("\\n", "\n")
    assert context.response.text == expected, (
        f"expected exact body {expected!r}, got {context.response.text!r}"
    )


@then('the response content type is "{ctype}"')
def step_content_type(context, ctype: str) -> None:
    actual = context.response.headers.get("content-type", "")
    assert ctype in actual, (
        f"expected content-type to include {ctype!r}, got {actual!r}"
    )


@then("the response body references every logo variant under brand/logo")
def step_body_references_logo_variants(context) -> None:
    """Walk brand/logo/ and assert every .svg's basename appears in the body.

    Catches drift between the file tree and the enumeration in
    web/src/lib/brand-assets.ts (which is hand-maintained).
    """
    body = context.response.text
    logo_root = Path(context.brand_root) / "logo"
    missing: list[str] = []
    for svg in sorted(logo_root.rglob("*.svg")):
        rel = svg.relative_to(context.brand_root.parent / "brand").as_posix()
        href = "/brand/" + rel
        if href not in body:
            missing.append(href)
    assert not missing, (
        f"the following logo SVG paths were not referenced on the page: {missing}"
    )
