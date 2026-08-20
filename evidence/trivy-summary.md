# Trivy summary — notifications (workspace#036-distroless-wave-1)

Scanner: aquasec/trivy **0.73.0** (pinned image tag), scanned **by image digest**.
Scans run 2026-08-05. Trivy's JSON carries no `Metadata.DB.UpdatedAt` for these runs;
the vuln DB was downloaded fresh into an empty cache at scan time (2026-08-05T09:54Z),
and both scans reused that same cache, so before/after are DB-consistent.

| | before (debian12) | after (debian13) |
|---|---|---|
| base OS | debian 12.13 | debian 13.6 |
| image digest | `sha256:87b5dd4081413bb2c90…` | `sha256:0bd639d811c066d79fe…` |
| **OS fixable HIGH/CRITICAL** | **6** | **0** |
| OS unfixable HIGH/CRITICAL | 0 | 0 |
| npm fixable HIGH/CRITICAL | 66 | 66 |
| all HIGH/CRITICAL | 73 | 67 |

## Gate

**Zero fixable HIGH/CRITICAL at the OS layer: 6 → 0.** All six were `libssl3`
(CVE-2026-31789 CRITICAL; CVE-2026-28387/28388/28389/28390/45447 HIGH), fixed by
trixie's newer OpenSSL. This is the entire security thesis of the base swap.

## Residual risk — the 66 npm findings

These are **application dependency** CVEs. They are identical before and after: a base-image
swap cannot affect them, and they are explicitly out of scope for this wave (they need
dependency bumps, tracked separately). They are NOT waived — they are unchanged and recorded.

Affected packages (npm layer):

- `@grpc/grpc-js` @ 1.13.4
- `axios` @ 0.21.4, 1.6.8
- `brace-expansion` @ 1.1.12
- `cross-spawn` @ 5.1.0
- `fast-xml-parser` @ 4.5.3
- `form-data` @ 2.3.3, 2.5.5, 3.0.4, 4.0.2, 4.0.4
- `immutable` @ 3.7.6
- `jws` @ 3.2.2, 4.0.0
- `lodash` @ 4.17.23
- `lodash.pick` @ 4.4.0
- `node-forge` @ 1.3.1
- `nodemailer` @ 6.9.10
- `nth-check` @ 1.0.2
- `protobufjs` @ 7.5.3
- `tar-fs` @ 2.1.3
- `undici` @ 6.21.3
- `websocket-driver` @ 0.7.4
