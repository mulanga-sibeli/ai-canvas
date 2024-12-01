import { Pressable, ViewProps } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { styles } from "@/styles/DrawOption";

export type DrawOptionProps = ViewProps & {
    tooltip?: string;
    icon: React.ReactNode;
    actionFunction: () => void;
};

export function DrawOption({
                           tooltip,
                           icon,
                           actionFunction,
                       }: DrawOptionProps) {

    return (
        <Pressable
            onPress={actionFunction}
            style={styles.canvasDrawOption}
        >
            <>{icon}</>
            {   tooltip &&
                <ThemedText
                    type="Caption"
                    weight="Regular"
                    lightColor="gray"
                >
                    {tooltip}
                </ThemedText>
            }

        </Pressable>
    );
}