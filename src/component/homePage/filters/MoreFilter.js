// @flow
import React, { PureComponent, PropTypes } from "react";
import { DatePicker, Input } from "antd";
import Relay from "react-relay";
const InputGroup = Input.Group;
import moment from "moment";

import Marriage from "../filters/Marriage";
import Gender from "../filters/Gender";

class MoreFilter extends PureComponent {
  onDateChangeHandler: (fieldName: string) => (
    date: any,
    dateString: string
  ) => void;
  constructor(props: any) {
    super(props);
    this.onDateChangeHandler = this.onDateChangeHandler.bind(this);
  }
  onDateChangeHandler(fieldName: string) {
    return (date: any, dateString: string) => {
      // console.log(date.toDate().getTime(), typeof date);
      // console.log(date, typeof date);
      // console.log(dateString, typeof dateString);
      this.props.doSearch(
        (() => {
          var condition = {};
          condition[fieldName] = date === null
            ? 0
            : moment(dateString).toDate().getTime();
          return condition;
        })()
      );
    };
  }
  render(props: any) {
    const { doSearch } = this.props;
    return (
      <InputGroup compact>
        <DatePicker
          viewer={this.props.viewer}
          style={{ marginRight: -1, marginTop: 1 }}
          format="YYYY-MM-DD"
          placeholder="录入时间"
          onChange={this.onDateChangeHandler("createOn")}
        />
        <Gender
          viewer={this.props.viewer}
          dicCode={"Gender"}
          doSearch={doSearch}
          fieldName={"gender"}
          title="性别"
        />
        <Marriage
          viewer={this.props.viewer}
          dicCode={"Marriage"}
          doSearch={doSearch}
          fieldName={"marriage"}
          title="婚姻"
        />
        <DatePicker
          style={{ marginLeft: -1, marginTop: 1 }}
          // format="YYYY-MM-DD HH:mm"
          // showTime
          placeholder="出生日期"
          onChange={this.onDateChangeHandler("birthday")}
        />
      </InputGroup>
    );
  }
}
MoreFilter.propTypes = {
  doSearch: PropTypes.func.isRequired
};

module.exports = Relay.createContainer(MoreFilter, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${Gender.getFragment("viewer")}
        ${Marriage.getFragment("viewer")}
      }
    `
  }
});
