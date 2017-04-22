import React, { PureComponent } from "react";
import { Row, Col, Pagination, Affix } from "antd";

import ArticleItem from "./ArticleItem";

const styles = {
  affixed: {
    background: "rgb(239, 231, 217)",
    paddingTop: 10,
    paddingBottom: 5
  },
  normal: {
    paddingTop: 30
  },
  zeroArticle: {
    paddingTop: 330
  }
};
export default class FilteredList extends PureComponent {
  props: {
    articles: { totalInfo: Object, edges: Object[] },
    goPage: (page: number, pageSize: number) => void
  };
  state: {
    affixed: boolean
  };
  constructor(props: any) {
    super(props);
    this.state = {
      affixed: false
    };
  }
  changeHandler(page, pageSize) {
    // console.log(page, pageSize);
    this.props.goPage(page, pageSize);
  }
  onAffixChange(affixed) {
    this.setState({
      affixed: affixed
    });
  }
  render() {
    const { viewer: { articles: { totalInfo, edges } } } = this.props;
    const { affixed } = this.state;
    return (
      <section className="filter-list">
        {edges.map(edge => {
          return (
            <ArticleItem
              key={edge.node.id}
              article={edge.node}
              deleteArticle={this.props.deleteArticle}
            />
          );
        })}
        <Affix offsetBottom={2} onChange={this.onAffixChange.bind(this)}>
          <Row
            style={
              affixed
                ? styles.affixed
                : edges.length > 0 ? styles.normal : styles.zeroArticle
            }
            type="flex"
            justify="center"
          >
            <Col>
              {/* <Button size="large" loading={true} type="primary" style={{width: '100%'}}>加载更多</Button> */}

              <Pagination
                showQuickJumper
                current={totalInfo.currentPage}
                total={totalInfo.total}
                showSizeChanger
                onChange={this.changeHandler.bind(this)}
                onShowSizeChange={this.changeHandler.bind(this)}
                showTotal={total => `总共 ${total} 条案例`}
              />

            </Col>
          </Row>
        </Affix>
      </section>
    );
  }
}
