import { useFieldSchema } from '@formily/react';
import { SchemaSettings } from '../../application/schema-settings/SchemaSettings';
import { useCollection } from '../../collection-manager';
import { SchemaSettingsBlockTitleItem, SchemaSettingsFormItemTemplate } from '../../schema-settings';

export const singleDataDetailsBlockSettings = new SchemaSettings({
  name: 'singleDataDetailsBlockSettings',
  items: [
    {
      name: 'title',
      Component: SchemaSettingsBlockTitleItem,
    },
    {
      name: 'formItemTemplate',
      Component: SchemaSettingsFormItemTemplate,
      useComponentProps() {
        const { name } = useCollection();
        const fieldSchema = useFieldSchema();
        const defaultResource = fieldSchema?.['x-decorator-props']?.resource;
        return {
          insertAdjacentPosition: 'beforeEnd',
          componentName: 'ReadPrettyFormItem',
          collectionName: name,
          resourceName: defaultResource,
        };
      },
    },
    {
      name: 'divider',
      type: 'divider',
    },
    {
      name: 'remove',
      type: 'remove',
      componentProps: {
        removeParentsIfNoChildren: true,
        breakRemoveOn: {
          'x-component': 'Grid',
        },
      },
    },
  ],
});

export const detailsBlockFieldSettings = new SchemaSettings({
  name: 'fieldSettings:detailsBlock',
  items: [],
});