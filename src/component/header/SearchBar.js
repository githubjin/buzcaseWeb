// @flow

import React from "react";
import { Input, Tag } from "antd";
const Search = Input.Search;
import { Link } from "react-router-dom";
import Relay from "react-relay";
import MasterQueryConfig from "../../queryConfig";
import RelayLoading from "../RelayLoading";
import styled from "styled-components";
import _ from "lodash";
import moment from "moment";
const Background = styled.div`
  width: 100%;
  height: 100%;
  z-index: 998;
  position: absolute;
  top: 47px;
  left: 0px;
`;
const ResultBox = styled.div`
  background: #fff;
  width: 489px;
  height: auto;
  position: absolute;
  z-index: 999;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  background-clip: padding-box;
  display: flex;
  flex-direction: column;
  padding-bottom: 5px;
  top: 47px;
`;
const ItemBox = styled.div`
  display: flex;
  flex-direction: column;
`;
const ResultItem = styled.div`
  padding: 1px;
  line-height: 30px;
  padding-left: 5px;
`;
const ResultTitle = styled.div`
  line-height: 20px;
  padding-left: 5px;
  background: #e9e9e9;
  font-size: 14px;
`;
const Timer = styled.span`
    float: right;
    font-size: 12px;
    float: right;
    font-size: 12px;
    margin-right: 5px;
    font-weight: 500;
`;
class Complete extends React.PureComponent {
  handleChange: (value: string) => void;
  loading: boolean;
  state: {
    isVisible: boolean
  };
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.loading = false;
    this.state = {
      isVisible: false
    };
  }

  handleChange(value) {
    this.setState({ isVisible: true });
    this.props.relay.setVariables(
      {
        token: value
      },
      this.onReadyStateChange
    );
  }
  backgroundClick = e => {
    this.setState({ isVisible: false });
  };
  onReadyStateChange = (readyState: Object) => {
    var { done } = readyState;
    if (!done) {
      this.loading = true;
    } else {
      this.loading = false;
    }
  };
  createMarkup = (htmlString: string) => {
    return { __html: htmlString };
  };

  renderHightLight = (htmlString: string) => {
    // console.log(htmlString);
    return <span dangerouslySetInnerHTML={this.createMarkup(htmlString)} />;
  };
  renderOption = (items, field, title): any => {
    // console.log(items);
    if (_.isEmpty(items)) {
      return null;
    }
    // console.log("items are", JSON.stringify(items));
    return (
      <ItemBox>
        <ResultTitle>{title}</ResultTitle>
        {items.map(item => (
          <ResultItem key={item.article}>
            <Tag style={{ fontSize: 14 }}>
              <Link to={`/detail/${item.article}`}>
                {this.renderHightLight(item[field])}
              </Link>
            </Tag>
            <Timer>
              {moment(item.createdAt, "YYYY-MM-DD hh:mm").fromNow()}
            </Timer>
          </ResultItem>
        ))}
      </ItemBox>
    );
  };
  // shouldComponentUpdate(nextProps, nextState) {
  //   const {
  //     viewer: { autocomplete: { names = [], titles = [] } = {} }
  //   } = this.props;
  //   const {
  //     viewer: {
  //       autocomplete: { names: namesNext = [], titles: titlesNext = [] } = {}
  //     }
  //   } = nextProps;
  //   return (
  //     names.length !== namesNext.length || titles.length !== titlesNext.length
  //   );
  // console.log(names, titles);
  // console.log("-------------");
  // console.log(namesNext, titlesNext);
  // return true;
  // }
  render() {
    // console.log("e.keyCode is ", e.keyCode, e.target.value);
    const {
      viewer: { autocomplete: { names = [], titles = [] } = {} }
    } = this.props;
    // console.log(this.props.viewer);
    const isVisible =
      this.state.isVisible && (names.length > 0 || titles.length > 0);
    return (
      <div style={{ width: 367 }}>
        <Search
          size="large"
          placeholder="搜索姓名或标题"
          onClick={e => {
            this.handleChange(e.target.value);
          }}
          onKeyUp={e => {
            if (
              e.keyCode === 32 ||
              e.keyCode === 8 ||
              (e.keyCode > 47 && e.keyCode < 58)
            ) {
              this.handleChange(e.target.value);
            }
          }}
          onSearch={this.handleChange}
        />
        {isVisible && <Background onClick={this.backgroundClick} />}
        {isVisible &&
          <ResultBox>
            {this.renderOption(names, "name", "姓名")}
            {this.renderOption(titles, "title", "标题")}
          </ResultBox>}
      </div>
    );
  }
}

const Container = Relay.createContainer(Complete, {
  initialVariables: { token: "", size: 50, skip: false },
  prepareVariables: prevVariables => {
    return {
      ...prevVariables,
      skip: prevVariables.token === ""
    };
  },
  fragments: {
    viewer: () => Relay.QL`
    fragment on User {
      autocomplete(token: $token, size:$size) @skip(if: $skip) {
        names {
          article
          name
          title
          highlight
          createdAt
        }
        titles {
          article
          name
          title
          highlight
          createdAt
        }
      }
    }
    `
  }
});

export default (props: any) => {
  return (
    <RelayLoading route={new MasterQueryConfig()} forceFetch={true}>
      <Container />
    </RelayLoading>
  );
};
