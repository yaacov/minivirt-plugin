# minivirt-plugin

A minimalistic Openshift web console plugin.

## Development

``` bash
# set up a cluster, and a locally running web console
# see instructions below about how to set a minimal kubernetes env using KinD

# run the development
npm install

npm run start
```

## Build and run the container image

``` bash
# build
podman build -t quay.io/yaacov/minivirt-plugin .

# run locally (with locally running Openshift web console, see below)
podman run -it -p 9001:8080 minivirt-plugin
```

## Minimal kubernetes enviornment, with locally running web console

``` bash
# create new cluster, as root user
sudo kind create cluster

# login as regular user
sudo cp /root/.kube/config ~/.kube/config

# create a service account to run the web console
SERVICE_ACCOUNT=forklift-user
NAMESPACE=default

cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ServiceAccount
metadata:
  name: ${SERVICE_ACCOUNT}
  namespace: ${NAMESPACE}
automountServiceAccountToken: true
EOF

cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: ${SERVICE_ACCOUNT}
  namespace: ${NAMESPACE}
  annotations:
    kubernetes.io/service-account.name: ${SERVICE_ACCOUNT}
type: kubernetes.io/service-account-token
EOF

kubectl create clusterrolebinding ${SERVICE_ACCOUNT}-forklift-reader \
  --clusterrole=cluster-admin \
  --serviceaccount=${NAMESPACE}:${SERVICE_ACCOUNT}

# get api endpoint
# you can use `kubectl cluster-info`
ENDPOINT=$(kubectl cluster-info --context kind-kind | grep Kubernetes | cut -f7 -d' ' | sed -r "s/\x1B\[([0-9]{1,3}(;[0-9]{1,2};?)?)?[mGK]//g")

# get api token
TOKEN=$(kubectl get secret ${SERVICE_ACCOUNT} -n ${NAMESPACE} -o=jsonpath={.data.token} | base64 -d)

# check endpoint and token
echo $ENDPOINT
echo $TOKEN

# start a local web console
kubectl apply -f https://raw.githubusercontent.com/yaacov/forklift-console-plugin/main/scripts/yaml/crds/console.openshift.io_consoleplugins.yaml

BRIDGE_K8S_MODE_OFF_CLUSTER_ENDPOINT=$ENDPOINT BRIDGE_K8S_AUTH_BEARER_TOKEN=$TOKEN ./ci-scripts/start-console.sh

# install kubevirt
bash ./ci-scripts/deploy-kubevirt.sh
```
