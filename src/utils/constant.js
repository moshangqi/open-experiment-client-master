export const experimentType = {
  '1': '科研',
  '2': '科技活动',
  '3': '自选课题',
  '4': '计算机应用',
  '5': '人文素质',
};
export const openType = {
  '1': '公开',
  '2': '不公开',
  '3': '部分公开',
};
export const suggestGroupType = {
  '1': 'A组-石工地勘',
  '2': 'B组-化工材料',
  '3': 'C组-机械力学',
  '6': 'D组-电气及制作',
  '4': 'E组-软件与数学',
  '5': 'F组-经管法艺体人文',
};
export const operationType = {
  '0': '上报拒绝',
  '1': '同意',
  '2': '审核拒绝',
  '3': '上报',
  '4': '修改',
  '5': '线下检查通过',
  '6': '结题审核通过',
  '7': '线下检查不通过',
  '8': '结题审核不通过',
  '9': '中期退回',
  '10': '中期复核通过',
  '11': '学院结题审核退回',
  '12': '学院复核通过',
  '13': '学院结题审核通过',
  '14': '职能部门审核退回',
  '15': '职能部门复核通过',
  '16': '职能部门结题通过',
};

export const AchievementType = {
  '1': '发明专利',
  '2': '实用新型专利',
  '3': '论文',
  '4': '竞赛获奖',
  '5': '自研自制设备',
  '6': '其他',
};

export const roleNames = {
  '0': '超级管理员',
  '1': '学生',
  '2': '项目组长',
  '3': '指导老师',
  '4': '实验室主任',
  '5': '二级单位',
  '6': '职能部门',
  '7': '职能部门领导',
  '9': '学院结题审核人',
  '10': '研究生',
  '11': '学院立项评审老师',
};
export const memberRole = {
  '1': '指导老师',
  '2': '组长',
  '3': '普通成员',
};
export const operationUnit = {
  '9': '学院结题审核人',
  '3': '指导老师',
  '4': '实验室主任',
  '5': '二级单位',
  '6': '职能部门',
};
export const grade = [2016, 2017, 2018, 2019];

