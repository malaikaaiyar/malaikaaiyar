export function remarkObsidianCallouts() {
  return (tree) => {
    const visit = (node, index, parent) => {
      if (
        node.type === "blockquote" &&
        node.children.length > 0 &&
        node.children[0].type === "paragraph" &&
        node.children[0].children.length > 0 &&
        node.children[0].children[0].type === "text"
      ) {
        const text = node.children[0].children[0].value;
        const match = text.match(/^\[!(.*?)\](.*?)$/);
        
        if (match) {
          const calloutType = match[1].toLowerCase().trim();
          const calloutTitle = match[2].trim() || calloutType.charAt(0).toUpperCase() + calloutType.slice(1);
          
          // Remove the [!TYPE] prefix from the first paragraph
          node.children[0].children[0].value = node.children[0].children[0].value.replace(/^\[!(.*?)\](.*?)$/, '$2');
          
          // Transform the blockquote into a callout div
          node.type = "div";
          node.data = {
            hName: "div",
            hProperties: {
              className: "callout",
              dataCallout: calloutType,
            },
          };
          
          // Add a title div at the beginning
          const titleNode = {
            type: "div",
            data: {
              hName: "div",
              hProperties: {
                className: "callout-title",
              },
            },
            children: [
              {
                type: "text",
                value: calloutTitle,
              },
            ],
          };
          
          node.children.unshift(titleNode);
        }
      }
      
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          visit(node.children[i], i, node);
        }
      }
    };
    
    for (let i = 0; i < tree.children.length; i++) {
      visit(tree.children[i], i, tree);
    }
  };
} 