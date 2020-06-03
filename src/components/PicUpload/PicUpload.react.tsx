import React, { createRef } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { getDropdownRef } from "@components/Dropdown/Dropdown.react";
import DropdownAlert from "react-native-dropdownalert";
import Styles from "./PicUpload.style";

export interface Props {}

export interface State {
  image: any;
}

class PicUpload extends React.Component<Props, State> {
  dropdownRef = createRef<DropdownAlert>();

  constructor(props: Props) {
    super(props);
    this.state = {
      image: null,
    };
    this.dropdownRef = getDropdownRef();
  }

  getCameraRollPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== "granted") {
      Alert.alert(
        "We need permission to access your camera roll to upload a profile picture."
      );
    }
  };

  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({ image: result.uri });
      }
    } catch (E) {
      if (this.dropdownRef.current)
        this.dropdownRef.current.alertWithType(
          "error",
          "Photo Error",
          "Unable to access the photo library."
        );
    }
  };

  render() {
    const { image } = this.state;

    return (
      <TouchableOpacity
        style={Styles.shapeBackground}
        onPress={this._pickImage}
        testID="clickable"
      >
        {image && (
          <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
        )}
      </TouchableOpacity>
    );
  }
}

export default PicUpload;