export const statusType = {
  '-7': '职能部门结题审核退回修改',
  '-6': '学院结题审核退回修改',
  '-5': '中期打回修改',
  '-4': '重点申请',
  '-3': '项目已被终止',
  '-2': '驳回修改',
  '-1': '待指导老师确认',
  '0': '实验室待审核',
  '1': '拟题审核通过', //'实验室待上报',
  '2': '实验室已上报',
  '3': '二级单位待上报',
  '4': '二级单位已上报',
  '5': '职能部门审核通过，立项',
  '6': '学院结题提交',
  '7': '项目结题',
};
export const funds = ['500', '2500', '3000', '5000'];
export const majorCollege = [
  {
    cId: '1',
    cName: '石油与天然气工程学院',
    majors: [
      {
        mId: '1',
        mName: '石油工程',
      },
      {
        mId: '2',
        mName: '油气储运工程',
      },
      {
        mId: '3',
        mName: '海洋油气工程',
      },
    ],
  },
  {
    cId: '2',
    cName: '地球科学与技术学院',
    majors: [
      {
        mId: '4',
        mName: '资源勘查工程',
      },
      {
        mId: '5',
        mName: '勘查技术与工程',
      },
      {
        mId: '6',
        mName: '地质学',
      },
      {
        mId: '7',
        mName: '地理信息科学',
      },
      {
        mId: '8',
        mName: '城市地下空间工程',
      },
    ],
  },
  {
    cId: '3',
    cName: '机电工程学院',
    majors: [
      {
        mId: '9',
        mName: '机械工程',
      },
      {
        mId: '10',
        mName: '机械设计制造及其自动化',
      },
      {
        mId: '11',
        mName: '工业设计',
      },
      {
        mId: '12',
        mName: '过程装备与控制工程',
      },
      {
        mId: '13',
        mName: '测控技术与仪器',
      },
    ],
  },
  {
    cId: '4',
    cName: '化学化工学院',
    majors: [
      {
        mId: '14',
        mName: '化学工程与工艺',
      },
      {
        mId: '15',
        mName: '应用化学',
      },
      {
        mId: '16',
        mName: '环境工程',
      },
      {
        mId: '17',
        mName: '安全工程',
      },
      {
        mId: '18',
        mName: '化学',
      },
    ],
  },
  {
    cId: '5',
    cName: '材料科学与工程学院',
    majors: [
      {
        mId: '19',
        mName: '高分子材料与工程',
      },
      {
        mId: '20',
        mName: '材料科学与工程',
      },
      {
        mId: '21',
        mName: '新能源材料与器件',
      },
      {
        mId: '22',
        mName: '材料成型及控制工程',
      },
      {
        mId: '23',
        mName: '新能源科学与工程',
      },
    ],
  },
  {
    cId: '6',
    cName: '计算机科学学院',
    majors: [
      {
        mId: '24',
        mName: '计算机科学与技术',
      },
      {
        mId: '25',
        mName: '软件工程',
      },
      {
        mId: '26',
        mName: '网络工程',
      },
      {
        mId: '27',
        mName: '物联网工程',
      },
      {
        mId: '28',
        mName: '数据科学与大数据技术',
      },
      {
        mId: '29',
        mName: '网络空间安全',
      },
    ],
  },
  {
    cId: '7',
    cName: '电气信息学院',
    majors: [
      {
        mId: '30',
        mName: '自动化',
      },
      {
        mId: '31',
        mName: '电子信息工程',
      },
      {
        mId: '32',
        mName: '电气工程及其自动化',
      },
      {
        mId: '33',
        mName: '通信工程',
      },
    ],
  },
  {
    cId: '8',
    cName: '土木工程与建筑学院',
    majors: [
      {
        mId: '34',
        mName: '土木工程',
      },
      {
        mId: '35',
        mName: '建筑环境与能源应用工程',
      },
      {
        mId: '36',
        mName: '测绘工程',
      },
      {
        mId: '37',
        mName: '工程管理',
      },
    ],
  },
  {
    cId: '9',
    cName: '理学院',
    majors: [
      {
        mId: '38',
        mName: '信息与计算科学',
      },
      {
        mId: '39',
        mName: '电子信息科学与技术',
      },
    ],
  },
  {
    cId: '10',
    cName: '经济管理学院',
    majors: [
      {
        mId: '40',
        mName: '工商管理',
      },
      {
        mId: '41',
        mName: '市场营销',
      },
      {
        mId: '42',
        mName: '经济学',
      },
      {
        mId: '43',
        mName: '电子商务',
      },
      {
        mId: '45',
        mName: '会计学',
      },
      {
        mId: '46',
        mName: '公共事业管理',
      },
    ],
  },
  {
    cId: '11',
    cName: '法学院',
    majors: [
      {
        mId: '47',
        mName: '社会工作',
      },
      {
        mId: '48',
        mName: '法学',
      },
    ],
  },
  {
    cId: '12',
    cName: '外国语学院',
    majors: [
      {
        mId: '49',
        mName: '英语',
      },
      {
        mId: '50',
        mName: '俄语',
      },
    ],
  },
  {
    cId: '13',
    cName: '体育学院',
    majors: [
      {
        mId: '51',
        mName: '体育教育',
      },
    ],
  },
  {
    cId: '14',
    cName: '艺术学院',
    majors: [
      {
        mId: '52',
        mName: '表演',
      },
      {
        mId: '53',
        mName: '播音与主持艺术',
      },
      {
        mId: '54',
        mName: '广播电视编导',
      },
    ],
  },
];
export const major = majorCollege.reduce((cur, pre) => {
  return cur.concat(pre.majors);
}, []);
export const collegeTimeLimit = {
  '0': '申报时间限制',
  '1': '学生申请加入项目时间限制',
  '2': '审批学生申请时间限制',
  '3': '实验室审核时间限制',
  '4': '重点项目申报时间限制',
  '5': '指导老师重点项目审核时间限制',
  '6': '实验室重点项目审核时间限制',
  '7': '实验室上报时间限制',
  '8': '二级单位审核时间限制',
  '20': '二级单位上报时间限制',
};
export const applyModel = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv='Content-Type' content="text/html; charset=utf-8"/>
    <meta name='ProgId' content='Word.Document'/>
    <meta name='Generator' content="Microsoft Word 15"/>
    <meta name='Originator' content="Microsoft Word 15"/>
    <link rel='File-List' href="附件一.files/filelist.xml"/>
    <title>附件一</title>
    <link rel='themeData' href="附件一.files/themedata.thmx"/>
    <link rel='colorSchemeMapping' href="附件一.files/colorschememapping.xml"/>
    <style>
        table {
            border-collapse: collapse;
        }
        table,
        th,
        td {
            border: 1px solid black;
			    text-align:center;
        }
        table {
          border-collapse: collapse;
          table-layout: fixed;
          word-break:break-all;
          font-size: 10px;
          width: 100%;
          text-align: center;
      }
      td {
        word-break:break-all;
        word-wrap : break-word;
      }

        @page {
			size:210mm 297mm;//纸张大小A4
			margin: 0.25in;
			-fs-flow-bottom: "footer";
			-fs-flow-left: "left";
			-fs-flow-right: "right";
			border: thin solid black;
			padding: 1em;
			}
			#footer {
			font-size: 90%; font-style: italic;
			position: absolute; top: 0; left: 0;
			-fs-move-to-flow: "footer";
			}
			#pagenumber:before {
			content: counter(page);
			}
			#pagecount:before {content: counter(pages);
			}
		p,span,td,tr,table{
			word-break:break-all;
			word-wrap : break-word;
		}
	</style>
   </head>
