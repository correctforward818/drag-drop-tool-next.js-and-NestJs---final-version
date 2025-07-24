export type ElementType =
  | "column"
  | "row"
  | "text"
  | "button"
  | "image"
  | "html"
  | "menu"
  | "divider"
  | "heading"
  | "social";

export interface Template {
  counters: {
    u_column: number;
    u_row: number;
    u_content_text: number;
    u_content_button: number;
    u_content_image: number;
    u_content_html?: number;
    u_content_menu: number;
    u_content_divider: number;
    u_content_heading: number;
  };
  body: {
    id: string;
    rows: Row[];
    headers: [];
    footers: [];
    values: BodyValues;
  };
  schemaVersion: number;
}

export interface Row {
  id: string;
  cells: number[];
  columns: Column[];
  values: RowValues;
}

export interface Column {
  id: string;
  contents: Content[];
  values: ColumnValues;
}

export interface Content {
  id: string;
  type: ElementType;
  values: ContentValues;
  hasDeprecatedFontControls?: boolean;
}

interface BackgroundImage {
  url: string;
  fullWidth: boolean;
  width?: number;
  height?: number;
  repeat: string;
  size: string;
  position: string;
}

interface LinkStyle {
  body?: boolean;
  inherit: boolean;
  linkColor: string;
  linkUnderline: boolean;
  linkHoverColor: string;
  linkHoverUnderline: boolean;
}

interface PopupCloseButtonAction {
  name: string;
  attrs: {
    onClick: string;
  };
}

export interface BodyValues {
  _styleGuide: null;
  popupPosition: string;
  popupWidth: string;
  popupHeight: string;
  borderRadius: string;
  contentAlign: string;
  contentVerticalAlign: string;
  contentWidth: number;
  fontFamily: FontFamily;
  textColor: string;
  popupBackgroundColor: string;
  popupBackgroundImage: BackgroundImage;
  popupOverlay_backgroundColor: string;
  popupCloseButton_position: string;
  popupCloseButton_backgroundColor: string;
  popupCloseButton_iconColor: string;
  popupCloseButton_borderRadius: string;
  popupCloseButton_margin: string;
  popupCloseButton_action: PopupCloseButtonAction;
  backgroundColor: string;
  backgroundImage: BackgroundImage;
  preheaderText: string;
  linkStyle: LinkStyle;
  _meta: {
    htmlID: string;
    htmlClassNames: string;
  };
  language: {};
}

export interface RowValues {
  displayCondition: null;
  columns: boolean;
  backgroundColor: string;
  columnsBackgroundColor: string;
  backgroundImage: BackgroundImage;
  padding: string;
  anchor: string;
  _meta: {
    htmlID: string;
    htmlClassNames: string;
  };
  selectable: boolean;
  draggable: boolean;
  duplicatable: boolean;
  deletable: boolean;
  hideable: boolean;
  _override?: {
    mobile: {
      padding?: string;
    };
  };
  _styleGuide?: null;
  hideDesktop?: boolean;
}

export interface ColumnValues {
  backgroundColor: string;
  padding: string;
  border: {
    borderTopWidth?: string;
    borderTopStyle?: string;
    borderTopColor?: string;
    borderLeftWidth?: string;
    borderLeftStyle?: string;
    borderLeftColor?: string;
    borderRightWidth?: string;
    borderRightStyle?: string;
    borderRightColor?: string;
    borderBottomWidth?: string;
    borderBottomStyle?: string;
    borderBottomColor?: string;
  };
  borderRadius?: string;
  backgroundImageUrl?: string;
  _meta: {
    htmlID: string;
    htmlClassNames: string;
  };
  _override?: {
    mobile: {
      padding?: string;
      border?: {
        borderTopWidth?: string;
        borderTopStyle?: string;
        borderTopColor?: string;
        borderLeftWidth?: string;
        borderLeftStyle?: string;
        borderLeftColor?: string;
        borderRightWidth?: string;
        borderRightStyle?: string;
        borderRightColor?: string;
        borderBottomWidth?: string;
        borderBottomStyle?: string;
        borderBottomColor?: string;
      };
    };
  };
}

