#!/usr/bin/env bash
# workspace#036-distroless-wave-1 — persisted runtime-image regression for
# alkemio/notifications (epic alkem-io/infrastructure-operations#2499).
#
# Modelled on workspace#026's server/.docker/distroless-image-smoke.sh.
#
# Asserts the distroless runtime contract:
#   - runs as UID 65532 (nonroot); CMD == ["dist/main.js"]; distroless node entrypoint
#   - no shell, no package manager reachable as an entrypoint override
#   - no src/*.ts tree, no ts-node/typescript/pnpm in node_modules
#   - the deliberately-copied runtime assets ARE present
#     (dist/main.js, src/email-templates/, notifications.yml, package.json)
#   - the native sentinel `farmhash` loads — the direct test of the
#     trixie-builder / trixie-runtime glibc pairing
#   - the Dockerfile carries no floating FROM (both bases digest-pinned)
#   - emits IMAGE_DIGEST= / IMAGE_SIZE_BYTES=
#
# Usage: .docker/distroless-image-smoke.sh <image[:tag]> [baseline_size_bytes]
#
# Baseline default (91.1 MiB uncompressed / 95523751 B `docker save`) is the
# pre-change image built from this repo at 3f2b0ff (debian12 runtime,
# node:22.23.2-bookworm builder), measured 2026-08-05. This swap is CVE hygiene,
# not a size exercise: no minimum reduction is enforced, the delta is reported.
set -euo pipefail

IMAGE="${1:?usage: distroless-image-smoke.sh <image> [baseline_size_bytes]}"
BASELINE_IMAGE_SIZE_BYTES="${2:-95523751}"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

fail() { echo "FAIL: $*" >&2; exit 1; }
pass() { echo "PASS: $*"; }
note() { echo "NOTE: $*"; }

run_node() { docker run --rm --entrypoint /nodejs/bin/node "$IMAGE" "$@"; }

echo "== distroless-image-smoke: $IMAGE =="

# --- user / entrypoint / CMD ------------------------------------------------
USER_ID="$(docker inspect "$IMAGE" --format '{{.Config.User}}')"
[ "$USER_ID" = "65532" ] || [ "$USER_ID" = "nonroot" ] ||
  fail "expected user 65532/nonroot, got '$USER_ID'"
pass "runs as user '$USER_ID'"

ENTRYPOINT_JSON="$(docker inspect "$IMAGE" --format '{{json .Config.Entrypoint}}')"
echo "$ENTRYPOINT_JSON" | grep -q '/nodejs/bin/node' ||
  fail "expected distroless node entrypoint, got $ENTRYPOINT_JSON"
pass "entrypoint is the distroless node binary"

CMD_JSON="$(docker inspect "$IMAGE" --format '{{json .Config.Cmd}}')"
[ "$CMD_JSON" = '["dist/main.js"]' ] || fail "expected CMD [\"dist/main.js\"], got $CMD_JSON"
pass "CMD is [\"dist/main.js\"]"

# --- no shell / no package manager -----------------------------------------
# Probe for EXISTENCE on the filesystem, not exit status. A bare `docker run
# --entrypoint apk <img>` exits non-zero on an image that HAS a working apk
# (apk with no args is a usage error), so an exit-status test reports present
# binaries as absent — it has no detection power. lstat (not existsSync) so a
# dangling symlink still counts as a hit; Google's :debug variants put the
# shell at /busybox/sh -> /busybox/busybox.
FORBIDDEN="$(run_node -e "
const fs = require('fs');
const paths = [
  '/bin/sh','/bin/bash','/usr/bin/sh','/usr/bin/bash',
  '/busybox/sh','/busybox/busybox','/bin/busybox','/usr/bin/busybox',
  '/sbin/apk','/usr/bin/apk','/usr/bin/apt','/usr/bin/apt-get','/usr/bin/dpkg',
  '/usr/local/bin/npm','/usr/local/bin/npx','/usr/local/bin/yarn','/usr/local/bin/pnpm',
  '/usr/bin/npm','/usr/bin/yarn','/usr/bin/pnpm',
];
const hits = paths.filter(p => { try { fs.lstatSync(p); return true; } catch { return false; } });
console.log(hits.join(','));
")"
[ -z "$FORBIDDEN" ] || fail "shell/package-manager present in runtime image: $FORBIDDEN"
pass "no shell / package manager present on the filesystem"