<body class="bg-white pb-3" lang='ZH-CN' link="#002551" vlink="#954F72" style='tab-interval:21.0pt; font-family: SimSun;text-justify-trim:punctuation'>
<div style="max-width:600px;margin:0 auto;padding:10px;">
	<div class='WordSection1' style='layout-grid:15.6pt;margin-bottom:250px'>
    <p class='MsoNormal'><span lang='EN-US' style='font-size:14.0pt;mso-bidi-font-size:  12.0pt;'><span
            style='mso-spacerun:yes'>  </span></span><span
            style='font-size:14.0pt;mso-bidi-font-size:12.0pt;  '>编号：<span lang='EN-US'><span
            style='mso-spacerun:yes'>  </span></span></span>
    </p>
    <p class='MsoNormal'><span lang='EN-US'></span></p>
    <p class='MsoNormal' align='center' style='text-align:center'><span
            style='font-size:22.0pt;mso-bidi-font-size:12.0pt;mso-hansi-font-family:  "Times New Roman";letter-spacing:1.0pt;mso-bidi-font-weight:bold'>西南石油大学<span
            lang='EN-US'></span></span></p>
    <p class='MsoNormal' align='center' style='text-align:center'><span
            style='font-size:22.0pt;mso-bidi-font-size:12.0pt;mso-hansi-font-family:  "Times New Roman";letter-spacing:1.0pt;mso-bidi-font-weight:bold'>课外开放实验校级重点项目申请书<span
            lang='EN-US'></span></span></p>
    <p class='MsoNormal' align='center' style='text-align:center'><span lang='EN-US'
                                                                    style='font-size:22.0pt;mso-bidi-font-size:12.0pt;;  letter-spacing:1.0pt;mso-bidi-font-weight:bold'></span>
    </p>
    <p class='MsoNormal' align='center' style='text-align:center'><span lang='EN-US'></span></p>
    <p class='MsoNormal' align='center' style='text-align:center'><span lang='EN-US'></span></p>
    <p class='MsoNormal'><span lang='EN-US' style='font-size:15.0pt;'></span></p>
    <p class='MsoNormal' style='margin-left:42.0pt;text-indent:5em;line-height:  150%'><span
            style='text-indent:5em;font-size:14.0pt;line-height:150%;mso-ascii-font-family:  "Times New Roman";mso-hansi-font-family:"Times New Roman"'>项目名称：</span><span
            lang='EN-US' style='font-size:14.0pt;line-height:150%;'> <%=projectName%></span>
    </p>
    <p class='MsoNormal' style='text-indent:5em;margin-left:42.0pt;line-height:  150%'><span
            style='font-size:14.0pt;line-height:150%;mso-ascii-font-family:  "Times New Roman";mso-hansi-font-family:"Times New Roman"'>项目类型：</span><span
            lang='EN-US' style='font-size:14.0pt;line-height:150%;'> <%=projectType%></span></p>
    <p class='MsoNormal' style='text-indent:5em;margin-left:42.0pt;line-height:  150%'><span
            style='font-size:14.0pt;line-height:150%;mso-ascii-font-family:  "Times New Roman";mso-hansi-font-family:"Times New Roman"'>项目成员：</span><span
            lang='EN-US' style='font-size:14.0pt;line-height:150%;'> <%=students.map(item=>item.realName).join('、')%> </span></p>
    <p class='MsoNormal' style='text-indent:5em;margin-left:42.0pt;line-height:  150%'><span
            style='font-size:14.0pt;line-height:150%;mso-ascii-font-family:  "Times New Roman";mso-hansi-font-family:"Times New Roman"'>专业年级：</span><span
            lang='EN-US' style='font-size:14.0pt;line-height:150%;'> <%=major%> <%=grade%> </span></p>
    <p class='MsoNormal' style='text-indent:5em;margin-left:42.0pt;line-height:  150%'><span
            style='font-size:14.0pt;line-height:150%;mso-ascii-font-family:  "Times New Roman";mso-hansi-font-family:"Times New Roman"'>指导教师：</span><span
            lang='EN-US' style='font-size:14.0pt;line-height:150%;'> <%=teachers.map(item=>item.realName).join('、')%></span></p>
    <p class='MsoNormal' style='text-indent:5em;margin-left:42.0pt;line-height:  150%'><span
            style='font-size:14.0pt;line-height:150%;mso-ascii-font-family:  "Times New Roman";mso-hansi-font-family:"Times New Roman"'>推荐单位：</span><span
            lang='EN-US' style='font-size:14.0pt;line-height:150%;'><%=belongCollege%><td></td></span>
    </p>
    <p class='MsoNormal'><span lang='EN-US' style='font-size:14.0pt;mso-bidi-font-size:  12.0pt'></span>
    </p>
    <p class='MsoNormal'><span lang='EN-US' style='font-size:14.0pt;mso-bidi-font-size:  12.0pt'></span>
    </p>
    <p class='MsoNormal'><span lang='EN-US' style='font-size:14.0pt;mso-bidi-font-size:  12.0pt'></span>
    </p>
    <p class='MsoNormal'><span lang='EN-US'></span></p>
    <p class='MsoNormal'><span lang='EN-US'></span></p>
    <p class='MsoNormal'><span lang='EN-US'></span></p>
    <p class='MsoNormal'><span lang='EN-US'></span></p>
    <p class='MsoNormal'><span lang='EN-US'></span></p>
    <p class='MsoNormal'><span lang='EN-US'></span></p>
    <p class='MsoNormal'><span lang='EN-US'></span></p>
    <p class='MsoNormal' align='center' style='text-align:center'><b style='mso-bidi-font-weight:  normal'><span
            style='font-size:14.0pt;font-family:宋体;mso-ascii-font-family:  "Times New Roman";mso-hansi-font-family:"Times New Roman"'>年</span></b><b
            style='mso-bidi-font-weight:normal'><span lang='EN-US' style='font-size:14.0pt'><span
            style='mso-spacerun:yes'> </span></span></b><b style='mso-bidi-font-weight:  normal'><span
            style='font-size:14.0pt;font-family:宋体;mso-ascii-font-family:  "Times New Roman";mso-hansi-font-family:"Times New Roman"'>月</span></b><b
            style='mso-bidi-font-weight:normal'><span lang='EN-US' style='font-size:14.0pt'><span
            style='mso-spacerun:yes'> </span></span></b><b style='mso-bidi-font-weight:  normal'><span
            style='font-size:14.0pt;font-family:宋体;mso-ascii-font-family:  "Times New Roman";mso-hansi-font-family:"Times New Roman"'>日</span></b><b
            style='mso-bidi-font-weight:normal'><span lang='EN-US' style='font-size:14.0pt'></span></b></p>
