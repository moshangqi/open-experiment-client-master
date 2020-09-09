import { Card, Radio } from 'antd';
import React from 'react';
import { Pie } from './Charts';
import Yuan from '../utils/Yuan';
import styles from '../style.less';

const ProportionSales = ({
  dropdownGroup,
  salesType,
  loading,
  salesPieData,
  handleChangeSalesType,
}) => (
  <Card
    loading={loading}
    className={styles.salesCard}
    bordered={false}
    title="各类项目申报占比"
    style={{
      height: '100%',
    }}
    extra={
      <div className={styles.salesCardExtra}>
        {dropdownGroup}
        <div className={styles.salesTypeRadio}>
          <Radio.Group value={salesType} onChange={handleChangeSalesType}>
            <Radio.Button value="all">已申报</Radio.Button>
            <Radio.Button value="online">已立项</Radio.Button>
            <Radio.Button value="stores">已驳回</Radio.Button>
          </Radio.Group>
        </div>
      </div>
    }
  >
    <div>
      <h4
        style={{
          marginTop: 8,
          marginBottom: 32,
        }}
      >
        项目数量
      </h4>
      <Pie
        hasLegend
        subTitle="项目数量"
        total={() => salesPieData.reduce((pre, now) => now.y + pre, 0)+'个'}
        data={salesPieData}
        valueFormat={value =>value+'个'}
        height={248}
        lineWidth={4}
      />
    </div>
  </Card>
);

export default ProportionSales;
