// @flow

import React, { PropTypes } from "react";
import { Cascader } from "antd";
import Relay from "react-relay";

class BirthPlace extends React.PureComponent {
  state: {
    inputValue: string,
    width: number
  };
  onChange: (string, Object) => void;
  loadData: (Object) => void;
  provinceFormat: () => Object[];
  cascader: any;
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "点击选择...",
      width: 100
    };
    this.onChange = this.onChange.bind(this);
    this.loadData = this.loadData.bind(this);
    this.provinceFormat = this.provinceFormat.bind(this);
  }
  provinceFormat() {
    const { master: { provinces: { edges } } } = this.props;
    let provinces = edges.map(edge => ({
      value: edge.node.code,
      label: edge.node.name,
      isLeaf: edge.node.isLeaf,
      children: this.subArea()
    }));
    return provinces;
  }
  subArea(isCity = true) {
    var edges = isCity ? this.props.master.cities : this.props.master.areas;
    if (!edges || edges.length === 0) {
      return null;
    }
    return edges.map(item => ({
      value: item.code,
      label: item.name,
      isLeaf: item.isLeaf,
      children: isCity ? this.subArea(false) : []
    }));
  }
  clearSubQuyu(value, selectedOptions) {
    // console.log(value, ...selectedOptions);
    const targetOption = selectedOptions[selectedOptions.length - 1];
    if (targetOption) {
      targetOption.loading = true;
      delete targetOption.children;
    }
    this.loadData(selectedOptions);
  }
  onChange(value, selectedOptions) {
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
    this.props.doSearch({ homePlace });
    let length = address.join(" / ").length;
    length = length > 6 ? length : 7;
    // console.log(this.cascader);
    this.setState({
      width: length * 14 +
        (address.length <= 1 ? 30 : address.length === 2 ? 20 : -10)
    });
  }
  loadData(selectedOptions) {
    // console.log(selectedOptions);
    console.log("-------------loadData-------------------------------");
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
    this.props.relay.setVariables({
      provinceCode,
      cityCode
    });
  }
  render() {
    const { width } = this.state;
    return (
      <div id="filter_homeplace">
        <Cascader
          ref={cas => {
            this.cascader = cas;
          }}
          placeholder="请选择..."
          style={{ width }}
          options={this.provinceFormat()}
          loadData={this.loadData}
          onChange={this.onChange}
          changeOnSelect
          allowClear
          showSearch
        />
      </div>
    );
  }
}

BirthPlace.propTypes = {
  doSearch: PropTypes.func.isRequired
};

module.exports = Relay.createContainer(BirthPlace, {
  initialVariables: { provinceCode: "0", cityCode: "0" },
  fragments: {
    master: () => Relay.QL`
      fragment on MasterType {
        provinces: provinces(first: 50){
          edges {
            node {
              id,
              name,
              code,
              isLeaf
            }
          }
        },
        cities: subQuyu(code: $provinceCode) {
          id,
          name,
          code,
          isLeaf
        },
        areas: subQuyu(code: $cityCode) {
          id,
          name,
          code,
          isLeaf
        }
      }
    `
  }
});
