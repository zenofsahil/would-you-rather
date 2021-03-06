import React from 'react';
import { Card, Avatar, Tabs, List, Divider } from 'antd';
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { UserOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

const StyledDivider = styled(Divider)`
    height: 10vh;
`

const StyledAvatar = (props) => {
    return (
        <div>
            <Avatar {...props} />
            <StyledDivider type="vertical" />
        </div>
    )
}

const { TabPane } = Tabs;

const Poll = (props) => {
    const { questions, answered_questions, unanswered_questions } = useSelector(
        state => {
            const authedUserID = state.authedUser
            const all_question_ids = Object.keys(state.questions)
            const answered_questions = Object.keys(state.users[authedUserID].answers).sort((a, b) =>
                state.questions[b].timestamp - state.questions[a].timestamp
            )
            const unanswered_questions = all_question_ids.filter(function (e) {
                return this.indexOf(e) < 0
            }, answered_questions).sort((a, b) =>
                state.questions[b].timestamp - state.questions[a].timestamp
            )

            return {
                questions: state.questions,
                answered_questions,
                unanswered_questions
            }
        }
    )

    return (
        <div>
            <Tabs type="card" size="default" centered={true}>
                <TabPane tab={"Unanswered Questions"} key={1}>
                    <QuestionList 
                        title={"Unanswered Questions"} 
                        questions={unanswered_questions.map((id) => (
                            questions[id]
                        ))}
                    />
                </TabPane>
                <TabPane tab={"Answered Questions"} key={2}>
                    <QuestionList 
                        title={"Answered Questions"} 
                        questions={answered_questions.map((id) => (
                            questions[id]
                        ))}
                    />
                </TabPane>
            </Tabs>
        </div>
    );

}

function QuestionList(props) {
    return (
      <div style={{ padding: '20px 20px' }}>
        <Card title={props.title} bordered={true}>
            <List 
                itemLayout="vertical"
                dataSource={props.questions}
                renderItem={(question) => (
                    <Question question={question}/>
                )}
            />
        </Card>
      </div>
    )
}

function Question(props) {
    const { user } = useSelector(state => ({
        user: state.users[props.question.author]
    }))
    return (
        <Link to={`/question/${props.question.id}`} >
            <List.Item style={{maxHeight: '140px', margin: '5px 5px'}}>
            <Card hoverable style={{ maxHeight: 'inherit'}}>
                <List.Item.Meta
                    avatar={<StyledAvatar size={80} icon={<UserOutlined />} src={`${user.avatarURL}`} />}
                    title={`${user.name} asks`}
                    description={`Would you rather ${props.question.optionOne.text} or ...`}
                />
            </Card>
            </List.Item>

        </Link>
    )
}

export default Poll