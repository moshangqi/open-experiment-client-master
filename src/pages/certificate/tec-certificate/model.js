import {openWays,closeWays,emptyWays,downloadWays} from "@/pages/certificate/tec-certificate/service";
import { message } from 'antd';
import {myApplication} from "@/pages/certificate/stu-certificate/service";

const Model = {
  namespace: 'tecCertificate',
  state:{

  },
  effects: {

    *openApply({ payload}, { call}) {
      const response = yield call(openWays, payload);
      console.log(response);
      if(response.code===0) {
        message.success('开启申领通道成功');
      }
      else{
        message.error('开启出错'+response.msg)
      }
    },

    *closeApply({ payload}, { call}) {
      const response = yield call(closeWays, payload);
      console.log(response);
      if(response.code===0) {
        message.success('关闭申领通道成功');
      }
      else{
        message.error('关闭出错'+response.msg)
      }
    },

    *emptyTheTable({ payload}, { call}) {
      const response = yield call(emptyWays, payload);
      console.log(response);
      if(response.code===0) {
        message.success('清空所有申领数据成功');
      }
      else{
        message.error('清空出错'+response.msg)
      }
    },

    *downloadList({ payload }, { call}) {
      const response = yield call(downloadWays, payload);
      console.log(response);
      const blob = new Blob([response],{type: "application/vnd.ms-excel"});
      const fileName = '申领数据.xls';
      if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href);// 释放URL 对象
        document.body.removeChild(elink)
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }
    },

    // *downloadList({ payload, callback }, { call }) {
    //   const response = yield call(downloadWays, payload);
    //   console.log(response);
    //   const fileName='申领数据';
    //   const blob=new Blob([response]);//创建blob对象
    //   const aLink=document.createElement('a');//创建a链接
    //   aLink.style.display='none';
    //   aLink.href=blob;
    //   aLink.download=fileName;
    //   document.body.appendChild(aLink);
    //   aLink.click();
    //   document.body.removeChild(aLink);//点击完成后记得删除创建的链接

    //},

  },



};
export default Model;
