// @flow
import React, { PureComponent } from "react";
// import { withRouter } from "react-router-dom";
import Relay from "react-relay";
import ImageUpload from "./ImageUpload";
import SectionTitle from "../SectionTitle";
import RowX from "../RowX";
import EditForm from "./EditForm";
import RelayLoading from "../RelayLoading";
import QueryRoute from "../../queryConfig";
import NodeQueryConfig from "../../queryConfig/NodeQueryConfig";

class AritcleEditor extends PureComponent {
  onValuesChange(props, values) {
    console.log(values);
  }
  render() {
    // console.log(this.props);
    const { match: { params: { id } } } = this.props;
    return (
      <div>
        <SectionTitle icon="edit" text="编辑案例信息" />
        <section className="filter-box">
          <RowX>
            <ImageUpload />
          </RowX>
          <RelayLoading route={new NodeQueryConfig({ id })}>
            <EditForm
              master={this.props.master}
              onValuesChange={this.onValuesChange.bind(this)}
            />
          </RelayLoading>
        </section>
      </div>
    );
  }
}

var EditorContainer = Relay.createContainer(AritcleEditor, {
  initialVariables: { provinceCode: "0", cityCode: "0" },
  fragments: {
    master: () => Relay.QL`
      fragment on MasterType {
        provinces(first: 50) {
          edges {
            node {
              id,
              name,
              isLeaf,
              code
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
        },
        jobs:dic(code: "Job", first: 99999) {
          edges {
            node {
              id
              name
              order
            }
          }
        },
        categories:dic(code: "Category", first: 99999) {
          edges {
            node {
              id
              name
              order
            }
          }
        },
        educations:dic(code: "Education", first: 99999) {
          edges {
            node {
              id
              name
              order
            }
          }
        },
        genders:dic(code: "Gender", first: 99999) {
          edges {
            node {
              id
              name
              order
            }
          }
        },
        marriages:dic(code: "Marriage", first: 99999) {
          edges {
            node {
              id
              name
              order
            }
          }
        }
      }
    `
  }
});

module.exports = (props: any) => (
  <RelayLoading route={new QueryRoute()}>
    <EditorContainer {...props} />
  </RelayLoading>
);
