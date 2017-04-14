// @flow

import React from "react";
import { Tag, Input, Tooltip, Button } from "antd";
import styled from "styled-components";
import _ from "lodash";

const styles = {
  bnt: {
    top: -8,
    left: -1,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0
  }
};

const Box = styled.div`
    margin-top: 20px;
    margin-left: 10px;
    display: flex;
    flex-wrap: wrap;
`;

export default class Category extends React.PureComponent {
  props: {
    add: (type: string, name: string, order: number) => void,
    deleteTag: (type: string, nodeId: string) => void,
    type: string,
    datasource: Object[]
  };
  input: any;
  state = {
    inputVisible: false,
    inputValue: ""
  };
  handleClose = (tagId: string) => {
    const { type, deleteTag } = this.props;
    deleteTag(type, tagId);
  };
  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };
  handleInputChange = (e: any) => {
    this.setState({ inputValue: e.target.value });
  };
  handleInputConfirm = () => {
    const state = this.state;
    const inputValue = state.inputValue;
    if (!_.isEmpty(_.trim(inputValue))) {
      const { add, type, datasource } = this.props;
      add(type, inputValue, datasource.length + 1);
    }
    this.setState({
      inputVisible: false,
      inputValue: ""
    });
  };
  saveInputRef = (input: any) => this.input = input;
  render() {
    const { datasource } = this.props;
    const { inputVisible, inputValue } = this.state;
    return (
      <Box>
        {datasource.map((tag, index) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag
              style={{ fontSize: 14, marginBottom: 20 }}
              key={tag.node.id}
              closable={index !== 0}
              afterClose={() => this.handleClose(tag.node.id)}
            >
              {isLongTag ? `${tag.node.name.slice(0, 20)}...` : tag.node.name}
            </Tag>
          );
          return isLongTag ? <Tooltip title={tag}>{tagElem}</Tooltip> : tagElem;
        })}
        {inputVisible &&
          <Input.Group style={{ width: "auto" }}>
            <Input
              ref={this.saveInputRef}
              type="text"
              size="small"
              style={{ width: 78 }}
              value={inputValue}
              onChange={this.handleInputChange}
              onPressEnter={this.handleInputConfirm}
            />
            <Button
              onClick={this.handleInputConfirm}
              style={styles.bnt}
              size="small"
            >
              确定
            </Button>
          </Input.Group>}
        {!inputVisible &&
          <Button
            size="small"
            style={{ height: 22, marginBottom: 20 }}
            type="dashed"
            onClick={this.showInput}
          >
            + 新标签
          </Button>}
      </Box>
    );
  }
}
