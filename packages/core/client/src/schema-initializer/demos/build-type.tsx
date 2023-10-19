import React from 'react';
import { Application, Plugin, SchemaInitializerV2, useApp } from '@nocobase/client';

const myInitializer = new SchemaInitializerV2({
  designable: true,
  title: 'Button Text',
  items: [
    {
      name: 'a',
      type: 'itemGroup', // 渲染成类似 MenuGroup 的样式
      title: 'Group a', // group 标题
      children: [
        {
          name: 'a-1',
          type: 'item', // 渲染成 Div + title 的组件
          title: 'A 1',
          // 其他属性
          onClick: () => {
            alert('a-1');
          },
        },
        {
          name: 'a-2',
          type: 'item',
          title: 'A 2',
        },
      ],
    },
    {
      type: 'divider', //  会渲染成分割线
    },
    {
      name: 'b',
      type: 'subMenu',
      title: 'Group B',
      children: [
        {
          name: 'b-1',
          type: 'item',
          title: 'B 1',
          onClick: () => {
            alert('b-1');
          },
        },
        {
          name: 'b-2',
          type: 'item',
          title: 'B 2',
        },
      ],
    },
  ],
});

const Root = () => {
  const app = useApp();
  const initializer = app.schemaInitializerManager.get('MyInitializer');
  return <div>{initializer.render()}</div>;
};

class MyPlugin extends Plugin {
  async load() {
    this.app.schemaInitializerManager.add('MyInitializer', myInitializer);
    this.app.router.add('root', {
      path: '/',
      Component: Root,
    });
  }
}

const app = new Application({
  router: {
    type: 'memory',
    initialEntries: ['/'],
  },
  plugins: [MyPlugin],
});

export default app.getRootComponent();