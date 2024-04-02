import Image from "next/image";

export const MarkdownComponents: object = {
  li(props: any) {
    const { children, className, node, ...rest } = props;
    return (
      <li {...rest} className={`${className} list-disc list-inside`}>
        {children}
      </li>
    );
  },

  pre(props: any) {
    const { children, className, node, ...rest } = props;
    return (
      <pre
        {...rest}
        className={`${className} my-5 bg-hslvar py-3 px-2 rounded-md overflow-scroll`}
      >
        {children}
      </pre>
    );
  },
  code(props: any) {
    const { children, className, node, ...rest } = props;
    return (
      <code {...rest} className={`${className} my-2 bg-hslvar rounded-md p-1`}>
        {children}
      </code>
    );
  },
  a: (anchor: { children?: boolean; node?: any }) => {
    return (
      <a
        href={anchor.node.properties.href}
        className="link hover:italic text-accent no-underline"
      >
        {anchor.children}
      </a>
    );
  },
  p: (paragraph: { children?: boolean; node?: any }) => {
    const { node } = paragraph;

    if (node.children[0].tagName === "img") {
      const image = node.children[0];
      const metastring = image.properties.alt;
      const alt = metastring?.replace(/ *\{[^)]*\} */g, "");
      const metaWidth = metastring.match(/{([^}]+)x/);
      const metaHeight = metastring.match(/x([^}]+)}/);
      const width = metaWidth ? metaWidth[1] : "768";
      const height = metaHeight ? metaHeight[1] : "432";
      const isPriority = metastring?.toLowerCase().match("{priority}");
      const hasCaption = metastring?.toLowerCase().includes("{caption:");
      const caption = metastring?.match(/{caption: (.*?)}/)?.pop();

      return (
        <div className="postImgWrapper">
          <Image
            src={image.properties.src}
            width={width}
            height={height}
            className="postImg rounded-md"
            alt={alt}
            priority={isPriority}
          />
          {hasCaption ? (
            <div className="caption" aria-label={caption}>
              {caption}
            </div>
          ) : null}
        </div>
      );
    }
    return <p className="my-2">{paragraph.children}</p>;
  },
};
