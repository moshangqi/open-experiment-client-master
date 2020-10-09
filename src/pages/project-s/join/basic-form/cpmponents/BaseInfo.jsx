import React from 'react';
import { RouteContext } from '@ant-design/pro-layout';
import { Descriptions } from 'antd';
import { experimentType, suggestGroupType, majorCollege, major } from '@/utils/constant';
import moment from 'moment';
import { isEmpty } from '@/utils/utils';
export default ({ detail }) => {
  if (isEmpty(detail)) {
    return <div></div>;
  }
  return (
    <Descriptions size="small" column={3}>
      <Descriptions.Item label="创建人">
        {detail.list.find(item => item.code === detail.creatorId).realName}
      </Descriptions.Item>
      <Descriptions.Item label="开放实验室">{detail.labName}</Descriptions.Item>
      <Descriptions.Item label="地点">{detail.address}</Descriptions.Item>
      <Descriptions.Item label="实验类型">
        {experimentType[detail.experimentType]}
      </Descriptions.Item>
      <Descriptions.Item label="实验时间">{`${moment(detail.startTime).format(
        'YYYY-MM-DD',
      )}~${moment(detail.startTime).format('YYYY-MM-DD')}`}</Descriptions.Item>
      <Descriptions.Item label="项目级别">
        {detail.projectType === 1 ? '普通' : '重点'}
      </Descriptions.Item>
      <Descriptions.Item label="建议审分组">
        {suggestGroupType[detail.suggestGroupType]}
      </Descriptions.Item>
      <Descriptions.Item label="适应专业">
        {detail.limitMajor === null
          ? '不限专业'
          : JSON.parse(detail.limitMajor)
              .map(item => {
                return major.find(i => i.mId === item).mName;
              })
              .join('、')}
      </Descriptions.Item>
      <Descriptions.Item label="限选学院">
        {detail.limitCollege === null
          ? '不限学院'
          : JSON.parse(detail.limitCollege)
              .map(item => {
                return majorCollege[item - 1].cName;
              })
              .join('、')}
      </Descriptions.Item>
      <Descriptions.Item label="限选年级">
        {detail.limitGrade === null
          ? '不限年级'
          : JSON.parse(detail.limitGrade)
              .map(item => {
                return item + '级';
              })
              .join('、')}
      </Descriptions.Item>
      <Descriptions.Item label="适宜学生数">{detail.fitPeopleNum}</Descriptions.Item>
      <Descriptions.Item label="成果及考核方式">{detail.achievementCheck}</Descriptions.Item>
      <Descriptions.Item label="计划实验小时">{detail.totalHours}</Descriptions.Item>
      <Descriptions.Item label="开放实验条件">{detail.experimentCondition}</Descriptions.Item>
    </Descriptions>
  );
};
