// @flw
import React, { PureComponent } from "react";

import { Row, Col, Icon } from "antd";
import { withRouter, Link } from "react-router-dom";
import _ from "lodash";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
// import styled from 'styled-components';

import ArticleDetail from "../ArticleDetail";
import type { ArticleProps } from "../types";

const styles = {
  wrap: {
    borderBottom: "1px solid #eee",
    lineHeight: 1.7,
    paddingBottom: 10,
    marginBottom: 10
  },
  category: {
    color: "#999"
  },
  title: {
    fontSize: 15,
    fontWeight: 700
  },
  name: {
    fontWeight: 700
  },
  otherProps: {
    color: "#999"
  },
  img: {
    height: 112,
    width: 200,
    borderRadius: 4
  },
  imgWrap: {
    margin: "1px 10px 5px 0"
  },
  content: {
    padding: "3px 10px",
    color: "#000"
  },
  contentWithoutImg: {
    padding: "3px 0",
    color: "#000"
  },
  bold: {
    fontWeight: 500
  },
  bnt: {
    textAlign: "right"
  },
  rightTopIcon: {
    marginRight: 2
  }
};

class ArticleItem extends PureComponent {
  props: ArticleProps;
  constructor(props) {
    super(props);
    this.state = {
      showDetail: false
    };
    this.onChange = this.onChange.bind(this);
    this.viewDetails = this.viewDetails.bind(this);
    this.showDetailHandler = this.showDetailHandler.bind(this);
    this.hideDetail = this.hideDetail.bind(this);
  }
  getInlineImage(attachments) {
    if (_.isEmpty(attachments)) {
      return null;
    }
    let first = attachments[0];
    // http://lorempixel.com/640/480/cats
    first = _.replace(first, "640", "200");
    first = _.replace(first, "480", "112");
    return first;
  }
  onChange(a, b, c) {
    console.log(a, b, c);
  }
  viewDetails() {
    this.props.history.push(`/detail/${this.props.article.id}`);
  }
  showDetailHandler() {
    this.setState({ showDetail: true });
  }
  hideDetail() {
    this.setState({
      showDetail: false
    });
  }
  render() {
    const {
      article: {
        id,
        attachments,
        categories,
        title,
        name,
        gender,
        birthday,
        createdAt,
        homePlace: { province, city, area },
        events,
        knowledge
      }
    } = this.props;
    const { showDetail } = this.state;
    const showItem = !showDetail;
    const hasAttachments = !_.isEmpty(attachments);
    return (
      <div style={styles.wrap}>
        <Row>
          <Col span={18} style={styles.category}>
            <span>类别：</span>
            <span>
              {_.reduce(
                categories,
                (p, v) => `${p}${_.isEmpty(p) ? "" : ", "}${v}`,
                ""
              )}
            </span>
          </Col>
          <Col span={2} style={styles.bnt}>
            <span>{moment(createdAt).fromNow()}</span>
          </Col>
          <Col span={2} style={styles.bnt}>
            <Link to={`/edit/${id}`} className="meta-item">
              <Icon type="edit" style={styles.rightTopIcon} />编辑
            </Link>
          </Col>
          <Col span={2} style={styles.bnt}>
            <a href="#" className="meta-item meta-item-danger">
              <Icon type="delete" style={styles.rightTopIcon} />删除
            </a>
          </Col>
        </Row>
        <Row style={styles.title}>
          <Col span={24}>
            <Link to={`/detail/${id}`}>{title}</Link>
          </Col>
        </Row>
        <div>
          <span style={styles.name}>{name}，</span>
          <span style={styles.otherProps}>
            {gender}
            ，
            {moment(birthday).format("YYYY-MM-DD hh:mm")}
            ，
            {`${province}${city}${area}`}
          </span>
        </div>
        {showItem &&
          <Row style={{ cursor: "pointer" }}>
            {hasAttachments &&
              <Col
                span={5}
                onClick={this.viewDetails}
                style={{ paddingTop: 7 }}
              >
                <img
                  src={this.getInlineImage(attachments)}
                  alt="命盘"
                  style={styles.img}
                />
              </Col>}
            <Col
              span={hasAttachments ? 19 : 24}
              style={hasAttachments ? styles.content : styles.contentWithoutImg}
            >
              {!_.isEmpty(events.edges) &&
                <div onClick={this.viewDetails}>
                  <span style={styles.bold}>重要事件：</span>
                  {_.truncate(events.edges[0].node.text, { length: 200 })}
                </div>}
              <div>
                <div onClick={this.viewDetails}>
                  <span style={styles.bold}>
                    命理知识备注：
                  </span>
                  <span>
                    {_.truncate(knowledge, { length: 200 })}
                  </span>
                </div>
                <a onClick={this.showDetailHandler} className="toggle-expand">
                  显示全部
                </a>
              </div>
            </Col>
          </Row>}
        {showDetail &&
          <ArticleDetail
            article={this.props.article}
            affixHandler={this.hideDetail}
            affix={true}
          />}
      </div>
    );
  }
}

export default withRouter(ArticleItem);
