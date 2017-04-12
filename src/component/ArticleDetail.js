// @flow

import React, { Component, PropTypes } from "react";
import { Affix, Button, Row, Col, Modal, Icon, Timeline } from "antd";
import Slider from "react-slick";
import _ from "lodash";
import Relay from "react-relay";
import moment from "moment";

import type { ArticleProps } from "./types";

const styles = {
  imgWrap: {
    padding: 5,
    border: "1px solid #c7b9a9",
    marginLeft: 3,
    marginRight: 3,
    background: "transparent",
    position: "relative",
    cursor: "pointer"
  },
  img: {
    height: 300
  },
  mengban: {
    width: "100%",
    height: 300,
    top: 0,
    left: 0,
    position: "absolute"
  },
  itemPadding: {
    paddingBottom: 10
  }
};

const settings = {
  className: "slider variable-width",
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  variableWidth: true,
  swipeToSlide: true,
  autoplay: true,
  draggable: false,
  touchMove: true,
  dots: false
};

export default class ArticleDetail extends Component {
  props: ArticleProps;
  state: {
    previewVisible: boolean,
    previewImage: string,
    showAffix: boolean
  };
  showPic: (img: string) => void;
  handleCancel: () => void;
  affixHandler: () => void;
  scrollHandler: (e: Event) => void;
  container: Object;
  constructor(props: any) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: "",
      showAffix: false
    };
    this.showPic = this.showPic.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.affixHandler = this.affixHandler.bind(this);
    this.scrollHandler = this.scrollHandler.bind(this);
  }
  showPic(img: string) {
    return () => {
      this.setState({
        previewVisible: true,
        previewImage: img
      });
    };
  }
  handleCancel() {
    this.setState({
      previewVisible: false
    });
  }
  affixHandler() {
    let { top } = this.container.getBoundingClientRect();
    // console.log(this.container.getBoundingClientRect());
    if (top < 0) {
      window.scrollTo(0, window.scrollY + top - 80);
    }
    this.props.affixHandler();
  }
  scrollHandler(e: Event) {
    // let scrollTop = document.body.scrollTop ||
    //   document.documentElement.scrollTop;
    let { top, bottom } = this.container.getBoundingClientRect();
    let { innerHeight } = window;
    let showAffix = top - 80 <= innerHeight && bottom > innerHeight;
    // console.log(showAffix, top, bottom, innerHeight, showAffix !== this.state.showAffix);
    if (showAffix !== this.state.showAffix) {
      this.setState({ showAffix });
    }
  }
  componentDidMount() {
    const { affix = false } = this.props;
    if (affix) {
      window.addEventListener("scroll", this.scrollHandler);
    }
  }
  componentWillUnmount() {
    const { affix = false } = this.props;
    if (affix) {
      window.removeEventListener("scroll", this.scrollHandler);
    }
  }
  getSliderImage(url: string): string {
    let fin = url;
    fin = _.replace(fin, "640", "400");
    fin = _.replace(fin, "480", "300");
    return fin;
  }
  renderImages(attachments: string[]) {
    if (_.isEmpty(attachments)) {
      return null;
    }
    return (
      <Slider {...settings}>
        {attachments.map((item, i) => {
          return (
            <div style={styles.imgWrap} key={`${item}_${i}`}>
              <img
                style={styles.img}
                src={this.getSliderImage(item)}
                alt="命盘"
              />
              <div onClick={this.showPic(item)} style={styles.mengban} />
            </div>
          );
        })}
      </Slider>
    );
  }
  render() {
    const { affix = false } = this.props;
    const article = this.props.article || this.props.node;
    const {
      attachments,
      education,
      jobs,
      marriage,
      children,
      events,
      knowledge,
      notes
    } = article;
    const { previewVisible, previewImage, showAffix } = this.state;
    return (
      <div
        ref={node => {
          this.container = node;
        }}
        style={{ marginTop: 10, fontSize: 14, lineHeight: 1.7, color: "#000" }}
      >
        {this.renderImages(attachments)}
        <Row style={{ ...styles.itemPadding, ...{ paddingTop: 5 } }}>
          <Col span={2}><strong>学历：</strong> </Col>
          <Col span={10}>{education}</Col>
          <Col span={2}><strong>职业：</strong> </Col>
          <Col span={10}>{!_.isEmpty(jobs) && jobs.join("，")}</Col>
        </Row>
        <Row style={{ ...styles.itemPadding, ...{ paddingTop: 5 } }}>
          <Col span={2}><strong>婚姻：</strong> </Col>
          <Col span={10}>{marriage} </Col>
          <Col span={2}><strong>子女：</strong> </Col>
          <Col span={10}>{children} </Col>
        </Row>
        {!_.isEmpty(events) &&
          <Row style={styles.itemPadding}>
            <Col span={2}>
              <strong>重要事件：</strong>
            </Col>
            <Col span={22}>
              <ul>
                {events.map((item, i) => {
                  return <li key={`event_${i}`}>{i + 1}. {item.text}</li>;
                })}
              </ul>

            </Col>
          </Row>}
        {!_.isEmpty(knowledge) &&
          <Row style={styles.itemPadding}>
            <Col span={2}>
              <strong>命理知识：</strong>
            </Col>
            <Col span={22}>
              <ul>
                <li>{knowledge}</li>
              </ul>
            </Col>
          </Row>}
        {!_.isEmpty(notes) &&
          <Row style={styles.itemPadding}>
            <Col span={24}>
              <strong>后续追加：</strong>
            </Col>
          </Row>}
        {!_.isEmpty(notes) &&
          <Row style={styles.itemPadding}>
            <Col span={20} offset={4}>
              <Timeline
                style={{ marginTop: 5 }}
                className="articleDetial"
                pending={<a href="#">更多</a>}
              >
                {notes.map((note, i) => (
                  <Timeline.Item
                    key={`note_${i}`}
                    dot={
                      <span>
                        <span style={{ paddingRight: 7 }}>
                          {moment(note.createdAt).fromNow()}
                        </span>
                        <Icon
                          type="clock-circle-o"
                          style={{ fontSize: "16px" }}
                        />
                      </span>
                    }
                  >
                    {note.text}
                  </Timeline.Item>
                ))}
              </Timeline>
            </Col>
          </Row>}

        {affix &&
          showAffix &&
          <Affix offsetBottom={50} style={{ textAlign: "right" }}>
            <Button type="primary" onClick={this.affixHandler}>
              收起
            </Button>
          </Affix>}
        {affix &&
          !showAffix &&
          <div style={{ textAlign: "right" }}>
            <a onClick={this.affixHandler} className="meta-item">
              <Icon type="up-circle-o" style={{ marginRight: 2 }} />收起
            </a>
          </div>}

        <Modal
          width="auto"
          closable={true}
          style={{ top: 1, left: 1 }}
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

ArticleDetail.propTypes = {
  affix: PropTypes.bool,
  affixHandler: PropTypes.func
};

export const DetailContainer = Relay.createContainer(ArticleDetail, {
  fragments: {
    node: () => Relay.QL`
        fragment on Article {
          id,
          attachments,
          title,
          categories,
          name,
          education,
          gender,
          birthday,
          homePlace {
            province,
            city,
            area
          },
          jobs,
          marriage,
          children,
          events {
            text,
            createdAt,
          },
          knowledge,
          notes {
            text,
            createdAt,
          },
          createdAt
        }
      `
  }
});
