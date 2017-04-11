// @flow

import React from 'react';

import { Upload, Icon, Modal } from 'antd';
import styled from 'styled-components';

export default class PicturesWall extends React.Component {
  handleCancel: () => void
  handlePreview: (any) => void
  handleChange: (Object) => void
  state: {
    previewVisible: boolean,
    fileList: Object[],
    previewImage: ?string,
  }
  constructor(props: any) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      previewVisible: false,
      fileList: [],
      previewImage: null,
    }
  }
  handleCancel() {
    this.setState({ previewVisible: false })
  }
  handlePreview(file: any) {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange({ fileList }: Object) {
    this.setState({ fileList })
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="upload" style={{fontSize: 35}}/>
        <div className="ant-upload-text" style={{fontSize: 14}}>上传命盘</div>
      </div>
    );
    const Div = styled.div`
      display: flex;
      justify-content: center;
    `;
    return (
      <Div className="clearfix">
        <Upload
          action="//jsonplaceholder.typicode.com/posts/"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Div>
    );
  }
}
