import {CSSProperties, MouseEvent, ReactNode, SyntheticEvent} from 'react';
import {Index, SectionRenderedParams} from 'react-virtualized';

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

export interface PreviousNodeInfo {
  id: string;
  isOpened: boolean;
}

export interface NodeInfo extends Index {
  previousNode?: PreviousNodeInfo;
}

export interface NodeData {
  data: any;
  id: string;
  isLeaf: boolean;
  nestingLevel: number;
}

export type NodeGetter = (info: NodeInfo) => NodeData;

export interface NodeMeta {
  id: string;
  isLeaf: boolean;
  nestingLevel: number;
}

export interface NodeMouseEventHandlerParams {
  nodeMeta: NodeMeta;
  event: SyntheticEvent<MouseEvent<any>>;
}

export interface NodeProps {
  className: string;
  index: number;
  isOpened: boolean;
  isScrolling: boolean;
  key: string;
  nodeData: any;
  nodeMeta: NodeMeta;
  style: CSSProperties;

  onNodeClick?(params: NodeMouseEventHandlerParams): void;

  onNodeDoubleClick?(params: NodeMouseEventHandlerParams): void;

  onNodeMouseOut?(params: NodeMouseEventHandlerParams): void;

  onNodeMouseOver?(params: NodeMouseEventHandlerParams): void;

  onNodeRightClick?(params: NodeMouseEventHandlerParams): void;

  onNodeToggle(): void;
}

export type NodeRenderer = (props: NodeProps) => ReactNode;
