// @flow

import React, { Component, PropTypes } from "react";
import {
  Affix,
  Button,
  Row,
  Col,
  Modal,
  Icon,
  Timeline,
  Popconfirm
} from "antd";
import Slider from "react-slick";
import _ from "lodash";
import Relay from "react-relay";
import moment from "moment";
// import "moment/locale/zh-cn";

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
    height: 300,
    margin: "0 auto",
    maxWidth: 960
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
  },
  itemInHome: {
    borderTop: "1px solid rgba(221, 221, 221, 0.3)",
    marginTop: 30,
    paddingTop: 5
  },
  itemInPage: {
    paddingTop: 1
  },
  empty: {
    width: "100%",
    display: "inline-block"
  },
  focusNote: {
    color: "#f04134",
    width: "100%",
    display: "inline-block"
  },
  note_del_bnt: {
    backgroundColor: "rgb(255, 255, 255)",
    boxShadow: "none",
    borderRightColor: "rgb(255, 255, 255)"
  }
};

const settings = {
  autoplay: true,
  draggable: false,
  touchMove: false,
  dots: true,
  dotsClass: "slick-dots slick-thumb",
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1
};

export default class ArticleDetail extends Component {
  props: ArticleProps;
  state: {
    previewVisible: boolean,
    previewImage: string,
    showAffix: boolean,
    focusNote: ?string
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
      showAffix: false,
      focusNote: null
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
      previewVisible: false,
      previewImage: ""
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
    return _.startsWith(url, "https") ? url : url.replace("http", "https");
  }
  renderImages(attachments: string[], attachments_maxw: string[]) {
    if (_.isEmpty(attachments)) {
      return null;
    }
    // console.log("attachments : ", attachments.length, attachments);
    return (
      <Slider {...settings}>
        {attachments.map((item, i) => {
          return (
            <div
              key={`img_detail_${i}`}
              onClick={this.showPic(attachments_maxw[i])}
            >
              <img
                style={styles.img}
                src={this.getSliderImage(item)}
                alt="命盘"
              />
            </div>
          );
        })}
      </Slider>
    );
  }
  noteFocus = (noteId: string) => {
    return () => {
      this.setState({
        focusNote: noteId
      });
    };
  };
  renderNameAndTitle = () => {
    const article = this.props.article || this.props.node;
    const { name, title, gender, homePlace, birthday, categories } = article;
    return (
      <div style={{ marginTop: 30 }}>
        <Row
          style={{
            ...styles.itemPadding,
            ...{
              borderTop: "1px solid rgba(221, 221, 221, 0.3)",
              paddingTop: 5
            }
          }}
        >
          <Col span={2}><strong>标题：</strong> </Col>
          <Col span={10}>{title}</Col>
          <Col span={2}><strong>类型：</strong> </Col>
          <Col span={10}>{categories.join(" · ")}</Col>
        </Row>
        <Row style={{ ...styles.itemPadding, ...{ paddingTop: 1 } }}>
          <Col span={2}><strong>姓名：</strong> </Col>
          <Col span={10}>{name}</Col>
          <Col span={2}><strong>性别：</strong> </Col>
          <Col span={10}>{gender}</Col>
        </Row>
        <Row style={{ ...styles.itemPadding, ...{ paddingTop: 1 } }}>
          <Col span={2}><strong>出生日期：</strong> </Col>
          <Col span={10}>{moment(birthday).format("YYYY-MM-DD hh:mm")}</Col>
          <Col span={2}><strong>出生地点：</strong> </Col>
          <Col
            span={10}
          >{`${homePlace.province}${homePlace.city}${homePlace.area}`}</Col>
        </Row>
      </div>
    );
  };
  render() {
    const {
      affix = false,
      removeNote = () => () => {},
      showAll = false
    } = this.props;
    const article = this.props.article || this.props.node;
    const {
      attachments_h300: attachments,
      attachments_maxw,
      education,
      jobs,
      marriage,
      children,
      _events: events,
      knowledge,
      notes
    } = article;
    const hasNotes = !_.isEmpty(notes.edges);
    // console.log(hasNotes, JSON.stringify(notes));
    const { previewVisible, previewImage, showAffix } = this.state;
    return (
      <div
        ref={node => {
          this.container = node;
        }}
        style={{ marginTop: 10, fontSize: 14, lineHeight: 1.7, color: "#000" }}
      >
        {this.renderImages(attachments, attachments_maxw)}
        {showAll && this.renderNameAndTitle()}
        <Row
          style={{
            ...styles.itemPadding,
            ...(showAll ? styles.itemInPage : styles.itemInHome)
          }}
        >
          <Col span={2}><strong>学历：</strong> </Col>
          <Col span={10}>{education}</Col>
          <Col span={2}><strong>职业：</strong> </Col>
          <Col span={10}>{!_.isEmpty(jobs) && jobs.join(" · ")}</Col>
        </Row>
        <Row style={{ ...styles.itemPadding, ...{ paddingTop: 1 } }}>
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
                {events.edges.map((item, i) => {
                  return <li key={`event_${i}`}>{i + 1}. {item.node.text}</li>;
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
        {hasNotes &&
          <Row style={styles.itemPadding}>
            <Col span={24}>
              <strong>后续追加：</strong>
            </Col>
          </Row>}
        {hasNotes &&
          <Row style={styles.itemPadding}>
            <Col span={22} offset={2}>
              <Timeline
                style={{ marginTop: 5 }}
                className="articleDetial"
                pending={<a />}
              >
                {notes.edges.map((note, i) => (
                  <Timeline.Item
                    key={note.node.id}
                    dot={
                      <span>
                        <span style={{ paddingRight: 7, color: "#a0a0a0" }}>
                          {moment(note.node.createdAt).fromNow()}
                        </span>
                        <Icon
                          type="clock-circle-o"
                          style={{ fontSize: "16px", color: "#a0a0a0" }}
                        />
                      </span>
                    }
                  >
                    <span
                      style={
                        note.node.id === this.state.focusNote
                          ? styles.focusNote
                          : styles.empty
                      }
                    >
                      {note.node.text}
                      {this.props.node &&
                        <Popconfirm
                          title="你确定要删除该条备注吗？"
                          okText="是"
                          cancelText="否"
                          onConfirm={removeNote(note.node.id)}
                        >
                          <Button
                            style={{ float: "right" }}
                            icon="delete"
                            shape="circle"
                            ghost
                            size="small"
                            type="danger"
                            onMouseLeave={() => {
                              this.setState({ focusNote: null });
                            }}
                            onMouseEnter={this.noteFocus(note.node.id)}
                          />
                        </Popconfirm>}
                    </span>
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
          style={{ maxWidth: 830, textAlign: "center" }}
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img
            alt="example"
            style={{ width: "auto" }}
            src={this.getSliderImage(previewImage)}
          />
        </Modal>
      </div>
    );
  }
}

ArticleDetail.propTypes = {
  affix: PropTypes.bool,
  affixHandler: PropTypes.func,
  showAll: PropTypes.bool
};

export const DetailContainer = Relay.createContainer(ArticleDetail, {
  initialVariables: {
    width: window.innerWidth > 800 ? 800 : window.innerWidth,
    eventFirst: 10
  },
  fragments: {
    node: () => Relay.QL`
        fragment on Article {
          id,
          attachments_h300,
          attachments_maxw(width: $width),
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
          _events:events(first: $eventFirst) {
            edges {
              node {
                id,
                text,
                createdAt,
              }
            }
          },
          knowledge,
          notes(first: 10) {
            edges {
              node {
                id,
                text,
                createdAt,
              }
            }
          },
          createdAt
        }
      `
  }
});
