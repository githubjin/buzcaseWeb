// @flow
import React, { PureComponent, PropTypes } from "react";
import { Button, Menu, Dropdown, Icon } from "antd";

export default class DictDropdown extends PureComponent {
  handleMenuClick: (e: Object) => void;
  renderOverlay: () => React.Component<any, any, any>;
  state: {
    text: string
  };
  constructor(props: any) {
    super(props);
    this.state = {
      text: ""
    };
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.renderOverlay = this.renderOverlay.bind(this);
  }
  handleMenuClick(e: any) {
    // console.log(e.key, e.item.props.children);
    const { doSearch, fieldName } = this.props;
    doSearch(
      (() => {
        let condition = {};
        condition[fieldName] = e.item.props.children === "全部"
          ? ""
          : e.item.props.children;
        return condition;
      })()
    );
    this.setState({ text: e.item.props.children });
  }
  renderOverlay() {
    // const { viewer: { dic: { edges } } } = this.props;
    const viewer = this.props.viewer || {};
    const dic = viewer.dic || {};
    const edges = dic.edges || [];
    return (
      <Menu onClick={this.handleMenuClick}>
        {edges.map(edge => {
          return <Menu.Item key={edge.node.id}>{edge.node.name}</Menu.Item>;
        })}
      </Menu>
    );
  }
  render() {
    const title = this.state.text || this.props.title;
    return (
      <Dropdown overlay={this.renderOverlay()}>
        <Button style={{ minWidth: 80 }}>
          {title} <Icon type="down" />
        </Button>
      </Dropdown>
    );
  }
}
DictDropdown.propTypes = {
  doSearch: PropTypes.func.isRequired,
  fieldName: PropTypes.string.isRequired
};
