import plugin from '../../lib/plugins/plugin.js'
import answers from './groupAcceptDatabase.js'

const groupid = 958840932 // 建议将其配置化

export class GroupJoinHandler extends plugin {
  constructor () {
    super({
      name: '加群申请处理',
      dsc: '自动处理加群申请，根据提供的答案',
      event: 'request.group.add',
      priority: 5000
    })
  }

  async accept (e) {
    if (e.group_id !== groupid) {
      return false // 忽略其他群组的请求
    }

    const answerPrefix = '问题：本应用Github仓库名是？\n' +
        '答案：'
    if (!e.comment.startsWith(answerPrefix)) {
      Bot.pickGroup(groupid).sendMsg(`用户 ${e.user_id} 的申请`)
      return false
    }

    const comment = e.comment.split(answerPrefix)[1]?.trim().toLowerCase()

    if (!comment) {
      Bot.pickGroup(groupid).sendMsg(`用户 ${e.user_id} 未回答入群问题`)
      return false
    }

    if (answers.includes(comment)) {
      Bot.pickGroup(groupid).sendMsg(`用户 ${e.user_id} 的答案正确，已自动批准。答案为：${comment}`)
      e.approve(true)
    } else {
      Bot.pickGroup(groupid).sendMsg(`用户 ${e.user_id} 提供的答案不正确：${comment}`)
      e.approve(false)
    }

    return false
  }
}