</div>
<span lang='EN-US'
      style='font-size:15.0pt;line-height:200%;  ;mso-bidi-font-family:"Times New Roman";mso-font-kerning:  1.0pt;mso-ansi-language:EN-US;mso-fareast-language:ZH-CN;mso-bidi-language:  AR-SA'><br
        clear='all' style='page-break-before:always;mso-break-type:section-break'/>  </span>
<div class='WordSection2' style='layout-grid:15.6pt;margin-bottom:220px'>
    <p class='MsoNormal' align='center' style='text-align:center'><span
            style='font-size:12.0pt;'>填 写 说 明<span lang='EN-US'></span></span>
    </p>
    <p class='MsoNormal' style='text-indent:24.0pt;mso-char-indent-count:2.0;  line-height:150%'><span lang='EN-US'
                                                                                                     style='font-size:12.0pt;line-height:150%;  '>1</span><span
            style='font-size:  12.0pt;line-height:150%;'>、请认真阅读《西南石油大学大学生课外开放实验管理办法》（西南石大设［<span
            lang='EN-US'>2015</span>］<span lang='EN-US'>13</span>号）及有关申报通知要求，按规定填写；<span lang='EN-US'></span></span>
    </p>
    <p class='MsoNormal' style='text-indent:24.0pt;mso-char-indent-count:2.0;  line-height:150%'><span lang='EN-US'
                                                                                                     style='font-size:12.0pt;line-height:150%;  '>2</span><span
            style='font-size:  12.0pt;line-height:150%;'>、所填各项内容要求科学严谨、实事求是、表述清楚、简明扼要、层次分明，尽量列出小标题并加黑；<span
            lang='EN-US'></span></span></p>
    <p class='MsoNormal' style='text-indent:24.0pt;mso-char-indent-count:2.0;  line-height:150%;mso-outline-level:1'><span
            lang='EN-US'
            style='font-size:12.0pt;  line-height:150%;'>3</span><span
            style='font-size:12.0pt;line-height:150%;mso-hansi-font-family:  宋体'>、正文部分用宋体或仿宋小<span
            lang='EN-US'>4</span>号字填写；<span lang='EN-US'></span></span></p>
    <p class='MsoNormal'
       style='text-indent:24.0pt;mso-char-indent-count:2.0;  line-height:150%;mso-pagination:widow-orphan'><span
            lang='EN-US'
            style='font-size:12.0pt;line-height:150%;mso-hansi-font-family:  宋体'>4</span><span
            style='font-size:12.0pt;line-height:150%;  '>、项目类型是指</span><span
            style='font-size:12.0pt;  line-height:150%;mso-bidi-font-weight:bold'>：科研、科技活动、自选课题、计算机应用、人文素质</span><span
            style='font-size:12.0pt;line-height:150%;font-family:仿宋_GB2312'>之一；</span><span lang='EN-US'
                                                                                            style='font-size:12.0pt;line-height:150%;  '></span>
    </p>
    <p class='MsoNormal'
       style='text-indent:24.0pt;mso-char-indent-count:2.0;  line-height:150%;mso-pagination:widow-orphan'><span
            lang='EN-US'
            style='font-size:12.0pt;line-height:150%;mso-hansi-font-family:  宋体'>5</span><span
            style='font-size:12.0pt;line-height:150%;  '>、</span><span
            style='font-size:12.0pt;line-height:  150%;;mso-bidi-font-family:宋体'>推荐意见须由实验项目所属二级单位填写，并就“申请书真实性”、“学术水平”、“项目可行性”及“支撑条件”等签署具体意见。</span><span
            lang='EN-US' style='font-size:12.0pt;line-height:150%;  '></span>
    </p>
    <p class='MsoNormal'
       style='text-indent:24.0pt;mso-char-indent-count:2.0;  line-height:150%;mso-pagination:widow-orphan'><span
            lang='EN-US'
            style='font-size:12.0pt;line-height:150%;mso-hansi-font-family:  宋体'>6</span><span
            style='font-size:12.0pt;line-height:150%;  '>、本申请书统一用<span
            lang='EN-US'>A4</span>普通复印纸套印成册，一式一份交设备与实验室管理处，随附电子版文档。<span lang='EN-US'></span></span></p>
    <p class='MsoNormal' style='text-indent:24.0pt;mso-char-indent-count:2.0;  line-height:150%'><span lang='EN-US'
                                                                                                     style='font-size:12.0pt;line-height:150%;  font-family:宋体;mso-hansi-font-family:"Times New Roman"'></span>
    </p>
    <p class='MsoNormal' align='center'
       style='text-align:center;text-indent:24.0pt;  mso-char-indent-count:2.0;line-height:150%'><span
            style='font-size:12.0pt;  line-height:150%;'>结题验收时将提交的材料：<span
            lang='EN-US'></span></span></p>
    <p class='MsoNormal' style='text-indent:24.0pt;mso-char-indent-count:2.0;  line-height:150%'><span lang='EN-US'
                                                                                                     style='font-size:12.0pt;line-height:150%;  '>1.<a
            href="http://sbgl.swpu.edu.cn/eWebEditor_051012/web_up_file/20101012052154831.doc" target="_blank"><span
            lang='EN-US' style='color:windowtext'><span lang='EN-US'>课外开放实验校级重点项目结题报告</span></span></a></span><span
            style='font-size:12.0pt;line-height:150%;mso-hansi-font-family:  宋体'>（书面一式一份和电子版）；<span
            lang='EN-US'></span></span></p>
    <p class='MsoNormal'
       style='text-indent:24.0pt;mso-char-indent-count:2.0;  line-height:150%;mso-outline-level:1;tab-stops:314.25pt'>
        <span lang='EN-US'
              style='font-size:12.0pt;line-height:150%;mso-hansi-font-family:  宋体'>2.</span><span
            style='font-size:12.0pt;line-height:150%;  '>项目实验报告（书面一式一份和电子版）<span
            lang='EN-US'></span></span></p>
    <p class='MsoNormal' style='text-indent:24.0pt;mso-char-indent-count:2.0;  line-height:150%'><span lang='EN-US'
                                                                                                     style='font-size:12.0pt;line-height:150%;  '>3.</span><span
            style='font-size:12.0pt;line-height:150%;mso-hansi-font-family:  宋体'>实验过程三幅照片（大于，至少一张有学生在内）原文件及图片说明，软件源程序；<span lang='EN-US'></span></span></p>
    <p class='MsoNormal' style='text-indent:24.0pt;mso-char-indent-count:2.0;  line-height:150%'><span lang='EN-US'
                                                                                                     style='font-size:12.0pt;line-height:150%;  '>4.</span><span
            style='font-size:12.0pt;line-height:150%;mso-hansi-font-family:  宋体'>源于开放实验的标志性成果影印件电子文档，或证明材料。<span
            lang='EN-US'></span></span></p>
    <p class='MsoNormal' style='text-indent:24.0pt;mso-char-indent-count:2.0;  line-height:150%'><span lang='EN-US'
                                                                                                     style='font-size:12.0pt;line-height:150%;  '></span>
    </p>
    <p class='MsoNormal'><span lang='EN-US'
                             style='mso-bidi-font-size:14.0pt;  font-family:宋体;mso-hansi-font-family:"Times New Roman"'></span>
    </p>
    <p class='MsoNormal'><span lang='EN-US'
                             style='mso-bidi-font-size:14.0pt;  font-family:宋体;mso-hansi-font-family:"Times New Roman"'></span>
    </p>
    <p class='MsoNormal'><span lang='EN-US'
                             style='mso-bidi-font-size:14.0pt;  font-family:宋体;mso-hansi-font-family:"Times New Roman"'></span>
    </p>
    <p class='MsoNormal'><span lang='EN-US'
                             style='mso-bidi-font-size:14.0pt;  font-family:宋体;mso-hansi-font-family:"Times New Roman"'></span>
    </p>
    <p class='MsoNormal'><span lang='EN-US'
                             style='mso-bidi-font-size:14.0pt;  font-family:宋体;mso-hansi-font-family:"Times New Roman"'></span>
    </p>
