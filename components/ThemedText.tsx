import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  weight?: "Regular" | "SemiBold" | "Bold" | "ExtraBold";
  type?: "Heading" | "Subheading" | "Regular" | "Caption";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  weight,
  type = "Caption",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const fontFamily = { fontFamily: "Poppins-" + weight };

  return (
    <Text
      style={[
        { color },
        type === "Caption" ? [styles.caption, fontFamily] : undefined,
        type === "Regular" ? [styles.regular, fontFamily] : undefined,
        type === "Subheading" ? [styles.semiBold, fontFamily] : undefined,
        type === "Heading" ? [styles.heading, fontFamily] : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  caption: {
    fontSize: 13,
    lineHeight: 20,
  },
  regular: {
    fontSize: 24,
    lineHeight: 28,
  },
  semiBold: {
    fontSize: 30,
    lineHeight: 36,
  },
  heading: {
    fontSize: 40,
    lineHeight: 46,
  },
});
