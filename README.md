# react-tree-virtualized

Component to display large tree structures with non-limited nesting. 

## How it works
The main idea is simple. Component receives a ES6 generator function (`nodeGetter`) that flattens user's tree structure
into an array, and then component uses inner
[Grid](https://github.com/bvaughn/react-virtualized/blob/master/docs/Grid.md) to walk around this array and render
visible elements with `nodeRenderer` callback.

Component controls tree node opening and closing. Every time user presses toggle button, `nodeGetter` callback
runs again with different `isNodeOpened` values that generator receives on every node. Then, if node is opened, 
its children are rendered to the inner array and then displayed.

## Props
* `nodeClassName?: string`  
HTML class for single node.

* `nodeGetter: IterabeIterator<Node>`  
A ES6-generator function that is used to flatten user-defined tree structure to inner array. It should `yield`
information about node, wait for the `isOpened` value and render node's children if the value is `true`. 

`Node` object contains following properties:
```typescript
interface Node {
  childrenCount: number; // number of children this node contains
  data: any; // any node's data that will be redirect to the `nodeRenderer` function to be rendered
  deepLevel: number; // node nesting level
  id: string; // unique id of node
  isLeaf: boolean; // can node have children?
  isOpened: boolean; // is current node opened by default?
}
```

* `nodeRenderer: (props: NodeProps) => ReactNode`  
Function that receives props and renders it into the React elemnent. `NodeProps` has following signature:
```typescript
interface NodeMouseEventHandlerParams {
  event: React.SyntheticEvent<React.MouseEvent<any>>;
  nodeData: any;
}

interface NodeProps {
  className: string; // className defined for the Tree component
  deepLevel: number; // current node nesting level
  index: number; // number index of current node
  isLeaf: boolean; // can node have children?
  isOpened: boolean; // is current node opened?
  isScrolling: boolean; // is current node scrolling?
  key: string; // react key for node element
  nodeData: any; // node data redirected from node info
  style: React.CSSProperties; // styles for current node defined in Grid component

  onNodeClick?(params: NodeMouseEventHandlerParams): void; // callback for single click. Defined for Tree component

  onNodeDoubleClick?(params: NodeMouseEventHandlerParams): void; // callback for double click. Defined for Tree component

  onNodeMouseOut?(params: NodeMouseEventHandlerParams): void; // callback for "mouse out" event. Defined for Tree component

  onNodeMouseOver?(params: NodeMouseEventHandlerParams): void; // callback for "mouse over" event. Defined for Tree component

  onNodeRightClick?(params: NodeMouseEventHandlerParams): void; // callback for right click. Defined for Tree component

  onNodeToggle(): void; // callback that should be attached to button controls node opening and closing
}
```

* `onNodeClick?(params: NodeMouseEventHandlerParams): void`  
* `onNodeDoubleClick?(params: NodeMouseEventHandlerParams): void`  
* `onNodeMouseOver?(params: NodeMouseEventHandlerParams): void`  
* `onNodeMouseOut?(params: NodeMouseEventHandlerParams): void`  
* `onNodeRightClick?(params: NodeMouseEventHandlerParams): void`  
Callbacks for different events that should be attached to every node during the render phase.

* `onRowsRendered?(info: RowsRenderInfo): void`  
Callback invoked with information about the slice of rows that were just rendered: 
`({ overscanStartIndex: number, overscanStopIndex: number, startIndex: number, stopIndex: number }): void`

## Example
You can find example in [stories](./stories/index.tsx). If you want to get interactive example, use following
instruction:
```bash
$ git clone https://github.com/Lodin/react-tree-virtualized.git
$ cd react-tree-virtualized
$ npm install
$ npm start
```
Then on the [https://localhost:6006](https://localhost:6006) you will get the [Storybook](https://storybook.js.org/)
instance with interactive example. 