</div>
<span lang='EN-US'
      style='font-size:10.5pt;mso-bidi-font-size:14.0pt;font-family:  宋体;mso-hansi-font-family:"Times New Roman";mso-bidi-font-family:"Times New Roman";  mso-font-kerning:1.0pt;mso-ansi-language:EN-US;mso-fareast-language:ZH-CN;  mso-bidi-language:AR-SA'><br
        clear='all' style='page-break-before:always;  mso-break-type:section-break'/>  </span>
<div class='WordSection3' style='layout-grid:15.6pt'>
    <p class='MsoNormal'><b style='mso-bidi-font-weight:normal'><span
            style='font-size:14.0pt;font-family:宋体'>一、项目基本信息</span></b><b style='mso-bidi-font-weight:  normal'><span
            lang='EN-US' style='font-size:14.0pt;font-family:宋体;mso-hansi-font-family:  "Times New Roman"'></span></b>
    </p>
	<div>
		  <table  border="0" cellspacing="0" cellpadding="0" align="center">
    <tr>
    <td colspan="8">
      <p><span>项目名称：<%=projectName%></span></p>
    </td>
    </tr>
    <tr>
      <td colspan="8">
        <p><span>项目类型：重点</span></p>
      </td>
    </tr>
    <tr>
      <td width="20" style="width: 20;" rowspan="<%=students.length+1%>">
        <p><span>项目成员</span>
        </p>
      </td>
      <td>
        <p><span>姓名</span>
        </p>
      </td>
      <td>
        <p><span>性别</span>
        </p>
      </td>
      <td>
        <p><span>专业年级</span>
        </p>
      </td>
      <td>
        <p><span>学号</span>
        </p>
      </td>
      <td>
        <p><span>联系电话</span>
        </p>
      </td>
      <td>
        <p><span>QQ</span><span>号</span>
        </p>
      </td>
      <td>
        <p><span>个人签名</span>
        </p>
      </td>
    </tr>
	<%for(var i = 0;i<students.length;i++){%>
    <tr>
      <td>
        <p><span><%=students[i].realName||''%></span>
        </p>
      </td>
      <td>
        <p><span><%=students[i].sex||''%></span>
        </p>
      </td>
      <td>
        <p><span><%=MAJOR[students[i].major-1].mName%><%=students[i].grade+'级'%></span>
        </p>
      </td>
      <td>
        <p><span><%=students[i].code||''%></span>
        </p>
      </td>
      <td>
        <p><span><%=students[i].mobilePhone||''%></span>
        </p>
      </td>
      <td>
        <p><span><%=students[i].qqNum||''%></span>
        </p>
      </td>
      <td>
        <p><span></span>
        </p>
      </td>
    </tr>
	<%}%>
    <tr>
      <td width="20" style="width: 20pt;" rowspan="2">
        <p><span>项目成员简介</span>
        </p>
      </td>
      <td colspan="7">
        <p><span>项目组长简介 ：<%=membersInfo.leader%> </span></p>
      </td>
    </tr>
    <tr>
      <td colspan="7">
        <p><span>其他成员简介(在项目中的分工及工作)：<%=membersInfo.members%></span></p>
        <p><span></span>
        </p>
        <p><span></span>
        </p>
        <p><span></span>
        </p>
      </td>
    </tr>
    <tr>
      <td width="20" style="width: 20pt;" rowspan="<%=teachers.length+1%>">
        <p><span>指导教师<span></span></span>
        </p>
      </td>
      <td>
        <p><span>姓名<span></span></span>
        </p>
      </td>
      <td>
        <p><span>性别<span></span></span></p>
      </td>
      <td>
        <p><span>技术职称<span></span></span></p>
      </td>
      <td>
        <p><span>员工号<span></span></span>
        </p>
      </td>
      <td>
        <p><span>工作单位<span></span></span>
        </p>
      </td>
      <td>
        <p><span>联系电话<span></span></span>
        </p>
      </td>
      <td>
        <p><span>个人签名<span></span></span>
        </p>
      </td>

    </tr>
 <%for(var i=0;i<teachers.length;i++){%>
    <tr>
      <td>
        <p><span><%=teachers[i].realName||''%></span>
        </p>
      </td>
      <td>
        <p><span><%=teachers[i].sex||''%></span>
        </p>
      </td>
      <td>
        <p><span><%=teachers[i].technicalRole||''%></span>
        </p>
      </td>
      <td>
        <p><span><%=teachers[i].code||''%></span>
        </p>
      </td>
      <td>
        <p><span></span>
        </p>
      </td>
      <td>
        <p><span><%=teachers[i].mobilePhone||''%></span>
        </p>
      </td>
      <td>
        <p><span></span>
        </p>
      </td>
    </tr>
<%}%>
    <tr>
      <td colspan="2">
        <p><span>申请经费<span>(</span>元<span>)</span></span></p>
      </td>
      <td colspan="6">
        <p><span>2500</span>
        </p>
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <p><span>其中：</span><span>实验材料费<span></span></span></p>
      </td>
      <td>
        <p><span>资料、印刷费<span></span></span>
        </p>
      </td>
      <td colspan="2">
        <p><span>出版费等<span></span></span>
        </p>
      </td>
      <td>
        <p><span>教师酬金<span></span></span>
        </p>
      </td>
      <td colspan="2">
        <p><span>其他合理费用<span></span></span>
        </p>
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <p><span><%=budget.material%></span>
        </p>
      </td>
      <td>
        <p><span><%=budget.print%></span>
        </p>
      </td>
      <td colspan="2">
        <p><span><%=budget.publish%></span>
        </p>
      </td>
      <td>
        <p><span><%=budget.wages%></span>
        </p>
      </td>
      <td colspan="2">
        <p><span><%=budget.other%><span></span></span></p>
      </td>
    </tr>

  </table>

	</div>

    <p class='MsoNormal'><span lang='EN-US' style='font-size:12.0pt'></span></p>
</div>

</div>

</body>
</html>
`;
