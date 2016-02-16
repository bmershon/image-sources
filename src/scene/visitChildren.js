// recursively traverse all children in scenograph
// passes current child and its parent to callback
export default function visitChildren(parent, callback) {
  if (parent === null || !parent.children) return;

  for (let i = 0; i < parent.children.length; i++) {
    let child = parent.children[i];
    callback(parent, child);
    visitChildren(child, callback);
  }
}