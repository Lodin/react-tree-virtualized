import * as cn from 'classnames';
import * as mem from 'mem';
import * as React from 'react';
import {Alignment, Grid, GridCellProps} from 'react-virtualized';
import {GridCoreProps} from 'react-virtualized/dist/es/Grid';
import {CellPosition, NodeGetter, NodeRenderer, PreviousNodeInfo, RenderedSection} from './types';

export interface RowsRenderInfo {
  overscanStartIndex: number;
  overscanStopIndex: number;
  startIndex: number;
  stopIndex: number;
}

export interface TreeProps extends GridCoreProps {
  nodeGetter: NodeGetter;
  nodeRenderer: NodeRenderer;

  onRowsRendered?(info: RowsRenderInfo): void;
}

export default class Tree extends React.PureComponent<TreeProps> {
  private grid: Grid | null;
  private ids = new Map<string, boolean>();
  private previousNode?: PreviousNodeInfo;

  private onNodeToggleFactory = mem((id: string) => () => {
    const current = this.ids.get(id) || false;
    this.ids.set(id, !current);
    this.forceUpdate();
  });

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
    this.previousNode = undefined;

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
      nodeGetter,
      nodeRenderer,
      nodeStyle,
      onNodeClick,
      onNodeDoubleClick,
      onNodeMouseOver,
      onNodeMouseOut,
      onNodeRightClick,
    } = this.props;

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

    const {
      id,
      data,
      nestingLevel,
      isLeaf,
    } = nodeGetter({
      index: rowIndex,
      previousNode: this.previousNode,
    });

    const isOpened = this.ids.get(id) || false;

    this.previousNode = {
      id,
      isOpened,
    };

    const onNodeToggle = this.onNodeToggleFactory(id);

    return nodeRenderer({
      className: nodeClassName,
      index: rowIndex,
      isOpened,
      isScrolling,
      key,
      nodeData: data,
      nodeMeta: {
        id,
        isLeaf,
        nestingLevel,
      },
      onNodeClick,
      onNodeDoubleClick,
      onNodeMouseOut,
      onNodeMouseOver,
      onNodeRightClick,
      onNodeToggle,
      style: nodeStyle,
    });
  };

  private setRef: React.Ref<Grid> = (grid) => {
    this.grid = grid;
  };

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
}
