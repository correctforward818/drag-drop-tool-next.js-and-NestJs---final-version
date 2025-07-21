export type TextAlign = 'left' | 'center' | 'right';

export interface ButtonProps {
  text: string;
  href: {
    name: string;
    attrs: {
      href: string;
      target: string;
    };
    values: {
      href: string;
    };
  };
  buttonColors: {
    color: string;
    backgroundColor: string;
    hoverColor: string;
    hoverBackgroundColor: string;
  };
  size: {
    autoWidth: boolean;
    width: string;
  };
  fontSize: string;
  textAlign: TextAlign;
  lineHeight: string;
  padding: string;
  borderRadius: string;
}

export interface ImageProps {
  src: {
    url: string;
    width: number;
    height: number;
    autoWidth: boolean;
    maxWidth?: string;
  };
  altText: string;
  textAlign: TextAlign;
  action?: {
    name: string;
    values: {
      href?: string;
      target?: string;
    };
  };
}

export interface TextProps {
  text: string;
  fontFamily: {
    label: string;
    value: string;
    defaultFont?: boolean;
    weights?: null;
  };
  fontSize: string;
  textAlign: TextAlign;
  lineHeight: string;
  linkStyle: {
    inherit: boolean;
    linkColor: string;
    linkHoverColor: string;
    linkUnderline: boolean;
    linkHoverUnderline: boolean;
  };
}

export type ComponentProps = ButtonProps | ImageProps | TextProps; 