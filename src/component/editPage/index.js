// @flow
import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import ImageUpload from "./ImageUpload";
import SectionTitle from "../SectionTitle";
import RowX from "../RowX";
import EditForm from "./EditForm";

class AritcleEditor extends PureComponent {
  onValuesChange(props, values) {
    console.log(values);
  }
  render() {
    return (
      <div>
        <SectionTitle icon="edit" text="编辑案例信息" />
        <section className="filter-box">
          <RowX>
            <ImageUpload />
          </RowX>
          <EditForm onValuesChange={this.onValuesChange.bind(this)} />
        </section>
      </div>
    );
  }
}

export default withRouter(AritcleEditor);
