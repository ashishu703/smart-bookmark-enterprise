import { FixedSizeList as List } from "react-window"
export default function VirtualizedList({items,rowHeight=70,Row}){
  return(
    <List height={500} itemCount={items.length} itemSize={rowHeight} width="100%">
      {({index,style})=>(
        <div style={style}>
          <Row item={items[index]} />
        </div>
      )}
    </List>
  )
}
