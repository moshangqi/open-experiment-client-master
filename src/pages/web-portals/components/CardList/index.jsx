import React from 'react';
import {List, Skeleton, Pagination } from 'antd';
import { withRouter} from 'react-router-dom';
import styles from './style.less';
import moment from 'moment';

class CardList extends React.Component {

  state = {
    current: 1,
    pagesize: 5,
  }

  getPassage = (id) => {
    const { type, history } = this.props;
    history.push(`/passage?id=${id}&type=${type}`)
  }
  render(){
    const {list} = this.props;
    const { current, pagesize } = this.state;
    return <List
    className="demo-loadmore-list"
    loading={false}
    itemLayout="horizontal"
    // loadMore={loadMore}
    dataSource={list}
    renderItem={ ( item, index ) => { 
      if( index >= pagesize * (current-1) && index < pagesize* current) {
        return(
          <List.Item
            // actions={[<span>2020-11-06</span>]}
            className={styles.listItem}
            onClick = {()=>{this.getPassage(item.id)}}
          >
            {/* <Skeleton avatar title={false} loading={item.loading} active> */}
              {/* <List.Item.Meta
                title={<a href="https://ant.design">{item.name.last}</a>}
                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              /> */}
              <div>{item.title.substr(0,25)+'...'}</div>
              <span>{moment(parseInt(item.publishTime)).format('YYYY/MM/DD')}</span>
            {/* </Skeleton> */}
          </List.Item>
        )
      } else {
        return <React.Fragment></React.Fragment>
      }
     }}
    footer = {
      <div className={styles.pageRow}>
        <Pagination style={{width:'186px'}} onChange = {e=> {
          this.setState({
            current: e
          })
        }} simple current={current} total={list.length} defaultPageSize = {pagesize} />
      </div>}
  />
  }
}

export default withRouter(CardList)