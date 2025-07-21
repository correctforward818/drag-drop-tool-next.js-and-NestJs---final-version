import {
  Square2StackIcon,
  DocumentTextIcon,
  PhotoIcon,
  CursorArrowRaysIcon,
  MinusIcon,
  UserGroupIcon,
  Bars3Icon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";

export const componentRegistry = {
  column: {
    icon: Square2StackIcon,
    label: "Column",
    content: {
      type: "column",
      values: {
        columns: [],
      },
    },
  },
  text: {
    icon: DocumentTextIcon,
    label: "Text",
    content: {
      type: "text",
      values: {
        text: "This is a new Text block. Change the text",
        color: "#FFFFFF",
        containerPadding: "10px",
        fontFamily: undefined,
        fontSize: "16px",
        fontWeight: 400,
        textAlign: "left",
        lineHeight: "140%",
        letterSpacing: "0px",
        _meta: {
          htmlID: "",
          htmlClassNames: "",
        },
        selectable: true,
        draggable: true,
        duplicatable: true,
        deletable: true,
        hideable: true,
      },
    },
  },
  button: {
    icon: CursorArrowRaysIcon,
    label: "Button",
    content: {
      type: "button",
      values: {
        text: "Button Text",
        containerPadding: "10px",
        _meta: {
          htmlID: "",
          htmlClassNames: "",
        },
        selectable: true,
        draggable: true,
        duplicatable: true,
        deletable: true,
        hideable: true,
        buttonColors: {
          backgroundColor: "#3AAEE0",
          color: "#FFFFFF",
          hoverColor: "",
          hoverBackgroundColor: "",
        },
        fontSize: "14px",
        lineHeight: "140%",
        letterSpacing: "0px",
        fontWeight: 400,
        padding: "10px",
        borderRadius: "4px",
        size: {
          autoWidth: true,
          width: "auto",
        },
      },
    },
  },
  image: {
    icon: PhotoIcon,
    label: "Image",
    content: {
      type: "image",
      values: {
        src: {
          url: "",
          maxWidth: "100%",
        },
        containerPadding: "10px",
        _meta: {
          htmlID: "",
          htmlClassNames: "",
        },
        selectable: true,
        draggable: true,
        duplicatable: true,
        deletable: true,
        hideable: true,
      },
    },
  },
  divider: {
    icon: MinusIcon,
    label: "Divider",
    content: {
      type: "divider",
      values: {
        border: {
          borderTopColor: "#FFFFFF",
        },
        containerPadding: "10px",
        _meta: {
          htmlID: "",
          htmlClassNames: "",
        },
        selectable: true,
        draggable: true,
        duplicatable: true,
        deletable: true,
        hideable: true,
        width: "100%",
      },
    },
  },
  social: {
    icon: UserGroupIcon,
    label: "Social",
    content: {
      type: "social",
      values: {
        icons: {
          iconType: "social",
          icons: [],
          spacing: 10,
        },
        iconSize: 24,
        containerPadding: "10px",
        _meta: {
          htmlID: "",
          htmlClassNames: "",
        },
        selectable: true,
        draggable: true,
        duplicatable: true,
        deletable: true,
        hideable: true,
      },
    },
  },
  menu: {
    icon: Bars3Icon,
    label: "Menu",
    content: {
      type: "menu",
      values: {
        menu: {
          items: [],
        },
        containerPadding: "10px",
        _meta: {
          htmlID: "",
          htmlClassNames: "",
        },
        selectable: true,
        draggable: true,
        duplicatable: true,
        deletable: true,
        hideable: true,
        padding: "5px 10px",
        layout: "horizontal",
        align: "center",
        separator: "|",
        fontSize: "14px",
        fontWeight: 400,
        letterSpacing: "0px",
        lineHeight: "140%",
        textColor: "#ffffff",
        linkColor: "#ffffff",
      },
    },
  },
  embedhtml: {
    icon: CodeBracketIcon,
    label: "Embed HTML",
    content: {
      type: "embedhtml",
      values: {
        html: "",
      },
    },
  },
  // ... other components
};

export const useComponentRegistry = () => {
  return componentRegistry;
};
