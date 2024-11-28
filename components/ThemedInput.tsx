import { StyleSheet, type ViewProps } from "react-native";
import { Dispatch, SetStateAction } from "react";
import { ThemedView } from "./ThemedView";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-paper";

export type ThemedInputProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  value?: string;
  placeholder?: string;
  countryCode?: string;
  inputLabel?: string;
  inputLabelType?: "Caption" | "Regular" | "Subheading";
  inputLabelColor?: string;
  setValue?: Dispatch<SetStateAction<string>>;
  setCountryCode?: Dispatch<SetStateAction<string>>;
  showPassword?: boolean;
  toggleShowPassword?: () => void;
  submitAction?: () => void;
  icon?: React.ReactNode;
  secureInput?: boolean;
  type: "regular" | "password" | "phonenum" | "email";
};

export function ThemedInput({
  lightColor = "royalblue",
  darkColor,
  value,
  placeholder,
  countryCode,
  inputLabel,
  inputLabelType,
  inputLabelColor,
  setValue,
  setCountryCode,
  showPassword = true,
  toggleShowPassword,
  submitAction,
  secureInput,
  icon,
  type,
  ...otherProps
}: ThemedInputProps) {
  return (
    <ThemedView style={styles.inputLayout}>
      <ThemedView style={styles.inputsContainer}>
        {type == "phonenum" && (
          <ThemedView style={styles.phoneNumberInput}>
            <ThemedView style={styles.codeInput}>
              <TextInput
                secureTextEntry={!showPassword}
                onChangeText={setValue}
                value={countryCode}
                style={styles.codeInputContent}
                placeholder={countryCode}
              />
            </ThemedView>
            <ThemedView style={styles.phoneNumberInputDivider} />
          </ThemedView>
        )}
        <TextInput
          secureTextEntry={!showPassword}
          style={[styles.input]}
          onChangeText={setValue}
          value={value}
          placeholder={placeholder}
          label={inputLabel}
          placeholderTextColor={"#aaa"}
          selectionColor={"black"}
          onSubmitEditing={submitAction}
          mode="outlined"
          outlineColor="gray"
          activeOutlineColor="royalblue"
          outlineStyle={{ borderWidth: 1.5, backgroundColor: "transparent" }}
          dense={true}
          contentStyle={{ fontFamily: "Poppins-Regular" }}
        />
        {type == "password" ? (
          <MaterialCommunityIcons
            name={showPassword ? "eye-off" : "eye"}
            size={18}
            color="#aaa"
            style={styles.passwordIcon}
            onPress={toggleShowPassword}
          />
        ) : (
          icon && <>{icon}</>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  inputLayout: {
    gap: 5,
    backgroundColor: "transparent",
  },
  inputsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  phoneNumberInput: {
    height: "100%",
    width: "15%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  codeInput: {
    width: "90%",
    paddingHorizontal: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  codeInputContent: {
    fontSize: 10,
    fontFamily: "Poppins-Regular",
  },
  input: {
    fontSize: 13,
    lineHeight: 16,
    height: 40,
    fontFamily: "Poppins-Regular",
    backgroundColor: "transparent",
    width: "100%",
  },
  phoneNumberInputDivider: {
    width: 1,
    backgroundColor: "lightgray",
    height: "60%",
  },
  passwordIcon: {
    marginLeft: 10,
  },
});
