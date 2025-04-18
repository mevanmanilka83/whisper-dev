import { TipTapRender, NodeHandler } from "@troop.com/tiptap-react-render";

interface Node {
  type: string;
  content?: Node[];
  [key: string]: any;
}

const doc: NodeHandler = (props) => {
  return <div>{props.children}</div>;
};

const paragraph: NodeHandler = (props) => {
  return <p>{props.children}</p>;
};

const handlers = {
  doc: doc,
  paragraph: paragraph,
};

export default function Render({ data }: { data: Node }) {
  return (
    <div className="text-xs text-muted-foreground line-clamp-2 mb-2">
      <TipTapRender handlers={handlers} node={data} />
    </div>
  );
}
