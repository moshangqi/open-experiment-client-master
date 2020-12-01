import React,{Component, Fragment} from 'react';
import { Pagination } from 'antd';
import styles from './style.less';
import {withRouter} from 'react-router-dom';
import {majorCollege, experimentType} from '../../../../utils/constant';

class MyTable extends Component {

  state = {
    current: 1,
    pagesize: 5,
  }

  getPassage = (id) => {
    const {history} = this.props;
    history.push(`/passage?id=${id}&type=3`)
  }

  render(){
    const {list} = this.props;
    const { current, pagesize} = this.state;
    // console.log(list)
    return(
      <div className={styles.table}>
        <div className={styles.tableHeaderGroup}>
          <div className={styles.tableRow}>
            <div className={`${styles.tableCell} ${styles.tableId}`}>序号</div>
            <div className={`${styles.tableCell} ${styles.tableCompany}`}>项目单位</div>
            <div className={`${styles.tableCell} ${styles.tableName}`}>项目名称</div>
            <div className={`${styles.tableCell} ${styles.tableType}`}>项目类型</div>
          </div>
        </div>
        <div className={styles.tableRowGroup}>
          {
            list.map((item,index)=>{
              if( index >= pagesize * (current-1) && index < pagesize* current) {
                return (
                  <div key={item.id} className={styles.tableRow} onClick={()=>{this.getPassage(item.id)}}>
                    <div className={`${styles.tableCell} ${styles.tableId}`}>{index+1}</div>
                    <div className={`${styles.tableCell} ${styles.tableCompany}`}>
                    {/* majorCollege[parseInt(item.subordinateCollege)-1]['cName'] */}
                      { (majorCollege.find( cItem => cItem.cId == item.subordinateCollege) || {} ).cName }</div>
                    <div className={`${styles.tableCell} ${styles.tableName}`}>{item.projectName}</div>
                    <div className={`${styles.tableCell} ${styles.tableType}`}>{experimentType[item.projectType]}</div>
                  </div>
                )
              }else {
                return <Fragment></Fragment>
              }
            })
          }
        </div>
        <div className={styles.pagination}>
          <Pagination onChange = {e=> 
            {this.setState({
              current: e
            })}} 
          simple current={current} total={list.length} defaultPageSize = {pagesize} style={{width: '200px'}}/>
        </div>
      </div>
    )
  }
}

export default withRouter(MyTable);