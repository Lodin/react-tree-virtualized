import {CSSProperties, MouseEvent, ReactNode, SyntheticEvent} from 'react';
import {SectionRenderedParams} from 'react-virtualized';

export interface CellPosition {
  columnIndex: number;
  rowIndex: number;
}

export interface RenderedSection extends SectionRenderedParams {
  columnOverscanStartIndex: number;
  columnOverscanStopIndex: number;
  rowOverscanStartIndex: number;
  rowOverscanStopIndex: number;
}

export interface Node {
  childrenCount: number;
  data: any;
  deepLevel: number;
  id: string;
  isLeaf: boolean;
  isOpened: boolean;
}

export interface NodeInfo {
  childrenCount: number;
  isOpened: boolean;
}

export type NodeGetter = () => IterableIterator<Node>;

export interface NodeRegistry {
  list: string[];
  map: {
    [id: string]: Node;
  };
}

export interface NodeMouseEventHandlerParams {
  event: SyntheticEvent<MouseEvent<any>>;
  nodeData: any;
}

export interface NodeProps {
  className?: string;
  deepLevel: number;
  index: number;
  isLeaf: boolean;
  isOpened: boolean;
  isScrolling: boolean;
  key: string;
  nodeData: any;
  style: CSSProperties;

  onNodeClick?(params: NodeMouseEventHandlerParams): void;

  onNodeDoubleClick?(params: NodeMouseEventHandlerParams): void;

  onNodeMouseOut?(params: NodeMouseEventHandlerParams): void;

  onNodeMouseOver?(params: NodeMouseEventHandlerParams): void;

  onNodeRightClick?(params: NodeMouseEventHandlerParams): void;

  onNodeToggle(): void;
}

export type NodeRenderer = (props: NodeProps) => ReactNode;
