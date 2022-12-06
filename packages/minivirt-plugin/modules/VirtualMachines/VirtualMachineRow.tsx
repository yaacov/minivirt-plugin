import React, { JSXElementConstructor } from 'react';
import { RowProps } from '@yaacov/common/components/TableView';
import { useTranslation } from '@yaacov/common/utils/i18n';

import { K8sGroupVersionKind, ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { Td, Tr } from '@patternfly/react-table';

const VirtualMachineModel: K8sGroupVersionKind = {
  group: 'kubevirt.io',
  kind: 'VirtualMachine',
  version: 'v1',
};

type RowData = any;

const TextCell = ({ value }: { value: string }) => <>{value ?? ''}</>;

const cellCreator: Record<string, (props) => JSX.Element> = {
  name: ({ value }) => <ResourceLink groupVersionKind={VirtualMachineModel} name={value} />,
  namespace: ({ value }) => <ResourceLink kind="Namespace" name={value} />,
  status: TextCell,
};

const VirtualMachineRow = ({ columns, entity }: RowProps<RowData>) => {
  const { t } = useTranslation();
  return (
    <Tr>
      {columns.map(({ id }) => (
        <Td key={id} >
          {cellCreator?.[id]?.({
            value: entity[id],
            entity,
            t,
          }) ?? <TextCell value={String(entity[id] ?? '')} />}
        </Td>
      ))}
    </Tr>
  );
};

export default VirtualMachineRow;
