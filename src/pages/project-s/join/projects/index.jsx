import React, { Component } from 'react';
import { connect } from 'dva';
import OpenProjects from '@/pages/common/OpenProjects'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
class Projects extends Component {
  render() {
  
    return (
      <PageHeaderWrapper>
        <OpenProjects/>
      </PageHeaderWrapper>
        
    );
  }
}

export default Projects;
