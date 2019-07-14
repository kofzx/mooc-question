import Taro, { Component } from '@tarojs/taro'
import { View, Input, Textarea, Button } from '@tarojs/components'
import Dialog from './dialog'
import './addquestion.less'

export default class AddQuestion extends Component {
    btnOK () {
        if (this.state.title && this.state.desc) {
            this.props.onReceiveQuestion && this.props.onReceiveQuestion(this.state);
        } else {
            Taro.showToast({
                title: '请输入标题或者描述',
                icon: 'none'
            });
        }
    }
    btnCancel () {
        this.props.onCloseQuestion && this.props.onCloseQuestion();
    }
    changeTitle (event) {
        this.setState({ title: event.target.value });
    }
    changeDesc (event) {
        this.setState({ desc: event.target.value });
    }
    render () {
        return (
            <Dialog>
                <View className='add-question'>
                    <View className='question-body'>
                        <Input 
                            className='question-title' 
                            placeholder='请输入您的问题标题'
                            focus
                            onInput={this.changeTitle.bind(this)} />
                        <Textarea 
                            className='question-desc' 
                            placeholder='请输入您的问题描述'
                            onInput={this.changeDesc.bind(this)} />
                        <View className='btn-group'>
                            <Button className='btn-questions ok' onClick={this.btnOK.bind(this)}>确定</Button>
                            <Button className='btn-questions cancel' onClick={this.btnCancel.bind(this)}>取消</Button>
                        </View>
                    </View>
                </View>
            </Dialog>
        )
    }
}