import * as cn from 'classnames';
import * as memImpl from 'mem';
import * as React from 'react';
import {Alignment, Grid, GridCellProps} from 'react-virtualized';
import {GridCoreProps} from 'react-virtualized/dist/es/Grid';
import defaultNodeRenderer from './defaultNodeRenderer';
import {
  CellPosition,
  Node, NodeGetter, NodeMouseEventHandlerParams, NodeRegistry, NodeRenderer,
  RenderedSection,
} from './types';

export interface RowsRenderInfo {
  overscanStartIndex: number;
  overscanStopIndex: number;
  startIndex: number;
  stopIndex: number;
}

export interface TreeProps extends GridCoreProps {
  nodeClassName?: string;
  nodeGetter: NodeGetter;
  nodeRenderer?: NodeRenderer;

  onNodeClick?(params: NodeMouseEventHandlerParams): void ,
  onNodeDoubleClick?(params: NodeMouseEventHandlerParams): void,
  onNodeMouseOver?(params: NodeMouseEventHandlerParams): void,
  onNodeMouseOut?(params: NodeMouseEventHandlerParams): void,
  onNodeRightClick?(params: NodeMouseEventHandlerParams): void,
  onRowsRendered?(info: RowsRenderInfo): void;
}

function mem(_t: any, _k: string, descriptor: TypedPropertyDescriptor<any>): void {
  descriptor.value = memImpl(descriptor.value);
}

export default class Tree extends React.PureComponent<TreeProps> {
  public static defaultProps = {
    nodeRenderer: defaultNodeRenderer,
  };

  private grid: Grid | null;
  private registry: NodeRegistry = {
    list: [],
    map: {},
  };

  public forceUpdateGrid(): void {
    if (this.grid) {
      this.grid.forceUpdate();
    }
  }

  // See Grid#getOffsetForCell
  public getOffsetForRow({alignment, index}: { alignment: Alignment, index: number }): number {
    if (this.grid) {
      const {scrollTop} = this.grid.getOffsetForCell({
        alignment,
        columnIndex: 0,
        rowIndex: index,
      });

      return scrollTop;
    }

    return 0;
  }

  // CellMeasurer compatibility
  public invalidateCellSizeAfterRender({columnIndex, rowIndex}: CellPosition): void {
    if (this.grid) {
      this.grid.invalidateCellSizeAfterRender({
        columnIndex,
        rowIndex,
      });
    }
  }

  // See Grid#measureAllCells
  public measureAllRows(): void {
    if (this.grid) {
      this.grid.measureAllCells();
    }
  }

  // CellMeasurer compatibility
  public recomputeGridSize({columnIndex = 0, rowIndex = 0}: Partial<CellPosition> = {}): void {
    if (this.grid) {
      this.grid.recomputeGridSize({
        columnIndex,
        rowIndex,
      });
    }
  }

  // See Grid#recomputeGridSize
  public recomputeRowHeights(index: number = 0): void {
    if (this.grid) {
      this.grid.recomputeGridSize({
        columnIndex: 0,
        rowIndex: index,
      });
    }
  }

  // See Grid#scrollToPosition
  public scrollToPosition(scrollTop: number = 0): void {
    if (this.grid) {
      this.grid.scrollToPosition({scrollTop} as any);
    }
  }

  // See Grid#scrollToCell
  public scrollToRow(index: number = 0): void {
    if (this.grid) {
      this.grid.scrollToCell({
        columnIndex: 0,
        rowIndex: index,
      });
    }
  }

  public render(): JSX.Element {
    const {
      className,
      noRowsRenderer,
      scrollToIndex,
      width,
    } = this.props;

    const classNames = cn('ReactVirtualized__Tree', className);

    const rowCount = this.prepareRegistry();

    return (
      <Grid
        {...this.props}
        autoContainerWidth
        cellRenderer={this.cellRenderer}
        className={classNames}
        columnWidth={width}
        columnCount={1}
        noContentRenderer={noRowsRenderer}
        onSectionRendered={this.onSectionRendered}
        ref={this.setRef}
        rowCount={rowCount}
        scrollToRow={scrollToIndex}
      />
    );
  }

  private cellRenderer = ({
    rowIndex,
    style,
    isScrolling,
    key,
  }: GridCellProps) => {
    const {
      nodeClassName,
      nodeRenderer,
      onNodeClick,
      onNodeDoubleClick,
      onNodeMouseOver,
      onNodeMouseOut,
      onNodeRightClick,
    } = this.props;

    const {list, map} = this.registry;

    // TRICKY The style object is sometimes cached by Grid.
    // This prevents new style objects from bypassing shallowCompare().
    // However as of React 16, style props are auto-frozen (at least in dev mode)
    // Check to make sure we can still modify the style before proceeding.
    // https://github.com/facebook/react/commit/977357765b44af8ff0cfea327866861073095c12#commitcomment-20648713
    const {writable} = Object.getOwnPropertyDescriptor(style, 'width');

    if (writable) {
      // By default, Tree cells should be 100% width.
      // This prevents them from flowing under a scrollbar (if present).
      style.width = '100%';
    }

    const id = list[rowIndex];
    const {data, deepLevel, isLeaf, isOpened} = map[id];

    const onNodeToggle = this.onNodeToggleFactory(id);

    return nodeRenderer!({
      className: nodeClassName,
      deepLevel,
      index: rowIndex,
      isLeaf,
      isOpened,
      isScrolling,
      key,
      nodeData: data,
      onNodeClick,
      onNodeDoubleClick,
      onNodeMouseOut,
      onNodeMouseOver,
      onNodeRightClick,
      onNodeToggle,
      style,
    });
  };

  private setRef: React.Ref<Grid> = (grid) => {
    this.grid = grid;
  };

  @mem
  private onNodeToggleFactory(id: string): () => void {
    return () => {
      const {map} = this.registry;

      const nodeInfo = map[id];
      nodeInfo.isOpened = !nodeInfo.isOpened;

      this.forceUpdate();
    }
  }

  private onSectionRendered = ({
    rowOverscanStartIndex,
    rowOverscanStopIndex,
    rowStartIndex,
    rowStopIndex,
  }: RenderedSection) => {
    const {onRowsRendered} = this.props;

    if (onRowsRendered) {
      onRowsRendered({
        overscanStartIndex: rowOverscanStartIndex,
        overscanStopIndex: rowOverscanStopIndex,
        startIndex: rowStartIndex,
        stopIndex: rowStopIndex,
      });
    }
  };

  private prepareRegistry(): number {
    const {nodeGetter} = this.props;
    const {map} = this.registry;

    const g = nodeGetter();
    const list = [];

    let isPreviousOpened = false;

    // tslint:disable-next-line:no-constant-condition
    while (true) {
      const {value, done}: {value: Node, done: boolean} = g.next(isPreviousOpened);

      if (done) {
        break;
      }

      if (!map[value.id]) {
        map[value.id] = value;
      }

      list.push(value.id);
      isPreviousOpened = map[value.id].isOpened;
    }

    this.registry.list = list;

    return list.length;
  }
}
