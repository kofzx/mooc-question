import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'
import './index.less'
import AddQuestion from './addquestion'
import Zan from '../../images/zan.png'
import Cai from '../../images/cai.png'

function setStorage(key, obj) {
  let str = obj;
  if (typeof obj == 'object') {
    str = JSON.stringify(obj);
  }
  Taro.setStorageSync(key, str);
}
function getStorage(key) {
  let str = Taro.getStorageSync(key);
  if (!str) {
    return [];
  }
  return JSON.parse(str);
}

let arr = getStorage('questions').map(item => {
  return {id: parseInt(Math.random() * 10000), ...item}
});
setStorage('questions', arr);

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  state = {
    showQuestionModal: false,  // 显示浮层
    questionList: getStorage('questions'),
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  addQuestion () {
    this.setState({ showQuestionModal: true });
  }
  closeQuestion () {
    this.setState({ showQuestionModal: false });
  }
  receiveQuestion (options) {
    let { questionList } = this.state;
    questionList.push(options);
    this.setState({ questionList }, () => {
      setStorage('questions', this.state.questionList);
    });
    this.closeQuestion();
  }
  addVote (item) {
    let {questionList} = this.state;
    if (item) {
      item.vote = item.vote ? item.vote + 1 : 1;
    }
    let newList = questionList.map(itemQuestion => {
      if (itemQuestion.id == item.id) {
        itemQuestion = {...item};
      }
      return itemQuestion;
    });
    this.setState({ questionList: newList }, () => {
      setStorage('questions', this.state.questionList);
    });
  }
  cutVote (item) {
    let {questionList} = this.state;
    if (item) {
      item.vote = item.vote ? (item.vote - 1) >= 0 ? (item.vote - 1) : 0 : 0;
    }
    let newList = questionList.map(itemQuestion => {
      if (itemQuestion.id == item.id) {
        itemQuestion = {...item};
      }
      return itemQuestion;
    });
    this.setState({ questionList: newList }, () => {
      setStorage('questions', this.state.questionList);
    });
  }

  render () {
    let { questionList, showQuestionModal } = this.state;
    let myList = questionList.sort((a, b) => a.vote - b.vote);
    return (
      <View className='index'>
        <View className='title'>Taro问答实例</View>
        <View className='question-list'>
          {
            myList.map((item, index) => {
              return (
                <View key={item.id} className='question'>
                  <View className='question-left'>
                    <View className='question-title'>{item.title}</View>
                    <View className='question-desc'>{item.desc}</View>
                  </View>
                  <View className='question-right'>
                    <Image className='img' src={Zan} onClick={this.addVote.bind(this, item)}></Image>
                    <Text>{item.vote ? item.vote : 0}</Text>
                    <Image className='img' src={Cai} onClick={this.cutVote.bind(this, item)}></Image>
                  </View>
                </View>
              ) 
            })
          }
        </View>
        {
          showQuestionModal ? 
          <AddQuestion 
            onReceiveQuestion={this.receiveQuestion.bind(this)} 
            onCloseQuestion={this.closeQuestion.bind(this)} />
          : null
        }
        <Button className='btn-question' onClick={this.addQuestion.bind(this)}>提问</Button>
      </View>
    )
  }
}
