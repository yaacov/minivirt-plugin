/**
 * VirtualMachine YAML template file
 * 
 * Template:
 *   KIND: VirtualMachine
 *   OS: cirros
 *   IMAGE: quay.io/kubevirt/cirros-container-disk-demo:devel
 */

export const cirosVirtualMachine = `---
apiVersion: kubevirt.io/v1
kind: VirtualMachine
metadata:
  name: example-cirros
spec:
  running: false
  template:
    spec:
      resources:
        requests:
          memory: 128Mi
      domain:
        devices:
          disks:
          - disk:
              bus: virtio
            name: containerdisk
      volumes:
      - containerDisk:
          image: quay.io/kubevirt/cirros-container-disk-demo:devel
        name: containerdisk
`;