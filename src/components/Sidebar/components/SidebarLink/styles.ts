import { SimplePaletteColorOptions } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { ExtendPalette, ExtendThemeOptions } from "../../../../themes/default";

export default makeStyles((theme: ExtendThemeOptions) => ({
  link: {
    textDecoration: "none",
    "&:hover, &:focus": {
      backgroundColor: (theme.palette.background as ExtendPalette).light,
    },
  },
  externalLink: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textDecoration: "none",
  },
  linkActive: {
    backgroundColor: (theme.palette.background as ExtendPalette).light,
  },
  linkNested: {
    paddingLeft: 0,
    "&:hover, &:focus": {
      backgroundColor: "#FFFFFF",
    },
  },
  linkIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary + "99",
    transition: theme.transitions.create("color"),
    width: 24,
    display: "flex",
    justifyContent: "center",
  },
  linkIconActive: {
    color: (theme.palette.primary as SimplePaletteColorOptions).main,
  },
  linkText: {
    padding: 0,
    color: theme.palette.text.secondary + "CC",
    transition: theme.transitions.create(["opacity", "color"]),
    fontSize: 16,
  },
  linkTextActive: {
    color: theme.palette.text.primary,
  },
  linkTextHidden: {
    opacity: 0,
  },
  nestedList: {
    paddingLeft: (theme.spacing(2) as number) + 30,
  },
  sectionTitle: {
    marginLeft: theme.spacing(4.5),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
    height: 1,
    backgroundColor: "#D8D8D880",
  },
}));
