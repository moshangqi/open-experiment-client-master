import React, { Component } from 'react';
import { Descriptions, Card, Divider, Table } from 'antd';
import { memberRole, majorCollege, major, myMajor } from '@/utils/constant';
class Member extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  columns = [
    {
      title: '姓名',
      dataIndex: 'realName',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render(sex) {
        return sex === '1' ? '男' : '女';
      },
    },
    {
      title: '学号/工号',
      dataIndex: 'code',
    },
    {
      title: '学院',
      dataIndex: 'institute',
      render(c) {
        return (majorCollege.find(item => item.cId == c) || {}).cName; //修改完毕
      },
    },
    {
      title: '联系电话',
      dataIndex: 'mobilePhone',
    },
    {
      title: 'QQ号',
      dataIndex: 'qqNum',
    },
    {
      title: '专业',
      dataIndex: 'major',
      render: (m, record) => {
        return m === null
          ? '\\'
          : ((myMajor[record.institute] || []).find(item => item.mId == m) || {}).mName; //修改完毕
      },
    },
    {
      title: '年级',
      render: m => {
        return m.memberRole === 1 ? '\\' : m.grade + '级';
      },
    },
    {
      title: '项目角色',
      dataIndex: 'memberRole',
      render: role => {
        return memberRole[role];
      },
    },
  ];
  render() {
    const { memberList } = this.props;
    return (
      <Card
        title="人员信息"
        style={{
          marginBottom: 24,
        }}
        bordered={false}
      >
        <Table
          dataSource={memberList}
          columns={this.columns}
          pagination={false}
          rowKey={(history, index) => index}
        ></Table>
        {/* <Card style={{ marginBottom: 20 }} type="inner" title="指导老师" bordered={false}>
          {memberList
            .filter(item => item.memberRole === 1)
            .map((item, key) => {
              return (
                <div key={key}>
                  <Descriptions
                    style={{
                      marginBottom: 16,
                    }}
                  >
                    <Descriptions.Item label="姓名">{item.realName}</Descriptions.Item>
                    <Descriptions.Item label="电话">{item.mobilePhone}</Descriptions.Item>
                    <Descriptions.Item label="QQ">{item.qqNum}</Descriptions.Item>
                    <Descriptions.Item label="所属学院">{item.major}</Descriptions.Item>
                    <Descriptions.Item label="员工号">{item.code}</Descriptions.Item>
                    <Descriptions.Item label="职称">{item.realName}</Descriptions.Item>
                  </Descriptions>
                  <Divider
                    style={{
                      margin: '16px 0',
                    }}
                  />
                </div>
              );
            })}
        </Card>
        <Card type="inner" title="学生" bordered={false}>
          {memberList
            .filter(item => item.memberRole !== 1)
            .map((item, key) => {
              return (
                <div key={key}>
                  <Descriptions
                    style={{
                      marginBottom: 16,
                    }}
                  >
                    <Descriptions.Item label="姓名">{item.realName}</Descriptions.Item>
                    <Descriptions.Item label="电话">{item.mobilePhone}</Descriptions.Item>
                    <Descriptions.Item label="email">{item.qqNum}</Descriptions.Item>
                    <Descriptions.Item label="所属学院">{item.major}</Descriptions.Item>
                    <Descriptions.Item label="描述">
                      这段描述很长很长很长很长很长很长很长很长很长很长很长很长很长很长...
                    </Descriptions.Item>
                  </Descriptions>
                  <Divider
                    style={{
                      margin: '16px 0',
                    }}
                  />
                </div>
              );
            })}
        </Card> */}
      </Card>
    );
  }
}

export default Member;
