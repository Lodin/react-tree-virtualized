import * as React from 'react';
import {NodeProps} from './types';

const leafStyle = {
  marginLeft: 20,
};

export default function defaultNodeRenderer({
  className,
  deepLevel,
  isLeaf,
  isOpened,
  key,
  nodeData,
  onNodeClick,
  onNodeDoubleClick,
  onNodeMouseOut,
  onNodeMouseOver,
  onNodeRightClick,
  onNodeToggle,
  style,
}: NodeProps): React.ReactNode {
  const a11yProps: any = {};

  if (
    onNodeClick ||
    onNodeDoubleClick ||
    onNodeMouseOver ||
    onNodeMouseOut ||
    onNodeRightClick
  ) {
    a11yProps['aria-label'] = 'tree-node';
    a11yProps.tabIndex = 0;

    if (onNodeClick) {
      a11yProps.onClick =
        (event: React.MouseEvent<any>) => {
          onNodeClick({
            event,
            nodeData,
          });
        };
    }

    if (onNodeDoubleClick) {
      a11yProps.onDoubleClick =
        (event: React.MouseEvent<any>) => {
          onNodeDoubleClick({
            event,
            nodeData,
          });
        };
    }

    if (onNodeMouseOver) {
      a11yProps.onMouseOut =
        (event: React.MouseEvent<any>) => {
          onNodeMouseOver({
            event,
            nodeData,
          });
        };
    }

    if (onNodeMouseOut) {
      a11yProps.onMouseOver =
        (event: React.MouseEvent<any>) => {
          onNodeMouseOut({
            event,
            nodeData,
          });
        };
    }

    if (onNodeRightClick) {
      a11yProps.onContextMenu =
        (event: React.MouseEvent<any>) => {
          onNodeRightClick({
            event,
            nodeData,
          });
        };
    }
  }

  const s = {
    ...style,
    marginLeft: deepLevel * 10,
  };

  return (
    <div
      {...a11yProps}
      className={className}
      key={key}
      style={s}
    >
      {
        !isLeaf && (
          <span
            role="button"
            onClick={onNodeToggle}
          >
            {isOpened ? '[-]' : '[+]'}&nbsp;
          </span>
        )
      }
      <span style={isLeaf ? leafStyle : undefined}>
        {String(nodeData)}
      </span>
    </div>
  );
}
