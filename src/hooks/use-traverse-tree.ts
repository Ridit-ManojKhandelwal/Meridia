const useTraverseTree = () => {
  const insertNode = function insertNode(
    tree: any,
    folderId: any,
    item: any,
    isFolder: any,
  ) {
    if (tree.id === folderId && tree.isFolder) {
      const newNode: any = {
        id: new Date().getTime(),
        name: item,
        isFolder: isFolder,
        items: [],
      };

      return {
        ...tree,
        items: [newNode, ...tree.items],
      };
    }

    const latestNode = tree.items.map((ob: any) =>
      insertNode(ob, folderId, item, isFolder),
    );

    return { ...tree, items: latestNode };
  };

  const removeNode = function removeNode(tree: any, nodeId: any) {
    if (!tree.items) return tree;

    const filteredItems = tree.items
      .map((item: any) => removeNode(item, nodeId))
      .filter((item: any) => item.id !== nodeId);

    return { ...tree, items: filteredItems };
  };

  return { insertNode, removeNode };
};

export default useTraverseTree;
