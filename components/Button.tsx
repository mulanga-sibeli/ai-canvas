import { Pressable, StyleSheet, ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import React from "react";

export type ButtonProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  lightTextColor?: string;
  darkTextColor?: string;
  title: string;
  type?: "regular" | "outline" | "text";
  icon?: React.ReactNode;
  onPress: () => void;
};

export function Button({
  style,
  lightColor,
  darkColor,
  lightTextColor,
  darkTextColor,
  title,
  type = "regular",
  icon,
  onPress,
  ...rest
}: ButtonProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  const borderColor = useThemeColor(
    { light: lightTextColor, dark: darkTextColor },
    "text"
  );

  return (
    <Pressable
      style={[
        styles.button,
        { backgroundColor },
        type === "regular" ? { backgroundColor: backgroundColor } : undefined,
        type === "outline"
          ? {
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: borderColor,
            }
          : undefined,
        type === "text" ? [] : undefined,
        style,
      ]}
      {...rest}
      onPressOut={onPress}
    >
      <ThemedText
        type="Caption"
        weight="Regular"
        lightColor={lightTextColor}
        darkColor={darkTextColor}
      >
        {title}
      </ThemedText>
      {icon && <>{icon}</>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    borderRadius: 10,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 2,
    justifyContent: "center",
    width: "auto",
    height: "auto",
  },
});
