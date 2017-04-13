// @flow
import React, { PureComponent } from "react";
// import { withRouter } from "react-router-dom";
import Relay from "react-relay";
import ImageUpload from "./ImageUpload";
import SectionTitle from "../SectionTitle";
import RowX from "../RowX";
import EditFormContainer, { WrappedEditForm } from "./EditForm";
import RelayLoading from "../RelayLoading";
import QueryRoute from "../../queryConfig";
import NodeQueryConfig from "../../queryConfig/NodeQueryConfig";
import _ from "lodash";
import ArticleMutation from "./mutations";

const prefix = "article_";
const event_prefix = "event_";

class AritcleEditor extends PureComponent {
  keyArray: string[];
  currentKey: string;
  articleValues: Object;
  id: string;
  deletedEventIds: any[];
  allEvents: Object;
  savedEvents: Object;
  mutating: boolean;
  constructor(props) {
    super(props);
    // article fields array
    this.keyArray = [];
    // 当前编辑的字段项
    this.currentKey = "";
    // 所有修改的article内容
    this.articleValues = {};
    // 当前编辑的article ID
    this.id = "";
    // 已删除的事件 ID 【1， 2， 3， 4, "GDSFDSFDY==="】
    this.deletedEventIds = [];
    // 所有存在内容的事件 {event_1: "demo"}
    this.allEvents = {};
    // {event_1: "KAJSDHKASBDSdKJAS="}
    this.savedEvents = {};
  }
  componentDidMount() {
    this.id = this.props.match.params.id;
  }
  isPureAritleField = (fieldName: string): boolean => {
    return fieldName !== "keys" && !_.startsWith(fieldName, event_prefix);
  };
  idArticleEvent = (fieldName: string): boolean => {
    return _.startsWith(fieldName, event_prefix);
  };
  onEventInputDelete = (eventKey: number): void => {
    this.deletedEventIds.push(eventKey);
    var key = `${event_prefix}${eventKey}`;
    var inputObject: Object = { id: this.id };
    if (!_.isEmpty(this.savedEvents[key])) {
      inputObject.subEvents = [this.savedEvents[key]];
      this.doMutation(inputObject);
    }
  };
  onEventInputBlur = (eventKey: number): any => {
    return e => {
      if (this.deletedEventIds.indexOf(eventKey) !== -1) {
        return;
      }
      var inputObject: {
        id: string,
        eventIds?: string[],
        eventValues?: string[],
        addEvents?: string[]
      } = { id: this.id };
      var key = `${event_prefix}${eventKey}`;
      if (_.isEmpty(this.allEvents[key])) {
        return;
      }
      // saved
      if (!_.isEmpty(this.savedEvents[key])) {
        inputObject.eventIds = [this.savedEvents[key]];
        inputObject.eventValues = [this.allEvents[key]];
      } else {
        // new
        inputObject.addEvents = [`${eventKey}::${this.allEvents[key]}`];
      }
      this.doMutation(inputObject);
    };
  };
  onValuesChange(props, values) {
    // console.log(values);
    var keys = _.keys(values);
    if (this.isPureAritleField(keys[0])) {
      this.articleValues = { ...this.articleValues, ...values };
    }
    if (this.idArticleEvent(keys[0])) {
      this.allEvents = { ...this.allEvents, ...values };
    }
    if (
      !_.isEmpty(this.currentKey) &&
      this.currentKey !== keys[0] &&
      this.isPureAritleField(this.currentKey)
    ) {
      this.keyArray.push(this.currentKey);
      this.doMutation({ id: this.id, ...this.getFieldsForMutation() });
    }
    this.currentKey = keys[0];
  }
  doMutation = (inputObject: Object) => {
    this.mutating = true;
    this.props.relay.commitUpdate(new ArticleMutation(inputObject), {
      onFailure: this.onFailure,
      onSuccess: this.onSuccess
    });
  };
  getBirthday(value: Object): string {
    return `Date:${value.valueOf()}`;
  }
  getHomeplace(value: any): string {
    var homeplace = {};
    if (value[0]) {
      homeplace.province = value[0].split("=")[1];
    }
    if (value[1]) {
      homeplace.province = value[1].split("=")[1];
    }
    if (value[2]) {
      homeplace.province = value[2].split("=")[1];
    }
    return JSON.stringify(homeplace);
  }
  getFieldsForMutation = (): Object => {
    return {
      keys: this.keyArray,
      values: this.keyArray.map(key => {
        var value = this.articleValues[key];
        if (key === "birthday") {
          value = this.getBirthday(value);
        }
        if (key === "homePlace") {
          value = this.getHomeplace(value);
        }
        console.log(value);
        if (_.isString(value)) {
          return value;
        }
        return JSON.stringify(value);
      })
    };
  };
  onFailure = (transaction: Relay.RelayMutationTransaction): void => {
    console.log("transaction", transaction);
    this.mutating = false;
  };
  onSuccess = (response: Object): void => {
    this.mutating = false;
    console.log("response", response);
    this.id = response.saveArticle.article.id;
    if (!_.isEmpty(response.saveArticle.keys)) {
      this.keyArray = _.drop(this.keyArray, response.saveArticle.keys.length);
    }
    if (!_.isEmpty(response.saveArticle.eventKey2Ids)) {
      var k2is: string[] = response.saveArticle.eventKey2Ids;
      k2is.forEach(k2i => {
        var kandi = k2i.split("::");
        var key = `${event_prefix}${kandi[0]}`;
        this.savedEvents[key] = kandi[1];
      });
      //
    }
  };
  values = {
    keys: [1, 2],
    title: "asdasd",
    categories: ["晚婚", "牢狱"],
    name: "1252833909@qq.com",
    gender: "男",
    birthday: "2017-04-18T17:48:03.848Z",
    education: "小学",
    jobs: ["导演", "演员", "公务员"],
    marriage: "已婚",
    children: "valuesvaluesvaluesvaluesvalues",
    knowledge: "valuesvaluesvaluesvaluesvalues",
    homePlace: ["110000=北京市", "110100=市辖区", "110112=通州区"],
    event_1: "1eventseventseventseventseventsevents",
    event_2: "2eventseventseventseventseventseventseventsevents"
  };
  toJson(values) {
    return JSON.stringify(values);
  }
  getSubEvent = keys => {
    var clientKeys = keys.map(key => `${event_prefix}${key}`);
    var shouldDeleted = _.keys(this.savedEvents).filter(key => {
      return clientKeys.indexOf(key) === -1;
    });
    return shouldDeleted.map(key => {
      return this.savedEvents[key];
    });
  };
  getAddEvent = (keys, values) => {
    var clientKeys = keys.map(key => `${event_prefix}${key}`);
    var shouldToAdd = clientKeys.filter(key => {
      return _.isEmpty(this.savedEvents[key]);
    });
    return shouldToAdd.map(ak => {
      return values[ak];
    });
  };
  getShouldUpdate = (keys, values) => {
    var clientKeys = keys.map(key => `${event_prefix}${key}`);
    var shouldToUpdate = clientKeys.filter(key => {
      return !_.isEmpty(this.savedEvents[key]);
    });
    // arr.reduce((sum, n) => sum + n, 0)
    return shouldToUpdate.reduce(
      (total, key) => {
        total.ids.push(this.savedEvents[key]);
        total.contents.push(values[key]);
        return total;
      },
      { ids: [], contents: [] }
    );
  };
  handleSubmit = (values: Object) => {
    // id,keys,values,subEvents,subNotes,addEvents,addNotes,noteIds,noteValues,eventIds,eventValues,submit,
    console.log(values);
    console.log(JSON.stringify(values));
    var inputObject: Object = { id: this.id, submit: true };
    var {
      keys,
      title,
      categories,
      name,
      gender,
      birthday,
      education,
      jobs,
      marriage,
      children,
      knowledge,
      homePlace
    } = values;
    inputObject.subEvents = this.getSubEvent(keys);
    inputObject.addEvents = this.getAddEvent(keys, values);
    var shouldUpdate = this.getShouldUpdate(keys, values);
    inputObject.eventIds = shouldUpdate.ids;
    inputObject.eventValues = shouldUpdate.contents;
    inputObject.values = [
      title,
      this.toJson(categories),
      name,
      gender,
      this.getBirthday(birthday),
      education,
      this.toJson(jobs),
      marriage,
      children,
      knowledge,
      this.getHomeplace(homePlace)
    ];
    inputObject.keys = [
      "title",
      "categories",
      "name",
      "gender",
      "birthday",
      "education",
      "jobs",
      "marriage",
      "children",
      "knowledge",
      "homePlace"
    ];
    this.doMutation(inputObject);
  };
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
          {id === "new" &&
            <WrappedEditForm
              handleSubmit={this.handleSubmit}
              onEventInputBlur={this.onEventInputBlur}
              onEventInputDelete={this.onEventInputDelete}
              master={this.props.master}
              onValuesChange={this.onValuesChange.bind(this)}
            />}
          {id !== "new" &&
            <RelayLoading route={new NodeQueryConfig({ id })}>
              <EditFormContainer
                handleSubmit={this.handleSubmit}
                onEventInputBlur={this.onEventInputBlur}
                onEventInputDelete={this.onEventInputDelete}
                master={this.props.master}
                onValuesChange={this.onValuesChange.bind(this)}
              />
            </RelayLoading>}

        </section>
      </div>
    );
  }
}

export var EditorContainer = Relay.createContainer(AritcleEditor, {
  initialVariables: { provinceCode: "0", cityCode: "0" },
  fragments: {
    master: () => Relay.QL`
      fragment on MasterType {
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

export default (props: any) => (
  <RelayLoading route={new QueryRoute()}>
    <EditorContainer {...props} />
  </RelayLoading>
);
