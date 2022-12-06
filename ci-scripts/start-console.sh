#!/usr/bin/env bash

set -euo pipefail

npm_package_consolePlugin_name="minivirt-plugin"

CONSOLE_IMAGE=${CONSOLE_IMAGE:="quay.io/openshift/origin-console:latest"}
CONSOLE_PORT=${CONSOLE_PORT:=9000}
BRIDGE_K8S_MODE_OFF_CLUSTER_ENDPOINT=${BRIDGE_K8S_MODE_OFF_CLUSTER_ENDPOINT:="https://127.0.0.1:6443"}
BRIDGE_K8S_AUTH_BEARER_TOKEN=${BRIDGE_K8S_AUTH_BEARER_TOKEN:="abcdef.0123456789abcdef"}

echo "Starting local OpenShift console..."

BRIDGE_USER_AUTH="disabled"
BRIDGE_K8S_MODE="off-cluster"
BRIDGE_K8S_AUTH="bearer-token"
BRIDGE_K8S_MODE_OFF_CLUSTER_SKIP_VERIFY_TLS=true

BRIDGE_USER_SETTINGS_LOCATION="localstorage"

echo "API Server: $BRIDGE_K8S_MODE_OFF_CLUSTER_ENDPOINT"
echo "Console Image: $CONSOLE_IMAGE"
echo "Console URL: http://localhost:${CONSOLE_PORT}"

# Prefer podman if installed. Otherwise, fall back to docker.
if [ -x "$(command -v podman)" ]; then
    if [ "$(uname -s)" = "Linux" ]; then
        # Use host networking on Linux since host.containers.internal is unreachable in some environments.
        BRIDGE_PLUGINS="${npm_package_consolePlugin_name}=http://localhost:9001"
        podman run --pull=always --rm --network=host --env-file <(set | grep BRIDGE) $CONSOLE_IMAGE
    else
        BRIDGE_PLUGINS="${npm_package_consolePlugin_name}=http://host.containers.internal:9001"
        podman run --pull=always --rm -p "$CONSOLE_PORT":9000 --env-file <(set | grep BRIDGE) $CONSOLE_IMAGE
    fi
else
    BRIDGE_PLUGINS="${npm_package_consolePlugin_name}=http://host.docker.internal:9001"
    docker run --pull=always --rm -p "$CONSOLE_PORT":9000 --env-file <(set | grep BRIDGE) $CONSOLE_IMAGE
fi
