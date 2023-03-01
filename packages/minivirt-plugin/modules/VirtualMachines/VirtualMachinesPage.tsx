import { K8sGroupVersionKind, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import React from 'react';
import { StandardPage } from '@yaacov/common/components/StandardPage';
import { Field } from '@yaacov/common/components/types';
import { useTranslation } from '@yaacov/common/utils/i18n';
import ProviderRow from './VirtualMachineRow';

const fieldsMetadata: Field[] = [
  {
    id: 'name',
    toLabel: (t) => t('Name'),
    isVisible: true,
    isIdentity: true, // Name is sufficient ID when Namespace is pre-selected
    filter: {
      type: 'freetext',
      toPlaceholderLabel: (t) => t('Filter by name'),
    },
    sortable: true,
  },
  {
    id: 'namespace',
    toLabel: (t) => t('Namespace'),
    isVisible: true,
    isIdentity: true,
    filter: {
      type: 'freetext',
      toPlaceholderLabel: (t) => t('Filter by namespace'),
    },
    sortable: true,
  },
  {
    id: 'status',
    toLabel: (t) => t('Status'),
    isVisible: true,
    filter: {
      type: 'enum',
      primary: true,
      toPlaceholderLabel: (t) => t('Status'),
      values: [
        {id: 'Stopped', toLabel: ()=>'Stopped'},
        {id: 'Running', toLabel: ()=>'Running'},
        {id: 'Err', toLabel: ()=>'Error'}
      ],
    },
    sortable: true,
  },
];

export const ProvidersPage = ({ namespace, kind }) => {
  const { t } = useTranslation();

  const VirtualMachineModel: K8sGroupVersionKind = {
    group: 'kubevirt.io',
    kind: 'VirtualMachine',
    version: 'v1',
  };
  
  const [vms, loaded, loadError] = useK8sWatchResource<any[]>({
    groupVersionKind: VirtualMachineModel,
    isList: true,
    namespaced: false,
  });

  const dataSource: [any[], boolean, boolean] = [
    vms ? vms.map((vm) => ({name: vm?.metadata?.name, namespace: vm?.metadata?.namespace, status: vm?.status?.printableStatus})) : vms,
    loaded, loadError
  ];

  return <StandardPage<any>
    dataSource={dataSource}
    RowMapper={ProviderRow}
    fieldsMetadata={fieldsMetadata}
    namespace={namespace}
    title={t('VIrtualMachines')}
    pagination={100}
  />;

};

export default ProvidersPage;
