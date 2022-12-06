import type { EncodedExtension } from '@openshift/dynamic-plugin-sdk';
import type {
  ExtensionK8sModel,
  ResourceClusterNavItem,
  ResourceListPage,
  YAMLTemplate,
} from '@openshift-console/dynamic-plugin-sdk';
import type { ConsolePluginMetadata } from '@openshift-console/dynamic-plugin-sdk-webpack/lib/schema/plugin-package';

/**
 * Plugin metadata
 */

export const pluginMetadata = {
  name: 'minivirt-plugin',
  version: '0.0.1',
  displayName: 'Minimal virtualization plugin',
  description:
    'Minimal Openshift console plugin for the virtualization operator.',
  exposedModules: {
    'VirtualMachinesPage': './VirtualMachines/VirtualMachinesPage',
    'templates': './VirtualMachines/templates',
  },
  dependencies: {
    '@console/pluginAPI': '*',
  },
} as ConsolePluginMetadata;

/**
 * Plugin extensions
 */

const VirtualMachineModel: ExtensionK8sModel = {
  group: 'kubevirt.io',
  kind: 'VirtualMachine',
  version: 'v1',
};

const VirtualMachinePoolModel: ExtensionK8sModel = {
  group: 'pool.kubevirt.io',
  kind: 'VirtualMachinePool',
  version: 'v1alpha1',
};

export const extensions: EncodedExtension[] = [
  {
    type: 'console.navigation/resource-cluster',
    properties: {
      id: 'virtualmachines',
      // t('VirtualMachines')
      name: '%plugin__minivirt-plugin~VirtualMachines%',
      perspective: 'admin',
      section: 'workloads',
      insertAfter: 'pods',
      model: VirtualMachineModel,
      dataAttributes: {
        'data-quickstart-id': 'qs-nav-virtualmachines-list',
        'data-test-id': 'virtualmachines-nav-list',
      },
    },
  } as EncodedExtension<ResourceClusterNavItem>,

  {
    type: 'console.page/resource/list',
    properties: {
      component: {
        $codeRef: 'VirtualMachinesPage',
      },
      model: VirtualMachineModel,
    },
  } as EncodedExtension<ResourceListPage>,

  {
    type: 'console.navigation/resource-cluster',
    properties: {
      id: 'virtualmachinepools',
      // t('VirtualMachinePools')
      name: '%plugin__minivirt-plugin~VirtualMachinePools%',
      perspective: 'admin',
      section: 'workloads',
      insertAfter: 'replicasets',
      model: VirtualMachinePoolModel,
      dataAttributes: {
        'data-quickstart-id': 'qs-nav-virtualmachinepools-list',
        'data-test-id': 'virtualmachinepools-nav-list',
      },
    },
  } as EncodedExtension<ResourceClusterNavItem>,

  {
    type: 'console.yaml-template',
    properties: {
      name: "default",
      model: VirtualMachineModel,
      template: { "$codeRef": "templates.cirosVirtualMachine" }
    }
  } as EncodedExtension<YAMLTemplate>,

  {
    type: 'console.yaml-template',
    properties: {
      name: "default",
      model: VirtualMachinePoolModel,
      template: { "$codeRef": "templates.cirosVirtualMachinePool" }
    }
  } as EncodedExtension<YAMLTemplate>,
];
