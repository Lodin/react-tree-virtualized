import * as React from 'react';
import {NodeProps} from './types';

export default function defaultNodeRenderer({
  className,
  isOpened,
  nodeData,
  nodeMeta,
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
            nodeMeta,
          });
        };
    }

    if (onNodeDoubleClick) {
      a11yProps.onDoubleClick =
        (event: React.MouseEvent<any>) => {
          onNodeDoubleClick({
            event,
            nodeMeta,
          });
        };
    }

    if (onNodeMouseOver) {
      a11yProps.onMouseOut =
        (event: React.MouseEvent<any>) => {
          onNodeMouseOver({
            event,
            nodeMeta,
          });
        };
    }

    if (onNodeMouseOut) {
      a11yProps.onMouseOver =
        (event: React.MouseEvent<any>) => {
          onNodeMouseOut({
            event,
            nodeMeta,
          });
        };
    }

    if (onNodeRightClick) {
      a11yProps.onContextMenu =
        (event: React.MouseEvent<any>) => {
          onNodeRightClick({
            event,
            nodeMeta,
          });
        };
    }
  }

  return (
    <div
      {...a11yProps}
      className={className}
      style={style}
    >
      <span
        role="button"
        onClick={onNodeToggle}
      >
        [{
        isOpened
          ? '-'
          : '+'
      }]
      </span>
      <span>
        {String(nodeData)}
      </span>
    </div>
  );
}
