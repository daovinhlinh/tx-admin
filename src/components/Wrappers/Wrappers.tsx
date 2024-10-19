import {
  Badge as BadgeBase,
  Button as ButtonBase,
  ThemeOptions,
  Typography as TypographyBase,
  withStyles,
} from "@material-ui/core";
import { Variant } from "@material-ui/core/styles/createTypography";
import { makeStyles, useTheme } from "@material-ui/styles";
import classnames from "classnames";
import { ReactNode } from "react";

// styles
const useStyles = makeStyles(() => ({
  badge: {
    fontWeight: 600,
    height: 16,
    minWidth: 16,
  },
}));

type IBadge = {
  colorBrightness?: string;
  color?: string;
  badgeContent?: number;
  children?: ReactNode;
};

function Badge({ children, colorBrightness, color, ...props }: IBadge) {
  const classes = useStyles();
  const theme = useTheme();
  const Styled = createStyled(
    {
      badge: {
        backgroundColor: getColor(color, theme, colorBrightness),
      },
    },
    {}
  );

  return (
    <Styled>
      {(styledProps) => (
        <BadgeBase
          classes={{
            badge: classnames(classes.badge, styledProps.classes.badge),
          }}
          {...props}
        >
          {children}
        </BadgeBase>
      )}
    </Styled>
  );
}

type ITypography = {
  weight?: TFontWeight;
  size?: string;
  colorBrightness?: string;
  color?: string;
  variant?: Variant;
  className?: string;
  onClick?: () => void;
  href?: string;
  gutterBottom?: boolean;
  children?: ReactNode | string;
  component?: unknown;
};

function Typography({
  children,
  weight,
  size,
  colorBrightness,
  color,
  ...props
}: ITypography) {
  const theme = useTheme();

  return (
    <TypographyBase
      style={{
        color: getColor(color, theme, colorBrightness),
        fontWeight: getFontWeight(weight),
        fontSize: getFontSize(size, props["variant"], theme),
      }}
      {...props}
    >
      {children}
    </TypographyBase>
  );
}

function Button({ children, color, className, ...props }) {
  const theme = useTheme();

  const Styled = createStyled({
    root: {
      color: getColor(color, theme),
    },
    contained: {
      backgroundColor: getColor(color, theme),
      // boxShadow: theme.customShadows.widget,
      // color: `${color ? "white" : theme.palette.text.primary} !important`,
      // "&:hover": {
      //   backgroundColor: getColor(color, theme, "light"),
      //   boxShadow: theme.customShadows.widgetWide,
      // },
      // "&:active": {
      //   boxShadow: theme.customShadows.widgetWide,
      // },
    },
    outlined: {
      color: getColor(color, theme),
      borderColor: getColor(color, theme),
    },
    select: {
      // backgroundColor: theme.palette.primary.main,
      color: "#fff",
    },
  });

  return (
    <Styled>
      {({ classes }) => (
        <ButtonBase
          classes={{
            contained: classes.contained,
            root: classes.root,
            outlined: classes.outlined,
          }}
          {...props}
          className={classnames(
            {
              [classes.select]: props["select"],
            },
            className
          )}
        >
          {children}
        </ButtonBase>
      )}
    </Styled>
  );
}

export { Badge, Typography, Button };

// ########################################################################

function getColor(color, theme, brigtness = "main") {
  if (color && theme.palette[color] && theme.palette[color][brigtness]) {
    return theme.palette[color][brigtness];
  } else {
    return color;
  }
}

type TFontWeight = "light" | "medium" | "bold";

function getFontWeight(style: TFontWeight) {
  switch (style) {
    case "light":
      return 300;
    case "medium":
      return 500;
    case "bold":
      return 600;
    default:
      return 400;
  }
}

function getFontSize(size: string, variant = "", theme: ThemeOptions) {
  let multiplier;

  switch (size) {
    case "sm":
      multiplier = 0.8;
      break;
    case "md":
      multiplier = 1.5;
      break;
    case "xl":
      multiplier = 2;
      break;
    case "xxl":
      multiplier = 3;
      break;
    default:
      multiplier = 1;
      break;
  }

  const defaultSize =
    variant && theme?.typography[variant]
      ? theme?.typography[variant].fontSize
      : `16px`;

  return `calc(${defaultSize} * ${multiplier})`;
}

function createStyled(styles, options = {}) {
  const Styled = function (props) {
    const { children, ...other } = props;
    return children(other);
  };

  return withStyles(styles, options)(Styled);
}
