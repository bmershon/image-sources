// recursively traverse all children in scenograph,
// passing current child and its parent to callback
export default function visitChildren(node, callback) {
  if (node === null || !node.children) return;

  for (let i = 0; i < node.children.length; i++) {
    let child = node.children[i];
    callback(node, child);
    visitChildren(child, callback);
  }
  
  return;
}