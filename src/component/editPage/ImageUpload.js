// @flow

import React from "react";
import Relay from "react-relay";
import { Upload, Icon, Modal, message } from "antd";
import styled from "styled-components";
import Immutable from "immutable";
import _ from "lodash";

import QueryRoute from "../../queryConfig";
import RelayLoading from "../RelayLoading";
// import ArticleMutation from "./mutations";

const uploadButton = (
  <div>
    <Icon type="upload" style={{ fontSize: 35 }} />
    <div className="ant-upload-text" style={{ fontSize: 14 }}>上传命盘</div>
  </div>
);
const Div = styled.div`
  display: flex;
  justify-content: center;
`;

class PicturesWall extends React.PureComponent {
  handleCancel: () => void;
  handlePreview: any => void;
  handleChange: Object => void;
  state: {
    previewVisible: boolean,
    fileList: Immutable.List,
    previewImage: ?string,
    id: string,
    savedImageUids: Immutable.List
  };
  props: {
    attachments: string[],
    thumbs: string[],
    larges: string[],
    viewer: Object,
    id: string,
    relay: Object,
    imageCommit: (
      input: Object,
      doSubmit: boolean,
      callback: (error: any, response: Object) => void
    ) => void,
    random: number
  };
  constructor(props: any) {
    super(props);
    this.state = {
      previewVisible: false,
      fileList: Immutable.List([]),
      previewImage: null,
      id: "new",
      savedImageUids: Immutable.List([])
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.random !== nextProps.random) {
      //clear
      this.setState({
        previewVisible: false,
        previewImage: null,
        fileList: this.state.fileList.clear(),
        id: nextProps.id
      });
    }
  }
  getSliderImage(url: string): string {
    return _.startsWith(url, "https") ? url : url.replace("http", "https");
  }
  componentDidMount() {
    const { thumbs, larges, attachments, id } = this.props;
    // console.log("componentDidMount", thumbs, thumbs && thumbs.length > 0, id);
    if (thumbs && thumbs.length > 0) {
      let objs = thumbs.map((thumb, index) => ({
        uid: index,
        name: attachments[index],
        status: "done",
        url: this.getSliderImage(larges[index]),
        thumbUrl: this.getSliderImage(thumb)
      }));
      // console.log(objs);
      if (objs && objs.length > 0) {
        this.setState({
          id,
          fileList: Immutable.List(objs)
        });
      } else {
        this.setState({
          id
        });
      }
    } else if (id !== "new") {
      this.setState({
        id
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.previewVisible !== this.state.previewVisible ||
      nextState.previewImage !== this.state.previewImage ||
      nextState.fileList !== this.state.fileList ||
      this.props.viewer !== nextProps.viewer
    );
  }
  handleCancel = () => {
    this.setState({ previewVisible: false, previewImage: null });
  };
  handlePreview = (file: any) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };
  _onRemove = file => {
    let images = this.state.fileList;
    let index = images.findIndex(function(item) {
      return item.uid === file.uid;
    });
    let _images = images.delete(index);
    this.setState({ fileList: _images });
    this.deleteKey(file);
    return true;
  };
  saveKey = (file: Object): void => {
    let index = this.state.savedImageUids.findIndex(function(item) {
      return item === file.uid;
    });
    // console.log("----------file.uid----------", file.uid, index, this.state.id);
    if (index !== -1) {
      return;
    } else {
      this.setState({
        savedImageUids: this.state.savedImageUids.push(file.uid)
      });
    }
    this.commit(
      {
        id: this.state.id,
        keys: ["addImage"],
        values: [this.getKey(file, this.props.viewer.ossPostObjectPolicy)]
      },
      false
    );
  };
  deleteKey = (file: Object): void => {
    this.commit(
      {
        id: this.state.id,
        keys: ["deleteImage"],
        values: [this.getKey(file, this.props.viewer.ossPostObjectPolicy)]
      },
      false
    );
  };
  handleChange = ({ file, fileList, event }: Object) => {
    if (fileList.length < this.state.fileList.size) {
      return;
    }
    if (file.percent === 100) {
      this.saveKey(file);
    }
    let images = this.state.fileList;
    if (images.size === 0) {
      images = images.push(file);
    } else {
      let index = images.findIndex(function(item) {
        return item.uid === file.uid;
      });
      if (index < 0) {
        images = images.push(file);
      } else {
        images = images.update(index, function(item) {
          return file;
        });
      }
    }
    this.setState({ fileList: images });
  };
  getKey = (file: Object, ossPolicy: Object): string => {
    const { id } = this.state;
    const { dir } = ossPolicy;
    let fileName;
    if (file.name.indexOf(id) !== -1) {
      fileName = file.name;
    } else {
      let arr = file.name.split(".");
      // console.log("arr", arr);
      let suffix = arr[arr.length - 1];
      fileName = `${dir}/${id}/${file.uid}.${suffix}`;
    }
    return `${fileName}`;
  };
  getUploadParams = (ossPolicy: Object): ((file: Object) => Object) => {
    return (file: Object): Object => {
      const { AccessKey, policy, signature } = ossPolicy;
      let data = {
        key: this.getKey(file, ossPolicy),
        policy: policy,
        OSSAccessKeyId: AccessKey,
        success_action_status: "200",
        signature: signature
      };
      return data;
    };
  };
  printError = error => {
    message.error("文件上传异常", 2);
    // console.log("--------------------error--------------------", error);
  };
  onFailure = (transaction: Relay.RelayMutationTransaction): void => {
    // console.log("transaction", transaction);
    message.error("保存失败！", 3);
  };
  onSuccess = (response: Object): void => {
    message.success("保存成功！", 3);
    //  response.saveArticle
  };
  commit = (
    input: Object,
    doSubmit = false,
    callback?: (response: Object) => void
  ): void => {
    this.props.imageCommit(input, doSubmit, (error, response) => {
      if (error) {
        callback ? callback(error) : this.onFailure(error);
      } else {
        callback ? callback(response) : this.onSuccess(response);
      }
    });
    // this.props.relay.commitUpdate(new ArticleMutation({ input, doSubmit }), {
    //   onFailure: callback || this.onFailure,
    //   onSuccess: callback || this.onSuccess
    // });
  };
  _beforeUpload = (file, fileList) => {
    const { id } = this.state;
    if (id === "new") {
      return new Promise(resolve => {
        this.commit(
          { id: "new", keys: ["init"], values: ["1"] },
          false,
          (response: Object) => {
            // console.log("response", response.saveArticle.article.id);
            if (response.saveArticle) {
              this.setState({
                id: response.saveArticle.article.id
              });
              resolve(true);
            } else {
              resolve(false);
            }
          }
        );
      });
    } else {
      return true;
    }
  };
  render() {
    const { previewVisible, previewImage, fileList, id } = this.state;
    // console.log("render-fileList", fileList);
    const { viewer: { ossPostObjectPolicy } } = this.props;
    return (
      <Div className="clearfix">
        <Upload
          fileList={fileList.toArray()}
          onError={this.printError}
          multiple={id !== "new"}
          action={ossPostObjectPolicy.host}
          onRemove={this._onRemove}
          listType="picture-card"
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          data={this.getUploadParams(ossPostObjectPolicy)}
          beforeUpload={this._beforeUpload}
          accept=".jpg,.png,.jpeg,.gif"
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal
          width="auto"
          style={{ maxWidth: 830 }}
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </Div>
    );
  }
}

const PicturesWallContainer = Relay.createContainer(PicturesWall, {
  // initialVariables: { provinceCode: "0", cityCode: "0" },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
         ossPostObjectPolicy {
          signature
          host
          dir
          policy
          expire
          AccessKey
        }
      }
    `
  }
});

export default (props: Object) => {
  // console.log("-1--1-1-1-1-1--1-1-0-1203-103-30-1031-30");
  return (
    <RelayLoading forceFetch={true} route={new QueryRoute()}>
      <PicturesWallContainer {...props} />
    </RelayLoading>
  );
};
