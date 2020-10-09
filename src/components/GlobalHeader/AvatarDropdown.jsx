import { Avatar, Icon, Menu, Spin, Badge } from 'antd';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import userImg from '@/assets/user.png';

class AvatarDropdown extends React.Component {
  onMenuClick = event => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    }
    if (key === 'center') {
      router.push(`/selfInformation/edit`);
      return;
    }

    router.push(`/account/${key}`);
  };

  render() {
    const {
      currentUser = {
        avatar: '',
        name: '',
      },
      userInfo = {
        avatar: '',
        realName: '',
      },
      menu,
      message,
    } = this.props;

    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <Icon type="user" />
            个人信息
          </Menu.Item>
        )}
        {/* {menu && (
          <Menu.Item key="settings">
            <Icon type="setting" />
            个人设置
          </Menu.Item>
        )} */}
        {menu && <Menu.Divider />}

        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>

        {menu && <Menu.Divider />}

        <Menu.Item key="message">
          {message ? (
            <Badge dot>
              <Icon type="message" />
              通知信息
            </Badge>
          ) : (
            <div>
              <Icon type="message" />
              通知信息
            </div>
          )}
        </Menu.Item>
      </Menu>
    );
    return (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={userImg} alt="avatar" />
          <span className={styles.name}>{currentUser.realName}</span>
        </span>
      </HeaderDropdown>
    );
    // return currentUser && currentUser.realName ? (
    //   <HeaderDropdown overlay={menuHeaderDropdown}>
    //     <span className={`${styles.action} ${styles.account}`}>
    //       <Avatar size="small" className={styles.avatar} style={{color:'green',backgroundColor:'green'}} src={currentUser.avatar} alt="avatar" />
    //       <span className={styles.name}>{currentUser.realName}</span>
    //     </span>
    //   </HeaderDropdown>
    // ) : (
    //   <Spin
    //     size="small"
    //     style={{
    //       marginLeft: 8,
    //       marginRight: 8,
    //     }}
    //   />
    // );
  }
}

export default connect(({ user, openProjects }) => ({
  currentUser: user.currentUser,
  userInfo: user.userInfo,
  message: openProjects.messageLength,
}))(AvatarDropdown);