export interface FontFamily {
  label: string;
  value: string;
  url?: string;
  defaultFont?: boolean;
  weights?: null;
}

interface LinkStyle {
  inherit: boolean;
  linkColor: string;
  linkHoverColor: string;
  linkUnderline: boolean;
  linkHoverUnderline: boolean;
}

interface Action {
  name: string;
  values: {
    href?: string;
    target?: string;
    mailto?: string;
    subject?: string;
    body?: string;
    phone?: string;
  };
}

interface ImageSource {
  url?: string;
  width?: number;
  height?: number;
  autoWidth?: boolean;
  maxWidth?: string;
}

export interface ContentValues {
  // Common properties
  containerPadding: string;
  anchor?: string;
  _meta: {
    htmlID: string;
    htmlClassNames: string;
  };
  selectable: boolean;
  draggable: boolean;
  duplicatable: boolean;
  deletable: boolean;
  hideable: boolean;
  color?: string;

  // Text specific
  text?: string;
  fontFamily?: FontFamily;
  fontWeight?: number;
  fontSize?: string;
  textAlign?: string;
  lineHeight?: string;
  linkStyle?: LinkStyle;
  letterSpacing?: string;

  // Button specific
  buttonColors?: {
    color: string;
    backgroundColor: string;
    hoverColor?: string;
    hoverBackgroundColor?: string;
  };
  size?: {
    autoWidth: boolean;
    width: string;
  };
  padding?: string;
  border?: {
    [key: string]: string;
  };
  borderRadius?: string;
  calculatedWidth?: number;
  calculatedHeight?: number;

  // Image specific
  src?: ImageSource;
  altText?: string;
  action?: Action;

  // HTML specific
  html?: string;

  // Override for mobile
  _override?: {
    mobile: {
      fontSize?: string;
      textAlign?: string;
      size?: {
        autoWidth: boolean;
        width: string;
      };
      lineHeight?: string;
      padding?: string;
      src?: ImageSource;
      layout?: string;
    };
  };

  hideDesktop?: boolean;
  displayCondition?: null;
  _styleGuide?: null;

  // Heading specific
  headingType?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  // Menu specific
  menu?: {
    items: MenuItem[];
  };
  textColor?: string;
  linkColor?: string;
  align?: string;
  layout?: string;
  separator?: string;

  width?: string;

  // Social specific
  icons?: {
    iconType: string;
    icons: { name: string; url: string }[];
    spacing: number;
  };
  iconSize?: number;

  // Embed HTML specific
  embedHTML?: string;

  // Button specific
  href?: Action;

}

interface Link {
  name: string;

  attrs?: {
    href: string;
    target: string;
  };

  values: {
    href?: string;
    target?: string;
    mailto?: string;
    subject?: string;
    body?: string;
    phone?: string;
  };
}

export interface MenuItem {
  key: string;
  link: Link;
  text: string;
}

export interface TextValues {
  color: string | undefined;
  containerPadding: string;
  fontFamily: FontFamily | undefined;
  fontSize: string;
  fontWeight: number | undefined;
  textAlign: string;
  lineHeight: string;
  letterSpacing: string;
  text: string;
}

export interface ButtonValues {
  href: Action;
  buttonColors: {
    backgroundColor: string;
    color: string;
  };
  size: {
    autoWidth: boolean;
    width: string;
  };
  fontFamily: FontFamily;
  fontWeight: number;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
  textAlign: string;
  padding: string;
  border: {
    borderWidth?: string;
    borderStyle?: string;
    borderColor?: string;
  };
  borderRadius: string;
  containerPadding: string;
}

export interface ImageValues {
  src: string;
  altText: string;
  containerPadding: string;
}

export interface MenuInputs {
  menu: {
    items: MenuItem[];
  };
  fontFamily: FontFamily;
  fontWeight: number;
  fontSize: string;
  letterSpacing: string;
  align: "left" | "center" | "right";
  textColor: string;
  linkColor: string;
  layout: string;
  separator?: string;
  padding: string;
  containerPadding: string;
}

export interface DividerValues {
  width: string;
  border: {
    borderTopWidth: string;
    borderTopStyle: string;
    borderTopColor: string;
  };
  textAlign: string;
  containerPadding: string;
}

