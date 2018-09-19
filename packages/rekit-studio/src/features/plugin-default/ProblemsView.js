import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Badge } from 'antd';
import * as actions from './redux/actions';
import { SvgIcon } from '../common';

export class ProblemsView extends Component {
  static propTypes = {
    problems: PropTypes.object.isRequired,
    elementById: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  state = {
    closedFiles: {},
  };

  toggleCollapse = (file) => {
    this.setState({
      closedFiles: {
        ...this.state.closedFiles,
        [file]: !this.state.closedFiles[file],
      },
    });
  }

  renderFileProblem(file, msgs) {
    const byId = id => this.props.elementById[id];
    let ele = byId(file);
    if (ele.owner) ele = byId(ele.owner);
    if (ele.target) ele = byId(ele.target);

    const isClosed = this.state.closedFiles[file];

    return (
      <dl key={file} className={isClosed ? 'file-closed' : ''}>
        <dt onClick={() => this.toggleCollapse(file)}>
          <SvgIcon type={isClosed ? "anticon-caret-right" : 'anticon-caret-down'} size={8} fill="#aaa" className="error-switcher" />
          <SvgIcon type={ele.icon} size={12} fill={ele.iconColor} />
          {ele.name} <span className="full-path">{file}</span>
          <Badge count={msgs.length} />
        </dt>
        {msgs.map(msg => (
          <dd key={`${msg.ruleId}-${msg.line}-${msg.column}`}>
            <SvgIcon type="error" theme="filled" size={11} fill="#ef5350" />
            <span class="problem-source">[eslint]</span>
            <span class="problem-message" title={msg.message}>{msg.message}</span>
            <span class="source-pos">({msg.line}, {msg.column})</span>
          </dd>
        ))}
      </dl>
    );
  }

  render() {
    const { problems } = this.props;
    return (
      <div className="plugin-default-problems-view">
        {Object.keys(problems)
          .filter(k => !_.isEmpty(problems[k]))
          .map(k => this.renderFileProblem(k, problems[k]))}
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    problems: state.pluginDefault.problems,
    elementById: state.home.elementById,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProblemsView);
