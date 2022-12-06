/**
 * VirtualMachine YAML template file
 * 
 * Template:
 *   KIND: VirtualMachine
 *   OS: cirros
 *   IMAGE: quay.io/kubevirt/cirros-container-disk-demo:devel
 */

export const cirosVirtualMachinePool = `---
apiVersion: pool.kubevirt.io/v1alpha1
kind: VirtualMachinePool
metadata:
  name: example
spec:
  replicas: 1
  selector:
    matchLabels:
      app-name: example
  virtualMachineTemplate:
    metadata:
      labels:
        app-name: example
    spec:
      running: false
      template:
        spec:
          domain:
            devices:
              disks:
                - disk:
                    bus: virtio
                  name: containerdisk
            resources:
              requests:
                memory: 128Mi
          volumes:
            - containerDisk:
                image: 'quay.io/kubevirt/cirros-container-disk-demo:devel'
              name: containerdisk
`;