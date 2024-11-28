import { StyleSheet, TextInputProps, KeyboardAvoidingView } from "react-native";
import { TextInput } from "react-native-paper";
import {ThemedView} from "@/components/ThemedView";
import {MaterialCommunityIcons} from "@expo/vector-icons";
interface TextEditorInputProps extends TextInputProps {
  value: string;
  setValue: (text: string) => void;
  setHeading: (text: string) => void;
  heading?: string;
  placeholder?: string;
}

export function TextEditorInput({
  setValue,
  setHeading,
  value,
  placeholder,
  heading,
  ...otherProps
}: TextEditorInputProps) {
  return (
    <KeyboardAvoidingView style={styles.editorContainer} behavior="padding">
      <ThemedView style={{width: "20%", justifyItems: 'center'}}>
        <ThemedView style={{backgroundColor: 'whitesmoke', width: 30, height: 'auto', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 5}}>
          <MaterialCommunityIcons name="microphone-outline" size={24} color="black" />
        </ThemedView>
      </ThemedView>
      <ThemedView style={{display: 'flex', flexDirection: 'column', width: '80%', height: '100%'}}>
        <TextInput
            theme={{ roundness: 0 }}
            onChangeText={setHeading}
            value={heading}
            placeholder={"September 16"}
            activeUnderlineColor="transparent"
            underlineColor="transparent"
            contentStyle={styles.textEditorInput}
            multiline
            style={[styles.textInputHeading]}
            textAlignVertical="top"
            scrollEnabled={true}
        />
        <TextInput
            theme={{ roundness: 0 }}
            onChangeText={setValue}
            value={value}
            placeholder={"..."}
            activeUnderlineColor="transparent"
            underlineColor="transparent"
            contentStyle={{
              fontFamily: "Poppins-Regular",
              color: "rgba(100, 100, 100, 1)",
            }}
            multiline
            style={[styles.textInput]}
            textAlignVertical="top"
            scrollEnabled={true}
        />
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  editorContainer: {
    flex: 1,
    padding: 5,
    width: "80%",
    display: 'flex',
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  textInput: {
    flex: 15,
    height: "100%",
    width: "100%",
    backgroundColor: "transparent",
    borderColor: "transparent",
    textAlignVertical: "top",
  },
  textInputHeading: {
    flex: 1,
    height: "5%",
    width: "100%",
    borderColor: "transparent",
    textAlignVertical: "top",
    backgroundColor: "transparent",
  },
  mainContainerGradient: {
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  mainContainerBlur: {
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  textEditorInput: {
    fontFamily: "Poppins-Regular",
    color: "rgba(115, 115, 115, 1)",
    fontWeight: "black",
    fontSize: 24,
  },
  microphone: {

  }
});

export default TextEditorInput;
