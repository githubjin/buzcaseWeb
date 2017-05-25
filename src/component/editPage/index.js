// @flow
import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { message, Icon, Button } from "antd";
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

const RightTitleBox = styled.div`
  text-align: right;
  font-size: 14px;     
`;
// const prefix = "article_";
const event_prefix = "event_";
type Task = {
  func: (...args: Array<*>) => any,
  args: Array<*>
};
class AritcleEditor extends PureComponent {
  keyArray: string[];
  currentKey: string;
  articleValues: Object;
  id: string;
  deletedEventIds: any[];
  allEvents: Object;
  savedEvents: Object;
  article: ?Object;
  mutating: boolean;
  submiting: boolean;
  tasks: Array<Task>;
  state: {
    attachments: string[],
    larges: string[],
    thumbs: string[]
  };
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
    this.article = null;
    // 是否提交中
    this.submiting = false;
    // 提交任务队列，线性执行
    this.tasks = [];
    this.state = {
      attachments: [],
      larges: [],
      thumbs: []
    };
  }
  consoleState = () => {
    // console.log("this.tasks", this.tasks, this.tasks.length);
    // console.log("this.submiting", this.submiting);
    // console.log("this.savedEvents", this.savedEvents, this.savedEvents.length);
    // console.log("this.keyArray", this.keyArray, this.keyArray.length);
    // console.log("this.currentKey", this.currentKey);
    // console.log("this.allEvents", this.allEvents);
    // console.log("this.articleValues", this.articleValues);
  };
  componentWillReceiveProps(nextProps) {
    // console.log("nextProps.match.params", nextProps.match.params);
    // console.log("this.props.match.params", this.props.match.params);
    if (
      nextProps.match.params.id !== this.props.match.params.id ||
      nextProps.match.params.random !== this.props.match.params.random
    ) {
      this._initUploadedImages([], [], []);
      this.keyArray = [];
      this.currentKey = "";
      this.articleValues = {};
      this.id = nextProps.match.params.id;
      this.deletedEventIds = [];
      this.allEvents = {};
      this.savedEvents = {};
      this.article = null;
      this.submiting = false;
      this.tasks = [];
    }
  }
  componentDidMount() {
    this.id = this.props.match.params.id;
  }
  isPureAritleField = (fieldName: string): boolean => {
    return (
      fieldName !== "keys" &&
      fieldName !== "timer" &&
      !_.startsWith(fieldName, event_prefix)
    );
  };
  idArticleEvent = (fieldName: string): boolean => {
    return _.startsWith(fieldName, event_prefix);
  };
  onEventInputDelete = (
    eventKey: number | string,
    force: boolean = false
  ): void => {
    this.deletedEventIds.push(eventKey);
    var key = `${event_prefix}${eventKey}`;
    var inputObject: Object = { id: this.id };
    if (_.isString(eventKey)) {
      this.savedEvents[key] = eventKey;
    }
    if (!_.isEmpty(this.savedEvents[key])) {
      this.tasks.push({
        func: this.onEventInputDelete,
        args: [eventKey]
      });
      if (this.tasks.length > 1 && !force) {
        return;
      }
      inputObject.subEvents = [this.savedEvents[key]];
      this.doMutation(inputObject);
    }
  };
  onEventInputBlur = (
    eventKey: number | string,
    force: boolean = false
  ): any => {
    return e => {
      // console.log(eventKey, force, e);
      if (e.keyCode !== 32) {
        return;
      }
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
      this.tasks.push({
        func: this.onEventInputBlur(eventKey, true),
        args: []
      });
      if (this.tasks.length > 1 && !force) {
        return;
      }
      // saved
      if (_.isString(eventKey)) {
        this.savedEvents[key] = eventKey;
      }
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
  onValuesChange(props, values, articleNode, force: boolean = false) {
    // console.log(
    //   this.currentKey,
    //   "--------------- onValuesChange -----------------",
    //   JSON.stringify(values),
    //   props,
    //   articleNode,
    //   force
    // );
    if (!_.isEmpty(articleNode)) {
      this.article = articleNode;
    }
    var keys = _.keys(values);
    if (this.isPureAritleField(keys[0])) {
      this.articleValues = { ...this.articleValues, ...values };
    }
    if (this.idArticleEvent(keys[0])) {
      this.allEvents = { ...this.allEvents, ...values };
    }
    // console.log(
    //   `!_.isEmpty(this.currentKey) &&
    //   this.currentKey !== keys[0] &&
    //   this.isPureAritleField(this.currentKey)`,
    //   !_.isEmpty(this.currentKey),
    //   this.currentKey !== keys[0],
    //   this.isPureAritleField(this.currentKey)
    // );
    if (
      !_.isEmpty(this.currentKey) &&
      this.currentKey !== keys[0] &&
      this.isPureAritleField(this.currentKey)
    ) {
      this.tasks.push({
        func: this.onValuesChange,
        args: [props, values, articleNode]
      });
      // console.log(this.tasks, this.tasks.length, force);
      if (this.tasks.length > 1 && !force) {
        return;
      }
      this.keyArray.push(this.currentKey);
      this.doMutation({ id: this.id, ...this.getFieldsForMutation() });
    }
    if (!force) {
      this.currentKey = keys[0];
    }
  }
  doMutation = (inputObject: Object, doSubmit: boolean = false) => {
    this.mutating = true;
    if (this.article != null) {
      inputObject = { ...inputObject, submit: doSubmit || this.article.submit };
    }
    this.props.relay.commitUpdate(
      new ArticleMutation({ input: inputObject, doSubmit }),
      {
        onFailure: this.onFailure,
        onSuccess: this.onSuccess
      }
    );
  };
  getBirthday(value: Object): string {
    return `Date:${value.valueOf()}`;
  }
  getHomeplace(value: any): string {
    var homeplace = {};
    if (value[0]) {
      homeplace.province = value[0];
    }
    if (value[1]) {
      homeplace.city = value[1];
    }
    if (value[2]) {
      homeplace.area = value[2];
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
        // console.log(value);
        if (_.isString(value)) {
          return value;
        }
        return JSON.stringify(value);
      })
    };
  };
  dropTask = () => {
    // console.log("this.tasks.length = ", this.tasks.length);
    this.consoleState();
    this.tasks = _.drop(this.tasks, 1);
    if (this.tasks.length > 0) {
      var { func, args } = this.tasks[0];
      func(...args, true);
    }
  };
  onFailure = (transaction: Relay.RelayMutationTransaction): void => {
    // console.log("transaction", transaction);
    this.mutating = false;
    this.submiting = false;
    message.error("保存失败！", 3);
    this.dropTask();
  };
  onSuccess = (response: Object): void => {
    this.mutating = false;
    if (this.submiting) {
      this.submiting = false;
      message.success("保存成功！", 3);
    }
    // console.log("response", response);
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
    this.dropTask();
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
  handleNewSubmit = (inputObject: Object, values: Object) => {
    if (_.isEmpty(this.article)) {
      this.article = { id: this.id, submit: true };
    }
    var { keys } = values;
    var shouldUpdate = this.getShouldUpdate(keys, values);
    inputObject.keys = this.getInputKeys();
    inputObject.values = this.getInputValues(values);
    inputObject.subEvents = this.getSubEvent(keys);
    inputObject.addEvents = this.getAddEvent(keys, values);
    inputObject.eventIds = shouldUpdate.ids;
    inputObject.eventValues = shouldUpdate.contents;
    return inputObject;
  };
  handleUpdateSubmit = (
    inputObject: Object,
    values: Object,
    articleNode: Object
  ) => {
    var { keys } = values;
    inputObject.keys = this.getInputKeys();
    inputObject.values = this.getInputValues(values);
    inputObject.subEvents = this.getUpdateNeedDeletedEvents(keys, articleNode);
    inputObject.addEvents = this.getUpdateNeedAddedEvents(values, keys);
    var shouldUpdates = this.getUpdateShould2Update(values, keys, articleNode);
    inputObject.eventIds = shouldUpdates.ids;
    inputObject.eventValues = shouldUpdates.contents;
    return inputObject;
  };
  getUpdateShould2Update = (
    values: Object,
    keys: Array<*>,
    articleNode: Object
  ): Object => {
    if (_.isEmpty(articleNode.events.edges) || _.isEmpty(keys)) {
      return { ids: [], contents: [] };
    }
    var should2Update = articleNode.events.edges.filter(edge => {
      return keys.indexOf(edge.node.id) > -1;
    });
    var ids = [], contents = [];
    should2Update.forEach(edge => {
      ids.push(edge.node.id);
      var clientKey = `${event_prefix}${edge.node.id}`;
      contents.push(values[clientKey]);
    });
    return { ids, contents };
  };
  handleSubmit = (
    values: Object,
    articleNode: Object,
    force: boolean = false
  ) => {
    // this.tasks.push({ func: this.handleSubmit, args: [values, articleNode] });
    // if (this.tasks.length > 1 && !force) {
    //   return;
    // }
    if (this.tasks && this.tasks.length > 0) {
      this.tasks = [];
    }
    // id,keys,values,subEvents,subNotes,addEvents,addNotes,noteIds,noteValues,eventIds,eventValues,submit,
    var inputObject: Object = { id: this.id, submit: true };
    // console.log(JSON.stringify(values));
    if (_.isEmpty(articleNode)) {
      inputObject = this.handleNewSubmit(inputObject, values);
    } else {
      inputObject = this.handleUpdateSubmit(inputObject, values, articleNode);
    }
    this.doMutation(inputObject, true);
    this.submiting = true;
  };
  getUpdateNeedAddedEvents = (values: Object, keys: Array<*>): string[] => {
    if (_.isEmpty(keys)) {
      return [];
    }
    var finalArr = [];
    keys.filter(key => {
      var b = _.isNumber(key);
      var clientKey = `${event_prefix}${key}`;
      b = b && _.isEmpty(this.savedEvents[clientKey]);
      if (b) {
        finalArr.push(values[clientKey]);
      }
      return b;
    });
    return finalArr;
  };
  getUpdateNeedDeletedEvents = (
    keys: Array<*>,
    articleNode: Object
  ): string[] => {
    if (_.isEmpty(articleNode.events.edges)) {
      return [];
    }
    var shouldDeletedNode = articleNode.events.edges.filter(edge => {
      return keys.indexOf(edge.node.id) === -1;
    });
    return shouldDeletedNode.map(edge => edge.node.id);
  };
  getInputValues = (values: Object): string[] => {
    var {
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
    return [
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
  };
  getInputKeys = (): string[] => {
    return [
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
  };
  _initUploadedImages = (
    attachments: string[],
    larges: string[] = [],
    thumbs: string[] = []
  ): void => {
    this.setState({
      attachments,
      larges,
      thumbs
    });
  };
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.match.params.id !== nextProps.match.params.id ||
      this.props.match.params.random !== nextProps.match.params.random ||
      this.state.attachments !== nextState.attachments ||
      this.state.larges !== nextState.larges ||
      this.state.thumbs !== nextState.thumbs
    );
  }
  imageCommit = (
    input: Object,
    doSubmit = false,
    callback: (error: any, response: Object) => void
  ): void => {
    if (this.id && this.id !== " new") {
      input.id = this.id;
    } else if (input.id && input.id !== "new") {
      this.id = input.id;
    }
    this.props.relay.commitUpdate(new ArticleMutation({ input, doSubmit }), {
      onFailure: callback,
      onSuccess: response => {
        if (response.saveArticle && (!this.id || this.id === "new")) {
          this.id = response.saveArticle.article.id;
        }
        callback(null, response);
      }
    });
  };
  render() {
    // console.log(this.props);
    const { match: { params: { id, random } } } = this.props;
    return (
      <div>
        <SectionTitle
          icon="edit"
          text="编辑案例信息"
          left={
            <RightTitleBox>
              <Link to="/drafts">
                <Button type="dashed" size="small">
                  <Icon type="file-text" /> 草稿
                </Button>
              </Link>
            </RightTitleBox>
          }
        />
        <section className="filter-box">
          <RowX>
            <ImageUpload
              id={id}
              random={random}
              imageCommit={this.imageCommit}
              larges={this.state.larges}
              thumbs={this.state.thumbs}
              attachments={this.state.attachments}
            />
          </RowX>
          {id === "new" &&
            <WrappedEditForm
              random={random}
              handleSubmit={this.handleSubmit}
              onEventInputBlur={this.onEventInputBlur}
              onEventInputDelete={this.onEventInputDelete}
              viewer={this.props.viewer}
              sendBackImages={this._initUploadedImages}
              onValuesChange={this.onValuesChange.bind(this)}
            />}
          {id !== "new" &&
            <RelayLoading
              shouldUpdate={false}
              forceFetch={true}
              route={new NodeQueryConfig({ id })}
            >
              <EditFormContainer
                random={random}
                handleSubmit={this.handleSubmit}
                onEventInputBlur={this.onEventInputBlur}
                onEventInputDelete={this.onEventInputDelete}
                viewer={this.props.viewer}
                sendBackImages={this._initUploadedImages}
                onValuesChange={this.onValuesChange.bind(this)}
              />
            </RelayLoading>}
        </section>
      </div>
    );
  }
}

export var EditorContainer = Relay.createContainer(AritcleEditor, {
  // initialVariables: { provinceCode: "0", cityCode: "0" },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
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

// values = {
//   keys: [1, 2],
//   title: "asdasd",
//   categories: ["晚婚", "牢狱"],
//   name: "1252833909@qq.com",
//   gender: "男",
//   birthday: "2017-04-18T17:48:03.848Z",
//   education: "小学",
//   jobs: ["导演", "演员", "公务员"],
//   marriage: "已婚",
//   children: "valuesvaluesvaluesvaluesvalues",
//   knowledge: "valuesvaluesvaluesvaluesvalues",
//   homePlace: ["110000=北京市", "110100=市辖区", "110112=通州区"],
//   event_1: "1eventseventseventseventseventsevents",
//   event_2: "2eventseventseventseventseventseventseventsevents"
// };