# --- build-time-only artifacts are absent -----------------------------------
HAS_SRC_TS="$(run_node -e "
const fs=require('fs');
const p='/app/src';
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).some(e=>
  e.isDirectory()? walk(d+'/'+e.name) : e.name.endsWith('.ts'));
console.log(String(fs.existsSync(p) ? walk(p) : false));")"
[ "$HAS_SRC_TS" = "false" ] || fail "expected no .ts sources under /app/src"
pass "no TypeScript sources in the runtime image"

for m in ts-node typescript pnpm; do
  HAS="$(run_node -e "console.log(require('fs').existsSync('/app/node_modules/$m'))")"
  [ "$HAS" = "false" ] || fail "expected no '$m' in node_modules"
done
pass "no ts-node / typescript / pnpm in node_modules"

# --- deliberately-copied runtime assets ARE present -------------------------
for f in /app/dist/main.js /app/src/email-templates /app/notifications.yml /app/package.json; do
  HAS="$(run_node -e "console.log(require('fs').existsSync('$f'))")"
  [ "$HAS" = "true" ] || fail "expected '$f' to be present in the runtime image"
done
pass "dist/main.js, src/email-templates/, notifications.yml, package.json all present"

# --- native sentinel: farmhash (glibc pairing proof) ------------------------
# farmhash is the ONLY module in the production tree shipping a compiled
# .node binary (verified against service/package-lock.json hasInstallScript
# entries + a filesystem sweep of the built image). bcrypt / bufferutil /
# utf-8-validate are NOT in this repo's production dependency tree.
FARMHASH_OUT="$(run_node -e "
const fh=require('/app/node_modules/farmhash');
if (typeof fh.hash32('abc') !== 'number') throw new Error('farmhash returned non-number');
console.log('farmhash-ok');")"
[ "$FARMHASH_OUT" = "farmhash-ok" ] || fail "expected farmhash to load, got: $FARMHASH_OUT"
pass "farmhash loads and computes (glibc-matched native binary)"

NODE_ABI="$(run_node -e "console.log(process.versions.modules)")"
[ "$NODE_ABI" = "127" ] || note "NODE_MODULE_VERSION is $NODE_ABI (expected 127 for Node 22)"
[ "$NODE_ABI" = "127" ] && pass "NODE_MODULE_VERSION is 127 (Node 22 ABI unchanged)"

# --- known C3 exception: report, do not fail --------------------------------
# `cross-env` is declared in `dependencies` (not devDependencies) and therefore
# ships in the production image. Ruling C3: out of scope for this wave — moving
# it is a dependency change, not a base-image change. Tracked as follow-up F1.
# `@nestjs/cli` is ALSO declared in `dependencies`, but npm dedupes it to the
# devDependencies range and marks it dev in the lockfile, so `npm ci --omit=dev`
# already strips it; this harness verifies that empirically rather than assuming.
for m in cross-env @nestjs/cli; do
  HAS="$(run_node -e "console.log(require('fs').existsSync('/app/node_modules/$m'))")"
  note "C3/F1: '$m' present in runtime node_modules = $HAS"
done

# --- no floating FROM in the Dockerfile -------------------------------------
if [ -f "$REPO_ROOT/Dockerfile" ]; then
  UNPINNED="$(grep -E '^[[:space:]]*FROM[[:space:]]' "$REPO_ROOT/Dockerfile" | grep -v '@sha256:' || true)"
  [ -z "$UNPINNED" ] || fail "unpinned FROM line(s) in Dockerfile:
$UNPINNED"
  pass "every FROM in the Dockerfile is digest-pinned"
else
  note "Dockerfile not found at $REPO_ROOT/Dockerfile — skipped FROM pin check"
fi

# --- size reporting ---------------------------------------------------------
IMAGE_DIGEST="$(docker inspect "$IMAGE" --format '{{.Id}}')"
IMAGE_SIZE_BYTES="$(docker save "$IMAGE" | wc -c)"
echo "IMAGE_DIGEST=$IMAGE_DIGEST"
echo "IMAGE_SIZE_BYTES=$IMAGE_SIZE_BYTES"
echo "BASELINE_IMAGE_SIZE_BYTES=$BASELINE_IMAGE_SIZE_BYTES"
echo "SIZE_DELTA_PCT=$(awk -v new="$IMAGE_SIZE_BYTES" -v old="$BASELINE_IMAGE_SIZE_BYTES" \
  'BEGIN { printf "%+.2f", ((new / old) - 1) * 100 }')"

echo "== distroless-image-smoke: ALL CHECKS PASSED =="
