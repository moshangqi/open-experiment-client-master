import React from 'react';

class Footer extends React.Component {
  render() {
    return (
      <div
        style={{
          margin: '46px 0',
          padding: '0 16px',
          color: 'rgba(0, 0, 0, 0.45)',
          fontSize: '12px',
          letterSpacing: '0.05rem',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>实验室与设备管理处</div>
        <div style={{ textAlign: 'center' }}>Copyright 创数据技术团队出品</div>
      </div>
    );
  }
}

export default Footer;
