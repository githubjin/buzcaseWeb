import React from 'react';
import { Spin, Alert } from 'antd';

export default (props) => {
  return (
    <Spin tip="数据加载中...">
      <Alert
        message="Alert message title"
        description="Further details about the context of this alert."
        type="info"
      />
    </Spin>
  );
}
