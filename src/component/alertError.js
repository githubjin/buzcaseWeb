// @flow
import { message as messageAlert } from "antd";

export default function messageSomeError(error: string): void {
  // console.log("something error : ", error);
  try {
    var errorObj = JSON.parse(error);
    const { code, message } = errorObj;
    // console.log(code, message);
    var text = message;
    switch (code) {
      case 101:
        text = "用户名或密码错误";
        break;
      case 202:
        text = "该用户名已被使用！";
        break;
      case 203:
        text = "该邮箱已被使用！";
        break;
      default:
        text = message;
    }
    messageAlert.error(text, 10);
  } catch (error) {
    // console.log(error);
    messageAlert.error("意料之外的问题，请重试或联系系统管理员", 10);
  }
}
