# Upstream route96 v0.7.0, unchanged except for a current CA bundle.
# v0.7.0 ships ca-certificates 20250419, which still trusts the compromised
# eMudhra/emSign G3 and Sectigo AAA roots (Debian DSA, 2026-10-20).
FROM voidic/route96:v0.7.0@sha256:5ab6064f18ca191dd5836487505607122ef3bfeba6e6ccc5b28eef5c604cf4cc
RUN apt-get update \
 && apt-get install -y --no-install-recommends --only-upgrade ca-certificates \
 && rm -rf /var/lib/apt/lists/*
