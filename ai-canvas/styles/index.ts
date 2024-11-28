import {StyleSheet} from "react-native";
export const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        display: "flex",
    },
    contentSectionContent: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
    },
    header: {
        borderBottomWidth: 1,
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderBottomColor: "lightgray"
    },
    scrollView: {
        flex: 1,
        marginBottom: 10,
    },
    messageContainer: {
        padding: 5,
        backgroundColor: "transparent",
        borderRadius: 5,
        marginVertical: 2,
    },
    textInput: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    sidePanelButton: {
        padding: 5,
        backgroundColor: "royalblue",
    },
    canvasDrawOptions: {
        margin: 10,
        gap: 10,
        borderRadius: 10,
        padding: 10,
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'whitesmoke',
    },
    canvasDrawOption: {
        padding: 5,
        borderRadius: 10,
        backgroundColor: 'whitesmoke',
    },
    canvas:{
        flex: 7,
    },
    leftPanel: {
        flex: 1,
        gap: 1,
        borderRightWidth: 1,
        backgroundColor: "whitesmoke",
        borderRightColor: "lightgray"
    },
    rightPanel: {
        flex: 2,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderLeftWidth: 1,
        backgroundColor: "whitesmoke",
        borderLeftColor: "lightgray",
    }
});