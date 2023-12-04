import { Platform } from "react-native";

let baseURL = "";

{
  Platform.OS == "android"
    ? (baseURL = "http://192.168.19.176:4000/api/v1/")
    : (baseURL = "http://localhost:4000/api/v1/");
}

export default baseURL;
