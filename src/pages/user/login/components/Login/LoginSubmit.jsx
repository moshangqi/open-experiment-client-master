import { Button, Form } from 'antd';
import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

const FormItem = Form.Item;

const LoginSubmit = ({ className, ...rest }) => {
  const clsString = classNames(styles.submit, className);
  return (
    <FormItem>
      <Button  className={clsString} type="primary" htmlType="submit" onClick={()=>{console.log('a')}} {...rest} />
    </FormItem>
  );
};

export default LoginSubmit;
