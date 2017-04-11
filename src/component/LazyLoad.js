import React, { Component, PropTypes } from 'react';

export default class LazyLoad extends Component {
  static propTypes = {
      loader: PropTypes.element,
      AsyncModule: PropTypes.object,
  }
  state = {
    AsyncModule: null,
  }
  componentDidMount() {
    this.props.getComponent()
      .then(module => module.default)
      .then(AsyncModule => this.setState({AsyncModule}));
  }
  render() {
    const { loader, ...childProps } = this.props;
    const { AsyncModule } = this.state;

    if(AsyncModule) {
      return (<AsyncModule {...childProps} />);
    }

    if(loader) {
      const Loader = loader;
      return (<Loader />);
    }

    return null;
  }
}
