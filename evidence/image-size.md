# Image size — notifications (workspace#036-distroless-wave-1)

| metric | before (debian12) | after (debian13) | delta |
|---|---|---|---|
| `docker image inspect .Size` | 91.1 MB | 93.0 MB | +2.10% |
| `docker save` piped to `wc -c` | 91.1 MB | 93.0 MB | +2.10% |

A ~2 MB (+2.1%) increase, entirely from the newer Debian 13 base layer
(newer glibc/OpenSSL). **This is expected and accepted**: this wave is CVE
hygiene, not a size exercise — the size reduction was already banked when this
repo moved to distroless. The trade is ~2 MB for six fixable OS CVEs
(1 CRITICAL + 5 HIGH in `libssl3`) going to zero.

No size gate is enforced by `.docker/distroless-image-smoke.sh`; it reports
`SIZE_DELTA_PCT` for the record.
