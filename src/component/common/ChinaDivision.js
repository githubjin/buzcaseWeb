// @flow

import React, { PropTypes } from "react";
import { Form, Cascader } from "antd";
const FormItem = Form.Item;
import Relay from "react-relay";

export default class BirthPlace extends React.PureComponent {
  loading: boolean;
  state: {
    width: number
  };
  onChange: (string, Object) => void;
  loadData: (Object) => void;
  provinceFormat: () => Object[];
  renderInForm: () => any;
  renderSingle: () => any;
  getValue: (node: Object) => string;
  getCode: (code: ?string) => string;
  cascader: any;
  constructor(props: any) {
    super(props);
    this.state = {
      width: 100
    };
    this.loading = false;
    this.onChange = this.onChange.bind(this);
    this.loadData = this.loadData.bind(this);
    this.renderSingle = this.renderSingle.bind(this);
    this.renderInForm = this.renderInForm.bind(this);
    this.provinceFormat = this.provinceFormat.bind(this);
    this.getValue = this.getValue.bind(this);
    this.getCode = this.getCode.bind(this);
  }
  getValue(node: Object) {
    const { inForm } = this.props;
    if (inForm) {
      return `${node.code}=${node.name}`;
    }
    return node.code;
  }
  getCode(code: ?string) {
    if (!code) {
      return code;
    }
    if (code.indexOf("=") === -1) {
      return code;
    }
    return code.split("=")[0];
  }
  provinceFormat() {
    const { master: { provinces: { edges } } } = this.props;
    let provinces = edges.map(edge => ({
      value: this.getValue(edge.node),
      label: edge.node.name,
      isLeaf: edge.node.isLeaf,
      children: this.subArea()
    }));
    return provinces;
  }
  subArea(isCity: boolean = true) {
    var edges = isCity ? this.props.master.cities : this.props.master.areas;
    if (!edges || edges.length === 0) {
      return null;
    }
    return edges.map(item => ({
      value: this.getValue(item),
      label: item.name,
      isLeaf: item.isLeaf,
      children: isCity ? this.subArea(false) : []
    }));
  }
  clearSubQuyu(value: any, selectedOptions: any) {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    if (targetOption) {
      targetOption.loading = true;
      delete targetOption.children;
    }
    this.loading = false;
    this.loadData(selectedOptions);
  }
  onChange(value: any, selectedOptions: any) {
    this.clearSubQuyu(value, selectedOptions);
    let address = selectedOptions.map((o, i) => {
      return o.label;
    });
    let homePlace = {};
    if (address.length > 0) {
      homePlace.province = address[0];
      if (address.length > 1) {
        homePlace.city = address[1];
        if (address.length > 2) {
          homePlace.area = address[2];
        }
      }
    }
    if (this.props.doSearch) {
      this.props.doSearch({ homePlace });
    }
    let length = address.join(" / ").length;
    length = length > 6 ? length : 7;
    if (this.props.matchInputWidth) {
      this.setState({
        width: length * 14 +
          (address.length <= 1 ? 30 : address.length === 2 ? 20 : -10)
      });
    }
  }
  loadData(selectedOptions: any) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    if (selectedOptions.length === 0) {
      return;
    }
    var provinceCode, cityCode;
    const provinceOptions = selectedOptions[0];
    const targetOption = selectedOptions[selectedOptions.length - 1];
    if (selectedOptions.length === 1) {
      provinceCode = targetOption.value;
    } else {
      provinceCode = provinceOptions.value;
      cityCode = selectedOptions[1].value;
    }
    targetOption.loading = true;
    this.props.relay.setVariables(
      {
        provinceCode: this.getCode(provinceCode),
        cityCode: this.getCode(cityCode)
      },
      this.onReadyStateChange
    );
  }
  onReadyStateChange(readyState: Object) {
    var { aborted, done, error } = readyState;
    if (!done) {
      this.loading = true;
    } else {
      this.loading = false;
    }
    // console.log("onReadyStateChange", aborted, done, error, this.loading);
  }
  renderSingle() {
    const { width } = this.state;
    const { placeholder = "请选择..." } = this.props;
    let style = this.props.matchInputWidth ? { width } : {};
    return (
      <Cascader
        placeholder={placeholder}
        style={style}
        options={this.provinceFormat()}
        loadData={this.loadData}
        onChange={this.onChange}
        changeOnSelect
        allowClear
      />
    );
  }
  renderInForm() {
    const {
      formItemLayout,
      getFieldDecorator,
      fieldName,
      rules,
      label,
      placeholder
    } = this.props;
    return (
      <FormItem hasFeedback {...formItemLayout} label={label}>
        {getFieldDecorator(fieldName, {
          rules: rules
        })(this.renderSingle())}
      </FormItem>
    );
  }
  render() {
    const { inForm = false } = this.props;
    if (inForm) {
      return this.renderInForm();
    }
    return this.renderSingle();
  }
}

BirthPlace.propTypes = {
  doSearch: PropTypes.func,
  matchInputWidth: PropTypes.bool.isRequired,
  master: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
  inForm: PropTypes.bool,
  formItemLayout: PropTypes.object,
  getFieldDecorator: PropTypes.func,
  fieldName: PropTypes.string,
  rules: PropTypes.arrayOf(PropTypes.object),
  label: PropTypes.string,
  placeholder: PropTypes.string
};
